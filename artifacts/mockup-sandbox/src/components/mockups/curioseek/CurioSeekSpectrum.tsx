import { useState, type CSSProperties } from "react";
import "./curioseekspectrum.css";

type Domain = {
  name: string;
  short: string;
  status: string;
  color: string;
  light: string;
  description: string;
  note: string;
};

const domains: Domain[] = [
  {
    name: "StudentOS",
    short: "LEARN",
    status: "PRIVATE WORKSPACE",
    color: "#df765e",
    light: "#f8e7df",
    description: "A private place for study, practice, and a growing web of knowledge.",
    note: "A private learning space for deep study, practice-question review, and a personal knowledge wiki.",
  },
  {
    name: "CreatorOS",
    short: "MAKE",
    status: "PRIVATE WORKSPACE",
    color: "#c49127",
    light: "#f5edcf",
    description: "A private creative workstation for ideas in motion.",
    note: "Capture, create, plan, and connect ideas—without asking every idea to become a post.",
  },
  {
    name: "LifeOS",
    short: "NOTICE",
    status: "PROPOSED",
    color: "#54836b",
    light: "#e3ede2",
    description: "Everyday operations and the ties between different parts of life.",
    note: "A proposal for coordinating everyday operations across domains: routines, commitments, and the practical details that help a many-sided life hold together. It is not a shipped workspace.",
  },
  {
    name: "Fandom Vibes",
    short: "LOVE",
    status: "PUBLIC WORLD",
    color: "#9b6eaa",
    light: "#eee5f0",
    description: "A C-drama world of guides, games, and discoveries.",
    note: "The public C-drama world brings together guides, games, and a content engine. Vibe Atlas is one experience within Fandom Vibes: a concept preview for exploring the atmosphere a story leaves behind.",
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
              <span className="sp-overline">An atlas for a many-sided life</span>
              <h1>One curious<br />life. <em>Many ways<br />in.</em></h1>
              <p>Study, make, tend the everyday, or follow a story into its world. CurioSeek is a map of distinct interests, each with room to be its own thing.</p>
              <a className="sp-button" href="#sp-worlds">Explore the worlds <span aria-hidden="true">↘</span></a>
              <div className="sp-hero-index"><strong>01—04</strong><span>Private, proposed, and public by design.</span></div>
            </div>

            <div className="sp-visual" aria-label="Atlas illustration: a green CurioSeek emblem connected to four distinct fields">
              <span className="sp-visual-caption sp-caption-top">A SMALL MAP OF MANY THINGS</span>
              <span className="sp-visual-number">FIG. 01</span>
              <div className="sp-orbit sp-orbit-a" />
              <div className="sp-orbit sp-orbit-b" />
              <div className="sp-world-island sp-island-learn"><i /><span>LEARN</span><small>StudentOS · private</small></div>
              <div className="sp-world-island sp-island-make"><i /><span>MAKE</span><small>CreatorOS · private</small></div>
              <div className="sp-world-island sp-island-notice"><i /><span>NOTICE</span><small>LifeOS · proposed</small></div>
              <div className="sp-world-island sp-island-love"><i /><span>LOVE</span><small>Fandom Vibes · public</small></div>
              <div className="sp-core">
                <span className="sp-core-mark"><img src="/__mockup/images/curioseek-apex-logo.png" alt="CurioSeek emblem" /></span>
                <span>one curious life,<br /><em>many ways in</em></span>
              </div>
              <span className="sp-spark sp-spark-a">✳</span>
              <span className="sp-spark sp-spark-b">✳</span>
              <span className="sp-visual-caption sp-caption-bottom">THE CURIOSITY CYCLE <b>↗</b> KEEP WANDERING</span>
            </div>
            <div className="sp-mobile-destinations" aria-label="Explore the CurioSeek worlds">
              {domains.map((domain) => {
                const open = openDomain === domain.name;
                return (
                  <button
                    className={`sp-mobile-destination${open ? " is-selected" : ""}`}
                    key={domain.name}
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenDomain(open ? null : domain.name)}
                    style={{ "--domain": domain.color, "--domain-soft": domain.light } as CSSProperties}
                  >
                    <span className="sp-mobile-destination-top"><i aria-hidden="true" />{domain.status}</span>
                    <strong>{domain.name}</strong>
                    <span>{domain.description}</span>
                    {open && <small>{domain.note}</small>}
                    <b aria-hidden="true">{open ? "−" : "↗"}</b>
                  </button>
                );
              })}
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
            <div><span className="sp-overline">02 / THE CONNECTED WORLDS</span><h2>Different worlds.<br /><em>Room to explore.</em></h2></div>
            <p>Some are private workspaces. One is public. One is still a proposal. The map keeps those boundaries clear.</p>
          </div>
          <div className="sp-world-grid">
            {domains.map((domain, index) => {
              const open = openDomain === domain.name;
              const detailId = `sp-detail-${index}`;
              return (
                <article className={`sp-world sp-world-${index}${open ? " is-open" : ""}`} key={domain.name} style={{ "--domain": domain.color, "--domain-soft": domain.light } as CSSProperties}>
                  <div className="sp-world-top"><span>WORLD / 0{index + 1}</span><span className="sp-status">{domain.status}</span></div>
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
          <div className="sp-world-foot"><span>AN HONEST MAP</span><span>Private workspaces are not public destinations.</span></div>
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
            <div className="sp-practice-head"><span className="sp-overline">04 / CURIOSITY WITHOUT A FORMULA</span><h2>Notice what<br /><em>holds your gaze.</em></h2></div>
          <div className="sp-steps">
            <article><span>A QUESTION <b>✳</b></span><h3>Stay with it</h3><p>A question, a pattern, a scene, a stray idea. Attention can begin anywhere.</p></article>
            <article><span>A PERSONAL RHYTHM <b>✳</b></span><h3>Make room</h3><p>Some curiosities ask for a system. Others need a sketchbook, a game, or no record at all.</p></article>
            <article><span>A NEW CONNECTION <b>✳</b></span><h3>Let it surprise you</h3><p>Interesting things may connect across a life—or stay happily distinct.</p></article>
          </div>
        </section>

        <section className="sp-public" id="sp-public">
          <div className="sp-public-copy"><span className="sp-overline">A PUBLIC WORLD / FANDOM VIBES</span><h2>For the feeling<br />a story leaves <em>behind.</em></h2><p>Fandom Vibes is a public C-drama world of guides, games, and a content engine. Vibe Atlas is one concept-preview experience inside it—not the whole world.</p><a className="sp-button" href="#sp-worlds">See the world notes <span aria-hidden="true">↘</span></a><div className="sp-public-status">PUBLIC WORLD <i /> VIBE ATLAS: CONCEPT PREVIEW</div></div>
          <div className="sp-art" aria-label="Vibe Atlas visual studies">
            <div className="sp-art-label">VIBE ATLAS / CONCEPT PREVIEW</div>
            <div className="sp-art-card sp-art-one"><div className="sp-sun" /><div className="sp-hills" /><span>01 / HUSH & LIGHT</span></div>
            <div className="sp-art-card sp-art-two"><div className="sp-moon" /><div className="sp-mountains" /><span>02 / AFTER RAIN</span></div>
            <div className="sp-art-caption">氛围图鉴 <b>—</b> ONE EXPERIENCE WITHIN FANDOM VIBES</div>
          </div>
        </section>

        <aside className="sp-note"><span>✳</span><div><span className="sp-overline">A NOTE ON THIS MAP</span><p>CurioSeek is an umbrella concept. Some paths are private workspaces, some are public, and some are still taking shape. This is an invitation to understand the landscape—not a claim that every room is open.</p></div></aside>
        <footer className="sp-footer"><a className="sp-brand" href="#spectrum-top"><span className="sp-logo"><img src="/__mockup/images/curioseek-apex-logo.png" alt="" /></span><span>CurioSeek<span className="sp-dot">.</span></span></a><small>A FIELD GUIDE FOR A MANY-SIDED LIFE · CONCEPT</small><a href="#spectrum-top">Back to the beginning ↑</a></footer>
      </div>
    </main>
  );
}
