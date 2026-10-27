import { useState, type CSSProperties } from "react";
import "./curioseekspectrum.css";

type Domain = {
  name: string;
  short: string;
  color: string;
  light: string;
  description: string;
  note: string;
};

const domains: Domain[] = [
  {
    name: "StudentOS",
    short: "LEARN",
    color: "#df765e",
    light: "#f8e7df",
    description: "Study paths, practice, and a growing web of knowledge.",
    note: "A private learning space for deep study, practice-question review, and a personal knowledge wiki.",
  },
  {
    name: "CreatorOS",
    short: "MAKE",
    color: "#c49127",
    light: "#f5edcf",
    description: "A creative workstation for ideas in motion.",
    note: "Capture, create, plan, and connect ideas—without asking every idea to become a post.",
  },
  {
    name: "LifeOS",
    short: "NOTICE",
    color: "#54836b",
    light: "#e3ede2",
    description: "A gentler home for the systems that hold everyday life.",
    note: "A proposed area for useful routines and private reflections. Still taking shape, not yet a shipped workspace.",
  },
  {
    name: "Fandom Vibes",
    short: "LOVE",
    color: "#9b6eaa",
    light: "#eee5f0",
    description: "A C-drama world of guides, games, and discoveries.",
    note: "A public doorway to C-drama guides, playful tools, and creative discoveries—including Vibe Atlas.",
  },
];

