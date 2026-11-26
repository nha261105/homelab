/**
 * HomeLab scene engine — a tiny 2.5D animation engine for step-by-step lessons.
 * No dependencies. Works in plain HTML (<script type="module">), Astro islands, React, …
 *
 * World coordinates: x (along the row), y (depth), z (height), in "units".
 * project() turns them into SVG pixels. A node's (x, y, z) is its ANCHOR:
 *   - block / pill: bottom-centre (so z > 0 lifts it off the floor, its shadow stays behind)
 *   - pointer: the tip of the arrow
 *
 * Usage (see references/motion.md for the full guide):
 *   const scene = createScene(svgEl, { unit: 62 });
 *   scene.add("c0", { shape: shapes.block({ label: 1, sub: 0 }), x: 0, shadow: true, cls: "cell" });
 *   scene.link("arc", { from: "c0", to: "c6" });
 *   scene.state({ c0: { cls: "cell is-ptr" }, arc: { p: 1, from: { p: 0 }, delay: 280 } });
 */

const NS = "http://www.w3.org/2000/svg";

/** Easing curves. `back` overshoots a little, `drop` accelerates like gravity. */
export const ease = {
  linear: (t) => t,
  out: (t) => 1 - (1 - t) ** 3,
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  back: (t) => {
    const c = 1.70158;
    return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2;
  },
  drop: (t) => t ** 2.3,
};

/** Short one-off effects layered on top of a node's position. amp units: squash/pulse = ratio, shake = px, hop = world units. */
const FX = {
  squash: (t, a) => {
    const v = a * Math.exp(-6 * t) * Math.cos(2.5 * Math.PI * t) * (1 - t);
    return { sx: 1 + v * 0.6, sy: 1 - v };
  },
  shake: (t, a) => ({ dx: a * Math.sin(6 * Math.PI * t) * (1 - t) }),
  hop: (t, a) => ({ dz: a * Math.sin(Math.PI * t) }),
  pulse: (t, a) => ({ s: 1 + a * Math.sin(Math.PI * t) }),
};
const FX_DEFAULTS = {
  squash: { amp: 0.16, dur: 520 },
  shake: { amp: 5, dur: 420 },
  hop: { amp: 0.35, dur: 420 },
  pulse: { amp: 0.1, dur: 480 },
};

const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
const lerp = (a, b, t) => a + (b - a) * t;
const r2 = (v) => Math.round(v * 100) / 100;
const NO_OFF = { dx: 0, dz: 0, sx: 1, sy: 1, s: 1 };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

export const prefersReducedMotion = () => {
  try {
    return matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};

function el(tag, attrs = {}) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  return e;
}
function numeric(obj) {
  const out = {};
  for (const k in obj) if (typeof obj[k] === "number") out[k] = obj[k];
  return out;
}

/**
 * Shape builders. Each returns { kind, html, box, ... } where box = [x0, y0, x1, y1]
 * relative to the anchor (used by camera fitting and links).
 * Colours are never set here: style them in CSS through the `kind` class and node classes.
 */
