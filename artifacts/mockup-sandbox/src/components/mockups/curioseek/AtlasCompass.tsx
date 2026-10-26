import { useState } from "react";
import "./atlascompass.css";

const destinations = [
  {
    id: "student",
    name: "StudentOS",
    kind: "PRIVATE WORKSPACE",
    line: "Learn something deeply.",
    description:
      "Build understanding that outlasts the next test. A personal knowledge web, shaped around how you think.",
    color: "sage",
    initials: "S",
    pathways: ["Knowledge wiki", "Study loops", "Ideas to revisit"],
  },
  {
    id: "creator",
    name: "CreatorOS",
    kind: "PRIVATE WORKSPACE",
    line: "Make something yours.",
    description:
      "A roomy workshop for unfinished thoughts, creative projects, and planning what comes next.",
    color: "citrus",
    initials: "C",
    pathways: ["Create", "Plan", "Connect"],
  },
  {
    id: "life",
    name: "LifeOS",
    kind: "PROPOSED",
    line: "Make a little more room.",
    description:
      "Still taking shape: a gentler home for everyday systems and private reflection.",
    color: "rose",
    initials: "L",
    pathways: ["Everyday systems", "Reflection"],
  },
  {
    id: "fandom",
    name: "Fandom Vibes",
    kind: "PUBLIC EXPERIENCE",
    line: "Follow a feeling.",
    description:
      "Wander through C-drama guides, playful discoveries, and visual moods. Vibe Atlas is one doorway, not the whole universe.",
    color: "violet",
    initials: "F",
    pathways: ["Guides", "Games", "Vibe Atlas", "Collections"],
  },
];

const intents = [
  { id: "learn", label: "I want to understand something", destination: "student", mark: "01" },
  { id: "make", label: "I have an idea to make", destination: "creator", mark: "02" },
  { id: "room", label: "I want life to feel lighter", destination: "life", mark: "03" },
  { id: "love", label: "I want to follow a story", destination: "fandom", mark: "04" },
];

