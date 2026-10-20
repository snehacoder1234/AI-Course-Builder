import { useEffect, useState } from "react";
import { Award, Bot, Download, Flame, Globe, Layers, Share2, Video, ArrowRight, BookOpen, CheckCircle2, ChevronRight, Clock3, FileText, GraduationCap, Layers3, ListChecks, Map, Plus, Sparkles, Target } from "lucide-react";
import Navbar from "./components/Navbar.jsx";
import CourseForm from "./components/CourseForm.jsx";
import Roadmap from "./components/Roadmap.jsx";
import ModuleDoc from "./components/ModuleDoc.jsx";
import Quiz from "./components/Quiz.jsx";
import { generateCourse, getCourses, getErrorMessage, getHealth, saveCourse, ytUrl } from "./services/api.js";

const go = (path) => { window.location.hash = path; window.scrollTo(0, 0); };
const readHash = () => window.location.hash.slice(1) || "/";
const LIVE = [[Sparkles, "AI course generator", "Any topic, level and timeline becomes a full course."], [Map, "Learning roadmap", "Modules in the right order, with topics for each."], [FileText, "Study notes", "Short notes for every module."], [ListChecks, "Quiz with score", "Answer, submit and read the explanation for each question."], [Layers3, "Save and revisit", "Keep courses in My courses and open them anytime."], [Video, "YouTube videos", "A tutorial search link for every module."], [CheckCircle2, "Progress tracking", "Tick modules as you finish and watch the bar fill."]];
const SOON = [[Layers, "Flashcards", "Revise every module with flip cards."], [Bot, "AI tutor chat", "Ask doubts and get answers inside your course."], [Download, "PDF export", "Download notes and roadmap for offline study."], [Award, "Certificates", "Get a certificate when you finish a course."], [Flame, "Study streaks", "Daily goals and reminders to keep going."], [Share2, "Share courses", "Send a course to a friend with one link."], [Globe, "More languages", "Courses in Hindi and other languages."]];
const stored = () => { try { return JSON.parse(sessionStorage.getItem("lc-course")); } catch { return null; } };

