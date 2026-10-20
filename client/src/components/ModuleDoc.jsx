import { useState } from "react";
import { AlertTriangle, Lightbulb, Play, Youtube } from "lucide-react";
import { ytUrl } from "../services/api.js";

function VideoCard({ v }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="video-card">
      {playing ? <iframe src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1`} title={v.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> :
        <button className="video-thumb" onClick={() => setPlaying(true)} aria-label={`Play ${v.title}`}><img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" /><span className="play-btn"><Play size={26} /></span></button>}
      <strong>{v.title}</strong><small>{v.channel}</small>
    </div>
  );
}

export default function ModuleDoc({ m, i, topic, videosEnabled }) {
  const intro = m.overview || m.notes || (m.topics || []).join(". ");
  return (
    <article className="doc" id={`module-${i + 1}`}>
      <span className="note-index">Module {i + 1}</span>
      <h2>{m.title}</h2>
      <p className="doc-intro">{intro}</p>
      {m.keyPoints?.length > 0 && <><h3>Key points</h3><ul className="doc-list">{m.keyPoints.map((k, n) => <li key={n}>{k}</li>)}</ul></>}
      {!m.keyPoints?.length && m.topics?.length > 0 && <div className="note-topics">{m.topics.map((t, n) => <span key={n}>{t}</span>)}</div>}
      {m.example && <><h3>Example</h3><pre className="doc-code">{m.example}</pre></>}
      {m.commonMistakes?.length > 0 && <div className="doc-warn"><h3><AlertTriangle size={18} /> Common mistakes</h3><ul>{m.commonMistakes.map((k, n) => <li key={n}>{k}</li>)}</ul></div>}
      {m.summary && <div className="doc-summary"><Lightbulb size={20} /><p><strong>In short: </strong>{m.summary}</p></div>}
      <h3 className="doc-videos-h"><Youtube size={19} /> Videos to watch</h3>
      {m.videos?.length > 0 ? <div className="video-grid">{m.videos.map((v) => <VideoCard key={v.id} v={v} />)}</div> : (
        <p className="muted">{videosEnabled ? "No videos found for this module." : "Add YOUTUBE_API_KEY in server/.env to see videos here."} <a className="yt-link" href={ytUrl(m, topic)} target="_blank" rel="noreferrer"><Youtube size={17} /> Search on YouTube</a></p>
      )}
    </article>
  );
}
