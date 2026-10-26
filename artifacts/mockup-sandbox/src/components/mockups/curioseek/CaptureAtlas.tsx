import { useState } from "react";
import "./CaptureAtlas.css";

const worlds = [
  {
    id: "student",
    number: "01",
    name: "StudentOS",
    mode: "PRIVATE WORKSPACE",
    verb: "Learn deeply",
    description: "A personal learning space for making sense of difficult things, keeping useful ideas, and building a knowledge web that lasts beyond the next test.",
    tools: ["Knowledge wiki", "Study paths", "Reference notes"],
    connection: "Borrow a spark from CreatorOS",
    connectionTo: "creator",
    nearby: "Study paths · reference notes · ideas worth testing",
    color: "#e97868",
    status: "PRIVATE",
  },
  {
    id: "creator",
    number: "02",
    name: "CreatorOS",
    mode: "PRIVATE WORKSPACE",
    verb: "Make freely",
    description: "A roomy workshop for shaping ideas, projects, plans, and connections. A place where a thought can stay yours without needing to become a post.",
    tools: ["Create", "Plan", "Connect"],
    connection: "Follow a question into StudentOS",
    connectionTo: "student",
    nearby: "Plans · creative prompts · knowledge trails",
    color: "#d9aa43",
    status: "PRIVATE",
  },
  {
    id: "life",
    number: "03",
    name: "LifeOS",
    mode: "PROPOSED",
    verb: "Make room",
    description: "An idea still taking shape: a gentler home for everyday systems and private reflection, with space for all the ordinary in-between.",
    tools: ["Everyday systems", "Reflection"],
    connection: "Carry a favorite story into Fandom Vibes",
    connectionTo: "fandom",
    nearby: "Routines · reflections · small discoveries",
    color: "#76a88e",
    status: "IN CONCEPT",
  },
  {
    id: "fandom",
    number: "04",
    name: "Fandom Vibes",
    mode: "PUBLIC EXPERIENCE",
    verb: "Follow a feeling",
    description: "A public C-drama world of guides, playful discoveries, and creative exploration. Vibe Atlas is one doorway into it—not the whole universe.",
    tools: ["Guides", "Games", "Vibe Atlas", "Collections"],
    connection: "Take a story detail into StudentOS",
    connectionTo: "student",
    nearby: "Drama guides · games · collections · Vibe Atlas",
    color: "#9382bb",
    status: "PUBLIC",
  },
];

function RainbowMark() {
  return <img src="/__mockup/images/curioseek-apex-logo.png" alt="" />;
}

