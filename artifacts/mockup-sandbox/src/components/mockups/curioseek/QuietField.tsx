import { useState } from "react";
import "./quiet-field.css";

const worlds = [
  {
    id: "student",
    name: "StudentOS",
    number: "01",
    status: "PRIVATE WORKSPACE",
    invitation: "Learn deeply",
    description:
      "Follow a question until it opens. A place for study paths, practice, and ideas you want to keep.",
    color: "coral",
    kind: "note",
    artifact: "Knowledge wiki",
  },
  {
    id: "creator",
    name: "CreatorOS",
    number: "02",
    status: "PRIVATE WORKSPACE",
    invitation: "Make freely",
    description:
      "Give an idea somewhere to grow. A roomy workshop for shaping projects and deciding what comes next.",
    color: "saffron",
    kind: "workshop",
    artifact: "Create · Plan · Connect",
  },
  {
    id: "fandom",
    name: "Fandom Vibes",
    number: "04",
    status: "PUBLIC EXPERIENCE",
    invitation: "Love a story",
    description:
      "Follow a feeling into a story. Explore C-drama guides, games, and small discoveries; Vibe Atlas is one doorway among many.",
    color: "plum",
    kind: "story",
    artifact: "Guides · Games · Vibe Atlas",
  },
  {
    id: "life",
    name: "LifeOS",
    number: "03",
    status: "PROPOSED",
    invitation: "Make room",
    description:
      "A world still taking shape: a gentler home for everyday systems and private reflection.",
    color: "sage",
    kind: "horizon",
    artifact: "Everyday systems · Reflection",
  },
] as const;

function BrandMark() {
  return (
    <img
      className="qf-brand-mark"
      src="/__mockup/images/curioseek-apex-logo.png"
      alt=""
    />
  );
}

export function QuietField() {
  const [selectedId, setSelectedId] = useState<string>("student");
  const selected = worlds.find((world) => world.id === selectedId) ?? worlds[0];

  return (
    <main className="quiet-field" id="qf-top">
      <header className="qf-header">
        <a className="qf-brand" href="#qf-top" aria-label="CurioSeek home">
          <BrandMark />
          <span>CurioSeek</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#qf-worlds">The worlds</a>
          <a href="#qf-note">The field between</a>
          <a href="#qf-fandom">Fandom Vibes</a>
        </nav>
        <span className="qf-edition">A PLACE FOR CURIOSITY</span>
      </header>

      <section className="qf-hero">
        <div className="qf-hero-copy">
          <p className="qf-kicker"><span>CURIOSEEK</span> / A MANY-SIDED LIFE</p>
          <h1>Curiosity leaves<br /><em>room between.</em></h1>
          <p>
            Four different worlds. Each one has its own shape, pace, and
            language. The space between them stays open.
          </p>
          <a className="qf-text-link" href="#qf-worlds">
            Wander the field <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="qf-atmosphere" aria-hidden="true">
          <span className="qf-wash qf-wash-coral" />
          <span className="qf-wash qf-wash-saffron" />
          <span className="qf-wash qf-wash-sage" />
          <span className="qf-wash qf-wash-plum" />
          <span className="qf-atmosphere-note">A FIELD, NOT A ROUTE</span>
        </div>
      </section>

      <section className="qf-world-section" id="qf-worlds">
        <div className="qf-section-heading">
          <div>
            <p className="qf-kicker">01 / FOUR DISTINCT WORLDS</p>
            <h2>Choose a place<br /><em>to spend time.</em></h2>
          </div>
          <p>
            The connections stay quiet here. Select a world to learn what
            belongs to it.
          </p>
        </div>

        <div className="qf-field-stage">
          <div className="qf-field-haze qf-haze-coral" aria-hidden="true" />
          <div className="qf-field-haze qf-haze-saffron" aria-hidden="true" />
          <div className="qf-field-haze qf-haze-sage" aria-hidden="true" />
          <div className="qf-field-haze qf-haze-plum" aria-hidden="true" />

          <WorldCard world={worlds[0]} selected={selectedId === "student"} onSelect={setSelectedId} />
          <WorldCard world={worlds[1]} selected={selectedId === "creator"} onSelect={setSelectedId} />

          <p className="qf-open-ground">
            <span>THE FIELD BETWEEN</span>
            A little open ground<br />for things to meet.
          </p>

          <WorldCard world={worlds[2]} selected={selectedId === "fandom"} onSelect={setSelectedId} />
          <WorldCard world={worlds[3]} selected={selectedId === "life"} onSelect={setSelectedId} />

          <span className="qf-stage-caption">NO FIXED ROUTE · ROOM TO WANDER</span>
        </div>

        <article className={`qf-world-note qf-note-${selected.color}`} aria-live="polite">
          <div className="qf-note-index">{selected.number}</div>
          <div className="qf-note-title">
            <span>{selected.status}</span>
            <h3>{selected.name}</h3>
          </div>
          <p>{selected.description}</p>
          <span className="qf-note-artifact">{selected.artifact}</span>
        </article>
      </section>

      <section className="qf-between" id="qf-note">
        <p className="qf-kicker">02 / THE SPACE BETWEEN</p>
        <div>
          <h2>They meet here<br />without becoming<br /><em>the same place.</em></h2>
          <p>
            CurioSeek is the field around and between its worlds. A place for
            unexpected connections to take shape, while each world keeps its
            own language.
          </p>
        </div>
        <span className="qf-spark" aria-hidden="true">✳</span>
      </section>

      <section className="qf-fandom" id="qf-fandom">
        <div className="qf-fandom-copy">
          <p className="qf-kicker">04 / A PUBLIC WORLD</p>
          <h2>Follow a story<br /><em>all the way through.</em></h2>
          <p>
            Fandom Vibes is a public C-drama world of guides, games, and
            discoveries to follow. Vibe Atlas is one experience among many.
          </p>
          <a className="qf-text-link" href="https://fandom.justlikekatie.com" target="_blank" rel="noreferrer">
            Step into Fandom Vibes <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="qf-fandom-art" aria-hidden="true">
          <span className="qf-art-wash" />
          <span className="qf-art-label">SCENES / FEELINGS / DISCOVERIES</span>
          <span className="qf-art-title">VIBE<br />ATLAS</span>
        </div>
      </section>

      <footer className="qf-footer">
        <a className="qf-brand" href="#qf-top"><BrandMark /><span>CurioSeek</span></a>
        <span>AN OPEN FIELD FOR A MANY-SIDED LIFE</span>
        <a href="#qf-top">Return to the beginning ↑</a>
      </footer>
    </main>
  );
}

type World = (typeof worlds)[number];

function WorldCard({
  world,
  selected,
  onSelect,
}: {
  world: World;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={`qf-world qf-world-${world.id} qf-shape-${world.kind} qf-${world.color}${selected ? " is-selected" : ""}`}
      onClick={() => onSelect(world.id)}
      aria-pressed={selected}
    >
      <span className="qf-world-shape" aria-hidden="true" />
      <span className="qf-world-meta">{world.number} / {world.status}</span>
      <span className="qf-world-name">{world.name}</span>
      <span className="qf-world-invitation">{world.invitation}</span>
      <span className="qf-world-pip" aria-hidden="true">↗</span>
    </button>
  );
}
