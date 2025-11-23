import { knowledge } from "./kb.js";

export default async function handler(req, res) {
  try {
    console.log("🔥 API /api/chat được gọi");

    // Chỉ cho phép POST
    if (req.method !== "POST") {
      console.log("❌ Request method không phải POST:", req.method);
      return res.status(405).json({ error: "Chỉ chấp nhận POST" });
    }

    // Vercel tự parse JSON → dùng req.body
    console.log("📩 Raw req.body nhận được:", req.body);

    const body = req.body || {};
    const messages = body.messages || [];

    console.log("💬 Messages from client:", messages);

    // Nếu messages không gửi lên → báo lỗi để dễ debug
    if (!Array.isArray(messages) || messages.length === 0) {
      console.log("❌ messages không hợp lệ:", messages);
      return res.status(400).json({
        error: "Dữ liệu gửi lên API không hợp lệ. Không có messages."
      });
    }

    // Gắn Q&A vào hệ thống
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

    console.log("📚 Messages sau khi gắn system + Q&A:", messages);

    // Lấy API KEY
    const apiKey = process.env.OPENAI_API_KEY;
    console.log("🔑 OPENAI_API_KEY có tồn tại không?", apiKey ? "YES" : "NO");

    if (!apiKey) {
      return res.status(500).json({
        error: "Thiếu OPENAI_API_KEY trong Environment Variables"
      });
    }

    // Gửi request đến OpenAI
    console.log("➡️ Gửi yêu cầu đến OpenAI...");

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

    console.log("⬅️ Nhận phản hồi từ OpenAI. Status:", r.status);

    const data = await r.json();

    console.log("📨 Nội dung OpenAI trả về:", data);

    // Trả về client
    return res.status(200).json(data);

  } catch (err) {
    console.error("💥 Lỗi xử lý API:", err);
    return res.status(500).json({
      error: "Server error",
      detail: err.message
    });
  }
}
