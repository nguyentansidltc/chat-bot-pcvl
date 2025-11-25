import { knowledge } from "./kb.js";
export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    // Chỉ cho phép POST
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

    // Gọi OpenAI responses API
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

    // Nếu máy chủ OpenAI trả lỗi HTTP (401, 429, 500,...)
    if (!r.ok) {
      const errorText = await r.text();
      return new Response(
        JSON.stringify({
          error: `Lỗi từ OpenAI API (HTTP ${r.status})`,
          detail: errorText.slice(0, 400),
        }),
        { status: r.status, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse kết quả JSON từ OpenAI
    const json = await r.json();

    // Lấy nội dung text phản hồi (format của GPT Responses API)
    const reply =
      json?.output?.[0]?.content?.[0]?.text?.trim() ||
      "Không nhận được phản hồi từ mô hình.";

    // Trả đúng format frontend mong đợi
    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    // Fallback debug lỗi không mong muốn (lỗi JSON, mạng…)
    return new Response(
      JSON.stringify({
        error: "Server error",
        detail: err.message,
        stack: err.stack?.split("\n").slice(0, 2).join(" ↩ "),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
