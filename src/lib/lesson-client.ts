/* Client code for a lesson page. The server renders all text; this file drives the scene
   and updates what changes per step. */
import { createScene, createPlayer, shapes } from "./scene-engine.js";
import { UI } from "./i18n";
import { store } from "./chrome";
import { recordStep } from "./progress";
import { paintProgress } from "./shell";
import type { Lang, LessonModule } from "./types";

const lessons = import.meta.glob<LessonModule>("../lessons/*/*/*.ts");
const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector(s) as T;
const LINE = 24; // px per code line (matches .code line-height)

/** Set up the lesson on the current page (no-op elsewhere). `signal` aborts when the page is swapped out. */
export async function initLesson(signal: AbortSignal) {
  const app = $("#app");
  const key = app.dataset.lesson;
  const load = key && lessons[`../lessons/${key}.ts`];
  if (!key || !load) return;
  const { lesson: L, setup } = await load();
  if (signal.aborted) return;
  const lang = document.documentElement.lang as Lang;
  const t = UI[lang];

  const scene = createScene($("#scene"), { unit: 62, origin: [0, 0], ...L.sceneOptions });
  setup(scene, shapes);
  signal.addEventListener("abort", () => scene.destroy(), { once: true });

  const stepBtns = [...document.querySelectorAll<HTMLButtonElement>("#stepList button")];
  const codeLines = [...document.querySelectorAll<HTMLElement>("#code .ln")];
  const caret = $("#caret");
  let entered = false;

  const entrance = (map: Record<string, Record<string, unknown>>) => {
    const m = { ...map };
    (L.entrance ?? []).forEach((id, k) => { m[id] = { ...(m[id] || {}), from: { z: 1.6, o: 0 }, delay: k * 70, dur: 520, ease: "drop", land: true }; });
    return m;
  };

  function paintScene(i: number, animate: boolean) {
    const s = L.steps[i];
    if (!entered) {
      entered = true;
      scene.state({}, { animate: false, fit: s.fit });
      scene.state(entrance(s.scene), { animate: true, fit: s.fit });
    } else scene.state(s.scene, { animate, fit: s.fit });
  }

  function showStep(i: number, { animate }: { animate: boolean }) {
    const s = L.steps[i];
    const next = L.steps[i + 1];
    paintScene(i, animate);

    $("#scNo").textContent = String(i + 1);
    $("#stepNo").textContent = String(i + 1);
    const kind = $("#scKind");
    kind.className = `kind k-${s.kind}`;
    kind.textContent = t[`k${s.kind}` as keyof typeof t];
    $("#stepTitle").textContent = s.title[lang];
    $("#stepBody").innerHTML = s.body[lang];
    const note = $("#note");
    note.hidden = !s.note;
    if (s.note) $("#noteText").innerHTML = s.note[lang];
    $("#nextText").textContent = next ? `${t.nextLabel}: ${next.title[lang]}` : t.nextLabel;
    if (animate) ["#stepTitle", "#stepBody", "#note"].forEach((sel, k) =>
      $(sel).animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 300, delay: k * 60, easing: "ease-out", fill: "backwards" }));

    codeLines.forEach((ln, k) => ln.classList.toggle("hl", s.lines.includes(k + 1)));
    caret.style.opacity = s.lines.length ? "1" : "0";
    if (s.lines.length) caret.style.top = `${8 + (s.lines[0] - 1) * LINE}px`;

    const vcls: Record<string, string> = { ">": "v-gt", "<": "v-lt", "=": "v-eq" };
    L.watch.forEach((w) => {
      const el = $(`[data-w="${w.key}"]`);
      const v = String(s.watch[w.key] ?? "—");
      const changed = el.textContent !== v;
      el.textContent = v;
      el.className = `stat-v ${w.key === "cmp" ? vcls[v] || "" : ""}`;
      el.closest(".stat")!.classList.toggle("set", v !== "—");
      if (changed && animate) { void el.offsetWidth; el.classList.add("flash"); }
    });

    stepBtns.forEach((b, k) => {
      b.className = k < i ? "done" : k === i ? "cur" : "";
      b.toggleAttribute("aria-current", k === i);
    });
    stepBtns[i].scrollIntoView({ block: "nearest", inline: "center", behavior: animate ? "smooth" : "auto" });

    recordStep(key!, i + 1, L.steps.length);
    paintProgress();
  }

  const player = createPlayer({ count: L.steps.length, onStep: showStep, signal });
  player.on((p: { index: number; count: number; playing: boolean }) => {
    for (const id of ["#prev", "#prevArrow"]) $<HTMLButtonElement>(id).disabled = p.index === 0;
    for (const id of ["#next", "#nextArrow"]) $<HTMLButtonElement>(id).disabled = p.index === p.count - 1;
    app.classList.toggle("playing", p.playing);
  });

  document.addEventListener("click", (e) => {
    const b = (e.target as Element).closest("button");
    if (!b) return;
    if (b.id === "prev" || b.id === "prevArrow") player.prev();
    else if (b.id === "next" || b.id === "nextArrow") player.next();
    else if (b.id === "play") player.toggle();
    else if (b.dataset.go !== undefined) player.go(+b.dataset.go);
    else if (b.id === "replay") {
      const i = player.index;
      if (i === 0) { entered = false; paintScene(0, true); }
      else { scene.state(L.steps[i - 1].scene, { animate: false, fit: L.steps[i - 1].fit }); paintScene(i, true); }
    } else if (b.id === "copyLink") {
      const done = () => { b.classList.add("ok"); setTimeout(() => b.classList.remove("ok"), 1400); };
      try { navigator.clipboard.writeText(location.href).then(done, () => {}); } catch { /* no clipboard */ }
    }
  }, { signal });

  initResizers();
}