export default function App() {
  const [route, setRoute] = useState(readHash());
  const [course, setCourseState] = useState(stored());
  const [savedCourses, setSavedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [doneMap, setDoneMap] = useState(() => { try { return JSON.parse(localStorage.getItem("lc-done")) || {}; } catch { return {}; } });
  const [apiMode, setApiMode] = useState("checking");

  const setCourse = (c) => {
    setCourseState(c);
    try { sessionStorage.setItem("lc-course", JSON.stringify(c)); } catch { /* ignore */ }
  };
  const refreshCourses = () => getCourses().then(setSavedCourses).catch(() => setSavedCourses([]));

  useEffect(() => {
    const onHash = () => { setRoute(readHash()); setError(""); setNotice(""); };
    window.addEventListener("hashchange", onHash);
    getHealth().then(() => setApiMode("connected")).catch(() => setApiMode("offline"));
    refreshCourses();
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  async function handleGenerate(payload) {
    setLoading(true); setError("");
    try { setCourse(await generateCourse(payload)); go("/course/notes"); }
    catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    setSaving(true); setError(""); setNotice("");
    try {
      setCourse(await saveCourse(course));
      await refreshCourses();
      setNotice("Course saved. You can find it in My courses.");
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setSaving(false); }
  }

  const key = course ? course.id || course.title : "";
  const done = doneMap[key] || [];
  const toggle = (i) => {
    const next = { ...doneMap, [key]: done.includes(i) ? done.filter((x) => x !== i) : [...done, i] };
    setDoneMap(next);
    try { localStorage.setItem("lc-done", JSON.stringify(next)); } catch { /* ignore */ }
  };
  const open = (item) => { setCourse(item); go("/course"); };

  function renderCourse() {
    if (!course) return <Empty onCreate={() => go("/create")} title="No course open yet" text="Generate a new course or open one from your library." />;
    const tab = route.split("/")[2] || "overview";
    const tabs = [["overview", "Overview", Layers3], ["roadmap", "Roadmap", Map], ["notes", "Notes & Videos", FileText], ["quiz", "Quiz", ListChecks]];
    return (
      <section className="page">
        <div className="course-head">
          <div>
            <span className={`mode-pill ${course.mode === "gemini" ? "ai" : ""}`}>{course.mode === "gemini" ? "Gemini AI" : "Demo mode"}</span>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
          </div>
          <button className="primary-button" onClick={handleSave} disabled={saving || Boolean(course.savedAt)}>
            {course.savedAt ? <><CheckCircle2 size={18} /> Saved</> : saving ? "Saving..." : <><Plus size={18} /> Save course</>}
          </button>
        </div>
        {error && <div className="alert error-alert">{error}</div>}
        {notice && <div className="alert success-alert">{notice}</div>}
        <div className="tabs" role="tablist">
          {tabs.map(([key, label, Icon]) => (
            <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? "tab active" : "tab"} onClick={() => go(key === "overview" ? "/course" : `/course/${key}`)}><Icon size={17} />{label}</button>
          ))}
        </div>
        {tab === "overview" && (
          <>
            <div className="stat-grid">
              <Stat Icon={Layers3} label="Modules" value={course.modules?.length || 0} />
              <Stat Icon={Target} label="Level" value={course.difficulty} />
              <Stat Icon={Clock3} label="Timeline" value={course.duration} />
              <Stat Icon={CheckCircle2} label="Progress" value={`${done.length}/${course.modules?.length || 0} done`} />
              <Stat Icon={GraduationCap} label="Quiz" value={`${course.quiz?.length || 0} questions`} />
            </div>
            <div className="jump-grid">
              {tabs.slice(1).map(([key, label, Icon]) => (
                <button key={key} className="jump-card" onClick={() => go(`/course/${key}`)}>
                  <Icon size={26} /><h3>{label}</h3>
                  <p>{key === "roadmap" ? "Follow the modules in order." : key === "notes" ? "Detailed notes and videos for every module." : "Test yourself and see your score."}</p>
                  <span>Open <ChevronRight size={16} /></span>
                </button>
              ))}
            </div>
          </>
        )}
        {tab === "roadmap" && <div className="panel"><h2>Your roadmap</h2><Roadmap modules={course.modules} topic={course.topic} done={done} onToggle={toggle} /></div>}
        {tab === "notes" && (
          <div className="docs">
            <nav className="doc-toc" aria-label="Modules">{course.modules?.map((m, i) => <a key={i} href={`#/course/notes`} onClick={(e) => { e.preventDefault(); document.getElementById(`module-${i + 1}`)?.scrollIntoView({ behavior: "smooth" }); }}>{i + 1}. {m.title}</a>)}</nav>
            {course.modules?.map((m, i) => <ModuleDoc key={i} m={m} i={i} topic={course.topic} videosEnabled={course.videosEnabled} />)}
          </div>
        )}
        {tab === "quiz" && <div className="panel"><Quiz key={course.id || course.title} questions={course.quiz || []} /></div>}
      </section>
    );
  }

  let page;
  if (route.startsWith("/course")) page = renderCourse();
  else if (route === "/create") page = (
    <section className="page narrow">
      <h1>Create a new course</h1>
      <p className="lead">Tell us the topic, your level and how much time you have.</p>
      {error && <div className="alert error-alert">{error}</div>}
      <CourseForm onGenerate={handleGenerate} loading={loading} />
    </section>
  );
  else if (route === "/features") page = <section className="page"><h1>Features</h1><Features go={go} /></section>;
  else if (route === "/library") page = (
    <section className="page">
      <div className="course-head"><div><h1>My courses</h1><p>Pick up where you left off.</p></div><button className="primary-button" onClick={() => go("/create")}><Plus size={18} /> New course</button></div>
      {savedCourses.length === 0 ? <Empty onCreate={() => go("/create")} title="No saved courses yet" text="Generate a course and press Save to keep it here." /> : (
        <div className="saved-grid">
          {savedCourses.map((c) => (
            <article className="saved-card" key={c.id}>
              <span className="saved-tag">{c.difficulty}</span>
              <h3>{c.title}</h3><p>{c.description}</p>
              <div className="saved-meta"><span><Layers3 size={15} /> {c.modules?.length || 0} modules</span><span><Clock3 size={15} /> {c.duration}</span></div>
              <button className="saved-open" onClick={() => open(c)}>Open course <ChevronRight size={17} /></button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
  else page = (
    <>
      <section className="hero">
        <div>
          <h1>Learn anything, one clear step at a time.</h1>
          <p className="lead">Type a topic and get a roadmap, short notes and a quiz, each on its own page, ready to study.</p>
          <div className="hero-actions">
            <button className="primary-button big" onClick={() => go("/create")}>Create my course <ArrowRight size={18} /></button>
            <button className="secondary-button big" onClick={() => go("/library")}>My courses</button>
          </div>
        </div>
      </section>
      <Features go={go} />
    </>
  );

  return (
    <div className="app-shell">
      <Navbar route={route} go={go} hasCourse={Boolean(course)} />
      <main>{page}</main>
      <footer className="footer"><span>LearnCraft</span><span className={`api-status ${apiMode}`}><i />{apiMode === "connected" ? "Backend connected" : apiMode === "checking" ? "Checking backend…" : "Backend offline"}</span></footer>
    </div>
  );
}

const Features = ({ go }) => (
  <>
    <section className="band"><h2>Everything you can do today</h2><p className="muted">These features already work.</p>
      <div className="feat-grid">{LIVE.map(([Icon, t, d]) => <div className="feat-card" key={t}><span className="badge live">Live</span><Icon size={26} /><h3>{t}</h3><p>{d}</p></div>)}</div>
      <button className="primary-button big" onClick={() => go("/create")}>Try it now <ArrowRight size={18} /></button>
    </section>
    <section className="band"><h2>Coming soon</h2><p className="muted">Prototype of what we are building next.</p>
      <div className="feat-grid">{SOON.map(([Icon, t, d]) => <div className="feat-card soon" key={t}><span className="badge">Coming soon</span><Icon size={26} /><h3>{t}</h3><p>{d}</p></div>)}</div>
    </section>
  </>
);
const Stat = ({ Icon, label, value }) => <div className="stat-card"><Icon size={20} /><span>{label}</span><strong>{value}</strong></div>;
const Empty = ({ title, text, onCreate }) => (
  <div className="empty-state"><BookOpen size={32} /><h2>{title}</h2><p>{text}</p><button className="secondary-button" onClick={onCreate}>Create a course <ArrowRight size={16} /></button></div>
);