export const shapes = {
  /** A value cell with a little extruded side for depth. `sub` is a small caption under it (e.g. the index). */
  block({ w = 54, h = 54, depth = 6, r = 10, label = "", sub = null } = {}) {
    return {
      kind: "hl-block",
      box: [-w / 2, -(h + depth), w / 2, sub === null ? 0 : 24],
      shadowW: w,
      html:
        `<rect class="side" x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="${r}"/>` +
        `<rect class="face" x="${-w / 2}" y="${-(h + depth)}" width="${w}" height="${h}" rx="${r}"/>` +
        `<text class="label" x="0" y="${-(depth + h / 2)}" text-anchor="middle" dominant-baseline="central">${esc(label)}</text>` +
        (sub === null ? "" : `<text class="sub" x="0" y="16" text-anchor="middle" dominant-baseline="central">${esc(sub)}</text>`),
    };
  },
  /** A label that sizes itself to its text. Good for sums, notes, verdicts. */
  pill({ text = "", h = 26, pad = 11 } = {}) {
    return {
      kind: "hl-pill",
      box: [-40, -h, 40, 0],
      autoWidth: { h, pad },
      html:
        `<rect class="bg" x="-40" y="${-h}" width="80" height="${h}" rx="${h / 2}"/>` +
        `<text class="label" x="0" y="${-h / 2}" text-anchor="middle" dominant-baseline="central">${esc(text)}</text>`,
    };
  },
  /** An upward arrow with a name tag: l, r, i, j, head, top… Anchor = arrow tip. */
  pointer({ text = "" } = {}) {
    return {
      kind: "hl-pointer",
      box: [-16, 0, 16, 34],
      html:
        `<path class="tip" d="M0 0 L7 9 L-7 9 Z"/>` +
        `<rect class="bg" x="-14" y="11" width="28" height="22" rx="6"/>` +
        `<text class="label" x="0" y="22" text-anchor="middle" dominant-baseline="central">${esc(text)}</text>`,
    };
  },
  /** A window / range highlight whose width tweens through the `w` prop (px). */
  frame({ h = 76, top = -68, r = 14 } = {}) {
    return {
      kind: "hl-frame",
      box: null,
      html: `<rect class="bg" y="${top}" height="${h}" rx="${r}"/>`,
      draw(g, p) {
        const rect = g.firstElementChild;
        const w = Math.max(0, p.w ?? 0);
        rect.setAttribute("x", r2(-w / 2));
        rect.setAttribute("width", r2(w));
      },
    };
  },
};

/**
 * Create a scene inside an <svg>.
 * @param {SVGSVGElement} svg
 * @param {{unit?:number, origin?:[number,number], mode?:"flat"|"iso", angle?:number, view?:number[], pad?:number}} options
 */