export function AtlasCompass() {
  const [activeIntent, setActiveIntent] = useState("learn");
  const [activeDestination, setActiveDestination] = useState("student");
  const destination =
    destinations.find((item) => item.id === activeDestination) ?? destinations[0];
  const intent = intents.find((item) => item.id === activeIntent) ?? intents[0];

  function chooseIntent(id: string, destinationId: string) {
    setActiveIntent(id);
    setActiveDestination(destinationId);
  }

  return (
    <main className="compass-page">
      <header className="compass-header">
        <a className="compass-brand" href="#start" aria-label="CurioSeek home">
          <img className="brand-mark" src="/__mockup/images/curioseek-apex-logo.png" alt="" />
          <span>CurioSeek</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#start">Find your way</a>
          <a href="#worlds">The worlds</a>
          <a href="#about">Our point of view</a>
        </nav>
        <span className="header-edition"><i /> FIELD GUIDE&nbsp; / &nbsp;NO. 01</span>
      </header>

      <section className="compass-hero" id="start">
        <div className="hero-copy">
          <p className="eyebrow"><span>CURIOSEEK</span><i /> A GUIDE TO WHAT'S NEXT</p>
          <h1>Start with<br /><em>what moves you.</em></h1>
          <p className="hero-deck">
            One curious life has more than one direction. Begin with a feeling, or wander
            into the open field—each world has its own way of seeing.
          </p>
          <a className="text-link" href="#worlds">Explore the open field <span>↓</span></a>
        </div>
        <div className="compass-art" aria-label="Four paths meet at the CurioSeek compass">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <span className="orbit-label north">LEARN</span>
          <span className="orbit-label east">MAKE</span>
          <span className="orbit-label south">LIVE</span>
          <span className="orbit-label west">LOVE</span>
          <span className="art-caption">A MANY-SIDED LIFE<br />NO SINGLE ROUTE REQUIRED</span>
        </div>
        <span className="hero-index">01 — AN OPENING</span>
      </section>

      <section className="wayfinder" aria-labelledby="wayfinder-heading">
        <div className="wayfinder-top">
          <div>
            <p className="eyebrow">A SMALL QUESTION, IF IT HELPS</p>
            <h2 id="wayfinder-heading">Where would you like to begin?</h2>
          </div>
          <p className="wayfinder-aside">Choose a thread—or skip straight to the field.<br />This is one beginning, never a sorting.</p>
        </div>
        <div className="wayfinder-grid">
          <div className="intent-list" role="group" aria-label="Choose what brings you here">
            {intents.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`intent-choice${activeIntent === item.id ? " chosen" : ""}`}
                onClick={() => chooseIntent(item.id, item.destination)}
                aria-pressed={activeIntent === item.id}
              >
                <span className="intent-number">{item.mark}</span>
                <span className="intent-label">{item.label}</span>
                <span className="intent-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <article className={`destination-card tone-${destination.color} destination-${destination.id}`} aria-live="polite">
            <div className="destination-card-top">
              <span className="destination-kicker">ONE THREAD TO FOLLOW</span>
              <span className="destination-stamp">{destination.initials}</span>
            </div>
            <p className="destination-kind">{destination.kind}</p>
            <h3>{destination.name}</h3>
            <p className="destination-line">{destination.line}</p>
            <p className="destination-description">{destination.description}</p>
            <div className="destination-bottom">
              <div className="destination-tags">
                {destination.pathways.map((pathway) => <span key={pathway}>{pathway}</span>)}
              </div>
              <span className="selection-note">ONE POSSIBLE START: <b>{intent.mark}</b></span>
            </div>
          </article>
        </div>
      </section>

      <section className="world-index" id="worlds">
        <div className="world-index-heading">
          <p className="eyebrow">02 / A FIELD OF MANY PATHS</p>
          <h2>An open field.<br /><em>Four distinct worlds.</em></h2>
          <p className="field-intro">
            CurioSeek is the space between and around them. Follow a connection,
            choose a world, or arrive with no destination in mind.
          </p>
          <p className="field-instruction"><span>↗</span> Select any world to see what grows there.</p>
        </div>
        <div className="world-field" aria-label="Explore the four connected CurioSeek worlds">
          <svg className="field-paths" viewBox="0 0 900 540" preserveAspectRatio="none" aria-hidden="true">
            <path className="path-sage" d="M115 138 C250 62 323 203 447 213 S646 92 798 138" />
            <path className="path-coral" d="M115 138 C216 239 278 265 405 274 S630 326 798 397" />
            <path className="path-gold" d="M96 409 C221 354 282 274 405 274 S676 236 798 138" />
            <path className="path-violet" d="M96 409 C224 487 316 362 405 274 S638 308 798 397" />
            <path className="path-branch" d="M405 274 C480 201 476 116 531 69" />
            <circle cx="531" cy="69" r="4" />
            <circle cx="69" cy="285" r="3" />
            <circle cx="841" cy="286" r="3" />
          </svg>
          {destinations.map((item, index) => (
            <button
              type="button"
              className={`world-node node-${item.id}${activeDestination === item.id ? " node-active" : ""}`}
              key={item.id}
              onClick={() => {
                const matchingIntent = intents.find((entry) => entry.destination === item.id);
                if (matchingIntent) chooseIntent(matchingIntent.id, item.id);
              }}
              aria-pressed={activeDestination === item.id}
              aria-label={`Explore ${item.name}; ${item.kind.toLowerCase()}`}
            >
              <span className="world-node-shape" aria-hidden="true"><span>{item.initials}</span></span>
              <span className="world-node-index">0{index + 1} / {item.kind}</span>
              <span className="world-node-name">{item.name}</span>
              <span className="world-node-line">{item.line}</span>
              <span className="world-node-action">Explore this world <i aria-hidden="true">↗</i></span>
            </button>
          ))}
        </div>
        <p className="world-boundary"><span>FOUR WORLDS, FOUR LANGUAGES.</span> They meet here without becoming the same place.</p>
      </section>

      <section className="point-of-view" id="about">
        <span className="pov-index">03 / THE SHAPE OF IT</span>
          <p>Curiosity can<br />take many forms.</p>
        <div>
          <h2>Follow the thread.<br /><em>Find your own way.</em></h2>
          <p>
            Study a question until it clicks. Give an idea a place to grow. Make a little
            room for everyday life. Find the next story you’ll want to share. Each world
            keeps its own language; the connections are yours to discover.
          </p>
        </div>
        <span className="pov-seal" aria-hidden="true">CS<br /><i>✳</i></span>
      </section>

      <section className="fandom-note">
        <div className="fandom-mark">FV<br /><span>氛围</span></div>
        <div>
          <p className="eyebrow">A PUBLIC WORLD OF ITS OWN</p>
          <h2>For the stories<br /><em>that stay with you.</em></h2>
          <p>Fandom Vibes is a home for C-drama guides, games, and discoveries. Step into the feeling.</p>
        </div>
        <a href="https://fandom.justlikekatie.com" target="_blank" rel="noreferrer">
          Explore Fandom Vibes <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className="compass-footer">
        <a className="compass-brand" href="#start"><img className="brand-mark" src="/__mockup/images/curioseek-apex-logo.png" alt="" /><span>CurioSeek</span></a>
        <span>AN ATLAS FOR A MANY-SIDED LIFE</span>
        <a href="#start">Back to the beginning ↑</a>
      </footer>
    </main>
  );
}
