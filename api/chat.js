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
      Bộ Cơ Sở Dữ Liệu Q&A.

      QUY TẮC ĐỊNH DẠNG BẮT BUỘC:
      1) LUÔN sử dụng văn bản thuần (plain text).
      2) KHÔNG dùng LaTeX, không dùng ký hiệu \\\\text, \\\\, \[ \], $, { }.
      3) KHÔNG dùng code block (\\\`\\\`\\\`).
      4) KHÔNG dùng markdown.
      5) Khi tính tiền điện: chỉ ghi số và nội dung ở dạng text đơn giản.

      QUY TẮC TÍNH TIỀN THEO GIÁ ĐIỆN:
      1) Luôn tính đúng theo bảng giá Q&A, không bịa số.
      2) Đối với giá điện có nhiều bậc (tính tiền cho từng bậc, mỗi bậc hiển thị trên 1 dòng) = số kWh trong định mức từng bậc x với giá điện tương ứng của bậc đó.
      3) Phải tính tổng tiền trước VAT.
      4) VAT = 8% × tiền trước VAT.
      5) Tổng cộng = tiền trước VAT + VAT.
      6) Khi trả lời, hiển thị:
        - Tiền trước VAT
        - VAT 8%
        - Tổng cộng sau VAT

      Nhiệm vụ:
      1) Phân tích ngữ nghĩa – không khớp từ khóa đơn thuần.
      2) Tìm Q&A phù hợp nhất (theo nghĩa).
      3) Nếu thuộc nhóm Tiết kiệm điện (trong gia đình, tại nơi làm việc, trong sinh hoạt cộng đồng) -> trả lời toàn nhóm.
      4) Nếu thuộc nhóm sử dụng điện an toàn, hiệu quả -> trả lời toàn nhóm.
      5) Nếu thuộc nhóm hành lang an toàn lưới điện cao áp -> trả lời toàn nhóm.
      6) Nếu thuộc nhóm giá điện → trả lời toàn nhóm.
      7) Nếu là Q&A riêng → trả đúng câu trả lời.
      8) Nếu ngoài dữ liệu → trả fallback.

      Quy tắc gom nhóm:
      1) Tiết kiệm điện là gì.
      2) Tiết kiệm điện mang lại lợi ích gì.
      3) Tiết kiệm điện (trong gia đình, tại nơi làm việc, trong sinh hoạt cộng đồng).
      4) Sử dụng điện an toàn. hiệu quả, không lãng phí.
      5) Hành lang an toàn lưới điện cao áp.
      6) Giá bán lẻ điện cho sản xuất cấp điện áp từ 110 kV trở lên (giờ bình thường, giờ thấp điểm, giờ cao điểm).
      7) Giá bán lẻ điện cho sản xuất cấp điện áp từ 22 kV đến dưới 110 kV (giờ bình thường, giờ thấp điểm, giờ cao điểm).
      8) Giá bán lẻ điện cho sản xuất cấp điện áp từ 6 kV đến dưới 22 kV (giờ bình thường, giờ thấp điểm, giờ cao điểm).
      9) Giá bán lẻ điện cho sản xuất cấp điện áp dưới 6 kV (giờ bình thường, giờ thấp điểm, giờ cao điểm).
      10) Giá bán lẻ điện hành chính sự nghiệp cấp điện áp từ 6 kV trở lên (bệnh viện - trường phổ thông).
      11) Giá bán lẻ điện hành chính sự nghiệp cấp điện áp dưới 6 kV (bệnh viện - trường phổ thông).
      12) Giá bán lẻ điện hành chính sự nghiệp cấp điện áp từ 6 kV trở lên (chiếu sáng – sự nghiệp).
      13) Giá bán lẻ điện hành chính sự nghiệp cấp điện áp dưới 6 kV (chiếu sáng – sự nghiệp).
      14) Giá bán lẻ điện cho kinh doanh cấp điện áp từ 22 kV trở lên (giờ bình thường, giờ thấp điểm, giờ cao điểm).
      15) Giá bán lẻ điện cho kinh doanh cấp điện áp từ 6 kV đến dưới 22 kV (giờ bình thường, giờ thấp điểm, giờ cao điểm).
      16) Giá bán lẻ điện cho kinh doanh cấp điện áp dưới 6 kV (giờ bình thường, giờ thấp điểm, giờ cao điểm).
      17) Giá bán lẻ điện sinh hoạt – 6 bậc.
      18) Giá bán lẻ điện sinh hoạt dùng công tơ thẻ trả trước.
      19) Giá bán buôn điện nông thôn – 6 bậc + mục đích khác.
      20) Giá bán buôn điện khu tập thể - thành phố, thị xã (bên bán) – 6 bậc.
      21) Giá bán buôn điện khu tập thể - thành phố, thị xã (bên mua) – 6 bậc.
      22) Giá bán buôn điện khu tập thể - thành phố, thị xã (mục đích khác).
      23) Giá bán buôn điện khu tập thể - thị trấn, huyện lỵ (bên bán) – 6 bậc.
      24) Giá bán buôn điện khu tập thể - thị trấn, huyện lỵ (bên mua) – 6 bậc.
      25) Giá bán buôn điện khu tập thể - thị trấn, huyện lỵ (mục đích khác).
      26) Giá bán buôn điện cho tổ hợp thương mại, dịch vụ, sinh hoạt – 6 bậc.
      27) Giá bán buôn điện cho tổ hợp mục đích khác (giờ bình thường, giờ thấp điểm, giờ cao điểm).
      28) Giá bán buôn điện cho khu công nghiệp (thanh cái 110 kV) MBA lớn hơn 100 MVA (giờ bình thường, giờ thấp điểm, giờ cao điểm).
      29) Giá bán buôn điện cho khu công nghiệp (thanh cái 110 kV) MBA từ 50 MVA đến 100 MVA (giờ bình thường, giờ thấp điểm, giờ cao điểm).
      30) Giá bán buôn điện cho khu công nghiệp (thanh cái 110 kV) MBA dưới 50 MVA (giờ bình thường, giờ thấp điểm, giờ cao điểm).
      31) Giá bán buôn điện cho khu công nghiệp (trung áp) cấp điện áp từ 22 kV đến dưới 110 kV (giờ bình thường, giờ thấp điểm, giờ cao điểm).
      32) Giá bán buôn điện cho khu công nghiệp (trung áp) cấp điện áp từ 6 kV đến dưới 22 kV (giờ bình thường, giờ thấp điểm, giờ cao điểm).
      33) Giá bán buôn điện cho chợ.
      34) Nếu hỏi chung chung → trả toàn bộ bảng giá.

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
