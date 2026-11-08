const fs = require("fs");
const path = require("path");
const { Blob } = require("buffer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const ffprobePath = require("@ffprobe-installer/ffprobe");
const { client } = require("./huggingfaceClient");

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path);

const WHISPER_MODEL = "openai/whisper-large-v3";
const EMOTION_MODEL = "ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition";
const LLAMA_MODEL = "meta-llama/Llama-3.1-8B-Instruct";

const transcribeAudio = async (audioPath) => {
  try {
    const audioBuffer = fs.readFileSync(audioPath);
    const ext = path.extname(audioPath).toLowerCase();
    const mime = ext === ".wav" ? "audio/wav" : ext === ".ogg" ? "audio/ogg" : "audio/mpeg";
    const blob = new Blob([audioBuffer], { type: mime });

    const result = await client.automaticSpeechRecognition({
      model: WHISPER_MODEL,
      data: blob,
    });

    return result.text || "";
  } catch (error) {
    console.error("Whisper Error:", error.message);
    return "";
  }
};

const analyzeEmotion = async (audioPath) => {
  try {
    const audioBuffer = fs.readFileSync(audioPath);
    const ext = path.extname(audioPath).toLowerCase();
    const mime = ext === ".wav" ? "audio/wav" : ext === ".ogg" ? "audio/ogg" : "audio/mpeg";
    const blob = new Blob([audioBuffer], { type: mime });

    const result = await client.audioClassification({
      model: EMOTION_MODEL,
      data: blob,
    });

    if (Array.isArray(result) && result.length > 0) {
      const top = result.reduce((a, b) => (a.score > b.score ? a : b));
      return { label: top.label, score: top.score, all: result };
    }

    return null;
  } catch (error) {
    console.error("Emotion Analysis Error:", error.message);
    return null;
  }
};

const getAudioDuration = (audioPath) => {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err || !metadata?.format?.duration) {
        resolve(0);
      } else {
        resolve(metadata.format.duration);
      }
    });
  });
};

const extractAudio = async (videoPath) => {
  const audioPath = videoPath.replace(path.extname(videoPath), ".mp3");

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(audioPath)
      .audioCodec("libmp3lame")
      .noVideo()
      .on("end", () => resolve(audioPath))
      .on("error", reject)
      .run();
  });
};

const extractJson = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in model response");
  return JSON.parse(match[0]);
};

const emotionToTone = (label) => {
  const map = {
    angry: 'hesitant',
    disgust: 'hesitant',
    fear: 'hesitant',
    happy: 'enthusiastic',
    sad: 'hesitant',
    surprise: 'enthusiastic',
    neutral: 'neutral'
  };
  return map[label?.toLowerCase()] || 'neutral';
};

const clarityFromScore = (emotionScore) => {
  if (!emotionScore) return 'moderate';
  if (emotionScore > 0.7) return 'clear';
  if (emotionScore > 0.4) return 'moderate';
  return 'unclear';
};

const evaluateAnswer = async (question, studentAnswer, modelAnswer) => {
  const cleanedAnswer = (studentAnswer || '').trim();
  const isEmptyOrFailed =
    cleanedAnswer === '' ||
    cleanedAnswer === '[Transcription failed]';

  if (isEmptyOrFailed) {
    return {
      score: 0,
      comment: 'No answer was provided for this question.',
      strengths: [],
      weaknesses: ['No answer given', 'Did not attempt to respond'],
    };
  }

  try {
    const prompt = `You are a strict expert interviewer evaluating a candidate's answer.

Scoring rules you MUST follow:
- If the student explicitly says they don't know, or gives no real technical content, score between 0-2.
- If the student gives a partial or vague answer with minimal correct content, score between 3-5.
- If the student gives a mostly correct answer with minor gaps, score between 6-8.
- If the student gives a complete, accurate, well-explained answer matching the model answer, score between 9-10.
- Do not give credit for restating the question or acknowledging the topic without providing actual content.
- Be strict and realistic - this score reflects real interview readiness, not effort.

Return ONLY JSON, no markdown, no code blocks: {"score": 0-10, "comment": "...", "strengths": ["..."], "weaknesses": ["..."]}
Question: ${question}
Model answer: ${modelAnswer}
Student answer: ${studentAnswer}`;

    const result = await client.chatCompletion({
      model: LLAMA_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const text = result.choices[0].message.content;
    const parsed = extractJson(text);

    return {
      score: Math.max(0, Math.min(10, Math.round(Number(parsed.score)))),
      comment: String(parsed.comment || "").trim(),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    };
  } catch (error) {
    console.error("evaluateAnswer Error:", error.message);
    return { score: 5, comment: "AI unavailable.", strengths: [], weaknesses: [] };
  }
};

const evaluateAnswerFromVideo = async (question, modelAnswer, videoPath) => {
  let audioPath = "";

  try {
    audioPath = await extractAudio(videoPath);

    const [transcription, emotion, duration] = await Promise.all([
      transcribeAudio(audioPath),
      analyzeEmotion(audioPath),
      getAudioDuration(audioPath),
    ]);

    const wordCount = transcription ? transcription.trim().split(/\s+/).length : 0;
    const wpm = duration > 0 ? Math.round((wordCount / duration) * 60) : 0;

    const speechMetrics = {
      durationSeconds: Math.round(duration),
      wpm,
      pauses: null,
      tone: emotion ? emotionToTone(emotion.label) : 'neutral',
      clarity: emotion ? clarityFromScore(emotion.score) : 'moderate',
    };

    if (!transcription) {
      return {
        transcription: "",
        score: 1,
        comment: "No speech detected in the recording.",
        strengths: [],
        weaknesses: ["No speech detected"],
        speechMetrics,
      };
    }

    const emotionContext = emotion
      ? `Detected vocal emotion: ${emotion.label} (confidence: ${emotion.score.toFixed(2)})`
      : "Vocal emotion analysis unavailable.";

    const prompt = `You are an expert interviewer evaluating a spoken answer.
Question: ${question}
Model answer: ${modelAnswer}
Student's transcribed answer: ${transcription}
${emotionContext}
Speaking pace: ${wpm} words per minute.

Rate the answer's content 0-10 based on accuracy and completeness compared to the model answer.
Return ONLY JSON, no markdown, no code blocks: {"score": 0-10, "comment": "...", "strengths": ["..."], "weaknesses": ["..."]}`;

    const result = await client.chatCompletion({
      model: LLAMA_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const text = result.choices[0].message.content;
    const parsed = extractJson(text);

    return {
      transcription,
      score: Math.max(0, Math.min(10, Math.round(Number(parsed.score)))),
      comment: String(parsed.comment || "").trim(),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      speechMetrics,
    };
  } catch (error) {
    console.error("evaluateAnswerFromVideo Error:", error.message);

    return {
      transcription: "",
      score: 5,
      comment: "AI unavailable for video.",
      strengths: [],
      weaknesses: [],
      speechMetrics: { durationSeconds: 0, wpm: 0, pauses: null, tone: 'neutral', clarity: 'moderate' },
      error: error.message,
    };
  } finally {
    if (audioPath && fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }
  }
};

module.exports = {
  evaluateAnswer,
  evaluateAnswerFromVideo,
  transcribeAudio,
};