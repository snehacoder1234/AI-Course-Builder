function makeDemoCourse({ topic, difficulty, duration }) {
  const cleanTopic = topic.trim();
  const modules = [
    {
      title: `Foundations of ${cleanTopic}`,
      duration: "20%",
      topics: [`What ${cleanTopic} means`, "Core terminology", "Where it is used"],
      notes: `Start by defining ${cleanTopic} in your own words. Write down the key terms, identify why the subject matters, and connect each idea to a simple real-world example.`
    },
    {
      title: `Core concepts in ${cleanTopic}`,
      duration: "35%",
      topics: ["Main concepts", "How the parts connect", "Worked examples"],
      notes: `Focus on the main concepts of ${cleanTopic}. For each concept, write a short definition, one example, and one common mistake to avoid.`
    },
    {
      title: `Practice ${cleanTopic}`,
      duration: "30%",
      topics: ["Guided exercises", "Solve a small problem", "Review mistakes"],
      notes: `Practice actively rather than only reading. Attempt a small task involving ${cleanTopic}, explain your steps, then compare your reasoning with a trusted learning resource.`
    },
    {
      title: `Revision and next steps`,
      duration: "15%",
      topics: ["Summarize the key ideas", "Self-assessment", "Choose a next project"],
      notes: `Summarize ${cleanTopic} without looking at your notes. Identify gaps, revise those sections, and choose a small project or exercise to demonstrate what you learned.`
    }
  ];

  return {
    title: `${cleanTopic}: ${difficulty} Learning Plan`,
    topic: cleanTopic,
    difficulty,
    duration,
    description: `A starter learning plan for ${cleanTopic}. Demo Mode uses a reusable sample structure; configure a Gemini API key for AI-generated content.`,
    modules,
    quiz: [
      {
        question: `What is the best first step when learning ${cleanTopic}?`,
        options: ["Memorize everything immediately", "Understand the foundations and key terms", "Skip examples", "Only watch videos at 2x speed"],
        answer: 1,
        explanation: "Foundations and terminology make later concepts easier to understand."
      },
      {
        question: "Which approach usually helps learning stick?",
        options: ["Only rereading", "Avoiding practice", "Active practice and reviewing mistakes", "Studying without breaks forever"],
        answer: 2,
        explanation: "Active recall, practice, and mistake review help you identify gaps."
      },
      {
        question: "How should you check your understanding?",
        options: ["Explain the concept in your own words", "Copy notes without reading", "Ignore unclear parts", "Skip every exercise"],
        answer: 0,
        explanation: "Explaining ideas in your own words reveals whether you understand them."
      },
      {
        question: "What should you do when a topic is confusing?",
        options: ["Give up permanently", "Break it into smaller ideas and practice", "Skip all prerequisites", "Memorize the title only"],
        answer: 1,
        explanation: "Smaller steps and targeted practice make difficult topics manageable."
      },
      {
        question: "What is a useful final step in a learning module?",
        options: ["Never review it again", "Delete your notes", "Check your gaps and summarize key ideas", "Avoid applying the concept"],
        answer: 2,
        explanation: "Summarizing and identifying gaps helps reinforce learning."
      }
    ]
  };
}

function extractJson(text) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(cleaned);
}

async function generateCourse(input) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ...makeDemoCourse(input), mode: "demo" };
  }

  try {
    const { GoogleGenAI } = require("@google/genai");
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
    const prompt = `
Create a practical course for a student.
Topic: ${input.topic}
Difficulty: ${input.difficulty}
Duration: ${input.duration}
Return ONLY valid JSON (no markdown) in this shape:
{
 "title":"string","topic":"string","difficulty":"string","duration":"string","description":"string",
 "modules":[{"title":"string","duration":"string","topics":["string"],"overview":"string","keyPoints":["string"],"example":"string","commonMistakes":["string"],"summary":"string","notes":"string","youtubeQuery":"string"}],
 "quiz":[{"question":"string","options":["string","string","string","string"],"answer":0,"explanation":"string"}]
}
Create 4 modules and 5 multiple-choice questions. Each answer must be a zero-based integer matching the correct option. Write documentation-quality notes for each module: overview (4-5 sentences explaining the idea clearly), keyPoints (5-7 bullet strings), example (a worked example or short code, with line breaks as \n), commonMistakes (3 strings), summary (2 sentences), and notes (same as overview). youtubeQuery must be a short YouTube search phrase for the best tutorial on that module. Keep language simple and beginner-friendly. Do not include markdown fences.
`;
    const result = await ai.models.generateContent({ model, contents: prompt });
    const text = result.text;
    if (!text) throw new Error("Gemini returned an empty response.");
    const course = extractJson(text);
    validateCourse(course);
    return { ...course, mode: "gemini" };
  } catch (error) {
    const safeError = new Error(`AI generation failed: ${error.message}. Check your Gemini key, quota, and model name, or remove the key to use Demo Mode.`);
    safeError.status = 502;
    throw safeError;
  }
}

function validateCourse(course) {
  if (!course || typeof course.title !== "string" || !Array.isArray(course.modules) || !Array.isArray(course.quiz)) {
    throw new Error("AI response did not match the expected course format.");
  }
  if (course.modules.length < 1 || course.quiz.length < 1) {
    throw new Error("AI response must include modules and quiz questions.");
  }
  for (const q of course.quiz) {
    if (!q.question || !Array.isArray(q.options) || !Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
      throw new Error("AI returned an invalid quiz question.");
    }
  }
}

module.exports = { generateCourse, makeDemoCourse, validateCourse };
