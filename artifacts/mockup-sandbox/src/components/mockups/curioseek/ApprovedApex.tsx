import { useState } from "react";
import "./approved-apex.css";

const worlds = [
  {
    id: "student",
    index: "01",
    name: "StudentOS",
    intent: "Learn deeply",
    status: "Private workspace",
    color: "moss",
    description:
      "Follow the question until it makes sense. A place for study paths, practice, and ideas you want to keep.",
    detail: "A personal learning world, shaped around how you understand.",
    mark: "S",
  },
  {
    id: "creator",
    index: "02",
    name: "CreatorOS",
    intent: "Make freely",
    status: "Private workspace",
    color: "gold",
    description:
      "Gather the sparks, sketches, and unfinished things that may become something—on your own terms.",
    detail: "A private creative practice. An idea can stay an idea.",
    mark: "C",
  },
  {
    id: "life",
    index: "03",
    name: "LifeOS",
    intent: "Make room",
    status: "Proposed",
    color: "coral",
    description:
      "An idea still taking shape: a gentler home for everyday systems, reflection, and the in-between.",
    detail: "A future possibility, still finding its own form.",
    mark: "L",
  },
  {
    id: "fandom",
    index: "04",
    name: "Fandom Vibes",
    intent: "Follow a feeling",
    status: "Public experience",
    color: "lilac",
    description:
      "Step into a C-drama world of guides, games, and discoveries. Vibe Atlas is one doorway—not the whole world.",
    detail: "A public place to love a story and see where it leads.",
    mark: "F",
  },
] as const;

type WorldId = (typeof worlds)[number]["id"];

