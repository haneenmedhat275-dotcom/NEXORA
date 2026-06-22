const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const evaluateAnswer = async (question, studentAnswer, modelAnswer) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an objective grading assistant.'
        },
        {
          role: 'user',
          content: `You are an expert interviewer. Compare the student's answer to the model answer and return ONLY a JSON object with keys:
{ "score": <integer 0-10>, "comment": "short comment" }
Do not add any text outside the JSON.

Question: ${question}
Model answer: ${modelAnswer}
Student answer: ${studentAnswer}`
        }
      ],
      max_tokens: 150,
      temperature: 0.2
    });

    const text = response.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('Empty AI response');

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI did not return JSON');

    const parsed = JSON.parse(jsonMatch[0]);

    let score = Math.round(Number(parsed.score));
    if (!Number.isFinite(score)) score = 5;
    score = Math.max(0, Math.min(10, score));

    const comment = parsed.comment ? String(parsed.comment).trim() : '';

    return { score, comment };

  } catch (err) {
    console.error('AI evaluation failed:', err.message || err);
    return { score: 5, comment: 'AI unavailable — default feedback.' };
  }
};

module.exports = { evaluateAnswer };