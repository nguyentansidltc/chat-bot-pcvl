import { knowledge } from "./kb.js";

export default async function handler(req, res) {
  try {
    // Chỉ chấp nhận POST
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed",
        detail: "API chỉ chấp nhận POST"
      });
    }

    // Lấy body đúng chuẩn Vercel
    let body = req.body;
    if (!body) {
      const buffers = [];
      for await (const chunk of req) buffers.push(chunk);
      body = JSON.parse(Buffer.concat(buffers).toString() || "{}");
    }

    const messages = body.messages || [];

    // Đưa bộ Q&A vào SYSTEM
    messages.unshift({
      role: "system",
      content: `
      Trợ lý Truyền thông.

      Đây là danh sách Q&A nội bộ:

      ${knowledge.map(x => `Hỏi: ${x.q}\nĐáp: ${x.a}`).join("\n\n")}

      -----------------------------------------
      Quy tắc:
      1. Ưu tiên trả lời trong danh sách Q&A nội bộ trước.
      2. Nếu không tìm thấy nội dung phù hợp trong danh sách Q&A:
      Trả lời đúng mẫu sau:
      "Nội dung này nằm ngoài phạm vi tư vấn của Trợ lý Truyền thông.
      Vui lòng truy cập www.pcvinhlong.evnspc.vn hoặc gọi tổng đài 19001006 – 19009000 để được hỗ trợ thêm."
      `
    });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Thiếu OPENAI_API_KEY trong Environment"
      });
    }

    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages
      })
    });

    const data = await apiRes.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      detail: err.message
    });
  }
}
