import { knowledge } from "./kb.js";

export const config = {
  runtime: "edge", // Bắt buộc dùng Edge để không lỗi
};

export default async function handler(req) {
  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Chỉ hỗ trợ POST" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    // ⭐ LẤY JSON ĐÚNG CÁCH TRONG EDGE RUNTIME
    const body = await req.json();
    const messages = body.messages || [];

    // Thêm system prompt + Q&A
    messages.unshift({
      role: "system",
      content: `
      Trợ lý Truyền Thông PCVL.

      Quy tắc:
      1) Ưu tiên dùng dữ liệu từ bộ Q&A.
      2) Nếu không có trong Q&A → trả lời:
      "Nội dung này nằm ngoài phạm vi tư vấn của Trợ lý Truyền thông.
      Vui lòng truy cập www.pcvinhlong.evnspc.vn hoặc gọi 19001006 – 19009000."
      
      Dữ liệu Q&A:
      ${knowledge.map(x => `Hỏi: ${x.q}\nĐáp: ${x.a}`).join("\n\n")}
      `
    });

    // Lấy KEY
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Thiếu OPENAI_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // ⭐ OPENAI RESPONSES API — CHUẨN CHO GPT-4O-MINI
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages
      }),
    });

    const data = await r.json();

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Server error",
        detail: err.message
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
