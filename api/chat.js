import { knowledge } from "./kb.js";

export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Chỉ hỗ trợ POST" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const userMessages = body.messages || [];

    // 🧩 Tạo system prompt
    const systemPrompt = `
Bạn là Trợ lý Truyền Thông của Công ty Điện lực Vĩnh Long (PCVL).

Quy tắc:
1. Ưu tiên dùng dữ liệu trong bộ Q&A.
2. Nếu không có trong Q&A, hãy trả lời nguyên văn:
"Nội dung này nằm ngoài phạm vi tư vấn của Trợ lý Truyền thông.
Vui lòng truy cập www.pcvinhlong.evnspc.vn hoặc gọi 19001006 – 19009000."

Dữ liệu Q&A:
${knowledge.map(x => `Hỏi: ${x.q}\nĐáp: ${x.a}`).join("\n\n")}
`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...userMessages
    ];

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({
        error: "Thiếu OPENAI_API_KEY"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: messages,
        temperature: 0.6,
        max_output_tokens: 500
      }),
    });

    const data = await r.json();

    // ✅ Lấy nội dung text thật từ kết quả OpenAI
    const reply =
      data?.output?.[0]?.content?.[0]?.text ||
      data?.choices?.[0]?.message?.content ||
      "Không nhận được phản hồi hợp lệ từ mô hình.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Lỗi server:", err);
    return new Response(
      JSON.stringify({ error: "Server error", detail: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
