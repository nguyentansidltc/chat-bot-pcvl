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
      Bạn là Trợ lý Truyền Thông của Điện lực PC Vĩnh Long.
      QUY TẮC TÍNH GIÁ ĐIỆN KHI NGƯỜI DÙNG YÊU CẦU TÍNH TIỀN:
      1) Luôn tính đúng theo bảng giá Q&A, không bịa số.
      2) Nếu người dùng yêu cầu tính tiền điện (ví dụ: “tính giá điện”, “tổng tiền”, “hết bao nhiêu”, “bao nhiêu tiền X kWh”, “tiền điện tháng này”, “tính cho tôi”), bạn phải thực hiện phép tính theo đúng bậc hoặc đúng nhóm giá.
      3) Phải tính tổng tiền *chưa VAT*.
      4) VAT = 8% × tiền trước VAT.
      5) Tổng cộng = tiền trước VAT + VAT.
      6) Khi trả lời, hiển thị:
        - Tiền trước VAT
        - VAT 8%
        - Tổng cộng sau VAT

      Nhiệm vụ:
      1) Phân tích ngữ nghĩa – không khớp từ khóa đơn thuần.
      2) Tìm Q&A phù hợp nhất (theo अर्थ nghĩa).
      3) Nếu thuộc nhóm giá điện → trả toàn nhóm.
      4) Nếu là Q&A riêng → trả đúng câu trả lời.
      5) Nếu ngoài dữ liệu → trả fallback.

      Quy tắc gom nhóm:
      1) Sinh hoạt – 6 bậc + công tơ thẻ
      2) Bán buôn nông thôn – 6 bậc + mục đích khác
      3) Khu tập thể (bên bán) – 6 bậc
      4) Khu tập thể (bên mua) – 6 bậc
      5) Khu tập thể – thị trấn (bên bán) – 6 bậc
      6) Khu tập thể – thị trấn (bên mua) – 6 bậc
      7) Khu công nghiệp – 15 mục
      8) Kinh doanh – 3 nhóm × 3 mức
      9) Sản xuất – 4 nhóm × 3 mức
      10) HCSN – 4 mục
      11) Tổ hợp TMDV–SH
      12) Điện chợ
      13) Nếu hỏi chung chung → trả toàn bộ bảng giá.

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
