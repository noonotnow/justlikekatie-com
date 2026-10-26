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
            One curious life has more than one direction. Tell us what you’re drawn to;
            we’ll point you toward a world that fits.
          </p>
          <a className="text-link" href="#worlds">Meet the four worlds <span>↓</span></a>
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
            <p className="eyebrow">A SMALL QUESTION, A GOOD PLACE TO BEGIN</p>
            <h2 id="wayfinder-heading">What brings you here?</h2>
          </div>
          <p className="wayfinder-aside">Choose a feeling, not a feature.<br />Your starting point updates below.</p>
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
              <span className="destination-kicker">A GOOD PLACE TO BEGIN</span>
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
              <span className="selection-note">YOUR STARTING POINT: <b>{intent.mark}</b></span>
            </div>
          </article>
        </div>
      </section>

      <section className="world-index" id="worlds">
        <div className="world-index-heading">
          <p className="eyebrow">02 / FOUR DISTINCT WORLDS</p>
          <h2>Not one big thing.<br /><em>Room for different things.</em></h2>
        </div>
        <div className="world-rows">
          {destinations.map((item, index) => (
            <button
              type="button"
              className={`world-row tone-${item.color}${activeDestination === item.id ? " row-active" : ""}`}
              key={item.id}
              onClick={() => {
                const matchingIntent = intents.find((entry) => entry.destination === item.id);
                if (matchingIntent) chooseIntent(matchingIntent.id, item.id);
              }}
              aria-pressed={activeDestination === item.id}
            >
              <span className="world-row-index">0{index + 1}</span>
              <span className="world-row-name">{item.name}</span>
              <span className="world-row-kind">{item.kind}</span>
              <span className="world-row-line">{item.line}</span>
              <span className="world-row-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <p className="world-boundary"><span>FOUR WORLDS, FOUR LANGUAGES.</span> Follow any thread into what interests you.</p>
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
