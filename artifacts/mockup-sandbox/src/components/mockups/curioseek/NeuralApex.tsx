import { useState, type CSSProperties } from "react";
import "./NeuralApex.css";

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
    color: "#e87455",
    light: "#f8e4dc",
    description: "Study paths, practice, and a growing web of knowledge.",
    note: "A private learning space for deep study, practice-question review, and a personal knowledge wiki.",
  },
  {
    name: "CreatorOS",
    short: "MAKE",
    color: "#e4ad32",
    light: "#f6edcf",
    description: "A creative workstation for ideas in motion.",
    note: "Capture, create, plan, and connect ideas—without asking every idea to become a post.",
  },
  {
    name: "LifeOS",
    short: "NOTICE",
    color: "#6f9b73",
    light: "#e3ebdc",
    description: "A gentler home for the systems that hold everyday life.",
    note: "A proposed area for useful routines and private reflections. Still taking shape, not yet a shipped workspace.",
  },
  {
    name: "Fandom Vibes",
    short: "LOVE",
    color: "#a278b1",
    light: "#eee2ef",
    description: "A C-drama world of guides, games, and discoveries.",
    note: "A public doorway to C-drama guides, playful tools, and creative discoveries—including Vibe Atlas.",
  },
];

const paths = [
  "M 300 247 C 260 200 242 172 199 147 C 154 121 105 119 66 87",
  "M 300 247 C 345 201 360 166 402 144 C 448 120 492 119 529 82",
  "M 300 247 C 260 295 239 326 201 352 C 158 381 111 383 71 421",
  "M 300 247 C 342 295 363 325 403 351 C 445 378 490 386 530 421",
];

