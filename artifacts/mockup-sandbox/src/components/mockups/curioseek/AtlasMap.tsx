import { useState, type CSSProperties } from "react";
import "./AtlasMap.css";

const worlds = [
  {
    id: "student",
    number: "01",
    name: "StudentOS",
    mode: "PRIVATE WORKSPACE",
    verb: "Learn deeply",
    description:
      "Study paths, deliberate practice, and a growing web of knowledge—built for understanding that lasts beyond the next test.",
    color: "coral",
    x: "50%",
    y: "9%",
  },
  {
    id: "creator",
    number: "02",
    name: "CreatorOS",
    mode: "PRIVATE WORKSPACE",
    verb: "Make freely",
    description:
      "A roomy workshop for capturing ideas, shaping projects, and planning what comes next. Not every thought has to become a post.",
    color: "gold",
    x: "84%",
    y: "50%",
  },
  {
    id: "life",
    number: "03",
    name: "LifeOS",
    mode: "PROPOSED",
    verb: "Make room",
    description:
      "An idea still taking shape: a gentler home for everyday systems and private reflection, with space for all the ordinary in-between.",
    color: "mint",
    x: "50%",
    y: "91%",
  },
  {
    id: "fandom",
    number: "04",
    name: "Fandom Vibes",
    mode: "PUBLIC EXPERIENCE",
    verb: "Follow a feeling",
    description:
      "A C-drama world of guides, games, and creative discoveries. Vibe Atlas is one doorway into it—not the whole universe.",
    color: "lilac",
    x: "16%",
    y: "50%",
  },
];

