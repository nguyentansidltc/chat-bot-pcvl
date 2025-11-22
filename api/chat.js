import { knowledge } from "./kb.js";

export default async function handler(req, res) {
  try {
    // --- Đọc body đúng chuẩn Vercel (không dùng req.json) ---
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const rawBody = Buffer.concat(buffers).toString();
    const body = rawBody ? JSON.parse(rawBody) : {};
    
    const messages = body.messages || [];

    // --- Đưa Q&A vào system ---
    messages.unshift({
      role: "system",
      content: `Trợ lý Truyền thông.
      
Dưới đây là danh sách Q&A nội bộ dùng để tham khảo:

${knowledge.map(x => `Hỏi: ${x.q}\nĐáp: ${x.a}`).join("\n\n")}

-----------------------------------------
Quy tắc trả lời:
1. Ưu tiên sử dụng nội dung trong bộ Q&A trên.
2. Nếu không tìm thấy nội dung phù hợp trong Q&A:
   Trả lời đúng mẫu sau:

"Nội dung này nằm ngoài phạm vi tư vấn của Trợ lý Truyền thông.
Vui lòng truy cập www.pcvinhlong.evnspc.vn hoặc gọi tổng đài 19001006 – 19009000 để được hỗ trợ thêm."`
    });

    // --- Kiểm tra API Key ---
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Thiếu OPENAI_API_KEY trong Environment Variables" });
    }

    // --- Gọi OpenAI ---
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
      detail: err.message 
    });
  }
}
