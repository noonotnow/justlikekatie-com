import { useState, type CSSProperties } from "react";
import "./fielddesk.css";

const domains = [
  {
    id: "learn",
    index: "01",
    name: "StudentOS",
    mode: "LEARN",
    status: "PRIVATE SPACE",
    color: "#d56f50",
    title: "Follow a question\nall the way down.",
    description:
      "A study room for deep work: learning paths, practice-question review, and a personal wiki where ideas can find one another.",
    signal: "A question you can't quite leave alone",
    tools: ["Study paths", "Practice review", "Knowledge wiki"],
    note: "Built for understanding, not streaks.",
  },
  {
    id: "make",
    index: "02",
    name: "CreatorOS",
    mode: "MAKE",
    status: "PRIVATE SPACE",
    color: "#b37b1c",
    title: "Make room for\nunfinished things.",
    description:
      "A creative workstation for capturing, shaping, and connecting ideas—without turning every thought into something to publish.",
    signal: "A sketch, fragment, or maybe",
    tools: ["Idea capture", "Creative planning", "Connected projects"],
    note: "The workshop comes before the audience.",
  },
  {
    id: "notice",
    index: "03",
    name: "LifeOS",
    mode: "NOTICE",
    status: "STILL TAKING SHAPE",
    color: "#66856b",
    title: "Notice what helps\na day hold together.",
    description:
      "A proposed home for useful routines and private reflections. This path is still becoming—not yet a shipped workspace.",
    signal: "A small rhythm worth keeping",
    tools: ["Gentle routines", "Private reflections", "Everyday systems"],
    note: "A possibility, not a promise.",
  },
  {
    id: "love",
    index: "04",
    name: "Fandom Vibes",
    mode: "LOVE",
    status: "PUBLIC DOORWAY",
    color: "#8b6c9a",
    title: "Stay with the feeling\na story leaves behind.",
    description:
      "A public C-drama world of guides, games, and creative discoveries. Start with the Vibe Atlas, then follow whatever catches your eye.",
    signal: "A scene that stays after the credits",
    tools: ["C-drama guides", "Vibe Atlas", "Playful discoveries"],
    note: "Open to anyone; made for curious fans.",
  },
];

