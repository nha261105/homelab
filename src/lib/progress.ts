/* Learning progress, kept in this browser only (no account, no server).
   homelab:progress = { [lessonKey]: { step, max, total, done, at } }
   homelab:log      = newest-first list of { key, type: "start" | "done", at } (max 30) */
import { store } from "./chrome";

export interface LessonProgress { step: number; max: number; total: number; done: boolean; at: string }
export interface LogEntry { key: string; type: "start" | "done"; at: string }

const read = <T>(k: string, fallback: T): T => {
  try { return JSON.parse(store.get(k) || "") as T; } catch { return fallback; }
};

export const getProgress = () => read<Record<string, LessonProgress>>("homelab:progress", {});
export const getLog = () => read<LogEntry[]>("homelab:log", []);
export const getLast = () => store.get("homelab:last");

/** Called on every step change of a lesson page. `step` is 1-based. */
export function recordStep(key: string, step: number, total: number) {
  const all = getProgress();
  const prev = all[key];
  const now = new Date().toISOString();
  const done = (prev?.done ?? false) || step === total;
  all[key] = { step, max: Math.max(prev?.max ?? 0, step), total, done, at: now };
  store.set("homelab:progress", JSON.stringify(all));
  store.set("homelab:last", key);

  const log = getLog();
  const push = (type: LogEntry["type"]) => { log.unshift({ key, type, at: now }); store.set("homelab:log", JSON.stringify(log.slice(0, 30))); };
  if (!prev) push("start");
  if (done && !prev?.done) push("done");
}

export type Status = "none" | "started" | "done";
export const statusOf = (p?: LessonProgress): Status => (!p ? "none" : p.done ? "done" : "started");
