import { useState } from "react";
import "./atlas-index.css";

const worlds = [
  {
    id: "student",
    number: "01",
    name: "StudentOS",
    descriptor: "A place to learn deeply",
    copy: "Follow a question until it becomes something you can call your own.",
    details: "Knowledge wiki · study trails · questions worth keeping",
    color: "coral",
    shape: "paper",
  },
  {
    id: "creator",
    number: "02",
    name: "CreatorOS",
    descriptor: "A place to make freely",
    copy: "Let a passing idea become a project, a plan, or simply a good afternoon.",
    details: "Create · plan · connect",
    color: "gold",
    shape: "collage",
  },
  {
    id: "fandom",
    number: "04",
    name: "Fandom Vibes",
    descriptor: "A place to follow a feeling",
    copy: "Wander through C-drama guides, games, and discoveries made for the love of a story.",
    details: "Guides · games · Vibe Atlas · collections",
    color: "lilac",
    shape: "frame",
  },
  {
    id: "life",
    number: "03",
    name: "LifeOS",
    descriptor: "A place to make room",
    copy: "A gentler home for everyday systems and private reflection, still taking shape.",
    details: "Everyday systems · reflection",
    color: "mint",
    shape: "orb",
  },
];

function WorldMark({ shape }: { shape: string }) {
  return (
    <span className={`af-world-mark af-mark-${shape}`} aria-hidden="true">
      <i /><i /><i />
    </span>
  );
}

