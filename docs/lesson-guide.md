# Lesson guide — how to write a HomeLab lesson

Everything an agent (or a person) needs to add a lesson without asking. Read it all once before the first lesson.
The two reference lessons are **`src/lessons/cp/two-pointers/pair-sum.ts`** and **`src/lessons/cp/prefix-sum/range-sum.ts`**:
when in doubt, copy what they do.

## 1. What a lesson is

One idea, one concrete example with real numbers, 5–9 steps. Each step is **one change the learner should see**
in the diagram, plus 1–3 sentences explaining it. The page shows, per step: the diagram, the step card
(title, kind tag, body, optional "key idea"), highlighted code lines and a row of watched variables.

## 2. Files

| File | What you do |
|---|---|
| `docs/roadmap/cp.md` | Pick the next ⬜ lesson. When done, change it to ✅. Do not change headings or table format — the site parses this file. |
| `src/lessons/cp/{chapter key}/{slug}.ts` | **The lesson.** Create it. The chapter key and slug come from the roadmap. |
| everything else | **Do not edit** (engine, layout, styles, catalog) unless the task says so. If a lesson truly needs a new shape or engine feature, stop and report it instead. |

A lesson appears in the course tree automatically once its `.ts` file exists.

## 3. The lesson file

```ts
import type { Lesson, SceneMap } from "../../../lib/types";

const A = [3, 1, 4, 1, 5, 9, 2, 6];   // the example data
const U = 62;                          // px per world unit = distance between two cells

export const lesson: Lesson = {
  track: "cp", topic: "prefix-sum", slug: "range-sum",       // must match the folder / file name
  title:   { vi: "Prefix Sum", en: "Prefix Sums" },
  added: "2026-11-26",                                        // today, YYYY-MM-DD
  summary: { vi: "…một câu…", en: "…one sentence…" },
  level: "basic",                                             // basic | medium | hard
  minutes: 7, time: "O(n + q)", memory: "O(n)",
  goal: { vi: "tổng <b>a[2..5]</b>", en: "sum of <b>a[2..5]</b>" },   // one line above the diagram
  codeLang: "C++17",
  code: ['<span class="kw">for</span> (…)', …],                // one string per line; kw / nm / cm spans
  watch: [{ key: "i", label: "i" }, { key: "sum", label: { vi: "tổng", en: "sum" } }],
  practice: [{ src: "CSES 1646", name: "Static Range Sum Queries", lv: "★☆☆", url: "https://cses.fi/problemset/task/1646" }],
  sceneOptions: { unit: U },
  legend: [{ cls: "acc", label: { vi: "đang dùng", en: "in use" } }],  // acc | ac | wa | tle | dim
  entrance: A.map((_, k) => `c${k}`),                         // nodes that drop in on first paint
  steps: [ /* see §5 */ ],
};

export function setup(scene: any, shapes: any) {             // build EVERY node once, in its base state
  A.forEach((v, i) => scene.add(`c${i}`, { shape: shapes.block({ label: v, sub: i }), x: i, shadow: true }));
}
```

- Code: escape `<` `>` `&` as `&lt;` `&gt;` `&amp;`. Use the same C++ the learner would submit; keep it under ~14 lines.
- `practice`: 2–4 real problems from the roadmap row, easiest first. **Open each URL** and check that the title matches.
- `watch` values are set per step; a key a step does not mention shows "—".

## 4. Writing the text

- Write Vietnamese first, then English of the same length. Do not translate word for word.
- Keep standard terms in English: Two Pointers, prefix sum, BFS, segment tree…
- **Use the example's numbers**: "1 + 15 = 16 > 14", not "the sum is too big".
- Name things as in the code, inside `<code>`: `l`, `r`, `pre[i]`.
- Step 1 = the problem and why the naive way is slow (`kind: "problem"`). Last step = why it is correct / the complexity (`kind: "recap"`).
- Step titles: 2–5 words, an action or a conclusion ("Sum too big", "Add one cell at a time").
- `note` (key idea): optional, one sentence, the thing to remember. Not on every step.
- Step `kind`: `problem` · `concept` · `step` · `answer` · `recap`.
- Use `verdict: "ac"` from the step where the answer is found; `"run"` before it.

## 5. Steps and scenes

