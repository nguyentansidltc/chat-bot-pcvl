import { knowledge } from "./kb.js";
export const config = { runtime: "edge" };

async function callOpenAI(messages, model) {
  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      input: messages, // dùng đúng dạng array message
      temperature: 0.6,
      max_output_tokens: 500,
    }),
  });
  return r;
}

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

    const allMessages = [
      { role: "system", content: systemPrompt },
      ...userMessages
    ];

    let response = await callOpenAI(allMessages, "gpt-4o-mini");

    // fallback nếu bị limit
    if (!response.ok && response.status === 429) {
      response = await callOpenAI(allMessages, "gpt-3.5-turbo");
    }

    if (!response.ok) {
      const errText = await response.text();
      return new Response(
        JSON.stringify({
          error: `Lỗi từ OpenAI API (HTTP ${response.status})`,
          detail: errText.slice(0, 400),
        }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const json = await response.json();

    // ĐÚNG STRUCTURE CỦA RESPONSES API
    const reply =
      json?.output?.[0]?.content?.[0]?.text?.trim() ||
      "Không nhận được phản hồi từ mô hình.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Server error",
        detail: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
