/** Shared types for HomeLab content. Every user-facing string is bilingual. */
export const LANGS = ["vi", "en"] as const;
export type Lang = (typeof LANGS)[number];
export type L10n = Record<Lang, string>;
/** Plain string (same in both languages: code, numbers, names) or a {vi, en} pair. */
export type Text = string | L10n;

export type TrackKey = "cp" | "swe" | "ai" | "paper";
export type Verdict = "run" | "ac";
/** Shown as the tag on the step card. */
export type StepKind = "problem" | "concept" | "step" | "answer" | "recap";

/** One entry of a step scene — see the skill's references/motion.md. */
export type SceneEntry = Record<string, unknown>;
export type SceneMap = Record<string, SceneEntry>;

export interface Step {
  title: L10n;
  kind: StepKind;
  /** Optional "key idea" callout under the body. */
  note?: L10n;
  /** 1–3 sentences, may contain <code>/<b>. */
  body: L10n;
  /** 1-based code lines to highlight. */
  lines: number[];
  /** Values for the "watched variables" table, keyed by Lesson.watch[].key. */
  watch: Record<string, string | number>;
  verdict: Verdict;
  /** Node ids the camera frames for this step. */
  fit: string[] | "all";
  /** FULL picture of this step; nodes not named go back to their base state. */
  scene: SceneMap;
}

export interface Lesson {
  track: TrackKey;
  topic: string;
  slug: string;
  title: L10n;
  /** Date the lesson was published (YYYY-MM-DD), shown under "Recently added". */
  added: string;
  /** One line under the title. */
  summary: L10n;
  level: "basic" | "medium" | "hard";
  minutes: number;
  time: string;
  memory: string;
  goal: L10n;
  codeLang: string;
  /** One HTML string per line; use <span class="kw|nm|cm"> for syntax colours. */
  code: string[];
  watch: { key: string; label: Text }[];
  practice: { src: string; name: string; lv: string; url: string }[];
  steps: Step[];
  /** Scene options passed to createScene. */
  sceneOptions?: { unit?: number; mode?: "flat" | "iso"; view?: [number, number, number, number] };
  /** Colour legend under the scene: class name → label. */
  legend?: { cls: "acc" | "ac" | "wa" | "tle" | "dim"; label: L10n }[];
  /** Ids dropped onto the floor one after another on first paint. */
  entrance?: string[];
}

/** What a lesson file exports. `setup` builds every node once in its base state. */
export interface LessonModule {
  lesson: Lesson;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(scene: any, shapes: any): void;
}

export const tr = (v: Text, lang: Lang): string => (typeof v === "string" ? v : v[lang]);
