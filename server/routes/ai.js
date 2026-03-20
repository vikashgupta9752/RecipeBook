const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

router.post('/analyze-recipe', protect, async (req, res) => {
  const { ingredients, instructions } = req.body;

  if (!ingredients || !instructions) {
    return res.status(400).json({ message: 'Ingredients and instructions are required' });
  }

  const prompt = `
Analyze the following recipe and estimate nutrition details, difficulty, and time breakdown.

Ingredients:
${ingredients.join(', ')}

Instructions:
${instructions.join('\n')}

Return ONLY valid JSON:
{
  "calories": "number",
  "difficulty": "Easy | Medium | Hard",
  "prepTime": "number in minutes",
  "cookTime": "number in minutes",
  "nutrition": {
    "protein": "string with unit (g)",
    "carbs": "string with unit (g)",
    "fat": "string with unit (g)",
    "fiber": "string with unit (g)"
  }
}
`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!data?.candidates?.length) {
      return res.status(500).json({ message: 'Invalid AI response' });
    }

    const text = data.candidates[0].content.parts[0].text;
    const clean = text.replace(/```json|```/g, '').trim();

    let result;
    try {
      result = JSON.parse(clean);
    } catch {
      return res.status(500).json({ message: 'AI returned invalid JSON', raw: text });
    }

    res.json(result);
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ message: 'Failed to analyze recipe' });
  }
});

module.exports = router;