export function CurioSeekSpectrum() {
  const [openDomain, setOpenDomain] = useState<string | null>(null);

  return (
    <main className="spectrum" id="spectrum-top">
      <div className="sp-shell">
        <header className="sp-nav">
          <a className="sp-brand" href="#spectrum-top" aria-label="CurioSeek home">
            <span className="sp-logo"><img src="/__mockup/images/curioseek-apex-logo.png" alt="" /></span>
            <span>CurioSeek<span className="sp-dot">.</span></span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#sp-worlds">The worlds</a>
            <a href="#sp-method">The idea</a>
            <a href="#sp-public">Public doorway</a>
          </nav>
          <span className="sp-edition">FIELD NOTES <i /> VOL. 01 / 04</span>
        </header>

        <section className="sp-hero">
          <div className="sp-kicker"><span>AN ATLAS FOR THE CURIOUS</span><b>ISSUE Nº 01</b></div>
          <div className="sp-hero-grid">
            <div className="sp-hero-copy">
              <span className="sp-overline">A life in full colour</span>
              <h1>Follow<br />what <em>moves</em><br />you.</h1>
              <p>One mind can hold a thousand kinds of wonder. CurioSeek gives each one room to take its own shape.</p>
              <a className="sp-button" href="#sp-worlds">Enter the atlas <span aria-hidden="true">↘</span></a>
              <div className="sp-hero-index"><strong>01—04</strong><span>Distinct worlds, a shared field.</span></div>
            </div>

            <div className="sp-visual" aria-label="A green CurioSeek emblem rests among four distinct, colorful worlds">
              <span className="sp-visual-caption sp-caption-top">A SMALL MAP OF MANY THINGS</span>
              <span className="sp-visual-number">FIG. 01</span>
              <div className="sp-orbit sp-orbit-a" />
              <div className="sp-orbit sp-orbit-b" />
              <div className="sp-world-island sp-island-learn"><i /><span>LEARN</span><small>StudentOS</small></div>
              <div className="sp-world-island sp-island-make"><i /><span>MAKE</span><small>CreatorOS</small></div>
              <div className="sp-world-island sp-island-notice"><i /><span>NOTICE</span><small>LifeOS · proposed</small></div>
              <div className="sp-world-island sp-island-love"><i /><span>LOVE</span><small>Fandom Vibes</small></div>
              <div className="sp-core">
                <span className="sp-core-mark"><img src="/__mockup/images/curioseek-apex-logo.png" alt="CurioSeek emblem" /></span>
                <span>one life,<br /><em>many ways in</em></span>
              </div>
              <span className="sp-spark sp-spark-a">✳</span>
              <span className="sp-spark sp-spark-b">✳</span>
              <span className="sp-visual-caption sp-caption-bottom">THE CURIOSITY CYCLE <b>↗</b> KEEP WANDERING</span>
            </div>
          </div>
          <div className="sp-colorbar" aria-label="Signature palette">
            <span>LEARN</span><i className="tone-coral" /><i className="tone-gold" /><span>MAKE</span><i className="tone-green" /><span>NOTICE</span><i className="tone-lilac" /><span>LOVE</span>
          </div>
        </section>

        <section className="sp-intro" id="sp-method">
          <div className="sp-section-marker"><span>01</span><i /> A NOTE ON THE WHOLE</div>
          <div className="sp-intro-main">
            <h2>Not one lane.<br /><em>A whole landscape.</em></h2>
            <div className="sp-intro-aside"><b>↗</b><p>Some interests want structure. Some want a sketchbook. Some are better left private. CurioSeek makes room for all of them—without turning a person into a content calendar.</p></div>
          </div>
        </section>

        <section className="sp-worlds" id="sp-worlds">
          <div className="sp-world-heading">
            <div><span className="sp-overline">02 / THE CONNECTED WORLDS</span><h2>Different rooms.<br /><em>One curious life.</em></h2></div>
            <p>Four distinct ways to follow a thread. Find the one that feels like yours.</p>
          </div>
          <div className="sp-world-grid">
            {domains.map((domain, index) => {
              const open = openDomain === domain.name;
              const detailId = `sp-detail-${index}`;
              return (
                <article className={`sp-world sp-world-${index}${open ? " is-open" : ""}`} key={domain.name} style={{ "--domain": domain.color, "--domain-soft": domain.light } as CSSProperties}>
                  <div className="sp-world-top"><span>WORLD / 0{index + 1}</span><span className="sp-status">{index === 2 ? "PROPOSED" : index === 3 ? "PUBLIC" : "PRIVATE"}</span></div>
                  <span className="sp-orb" aria-hidden="true"><i /></span>
                  <div className="sp-world-name"><span>{domain.short}</span><h3>{domain.name}</h3></div>
                  <p>{domain.description}</p>
                  <button type="button" className="sp-toggle" aria-expanded={open} aria-controls={detailId} onClick={() => setOpenDomain(open ? null : domain.name)}>
                    {open ? "Close field note" : "Read field note"} <span aria-hidden="true">{open ? "−" : "↗"}</span>
                  </button>
                  {open && <div className="sp-detail" id={detailId}>{domain.note}</div>}
                </article>
              );
            })}
          </div>
          <div className="sp-world-foot"><span>AN HONEST MAP</span><span>Each label marks a different stage: private, public, or still becoming.</span></div>
        </section>
      </div>

      <section className="sp-feature">
        <div className="sp-feature-inner">
          <div className="sp-feature-title"><span className="sp-overline">03 / KEEP THE EDGES HUMAN</span><h2>Creativity is bigger<br />than <em>publishing.</em></h2><div className="sp-stamp">MAKE<br />ROOM<br /><b>↗</b></div></div>
          <div className="sp-feature-copy">
            <p className="sp-feature-lead">Making can be private, playful, unfinished, or just for you.</p>
            <p>CreatorOS is a workstation for that full creative life—not a machine that turns every thought into content. When you do want to share, a focused content engine can help shape a chosen idea.</p>
            <div className="sp-distinction">
              <div><span>THE WORKSHOP</span><strong>Capture. Create. Plan. Connect.</strong><small>Journaling remains its own personal practice.</small></div>
              <div><span>THE OUTWARD PATH</span><strong>Selected work may be shared.</strong><small>The choice belongs to the maker.</small></div>
            </div>
          </div>
        </div>
      </section>

      <div className="sp-shell">
        <section className="sp-practice">
          <div className="sp-practice-head"><span className="sp-overline">04 / A PRACTICE, NOT A PIPELINE</span><h2>Pay attention.<br /><em>See what grows.</em></h2></div>
          <div className="sp-steps">
            <article><span>01 — GATHER <b>↘</b></span><h3>Collect signals</h3><p>Keep the detail that catches your eye: a question, a pattern, a scene, a stray idea.</p></article>
            <article><span>02 — ARRANGE <b>↘</b></span><h3>Shape systems</h3><p>Give recurring curiosities a useful place to meet, without forcing them into the same shape.</p></article>
            <article><span>03 — BECOME <b>↘</b></span><h3>Move mountains</h3><p>Let small observations add up to something you could not have planned at the start.</p></article>
          </div>
        </section>

        <section className="sp-public" id="sp-public">
          <div className="sp-public-copy"><span className="sp-overline">A PUBLIC DOORWAY / FANDOM VIBES</span><h2>For the feeling<br />a story leaves <em>behind.</em></h2><p>Follow a C-drama curiosity through guides, games, and creative discoveries. Explore its atmosphere with Vibe Atlas, then keep going—there’s more here than one way to play.</p><a className="sp-button" href="https://fandom.justlikekatie.com" target="_blank" rel="noreferrer">Visit Fandom Vibes <span aria-hidden="true">↗</span></a></div>
          <div className="sp-art" aria-label="Vibe Atlas visual studies">
            <div className="sp-art-label">VIBE ATLAS / VISUAL STUDIES</div>
            <div className="sp-art-card sp-art-one"><div className="sp-sun" /><div className="sp-hills" /><span>01 / HUSH & LIGHT</span></div>
            <div className="sp-art-card sp-art-two"><div className="sp-moon" /><div className="sp-mountains" /><span>02 / AFTER RAIN</span></div>
            <div className="sp-art-caption">氛围图鉴 <b>—</b> STORY ATMOSPHERES</div>
          </div>
        </section>

        <aside className="sp-note"><span>✳</span><div><span className="sp-overline">A NOTE ON THIS MAP</span><p>CurioSeek is an umbrella concept. Some paths are private workspaces, some are public, and some are still taking shape. This is an invitation to understand the landscape—not a claim that every room is open.</p></div></aside>
        <footer className="sp-footer"><a className="sp-brand" href="#spectrum-top"><span className="sp-logo"><img src="/__mockup/images/curioseek-apex-logo.png" alt="" /></span><span>CurioSeek<span className="sp-dot">.</span></span></a><small>A FIELD GUIDE FOR A MANY-SIDED LIFE · CONCEPT</small><a href="#spectrum-top">Back to the beginning ↑</a></footer>
      </div>
    </main>
  );
}