function CurioSeekSymbol() {
  return (
    <span className="am-symbol" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function CurioSeekBrandMark() {
  return <img className="am-brand-mark" src="/__mockup/images/curioseek-apex-logo.png" alt="" />;
}

export function AtlasMap() {
  const [selected, setSelected] = useState(worlds[0]);

  return (
    <main className="atlas-map" id="atlas-top">
      <header className="am-header">
        <a className="am-brand" href="#atlas-top" aria-label="CurioSeek home">
          <CurioSeekBrandMark />
          <span>CurioSeek</span>
        </a>
        <nav className="am-nav" aria-label="Main navigation">
          <a href="#map">The map</a>
          <a href="#legend">How to read it</a>
          <a href="#fandom-note">Fandom Vibes</a>
        </nav>
        <span className="am-edition"><span /> APEX / FIELD MAP 01</span>
      </header>

      <section className="am-intro">
        <div className="am-intro-copy">
          <p className="am-overline"><span>CURIOSEEK</span> / A PERSONAL ATLAS</p>
          <h1>One curious life.<br /><em>Many ways in.</em></h1>
          <p className="am-lede">
            A map of the things worth following: learn something deeply, make
            something yours, find a little more room, love what you love.
          </p>
          <a className="am-jump" href="#map">
            Explore the connections <span aria-hidden="true">↘</span>
          </a>
        </div>
        <aside className="am-coordinate" aria-label="Map coordinates">
          <span className="am-coordinate-mark">CS—01</span>
          <span>INDEPENDENT CURIOSITY</span>
          <span>EST. IN POSSIBILITY</span>
        </aside>
      </section>

      <section className="am-map-section" id="map" aria-labelledby="am-map-title">
        <div className="am-map-heading">
          <div>
            <p className="am-overline">01 / THE LANDSCAPE</p>
            <h2 id="am-map-title">A whole landscape,<br /><em>not a funnel.</em></h2>
          </div>
          <p className="am-map-instruction">Choose a place on the map.<br />Each has its own kind of attention.</p>
        </div>

        <div className="am-map-canvas">
          <div className="am-map-grid" aria-hidden="true" />
          <svg className="am-routes" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="am-rainbow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f17363" />
                <stop offset="34%" stopColor="#e7b64f" />
                <stop offset="67%" stopColor="#66ad8e" />
                <stop offset="100%" stopColor="#9482be" />
              </linearGradient>
            </defs>
            <path className="am-route-shadow" d="M500 84 C620 168 780 181 840 300 C778 420 632 424 500 516 C366 428 218 412 160 300 C218 185 372 168 500 84Z" />
            <path className="am-route-rainbow" d="M500 84 C620 168 780 181 840 300 C778 420 632 424 500 516 C366 428 218 412 160 300 C218 185 372 168 500 84Z" />
            <path className="am-route-inner" d="M500 84 C620 168 780 181 840 300 C778 420 632 424 500 516 C366 428 218 412 160 300 C218 185 372 168 500 84Z" />
            <path className="am-cross-route" d="M500 84 C450 220 450 370 500 516M840 300 C630 270 370 270 160 300" />
          </svg>
          <div className="am-center">
            <span className="am-center-orbit" aria-hidden="true"><i /><i /><i /><i /></span>
            <CurioSeekSymbol />
            <span className="am-center-name">CurioSeek</span>
            <span className="am-center-caption">THE CONNECTIVE TISSUE</span>
          </div>
          {worlds.map((world) => (
            <button
              key={world.id}
              type="button"
              className={`am-node am-node-${world.id}${selected.id === world.id ? " is-selected" : ""}`}
              style={{ "--node-x": world.x, "--node-y": world.y } as CSSProperties}
              onClick={() => setSelected(world)}
              aria-pressed={selected.id === world.id}
              aria-label={`Explore ${world.name}`}
            >
              <span className={`am-node-dot ${world.color}`} />
              <span className="am-node-label">
                <small>{world.number} / {world.mode}</small>
                <strong>{world.name}</strong>
                <em>{world.verb}</em>
              </span>
              <span className="am-node-link" aria-hidden="true">↗</span>
            </button>
          ))}
          <span className="am-map-note am-note-north">A PERSONAL SYSTEM<br />IS NEVER ONE-SIZE-FITS-ALL</span>
          <span className="am-map-note am-note-south">FOUR DISTINCT WORLDS · ONE MANY-SIDED LIFE</span>
          <span className="am-map-compass" aria-hidden="true"><b>N</b><i>✳</i></span>
        </div>

        <div className="am-detail" aria-live="polite">
          <div className={`am-detail-marker ${selected.color}`}>{selected.number}</div>
          <div className="am-detail-title">
            <span>{selected.mode}</span>
            <h3>{selected.name}</h3>
          </div>
          <p>{selected.description}</p>
          <span className="am-detail-arrow" aria-hidden="true">↗</span>
        </div>
      </section>

      <section className="am-reading" id="legend">
        <div className="am-reading-title">
          <p className="am-overline">02 / A NOTE ON THE ROUTES</p>
          <h2>Connected by curiosity.<br /><em>Not collapsed into one.</em></h2>
        </div>
        <div className="am-reading-copy">
          <p>These paths can meet, but they do not have to merge. Learning is not a content strategy. Making can stay private. Everyday life deserves its own shape. And a fandom can be a public world to wander through.</p>
          <div className="am-legend-list">
            <span><i className="coral" /> Private workspaces</span>
            <span><i className="gold" /> Ideas in motion</span>
            <span><i className="mint" /> Still taking shape</span>
            <span><i className="lilac" /> Public experiences</span>
          </div>
        </div>
      </section>

      <section className="am-fandom" id="fandom-note">
        <div className="am-fandom-stamp">A PUBLIC<br />DOORWAY</div>
        <div className="am-fandom-copy">
          <p className="am-overline">04 / A WORLD OF ITS OWN</p>
          <h2>Fandom Vibes</h2>
          <p>For the feeling a story leaves behind. Explore C-drama guides, playful discoveries, and the visual moods of Vibe Atlas / 氛围图鉴.</p>
          <a href="https://fandom.justlikekatie.com" target="_blank" rel="noreferrer">
            Step into Fandom Vibes <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="am-fandom-art" aria-hidden="true">
          <div className="am-art-window"><span>VIBE<br />ATLAS</span><i /></div>
          <span className="am-art-caption">SCENES / FEELINGS / DISCOVERIES</span>
        </div>
      </section>

      <footer className="am-footer">
        <a className="am-brand" href="#atlas-top"><CurioSeekBrandMark /><span>CurioSeek</span></a>
        <span>AN ATLAS FOR A MANY-SIDED LIFE</span>
        <a href="#atlas-top">Return to the map ↑</a>
      </footer>
    </main>
  );
}
