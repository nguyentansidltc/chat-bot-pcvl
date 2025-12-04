import { knowledge } from "./kb.js";
export const config = { runtime: "edge" };

async function callOpenAI(input, model) {
  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      input,                // ⬅️ DÙNG input (KHÔNG dùng messages)
      temperature: 0.5,
      max_output_tokens: 600,
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
      Bộ Q&A.

      QUY TẮC ĐỊNH DẠNG BẮT BUỘC:
      1) LUÔN sử dụng văn bản thuần (plain text).
      2) KHÔNG dùng LaTeX, không dùng ký hiệu \\text, \\, \[ \], $, { }.
      3) KHÔNG dùng code block (\\\`\\\`\\\`).
      4) KHÔNG dùng markdown.

      Nhiệm vụ:
      1) Phân tích ngữ nghĩa – không khớp từ khóa đơn thuần.
      2) Tìm Q&A phù hợp nhất (theo nghĩa).
      3) Nếu thuộc nhóm tiết kiệm điện -> trả lời toàn nhóm.
      4) Nếu thuộc nhóm sử dụng điện hiệu quả -> trả lời toàn nhóm.
      5) Nếu thuộc nhóm sử dụng điện không lãng phí -> trả lời toàn nhóm.
      6) Nếu thuộc nhóm tiết kiệm điện mang lại lợi ích gì -> trả lời toàn nhóm.
      7) Nếu thuộc nhóm tiết kiệm điện trong trường học -> trả lời toàn nhóm.
      8) Nếu thuộc nhóm tiết kiệm điện trong gia đình -> trả lời toàn nhóm.
      9) Nếu thuộc nhóm tiết kiệm điện tại nơi làm việc -> trả lời toàn nhóm.
      10) Nếu thuộc nhóm tiết kiệm điện trong sinh hoạt cộng đồng -> trả lời toàn nhóm.
      11) Nếu thuộc nhóm các biện pháp sử dụng điện an toàn -> trả lời toàn nhóm.
      12) Nếu thuộc nhóm hành lang an toàn lưới điện cao áp -> trả lời toàn nhóm.
      13) Nếu thuộc nhóm các mức thu chi phí đóng/cắt điện -> trả lời toàn nhóm.
      14) Nếu là Q&A riêng → trả lời đúng câu trả lời.
      15) Nếu ngoài dữ liệu → trả fallback.

      Quy tắc gom nhóm:
      1) Tiết kiệm điện là gì.
      2) Làm cách nào để sử dụng điện tiết kiệm.
      3) Làm cách nào để sử dụng điện hiệu quả.
      4) Làm cách nào để sử dụng điện không lãng phí.
      5) Tiết kiệm điện mang lại lợi ích gì.
      6) Thực hiện tiết kiệm điện trong trường học.
      7) Thực hiện tiết kiệm điện trong gia đình.
      8) Thực hiện tiết kiệm điện tại nơi làm việc.
      9) Thực hiện tiết kiệm điện trong sinh hoạt cộng đồng.
      10) Các biện pháp sử dụng điện an toàn.
      11) Hành lang an toàn lưới điện cao áp là gì.
      12) Các hành vi vi phạm hành lang an toàn lưới điện cao áp.
      13) Các mức thu chi phí đóng/cắt điện.

      Danh sách Q&A:
      ${knowledge.map(x => `Hỏi: ${x.q}\nĐáp: ${x.a}`).join("\n\n")}
    `;

    // Build INPUT theo chuẩn mới
    const input = [
      { role: "system", content: systemPrompt },
      ...userMessages
    ];

    let response = await callOpenAI(input, "gpt-4o-mini");

    if (!response.ok && response.status === 429) {
      response = await callOpenAI(input, "gpt-4o");
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

    const reply =
      json?.output_text?.trim() ||
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
