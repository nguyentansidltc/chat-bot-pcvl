import { knowledge } from "./kb.js";

export default async function handler(req, res) {
  try {
    // Chỉ chấp nhận POST
    if (req.method !== "POST") {
      return res.status(400).json({
        error: "Thiếu dữ liệu đầu vào",
        detail: "POST request mới hoạt động",
      });
    }

    // Vercel backend → body tự parse → dùng req.body
    const body = req.body || {};
    const messages = body.messages || [];

    // Bơm Q&A vào system message
    messages.unshift({
      role: "system",
      content: `Trợ lý Truyền thông.

Dưới đây là danh sách Q&A nội bộ dùng để tham khảo:

${knowledge.map(x => `Hỏi: ${x.q}\nĐáp: ${x.a}`).join("\n\n")}

-----------------------------------------
Quy tắc trả lời:
1. Ưu tiên sử dụng nội dung trong bộ Q&A trên.
2. Nếu không tìm thấy nội dung phù hợp trong Q&A:
"Nội dung này nằm ngoài phạm vi tư vấn của Trợ lý Truyền thông.
Vui lòng truy cập www.pcvinhlong.evnspc.vn hoặc gọi tổng đài 19001006 – 19009000 để được hỗ trợ thêm."`
    });

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Thiếu OPENAI_API_KEY trong Environment Variables",
      });
    }

    // Gọi OpenAI GPT-4o-mini
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
      }),
    });

    const data = await r.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      detail: err.message,
    });
  }
}
