import { useState } from "react";
import "./_group.css";

type World = {
  name: string;
  status: string;
  concept?: boolean;
  kind: string;
  description: string;
  detail: string;
};

const worlds: World[] = [
  {
    name: "StudentOS",
    status: "Private workspace",
    kind: "LEARN · PRACTICE · CONNECT IDEAS",
    description: "A place for serious learning: study paths, practice, and a growing web of knowledge.",
    detail: "Learning is more than a streak. StudentOS brings study, practice-question review, and a personal knowledge wiki into one private learning space.",
  },
  {
    name: "CreatorOS",
    status: "Private workspace",
    kind: "CAPTURE → CREATE → PLAN → CONNECT",
    description: "A creative workstation for ideas in motion—without asking every idea to become a post.",
    detail: "CreatorOS develops selected ideas and prepares them for deliberate publication. Engines such as Fandom Vibes support specific creative outputs; they do not define the whole creative practice, and the private journal stays its own thing.",
  },
  {
    name: "LifeOS",
    status: "Proposed",
    concept: true,
    kind: "NOTICE · REFLECT · MAKE ROOM",
    description: "A gentler home for the everyday systems and private reflections that make a life feel held.",
    detail: "This is a proposed area, not a shipped workspace. Private reflection is one building block; the idea is to make room for the useful, ordinary parts of a many-sided life.",
  },
  {
    name: "Fandom Vibes",
    status: "Public experience",
    kind: "NOTICE · COLLECT · COMPOSE",
    description: "A visual playground and content engine for C-drama discoveries, collections, and creative grids.",
    detail: "Vibe Atlas / 氛围图鉴 gathers nine visual signals into a daily star-and-vibe study. Save discoveries in a collection, then arrange them into a creative grid.",
  },
  {
    name: "C-drama Wiki",
    status: "Proposed",
    concept: true,
    kind: "EDITORIAL · SOURCE-AWARE",
    description: "A proposed editorial destination for curious, considered ways into C-drama worlds.",
    detail: "A proposed standalone editorial wiki, with no public destination verified in this review. It is distinct from the existing CDRAMA lens, which keeps first-watch observations and source provenance close to the experience.",
  },
];

