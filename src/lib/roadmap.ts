/* Reads docs/roadmap/*.md at build time so the course tree has one source of truth.
   Format (see docs/roadmap/cp.md):
     ### 04. Tên tiếng Việt · English name · key `prefix-sum` · Đợt 1
     | # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | status |
     | 1 | `range-sum` | Tổng đoạn trong O(1) | Range sums in O(1) | … | … | ⬜ |
   A lesson shows as ready only when its .ts file exists; the status column is for humans. */
import cpRoadmap from "../../docs/roadmap/cp.md?raw";
import type { L10n } from "./types";

export interface RoadmapLesson { slug: string; title: L10n }
export interface RoadmapChapter { no: number; key: string; title: L10n; level: number; lessons: RoadmapLesson[] }

const HEADING = /^### (\d+)\. (.+?) · (.+?) · key `([a-z0-9-]+)`/;
const ROW = /^\| \d+ \| `([a-z0-9-]+)` \| ([^|]+?) \| ([^|]+?) \|/;
const LEVEL = /^# Cấp (\d+)/;

export function parseRoadmap(md: string): RoadmapChapter[] {
  const chapters: RoadmapChapter[] = [];
  let level = 1;
  for (const line of md.split("\n")) {
    const lv = line.match(LEVEL);
    if (lv) { level = Number(lv[1]); continue; }
    const h = line.match(HEADING);
    if (h) {
      chapters.push({ no: Number(h[1]), key: h[4], title: { vi: h[2].trim(), en: h[3].trim() }, level, lessons: [] });
      continue;
    }
    const r = line.match(ROW);
    if (r && chapters.length) chapters[chapters.length - 1].lessons.push({ slug: r[1], title: { vi: r[2].trim(), en: r[3].trim() } });
  }
  const keys = new Set<string>();
  for (const c of chapters) {
    if (keys.has(c.key)) throw new Error(`roadmap: duplicate chapter key "${c.key}"`);
    keys.add(c.key);
  }
  return chapters;
}

export const CP_ROADMAP = parseRoadmap(cpRoadmap);
