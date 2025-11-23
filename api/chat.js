import { knowledge } from "./kb.js";

export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Chỉ hỗ trợ POST" }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await req.json();
    const userInput = (body.message || "").trim();
    const messages = body.messages || [];

    // 🧩 Kiểm tra knowledge import
    if (!Array.isArray(knowledge)) {
      console.error("❌ Không thể import kb.js hoặc knowledge không hợp lệ.");
      return new Response(
        JSON.stringify({ error: "Không đọc được dữ liệu Q&A (kb.js)" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const qnaPrompt = knowledge
      .map(x => `Hỏi: ${x.q}\nĐáp: ${x.a}`)
      .join("\n\n");

    messages.unshift({
      role: "system",
      content: `
      Bạn là Trợ lý Truyền Thông của Công ty Điện lực Vĩnh Long (PCVL).

      Quy tắc:
      1) Ưu tiên dùng dữ liệu trong bộ Q&A bên dưới.
      2) Nếu không thấy phù hợp, hãy trả lời nguyên văn:
      "Nội dung này nằm ngoài phạm vi tư vấn của Trợ lý Truyền thông.
      Vui lòng truy cập www.pcvinhlong.evnspc.vn hoặc gọi 19001006 – 19009000."

      Bộ Q&A:
      ${qnaPrompt}
      `
    });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Thiếu OPENAI_API_KEY trong môi trường" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages:
          messages.length > 0 ? messages : [{ role: "user", content: userInput }],
        temperature: 0.6,
        max_output_tokens: 500
      })
    });

    const data = await r.json();

    const reply =
      data?.output?.[0]?.content?.[0]?.text ||
      data?.choices?.[0]?.message?.content ||
      "Không nhận được phản hồi hợp lệ từ mô hình.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("❌ Lỗi server:", err);
    return new Response(
      JSON.stringify({ error: "Server error", detail: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
