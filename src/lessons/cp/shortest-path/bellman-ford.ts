import type { Lesson, SceneMap } from "../../../lib/types";

const vertices = ["A", "B", "C", "D", "E"];
// Scan in this order so a new distance usually propagates one edge per pass.
const edges = [
  { id: "ec", from: "E", to: "C", weight: -5, label: "← −5", bend: 1.65 },
  { id: "de", from: "D", to: "E", weight: 2, label: "2 →", bend: 0.1 },
  { id: "cd", from: "C", to: "D", weight: 2, label: "2 →", bend: 0.1 },
  { id: "bc", from: "B", to: "C", weight: -3, label: "−3 →", bend: 0.1 },
  { id: "ab", from: "A", to: "B", weight: 4, label: "4 →", bend: 0.1 },
];
const distances = [[0, Infinity, Infinity, Infinity, Infinity]];
for (let pass = 1; pass <= vertices.length; pass++) {
  const next = [...distances[pass - 1]];
  for (const { from, to, weight } of edges) {
    const u = vertices.indexOf(from);
    const v = vertices.indexOf(to);
    next[v] = Math.min(next[v], next[u] + weight);
  }
  distances.push(next);
}

const fit = [...vertices, "dist", ...vertices.map((v) => `d${v}`)];
const U = 57;