/* Drag the inner edge of the course tree / right column. ← → when focused (Shift = bigger), double-click resets. */
const SIZE = { left: { min: 220, max: 420, el: "#sidebar" }, right: { min: 320, max: 620, el: "#aside" } } as const;
type Side = keyof typeof SIZE;

function initResizers() {
  const app = $("#app");
  const mq = matchMedia("(min-width: 1100px)");
  const width = (side: Side) => ($(SIZE[side].el) as HTMLElement).offsetWidth;
  const setWidth = (side: Side, px: number, save = true) => {
    const other = side === "left" ? width("right") : width("left");
    const room = app.clientWidth - 480 - other; // keep the centre >= 480px
    const w = Math.round(Math.max(SIZE[side].min, Math.min(SIZE[side].max, room, px)));
    app.style.setProperty(`--${side}-w`, `${w}px`);
    if (save) store.set(`homelab:${side}-w`, String(w));
  };
  for (const side of ["left", "right"] as Side[]) {
    const saved = Number(store.get(`homelab:${side}-w`));
    if (saved) app.style.setProperty(`--${side}-w`, `${Math.max(SIZE[side].min, Math.min(SIZE[side].max, saved))}px`);
    const h = document.createElement("button");
    h.className = `resizer r-${side}`;
    h.setAttribute("role", "separator");
    h.setAttribute("aria-orientation", "vertical");
    h.setAttribute("aria-label", side === "left" ? "Resize contents" : "Resize side panel");
    $(SIZE[side].el).append(h);
    h.addEventListener("pointerdown", (e) => {
      if (!mq.matches) return;
      e.preventDefault();
      h.setPointerCapture(e.pointerId);
      h.classList.add("dragging");
      document.body.classList.add("resizing");
      const r = app.getBoundingClientRect();
      const move = (ev: PointerEvent) => setWidth(side, side === "left" ? ev.clientX - r.left : r.right - ev.clientX, false);
      const up = () => {
        h.removeEventListener("pointermove", move);
        h.classList.remove("dragging");
        document.body.classList.remove("resizing");
        setWidth(side, width(side));
      };
      h.addEventListener("pointermove", move);
      h.addEventListener("pointerup", up, { once: true });
      h.addEventListener("pointercancel", up, { once: true });
    });
    h.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      e.stopPropagation();
      const d = (e.key === "ArrowRight" ? 1 : -1) * (e.shiftKey ? 48 : 16) * (side === "left" ? 1 : -1);
      setWidth(side, width(side) + d);
    });
    h.addEventListener("dblclick", () => { app.style.removeProperty(`--${side}-w`); store.set(`homelab:${side}-w`, ""); });
  }
}