export function ApprovedApex() {
  const [selectedId, setSelectedId] = useState<WorldId>("student");
  const selected = worlds.find((world) => world.id === selectedId) ?? worlds[0];

  return (
    <main className="approved-apex" id="top">
      <header className="aa-header aa-wrap">
        <a className="aa-brand" href="#top" aria-label="CurioSeek home">
          <img src="/__mockup/images/curioseek-apex-logo.png" alt="" />
          <span>CurioSeek</span>
        </a>
        <nav className="aa-nav" aria-label="Main navigation">
          <a href="#worlds">The worlds</a>
          <a href="#field-note">Our point of view</a>
          <a href="#fandom">Fandom Vibes</a>
        </nav>
        <a className="aa-header-cta" href="#worlds">
          Find a way in <span aria-hidden="true">↘</span>
        </a>
      </header>

      <section className="aa-hero aa-wrap" aria-labelledby="aa-title">
        <div className="aa-hero-copy">
          <p className="aa-kicker"><span /> A FIELD GUIDE TO A MANY-SIDED LIFE</p>
          <h1 id="aa-title">One curious life.<br /><em>Many ways in.</em></h1>
          <p className="aa-hero-deck">
            Start with what moves you. Follow it somewhere that feels like yours.
          </p>
          <a className="aa-primary-link" href="#worlds">
            Meet the worlds <span aria-hidden="true">↘</span>
          </a>
        </div>

        <div className="aa-hero-field" aria-hidden="true">
          <svg viewBox="0 0 590 490" role="presentation">
            <path className="aa-thread aa-thread-student" d="M67 155 C132 106, 181 126, 226 208 S321 330, 390 315" />
            <path className="aa-thread aa-thread-creator" d="M526 128 C449 114, 421 156, 361 225 S277 342, 192 374" />
            <path className="aa-thread aa-thread-life" d="M385 42 C402 109, 344 138, 286 177 S197 281, 124 287" />
            <path className="aa-thread aa-thread-fandom" d="M84 411 C163 385, 201 331, 267 287 S408 213, 500 247" />
            <path className="aa-thread aa-thread-loose" d="M255 38 C234 95, 252 126, 296 157 M436 399 C407 360, 423 328, 465 300" />
            <circle cx="67" cy="155" r="4" />
            <circle cx="526" cy="128" r="4" />
            <circle cx="385" cy="42" r="4" />
            <circle cx="84" cy="411" r="4" />
            <circle cx="255" cy="38" r="4" />
            <circle cx="465" cy="300" r="4" />
          </svg>
          <span className="aa-field-note aa-field-note-top">a question begins</span>
          <span className="aa-field-note aa-field-note-right">a story stays with you</span>
          <span className="aa-field-note aa-field-note-bottom">many ways to begin</span>
          <span className="aa-field-spark">✳</span>
        </div>
        <p className="aa-hero-index">CURIOSEEK / A LANDSCAPE, NOT A ROUTE</p>
      </section>

      <section className="aa-worlds" id="worlds" aria-labelledby="aa-worlds-title">
        <div className="aa-wrap">
          <div className="aa-section-head">
            <div>
              <p className="aa-overline">01 / THE LANDSCAPE</p>
              <h2 id="aa-worlds-title">Choose a place to <em>begin.</em></h2>
            </div>
            <p>Four distinct worlds.<br />Follow the thread that feels like yours.</p>
          </div>

          <div className="aa-field-map">
            <svg className="aa-map-threads" viewBox="0 0 1000 465" preserveAspectRatio="none" aria-hidden="true">
              <path className={`aa-connection aa-connection-moss${selectedId === "student" ? " is-active" : ""}`} d="M142 95 C238 34, 296 130, 397 201 S536 271, 619 200" />
              <path className={`aa-connection aa-connection-gold${selectedId === "creator" ? " is-active" : ""}`} d="M852 93 C752 87, 723 154, 622 201 S440 306, 349 382" />
              <path className={`aa-connection aa-connection-coral${selectedId === "life" ? " is-active" : ""}`} d="M166 380 C260 348, 284 260, 398 202 S599 120, 750 135" />
              <path className={`aa-connection aa-connection-lilac${selectedId === "fandom" ? " is-active" : ""}`} d="M817 377 C740 309, 715 264, 620 201 S473 105, 352 95" />
              <path className="aa-connection aa-connection-open" d="M396 202 C361 165, 351 137, 353 96 M622 201 C659 244, 681 285, 691 335" />
              <circle cx="142" cy="95" r="4" />
              <circle cx="852" cy="93" r="4" />
              <circle cx="166" cy="380" r="4" />
              <circle cx="817" cy="377" r="4" />
              <circle cx="353" cy="96" r="4" />
              <circle cx="691" cy="335" r="4" />
            </svg>

            {worlds.map((world) => (
              <button
                className={`aa-world aa-world-${world.id}${selectedId === world.id ? " is-selected" : ""}`}
                key={world.id}
                type="button"
                aria-pressed={selectedId === world.id}
                onClick={() => setSelectedId(world.id)}
              >
                <span className="aa-world-mark" aria-hidden="true">{world.mark}</span>
                <span className="aa-world-meta">
                  <span className="aa-world-index">{world.index} / {world.status}</span>
                  <span className="aa-world-name">{world.name}</span>
                  <span className="aa-world-intent">{world.intent} <i aria-hidden="true">↗</i></span>
                </span>
              </button>
            ))}
            <span className="aa-map-caption">CONNECTIONS CAN FORM. NO PATH IS PRESCRIBED.</span>
          </div>

          <article className={`aa-world-detail aa-tone-${selected.color}`} aria-live="polite">
            <div className="aa-detail-heading">
              <p className="aa-overline">{selected.index} / {selected.status}</p>
              <h3>{selected.name}</h3>
            </div>
            <p className="aa-detail-description">{selected.description}</p>
            <p className="aa-detail-prompt">{selected.detail}</p>
          </article>
        </div>
      </section>

      <section className="aa-thesis" id="field-note">
        <div className="aa-wrap aa-thesis-inner">
          <p className="aa-overline">02 / OUR POINT OF VIEW</p>
          <blockquote>They meet here<br />without becoming<br /><em>the same place.</em></blockquote>
          <p className="aa-thesis-note">
            CurioSeek is the field between the worlds—the room for paths to cross, ideas to travel, and each place to remain its own.
          </p>
          <span className="aa-thesis-spark" aria-hidden="true">✳</span>
        </div>
      </section>

      <section className="aa-invitations aa-wrap" aria-labelledby="aa-invitations-title">
        <div className="aa-invitations-heading">
          <p className="aa-overline">03 / YOUR KIND OF CURIOUS</p>
          <h2 id="aa-invitations-title">What would you like<br />to <em>follow?</em></h2>
        </div>
        <div className="aa-invitation-list">
          <a href="#worlds" onClick={() => setSelectedId("student")}>
            <span>01</span><strong>Stay with a question</strong><i aria-hidden="true">↗</i>
          </a>
          <a href="#worlds" onClick={() => setSelectedId("creator")}>
            <span>02</span><strong>Make a little room for an idea</strong><i aria-hidden="true">↗</i>
          </a>
          <a href="#worlds" onClick={() => setSelectedId("life")}>
            <span>03</span><strong>Find a softer rhythm</strong><i aria-hidden="true">↗</i>
          </a>
          <a href="#fandom" onClick={() => setSelectedId("fandom")}>
            <span>04</span><strong>Love a story all the way through</strong><i aria-hidden="true">↗</i>
          </a>
        </div>
      </section>

      <section className="aa-fandom" id="fandom">
        <div className="aa-wrap aa-fandom-inner">
          <div className="aa-fandom-art" aria-hidden="true">
            <span className="aa-fandom-stamp">FV</span>
            <span className="aa-fandom-line aa-fandom-line-one" />
            <span className="aa-fandom-line aa-fandom-line-two" />
            <span className="aa-fandom-spark">✳</span>
            <span className="aa-fandom-label">A STORY IS A PLACE TO GO</span>
          </div>
          <div className="aa-fandom-copy">
            <p className="aa-overline">04 / THE PUBLIC WORLD</p>
            <h2>Make room<br />for the <em>story.</em></h2>
            <p>
              Fandom Vibes is a public C-drama world of guides, games, and small discoveries to follow. Vibe Atlas is one experience among many.
            </p>
            <a href="#worlds" className="aa-fandom-link">Step into Fandom Vibes <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <footer className="aa-footer aa-wrap">
        <a className="aa-brand" href="#top">
          <img src="/__mockup/images/curioseek-apex-logo.png" alt="" />
          <span>CurioSeek</span>
        </a>
        <span>ONE CURIOUS LIFE. MANY WAYS IN.</span>
        <a href="#top">Back to the beginning ↑</a>
      </footer>
    </main>
  );
}
