import type { Lesson, SceneMap } from "../../../lib/types";

const VERTICES = [0, 1, 2, 3, 4, 5];
const SINGLETONS = VERTICES;
const FIRST_PAIR = [0, 0, 2, 3, 4, 5];
const THREE_PAIRS = [0, 0, 2, 2, 4, 4];
const MERGED = [0, 0, 0, 2, 4, 4];
const COMPRESSED = [0, 0, 0, 0, 4, 4];
const POSITIONS = [[0, 0], [0.85, 2.8], [2.45, 0], [3.3, 2.8], [4.85, 0], [5.7, 2.8]];
const U = 54;

function forest(parent: number[], active: number[] = [], good: number[] = [], changed = -1): SceneMap {
  const scene: SceneMap = {};
  for (const v of VERTICES) {
    const p = parent[v];
    const cls = good.includes(v) ? "is-good" : active.includes(v) ? "is-active" : "";
    const [x, y] = v === 0 && parent[2] === 0 ? [1.2, 0]
      : v === 1 && parent[2] === 0 ? [0.05, 2.8]
      : v === 2 && p === 0 ? [2.4, 2.8]
      : v === 3 && p === 2 && parent[2] === 0 ? [2.95, 5.5]
      : v === 3 && p === 0 ? [1.2, 2.8]
      : POSITIONS[v];
    scene[`v${v}`] = { x, y, cls, dur: 520 };
    scene[`p${v}`] = { text: String(p), cls, ...(v === changed ? { fx: "pulse" } : {}) };
    scene[`edge${v}`] = {
      ends: [`v${v}`, `v${p}`], p: v === p ? 0 : 1,
      cls: v === changed || good.includes(v) ? "v-eq" : active.includes(v) ? "" : "v-lt",
      ...(v === changed ? { from: { p: 0 }, dur: 430 } : {}),
    };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "dsu-mst",
  slug: "union-find",
  title: { vi: "Disjoint Set Union", en: "Union-Find" },
  added: "2026-11-27",
  summary: {
    vi: "Gộp các nhóm bằng cách nối gốc và rút ngắn đường lên gốc sau mỗi lần tìm.",
    en: "Merge groups by linking roots and shorten the paths to those roots during lookups.",
  },
  level: "basic",
  minutes: 8,
  time: "O(α(n)) amortized",
  memory: "O(n)",
  goal: {
    vi: "Gộp 6 đỉnh rồi kiểm tra <b>1 và 3</b> có cùng nhóm không",
    en: "Merge 6 vertices, then check whether <b>1 and 3</b> share a group",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">vector</span>&lt;<span class="kw">int</span>&gt; parent(n), sz(n, 1);',
    'iota(parent.begin(), parent.end(), 0);',
    '<span class="kw">auto</span> find = [&amp;](<span class="kw">auto</span>&amp;&amp; self, <span class="kw">int</span> v) -&gt; <span class="kw">int</span> {',
    '  <span class="kw">if</span> (parent[v] == v) <span class="kw">return</span> v;',
    '  <span class="kw">return</span> parent[v] = self(self, parent[v]);',
    '};',
    '<span class="kw">auto</span> unite = [&amp;](<span class="kw">int</span> a, <span class="kw">int</span> b) {',
    '  a = find(find, a); b = find(find, b);',
    '  <span class="kw">if</span> (a == b) <span class="kw">return false</span>;',
    '  <span class="kw">if</span> (sz[a] &lt; sz[b]) swap(a, b);',
    '  parent[b] = a; sz[a] += sz[b];',
    '  <span class="kw">return true</span>;',
    '};',
  ],
  watch: [
    { key: "op", label: { vi: "thao tác", en: "operation" } },
    { key: "roots", label: { vi: "gốc tìm được", en: "roots found" } },
    { key: "groups", label: { vi: "số nhóm", en: "groups" } },
  ],
  practice: [
    { src: "LeetCode 547", name: "Number of Provinces", lv: "★☆☆", url: "https://leetcode.com/problems/number-of-provinces/" },
    { src: "CSES 1676", name: "Road Construction", lv: "★★☆", url: "https://cses.fi/problemset/task/1676" },
  ],
  sceneOptions: { unit: U, view: [-55, -116, 405, 370] },
  legend: [
    { cls: "acc", label: { vi: "đang xét", en: "in focus" } },
    { cls: "ac", label: { vi: "đường mới hoặc cùng nhóm", en: "new path or same group" } },
  ],
  entrance: VERTICES.map(v => `v${v}`),
  steps: [
    {
      title: { vi: "Kết nối sáu đỉnh", en: "Connect six vertices" }, kind: "problem",
      body: {
        vi: "Bắt đầu với 6 đỉnh rời nhau. Khi liên tục thêm kết nối, chạy BFS từ đầu mỗi lần hỏi hai đỉnh có cùng nhóm không có thể tốn O(n + m) cho một truy vấn.",
        en: "Start with 6 isolated vertices. As connections arrive, running BFS from scratch to check whether two vertices share a group can cost O(n + m) per query.",
      },
      watch: { groups: 6 }, lines: [], verdict: "run", fit: "all", scene: forest(SINGLETONS),
    },
    {
      title: { vi: "Mỗi nhóm một gốc", en: "One root per group" }, kind: "concept",
      body: {
        vi: "Ban đầu mỗi đỉnh là gốc của nhóm một phần tử, nên <code>parent[v] = v</code> và <code>sz[v] = 1</code>. Muốn tìm đại diện của một đỉnh, đi theo các liên kết cha cho đến khi gặp một gốc trỏ về chính nó.",
        en: "Each vertex starts as the root of a singleton, so <code>parent[v] = v</code> and <code>sz[v] = 1</code>. To find a vertex's representative, follow parent links until you reach a root that points to itself.",
      },
      watch: { op: "find(4)", roots: 4, groups: 6 }, lines: [1, 2, 3, 4], verdict: "run", fit: "all",
      scene: forest(SINGLETONS, [4]),
    },
    {
      title: { vi: "Nối hai gốc", en: "Link two roots" }, kind: "step",
      body: {
        vi: "<code>unite(0, 1)</code> tìm được hai gốc 0 và 1. Hai nhóm đều có 1 đỉnh nên mã giữ gốc 0, đổi <code>parent[1]</code> thành 0 và tăng <code>sz[0]</code> lên 2.",
        en: "<code>unite(0, 1)</code> finds roots 0 and 1. Both groups have size 1, so the code keeps root 0, sets <code>parent[1]</code> to 0, and raises <code>sz[0]</code> to 2.",
      },
      watch: { op: "unite(0, 1)", roots: "0, 1", groups: 5 }, lines: [7, 8, 10, 11], verdict: "run", fit: "all",
      scene: forest(FIRST_PAIR, [0], [1], 1),
    },
    {
      title: { vi: "Tạo ba cây nhỏ", en: "Build three small trees" }, kind: "step",
      body: {
        vi: "Làm tương tự với <code>unite(2, 3)</code> và <code>unite(4, 5)</code>. Giờ ta có 3 cây, gốc lần lượt là 0, 2 và 4, mỗi cây chứa 2 đỉnh.",
        en: "Repeat with <code>unite(2, 3)</code> and <code>unite(4, 5)</code>. We now have 3 trees rooted at 0, 2, and 4, with 2 vertices each.",
      },
      watch: { op: "unite(2, 3), unite(4, 5)", roots: "0, 2, 4", groups: 3 }, lines: [8, 10, 11], verdict: "run", fit: "all",
      scene: forest(THREE_PAIRS, [], [3, 5]),
    },
    {
      title: { vi: "Gộp qua đại diện", en: "Merge through representatives" }, kind: "step",
      body: {
        vi: "<code>unite(1, 3)</code> tìm ra gốc 0 và 2. Hai nhóm cùng cỡ nên gốc 2 trỏ sang 0, tạo đường <code>3 → 2 → 0</code>. Nếu kích thước khác nhau, ta luôn gắn gốc cây nhỏ vào gốc cây lớn.",
        en: "<code>unite(1, 3)</code> finds roots 0 and 2. Their groups have equal size, so root 2 points to 0, creating the path <code>3 → 2 → 0</code>. For unequal sizes, attach the smaller tree's root to the larger one.",
      },
      watch: { op: "unite(1, 3)", roots: "0, 2", groups: 2 }, lines: [8, 10, 11], verdict: "run", fit: "all",
      scene: forest(MERGED, [0, 3], [2], 2),
    },
    {
      title: { vi: "Nén đường lên gốc", en: "Compress the root path" }, kind: "step",
      body: {
        vi: "<code>find(3)</code> đi qua 2 rồi tới gốc 0. Khi lời gọi trả về, <code>parent[3]</code> đổi từ 2 thành 0, nên lần sau 3 lên thẳng gốc trong một bước.",
        en: "<code>find(3)</code> follows 2 to root 0. As the call returns, <code>parent[3]</code> changes from 2 to 0, so next time 3 reaches the root in one hop.",
      },
      watch: { op: "find(3)", roots: 0, groups: 2 }, lines: [3, 4, 5], verdict: "run", fit: "all",
      scene: forest(COMPRESSED, [0], [3], 3),
    },
    {
      title: { vi: "So sánh hai gốc", en: "Compare the two roots" }, kind: "answer",
      body: {
        vi: "<code>find(1) = find(3) = 0</code>, vậy 1 và 3 cùng nhóm. Nếu gọi lại <code>unite(1, 3)</code>, hàm trả về <code>false</code> và vẫn còn 2 nhóm.",
        en: "<code>find(1) = find(3) = 0</code>, so 1 and 3 share a group. Calling <code>unite(1, 3)</code> again returns <code>false</code>, leaving 2 groups.",
      },
      watch: { op: "find(1) = find(3)", roots: "0, 0", groups: 2 }, lines: [4, 5, 8, 9], verdict: "ac", fit: "all",
      scene: forest(COMPRESSED, [], [0, 1, 3]),
    },
    {
      title: { vi: "Giữ cây thấp", en: "Keep the trees shallow" }, kind: "recap",
      body: {
        vi: "Nén đường đi giữ nguyên gốc của mọi đỉnh, nên nhóm vẫn giữ nguyên. Sau O(n) khởi tạo, gộp theo kích thước kết hợp nén đường đi cho chi phí khấu hao O(α(n)) mỗi thao tác, với α tăng rất chậm.",
        en: "Path compression preserves every vertex's root, so group membership stays the same. After O(n) initialization, union by size with path compression costs amortized O(α(n)) per operation, where α grows very slowly.",
      },
      watch: { roots: "0, 4", groups: 2 }, lines: [5, 10, 11], verdict: "ac", fit: "all",
      scene: forest(COMPRESSED, [], [0, 4]),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const v of VERTICES) {
    const [x, y] = POSITIONS[v];
    scene.add(`v${v}`, { shape: shapes.block({ label: v, w: 38, h: 31 }), x, y });
    scene.add(`p${v}`, { shape: shapes.block({ label: v, sub: v, w: 38, h: 31 }), x: v * 1.09 + 0.15, y: 8.35 });
    scene.link(`edge${v}`, { from: `v${v}`, to: `v${v}`, bend: -0.65 });
  }
  scene.add("parent", { shape: shapes.pill({ text: "parent[v]" }), x: 2.88, y: 6.78 });
}
