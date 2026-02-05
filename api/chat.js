export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message } = req.body;
    const API_KEY = process.env.OPENROUTER_API_KEY;

    // Check if key exists
    if (!API_KEY) {
        return res.status(500).json({ reply: "Error: OPENROUTER_API_KEY is missing in Vercel Settings." });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": "https://super-ai-app.vercel.app", // Required by some free models
                "X-Title": "super_AI", // Required by some free models
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
                "messages": [{ "role": "user", "content": message }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // This will show you exactly what OpenRouter is complaining about
            return res.status(200).json({ reply: `OpenRouter Error: ${data.error.message}` });
        }

        const reply = data.choices?.[0]?.message?.content || "AI returned empty response.";
        res.status(200).json({ reply });

    } catch (error) {
        res.status(500).json({ reply: "Connection Error: Check Vercel logs or your internet." });
    }
}
