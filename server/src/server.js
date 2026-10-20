require("dotenv").config();
const app = require("./app");

const PORT = Number(process.env.PORT) || 5000;
const server = app.listen(PORT, () => {
  console.log(`AI Course Builder API running at http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(process.env.GEMINI_API_KEY ? "AI mode: Gemini API configured" : "AI mode: Demo Mode (no API key)");
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});
