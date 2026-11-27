import type { Lesson, SceneMap } from "../../../lib/types";

const POSITIONS = [[0, 0], [-1.25, 3], [1.25, 3], [-2, 6], [-0.6, 6], [1.25, 6]];
const EDGES = [[1, 2], [1, 3], [2, 4], [2, 5], [3, 6]];
const ORDER = [1, 2, 4, 5, 3, 6];
const EXIT = [6, 4, 6, 3, 4, 6];
const EXIT_ORDER = [4, 5, 2, 6, 3, 1];
const FIT = [...POSITIONS.map((_, i) => `v${i + 1}`), ...ORDER.map((_, i) => `a${i}`), "order"];

function flatten(entered: number, exited: number, range: number[] = []): SceneMap {
  const scene: SceneMap = {};
  const closed = EXIT_ORDER.slice(0, exited);
  for (const [i, v] of ORDER.entries()) {
    const seen = i < entered;
    const done = closed.includes(v);
    const cls = range.includes(v) ? "is-active" : range.length ? "is-out"
      : done ? "is-good" : seen ? "is-active" : "is-out";
    scene[`v${v}`] = { cls, text: `${seen ? i : "–"}, ${done ? EXIT[v - 1] : "–"}` };
    scene[`a${i}`] = {
      cls, text: seen ? String(v) : "?",
      ...(!range.length && i === entered - 1 ? { fx: { type: "pulse", delay: 220 } } : {}),
    };
  }
  for (const [parent, child] of EDGES) {
    scene[`e${child}`] = { p: 1, cls: range.includes(parent) && range.includes(child) ? "v-eq" : "" };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "trees",
  slug: "euler-tour",
  title: { vi: "Euler tour: cây thành mảng", en: "Euler tour: a tree as an array" },
  added: "2026-11-27",
  summary: {
    vi: "Ghi thời điểm vào và ra khi DFS để biểu diễn mỗi cây con bằng một đoạn liên tục.",
    en: "Record DFS entry and exit times to represent each subtree as a contiguous range.",
  },
  level: "basic",
  minutes: 8,
  time: "O(n)",
  memory: "O(n)",
  goal: { vi: "Tìm đoạn mảng chứa đúng <b>cây con của 2</b>", en: "Find the array range for <b>the subtree of 2</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> timer = <span class="nm">0</span>;',
    '<span class="kw">void</span> dfs(<span class="kw">int</span> u, <span class="kw">int</span> p) {',
    '  tin[u] = timer;',
    '  order[timer++] = u;',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[u])',
    '    <span class="kw">if</span> (v != p) dfs(v, u);',
    '  tout[u] = timer;',
    '}',
    '',
    'dfs(<span class="nm">1</span>, <span class="nm">0</span>);',
    '<span class="kw">int</span> l = tin[<span class="nm">2</span>], r = tout[<span class="nm">2</span>];',
  ],
  watch: [
    { key: "u", label: "u" },
    { key: "timer", label: "timer" },
    { key: "range", label: "[tin[u], tout[u])" },
  ],
  practice: [
    { src: "CSES 1137", name: "Subtree Queries", lv: "★★☆", url: "https://cses.fi/problemset/task/1137" },
    { src: "CSES 1138", name: "Path Queries", lv: "★★★", url: "https://cses.fi/problemset/task/1138" },
  ],
  sceneOptions: { unit: 62 },
  legend: [
    { cls: "dim", label: { vi: "ngoài vùng đang xét", en: "outside the current selection" } },
    { cls: "acc", label: { vi: "đang thăm hoặc thuộc đoạn", en: "open or inside the range" } },
    { cls: "ac", label: { vi: "đã rời đỉnh", en: "finished vertex" } },
  ],
  entrance: POSITIONS.map((_, i) => `v${i + 1}`),
  steps: [
    {
      title: { vi: "Truy vấn cây con", en: "Query a subtree" }, kind: "problem",
      body: {
        vi: "Với cây 6 đỉnh gốc 1, ta muốn lấy riêng cây con của 2 để xử lý. Nếu DFS lại từ đầu cho mỗi truy vấn, một lượt có thể phải duyệt đến O(n) đỉnh.",
        en: "In this 6-vertex tree rooted at 1, we want to isolate the subtree of 2. Running a fresh DFS for each query could visit O(n) vertices each time.",
      },
      lines: [], watch: {}, verdict: "run", fit: FIT, scene: flatten(0, 0),
    },
    {
      title: { vi: "Ghi khi vào đỉnh", en: "Record a vertex on entry" }, kind: "concept",
      body: {
        vi: "Bắt đầu với <code>timer = 0</code>. Khi vào 1, lưu <code>tin[1] = 0</code> và ghi 1 vào <code>order[0]</code>, rồi tăng <code>timer</code> lên 1. Hai số trên mỗi đỉnh lần lượt là <code>tin</code> và <code>tout</code>.",
        en: "Start with <code>timer = 0</code>. On entering 1, set <code>tin[1] = 0</code>, write 1 to <code>order[0]</code>, then increment <code>timer</code> to 1. Each vertex shows its <code>tin</code> and <code>tout</code>, in that order.",
      },
      lines: [1, 3, 4, 10], watch: { u: 1, timer: 1 }, verdict: "run", fit: FIT,
      scene: flatten(1, 0),
    },
    {
      title: { vi: "Rời lá đầu tiên", en: "Leave the first leaf" }, kind: "step",
      body: {
        vi: "Từ 1, vào 2 ở vị trí 1 rồi vào lá 4 ở vị trí 2. Khi rời 4, <code>timer = 3</code>, nên ghi <code>tout[4] = 3</code>. Rời một đỉnh không làm tăng bộ đếm.",
        en: "From 1, enter 2 at index 1 and then leaf 4 at index 2. When leaving 4, <code>timer = 3</code>, so set <code>tout[4] = 3</code>. Leaving a vertex leaves the timer unchanged.",
      },
      lines: [3, 4, 5, 6, 7], watch: { u: 4, timer: 3, range: "[2, 3)" }, verdict: "run", fit: FIT,
      scene: flatten(3, 1),
    },
    {
      title: { vi: "Đóng đoạn của 2", en: "Close the range for 2" }, kind: "step",
      body: {
        vi: "Ta ghi 5 vào ô 3 rồi rời lá 5 với <code>tout[5] = 4</code>. Nhánh 2 đã xong, nên <code>tout[2] = 4</code> và đoạn của nó bắt đầu ở <code>tin[2] = 1</code>.",
        en: "Write 5 at index 3, then leave leaf 5 with <code>tout[5] = 4</code>. Branch 2 is complete, so <code>tout[2] = 4</code> and its range starts at <code>tin[2] = 1</code>.",
      },
      lines: [4, 6, 7], watch: { u: 2, timer: 4, range: "[1, 4)" }, verdict: "run", fit: FIT,
      scene: flatten(4, 3),
    },
    {
      title: { vi: "Điền nốt mảng", en: "Finish filling the array" }, kind: "step",
      body: {
        vi: "DFS vào 3 ở ô 4 rồi vào 6 ở ô 5. Khi rời 6, 3 và cuối cùng là 1, bộ đếm đều bằng 6. Mảng hoàn chỉnh là <code>[1, 2, 4, 5, 3, 6]</code>.",
        en: "DFS enters 3 at index 4 and then enters 6 at index 5. The timer is 6 when leaving 6, 3, and finally 1. The completed array is <code>[1, 2, 4, 5, 3, 6]</code>.",
      },
      lines: [3, 4, 6, 7], watch: { u: 1, timer: 6, range: "[0, 6)" }, verdict: "run", fit: FIT,
      scene: flatten(6, 6),
    },
    {
      title: { vi: "Đọc đoạn của 2", en: "Read the range for 2" }, kind: "answer",
      body: {
        vi: "Lấy đoạn nửa mở <code>[tin[2], tout[2]) = [1, 4)</code>. Các ô 1, 2, 3 chứa đúng ba đỉnh 2, 4, 5. Ô 4 chứa đỉnh 3 ở nhánh khác.",
        en: "Take the half-open range <code>[tin[2], tout[2]) = [1, 4)</code>. Indices 1, 2, and 3 contain exactly vertices 2, 4, and 5. Index 4 holds vertex 3 in the other branch.",
      },
      lines: [11], watch: { u: 2, timer: 6, range: "[1, 4)" }, verdict: "ac", fit: FIT,
      scene: flatten(6, 6, [2, 4, 5]),
    },
    {
      title: { vi: "Vì sao đoạn liên tục", en: "Why the range is contiguous" }, kind: "recap",
      body: {
        vi: "Từ lúc vào 2 đến lúc rời 2, DFS đi hết các nhánh con của 2 rồi mới sang nhánh 3. Vì thế mọi cây con chiếm đúng đoạn <code>[tin[u], tout[u])</code>. Tạo mảng tốn O(n) thời gian và bộ nhớ, rồi lấy hai biên trong O(1).",
        en: "From entry to exit at 2, DFS finishes every child of 2 before moving on to branch 3. Every subtree therefore occupies exactly <code>[tin[u], tout[u])</code>. Building the array takes O(n) time and space, and reading the bounds takes O(1).",
      },
      note: {
        vi: "Có thể đặt giá trị của u ở ô tin[u] để dùng cấu trúc truy vấn đoạn.",
        en: "Store the value of u at tin[u] to use a range query structure.",
      },
      lines: [3, 4, 7, 11], watch: { u: 2, timer: 6, range: "[1, 4)" }, verdict: "ac", fit: FIT,
      scene: flatten(6, 6, [2, 4, 5]),
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  POSITIONS.forEach(([x, y], i) => {
    const v = i + 1;
    scene.add(`v${v}`, { shape: shapes.block({ label: "–, –", sub: `v = ${v}`, w: 63, h: 37 }), x, y });
    scene.add(`a${i}`, { shape: shapes.block({ label: "?", sub: i, w: 44, h: 33 }), x: (i - 2.5) * 0.89, y: 10.6 });
  });
  for (const [parent, child] of EDGES) {
    scene.link(`e${child}`, { from: `v${parent}`, to: `v${child}`, bend: -0.85 });
  }
  scene.add("order", { shape: shapes.pill({ text: "order[i]", h: 23 }), x: 0, y: 9.1 });
}
