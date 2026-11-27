import type { Lesson, SceneMap } from "../../../lib/types";

const MOVIES = {
  A: [1, 9],
  B: [3, 5],
  C: [4, 7],
  D: [5, 8],
  E: [8, 10],
} as const;
type Movie = keyof typeof MOVIES;

const INPUT: Movie[] = ["A", "B", "C", "D", "E"];
const BY_END = [...INPUT].sort((a, b) => MOVIES[a][1] - MOVIES[b][1]);
const TICKS = Array.from({ length: 10 }, (_, i) => i + 1);
const U = 33;
const ROW = 2.25;
const FIT = [...INPUT, ...TICKS.map((t) => `t${t}`)];
const CHOSEN: Movie[] = ["B", "D", "E"];
const SKIPPED: Movie[] = ["C", "A"];

function schedule(order: Movie[], chosen: Movie[] = [], skipped: Movie[] = [], fresh?: Movie): SceneMap {
  return Object.fromEntries(order.map((id, index) => {
    const cls = chosen.includes(id) ? "is-good" : skipped.includes(id) ? "is-out" : "";
    return [id, {
      y: (index + 1) * ROW,
      cls,
      o: skipped.includes(id) ? 0.65 : 1,
      delay: order === BY_END && chosen.length === 0 ? index * 70 : 0,
      dur: 560,
      ...(fresh === id ? { fx: { type: "pulse", delay: 200 } } : {}),
    }];
  }));
}

