# HomeLab

Personal learning site: Competitive Programming, SWE, AI and Papers. Each lesson walks through one idea
step by step with a moving diagram. Bilingual (Vietnamese / English), light and dark themes.

Stack: Astro 7 + TypeScript, static output. The diagram engine (`src/lib/scene-engine.js`) is hand-written,
no animation library.

## Commands

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + static build into dist/
npm run preview  # serve dist/
```

## URLs

`/{lang}/` home · `/{lang}/{track}/` topics · `/{lang}/{track}/{topic}/{lesson}#step-N` a lesson at step N.
`/` redirects to the language used last time.

## Roadmap

What to build next, chapter by chapter: [`docs/roadmap/cp.md`](docs/roadmap/cp.md) (Competitive Programming, 18 chapters, 53 lessons).

## Add a lesson

1. Create `src/lessons/{track}/{topic}/{slug}.ts` (copy `src/lessons/cp/two-pointers/pair-sum.ts`).
   It exports `lesson` (text, code, steps with scene states) and `setup(scene, shapes)` (builds the nodes once).
2. Add `{ slug, title }` to the topic in `src/lib/catalog.ts`.
3. `npm run build` must pass; then click through every step in both languages and both themes, and at ~400px width.

Design rules (layout, motion, colours, writing style) live in the `homelab-lesson` Claude Code skill.

## Layout

The app shell follows the Algo Lab / Designed to Scale pattern: a top bar with one tab per track,
the track's course tree on the left (chapters → lessons), the lesson in the middle and the step card,
code and practice problems on the right. Pages swap in place with Astro's `ClientRouter`.

```
src/
  lessons/      one file per lesson: src/lessons/{track}/{topic}/{slug}.ts
  lib/          catalog (tracks → chapters → lessons), types, i18n, scene engine,
                shell.ts (theme, search, tree), lesson-client.ts, page.ts (page lifecycle)
  layouts/      Base.astro — app shell
  components/   TopBar, Sidebar (course tree), Icon
  pages/        [lang]/ · [lang]/[track]/ · [lang]/[track]/[topic]/[lesson].astro
  styles/       tokens.css (palette), shell.css (shell + overview pages), lesson.css
```

Fonts (Lexend, JetBrains Mono) are bundled from Fontsource. Progress is stored in the browser only.
