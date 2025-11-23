// api/chat.js
import { knowledge } from "./kb.js";

export const config = {
  runtime: "edge",
};

// 🧠 Cache tạm (in-memory trong context Runtime)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // lưu 5 phút

// 👉 Hàm kiểm tra cache hợp lệ
function getFromCache(key) {
  const item = cache.get(key);
  if (item && Date.now() - item.time < CACHE_TTL) return item.value;
  cache.delete(key);
  return null;
}

export default async function handler(req) {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Chỉ hỗ trợ phương thức POST" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const userInput = (body.message || "").trim();
    const messages = body.messages || [];

    if (!userInput && messages.length === 0) {
      return new Response(JSON.stringify({ error: "Thiếu nội dung câu hỏi" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔍 Kiểm tra cache cục bộ
    const cached = getFromCache(userInput);
    if (cached) {
      return new Response(JSON.stringify({ reply: cached, source: "cache" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🧮 Tạo system prompt từ knowledge
    const qnaPrompt = knowledge
      .map(x => `Hỏi: ${x.q}\nĐáp: ${x.a}`)
      .join("\n\n");

    // System prompt
    messages.unshift({
      role: "system",
      content: `
      Bạn là Trợ lý Truyền Thông của Công ty Điện lực Vĩnh Long (PCVL).

      Quy tắc:
      1) Ưu tiên sử dụng dữ liệu trong bộ Q&A bên dưới để trả lời.
      2) Nếu không thấy phù hợp, hãy trả lời nguyên văn:
      "Nội dung này nằm ngoài phạm vi tư vấn của Trợ lý Truyền thông.
      Vui lòng truy cập www.pcvinhlong.evnspc.vn hoặc gọi 19001006 – 19009000."
      
      Bộ dữ liệu Q&A chính thức:
      ${qnaPrompt}
      `,
    });

    // 🔐 Lấy API Key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Thiếu khóa API: OPENAI_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🔥 Gọi OpenAI API
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages:
          messages.length > 0
            ? messages
            : [{ role: "user", content: userInput }],
        temperature: 0.6,
        max_output_tokens: 500,
      }),
    });

    const data = await response.json();

    // ✅ Lấy đoạn text trả lời
    const reply =
      data?.output?.[0]?.content?.[0]?.text ||
      data?.choices?.[0]?.message?.content ||
      "Không nhận được phản hồi hợp lệ từ mô hình.";

    // 💾 Lưu vào cache
    cache.set(userInput, { value: reply, time: Date.now() });

    return new Response(JSON.stringify({ reply, source: "AI" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Lỗi server:", err);
    return new Response(
      JSON.stringify({ error: "Lỗi máy chủ", detail: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
