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
Bạn là Trợ lý Truyền Thông của Công ty Điện lực Vĩnh Long (PCVL).
...
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
          ...userMessages
        ],
        temperature: 0.6,
        max_output_tokens: 500,
      }),
    });

    const data = await r.json();

    // ✅ Tạm thời trả nguyên phản hồi ra client để dễ debug
    return new Response(JSON.stringify({ raw: data }), {
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
