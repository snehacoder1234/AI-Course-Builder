import { BookOpen, Library, PlusCircle, Sparkles } from "lucide-react";

export default function Navbar({ route, go, hasCourse }) {
  const link = (path, label, Icon, active) => (
    <button className={`nav-link${active ? " active" : ""}`} onClick={() => go(path)}><Icon size={17} /><span>{label}</span></button>
  );
  return (
    <header className="topbar">
      <button className="brand" onClick={() => go("/")} aria-label="LearnCraft home">
        <span className="brand-mark"><BookOpen size={20} /></span>Learn<span className="brand-accent">Craft</span>
      </button>
      <nav className="nav-actions" aria-label="Main navigation">
        {link("/features", "Features", Sparkles, route === "/features")}
        {link("/create", "Create course", PlusCircle, route === "/create")}
        {hasCourse && link("/course", "Current course", BookOpen, route.startsWith("/course"))}
        {link("/library", "My courses", Library, route === "/library")}
      </nav>
    </header>
  );
}
