"use client";

import { useEffect, useRef, useState } from "react";
import { designs, films, photographs, type Work } from "./portfolio-data";
import { FilmWaterfall, PileGallery } from "./galleries";

const navigation = ["About", "Film", "Photo", "Design", "Contact"] as const;
type View = typeof navigation[number];
type Selection = { items: Work[]; index: number; kind: string };

function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dot = ref.current;
    if (!dot) return;
    let frame = 0, x = -50, y = -50;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX; y = event.clientY;
      if (!frame) frame = requestAnimationFrame(() => {
        dot.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
        dot.style.opacity = "1";
        frame = 0;
      });
    };
    const leave = () => { dot.style.opacity = "0"; };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", move); document.documentElement.removeEventListener("pointerleave", leave); };
  }, []);
  return <div className="cursor-dot" ref={ref} aria-hidden="true"/>;
}

function GlassCube() {
  return <div className="cube-scene" aria-hidden="true"><div className="cube-float"><div className="glass-cube">
    {["front", "back", "right", "left", "top", "bottom"].map(face => <div key={face} className={`cube-face cube-${face}`}><i/><b/></div>)}
  </div></div><div className="cube-shadow"/></div>;
}

function WorkDialog({ selection, close, change }: { selection: Selection | null; close: () => void; change: (index: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opened = selection !== null;
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (opened) {
      dialog.showModal();
      const oldOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { dialog.close(); document.body.style.overflow = oldOverflow; };
    }
  }, [opened]);
  const item = selection?.items[selection.index];
  return <dialog ref={ref} className={`work-dialog ${selection?.kind === "Film" ? "film-dialog" : "image-dialog"}`} aria-labelledby="detail-title" onCancel={event => { event.preventDefault(); close(); }}>
    {selection && item && <>
      <button type="button" className="detail-close" onClick={close} autoFocus>Close <span>×</span></button>
      <div className="detail-layout">
        <div className="detail-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title}/>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{item.subtitle}</p>
          <h2 id="detail-title">{item.title}</h2>
          {selection.kind === "Film" && <p>A cinematic study in atmosphere, rhythm and physical detail. Treatment, stills and production notes for this project.</p>}
          <div className="detail-controls"><button type="button" onClick={() => change((selection.index + selection.items.length - 1) % selection.items.length)}>← Previous</button><span>{String(selection.index + 1).padStart(2, "0")} / {selection.items.length}</span><button type="button" onClick={() => change((selection.index + 1) % selection.items.length)}>Next →</button></div>
        </div>
      </div>
    </>}
  </dialog>;
}

export default function Home() {
  const [view, setView] = useState<View>("About");
  const [menu, setMenu] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const go = (next: View) => {
    setView(next); setMenu(false); setSelection(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setMenu(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return <>
    <Cursor/>
    <header className="topbar">
      <button type="button" className="wordmark" onClick={() => go("About")} aria-label="Y / X — Home">Y / X<span>—</span></button>
      <div className="topbar-right"><span className="availability"><i/> Available for select projects · 2026</span><button type="button" className="menu-toggle" aria-expanded={menu} aria-controls="site-menu" onClick={() => setMenu(!menu)}>{menu ? "Close" : "Menu"}</button></div>
    </header>
    <nav id="site-menu" className="menu-panel" aria-label="Main navigation" hidden={!menu}>
      {navigation.map((name, i) => <button type="button" key={name} aria-current={view === name ? "page" : undefined} onClick={() => go(name)}><span>0{i + 1}</span>{name}<span>↗</span></button>)}
    </nav>
    <main className="site-shell">
      {view === "About" && <section className="home-canvas">
        <p className="eyebrow">Independent creative studio / 2026</p>
        <h1>Stories<br/><em>with a pulse.</em></h1>
        <GlassCube/>
        <div className="home-map">{navigation.map((name, i) => <button type="button" key={name} onClick={() => go(name)}><b>0{i + 1}</b>{name}<span>↗</span></button>)}</div>
        <p className="home-note">Producer · Production designer · Writer<br/>Building cinematic worlds across film, image and form.</p>
      </section>}
      {view === "Film" && <section className="module-page film-page">
        <div className="module-heading"><div><p className="eyebrow">02 — Film works</p><h2>Worlds made<br/><em>for the frame.</em></h2></div><p className="module-note">Move to explore. Hover to get closer.<br/>Scroll or drag through the stills.</p></div>
        <FilmWaterfall items={films} onOpen={index => setSelection({ items: films, index, kind: "Film" })}/>
      </section>}
      {(view === "Photo" || view === "Design") && <section className={`module-page collection-page ${view === "Photo" ? "photo-page" : "design-page"}`} key={view}>
        <div className="module-heading"><div><p className="eyebrow">{view === "Photo" ? "03 — Photography" : "04 — Graphic design & illustration"}</p><h2>{view === "Photo" ? <>Collected<br/><em>light.</em></> : <>Handmade<br/><em>systems.</em></>}</h2></div><p className="module-note">{view === "Photo" ? "An ever-growing visual diary." : "Ideas in print, image and form."}<br/>Hover to enlarge. Click to explore.</p></div>
        <div className="collection-meta"><span>{view === "Photo" ? photographs.length : designs.length} / {view === "Photo" ? "Photographs" : "Design studies"}</span><span>Scroll to discover ↓</span></div>
        <PileGallery items={view === "Photo" ? photographs : designs} kind={view === "Photo" ? "photo" : "design"} onOpen={index => setSelection({ items: view === "Photo" ? photographs : designs, index, kind: view })}/>
        <p className="collection-end">More stories, always in the making. ↗</p>
      </section>}
      {view === "Contact" && <section className="module-page contact-page">
        <p className="eyebrow">05 — Contact</p>
        <div className="contact-main"><h2>Start with<br/><em>a feeling.</em></h2><a className="contact-email" href="mailto:hello@yixuan.studio"><span>hello@yixuan.studio</span><span aria-hidden="true">↗</span></a></div>
        <div className="contact-bottom"><p>Producer · Production designer · Writer</p><p>Available for select projects · 2026</p></div>
      </section>}
    </main>
    <WorkDialog selection={selection} close={() => setSelection(null)} change={index => setSelection(current => current ? { ...current, index } : null)}/>
  </>;
}
