import { knowledge } from "./kb.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Chỉ hỗ trợ POST" });
    }

    const body = await req.json();
    const messages = body.messages || [];

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

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Thiếu OPENAI_API_KEY" });
    }

    // ⭐ OpenAI Responses API (đúng cho GPT-4o-mini)
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
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      detail: err.message
    });
  }
}
