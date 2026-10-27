import { useState } from "react";
import "./thoughttoworld.css";

const prompts = {
  thought: ["Why do people remember certain places?", "A question I keep circling back to…", "What if I tried it another way?"],
  feeling: ["I want a little more room to breathe.", "Something has been on my mind lately…", "I miss being curious about things."],
  story: ["The ending I can’t stop thinking about…", "A character who felt strangely familiar.", "I want to find my next favorite story."],
};

const worlds = [
  { id: "student", name: "StudentOS", eyebrow: "LEARN · PRIVATE", line: "Follow a question until it opens.", color: "moss", detail: "A personal knowledge space for making sense of what you’re learning—and keeping the good questions close." },
  { id: "creator", name: "CreatorOS", eyebrow: "MAKE · PRIVATE", line: "Give an idea somewhere to grow.", color: "saffron", detail: "A flexible workshop for collecting sparks, shaping projects, and finding your next small step." },
  { id: "life", name: "LifeOS", eyebrow: "LIVE · IN THE MAKING", line: "Make a little more room.", color: "coral", detail: "A gentler home for everyday systems and private reflection. Still taking shape." },
  { id: "fandom", name: "Fandom Vibes", eyebrow: "LOVE · PUBLIC", line: "Follow a feeling into a story.", color: "plum", detail: "A public world of C-drama guides, playful discoveries, and visual moods. Wander in when you’re ready." },
];

type StartKind = keyof typeof prompts;

