import type { Lesson, SceneMap } from "../../../lib/types";

const POSITIONS = [[0, 0], [-1.25, 3], [1.25, 3], [-2, 6], [-0.6, 6], [1.25, 6]];
const EDGES = [[1, 2], [1, 3], [2, 4], [2, 5], [3, 6]];
const FIT = [...POSITIONS.flatMap((_, i) => [`v${i + 1}`, `d${i + 1}`]), "dist"];
const FIRST = [1, 0, 2, 1, 1, 3];
const SECOND = [2, 3, 1, 4, 4, 0];
const PATH = [6, 3, 1, 2, 4];

function snapshot(distances: number[], visited: number[] = [], focus: number[] = [], path: number[] = [], fresh = 0): SceneMap {
  const scene: SceneMap = {};
  for (const [i] of POSITIONS.entries()) {
    const v = i + 1;
    const known = visited.includes(v);
    const cls = focus.includes(v) ? "is-active" : path.includes(v) || known ? "is-good" : "is-out";
    scene[`v${v}`] = { cls };
    scene[`d${v}`] = {
      cls, text: known ? String(distances[i]) : "?",
      ...(fresh === v ? { fx: { type: "pulse", delay: 220 } } : {}),
    };
  }
  for (const [parent, child] of EDGES) {
    const at = path.indexOf(parent);
    const onPath = at >= 0 && (path[at - 1] === child || path[at + 1] === child);
    scene[`e${child}`] = { p: 1, cls: onPath ? "v-eq" : "" };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "trees",
  slug: "diameter",
  title: { vi: "Đường kính cây", en: "Tree diameter" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng hai lượt DFS để tìm đường đi dài nhất trên cây không trọng số.",
    en: "Use two DFS passes to find the longest path in an unweighted tree.",
  },
  level: "basic",
  minutes: 8,
  time: "O(n)",
  memory: "O(n)",
  goal: { vi: "Tìm đường đi có <b>nhiều cạnh nhất</b>", en: "Find the path with the <b>most edges</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> far, best;',
    '<span class="kw">void</span> dfs(<span class="kw">int</span> u, <span class="kw">int</span> p, <span class="kw">int</span> d) {',
    '  dist[u] = d;',
    '  <span class="kw">if</span> (d &gt; best) { best = d; far = u; }',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[u])',
    '    <span class="kw">if</span> (v != p) dfs(v, u, d + <span class="nm">1</span>);',
    '}',
    '',
    'best = -<span class="nm">1</span>;',
    'dfs(n &gt; 1 ? 2 : 1, 0, 0);',
    '<span class="kw">int</span> a = far;',
    'best = -<span class="nm">1</span>;',
    'dfs(a, <span class="nm">0</span>, <span class="nm">0</span>);',
    '<span class="kw">int</span> diameter = best;',
  ],
  watch: [
    { key: "start", label: { vi: "đỉnh xuất phát", en: "start vertex" } },
    { key: "far", label: "far" },
    { key: "best", label: "best" },
  ],
  practice: [
    { src: "CSES 1131", name: "Tree Diameter", lv: "★☆☆", url: "https://cses.fi/problemset/task/1131" },
    { src: "LeetCode 543", name: "Diameter of Binary Tree", lv: "★☆☆", url: "https://leetcode.com/problems/diameter-of-binary-tree/" },
  ],
  sceneOptions: { unit: 62 },
  legend: [
    { cls: "dim", label: { vi: "chưa thăm", en: "unvisited" } },
    { cls: "acc", label: { vi: "đỉnh xuất phát hoặc xa nhất", en: "start or farthest vertex" } },
    { cls: "ac", label: { vi: "đã biết khoảng cách", en: "distance known" } },
  ],
  entrance: POSITIONS.map((_, i) => `v${i + 1}`),
  steps: [
    {
      title: { vi: "Đường đi dài nhất", en: "The longest path" }, kind: "problem",
      body: {
        vi: "Đường kính là khoảng cách lớn nhất giữa hai đỉnh, tính theo số cạnh. Cây này có 6 đỉnh. Chạy DFS từ từng đỉnh để thử mọi khoảng cách sẽ tốn O(n²).",
        en: "The diameter is the largest distance between two vertices, measured in edges. This tree has 6 vertices. Running DFS from each vertex to check every distance would cost O(n²).",
      },
      lines: [], watch: {}, verdict: "run", fit: FIT, scene: snapshot(FIRST),
    },
    {
      title: { vi: "Xuất phát từ 2", en: "Start at vertex 2" }, kind: "concept",
      body: {
        vi: "Chọn một đỉnh bất kỳ, chẳng hạn 2, rồi đặt khoảng cách đến chính nó là 0. Cây chỉ có một đường đi giữa hai đỉnh, nên DFS chỉ việc cộng 1 mỗi khi đi qua một cạnh.",
        en: "Pick any start, say 2, and set its distance to itself to 0. A tree has a unique path between any two vertices, so DFS can add 1 whenever it crosses an edge.",
      },
      lines: [2, 3, 6, 9, 10], watch: { start: 2, far: 2, best: 0 }, verdict: "run", fit: FIT,
      scene: snapshot(FIRST, [2], [2], [], 2),
    },
    {
      title: { vi: "Qua hai cạnh", en: "Cross two edges" }, kind: "step",
      body: {
        vi: "DFS đi theo nhánh <code>2 → 1 → 3</code>, ghi khoảng cách 1 ở đỉnh 1 rồi 2 ở đỉnh 3. Mỗi khi gặp khoảng cách lớn hơn, cập nhật <code>far</code> và <code>best</code>.",
        en: "DFS follows <code>2 → 1 → 3</code>, recording 1 at vertex 1 and 2 at vertex 3. Each larger distance updates <code>far</code> and <code>best</code>.",
      },
      lines: [2, 3, 4, 5, 6], watch: { start: 2, far: 3, best: 2 }, verdict: "run", fit: FIT,
      scene: snapshot(FIRST, [2, 1, 3], [3], [], 3),
    },
    {
      title: { vi: "Tìm đầu mút 6", en: "Find endpoint 6" }, kind: "step",
      body: {
        vi: "Từ 3, DFS đi thêm một cạnh tới 6 và ghi khoảng cách 3. Sau khi quay về thăm nốt 4 và 5, cả hai đều cách 2 đúng 1 cạnh, nên 6 vẫn xa nhất.",
        en: "From 3, DFS crosses one more edge to 6 and records distance 3. Backtracking to visit 4 and 5 finds each just one edge from 2, so 6 stays farthest.",
      },
      note: {
        vi: "Trong cây không trọng số, một đỉnh xa nhất tính từ đỉnh bất kỳ là đầu mút của ít nhất một đường kính.",
        en: "In an unweighted tree, a farthest vertex from any starting point is an endpoint of at least one diameter.",
      },
      lines: [4, 6, 11], watch: { start: 2, far: 6, best: 3 }, verdict: "run", fit: FIT,
      scene: snapshot(FIRST, [2, 1, 3, 6, 4, 5], [6], [], 6),
    },
    {
      title: { vi: "Đổi điểm xuất phát", en: "Change the start" }, kind: "step",
      body: {
        vi: "Giữ lại <code>a = 6</code>, đặt lại <code>best = −1</code> rồi chạy DFS từ 6 với khoảng cách ban đầu bằng 0. Lượt này, mọi khoảng cách đều tính từ 6.",
        en: "Save <code>a = 6</code>, reset <code>best = −1</code>, then run DFS from 6 at distance 0. This pass measures every distance from 6.",
      },
      lines: [11, 12, 13], watch: { start: 6, far: 6, best: 0 }, verdict: "run", fit: FIT,
      scene: snapshot(SECOND, [6], [6], [], 6),
    },
    {
      title: { vi: "Đường kính dài 4", en: "The diameter is 4" }, kind: "answer",
      body: {
        vi: "Lượt hai tìm được đường <code>6 → 3 → 1 → 2 → 4</code> dài 4 cạnh. Đỉnh 5 cũng cách 6 đúng 4 cạnh. Điều kiện <code>d &gt; best</code> giữ lại đỉnh 4 vì DFS gặp nó trước.",
        en: "The second pass finds the path <code>6 → 3 → 1 → 2 → 4</code> of length 4. Vertex 5 is also 4 edges from 6. The condition <code>d &gt; best</code> keeps vertex 4 because DFS sees it first.",
      },
      lines: [4, 13, 14], watch: { start: 6, far: 4, best: 4 }, verdict: "ac", fit: FIT,
      scene: snapshot(SECOND, [6, 3, 1, 2, 4, 5], [6, 4], PATH, 4),
    },
    {
      title: { vi: "Hai lượt là đủ", en: "Two passes suffice" }, kind: "recap",
      body: {
        vi: "Lượt đầu tìm được đầu mút 6 của một đường kính. Vì vậy, khoảng cách xa nhất tính từ 6 vừa đạt đúng độ dài đường kính, vừa không thể vượt quá nó. Hai lượt DFS tốn O(n) thời gian và O(n) bộ nhớ.",
        en: "The first pass finds 6, an endpoint of a diameter. The greatest distance from 6 therefore reaches the diameter length, which is the maximum over all pairs. Two DFS passes use O(n) time and O(n) space.",
      },
      lines: [10, 13, 14], watch: { start: 6, far: 4, best: 4 }, verdict: "ac", fit: FIT,
      scene: snapshot(SECOND, [6, 3, 1, 2, 4, 5], [6, 4], PATH),
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  POSITIONS.forEach(([x, y], i) => {
    const v = i + 1;
    scene.add(`v${v}`, { shape: shapes.block({ label: v, w: 46, h: 35 }), x, y });
    scene.add(`d${v}`, { shape: shapes.block({ label: "?", sub: v, w: 44, h: 33 }), x: (i - 2.5) * 0.89, y: 9.8 });
  });
  for (const [parent, child] of EDGES) {
    scene.link(`e${child}`, { from: `v${parent}`, to: `v${child}`, anchor: "center", bend: 0 });
  }
  scene.add("dist", { shape: shapes.pill({ text: "dist[v]", h: 23 }), x: 0, y: 8.35 });
}
