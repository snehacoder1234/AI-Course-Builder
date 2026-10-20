# AI Course Builder — Working Prototype

A beginner-friendly full-stack prototype using React + Vite and Express.

## Features
- Topic-based course generation with roadmap, notes, and quiz
- Quiz attempts and score calculation
- Save and view generated courses
- Demo Mode works without an API key
- Optional Gemini API integration
- Courses are stored locally in `server/data/courses.json`

## Requirements
- Node.js 20+ (Node.js 22/24 LTS recommended)
- npm and internet for dependency installation

## Windows / VS Code setup
1. Extract this ZIP to your Desktop.
2. Open the extracted `AI-Course-Builder` folder in VS Code.
3. In the VS Code terminal, run:
   ```bash
   npm install
   npm run install:all
   ```
4. Optional Gemini setup: copy `server/.env.example` to `server/.env`, then add your own key to `GEMINI_API_KEY`. Keep the key private and never put it in frontend files.
5. Start both apps from the project root:
   ```bash
   npm run dev
   ```
6. Open the Vite URL printed in the terminal, usually `http://localhost:5173`.

If you skip Gemini setup, the app uses sample Demo Mode content so you can test the full flow.
If port 5000 or 5173 is already in use, stop the other process or change the port.
This is a local prototype, not a production-ready SaaS: no accounts, no cloud sync, and no multi-user permissions.