function RouteArtwork() {
  return (
    <>
      <svg className="ca-svg ca-desktop-svg" viewBox="0 0 1000 660" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="ca-rainbow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e97868" /><stop offset="31%" stopColor="#d9aa43" />
            <stop offset="60%" stopColor="#76a88e" /><stop offset="100%" stopColor="#9382bb" />
          </linearGradient>
        </defs>
        <path className="ca-route student-link" d="M190 160 C300 160 346 252 447 300" />
        <path className="ca-route creator-link" d="M810 160 C700 160 654 252 553 300" />
        <path className="ca-route life-link" d="M190 500 C300 500 346 408 447 360" />
        <path className="ca-route fandom-link" d="M810 500 C700 500 654 408 553 360" />
        <path className="ca-branch student-link" d="M279 176 C326 108 383 122 426 211 M293 211 C351 196 385 229 410 272" />
        <path className="ca-branch creator-link" d="M721 176 C674 108 617 122 574 211 M707 211 C649 196 615 229 590 272" />
        <path className="ca-branch life-link" d="M279 484 C326 552 383 538 426 449 M293 449 C351 464 385 431 410 388" />
        <path className="ca-branch fandom-link" d="M721 484 C674 552 617 538 574 449 M707 449 C649 464 615 431 590 388" />
        <path className="ca-cross student-link life-link" d="M190 160 C126 270 135 388 190 500" />
        <path className="ca-cross creator-link fandom-link" d="M810 160 C874 270 865 388 810 500" />
        <path className="ca-cross student-link creator-link" d="M190 160 C365 118 630 118 810 160" />
        <path className="ca-cross life-link fandom-link" d="M190 500 C365 542 630 542 810 500" />
        <path className="ca-cross student-link fandom-link" d="M190 160 C360 316 618 365 810 500" />
        <path className="ca-cross creator-link life-link" d="M810 160 C640 316 382 365 190 500" />
        <circle className="ca-junction" cx="343" cy="247" r="5" /><circle className="ca-junction" cx="657" cy="413" r="5" />
        <circle className="ca-junction" cx="343" cy="413" r="5" /><circle className="ca-junction" cx="657" cy="247" r="5" />
        <circle className="ca-junction ca-open-end" cx="447" cy="300" r="5" /><circle className="ca-junction ca-open-end" cx="553" cy="300" r="5" />
        <circle className="ca-junction ca-open-end" cx="447" cy="360" r="5" /><circle className="ca-junction ca-open-end" cx="553" cy="360" r="5" />
      </svg>
      <svg className="ca-svg ca-mobile-svg" viewBox="0 0 400 1120" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="ca-rainbow-mobile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e97868" /><stop offset="31%" stopColor="#d9aa43" />
            <stop offset="60%" stopColor="#76a88e" /><stop offset="100%" stopColor="#9382bb" />
          </linearGradient>
        </defs>
        <path className="ca-route student-link" stroke="url(#ca-rainbow-mobile)" d="M200 128 C98 204 111 266 195 315" />
        <path className="ca-route creator-link" stroke="url(#ca-rainbow-mobile)" d="M200 381 C295 420 285 459 205 500" />
        <path className="ca-route life-link" stroke="url(#ca-rainbow-mobile)" d="M200 739 C100 778 114 835 195 870" />
        <path className="ca-route fandom-link" stroke="url(#ca-rainbow-mobile)" d="M200 991 C300 920 287 898 205 870" />
        <path className="ca-branch student-link" stroke="url(#ca-rainbow-mobile)" d="M200 128 C315 204 274 258 205 315 M150 180 C90 152 82 190 112 220" />
        <path className="ca-branch creator-link" stroke="url(#ca-rainbow-mobile)" d="M200 381 C87 412 116 466 195 500 M249 418 C330 385 325 449 286 466" />
        <path className="ca-branch life-link" stroke="url(#ca-rainbow-mobile)" d="M200 739 C318 772 276 827 205 870 M150 791 C82 770 84 816 116 837" />
        <path className="ca-branch fandom-link" stroke="url(#ca-rainbow-mobile)" d="M200 991 C90 924 121 897 195 870 M249 934 C329 964 319 911 284 891" />
        <path className="ca-cross student-link creator-link" d="M200 128 C370 238 35 284 200 381" />
        <path className="ca-cross creator-link life-link" d="M200 381 C32 524 370 603 200 739" />
        <path className="ca-cross life-link fandom-link" d="M200 739 C370 810 40 920 200 991" />
        <path className="ca-cross student-link life-link" d="M200 128 C40 400 366 550 200 739" />
        <path className="ca-cross creator-link fandom-link" d="M200 381 C360 555 40 740 200 991" />
        <circle className="ca-junction" cx="200" cy="315" r="5" /><circle className="ca-junction" cx="200" cy="500" r="5" />
        <circle className="ca-junction" cx="200" cy="870" r="5" />
      </svg>
    </>
  );
}