export function createScene(svg, options = {}) {
  const o = { unit: 62, origin: [0, 0], mode: "flat", angle: 26, view: [0, 0, 600, 300], pad: 28, ...options };
  const layers = {
    shadows: el("g", { class: "hl-shadows" }),
    back: el("g", { class: "hl-back" }),
    links: el("g", { class: "hl-links" }),
    front: el("g", { class: "hl-front" }),
  };
  svg.append(layers.shadows, layers.back, layers.links, layers.front);

  const nodes = new Map();
  const cam = { cur: [...o.view], tween: null };
  let raf = 0;
  let lastT = 0;
  const now = () => performance.now();
  const setView = (v) => svg.setAttribute("viewBox", v.map(r2).join(" "));
  setView(cam.cur);

  /** World (units) → SVG px. "flat" = front view with height; "iso" = isometric-ish. */
  function project(x, y, z) {
    const u = o.unit;
    if (o.mode === "iso") {
      const a = (o.angle * Math.PI) / 180;
      return [o.origin[0] + (x - y) * u * Math.cos(a), o.origin[1] + (x + y) * u * Math.sin(a) - z * u];
    }
    return [o.origin[0] + x * u, o.origin[1] + y * u * 0.5 - z * u];
  }

  function get(id) {
    const n = nodes.get(id);
    if (!n) throw new Error(`HomeLab scene: no node "${id}"`);
    return n;
  }
  function blank(id, kind, g, shape, props, cls) {
    return {
      id, kind, g, shape, props, base: { ...props }, baseCls: cls, cls: "",
      tween: null, fx: [], pending: [], off: NO_OFF,
      bob: { amp: 0, now: 0, phase: Math.random() * 6.283 }, screen: [0, 0], mid: [0, 0],
    };
  }
  function setCls(n, c) {
    n.cls = c;
    n.g.setAttribute("class", `hl-node ${n.shape.kind || ""} ${c}`.trim());
  }
  function fitPill(n) {
    const { h, pad } = n.shape.autoWidth;
    const t = n.g.querySelector("text");
    let w = 0;
    try { w = t.getComputedTextLength(); } catch { w = 0; }
    if (!w) w = String(t.textContent).length * 7.4;
    w += pad * 2;
    const rect = n.g.querySelector("rect");
    rect.setAttribute("x", r2(-w / 2));
    rect.setAttribute("width", r2(w));
    n.shape.box = [-w / 2, -h, w / 2, 0];
  }
  function setText(n, s) {
    const t = n.g.querySelector("text");
    if (!t) return;
    t.textContent = String(s);
    if (n.shape.autoWidth) fitPill(n);
  }
  function addFx(n, f, at) {
    const spec = typeof f === "string" ? { type: f } : f;
    if (!FX[spec.type]) return;
    n.fx.push({ ...FX_DEFAULTS[spec.type], ...spec, start: at + (spec.delay || 0) });
  }

  /**
   * Add a node. spec: { shape, x, y, z, s, o, r, cls, shadow, layer: "back"|"front", follow: linkId, ...numeric props }
   * `follow` pins the node to a link's apex (for labels such as "1 + 15 = 16").
   */
  function add(id, spec = {}) {
    const shape = spec.shape || { kind: "", html: "", box: null };
    const g = el("g");
    g.innerHTML = shape.html;
    (spec.layer === "back" ? layers.back : layers.front).append(g);
    const props = { x: 0, y: 0, z: 0, s: 1, o: 1, r: 0, ...numeric(spec) };
    const n = blank(id, "node", g, shape, props, spec.cls || "");
    n.follow = spec.follow || null;
    if (spec.shadow) {
      n.shadow = el("ellipse", { class: "hl-shadow", rx: r2((shape.shadowW ?? 40) * 0.46), ry: 5 });
      layers.shadows.append(n.shadow);
    }
    nodes.set(id, n);
    setCls(n, n.baseCls);
    if (shape.autoWidth) fitPill(n);
    if (!n.follow) draw(n);
    return api;
  }

  /** Add a curved connector between two nodes. Its `p` prop (0..1) is how much of it is drawn. */
  function link(id, { from, to, bend = 1, cls = "", p = 0, o: op = 1 } = {}) {
    const g = el("g");
    const path = el("path");
    g.append(path);
    layers.links.append(g);
    const n = blank(id, "link", g, { kind: "hl-link" }, { p, o: op, bend }, cls);
    n.path = path;
    n.ends = [from, to];
    nodes.set(id, n);
    setCls(n, cls);
    return api;
  }

  /**
   * Apply one entry to a node.
   * entry: { ...numeric targets, cls, text, fx, bob, ends, from, delay, dur, ease, arc, land }
   */
  function applyEntry(n, e, { fast, t0, base, defaultCls }) {
    const { cls, text, fx, bob = 0, ends, from, delay = 0, dur = 560, ease: ez = "inOut", arc = 0, land, ...rest } = e;
    const target = { ...base, ...numeric(rest) };
    const nextCls = cls === undefined ? defaultCls : cls;
    if (ends) n.ends = ends;
    n.pending = [];
    n.fx = [];
    if (fast) {
      Object.assign(n.props, target);
      n.tween = null;
      n.bob.amp = 0;
      n.bob.now = 0;
      setCls(n, nextCls);
      if (text !== undefined) setText(n, text);
      return;
    }
    if (from) Object.assign(n.props, numeric(from));
    const changed = Object.keys(target).some((k) => Math.abs((n.props[k] ?? target[k]) - target[k]) > 1e-4);
    n.tween = changed
      ? { from: { ...n.props }, to: target, start: t0 + delay, dur: Math.max(1, dur), ease: ease[ez] || ease.inOut, arc, land: land ?? arc > 0 }
      : null;
    if (nextCls !== n.cls || text !== undefined) {
      n.pending.push({ at: t0 + delay, run: () => { setCls(n, nextCls); if (text !== undefined) setText(n, text); } });
    }
    if (fx) for (const f of [].concat(fx)) addFx(n, f, t0 + delay);
    n.bob.amp = bob;
  }

  /**
   * Declarative step state. Every node not named in `map` goes back to its base props and class,
   * so jumping to any step (forwards or backwards) always lands in the right picture.
   * @param {Record<string, object>} map
   * @param {{animate?:boolean, fit?:string[]|"all"|null}} opts
   */
  function state(map = {}, { animate = true, fit = null } = {}) {
    const fast = !animate || prefersReducedMotion();
    const t0 = now();
    for (const n of nodes.values()) {
      applyEntry(n, map[n.id] || {}, { fast, t0, base: n.base, defaultCls: n.baseCls });
    }
    if (fit) camera(fitBox(fit), { animate: !fast });
    if (fast) renderAll();
    else wake();
  }

  /** Imperative tween relative to the node's CURRENT state (class kept unless given). */
  function to(id, entry = {}) {
    const n = get(id);
    applyEntry(n, entry, { fast: prefersReducedMotion(), t0: now(), base: { ...n.props }, defaultCls: n.cls });
    wake();
    return api;
  }

  function fitBox(ids) {
    const list = ids === "all" ? [...nodes.values()] : ids.map(get);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const n of list) {
      if (n.kind !== "node" || n.follow || !n.shape.box) continue;
      const p = n.tween ? { ...n.props, ...n.tween.to } : n.props;
      if (ids === "all" && p.o < 0.5) continue;
      const [sx, sy] = project(p.x, p.y, p.z);
      const [bx0, by0, bx1, by1] = n.shape.box;
      x0 = Math.min(x0, sx + bx0 * p.s);
      y0 = Math.min(y0, sy + by0 * p.s);
      x1 = Math.max(x1, sx + bx1 * p.s);
      y1 = Math.max(y1, sy + by1 * p.s);
    }
    if (!Number.isFinite(x0)) return [...cam.cur];
    const pad = o.pad;
    // extra room on top for links and their labels
    return [x0 - pad, y0 - pad * 3, x1 - x0 + pad * 2, y1 - y0 + pad * 4];
  }

  /** Move the camera (SVG viewBox) to `view` = [x, y, w, h]. */
  function camera(view, { animate = true, dur = 760 } = {}) {
    if (!animate || prefersReducedMotion()) {
      cam.tween = null;
      cam.cur = [...view];
      setView(cam.cur);
      return api;
    }
    cam.tween = { from: [...cam.cur], to: [...view], start: now(), dur };
    wake();
    return api;
  }

  // ---------- drawing ----------
  function draw(n) {
    const p = n.props, off = n.off || NO_OFF;
    const [sx, sy] = project(p.x, p.y, p.z + off.dz);
    const x = sx + off.dx;
    n.screen = [x, sy];
    const sc = p.s * off.s;
    n.g.setAttribute("transform", `translate(${r2(x)} ${r2(sy)})${p.r ? ` rotate(${r2(p.r)})` : ""} scale(${r2(sc * off.sx)} ${r2(sc * off.sy)})`);
    n.g.style.opacity = String(r2(clamp01(p.o)));
    if (n.shape.draw) n.shape.draw(n.g, p);
    if (n.shadow) {
      const [fx, fy] = project(p.x, p.y, 0);
      const h = Math.max(0, p.z + off.dz);
      const k = 1 / (1 + h * 1.6);
      n.shadow.setAttribute("transform", `translate(${r2(fx + off.dx)} ${r2(fy)}) scale(${r2(k * sc)})`);
      n.shadow.style.opacity = String(r2(clamp01(p.o) * (0.3 * k + 0.04)));
    }
  }
  function drawLink(n) {
    const a = nodes.get(n.ends[0]), b = nodes.get(n.ends[1]);
    if (!a || !b) return;
    const top = (m) => [m.screen[0], m.screen[1] + (m.shape.box ? m.shape.box[1] * m.props.s : 0) - 4];
    const [x1, y1] = top(a), [x2, y2] = top(b);
    // apex sits `lift` px above the higher end (quadratic control point is twice that)
    const lift = n.props.bend * (14 + Math.abs(x2 - x1) * 0.08);
    const cx = (x1 + x2) / 2, cy = Math.min(y1, y2) - lift * 2;
    n.path.setAttribute("d", `M${r2(x1)} ${r2(y1)} Q${r2(cx)} ${r2(cy)} ${r2(x2)} ${r2(y2)}`);
    const len = n.path.getTotalLength();
    n.path.style.strokeDasharray = String(r2(len));
    n.path.style.strokeDashoffset = String(r2(len * (1 - clamp01(n.props.p))));
    n.g.style.opacity = String(n.props.p > 0.001 ? r2(clamp01(n.props.o)) : 0);
    n.mid = [cx, 0.25 * y1 + 0.5 * cy + 0.25 * y2];
  }
  function drawFollower(n) {
    const L = nodes.get(n.follow);
    if (!L) return;
    const p = n.props, off = n.off || NO_OFF, sc = p.s * off.s;
    const [mx, my] = L.mid;
    n.g.setAttribute("transform", `translate(${r2(mx + off.dx)} ${r2(my - 6 - off.dz * o.unit)}) scale(${r2(sc * off.sx)} ${r2(sc * off.sy)})`);
    n.g.style.opacity = String(r2(clamp01(p.o)));
  }
  function renderAll() {
    for (const n of nodes.values()) if (n.kind === "node" && !n.follow) draw(n);
    for (const n of nodes.values()) if (n.kind === "link") drawLink(n);
    for (const n of nodes.values()) if (n.follow) drawFollower(n);
  }

  // ---------- loop ----------
  let destroyed = false;
  function wake() {
    if (!raf && !destroyed) {
      lastT = now();
      raf = requestAnimationFrame(frame);
    }
  }
  function frame(t) {
    raf = 0;
    const dt = Math.min(64, Math.max(0, t - lastT)) / 1000;
    lastT = t;
    let active = false;
    for (const n of nodes.values()) {
      if (n.pending.length) {
        n.pending = n.pending.filter((p) => (t >= p.at ? (p.run(), false) : true));
        if (n.pending.length) active = true;
      }
      const off = { dx: 0, dz: 0, sx: 1, sy: 1, s: 1 };
      const tw = n.tween;
      if (tw) {
        active = true;
        if (t >= tw.start) {
          const k = clamp01((t - tw.start) / tw.dur);
          const e = tw.ease(k);
          for (const key in tw.to) {
            const a = tw.from[key] ?? tw.to[key], b = tw.to[key];
            // fade-ins finish early so things are readable while they still move
            n.props[key] = key === "o" && b > a ? lerp(a, b, clamp01(k / 0.4)) : lerp(a, b, e);
          }
          if (tw.arc) off.dz += tw.arc * Math.sin(Math.PI * clamp01(e));
          if (k >= 1) {
            Object.assign(n.props, tw.to);
            n.tween = null;
            if (tw.land) addFx(n, "squash", t);
          }
        }
      }
      if (n.fx.length) {
        active = true;
        n.fx = n.fx.filter((f) => {
          const k = (t - f.start) / f.dur;
          if (k < 0) return true;
          if (k >= 1) return false;
          const v = FX[f.type](k, f.amp);
          if (v.dx) off.dx += v.dx;
          if (v.dz) off.dz += v.dz;
          if (v.sx) off.sx *= v.sx;
          if (v.sy) off.sy *= v.sy;
          if (v.s) off.s *= v.s;
          return true;
        });
      }
      const b = n.bob;
      if (b.amp || Math.abs(b.now) > 1e-3) {
        active = true;
        b.now += (b.amp - b.now) * (1 - Math.exp(-dt / 0.35));
        b.phase += (dt / 3.2) * Math.PI * 2;
        off.dz += b.now * Math.sin(b.phase);
        if (!b.amp && Math.abs(b.now) <= 1e-3) b.now = 0;
      }
      n.off = off;
    }
    renderAll();
    if (cam.tween) {
      const k = clamp01((t - cam.tween.start) / cam.tween.dur), e = ease.inOut(k);
      cam.cur = cam.tween.from.map((v, i) => lerp(v, cam.tween.to[i], e));
      setView(cam.cur);
      if (k >= 1) cam.tween = null;
      else active = true;
    }
    if (active) raf = requestAnimationFrame(frame);
  }

  const api = {
    add,
    link,
    state,
    to,
    fx: (id, f) => { addFx(get(id), f, now()); wake(); return api; },
    camera,
    fit: (ids, opt) => camera(fitBox(ids), opt),
    project,
    node: get,
    nodes,
    redraw: renderAll,
    /** Stop the animation loop for good (call when the page/SVG goes away). */
    destroy() { destroyed = true; if (raf) cancelAnimationFrame(raf); raf = 0; },
  };
  return api;
}

