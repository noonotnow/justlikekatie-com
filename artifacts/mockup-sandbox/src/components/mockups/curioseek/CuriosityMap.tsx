import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import "./curiositymap.css";

type Interest = { id: string; label: string; category: string; color: string; x: number; y: number; prompt: string };

const interests: Interest[] = [
  { id: "folklore", label: "Folklore", category: "STORIES", color: "#d47c59", x: 23, y: 30, prompt: "What old stories survive because they still explain us?" },
  { id: "botany", label: "Urban botany", category: "LIVING THINGS", color: "#64836b", x: 49, y: 19, prompt: "Where does the wild find a way into the city?" },
  { id: "animation", label: "Animation", category: "MAKING", color: "#8a7192", x: 72, y: 38, prompt: "How can a few marks make something feel alive?" },
  { id: "architecture", label: "Architecture", category: "PLACES", color: "#bc963d", x: 37, y: 69, prompt: "What do our rooms teach us to notice?" },
  { id: "music", label: "Field recordings", category: "SOUND", color: "#5c8290", x: 75, y: 73, prompt: "What does a place sound like when nobody is performing?" },
  { id: "myth", label: "Myth & memory", category: "STORIES", color: "#b46e73", x: 13, y: 76, prompt: "How do memories change when we tell them together?" },
];

const initialSelected = ["folklore", "botany", "architecture"];
const initialLinks = [["folklore", "botany"], ["botany", "architecture"]];
const sessionMapKey = "curioseek-curiosity-map";
const validInterestIds = new Set(interests.map((item) => item.id));

type SavedMap = { selected: string[]; links: string[][] };

function readSavedMap(): { map: SavedMap | null; error: boolean } {
  if (typeof window === "undefined") return { map: null, error: false };
  try {
    const raw = window.sessionStorage.getItem(sessionMapKey);
    if (!raw) return { map: null, error: false };
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return { map: null, error: true };
    const candidate = value as { selected?: unknown; links?: unknown };
    if (!Array.isArray(candidate.selected) || !Array.isArray(candidate.links)) return { map: null, error: true };
    if (!candidate.selected.every((id): id is string => typeof id === "string" && validInterestIds.has(id))) return { map: null, error: true };
    const selected = [...new Set(candidate.selected)];
    const links: string[][] = [];
    for (const link of candidate.links) {
      if (!Array.isArray(link) || link.length !== 2) return { map: null, error: true };
      const [a, b] = link;
      if (typeof a !== "string" || typeof b !== "string" || a === b || !selected.includes(a) || !selected.includes(b)) return { map: null, error: true };
      if (!links.some(([left, right]) => (left === a && right === b) || (left === b && right === a))) links.push([a, b]);
    }
    return { map: { selected, links }, error: false };
  } catch {
    return { map: null, error: true };
  }
}