export function FieldDesk() {
  const [activeId, setActiveId] = useState("learn");
  const [showNote, setShowNote] = useState(false);
  const active = domains.find((domain) => domain.id === activeId) ?? domains[0];

  return (
    <main className="fielddesk" id="fielddesk-top">
      <header className="fd-topbar">
        <a className="fd-wordmark" href="#fielddesk-top" aria-label="CurioSeek home">
          <span className="fd-mark"><img src="/__mockup/images/curioseek-apex-logo.png" alt="" /></span>
          <span>CurioSeek<span className="fd-period">.</span></span>
        </a>
        <div className="fd-top-context"><span className="fd-live-dot" />A FIELD GUIDE TO A MANY-SIDED LIFE</div>
        <a className="fd-index-link" href="#fd-about">THE IDEA <span>↘</span></a>
      </header>

      <section className="fd-workspace" aria-label="Explore CurioSeek pathways">
        <aside className="fd-rail">
          <div className="fd-rail-label"><span>FIELD INDEX</span><span>04 MODES</span></div>
          <p className="fd-rail-intro">One life.<br />Different ways in.</p>
          <div className="fd-path-list" role="tablist" aria-label="CurioSeek pathways">
            {domains.map((domain) => (
              <button
                key={domain.id}
                className={`fd-path${active.id === domain.id ? " is-active" : ""}`}
                type="button"
                role="tab"
                id={`fd-tab-${domain.id}`}
                aria-selected={active.id === domain.id}
                aria-controls="fd-active-panel"
                onClick={() => { setActiveId(domain.id); setShowNote(false); }}
                style={{ "--path-color": domain.color } as CSSProperties}
              >
                <span className="fd-path-index">{domain.index}</span>
                <span className="fd-path-text"><strong>{domain.name}</strong><small>{domain.mode}</small></span>
                <span className="fd-path-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <div className="fd-rail-foot"><span>NOT A PIPELINE</span><span>01 — 04</span></div>
        </aside>

        <section
          className="fd-focus"
          id="fd-active-panel"
          role="tabpanel"
          aria-labelledby={`fd-tab-${active.id}`}
          style={{ "--active-color": active.color } as CSSProperties}
        >
          <div className="fd-focus-meta">
            <span><b>{active.index}</b> / PATHWAY</span>
            <span className="fd-status"><i />{active.status}</span>
          </div>
          <div className="fd-focus-main">
            <div className="fd-copy">
              <p className="fd-eyebrow"><span className="fd-eyebrow-dash" />{active.mode} / CURIOSITY IN MOTION</p>
              <h1>{active.title.split("\n").map((line, index) => <span key={line}>{index === 1 ? <em>{line}</em> : line}<br /></span>)}</h1>
              <p className="fd-description">{active.description}</p>
              <div className="fd-signal"><span className="fd-signal-mark">✳</span><span><small>START WITH A SIGNAL</small><strong>{active.signal}</strong></span></div>
            </div>
            <div className="fd-orbit-art" aria-hidden="true">
              <div className="fd-orbit fd-orbit-outer" />
              <div className="fd-orbit fd-orbit-inner" />
              <span className="fd-orbit-cross fd-cross-a">+</span><span className="fd-orbit-cross fd-cross-b">+</span>
              <div className="fd-orbit-core"><span className="fd-core-glyph">{active.mode === "LEARN" ? "?" : active.mode === "MAKE" ? "✳" : active.mode === "NOTICE" ? "◌" : "♡"}</span><small>{active.mode}</small></div>
              <span className="fd-orbit-tag fd-tag-a">FOLLOW</span><span className="fd-orbit-tag fd-tag-b">NOTICE</span>
              <span className="fd-orbit-stamp">CURIOSITY<br />HAS MANY<br />DOORS</span>
            </div>
          </div>
          <div className="fd-focus-foot">
            <span>THE WORK, IN THIS ROOM</span>
            <div className="fd-tool-list">{active.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
          </div>
        </section>

        <aside className="fd-side">
          <div className="fd-side-top"><span>FIELD NOTE</span><span>CS / {active.index}</span></div>
          <div className="fd-side-content">
            <span className="fd-side-symbol">{active.index}<i>✳</i></span>
            <p className="fd-side-kicker">A DIFFERENT KIND OF SYSTEM</p>
            <h2>{active.note}</h2>
            <p className="fd-side-description">CurioSeek gives each kind of attention its own room. Follow a pathway to see what belongs there—and what doesn't.</p>
            <button className="fd-note-button" onClick={() => setShowNote((open) => !open)} type="button" aria-expanded={showNote}>
              {showNote ? "Close the note" : "Read the field note"} <span>{showNote ? "−" : "↗"}</span>
            </button>
            {showNote && <div className="fd-note-reveal">Some interests need structure. Others need play, quiet, or a place to begin. No single room has to hold a whole person.</div>}
          </div>
          <div className="fd-side-bottom"><span>PRIVATE / PUBLIC / BECOMING</span><span>↗</span></div>
        </aside>
      </section>

      <section className="fd-bottom-band" id="fd-about">
        <div className="fd-band-mark">↗</div>
        <div className="fd-band-title"><span>THE CURIOSITY CYCLE</span><h2>Collect signals <i>→</i> Shape systems <i>→</i> See what grows.</h2></div>
        <p>Not a funnel. Not a content machine. A landscape for the things worth following.</p>
        {active.id === "love" && <a className="fd-public-link" href="https://fandom.justlikekatie.com" target="_blank" rel="noreferrer">Visit Fandom Vibes ↗</a>}
      </section>
      <footer className="fd-footer"><span>CURIO SEEK / FIELD STUDY 01</span><span>A MAP OF WHAT MATTERS TO YOU.</span><a href="#fielddesk-top">BACK TO THE INDEX ↑</a></footer>
    </main>
  );
}
