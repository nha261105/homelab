/* Client code shared by every page: theme, language menu, search, sidebar drawer, progress in the tree. */
import { store } from "./chrome";
import { getProgress, statusOf } from "./progress";

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T | null;

/** Fill [data-prog-keys] counters/bars and [data-lesson-key] / [data-topic-keys] statuses from this browser's progress. */
export function paintProgress(root: ParentNode = document) {
  const prog = getProgress();
  root.querySelectorAll<HTMLElement>("[data-prog-keys]").forEach((el) => {
    const keys = el.dataset.progKeys!.split(",").filter(Boolean);
    const done = keys.filter((k) => prog[k]?.done).length;
    // only counters/bars that belong to this element, not to a nested [data-prog-keys]
    const own = (sel: string) => [...el.querySelectorAll<HTMLElement>(sel)].filter((n) => n.closest("[data-prog-keys]") === el);
    own("[data-prog-done]").forEach((n) => (n.textContent = String(done)));
    own("[data-prog-bar]").forEach((b) => (b.style.width = keys.length ? `${(done / keys.length) * 100}%` : "0%"));
  });
  root.querySelectorAll<HTMLElement>("[data-lesson-key]").forEach((el) => (el.dataset.status = statusOf(prog[el.dataset.lessonKey!])));
  root.querySelectorAll<HTMLElement>("[data-topic-keys]").forEach((el) => {
    const st = el.dataset.topicKeys!.split(",").filter(Boolean).map((k) => statusOf(prog[k]));
    el.dataset.status = st.length && st.every((x) => x === "done") ? "done" : st.some((x) => x !== "none") ? "started" : "none";
  });
}

function initTheme(signal: AbortSignal) {
  const btn = $("themeBtn");
  const cur = () => document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  btn?.addEventListener("click", () => {
    const next = cur() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    store.set("homelab:theme", next);
  });
}

function initLangMenu(signal: AbortSignal) {
  const btn = $("langBtn"), menu = $("langMenu");
  if (!btn || !menu) return;
  const set = (open: boolean) => { menu.hidden = !open; btn.setAttribute("aria-expanded", String(open)); };
  btn.addEventListener("click", (e) => { e.stopPropagation(); set(menu.hasAttribute("hidden")); });
  document.addEventListener("click", (e) => { if (!menu.contains(e.target as Node)) set(false); }, { signal });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); }, { signal });
  // keep the current step when switching language
  menu.querySelectorAll<HTMLAnchorElement>("a").forEach((a) => a.addEventListener("click", () => {
    if (location.hash) a.href = a.href.split("#")[0] + location.hash;
  }));
}

function initSearch(signal: AbortSignal) {
  const input = $<HTMLInputElement>("searchInput"), list = $("searchResults");
  if (!input || !list) return;
  const data = JSON.parse($("searchIndex")?.textContent || "[]") as { t: string; s: string; h: string; r: number; k: string }[];
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").toLowerCase();
  const empty = document.documentElement.lang === "vi" ? "Không tìm thấy" : "No matches";
  let sel = 0;
  const render = () => {
    const q = norm(input.value.trim());
    if (!q) { list.hidden = true; return; }
    const hits = data.filter((d) => norm(`${d.t} ${d.s}`).includes(q)).sort((a, b) => b.r - a.r).slice(0, 8);
    sel = 0;
    list.innerHTML = hits.length
      ? hits.map((d, i) => `<li role="option"${i === 0 ? ' aria-selected="true"' : ""}><a href="${d.h}" data-track="${d.k}" class="${d.r ? "" : "soon"}"><b>${d.t}</b><span>${d.s}</span></a></li>`).join("")
      : `<li class="none">${empty}</li>`;
    list.hidden = false;
  };
  const move = (d: number) => {
    const items = [...list.querySelectorAll("li[role=option]")];
    if (!items.length) return;
    items[sel]?.removeAttribute("aria-selected");
    sel = (sel + d + items.length) % items.length;
    items[sel].setAttribute("aria-selected", "true");
  };
  input.addEventListener("input", render);
  input.addEventListener("focus", render);
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Enter") { const a = list.querySelector<HTMLAnchorElement>("li[aria-selected] a"); if (a) location.href = a.href; }
    else if (e.key === "Escape") { input.blur(); list.hidden = true; }
    e.stopPropagation(); // arrows here must not change the lesson step
  });
  document.addEventListener("click", (e) => { if (!$("search")?.contains(e.target as Node)) list.hidden = true; }, { signal });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !(e.target as Element).closest("input, textarea")) { e.preventDefault(); input.focus(); }
  }, { signal });
}

function initDrawer(signal: AbortSignal) {
  const btn = $("drawerBtn"), side = $("sidebar"), scrim = $("scrim");
  if (!btn || !side || !scrim) return;
  const set = (open: boolean) => { side.classList.toggle("open", open); scrim.hidden = !open; btn.setAttribute("aria-expanded", String(open)); };
  btn.addEventListener("click", () => set(!side.classList.contains("open")));
  scrim.addEventListener("click", () => set(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); }, { signal });
}

/** Set up the shell of the current page. `signal` aborts when the page is swapped out. */
export function initShell(signal: AbortSignal) {
  store.set("homelab:lang", document.documentElement.lang);
  initTheme(signal);
  initLangMenu(signal);
  initSearch(signal);
  initDrawer(signal);
  paintProgress();
  // keep the open lesson visible in a long tree
  document.querySelector(".tree .file[aria-current]")?.scrollIntoView({ block: "nearest" });
}