export const lesson: Lesson = {
  track: "cp",
  topic: "sorting",
  slug: "custom-order",
  title: { vi: "Sắp theo tiêu chí riêng", en: "Sorting by your own rule" },
  added: "2026-11-27",
  summary: {
    vi: "Sắp phim theo giờ kết thúc, rồi chọn tham lam để xem trọn nhiều phim nhất.",
    en: "Sort movies by end time, then greedily choose as many full movies as possible.",
  },
  level: "basic",
  minutes: 8,
  time: "O(n log n)",
  memory: "O(log n)",
  goal: {
    vi: "Trong 5 suất phim, chọn <b>nhiều phim nhất</b> mà vẫn xem trọn từng phim",
    en: "Choose <b>as many full movies as possible</b> from five showtimes",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">struct</span> Movie { int start, end; };',
    'sort(movies.begin(), movies.end(),',
    '     [](<span class="kw">const</span> Movie&amp; a, <span class="kw">const</span> Movie&amp; b) {',
    '       <span class="kw">return</span> a.end &lt; b.end;',
    '     });',
    '<span class="kw">int</span> lastEnd = 0, count = 0;',
    '<span class="kw">for</span> (<span class="kw">const</span> Movie&amp; m : movies) {',
    '  <span class="kw">if</span> (m.start &gt;= lastEnd) {',
    '    lastEnd = m.end;',
    '    ++count;',
    '  }',
    '}',
    'cout &lt;&lt; count &lt;&lt; <span class="nm">\'\\n\'</span>;',
  ],
  watch: [
    { key: "movie", label: { vi: "suất phim", en: "showtime" } },
    { key: "last", label: "lastEnd" },
    { key: "count", label: "count" },
  ],
  practice: [
    { src: "CSES 1629", name: "Movie Festival", lv: "★☆☆", url: "https://cses.fi/problemset/task/1629" },
    { src: "LeetCode 179", name: "Largest Number", lv: "★★☆", url: "https://leetcode.com/problems/largest-number/" },
  ],
  sceneOptions: { unit: U, view: [-56, -105, 409, 330] },
  legend: [
    { cls: "ac", label: { vi: "đã chọn", en: "chosen" } },
    { cls: "dim", label: { vi: "bị trùng giờ", en: "overlaps" } },
  ],
  steps: [
    {
      title: { vi: "Chọn lịch xem phim", en: "Plan a movie schedule" }, kind: "problem",
      body: {
        vi: "Mỗi thanh là một suất phim, chẳng hạn A chiếu từ giờ 1 đến giờ 9. Hãy chọn nhiều phim nhất mà vẫn xem trọn từng phim. Thử mọi nhóm phim có thể tốn O(2ⁿ) cách, còn chọn phim bắt đầu sớm nhất sẽ bỏ lỡ cả B và D.",
        en: "Each bar is a showtime, such as A from hour 1 to hour 9. Choose as many full movies as possible. There are O(2ⁿ) subsets to try, and choosing the earliest start would block both B and D.",
      },
      lines: [1], watch: {}, verdict: "run", fit: FIT, scene: schedule(INPUT),
    },
    {
      title: { vi: "Sắp theo giờ kết thúc", en: "Sort by end time" }, kind: "concept",
      body: {
        vi: "Comparator <code>a.end &lt; b.end</code> xếp B, C, D, A, E theo giờ kết thúc 5, 7, 8, 9, 10. Hai phim kết thúc cùng giờ có thể đứng theo thứ tự bất kỳ, nên dùng <code>&lt;</code> để cả hai phép so sánh đều trả về false.",
        en: "The comparator <code>a.end &lt; b.end</code> puts B, C, D, A, E in order of end times 5, 7, 8, 9, 10. Equal end times can come in either order, so <code>&lt;</code> returns false in both directions.",
      },
      lines: [2, 3, 4, 5, 6], watch: { last: 0, count: 0 }, verdict: "run", fit: FIT, scene: schedule(BY_END),
    },
    {
      title: { vi: "Chọn phim B", en: "Choose movie B" }, kind: "step",
      body: {
        vi: "B chiếu từ giờ 3 đến giờ 5 và kết thúc sớm nhất. Lịch đang trống nên nhận B, đặt <code>lastEnd = 5</code> và tăng <code>count</code> lên 1.",
        en: "B runs from hour 3 to hour 5 and finishes earliest. The schedule is empty, so take B, set <code>lastEnd = 5</code>, and increase <code>count</code> to 1.",
      },
      lines: [7, 8, 9, 10], watch: { movie: "B (3–5)", last: 5, count: 1 },
      verdict: "run", fit: FIT, scene: schedule(BY_END, ["B"], [], "B"),
    },
    {
      title: { vi: "Bỏ qua phim C", en: "Skip movie C" }, kind: "step",
      body: {
        vi: "C bắt đầu lúc 4, khi B vẫn đang chiếu vì <code>lastEnd = 5</code>. Bỏ qua C và giữ nguyên lịch.",
        en: "C starts at 4 while B is still playing, since <code>lastEnd = 5</code>. Skip C and keep the schedule as it is.",
      },
      lines: [7, 8], watch: { movie: "C (4–7)", last: 5, count: 1 },
      verdict: "run", fit: FIT, scene: schedule(BY_END, ["B"], ["C"], "C"),
    },
    {
      title: { vi: "Nối tiếp bằng D", en: "Follow with movie D" }, kind: "step",
      body: {
        vi: "D bắt đầu đúng giờ 5, vừa lúc B kết thúc. Điều kiện <code>m.start &gt;= lastEnd</code> cho phép hai suất nối tiếp nhau, nên chọn D và cập nhật <code>lastEnd = 8</code>.",
        en: "D starts at hour 5, just as B ends. The test <code>m.start &gt;= lastEnd</code> allows back-to-back showtimes, so choose D and update <code>lastEnd = 8</code>.",
      },
      lines: [8, 9, 10], watch: { movie: "D (5–8)", last: 8, count: 2 },
      verdict: "run", fit: FIT, scene: schedule(BY_END, ["B", "D"], ["C"], "D"),
    },
    {
      title: { vi: "Bỏ qua phim A", en: "Skip movie A" }, kind: "step",
      body: {
        vi: "Đến lượt A vì phim kết thúc lúc 9. A đã bắt đầu từ giờ 1, trước mốc <code>lastEnd = 8</code>, nên lịch vẫn chỉ có B và D.",
        en: "A comes next because it ends at 9. It started at hour 1, before <code>lastEnd = 8</code>, so the schedule still contains B and D.",
      },
      lines: [7, 8], watch: { movie: "A (1–9)", last: 8, count: 2 },
      verdict: "run", fit: FIT, scene: schedule(BY_END, ["B", "D"], SKIPPED, "A"),
    },
    {
      title: { vi: "Chốt lịch ba phim", en: "Finish with three movies" }, kind: "answer",
      body: {
        vi: "E bắt đầu lúc 8, đúng lúc D kết thúc. Chọn E thì <code>lastEnd = 10</code> và <code>count = 3</code>. Lịch xem là B (3–5), D (5–8), E (8–10).",
        en: "E starts at 8, right when D ends. Choosing E makes <code>lastEnd = 10</code> and <code>count = 3</code>. The schedule is B (3–5), D (5–8), E (8–10).",
      },
      lines: [8, 9, 10, 13], watch: { movie: "E (8–10)", last: 10, count: 3 },
      verdict: "ac", fit: FIT, scene: schedule(BY_END, CHOSEN, SKIPPED, "E"),
    },
    {
      title: { vi: "Kết thúc sớm có lợi", en: "Why earliest finish works" }, kind: "recap",
      body: {
        vi: "Thay phim đầu của một lịch tối ưu bằng B vẫn giữ được các phim sau, vì B kết thúc lúc 5, bằng hoặc sớm hơn phim bị thay. Lặp lại lập luận ở các lượt sau với D rồi E. Sắp xếp tốn O(n log n), sau đó duyệt một lượt O(n).",
        en: "Replace the first movie in an optimal schedule with B and every later movie still fits, because B ends at 5, no later than the one it replaces. Repeat the argument for the next choices, D and E. Sorting takes O(n log n), followed by one O(n) pass.",
      },
      lines: [2, 4, 7, 8], watch: { last: 10, count: 3 },
      verdict: "ac", fit: FIT, scene: schedule(BY_END, CHOSEN, SKIPPED),
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  TICKS.forEach((t) => scene.add(`t${t}`, { shape: shapes.pill({ text: String(t), h: 22, pad: 6 }), x: t - 1 }));
  INPUT.forEach((id, i) => {
    const [start, end] = MOVIES[id];
    scene.add(id, {
      shape: shapes.block({ label: id, w: (end - start) * U, h: 29, depth: 4, r: 6 }),
      x: (start + end) / 2 - 1, y: (i + 1) * ROW,
    });
  });
}
