export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { task } = req.body || {};
  if (!task) return res.status(400).json({ error: "Field task wajib diisi." });
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: "Kamu adalah NEXUS, AI agent canggih. Jawab dalam Bahasa Indonesia. Format: emoji + JUDUL, garis ━━━, bagian [JUDUL], gunakan →, ✓, !, akhiri [STATUS] ✅",
        messages: [{ role: "user", content: "Tugas: " + task }],
      }),
    });
    const data = await response.json();
    if (data?.content?.[0]?.text) return res.status(200).json({ result: data.content[0].text });
    return res.status(500).json({ error: data?.error?.message || "Respons tidak valid" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