export function ThoughtToWorld() {
  const [kind, setKind] = useState<StartKind>("thought");
  const [thought, setThought] = useState("");
  const [result, setResult] = useState(false);
  const [worldId, setWorldId] = useState<string | null>(null);
  const [worldDetail, setWorldDetail] = useState<string | null>(null);

  const chosenWorld = worlds.find((world) => world.id === worldDetail);
  const trimmedThought = thought.trim();

  function begin() {
    if (!trimmedThought) {
      setThought(prompts[kind][0]);
    }
    setResult(true);
    setWorldDetail(null);
  }

  return (
    <main className="ttw-page" id="top">
      <header className="ttw-header">
        <a className="ttw-brand" href="#top" aria-label="CurioSeek home">
          <img className="ttw-mark" src="/__mockup/images/curioseek-apex-logo.png" alt="" />
          <span>CurioSeek</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#begin">Begin anywhere</a>
          <a href="#worlds">The worlds</a>
        </nav>
        <a className="ttw-header-note" href="#begin"><span /> A PLACE FOR CURIOSITY</a>
      </header>

      <section className="ttw-hero" aria-labelledby="ttw-title">
        <div className="ttw-hero-copy">
          <p className="ttw-eyebrow"><span>CURIOSEEK</span><i /> AN OPEN INVITATION</p>
          <h1 id="ttw-title">Begin with<br />a <em>what if.</em></h1>
          <p className="ttw-intro">A thought you can’t quite leave alone. A feeling looking for a name. A story still unfolding. Start there. The rest can wait.</p>
          <a className="ttw-downlink" href="#begin">Leave yourself a thread <span>↓</span></a>
        </div>
        <div className="ttw-orbit" aria-label="A thought, feeling, and story finding their way to an open world">
          <div className="ttw-orbit-ring ring-a" /><div className="ttw-orbit-ring ring-b" /><div className="ttw-orbit-ring ring-c" />
          <span className="ttw-orbit-label thought-label">A THOUGHT</span>
          <span className="ttw-orbit-label feeling-label">A FEELING</span>
          <span className="ttw-orbit-label story-label">A STORY</span>
          <span className="ttw-orbit-center">start<br /><i>anywhere</i></span>
          <span className="ttw-orbit-caption">NO RIGHT ORDER<br />NO WRONG DOOR</span>
          <span className="ttw-dot dot-one" /><span className="ttw-dot dot-two" /><span className="ttw-dot dot-three" />
        </div>
        <span className="ttw-hero-number">01 / THE FIRST THREAD</span>
      </section>

      <section className="ttw-begin" id="begin" aria-labelledby="begin-title">
        <div className="ttw-begin-heading">
          <p className="ttw-eyebrow">A STARTING POINT, NOT A TEST</p>
          <h2 id="begin-title">What’s on your mind?</h2>
          <p>Choose a shape for it—or don’t. You can change direction whenever you like.</p>
        </div>
        <div className="ttw-workbench">
          <div className="ttw-kind-tabs" role="group" aria-label="What would you like to begin with?">
            {(["thought", "feeling", "story"] as StartKind[]).map((item, index) => (
              <button type="button" key={item} onClick={() => { setKind(item); setResult(false); }} className={kind === item ? "is-selected" : ""} aria-pressed={kind === item}>
                <span>0{index + 1}</span>{item}<i aria-hidden="true">{kind === item ? "↗" : ""}</i>
              </button>
            ))}
          </div>
          <label className="ttw-input-label" htmlFor="ttw-thought">{kind === "thought" ? "A thought, a question, a small spark" : kind === "feeling" ? "A feeling, a mood, a sense of something" : "A story, a character, a scene that stayed"}</label>
          <textarea id="ttw-thought" value={thought} onChange={(event) => { setThought(event.target.value); setResult(false); }} placeholder={prompts[kind][0]} maxLength={240} />
          <div className="ttw-workbench-foot">
            <span>{thought.length ? `${thought.length} / 240` : "No need to get it just right."}</span>
            <button type="button" className="ttw-begin-button" onClick={begin}>Find a thread <span aria-hidden="true">↗</span></button>
          </div>
          <div className="ttw-suggestions" aria-label="A few ways to start">
            <span>OR TRY A LITTLE PROMPT</span>
            {prompts[kind].slice(1).map((prompt) => <button key={prompt} type="button" onClick={() => { setThought(prompt); setResult(false); }}>{prompt}</button>)}
          </div>
          {result && (
            <div className="ttw-result" aria-live="polite">
              <span className="ttw-result-mark" aria-hidden="true">↘</span>
              <div><p className="ttw-eyebrow">YOUR THREAD IS HERE</p><p className="ttw-result-copy">“{thought.trim()}”</p><p className="ttw-result-note">Keep it, follow it, or let it point you somewhere new. You don’t have to decide what it means yet.</p></div>
              <a href="#worlds" onClick={() => setWorldDetail(null)}>See where it might lead <span>↓</span></a>
            </div>
          )}
        </div>
      </section>

      <section className="ttw-worlds" id="worlds" aria-labelledby="world-title">
        <div className="ttw-worlds-intro">
          <p className="ttw-eyebrow">02 / IF YOU FEEL LIKE WANDERING</p>
          <h2 id="world-title">The thought can<br /><em>stay yours.</em></h2>
          <p>There’s no destination required. But if a world sounds like a place you’d like to spend time, take a look around.</p>
          <button type="button" className={`ttw-skip${worldId === "none" ? " is-active" : ""}`} onClick={() => { setWorldId("none"); setWorldDetail(null); }}>I’ll just stay curious <span>↗</span></button>
          {worldId === "none" && <p className="ttw-skip-note" aria-live="polite">Good. There’s no next step until you want one.</p>}
        </div>
        <div className="ttw-world-list">
          {worlds.map((world, index) => (
            <button type="button" className={`ttw-world ttw-${world.color}${worldId === world.id ? " world-active" : ""}`} key={world.id} onClick={() => { setWorldId(world.id); setWorldDetail(worldDetail === world.id ? null : world.id); }} aria-expanded={worldDetail === world.id}>
              <span className="ttw-world-n">{String(index + 1).padStart(2, "0")}</span>
              <span className="ttw-world-copy"><span className="ttw-world-eyebrow">{world.eyebrow}</span><strong>{world.name}</strong><span className="ttw-world-line">{world.line}</span></span>
              <span className="ttw-world-arrow" aria-hidden="true">{worldDetail === world.id ? "−" : "↗"}</span>
              {worldDetail === world.id && <span className="ttw-world-detail">{world.detail}<i>{world.id === "fandom" ? "PUBLIC WORLD" : world.id === "life" ? "IN THE MAKING" : "PRIVATE WORKSPACE"}</i></span>}
            </button>
          ))}
        </div>
        <p className="ttw-worlds-foot"><span>FOUR DIFFERENT LANGUAGES.</span> One open space to find your way between them.</p>
      </section>

      <section className="ttw-note">
        <span className="ttw-note-index">03 / A SMALL REMINDER</span>
        <p className="ttw-note-quote">“You don’t need<br />a map to <em>wonder.</em>”</p>
        <div><h2>One curious life.<br /><em>Many ways in.</em></h2><p>CurioSeek makes room for learning, making, everyday life, and the stories we carry. Start with what’s real for you today. Your next step can be small.</p></div>
        <span className="ttw-seal" aria-hidden="true">CS<br /><i>✳</i></span>
      </section>

      <footer className="ttw-footer">
        <a className="ttw-brand" href="#top"><img className="ttw-mark" src="/__mockup/images/curioseek-apex-logo.png" alt="" /><span>CurioSeek</span></a>
        <span>AN OPEN SPACE FOR WHAT’S NEXT</span>
        <a href="#top">Back to the beginning ↑</a>
      </footer>
    </main>
  );
}
