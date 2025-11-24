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

    const systemPrompt = `
      Quy tắc:
      1) Ưu tiên dùng dữ liệu trong bộ Q&A.
      2) Nếu không có câu trả lời phù hợp, hãy phản hồi:
      "Nội dung này nằm ngoài phạm vi tư vấn của Trợ lý Truyền thông.
      Vui lòng truy cập www.pcvinhlong.evnspc.vn hoặc gọi 19001006 – 19009000."
      Dữ liệu Q&A:
      ${knowledge.map(x => `Hỏi: ${x.q}\nĐáp: ${x.a}`).join("\n\n")}
      `;

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          { role: "system", content: systemPrompt },
          ...userMessages,
        ],
        temperature: 0.6,
        max_output_tokens: 500,
      }),
    });

    // 🧩 Thay vì parse JSON luôn, ta đọc text để xem OpenAI trả về gì
    const text = await r.text();

    // In luôn text vào phản hồi để debug
    return new Response(JSON.stringify({ rawText: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error", detail: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
