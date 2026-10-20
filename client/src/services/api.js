import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 90000,
  headers: { "Content-Type": "application/json" }
});

export async function generateCourse(payload) {
  const { data } = await api.post("/courses/generate", payload);
  return data.course;
}

export async function saveCourse(course) {
  const { data } = await api.post("/courses", { course });
  return data.course;
}

export async function getCourses() {
  const { data } = await api.get("/courses");
  return data.courses;
}

export async function getHealth() {
  const { data } = await api.get("/health");
  return data;
}

export function getErrorMessage(error) {
  return error?.response?.data?.error || error?.message || "Something went wrong. Please try again.";
}

export const ytUrl = (m, topic = "") => `https://www.youtube.com/results?search_query=${encodeURIComponent(m.youtubeQuery || `${topic} ${m.title} tutorial`)}`;