export function AtlasIndex() {
  const [openWorld, setOpenWorld] = useState<string | null>(null);

  return (
    <main className="atlas-field">
      <header className="af-header">
        <a className="af-brand" href="#atlas-home" aria-label="CurioSeek home">
          <img src="/__mockup/images/curioseek-apex-logo.png" alt="" />
          <span>CurioSeek</span>
        </a>
        <nav aria-label="Page navigation">
          <a href="#worlds">The worlds</a>
          <a href="#field-note">The field between</a>
          <a href="#fandom-vibes">Fandom Vibes</a>
        </nav>
        <span className="af-edition"><i /> A PERSONAL ATLAS / 01</span>
      </header>

      <section className="af-intro" id="atlas-home">
        <div>
          <p className="af-kicker"><span>CURIOSEEK</span> / A MANY-SIDED LIFE</p>
          <h1>Many worlds.<br /><em>Room between.</em></h1>
          <p className="af-lede">
            Learning, making, everyday life, and the stories we love—distinct
            places, with a little open ground where one can spark another.
          </p>
          <a className="af-jump" href="#worlds">Wander the atlas <span>↓</span></a>
        </div>
        <aside className="af-intro-note">
          <span>FIELD NOTE / CS—01</span>
          <p>There’s more than<br />one way to be curious.</p>
          <small>INDEPENDENT CURIOSITY · EST. IN POSSIBILITY</small>
        </aside>
      </section>

      <section className="af-landscape" id="worlds" aria-labelledby="af-world-heading">
        <div className="af-section-head">
          <div>
            <p className="af-kicker">01 / THE LANDSCAPE</p>
            <h2 id="af-world-heading">A field of distinct worlds.</h2>
          </div>
          <p>Explore any corner. Leave the others open.<br />The in-between belongs to curiosity.</p>
        </div>

        <div className="af-canvas">
          <div className="af-contours" aria-hidden="true">
            <svg viewBox="0 0 1000 620" preserveAspectRatio="none">
              <path d="M180 138 C315 180 357 241 468 292" />
              <path d="M814 133 C685 198 645 229 531 292" />
              <path d="M183 493 C309 443 372 368 474 320" />
              <path d="M812 487 C682 432 638 372 526 321" />
              <path className="af-thread af-thread-one" d="M265 122 C414 78 583 98 728 160" />
              <path className="af-thread af-thread-two" d="M273 503 C434 551 568 529 726 477" />
              <circle cx="468" cy="292" r="3" />
              <circle cx="531" cy="292" r="3" />
              <circle cx="474" cy="320" r="3" />
              <circle cx="526" cy="321" r="3" />
            </svg>
          </div>

          <article className={`af-world af-world-student ${openWorld === "student" ? "is-open" : ""}`}>
            <button type="button" className="af-world-button" onClick={() => setOpenWorld(openWorld === "student" ? null : "student")} aria-expanded={openWorld === "student"}>
              <span className="af-world-meta"><span>01 / PRIVATE WORKSPACE</span><b>↗</b></span>
              <span className="af-world-title">{worlds[0].name}</span>
              <span className="af-world-descriptor">{worlds[0].descriptor}</span>
              <WorldMark shape={worlds[0].shape} />
              <span className="af-world-copy">{worlds[0].copy}</span>
              <span className="af-open-prompt">{openWorld === "student" ? "Close field note" : "Open field note"} <i>{openWorld === "student" ? "−" : "+"}</i></span>
              {openWorld === "student" && <span className="af-world-details">{worlds[0].details}</span>}
            </button>
          </article>

          <article className={`af-world af-world-creator ${openWorld === "creator" ? "is-open" : ""}`}>
            <button type="button" className="af-world-button" onClick={() => setOpenWorld(openWorld === "creator" ? null : "creator")} aria-expanded={openWorld === "creator"}>
              <span className="af-world-meta"><span>02 / PRIVATE WORKSPACE</span><b>↗</b></span>
              <span className="af-world-title">{worlds[1].name}</span>
              <span className="af-world-descriptor">{worlds[1].descriptor}</span>
              <WorldMark shape={worlds[1].shape} />
              <span className="af-world-copy">{worlds[1].copy}</span>
              <span className="af-open-prompt">{openWorld === "creator" ? "Close field note" : "Open field note"} <i>{openWorld === "creator" ? "−" : "+"}</i></span>
              {openWorld === "creator" && <span className="af-world-details">{worlds[1].details}</span>}
            </button>
          </article>

          <div className="af-open-ground" id="field-note">
            <span className="af-ground-emblem"><img src="/__mockup/images/curioseek-apex-logo.png" alt="" /></span>
            <span className="af-ground-label">CURIOSEEK / THE FIELD BETWEEN</span>
            <p>Ideas can travel.<br /><em>Worlds stay themselves.</em></p>
            <span className="af-ground-foot">NO FIXED ROUTE · JUST OPEN GROUND</span>
          </div>

          <article className={`af-world af-world-fandom ${openWorld === "fandom" ? "is-open" : ""}`} id="fandom-vibes">
            <button type="button" className="af-world-button" onClick={() => setOpenWorld(openWorld === "fandom" ? null : "fandom")} aria-expanded={openWorld === "fandom"}>
              <span className="af-world-meta"><span>04 / PUBLIC EXPERIENCE</span><b>↗</b></span>
              <span className="af-world-title">{worlds[2].name}</span>
              <span className="af-world-descriptor">{worlds[2].descriptor}</span>
              <WorldMark shape={worlds[2].shape} />
              <span className="af-world-copy">{worlds[2].copy}</span>
              <span className="af-open-prompt">{openWorld === "fandom" ? "Close field note" : "Open field note"} <i>{openWorld === "fandom" ? "−" : "+"}</i></span>
              {openWorld === "fandom" && <span className="af-world-details">{worlds[2].details}</span>}
            </button>
          </article>

          <article className={`af-world af-world-life ${openWorld === "life" ? "is-open" : ""}`}>
            <button type="button" className="af-world-button" onClick={() => setOpenWorld(openWorld === "life" ? null : "life")} aria-expanded={openWorld === "life"}>
              <span className="af-world-meta"><span>03 / PROPOSED</span><b>↗</b></span>
              <span className="af-world-title">{worlds[3].name}</span>
              <span className="af-world-descriptor">{worlds[3].descriptor}</span>
              <WorldMark shape={worlds[3].shape} />
              <span className="af-world-copy">{worlds[3].copy}</span>
              <span className="af-open-prompt">{openWorld === "life" ? "Close field note" : "Open field note"} <i>{openWorld === "life" ? "−" : "+"}</i></span>
              {openWorld === "life" && <span className="af-world-details">{worlds[3].details}</span>}
            </button>
          </article>
          <span className="af-canvas-coordinate">FIELD STUDY 04 · OPEN-ENDED CONNECTIONS</span>
        </div>

        <div className="af-world-legend" aria-label="World key">
          <span><i className="coral" />StudentOS</span>
          <span><i className="gold" />CreatorOS</span>
          <span><i className="lilac" />Fandom Vibes</span>
          <span><i className="mint" />LifeOS</span>
          <span className="af-legend-note">COLOR IDENTIFIES WORLDS</span>
        </div>
      </section>

      <section className="af-invitation">
        <p className="af-kicker">02 / TAKE THE LONG WAY</p>
        <p className="af-invitation-quote">“A question from study might become a project.<br />A story might leave a feeling worth keeping.”</p>
        <p className="af-invitation-copy">The connections are yours to notice. Nothing here asks the worlds to become one.</p>
      </section>

      <section className="af-fandom-note">
        <div className="af-fandom-stamp">A PUBLIC<br />WORLD</div>
        <div>
          <p className="af-kicker">A DOORWAY INTO A WORLD OF ITS OWN</p>
          <h2>Fandom Vibes</h2>
          <p>For the feeling a story leaves behind. Find fandom guides, playful discoveries, and the visual moods of Vibe Atlas / 氛围图鉴. C-drama is the initial focus.</p>
          <div className="af-fandom-links">
            <a href="https://fandom.justlikekatie.com" target="_blank" rel="noreferrer">Open the worlds launcher <span>↗</span></a>
            <a href="https://fandom.justlikekatie.com/cdrama" target="_blank" rel="noreferrer">Go straight to C-drama <span>↗</span></a>
          </div>
        </div>
        <div className="af-fandom-art" aria-hidden="true"><span>VIBE<br />ATLAS</span><i /><small>SCENES / FEELINGS / DISCOVERIES</small></div>
      </section>

      <footer className="af-footer">
        <a className="af-brand" href="#atlas-home"><img src="/__mockup/images/curioseek-apex-logo.png" alt="" /><span>CurioSeek</span></a>
        <span>AN ATLAS FOR A MANY-SIDED LIFE</span>
        <a href="#atlas-home">Return to the field ↑</a>
      </footer>
    </main>
  );
}
