# AGENTS.md

HomeLab is a personal knowledge base (Competitive Programming, SWE, AI, Papers). Each lesson explains one idea
step by step with an animated diagram. Astro 7 + TypeScript, static output, bilingual VI/EN, light/dark.

## Commands

```sh
npm install
npm run dev      # http://localhost:4321  (lessons: /vi/cp/{chapter}/{slug})
npm run build    # astro check + static build — must pass before every commit
```

## Most tasks: write a lesson

1. Read **`docs/lesson-guide.md`** (format, writing rules, animation vocabulary, checklist).
2. Take the lesson from **`docs/roadmap/cp.md`** (chapter key, slug, titles, the example to animate, practice problems).
3. Create `src/lessons/cp/{chapter key}/{slug}.ts`, modelled on
   `src/lessons/cp/two-pointers/pair-sum.ts` and `src/lessons/cp/prefix-sum/range-sum.ts`.
4. Run the checklist at the end of the guide, mark the roadmap row ✅, commit.

## Rules

- **Only touch what the task names.** For a lesson that is its `.ts` file and its roadmap row.
  Do not edit `src/lib/scene-engine.js`, layouts, components, styles or `catalog.ts`.
  If a lesson needs a new shape or engine feature, stop and say so in your report.
- Do not add dependencies.
- Every user-facing string is `{ vi, en }`. Vietnamese first, English of the same length.
- Keep `docs/roadmap/cp.md` headings and tables in their exact format — the site parses them (`src/lib/roadmap.ts`).
- Commits: one per lesson, `lesson(cp): {slug} — {English title}`. Other changes: `feat:`, `fix:`, `docs:`.
- Practice problems must be real: open each link and check the title before using it.

## Layout of the code

```
docs/roadmap/   what to build next (source of truth for the CP course tree)
docs/           lesson-guide.md
src/lessons/    one file per lesson
src/lib/        scene-engine.js (2.5D animation engine), catalog, roadmap parser, i18n, client code
src/pages/      [lang]/ · [lang]/[track]/ · [lang]/[track]/[topic]/[lesson].astro
src/styles/     tokens.css (palette, scene classes), shell.css, lesson.css
```
