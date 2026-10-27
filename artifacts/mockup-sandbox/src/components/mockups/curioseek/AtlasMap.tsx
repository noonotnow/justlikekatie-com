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
      "A dedicated learning workspace for deep understanding, with a personal knowledge web built to last beyond the next test.",
    color: "coral",
    x: "29%",
    y: "24%",
    mobileX: "68%",
    mobileY: "18%",
    engines: [
      { name: "Knowledge wiki", x: "10%", y: "15%", mobileX: "22%", mobileY: "24%" },
    ],
  },
  {
    id: "creator",
    number: "02",
    name: "CreatorOS",
    mode: "PRIVATE WORKSPACE",
    verb: "Make freely",
    description:
      "A roomy workshop for shaping ideas and projects, and planning what comes next. Not every thought has to become a post.",
    color: "gold",
    x: "71%",
    y: "24%",
    mobileX: "68%",
    mobileY: "40%",
    engines: [
      { name: "Create", x: "90%", y: "13%", mobileX: "28%", mobileY: "40%" },
      { name: "Plan", x: "91%", y: "31%", mobileX: "22%", mobileY: "47%" },
      { name: "Connect", x: "88%", y: "43%", mobileX: "30%", mobileY: "52%" },
    ],
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
    x: "71%",
    y: "77%",
    mobileX: "68%",
    mobileY: "63%",
    engines: [
      { name: "Everyday systems", x: "90%", y: "87%", mobileX: "22%", mobileY: "61%" },
      { name: "Reflection", x: "86%", y: "95%", mobileX: "28%", mobileY: "68%" },
    ],
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
    x: "29%",
    y: "77%",
    mobileX: "68%",
    mobileY: "86%",
    engines: [
      { name: "Guides", x: "10%", y: "59%", mobileX: "22%", mobileY: "78%" },
      { name: "Games", x: "12%", y: "86%", mobileX: "28%", mobileY: "85%" },
      { name: "Vibe Atlas", x: "34%", y: "94%", mobileX: "22%", mobileY: "92%" },
      { name: "Collections", x: "10%", y: "48%", mobileX: "30%", mobileY: "75%" },
    ],
  },
];

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
            <h2 id="am-map-title">A living network.<br /><em>Many paths, no funnel.</em></h2>
          </div>
          <p className="am-map-instruction">CurioSeek is the field around and between these worlds.<br />Each domain keeps its own language and boundaries.</p>
        </div>

        <div className="am-map-canvas am-neural-field">
          <div className="am-map-grid" aria-hidden="true" />
          <span className="am-map-field-label">CURIOSEEK / THE FIELD AROUND &amp; BETWEEN</span>
          {worlds.map((world) => (
            <div className={`am-neuron am-neuron-${world.id}`} key={world.id}>
              <button
                type="button"
                className={`am-node am-node-${world.id}${selected.id === world.id ? " is-selected" : ""}`}
                style={{ "--node-x": world.x, "--node-y": world.y, "--mobile-x": world.mobileX, "--mobile-y": world.mobileY } as CSSProperties}
                onClick={() => setSelected(world)}
                aria-pressed={selected.id === world.id}
                aria-label={`Explore ${world.name}`}
              >
                <span className={`am-soma ${world.color}`} aria-hidden="true"><i /></span>
                <span className="am-node-label">
                  <small>{world.number} / {world.mode}</small>
                  <strong>{world.name}</strong>
                  <em>{world.verb}</em>
                </span>
                <span className="am-node-link" aria-hidden="true">↗</span>
              </button>
              {world.engines.map((engine) => (
                <button
                  type="button"
                  className={`am-engine-node ${world.color}`}
                  key={engine.name}
                  style={{ "--engine-x": engine.x, "--engine-y": engine.y, "--engine-mobile-x": engine.mobileX, "--engine-mobile-y": engine.mobileY } as CSSProperties}
                  onClick={() => setSelected(world)}
                  aria-label={`${engine.name}, part of ${world.name}`}
                  aria-pressed={selected.id === world.id}
                >
                  <span className="am-engine-soma" aria-hidden="true" />
                  <span>{engine.name}</span>
                </button>
              ))}
            </div>
          ))}
          <span className="am-map-note am-note-south">FOUR WORLDS · ROOM TO WANDER</span>
          <span className="am-map-compass" aria-hidden="true"><b>N</b><i>✳</i></span>
        </div>

        <div className="am-detail" aria-live="polite">
          <div className={`am-detail-marker ${selected.color}`}>{selected.number}</div>
          <div className="am-detail-title">
            <span>{selected.mode}</span>
            <h3>{selected.name}</h3>
          </div>
          <p>{selected.description}</p>
          <div className="am-engine-list" role="list" aria-label={`${selected.name} areas`}>
            {selected.engines.map((engine) => <span role="listitem" key={engine.name}>{engine.name}</span>)}
          </div>
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
          <p>CurioSeek is the field around and between these worlds—a place for connections to form while each keeps its own language.</p>
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
          <p>For the feeling a story leaves behind. Explore fandom guides, playful discoveries, and the visual moods of Vibe Atlas / 氛围图鉴. C-drama is the initial focus.</p>
          <div className="am-fandom-links">
            <a href="https://fandom.justlikekatie.com" target="_blank" rel="noreferrer">Open the worlds launcher <span aria-hidden="true">↗</span></a>
            <a href="https://fandom.justlikekatie.com/cdrama" target="_blank" rel="noreferrer">Go straight to C-drama <span aria-hidden="true">↗</span></a>
          </div>
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
