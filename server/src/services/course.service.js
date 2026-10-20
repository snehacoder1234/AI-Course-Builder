const fs = require("fs/promises");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "courses.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]\n", "utf8");
  }
}

async function readCourses() {
  await ensureStore();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    throw new Error("Course data file is invalid JSON. Please restore server/data/courses.json to []");
  }
}

async function listCourses() {
  return readCourses();
}

async function getCourse(id) {
  const courses = await readCourses();
  return courses.find((course) => course.id === id) || null;
}

async function saveCourse(course) {
  const courses = await readCourses();
  courses.unshift(course);
  await fs.writeFile(DATA_FILE, JSON.stringify(courses, null, 2) + "\n", "utf8");
  return course;
}

module.exports = { listCourses, getCourse, saveCourse };
