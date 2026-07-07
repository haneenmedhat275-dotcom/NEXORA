require('dotenv').config();
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const evaluateAnswer = async (question, studentAnswer, modelAnswer) => {
  if (!genAI) {
    return { score: 5, comment: 'AI service not configured.' };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

const evaluateAnswerFromVideo = async (question, modelAnswer, videoPath) => {
  if (!genAI) {
    return { transcription: '', score: 5, comment: 'AI service not configured.' };
  }

  let audioPath = '';

  try {
    audioPath = videoPath.replace(path.extname(videoPath), '.mp3');

    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .output(audioPath)
        .audioCodec('libmp3lame')
        .noVideo()
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const audioBuffer = fs.readFileSync(audioPath);
    const base64Data = audioBuffer.toString('base64');

    const prompt = `You are an expert interviewer analyzing a student's spoken answer.

First, transcribe exactly what the student said from this audio.
Then, evaluate the answer based on this context:
- Question: ${question}
- Model answer: ${modelAnswer}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "transcription": "exact transcription here",
  "score": 0-10,
  "comment": "short feedback"
}`;

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: 'audio/mp3', data: base64Data } }
    ]);

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch[0]);

    return {
      transcription: String(parsed.transcription || '').trim(),
      score: Math.max(0, Math.min(10, Math.round(Number(parsed.score)))),
      comment: String(parsed.comment || '').trim()
    };

  } catch (err) {
    console.error('Video AI error:', err.message);
    if (err.message?.includes('SAFETY')) {
      return { transcription: '', score: 1, comment: 'Inappropriate content detected.' };
    }
    return { transcription: '', score: 5, comment: 'AI unavailable for video.', error: err.message };
  } finally {
    if (audioPath && fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }
  }
};

module.exports = { evaluateAnswer, evaluateAnswerFromVideo };