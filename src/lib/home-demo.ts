/* Home page: plays a real lesson's steps on a loop in the hero card. */
import { createScene, shapes, prefersReducedMotion } from "./scene-engine.js";
import { UI } from "./i18n";
import type { Lang, LessonModule } from "./types";

const lessons = import.meta.glob<LessonModule>("../lessons/*/*/*.ts");

export async function initDemo(signal: AbortSignal) {
  const host = document.querySelector<HTMLElement>("[data-demo]");
  const load = host && lessons[`../lessons/${host.dataset.demo}.ts`];
  if (!host || !load) return;
  const { lesson: L, setup } = await load();
  if (signal.aborted) return;
  const lang = document.documentElement.lang as Lang;
  const t = UI[lang];
  const scene = createScene(host.querySelector("svg")!, { unit: 62, origin: [0, 0], ...L.sceneOptions, pad: 36 });
  setup(scene, shapes);
  signal.addEventListener("abort", () => scene.destroy(), { once: true });
  const caption = document.getElementById("demoCaption");

  const show = (i: number, animate: boolean) => {
    const s = L.steps[i];
    scene.state(s.scene, { animate, fit: s.fit });
    if (caption) caption.textContent = `${L.title[lang]} · ${t.step} ${i + 1}: ${s.title[lang]}`;
  };

  if (prefersReducedMotion()) { show(Math.min(4, L.steps.length - 1), false); return; }

  let i = 1;
  show(0, false);
  show(1, true);
  let timer = 0;
  const tick = () => { i = (i + 1) % L.steps.length; show(i, true); };
  const start = () => { if (!timer) timer = window.setInterval(tick, 2400); };
  const stop = () => { clearInterval(timer); timer = 0; };
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
  io.observe(host);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()), { signal });
  signal.addEventListener("abort", () => { stop(); io.disconnect(); }, { once: true });
}