```ts
{
  title: { vi: "Tổng quá lớn", en: "Sum too big" }, kind: "step",
  body:  { vi: "…", en: "…" },
  note:  { vi: "…", en: "…" },               // optional
  lines: [3, 6],                              // 1-based code lines to highlight
  watch: { l: 0, r: 6, sum: 16, cmp: ">" },
  verdict: "run",
  fit: ["c0", "c6", "pl", "pr"],              // node ids the camera frames
  scene: { pr: { x: 5, o: 1, arc: 0.55, dur: 620 }, c6: { cls: "is-out", z: -0.12, s: 0.9, o: 0.55 } },
}
```

**Each step's `scene` is the complete picture of that step.** A node not named returns to its base state
(position, opacity, class). Jumping straight to step 5, or going back from 5 to 2, must look right.
Write small helpers (like `win()`, `compare()`, `out()`, `preUpTo()` in the reference lessons) so every step
can state its whole picture in one line.

⚠️ `text` (a label change) does **not** revert by itself. If any step changes a node's text, every step must set it.

### Shapes

| Shape | Anchor | Use |
|---|---|---|
| `block({ label, sub, w=54, h=54 })` | bottom centre | array cells, values; `sub` = small caption under it (the index) |
| `pill({ text })` | bottom centre | sums, formulas, row labels; width follows the text |
| `pointer({ text })` | arrow tip | `l`, `r`, `i`, `lo`, `hi`… put it at `z: -0.5` to sit under a row |
| `frame()` | centre | dashed window behind cells; width through the `w` prop: `(r − l) * U + 70` |
| `scene.link(id, { from, to })` | — | curved arc between two nodes; draw it with `p: 1, from: { p: 0 }`; a pill can `follow` it |

Positions are in world units: `x` = column, `y` = row (a second row at `y: 3`), `z` = height (up is positive).

### Entry keys

| Key | Meaning |
|---|---|
| `x y z s o r p w` | target values (absolute) |
| `cls` | replaces the class at `delay`: `is-active` · `is-bad` · `is-good` · `is-out`; links/pills: `v-gt` · `v-lt` · `v-eq` |
| `text` | new label text at `delay` |
| `from` | start values set before tweening (e.g. `{ o: 0, s: 0.7 }`) |
| `delay`, `dur`, `ease` | timing; ease: `linear` `out` `inOut` `back` `drop` |
| `arc` | lift during a move (world units); lands with a squash |
| `land` | force a squash at the end |
| `fx` | `"shake"` `"hop"` `"squash"` `"pulse"`, or `{ type, amp, delay }` |
| `bob` | gentle idle float (0.04–0.06) — only for the answer |
| `ends` | change the two nodes a link connects |

### Rhythm of one step

| t (ms) | What happens |
|---|---|
| 0 | the thing that moves starts moving; dropped elements sink (`is-out`) |
| ~280 | a link / comparison is drawn |
| ~640 | the result label pops (`ease: "back"`) |
| ~900 | the conclusion: shake what is wrong, hop what is right |

Moves 520–620 ms, appear 300–400 ms, shake 420 ms. A step finishes within ~1.3 s.
Never move more than ~3 things in the same beat. Colours come from classes only — never set colours in code.

### Common recipes

| Want | Entry |
|---|---|
| Move a pointer one cell | `{ x: i, o: 1, arc: 0.55, dur: 620 }` |
| Swap two cells | `a: { x: j, arc: 0.9 }, b: { x: i, arc: 0.9, delay: 60 }` |
| Rule an element out | `{ cls: "is-out", z: -0.12, s: 0.9, o: 0.55, ease: "out" }` |
| Compare two cells | link `{ ends, p: 1, from: { p: 0 }, delay: 280 }` + a pill that follows it |
| Push onto a stack | `{ z: k * 1.05, from: { z: k + 2, o: 0 }, ease: "drop", land: true }` |
| A value just computed | `{ cls: "is-good", from: { z: 0.9, o: 0 }, ease: "drop", land: true }` |
| The answer | `{ cls: "is-good", delay: 900, fx: { type: "hop", amp: 0.3 }, bob: 0.05 }` |

### Camera

`fit` lists the nodes that must be visible. Include row labels and any pill placed outside the rows
(e.g. a formula under the second row), otherwise they get clipped.

## 6. Done checklist

- [ ] `npm run build` passes (it runs `astro check` first).
- [ ] `npm run dev`, open `/vi/cp/{chapter}/{slug}`: click through every step, then jump around (6 → 2 → 5) — the picture is always right.
- [ ] Switch to EN, to dark, and narrow the window to ~400 px: nothing overflows, labels stay readable.
- [ ] Practice links open the right problems.
- [ ] Roadmap row changed to ✅.
- [ ] One commit for the lesson: `lesson(cp): {slug} — {English title}`.
