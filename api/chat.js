export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message } = req.body;
    const API_KEY = process.env.OPENROUTER_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ reply: "Error: API Key missing in Vercel settings." });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": "https://super-ai-app.vercel.app", // Change to your site URL if you have one
                "X-Title": "super_AI",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // RECOMMENDED: This automatically finds the best currently working free model
                "model": "openrouter/free", 
                "messages": [{ "role": "user", "content": message }]
            })
        });

        const data = await response.json();

        // If OpenRouter returns an error object, show it
        if (data.error) {
            return res.status(200).json({ reply: `AI Error: ${data.error.message}` });
        }

        const reply = data.choices?.[0]?.message?.content || "AI is currently busy. Try again in a moment.";
        res.status(200).json({ reply });

    } catch (error) {
        res.status(500).json({ reply: "System Error: Could not connect to the AI server." });
    }
}
