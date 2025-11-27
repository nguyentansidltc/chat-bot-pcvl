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
      messages: messages, // ⬅️ SỬA ĐÚNG CHUẨN
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

    // ========================= SYSTEM PROMPT =========================
    const systemPrompt = `
      Bạn là Trợ lý Truyền Thông của Điện lực PC Vĩnh Long.

      Nhiệm vụ chính:
      1) Phân tích ngữ nghĩa câu hỏi người dùng, không so khớp từ khóa đơn thuần.
      2) Tìm câu Q&A trong danh sách có ý nghĩa gần nhất.
      3) Nếu câu hỏi thuộc một “nhóm giá điện”, áp dụng quy tắc gom nhóm để trả về toàn bộ các mức giá trong nhóm.
      4) Nếu câu hỏi khớp với một câu Q&A riêng lẻ, trả về chính xác nội dung "Đáp".
      5) Nếu câu hỏi ngoài toàn bộ phạm vi dữ liệu → trả fallback:
        “Nội dung này nằm ngoài phạm vi tư vấn. 
          Vui lòng truy cập www.pcvinhlong.evnspc.vn hoặc gọi 19001006 – 19009000.”

      Quy tắc bắt buộc:
      - Không được bịa nội dung ngoài danh sách Q&A.
      - Trả lời ngắn gọn, đúng dữ liệu.
      - Nếu người dùng hỏi chung chung (“giá sinh hoạt mấy bậc”, “giá điện nông thôn”, “giá khu công nghiệp”…), phải kích hoạt chế độ gom nhóm.

      =====================================================================
      QUY TẮC GOM NHÓM GIÁ ĐIỆN
      =====================================================================

      1) SINH HOẠT → 6 bậc + công tơ thẻ
      2) BÁN BUÔN NÔNG THÔN → 6 bậc + mục đích khác
      3) KHU TẬP THỂ (bên bán đầu tư) → 6 bậc
      4) KHU TẬP THỂ (bên mua đầu tư) → 6 bậc
      5) KHU TẬP THỂ – THỊ TRẤN (bên bán) → 6 bậc
      6) KHU TẬP THỂ – THỊ TRẤN (bên mua) → 6 bậc
      7) KHU CÔNG NGHIỆP → 15 mục (5 nhóm × 3 mức)
      8) KINH DOANH → 3 nhóm × 3 mức
      9) SẢN XUẤT → 4 nhóm × 3 mức
      10) HÀNH CHÍNH – SỰ NGHIỆP → 4 mục
      11) TỔ HỢP TMDV-SH → 6 bậc sinh hoạt + 3 mức khác
      12) ĐIỆN CHỢ → 1 mục
      13) Nếu hỏi “bảng giá điện / toàn bộ giá điện” → trả toàn bộ các nhóm giá.

      =====================================================================
      DANH SÁCH Q&A CHÍNH THỨC
      (Không được sửa nội dung, không được bịa thêm)
      =====================================================================

      ${knowledge.map(x => `Hỏi: ${x.q}\nĐáp: ${x.a}`).join("\n\n")}

      =====================================================================
      Nguyên tắc cuối:
      - Nếu thuộc nhóm → trả nhóm.
      - Không thuộc nhóm → trả đúng Q&A tương ứng.
      - Không có dữ liệu → trả fallback chuẩn.
    `;

    // ================================================================
    const allMessages = [
      { role: "system", content: systemPrompt },
      ...userMessages,
    ];

    let response = await callOpenAI(allMessages, "gpt-4o-mini");

    // Fallback nếu bị hạn mức
    if (!response.ok && response.status === 429) {
      response = await callOpenAI(allMessages, "gpt-4o"); // fallback mới
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

    // 🟢 Ưu tiên output_text vì Responses API luôn có
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
