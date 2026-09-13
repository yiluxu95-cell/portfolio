"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent, type FocusEvent } from "react";
import type { Work } from "./portfolio-data";

// The button's hit area never moves. Only its pointer-transparent visual enlarges.
// This avoids hover/leave feedback loops when overlapping images cross the cursor.
function prepareZoom(button: HTMLButtonElement) {
  const visual = button.querySelector<HTMLElement>(".pile-visual");
  if (!visual) return;
  const rect = button.getBoundingClientRect();
  const width = visual.offsetWidth;
  const height = visual.offsetHeight;
  const zoom = Math.min(2.35, (window.innerWidth - 32) / width, (window.innerHeight - 112) / height);
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const halfW = width * zoom / 2;
  const halfH = height * zoom / 2;
  const targetX = Math.max(halfW + 16, Math.min(window.innerWidth - halfW - 16, x));
  const targetY = Math.max(88 + halfH, Math.min(window.innerHeight - halfH - 16, y));
  button.style.setProperty("--zoom", String(zoom));
  button.style.setProperty("--lift-x", `${targetX - x}px`);
  button.style.setProperty("--lift-y", `${targetY - y}px`);
}

export function PileGallery({ items, kind, onOpen }: { items: Work[]; kind: "photo" | "design"; onOpen: (index: number) => void }) {
  const enter = (event: PointerEvent<HTMLButtonElement> | FocusEvent<HTMLButtonElement>) => prepareZoom(event.currentTarget);
  return <div className={`pile-grid ${kind}-grid`} aria-label={kind === "photo" ? "Photography collection" : "Design collection"}>
    {items.map((item, i) => <button
      type="button" className="pile-cell" key={item.id} aria-label={`Open ${item.title}`}
      onPointerEnter={enter} onFocus={enter} onClick={() => onOpen(i)}
      style={{ "--angle": `${((i * 17) % 25) - 12}deg`, "--offset": `${((i * 13) % 23) - 11}px`, "--aspect": item.aspect, "--base-scale": 0.88 + (i % 4) * 0.045 } as CSSProperties}
    >
      <span className="pile-visual">
        {/* Native images retain decoded pixels while the compositor scales them. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={item.title} loading={i < 14 ? "eager" : "lazy"} decoding="async" draggable={false}/>
        <span className="pile-caption"><b>{String(i + 1).padStart(2, "0")}</b><span>{item.title}</span><span>↗</span></span>
      </span>
    </button>)}
  </div>;
}

export function FilmWaterfall({ items, onOpen }: { items: Work[]; onOpen: (index: number) => void }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pauseRef = useRef<HTMLButtonElement>(null);
  const paused = useRef(false);
  const dragged = useRef(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const columns = Array.from(viewport.querySelectorAll<HTMLElement>(".film-column"));
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    let enabled = !motionQuery.matches && pointerQuery.matches;
    let frame = 0;
    let previousTime = 0;
    let inside = false;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let bounds = viewport.getBoundingClientRect();
    let pointerY = 0;
    let drag: { x: number; y: number; top: number; left: number } | null = null;
    const resize = new ResizeObserver(() => { bounds = viewport.getBoundingClientRect(); });
    resize.observe(viewport);
    const schedule = () => { if (!frame && enabled && !paused.current) frame = requestAnimationFrame(tick); };
    const tick = (time: number) => {
      frame = 0;
      if (!enabled || paused.current || document.hidden || document.querySelector("dialog[open]")) return;
      const elapsed = previousTime ? Math.min(time - previousTime, 32) : 16.7;
      previousTime = time;
      const ease = 1 - Math.exp(-elapsed / 125);
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      columns.forEach((column, i) => {
        const depth = i % 2 ? 1 : -0.75;
        column.style.transform = `translate3d(${currentX * 13}px, ${currentY * 42 * depth}px, 0)`;
      });
      // Edge movement reveals more of the waterfall; the middle stays still for selection.
      const beforeScroll = viewport.scrollTop;
      if (inside && !drag) {
        const edge = Math.abs(pointerY) > 0.68 ? Math.sign(pointerY) * (Math.abs(pointerY) - 0.68) / 0.32 : 0;
        viewport.scrollTop += edge * elapsed * 0.38;
      }
      if (viewport.scrollTop !== beforeScroll || Math.abs(targetX-currentX) + Math.abs(targetY-currentY) > 0.002) schedule();
      else previousTime = 0;
    };
    const move = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      inside = true;
      targetX = Math.max(-1, Math.min(1, ((event.clientX-bounds.left)/bounds.width-0.5)*2));
      targetY = pointerY = Math.max(-1, Math.min(1, ((event.clientY-bounds.top)/bounds.height-0.5)*2));
      if (drag) {
        const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
        if (Math.hypot(dx, dy) > 6) {
          dragged.current = true;
          viewport.classList.add("is-dragging");
          viewport.scrollTop = drag.top - dy;
          viewport.scrollLeft = drag.left - dx;
        }
      }
      schedule();
    };
    const leave = () => { inside = false; targetX = targetY = 0; schedule(); };
    const down = (event: globalThis.PointerEvent) => {
      dragged.current = false;
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag = { x: event.clientX, y: event.clientY, top: viewport.scrollTop, left: viewport.scrollLeft };
    };
    const up = () => { drag = null; viewport.classList.remove("is-dragging"); };
    const updateMotion = () => {
      enabled = !motionQuery.matches && pointerQuery.matches;
      if (!enabled || paused.current) {
        cancelAnimationFrame(frame); frame = 0;
        columns.forEach(column => { column.style.transform = ""; });
        currentX = currentY = previousTime = 0;
      } else schedule();
    };
    const toggle = () => {
      paused.current = !paused.current;
      pauseRef.current?.setAttribute("aria-pressed", String(paused.current));
      if (pauseRef.current) pauseRef.current.textContent = paused.current ? "Resume motion ↗" : "Pause motion Ⅱ";
      updateMotion();
    };
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
      else if (inside) schedule();
    };
    const pauseButton = pauseRef.current;
    viewport.addEventListener("pointermove", move, { passive: true });
    viewport.addEventListener("pointerleave", leave);
    viewport.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    motionQuery.addEventListener("change", updateMotion);
    pointerQuery.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", visibility);
    pauseButton?.addEventListener("click", toggle);
    return () => {
      cancelAnimationFrame(frame); resize.disconnect();
      viewport.removeEventListener("pointermove", move);
      viewport.removeEventListener("pointerleave", leave);
      viewport.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      motionQuery.removeEventListener("change", updateMotion);
      pointerQuery.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", visibility);
      pauseButton?.removeEventListener("click", toggle);
    };
  }, []);

  // Repeated stills continue the visual flow without inventing extra film projects.
  const sequence = Array.from({ length: items.length * 3 }, (_, i) => ({ item: items[i % items.length], index: i % items.length, key: i }));
  return <>
    <div className="film-viewport" ref={viewportRef} tabIndex={0} aria-label="Moving film waterfall. Scroll or drag to explore; select a still to open the project.">
      <div className="film-masonry">
        {Array.from({ length: 5 }, (_, column) => <div className="film-column" key={column}>
          {sequence.filter((_, i) => i % 5 === column).map(({ item, index, key }) => <button
            className="film-card" type="button" key={key} aria-label={`Open ${item.title}`}
            onClick={() => { if (!dragged.current) onOpen(index); }}
            onKeyDown={() => { dragged.current = false; }}
          >
            <span className="film-card-visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} style={{ aspectRatio: key >= items.length ? [1.3, 0.72, 1, 0.8][(key + 1) % 4] : item.aspect }} draggable={false} decoding="async" loading={key < 8 ? "eager" : "lazy"}/>
              <span className="film-caption"><span>{String(index + 1).padStart(2, "0")} / {item.year}</span><strong>{item.title}</strong><span>View project ↗</span></span>
            </span>
          </button>)}
        </div>)}
      </div>
    </div>
    <div className="gallery-footer"><span>{String(items.length).padStart(2, "0")} projects / a moving index</span><button type="button" ref={pauseRef} aria-pressed="false">Pause motion Ⅱ</button></div>
  </>;
}