export function NeuralApex() {
  const [openDomain, setOpenDomain] = useState<string | null>(null);

  return (
    <main className="neural-apex" id="na-top">
      <div className="na-shell">
        <header className="na-nav">
          <a className="na-brand" href="#na-top" aria-label="CurioSeek home">
            <span className="na-brand-mark"><img src="/__mockup/images/curioseek-apex-logo.png" alt="" /></span>
            <span>CurioSeek<span className="na-brand-dot">.</span></span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#na-domains">The landscape</a>
            <a href="#na-method">How it connects</a>
            <a href="#na-public">A public doorway</a>
          </nav>
          <span className="na-concept"><i />APEX / FIELD STUDY</span>
        </header>

        <section className="na-hero">
          <div className="na-hero-copy">
            <div className="na-eyebrow"><span className="na-eyebrow-line" />A personal atlas for curiosity</div>
            <h1>Many signals.<br />One <em>living mind.</em></h1>
            <p className="na-lede">CurioSeek is a place for the things worth following—learning deeply, making things, finding your systems, and loving what you love.</p>
            <div className="na-actions">
              <a className="na-button" href="#na-domains">Explore the pathways <span aria-hidden="true">↘</span></a>
              <a className="na-quiet-link" href="#na-method">A little about the idea</a>
            </div>
            <div className="na-hero-foot"><span>01 / 04</span><span>Different rooms for different attention.</span></div>
          </div>

          <div className="na-neuron" aria-label="A green CurioSeek emblem at the center of four colorful connected pathways">
            <div className="na-orbit na-orbit-one" />
            <div className="na-orbit na-orbit-two" />
            <svg className="na-branches" viewBox="0 0 600 500" role="img" aria-hidden="true">
              {paths.map((path, index) => <path key={path} d={path} className={`na-branch na-branch-${index}`} />)}
              <path className="na-spine" d="M 300 247 C 300 178 299 117 300 57" />
              <path className="na-spine" d="M 300 247 C 300 323 300 379 300 443" />
              <path className="na-spine" d="M 300 247 C 216 247 161 249 101 247" />
              <path className="na-spine" d="M 300 247 C 383 247 439 248 500 247" />
              {[["66","87",0],["529","82",1],["71","421",2],["530","421",3],["300","57",4],["300","443",5],["101","247",6],["500","247",7]].map(([x,y,index]) => (
                <circle key={index} cx={x} cy={y} r="5" className={`na-terminal na-terminal-${index}`} />
              ))}
            </svg>
            <span className="na-node-label na-node-a">LEARN <i /></span>
            <span className="na-node-label na-node-b"><i /> MAKE</span>
            <span className="na-node-label na-node-c">NOTICE <i /></span>
            <span className="na-node-label na-node-d"><i /> LOVE</span>
            <div className="na-core">
              <div className="na-core-emblem"><img src="/__mockup/images/curioseek-apex-logo.png" alt="CurioSeek emblem" /></div>
              <span>one life,<br /><em>many ways in</em></span>
            </div>
            <span className="na-orbit-note">A PERSONAL ATLAS <b>✳</b> VOL. 01</span>
            <span className="na-satellite na-satellite-a">?</span>
            <span className="na-satellite na-satellite-b">✳</span>
          </div>
        </section>

        <div className="na-ribbon" aria-label="CurioSeek doctrine">
          <span>Collect signals</span><b>↗</b><span>Shape systems</span><b>↗</b><span>Move mountains</span>
          <span className="na-ribbon-caption">THE CURIOSITY CYCLE</span>
        </div>

        <section className="na-intro" id="na-method">
          <div className="na-section-index"><span>01</span><i />THE BIGGER PICTURE</div>
          <div className="na-intro-content">
            <h2>Not a funnel.<br /><em>A whole landscape.</em></h2>
            <div className="na-intro-aside">
              <span className="na-aside-mark">↗</span>
              <p>Some interests want structure. Some want a sketchbook. Some are better left private. CurioSeek makes room for all of them—without turning a person into a content calendar.</p>
            </div>
          </div>
        </section>

        <section className="na-domains" id="na-domains">
          <div className="na-domain-heading">
            <div><span className="na-micro">02 / THE CONNECTED DOMAINS</span><h2>Four pathways.<br /><em>One curious life.</em></h2></div>
            <p>Like neurons in a living network, each domain has its own job—and its own way of connecting.</p>
          </div>
          <div className="na-domain-grid">
            {domains.map((domain, index) => {
              const open = openDomain === domain.name;
              const detailId = `na-detail-${index}`;
              return (
                <article className={`na-domain na-domain-${index}${open ? " is-open" : ""}`} key={domain.name} style={{ "--domain": domain.color, "--domain-soft": domain.light } as CSSProperties}>
                  <div className="na-domain-top"><span>NODE / 0{index + 1}</span><span className="na-node-status">{index === 2 ? "PROPOSED" : index === 3 ? "PUBLIC" : "PRIVATE"}</span></div>
                  <span className="na-domain-orbit" aria-hidden="true"><i /></span>
                  <div className="na-domain-name"><span>{domain.short}</span><h3>{domain.name}</h3></div>
                  <p>{domain.description}</p>
                  <button type="button" className="na-domain-toggle" aria-expanded={open} aria-controls={detailId} onClick={() => setOpenDomain(open ? null : domain.name)}>
                    {open ? "Close field note" : "Read field note"} <span aria-hidden="true">{open ? "−" : "↗"}</span>
                  </button>
                  {open && <div className="na-domain-detail" id={detailId}>{domain.note}</div>}
                </article>
              );
            })}
          </div>
          <div className="na-domain-foot"><span>NOT EVERY PATH IS OPEN YET</span><span>The map distinguishes what is private, public, and still becoming.</span></div>
        </section>
      </div>

      <section className="na-creative">
        <div className="na-creative-inner">
          <div className="na-creative-title">
            <span className="na-micro">03 / KEEP THE EDGES HUMAN</span>
            <h2>Creativity is bigger<br />than <em>publishing.</em></h2>
            <div className="na-creative-stamp">MAKE<br />ROOM<br /><b>↗</b></div>
          </div>
          <div className="na-creative-copy">
            <p className="na-creative-lead">Making can be private, playful, unfinished, or just for you.</p>
            <p>CreatorOS is a workstation for that full creative life—not a machine that turns every thought into content. When you do want to share, a focused content engine can help shape a chosen idea.</p>
            <div className="na-distinction">
              <div><span>THE WORKSHOP</span><strong>Capture. Create. Plan. Connect.</strong><small>Journaling remains its own personal practice.</small></div>
              <div><span>THE OUTWARD PATH</span><strong>Selected work may be shared.</strong><small>The choice belongs to the maker.</small></div>
            </div>
          </div>
        </div>
      </section>

      <div className="na-shell">
        <section className="na-practice">
          <div className="na-practice-head">
            <span className="na-micro">04 / A PRACTICE, NOT A PIPELINE</span>
            <h2>Pay attention.<br /><em>See what grows.</em></h2>
          </div>
          <div className="na-practice-steps">
            <article><span className="na-step-num">01 — GATHER <b>↘</b></span><h3>Collect signals</h3><p>Keep the detail that catches your eye: a question, a pattern, a scene, a stray idea.</p></article>
            <article><span className="na-step-num">02 — ARRANGE <b>↘</b></span><h3>Shape systems</h3><p>Give recurring curiosities a useful place to meet, without forcing them into the same shape.</p></article>
            <article><span className="na-step-num">03 — BECOME <b>↘</b></span><h3>Move mountains</h3><p>Let small observations add up to something you could not have planned at the start.</p></article>
          </div>
        </section>

        <section className="na-public" id="na-public">
          <div className="na-public-copy">
            <span className="na-micro">A PUBLIC DOORWAY / FANDOM VIBES</span>
            <h2>For the feeling<br />a story leaves <em>behind.</em></h2>
            <p>Follow a C-drama curiosity through guides, games, and creative discoveries. Explore its atmosphere with Vibe Atlas, then keep going—there’s more here than one way to play.</p>
            <a className="na-button" href="https://fandom.justlikekatie.com" target="_blank" rel="noreferrer">Visit Fandom Vibes <span aria-hidden="true">↗</span></a>
          </div>
          <div className="na-vibe-art" aria-label="Fandom Vibes visual studies">
            <div className="na-vibe-card na-vibe-one"><div className="na-vibe-sun" /><div className="na-vibe-horizon" /><span>01 / HUSH & LIGHT</span></div>
            <div className="na-vibe-card na-vibe-two"><div className="na-vibe-moon" /><div className="na-vibe-mountains" /><span>02 / AFTER RAIN</span></div>
            <div className="na-vibe-caption">VIBE ATLAS <b>氛围图鉴</b></div>
          </div>
        </section>

        <aside className="na-map-note"><span className="na-note-star">✳</span><div><span className="na-micro">A NOTE ON THIS MAP</span><p>CurioSeek is an umbrella concept. Some paths are private workspaces, some are public, and some are still taking shape. This is an invitation to understand the landscape—not a claim that every room is open.</p></div></aside>
        <footer className="na-footer">
          <a className="na-brand" href="#na-top"><span className="na-brand-mark"><img src="/__mockup/images/curioseek-apex-logo.png" alt="" /></span><span>CurioSeek<span className="na-brand-dot">.</span></span></a>
          <small>A FIELD GUIDE FOR A MANY-SIDED LIFE · CONCEPT</small>
          <a className="na-back-top" href="#na-top">Back to the beginning ↑</a>
        </footer>
      </div>
    </main>
  );
}
