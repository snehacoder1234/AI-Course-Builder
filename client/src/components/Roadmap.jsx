import { CheckCircle2, Circle, Clock3, Youtube } from "lucide-react";
import { ytUrl } from "../services/api.js";

export default function Roadmap({ modules, topic, done = [], onToggle }) {
  if (!modules?.length) return <p className="muted">No modules yet.</p>;
  const pct = Math.round((done.length / modules.length) * 100);
  return (
    <div>
      <div className="progress-wrap"><div className="progress-bar"><i style={{ width: `${pct}%` }} /></div><span>{done.length} of {modules.length} modules done ({pct}%)</span></div>
      <div className="roadmap-list">
        {modules.map((module, index) => {
          const isDone = done.includes(index);
          return (
            <article className="module-row" key={`${module.title}-${index}`}>
              <button className={`module-marker${isDone ? " done" : ""}`} onClick={() => onToggle?.(index)} aria-label={isDone ? "Mark as not done" : "Mark as done"}>{isDone ? <CheckCircle2 size={22} /> : <Circle size={22} />}</button>
              <div className="module-content">
                <div className="module-heading"><span className="module-number">Module {index + 1}</span><span className="module-time"><Clock3 size={14} /> {module.duration || "Learn at your pace"}</span></div>
                <h3>{module.title}</h3>
                <ul className="topic-list">{(module.topics || []).map((t, i) => <li key={`${t}-${i}`}>{t}</li>)}</ul>
                {module.notes && <p className="module-notes">{module.notes}</p>}
                <a className="yt-link" href={ytUrl(module, topic)} target="_blank" rel="noreferrer"><Youtube size={17} /> Watch on YouTube</a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
