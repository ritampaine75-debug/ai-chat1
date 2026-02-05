export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message } = req.body;
    const API_KEY = process.env.OPENROUTER_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ reply: "Missing API Key in Vercel settings." });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": "https://super-ai-app.vercel.app", 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
                "messages": [{ "role": "user", "content": message }]
            })
        });

        const data = await response.json();
        const reply = data.choices[0]?.message?.content || "AI returned an empty response.";
        res.status(200).json({ reply });
    } catch (error) {
        res.status(500).json({ reply: "Backend error: Could not reach OpenRouter." });
    }
}
