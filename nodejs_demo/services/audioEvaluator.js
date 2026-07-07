const fs = require("fs");
const path = require("path");
const { Blob } = require("buffer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const ffprobePath = require("@ffprobe-installer/ffprobe");
const { client } = require("./huggingfaceClient");

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path);

// ==== إعدادات الموديلات (سهل تغييرهم من مكان واحد) ====
const WHISPER_MODEL = "openai/whisper-large-v3";
const EMOTION_MODEL = "ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition";
const LLAMA_MODEL = "meta-llama/Llama-3.1-8B-Instruct";

// 1) تحويل الصوت لنص (Whisper)
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

// 2) تحليل نبرة/مشاعر الصوت
// ملاحظة: الموديل ده مدرب بالإنجليزي، فالنتيجة على كلام عربي ممكن تكون غير دقيقة.
// بنستخدمها كمعلومة إضافية بس، مش أساس التقييم.
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

    // النتيجة array من {label, score} - بناخد الأعلى score
    if (Array.isArray(result) && result.length > 0) {
      const top = result.reduce((a, b) => (a.score > b.score ? a : b));
      return { label: top.label, score: top.score, all: result };
    }

    return null;
  } catch (error) {
    console.error("Emotion Analysis Error:", error.message);
    return null; // مش هنوقف العملية لو الخطوة دي فشلت
  }
};

// 3) حساب مدة الصوت بالثواني (للـ wpm)
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

// استخراج الصوت من الفيديو
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

// استخراج أول JSON صحيح من نص رد الموديل
const extractJson = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in model response");
  return JSON.parse(match[0]);
};

// 4) تقييم نصي بس (بدون صوت) - Llama
const evaluateAnswer = async (question, studentAnswer, modelAnswer) => {
  try {
    const prompt = `You are an expert interviewer. Rate this answer 0-10 and give feedback.
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

// 5) تقييم إجابة فيديو كاملة: صوت -> نص + مشاعر -> تقييم Llama
const evaluateAnswerFromVideo = async (question, modelAnswer, videoPath) => {
  let audioPath = "";

  try {
    // استخراج الصوت من الفيديو
    audioPath = await extractAudio(videoPath);

    // تشغيل التفريغ النصي وتحليل المشاعر وحساب المدة مع بعض
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
      pauses: null, // محتاج تحليل صمت منفصل لو عايزة الرقم ده لاحقًا
    };

    if (!transcription) {
      return {
        transcription: "",
        score: 1,
        comment: "لم يتم التعرف على أي كلام في التسجيل.",
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
      emotion: emotion ? emotion.label : null,
    };
  } catch (error) {
    console.error("evaluateAnswerFromVideo Error:", error.message);

    return {
      transcription: "",
      score: 5,
      comment: "AI unavailable for video.",
      strengths: [],
      weaknesses: [],
      speechMetrics: { durationSeconds: 0, wpm: 0, pauses: null },
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