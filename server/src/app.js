const express = require("express");
const cors = require("cors");
const { generateCourse, validateCourse } = require("./services/ai.service");
const { attachVideos } = require("./services/youtube.service");
const { listCourses, getCourse, saveCourse } = require("./services/course.service");

const app = express();
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({ success: true, message: "AI Course Builder API is running." });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, status: "healthy" });
});

app.post("/api/courses/generate", async (req, res, next) => {
  try {
    const topic = typeof req.body.topic === "string" ? req.body.topic.trim() : "";
    const difficulty = ["Beginner", "Intermediate", "Advanced"].includes(req.body.difficulty)
      ? req.body.difficulty
      : "Beginner";
    const duration = typeof req.body.duration === "string" ? req.body.duration : "2 weeks";

    if (topic.length < 2 || topic.length > 120) {
      return res.status(400).json({ success: false, error: "Enter a topic between 2 and 120 characters." });
    }
    const course = await generateCourse({ topic, difficulty, duration });
    validateCourse(course);
    await attachVideos(course);
    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
});

app.get("/api/courses", async (req, res, next) => {
  try {
    const courses = await listCourses();
    res.json({ success: true, courses });
  } catch (error) {
    next(error);
  }
});

app.get("/api/courses/:id", async (req, res, next) => {
  try {
    const course = await getCourse(req.params.id);
    if (!course) return res.status(404).json({ success: false, error: "Course not found." });
    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
});

app.post("/api/courses", async (req, res, next) => {
  try {
    const course = req.body.course;
    validateCourse(course);
    const saved = {
      ...course,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      savedAt: new Date().toISOString()
    };
    await saveCourse(saved);
    res.status(201).json({ success: true, course: saved });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Endpoint not found." });
});

app.use((error, req, res, next) => {
  console.error(`[API error] ${error.message}`);
  const status = Number.isInteger(error.status) ? error.status : 500;
  res.status(status).json({
    success: false,
    error: status === 500 ? "Unexpected server error. Check the server terminal." : error.message
  });
});

module.exports = app;
