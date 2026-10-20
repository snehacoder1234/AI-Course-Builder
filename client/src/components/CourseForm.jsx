import { useState } from "react";
import { ArrowRight, BookOpen, Clock3, GraduationCap, Sparkles } from "lucide-react";

export default function CourseForm({ onGenerate, loading }) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [duration, setDuration] = useState("2 weeks");

  function submit(event) {
    event.preventDefault();
    if (topic.trim().length < 2) return;
    onGenerate({ topic: topic.trim(), difficulty, duration });
  }

  return (
    <form className="generator-card" onSubmit={submit}>
      <div className="card-kicker"><Sparkles size={15} /> YOUR PERSONAL AI TUTOR</div>
      <h2>What do you want to learn?</h2>
      <p className="muted">Turn any topic into a structured learning plan, notes, and a quick knowledge check.</p>
      <label className="field-label" htmlFor="topic">Learning topic</label>
      <div className="topic-input-wrap">
        <BookOpen size={19} />
        <input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. JavaScript, Data Structures, Python..." maxLength={120} required minLength={2} />
      </div>
      <div className="form-grid">
        <div>
          <label className="field-label" htmlFor="difficulty">Your level</label>
          <div className="select-wrap"><GraduationCap size={17} /><select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
        </div>
        <div>
          <label className="field-label" htmlFor="duration">Study timeline</label>
          <div className="select-wrap"><Clock3 size={17} /><select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)}><option>1 week</option><option>2 weeks</option><option>4 weeks</option><option>8 weeks</option></select></div>
        </div>
      </div>
      <button className="primary-button full-width" type="submit" disabled={loading || topic.trim().length < 2}>
        {loading ? <><span className="spinner" /> Building your course...</> : <>Generate my course <ArrowRight size={18} /></>}
      </button>
      <div className="form-footnote"><span className="green-dot" /> Roadmap · Notes · Quiz · Saved courses</div>
    </form>
  );
}