/**
 * Step player: prev / next / play / keyboard / #step-N in the URL.
 * @param {{count:number, onStep:(i:number, ctx:{animate:boolean})=>void, interval?:number, keys?:boolean, hash?:string|null, signal?:AbortSignal}} opts
 * Pass `signal` (or call `destroy()`) to remove its window listeners — needed with client-side page swaps.
 */
export function createPlayer({ count, onStep, interval = 2300, keys = true, hash = "step-", signal }) {
  const life = new AbortController();
  signal?.addEventListener("abort", () => life.abort(), { once: true });
  life.signal.addEventListener("abort", () => { if (timer) clearInterval(timer); timer = 0; }, { once: true });
  let i = 0;
  let timer = 0;
  const subs = new Set();
  const emit = () => subs.forEach((f) => f(api));
  const clamp = (n) => Math.max(0, Math.min(count - 1, n));

  function go(n, { animate = true, fromPlay = false } = {}) {
    if (!fromPlay) stop(false);
    i = clamp(n);
    onStep(i, { animate });
    if (hash) try { history.replaceState(null, "", `#${hash}${i + 1}`); } catch { /* ignore */ }
    emit();
  }
  function stop(notify = true) {
    if (timer) clearInterval(timer);
    timer = 0;
    if (notify) emit();
  }
  function play() {
    if (timer) return;
    if (i >= count - 1) go(0);
    timer = setInterval(() => (i >= count - 1 ? stop() : go(i + 1, { fromPlay: true })), interval);
    emit();
  }
  const api = {
    go,
    next: () => go(i + 1),
    prev: () => go(i - 1),
    play,
    stop,
    toggle: () => (timer ? stop() : play()),
    on: (f) => (subs.add(f), () => subs.delete(f)),
    get index() { return i; },
    get count() { return count; },
    get playing() { return !!timer; },
    destroy: () => life.abort(),
  };
  if (keys) {
    addEventListener("keydown", (e) => {
      if (e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowRight") api.next();
      else if (e.key === "ArrowLeft") api.prev();
    }, { signal: life.signal });
  }
  const fromHash = () => {
    const m = (location.hash || "").match(new RegExp(`^#${hash}(\\d+)$`));
    return m ? clamp(+m[1] - 1) : null;
  };
  // typing a new #step-N in the address bar (or following an in-page link) jumps there
  if (hash) addEventListener("hashchange", () => { const n = fromHash(); if (n !== null && n !== i) go(n); }, { signal: life.signal });
  i = (hash && fromHash()) ?? 0;
  queueMicrotask(() => { if (!life.signal.aborted) { onStep(i, { animate: false }); emit(); } });
  return api;
}