export function CaptureAtlas() {
  const [selected, setSelected] = useState(worlds[0]);
  return (
    <main className="capture-atlas" id="capture-top">
      <header className="ca-wrap ca-header">
        <a className="ca-brand" href="#capture-top" aria-label="CurioSeek home"><RainbowMark /><span>CurioSeek</span></a>
        <nav className="ca-nav" aria-label="Page navigation">
          <a href="#atlas">The atlas</a><a href="#connections">Open paths</a><a href="#reading">How to read it</a>
        </nav>
        <span className="ca-edition"><i /> FIELD ATLAS / 02</span>
      </header>

      <section className="ca-wrap ca-hero">
        <div>
          <p className="ca-kicker"><b>CURIOSEEK</b> / A MANY-WORLD SYSTEM</p>
          <h1>Four worlds.<br /><em>A thousand ways between.</em></h1>
          <p className="ca-lede">Learn something deeply. Make an idea yours. Find a little more room. Follow the stories you love. CurioSeek is the open field where these worlds—and their unexpected connections—can take shape.</p>
        </div>
        <div className="ca-coordinate"><strong>CS—02</strong><span>OPEN NETWORK</span><span>BRANCHING PATHS</span><span>SEPARATE LANGUAGES</span></div>
      </section>

      <section className="ca-wrap ca-map-section" id="atlas">
        <div className="ca-map-title">
          <div><p className="ca-kicker">01 / THE CONNECTIVE FIELD</p><h2>Paths can cross.<br /><em>Worlds stay distinct.</em></h2></div>
          <p>Select a world to explore what belongs there and which nearby paths it opens. Connections are invitations, not a prescribed route.</p>
        </div>
        <div className="ca-map" id="connections" data-selected={selected.id}>
          <span className="ca-map-caption">NEURAL ATLAS · OPEN ENDED PATHS · FOUR DISTINCT WORLDS</span>
          <RouteArtwork />
          {worlds.map((world) => (
            <button key={world.id} type="button" className={`ca-world ${selected.id === world.id ? "is-active" : ""}`} data-world={world.id} onClick={() => setSelected(world)} aria-pressed={selected.id === world.id}>
              <span className="ca-soma"><i /></span><span className="ca-world-copy"><small>{world.number} / {world.mode}</small><strong>{world.name}</strong><em>{world.verb}</em></span><span className="ca-world-status">{world.status}</span>
            </button>
          ))}
          <span className="ca-engine e1" data-tone="coral">Knowledge trails</span>
          <span className="ca-engine e2" data-tone="gold">Creative sparks</span>
          <span className="ca-engine e3" data-tone="mint">Everyday rhythms</span>
          <span className="ca-engine e4" data-tone="lilac">Drama discoveries</span>
          <span className="ca-map-foot">FOUR WORLDS · OPEN-ENDED CONNECTIONS</span>
        </div>
        <div className="ca-detail" aria-live="polite">
          <span className="ca-detail-mark" style={{ backgroundColor: selected.color }}>{selected.number}</span>
          <div className="ca-detail-title"><small>{selected.mode}</small><h3>{selected.name}</h3></div>
          <p>{selected.description}<br /><strong>Nearby: {selected.nearby}.</strong></p>
          <div className="ca-tool-list">{selected.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
          <button className="ca-connection" type="button" onClick={() => setSelected(worlds.find((world) => world.id === selected.connectionTo) ?? worlds[0])}>
            {selected.connection} <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>

      <section className="ca-wrap ca-reading" id="reading">
        <div><p className="ca-kicker">02 / READING THE ROUTES</p><h2>Follow what connects.<br /><em>Keep what makes it yours.</em></h2></div>
        <div className="ca-reading-copy">
          <p>CurioSeek makes room for different kinds of curiosity. Every world has its own pace and point of view; the map leaves space for discoveries to cross between them.</p>
          <p>A question can lead to a new study trail. A small spark can find its way into a project. A detail from a drama can become a guide someone else loves. Choose a starting point, then follow what catches your attention.</p>
          <div className="ca-legend">
            <span><i className="c" /> StudentOS · private learning</span><span><i className="g" /> CreatorOS · private making</span>
            <span><i className="m" /> LifeOS · proposed</span><span><i className="l" /> Fandom Vibes · public</span>
          </div>
        </div>
      </section>
      <section className="ca-wrap ca-invitation" id="invitation">
        <span>AN OPEN INVITATION<br />START ANYWHERE</span>
        <p><strong>Follow a question, a project, a daily rhythm, or a story.</strong> Pick one of the four worlds above and let a nearby connection become your next path.</p>
      </section>
      <footer className="ca-wrap ca-footer">
        <a className="ca-brand" href="#capture-top"><RainbowMark /><span>CurioSeek</span></a>
        <span>AN ATLAS FOR A MANY-SIDED LIFE</span>
        <a href="#capture-top">Return to the atlas ↑</a>
      </footer>
    </main>
  );
}