export function Apex() {
  const [openWorld, setOpenWorld] = useState<string | null>(null);

  return (
    <main className="curio-apex" id="top">
      <div className="ca-wrap">
        <header className="ca-nav">
          <a className="ca-wordmark" href="#top" aria-label="CurioSeek home">
            <span className="ca-mark" aria-hidden="true" />
            CurioSeek
          </a>
          <nav className="ca-navlinks" aria-label="Main navigation">
            <a href="#worlds">The worlds</a>
            <a href="#approach">The approach</a>
            <a href="#fandom">A closer look</a>
          </nav>
          <span className="ca-concept"><i aria-hidden="true" />APEX CONCEPT</span>
        </header>

        <section className="ca-hero" aria-labelledby="ca-title">
          <div className="ca-hero-copy">
            <div className="ca-eyebrow ca-kicker">A field guide to a curious life</div>
            <h1 id="ca-title">More than<br />one kind of <em>curious.</em></h1>
            <p className="ca-hero-sub">A home for the things worth following—learning deeply, making things, finding your systems, and loving what you love.</p>
            <div className="ca-hero-actions">
              <a className="ca-button" href="#worlds">Find your way around <span className="ca-arrow" aria-hidden="true">↘</span></a>
              <a className="ca-textlink" href="#approach">A small philosophy</a>
            </div>
          </div>
          <div className="ca-art" aria-label="Illustration of four connected paths around one curious life">
            <div className="ca-orbit" aria-hidden="true">
              <span className="ca-orbit-tag ca-tag-1"><b />LEARN</span>
              <span className="ca-orbit-tag ca-tag-2"><b />MAKE</span>
              <span className="ca-orbit-tag ca-tag-3"><b />NOTICE</span>
              <span className="ca-orbit-tag ca-tag-4"><b />LOVE</span>
              <div className="ca-core"><span>one life,<br />many ways<br />in</span></div>
            </div>
            <span className="ca-spark one" aria-hidden="true">✳</span>
            <span className="ca-spark two" aria-hidden="true">✳</span>
            <span className="ca-caption">A PERSONAL ATLAS · VOL. 01</span>
          </div>
        </section>

        <div className="ca-thesis" aria-label="CurioSeek doctrine">
          <span className="ca-kicker">The CurioSeek way</span>
          <p>Collect signals <span>→</span> shape systems <span>→</span> move mountains.</p>
        </div>

        <section className="ca-intro" aria-labelledby="ca-intro-title">
          <div className="ca-kicker">01 / The bigger picture</div>
          <div>
            <h2 id="ca-intro-title">Not a funnel. A <em>whole landscape.</em></h2>
            <p>Some interests want structure. Some want a sketchbook. Some are better left private. CurioSeek gathers the different ways of being curious without turning a person into a content calendar.</p>
          </div>
        </section>

        <section className="ca-worlds" id="worlds" aria-labelledby="ca-worlds-title">
          <div className="ca-section-head">
            <h2 id="ca-worlds-title">Five paths, one person.</h2>
            <p>Different rooms for different kinds of attention.</p>
          </div>
          <div className="ca-world-grid">
            {worlds.map((world, index) => {
              const expanded = openWorld === world.name;
              const detailId = `world-detail-${index}`;
              return (
                <article className="ca-world" key={world.name}>
                  <div className="ca-world-top">
                    <span className="ca-world-number">FIELD NOTE 0{index + 1}</span>
                    <span className={`ca-world-status${world.concept ? " concept" : ""}`}>{world.status}</span>
                  </div>
                  <h3>{world.name}</h3>
                  <p>{world.description}</p>
                  <div className="ca-world-bottom">
                    <span className="ca-world-kind">{world.kind}</span>
                    <button className="ca-world-button" type="button" aria-expanded={expanded} aria-controls={detailId} onClick={() => setOpenWorld(expanded ? null : world.name)}>
                      {expanded ? "Fold note" : "Open note"} <span aria-hidden="true">{expanded ? "−" : "↗"}</span>
                    </button>
                  </div>
                  {expanded && <div className="ca-world-detail" id={detailId}>{world.detail}</div>}
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <section className="ca-boundary" aria-labelledby="ca-boundary-title">
        <div className="ca-wrap ca-boundary-grid">
          <div>
            <div className="ca-kicker">02 / Keep the edges human</div>
            <h2 id="ca-boundary-title">Creativity is <em>bigger</em> than publishing.</h2>
          </div>
          <div className="ca-boundary-copy">
            <p>Making can be private, playful, unfinished, or just for you. CreatorOS is a workstation for that full creative life—not a machine that turns every thought into content.</p>
            <p>When you do want to share, a focused engine such as Fandom Vibes can help shape a chosen idea. CreatorOS supports the wider creative practice; publishing remains a deliberate next step.</p>
            <div className="ca-distinction">
              <div><strong>The workshop</strong><span>Capture, create, plan, connect. Journaling remains its own personal practice.</span></div>
              <div><strong>The outward path</strong><span>Selected work may become shareable. The choice belongs to the maker.</span></div>
            </div>
          </div>
        </div>
      </section>

      <div className="ca-wrap">
        <section className="ca-method" id="approach" aria-labelledby="ca-method-title">
          <div className="ca-method-head">
            <div className="ca-kicker">03 / A practice, not a pipeline</div>
            <h2 id="ca-method-title">Pay attention.<br /><em>Then see what grows.</em></h2>
          </div>
          <div className="ca-steps">
            <article className="ca-step">
              <span className="ca-kicker">01 — Gather</span><span className="ca-step-arrow" aria-hidden="true">↘</span>
              <h3>Collect signals</h3><p>Keep the detail that catches your eye: a question, a pattern, a scene, a stray idea.</p>
            </article>
            <article className="ca-step">
              <span className="ca-kicker">02 — Arrange</span><span className="ca-step-arrow" aria-hidden="true">↘</span>
              <h3>Shape systems</h3><p>Give recurring curiosities a useful place to meet, without forcing them into the same shape.</p>
            </article>
            <article className="ca-step">
              <span className="ca-kicker">03 — Become</span>
              <h3>Move mountains</h3><p>Let the small observations add up to something you could not have planned at the start.</p>
            </article>
          </div>
        </section>

        <section className="ca-fandom" id="fandom" aria-labelledby="ca-fandom-title">
          <div className="ca-fandom-panel">
            <div className="ca-fandom-copy">
              <div className="ca-kicker">A public doorway / Fandom Vibes</div>
              <h2>For the feeling a story leaves behind.</h2>
              <p>Part visual field guide, part creative playground. Find a drama’s atmosphere in color, texture, shape, and small visual signals—then keep what speaks to you.</p>
              <a className="ca-button" href="https://fandom.justlikekatie.com" target="_blank" rel="noreferrer">
                Visit Fandom Vibes <span className="ca-arrow" aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="ca-fandom-art" aria-hidden="true">
              <div className="ca-swatch ca-swatch-a"><div className="ca-swatch-art" /><div className="ca-swatch-caption">01 · hush / light</div></div>
              <div className="ca-swatch ca-swatch-b"><div className="ca-swatch-art" /><div className="ca-swatch-caption">02 · after rain</div></div>
              <div className="ca-swatch ca-swatch-c"><div className="ca-swatch-art" /><div className="ca-swatch-caption">Vibe Atlas / 氛围图鉴</div></div>
            </div>
          </div>
        </section>

        <aside className="ca-note">
          <div className="ca-kicker">A note on this map</div>
          <p>CurioSeek is an umbrella concept: some paths are private workspaces, and some are still taking shape. This page is an invitation to understand the landscape—not a claim that every room is open.</p>
        </aside>

        <footer className="ca-footer">
          <a className="ca-wordmark" href="#top"><span className="ca-mark" aria-hidden="true" />CurioSeek</a>
          <small>A FIELD GUIDE FOR A MANY-SIDED LIFE · CONCEPT</small>
          <a className="ca-textlink ca-mono" href="#top">Back to the beginning ↑</a>
        </footer>
      </div>
    </main>
  );
}