function picture(pass: number, current: string[] = [], changed: string[] = [], cycle = false): SceneMap {
  const scene: SceneMap = {};
  vertices.forEach((v, i) => {
    const value = distances[pass][i];
    const cls = cycle && i >= 2 ? "is-bad" : changed.includes(v) ? "is-good" : current.includes(v) ? "is-active" : "";
    scene[v] = { cls };
    scene[`d${v}`] = {
      text: value === Infinity ? "∞" : String(value),
      cls: value === Infinity ? "is-out" : cls,
      ...(changed.includes(v) && !cycle ? { fx: { type: "pulse", delay: 350 } } : {}),
    };
  });
  for (const { id } of edges) {
    const highlighted = cycle ? ["cd", "de", "ec"].includes(id) : current.includes(id);
    const cls = highlighted ? cycle ? "v-gt" : "v-eq" : "";
    scene[id] = { p: 1, o: highlighted ? 1 : 0.48, cls };
    scene[`w${id}`] = { cls };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "shortest-path",
  slug: "bellman-ford",
  title: { vi: "Bellman-Ford & chu trình âm", en: "Bellman-Ford and negative cycles" },
  added: "2026-11-27",
  summary: {
    vi: "Quét các cạnh nhiều lượt để tìm đường ngắn nhất từ một đỉnh và phát hiện chu trình âm đi tới được.",
    en: "Scan the edges in repeated passes to find shortest paths from one source and detect reachable negative cycles.",
  },
  level: "medium",
  minutes: 9,
  time: "O(nm)",
  memory: "O(n)",
  goal: { vi: "Tìm khoảng cách từ <b>A</b> và kiểm tra chu trình âm", en: "Find distances from <b>A</b> and check for a negative cycle" },
  codeLang: "C++17",
  code: [
    '<span class="kw">const long long</span> INF = 1LL &lt;&lt; 60;',
    'vector&lt;<span class="kw">long long</span>&gt; d(n, INF);',
    'd[s] = 0;',
    '<span class="kw">bool</span> neg = false;',
    '<span class="kw">for</span> (<span class="kw">int</span> pass = 1; pass &lt;= n; ++pass) {',
    '  <span class="kw">bool</span> changed = false;',
    '  <span class="kw">for</span> (<span class="kw">auto</span> [u, v, w] : edges) {',
    '    <span class="kw">if</span> (d[u] == INF || d[u] + w &gt;= d[v]) <span class="kw">continue</span>;',
    '    d[v] = d[u] + w;',
    '    changed = true;',
    '  }',
    '  <span class="kw">if</span> (!changed) <span class="kw">break</span>;',
    '  <span class="kw">if</span> (pass == n) neg = true;',
    '}',
  ],
  watch: [{ key: "pass", label: "pass" }, { key: "edge", label: "u → v" }, { key: "calc", label: "d[u] + w" }],
  practice: [
    { src: "CSES 1673", name: "High Score", lv: "★★☆", url: "https://cses.fi/problemset/task/1673" },
    { src: "CSES 1197", name: "Cycle Finding", lv: "★★★", url: "https://cses.fi/problemset/task/1197" },
  ],
  sceneOptions: { unit: U, view: [-80, -135, 430, 290] },
  legend: [
    { cls: "ac", label: { vi: "vừa nới lỏng", en: "just relaxed" } },
    { cls: "wa", label: { vi: "chu trình âm", en: "negative cycle" } },
    { cls: "dim", label: { vi: "chưa tới được", en: "not yet reached" } },
  ],
  steps: [
    {
      title: { vi: "Cạnh có trọng số âm", en: "A negative edge" }, kind: "problem",
      body: {
        vi: "Từ A, ta muốn tìm chi phí nhỏ nhất tới từng đỉnh. Thử mọi đường đi có thể tốn rất nhiều thời gian, còn cạnh B → C có trọng số −3 nên ta không thể dùng quy tắc chốt đỉnh của Dijkstra.",
        en: "Find the cheapest cost from A to every vertex. Enumerating walks can take far too long, and the edge B → C costs −3, so Dijkstra's rule for settling vertices does not apply.",
      },
      lines: [], watch: {}, verdict: "run", fit, scene: picture(0),
    },
    {
      title: { vi: "Khởi tạo khoảng cách", en: "Initialize the distances" }, kind: "concept",
      body: {
        vi: "Đặt <code>d[A] = 0</code> và các ô còn lại bằng ∞. Mỗi lượt quét hết cạnh theo thứ tự E → C, D → E, C → D, B → C, A → B. Chỉ nới lỏng cạnh có đầu đi đã tới được.",
        en: "Set <code>d[A] = 0</code> and every other entry to ∞. Each pass scans E → C, D → E, C → D, B → C, A → B in that order. Only relax edges whose tail has been reached.",
      },
      lines: [1, 2, 3, 7, 8], watch: { pass: 0 }, verdict: "run", fit, scene: picture(0, ["A"]),
    },
    {
      title: { vi: "Lượt 1 tới B", en: "Pass 1 reaches B" }, kind: "step",
      body: {
        vi: "Bốn cạnh đầu bị bỏ qua vì chưa tới được đầu đi. Cạnh A → B đứng cuối, nên <code>d[B]</code> giảm từ ∞ xuống <code>0 + 4 = 4</code>.",
        en: "The first four edges are skipped because their tails are still unreachable. A → B comes last, so <code>d[B]</code> drops from ∞ to <code>0 + 4 = 4</code>.",
      },
      lines: [5, 7, 8, 9], watch: { pass: 1, edge: "A → B", calc: 4 }, verdict: "run", fit, scene: picture(1, ["ab"], ["B"]),
    },
    {
      title: { vi: "Lượt 2 tới C", en: "Pass 2 reaches C" }, kind: "step",
      body: {
        vi: "Giờ cạnh B → C cho <code>d[C] = 4 − 3 = 1</code>. Cạnh C → D đã được xét trước đó trong lượt này, nên giá trị 1 chưa truyền sang D.",
        en: "Now B → C gives <code>d[C] = 4 − 3 = 1</code>. C → D was scanned earlier in this pass, so the value 1 has yet to propagate to D.",
      },
      lines: [7, 8, 9], watch: { pass: 2, edge: "B → C", calc: 1 }, verdict: "run", fit, scene: picture(2, ["bc"], ["C"]),
    },
    {
      title: { vi: "Lượt 3 tới D", en: "Pass 3 reaches D" }, kind: "step",
      body: {
        vi: "Dùng khoảng cách 1 tại C, cạnh C → D cho <code>d[D] = 1 + 2 = 3</code>. Cạnh D → E đã qua lượt xét nên E vẫn là ∞.",
        en: "Using the distance 1 at C, the edge C → D gives <code>d[D] = 1 + 2 = 3</code>. D → E has already been scanned this pass, so E stays at ∞.",
      },
      lines: [7, 8, 9], watch: { pass: 3, edge: "C → D", calc: 3 }, verdict: "run", fit, scene: picture(3, ["cd"], ["D"]),
    },
    {
      title: { vi: "Lượt 4 tới E", en: "Pass 4 reaches E" }, kind: "step",
      body: {
        vi: "Cạnh D → E cho <code>d[E] = 3 + 2 = 5</code>. Với 5 đỉnh, 4 lượt đủ để xét mọi đường đi đơn từ A. Ta quét thêm một lượt để kiểm tra xem khoảng cách còn giảm được không.",
        en: "D → E gives <code>d[E] = 3 + 2 = 5</code>. With 5 vertices, 4 passes suffice to cover every simple path from A. Scan once more to see whether any distance can still decrease.",
      },
      lines: [5, 7, 9, 13], watch: { pass: 4, edge: "D → E", calc: 5 }, verdict: "run", fit, scene: picture(4, ["de"], ["E"]),
    },
    {
      title: { vi: "Lượt 5 vẫn giảm", en: "Pass 5 still improves" }, kind: "answer",
      body: {
        vi: "Ngay đầu lượt 5, cạnh E → C hạ <code>d[C]</code> từ 1 xuống <code>5 − 5 = 0</code>. C → D tiếp tục hạ <code>d[D]</code> xuống 2. Vòng C → D → E → C tốn <code>2 + 2 − 5 = −1</code>, nên đi thêm một vòng lại rẻ hơn 1.",
        en: "At the start of pass 5, E → C reduces <code>d[C]</code> from 1 to <code>5 − 5 = 0</code>. C → D then lowers <code>d[D]</code> to 2. The cycle C → D → E → C costs <code>2 + 2 − 5 = −1</code>, so every extra lap saves 1.",
      },
      note: {
        vi: "Các ô C, D, E vẫn hiển thị giá trị sau lượt 5, nhưng chi phí tới ba đỉnh này có thể giảm mãi.",
        en: "The C, D, and E cells show the values after pass 5, but the costs to those vertices can decrease without bound.",
      },
      lines: [8, 9, 10, 13], watch: { pass: 5, edge: "E → C", calc: 0 }, verdict: "ac", fit, scene: picture(5, [], [], true),
    },
    {
      title: { vi: "Vì sao cần lượt n", en: "Why test pass n" }, kind: "recap",
      body: {
        vi: "Nếu không có chu trình âm đi tới được, bỏ các vòng lặp khỏi một đường đi tối ưu vẫn giữ được chi phí tối ưu, nên chỉ cần tối đa n − 1 cạnh. Hễ lượt n còn giảm được thì có chu trình âm đi tới được từ A. Quét tối đa n lượt qua m cạnh tốn O(nm), với O(n) bộ nhớ thêm.",
        en: "Without a reachable negative cycle, removing cycles from an optimal walk preserves its optimal cost, leaving at most n − 1 edges. An improvement on pass n therefore proves a negative cycle is reachable from A. Up to n scans of m edges cost O(nm) time and O(n) extra space.",
      },
      lines: [5, 12, 13], watch: { pass: 5 }, verdict: "ac", fit, scene: picture(5, [], [], true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  vertices.forEach((v, i) => {
    const x = i * 1.22;
    scene.add(v, { shape: shapes.block({ label: v, w: 45, h: 34 }), x });
    scene.add(`d${v}`, { shape: shapes.block({ label: "∞", sub: v, w: 45, h: 34 }), x, y: 3.2 });
  });
  scene.add("dist", { shape: shapes.pill({ text: "d" }), x: -0.87, y: 2.91 });
  for (const { id, from, to, label, bend } of edges) {
    scene.link(id, { from, to, bend });
    scene.add(`w${id}`, { shape: shapes.pill({ text: label, h: 22, pad: 5 }), follow: id });
  }
}