export function CuriosityMap() {
  const [stored] = useState(readSavedMap);
  const [selected, setSelected] = useState<string[]>(() => stored.map?.selected ?? initialSelected);
  const [links, setLinks] = useState<string[][]>(() => stored.map?.links ?? initialLinks);
  const [pending, setPending] = useState<string | null>(null);
  const [saved, setSaved] = useState(Boolean(stored.map));
  const [active, setActive] = useState("botany");
  const [notice, setNotice] = useState(stored.error ? "A saved map could not be read. Start a fresh map or save again." : stored.map ? "Restored your last saved map from this session." : "");

  const visible = useMemo(() => interests.filter((item) => selected.includes(item.id)), [selected]);
  const activeInterest = interests.find((item) => item.id === active && selected.includes(item.id)) ?? visible[0];

  const saveMap = () => {
    try {
      window.sessionStorage.setItem(sessionMapKey, JSON.stringify({ selected, links }));
      setSaved(true);
      setNotice("Your map is saved for this browser session.");
    } catch {
      setSaved(false);
      setNotice("Could not save this map in this browser session. Your map is still here.");
    }
  };

  const toggleInterest = (id: string) => {
    setSaved(false);
    setNotice("");
    if (selected.includes(id)) {
      setSelected((items) => items.filter((item) => item !== id));
      setLinks((items) => items.filter(([a, b]) => a !== id && b !== id));
      if (pending === id) setPending(null);
      if (active === id) setActive(selected.find((item) => item !== id) ?? "");
    } else {
      setSelected((items) => [...items, id]);
      setActive(id);
    }
  };

  const chooseNode = (id: string) => {
    setActive(id);
    setSaved(false);
    if (!pending) {
      setPending(id);
      setNotice("Choose another interest to draw a connection.");
      return;
    }
    if (pending === id) {
      setPending(null);
      setNotice("Connection cancelled.");
      return;
    }
    const exists = links.some(([a, b]) => (a === pending && b === id) || (a === id && b === pending));
    if (exists) {
      setLinks((items) => items.filter(([a, b]) => !((a === pending && b === id) || (a === id && b === pending))));
      setNotice("Connection removed.");
    } else {
      setLinks((items) => [...items, [pending, id]]);
      setNotice("A new thread, found.");
    }
    setPending(null);
  };

  return (
    <main className="cm-page">
      <header className="cm-header">
        <a className="cm-brand" href="#map-top" aria-label="CurioSeek home">
          <img className="cm-brand-logo" src="/__mockup/images/curioseek-apex-logo.png" alt="" /><span>CurioSeek<span className="cm-dot">.</span></span>
        </a>
        <div className="cm-header-center"><span className="cm-live" />A SMALL ATLAS OF WHAT HOLDS YOUR ATTENTION</div>
        <button className="cm-save" type="button" onClick={saveMap}>
          {saved ? "MAP SAVED" : "SAVE THIS MAP"} <span>{saved ? "✓" : "↗"}</span>
        </button>
      </header>

      <section className="cm-intro" id="map-top">
        <div className="cm-intro-copy">
          <p className="cm-kicker"><span /> YOUR CURIOSITY, YOUR WAY</p>
          <h1>Notice what<br />draws you <em>together.</em></h1>
          <p className="cm-intro-text">Choose a few things you keep returning to. Then follow the threads between them. This map belongs to you; it doesn't need to make sense to anyone else.</p>
        </div>
        <div className="cm-intro-aside"><span>FIELD NOTE / 01</span><p>“An interest is a doorway.<br />A connection is a trail.”</p><small>BEGIN WITH A HUNCH</small></div>
      </section>

      <section className="cm-builder" aria-label="Curiosity map builder">
        <aside className="cm-picker">
          <div className="cm-picker-head"><span>01 / PICK YOUR SIGNALS</span><span>{String(selected.length).padStart(2, "0")} CHOSEN</span></div>
          <h2>What have you<br />been noticing?</h2>
          <p className="cm-picker-hint">Choose at least two. There are no wrong combinations.</p>
          <div className="cm-interest-list">
            {interests.map((item) => {
              const chosen = selected.includes(item.id);
              return <button key={item.id} type="button" className={`cm-interest${chosen ? " is-chosen" : ""}`} style={{ "--interest": item.color } as CSSProperties} onClick={() => toggleInterest(item.id)} aria-pressed={chosen}>
                <span className="cm-interest-check">{chosen ? "×" : "+"}</span><span className="cm-interest-label"><small>{item.category}</small><strong>{item.label}</strong></span><span className="cm-interest-arrow">↗</span>
              </button>;
            })}
          </div>
          <div className="cm-picker-foot"><span>YOU CAN CHANGE THIS ANYTIME</span><span>✳</span></div>
        </aside>

        <div className="cm-map-panel">
          <div className="cm-map-head"><div><span>02 / MAKE THE CONNECTIONS</span><h2>Your field of view</h2></div><span className="cm-map-count">{visible.length} SIGNALS&nbsp; · &nbsp;{links.length} THREADS</span></div>
          <div className="cm-map-canvas" role="group" aria-label="Interactive map of selected interests">
            <div className="cm-map-grid" />
            <svg className="cm-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {links.map(([a, b], index) => {
                const from = interests.find((item) => item.id === a);
                const to = interests.find((item) => item.id === b);
                if (!from || !to) return null;
                return <g key={`${a}-${b}`} className="cm-link-line"><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} /><circle cx={(from.x + to.x) / 2} cy={(from.y + to.y) / 2} r="1.1" /><text x={(from.x + to.x) / 2 + 1.5} y={(from.y + to.y) / 2 - 1.5}>{String(index + 1).padStart(2, "0")}</text></g>;
              })}
            </svg>
            {visible.map((item, index) => <button key={item.id} type="button" className={`cm-node${active === item.id ? " is-active" : ""}${pending === item.id ? " is-pending" : ""}`} style={{ "--node": item.color, "--x": `${item.x}%`, "--y": `${item.y}%` } as CSSProperties} onClick={() => chooseNode(item.id)} aria-label={`${item.label}${pending ? `, connect to ${pending}` : ", select or connect"}`}>
              <span className="cm-node-orbit" /><span className="cm-node-core">{item.label.slice(0, 1)}</span><span className="cm-node-label"><small>0{index + 1} / {item.category}</small><strong>{item.label}</strong></span>
            </button>)}
            {visible.length === 0 && <div className="cm-empty-map"><span>✳</span><strong>Your map is waiting.</strong><small>Choose an interest to place your first signal.</small></div>}
            <span className="cm-compass">N<br /><i>↑</i></span><span className="cm-map-scale">A LIVING MAP / NOT TO SCALE</span>
          </div>
          <div className="cm-map-instruction"><span className="cm-instruction-icon">↗</span><p>{notice || (pending ? "Now choose another signal to connect these two." : "Tap a signal, then another, to connect the things that feel related.")}</p><button type="button" className="cm-reset" onClick={() => { setSelected(initialSelected); setLinks(initialLinks); setActive("botany"); setPending(null); setSaved(false); setNotice("Back to your first sketch."); }}>START OVER <span>↺</span></button></div>
        </div>
      </section>

      <section className="cm-reflection" aria-live="polite">
        <div className="cm-reflection-mark">✳</div>
        <div className="cm-reflection-copy"><span>03 / FOLLOW A QUESTION</span><h2>{activeInterest ? activeInterest.prompt : "What might be worth following?"}</h2></div>
        <div className="cm-reflection-side"><span>YOUR NEXT TRAILHEAD</span><p>{activeInterest ? `A question from ${activeInterest.label.toLowerCase()}. Let it wander.` : "Add a signal to find a question."}</p></div>
      </section>
      <footer className="cm-footer"><span>CURIOSEEK / PERSONAL FIELD STUDY</span><span>COLLECT A SIGNAL · FOLLOW A THREAD · SEE WHAT GROWS</span><a href="#map-top">BACK TO THE MAP ↑</a></footer>
    </main>
  );
}
