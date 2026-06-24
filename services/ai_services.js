const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const evaluateAnswer = async (question, studentAnswer, modelAnswer) => {
  if (!genAI) {
    return { score: 5, comment: 'AI service not configured.' };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert interviewer. Rate this answer 0-10 and give short feedback.
Return ONLY JSON: {"score": 0-10, "comment": "..."}
Question: ${question}
Model answer: ${modelAnswer}
Student answer: ${studentAnswer}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch[0]);

    return {
      score: Math.max(0, Math.min(10, Math.round(Number(parsed.score)))),
      comment: String(parsed.comment || '').trim()
    };

  } catch (err) {
    console.error('AI error:', err.message);
    return { score: 5, comment: 'AI unavailable.' };
  }
};

module.exports = { evaluateAnswer };