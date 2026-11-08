const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const { client } = require("./huggingfaceClient");

const LLAMA_MODEL = "meta-llama/Llama-3.1-8B-Instruct";

const extractTextFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
};

const extractInfoFromCV = async (cvText) => {
  try {
    const prompt = `Extract the following information from this CV/resume text.
Return ONLY JSON, no markdown, no code blocks:
{"name":"...","age":null,"yearsOfExperience":null,"jobRole":"...","currentJobTitle":"...","skills":["..."]}

Rules:
- age: integer or null if not found
- yearsOfExperience: integer or null if not found
- skills: array of strings
- If a field is not found, use null or empty string/array

CV text:
${cvText.substring(0, 3000)}`;

    const result = await client.chatCompletion({
      model: LLAMA_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const text = result.choices[0].message.content;
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found in model response");
    const parsed = JSON.parse(match[0]);

    return {
      name: String(parsed.name || "").trim(),
      age: Number(parsed.age) || null,
      yearsOfExperience: Number(parsed.yearsOfExperience) || null,
      jobRole: String(parsed.jobRole || "").trim(),
      currentJobTitle: String(parsed.currentJobTitle || "").trim(),
      skills: Array.isArray(parsed.skills) ? parsed.skills.map(s => String(s).trim()) : [],
    };
  } catch (error) {
    console.error("AI CV Parser Error:", error.message);
  }
  try {
    const lines = cvText.split("\n").map(l => l.trim()).filter(Boolean);
    const name = lines[0]?.replace(/^(cv|resume|curriculum vitae)[:\s]*/i, "").trim() || "";
    const skills = [];
    const skillKeywords = ["javascript", "typescript", "react", "node.js", "python", "java", "sql", "html", "css", "figma", "design", "management", "leadership", "agile", "scrum", "aws", "docker", "kubernetes", "git", "mongodb", "postgresql", "angular", "vue", "sass", "tailwind", "redux", "rest api", "graphql", "flutter", "swift", "kotlin", "go", "rust", "ruby", "php", "c++", "c#", ".net", "express", "django", "flask", "spring"];
    const lower = cvText.toLowerCase();
    for (const kw of skillKeywords) {
      if (lower.includes(kw) && !skills.includes(kw)) skills.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
    const yearsMatch = cvText.match(/(\d+)\+?\s*years?\s*(of\s*)?experience/i);
    const ageMatch = cvText.match(/(\d+)\s*years?\s*old/i);
    const titleLine = lines.find(l => /(senior|junior|lead|principal|manager|engineer|designer|developer|architect|analyst)/i.test(l) && l.length < 80);
    return {
      name,
      age: ageMatch ? parseInt(ageMatch[1]) : null,
      yearsOfExperience: yearsMatch ? parseInt(yearsMatch[1]) : null,
      jobRole: titleLine || "",
      currentJobTitle: titleLine || "",
      skills,
    };
  } catch (error) {
    console.error("Fallback CV Parser Error:", error.message);
    return null;
  }
};

const extractTextFromFile = async (filePath) => {
  try {
    return await extractTextFromPDF(filePath);
  } catch {
    try {
      const buffer = fs.readFileSync(filePath);
      const text = buffer.toString("utf-8").replace(/\0/g, "").trim();
      if (text.length > 50) return text;
    } catch {}
    try {
      const buffer = fs.readFileSync(filePath);
      const text = buffer.toString("latin1").replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim();
      if (text.length > 100) return text;
    } catch {}
    return "";
  }
};

const parseCV = async (filePath) => {
  try {
    const text = await extractTextFromFile(filePath);
    if (!text || text.trim().length === 0) {
      return null;
    }
    const info = await extractInfoFromCV(text);
    return info;
  } catch (error) {
    console.error("CV Parse Error:", error.message);
    return null;
  }
};

module.exports = { parseCV };
