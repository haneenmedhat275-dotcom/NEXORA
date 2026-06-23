// c:.../services/ai_services.js
const OpenAI = require('openai');

const evaluateAnswer = async (question, studentAnswer, modelAnswer) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not set — using fallback feedback');
      return { score: 5, comment: 'AI unavailable — default feedback.' };
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const resp = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an objective grading assistant.' },
        { role: 'user', content: `Return ONLY a JSON object with keys {"score":<0-10>,"comment":"short comment"}.\nQuestion: ${question}\nModel answer: ${modelAnswer}\nStudent answer: ${studentAnswer}` }
      ],
      max_tokens: 200,
      temperature: 0.0
    });

    const text = resp?.choices?.[0]?.message?.content;
    if (!text) throw new Error('Empty AI response');

    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) throw new Error('AI did not return JSON');

    const jsonStr = text.slice(start, end + 1);
    const parsed = JSON.parse(jsonStr);

    let score = Number(parsed.score);
    if (!Number.isFinite(score)) score = 5;
    score = Math.max(0, Math.min(10, Math.round(score)));

    const comment = parsed.comment ? String(parsed.comment).trim() : '';

    return { score, comment };
  } catch (err) {
    console.error('AI evaluation failed:', err && err.message ? err.message : err);
    return { score: 5, comment: 'AI unavailable — default feedback.' };
  }
};

module.exports = { evaluateAnswer };