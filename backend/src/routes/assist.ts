import express from 'express';
import axios from 'axios';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 20),
});

router.post('/assist', limiter, async (req: express.Request, res: express.Response) => {
  const prompt = req.body?.prompt;
  if (!prompt) return res.status(400).json({ message: 'prompt is required' });

  // optional simple auth for the route
  const expectedKey = process.env.ASSIST_KEY;
  if (expectedKey && req.headers['x-assist-key'] !== expectedKey) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'text-bison-001';
    if (!apiKey) {
      return res.status(500).json({ message: 'GEMINI_API_KEY not configured' });
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateText?key=${apiKey}`;

    const resp = await axios.post(url, {
      prompt: { text: prompt },
      temperature: Number(process.env.GEMINI_TEMPERATURE || 0.2),
      maxOutputTokens: Number(process.env.GEMINI_MAX_TOKENS || 512),
    });

    const text =
      resp.data?.candidates?.[0]?.content ||
      resp.data?.output?.[0]?.content ||
      resp.data?.text ||
      JSON.stringify(resp.data);

    res.json({ text });
  } catch (err: any) {
    console.error('Gemini API error:', err?.response?.data || err?.message || err);
    const message = err?.response?.data?.error?.message || err?.message || 'AI request failed';
    res.status(502).json({ message });
  }
});

export default router;