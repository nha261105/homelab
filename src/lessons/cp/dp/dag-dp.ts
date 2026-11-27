import type { Lesson, SceneMap } from "../../../lib/types";

const vertices = ["S", "A", "B", "C", "T"] as const;
type Vertex = typeof vertices[number];

const positions: Record<Vertex, [number, number]> = {
  S: [0, 3.4],
  A: [1.75, 0.85],
  B: [2.65, 5.3],
  C: [3.88, -0.25],
  T: [5.8, 3.4],
};
const edges: { from: Vertex; to: Vertex }[] = [
  { from: "S", to: "A" },
  { from: "S", to: "B" },
  { from: "A", to: "C" },
  { from: "A", to: "T" },
  { from: "B", to: "T" },
  { from: "C", to: "T" },
];
const incoming = (v: Vertex) => edges.filter(({ to }) => to === v).map(({ from }) => from);
const best = { S: 0, A: -1, B: -1, C: -1, T: -1 };
const ways = { S: 1, A: 0, B: 0, C: 0, T: 0 };

for (const v of vertices.slice(1)) {
  const parents = incoming(v);
  best[v] = Math.max(...parents.map((u) => best[u] + 1));
  ways[v] = parents.reduce((total, u) => total + ways[u], 0);
}

const longest = ["S", "A", "C", "T"] as const;
const U = 46;

function picture(count: number, focus?: Vertex, formulas: string[] = [], showRoute = false): SceneMap {
  const parents = focus ? incoming(focus) : [];
  const scene: SceneMap = {};
  vertices.forEach((v, i) => {
    const ready = i < count;
    scene[v] = {
      text: ready ? `${best[v]} · ${ways[v]}` : "— · —",
      cls: v === focus || (showRoute && longest.some((u) => u === v)) ? "is-good" : parents.includes(v) ? "is-active" : "",
      ...(v === focus ? { fx: { type: "pulse", delay: 340 } } : {}),
    };
  });
  edges.forEach(({ from, to }, i) => {
    const highlight = to === focus || (showRoute && longest.some((v, k) => v === to && longest[k - 1] === from));
    const cls = highlight ? "v-eq" : "";
    const o = !highlight && (parents.length || showRoute) ? 0.52 : 1;
    scene[`edge${i}`] = {
      p: 1, o, cls,
      ...(to === focus ? { from: { p: 0 }, dur: 380 } : {}),
    };
  });
  for (let i = 0; i < 2; ++i) {
    const text = formulas[i] ?? "";
    scene[`formula${i}`] = {
      text, o: text ? 1 : 0,
      ...(text ? { from: { o: 0, s: 0.85 }, delay: 480, dur: 320, ease: "back" } : {}),
    };
  }
  return scene;
}

function compute(v: Vertex): SceneMap {
  const parents = incoming(v);
  const lengths = parents.map((u) => `${best[u]}+1`);
  const length = lengths.length === 1 ? lengths[0] : `max(${lengths.join(", ")})`;
  const routes = parents.map((u) => ways[u]).join(" + ");
  return picture(vertices.indexOf(v) + 1, v, [
    `best[${v}] = ${length} = ${best[v]}`,
    `ways[${v}] = ${routes}${parents.length > 1 ? ` = ${ways[v]}` : ""}`,
  ]);
}

export const lesson: Lesson = {
  track: "cp",
  topic: "dp",
  slug: "dag-dp",
  title: { vi: "DP trên DAG", en: "DP on a DAG" },
  added: "2026-11-27",
  summary: {
    vi: "Duyệt theo thứ tự tô-pô để tìm đường dài nhất và đếm số đường đi trên đồ thị có hướng không chu trình.",
    en: "Use topological order to find a longest path and count paths in a directed acyclic graph.",
  },
  level: "medium",
  minutes: 9,
  time: "O(V + E)",
  memory: "O(V + E)",
  goal: {
    vi: "Từ <b>S</b> đến <b>T</b>, tìm đường dài nhất và đếm mọi đường đi",
    en: "Find a longest path and count all paths from <b>S</b> to <b>T</b>",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">const int</span> MOD = 1\'000\'000\'007;',
    'vector&lt;int&gt; best(n, -1), ways(n, 0), parent(n, -1);',
    'best[S] = 0;',
    'ways[S] = 1;',
    '<span class="kw">for</span> (<span class="kw">int</span> v : order) {',
    '  <span class="kw">for</span> (<span class="kw">int</span> u : pred[v]) {',
    '    <span class="kw">if</span> (best[u] != -1 &amp;&amp; best[u] + 1 &gt; best[v]) {',
    '      best[v] = best[u] + 1;',
    '      parent[v] = u;',
    '    }',
    '    ways[v] = (ways[v] + ways[u]) % MOD;',
    '  }',
    '}',
  ],
  watch: [
    { key: "v", label: "v" },
    { key: "best", label: "best[v]" },
    { key: "ways", label: "ways[v]" },
  ],
  practice: [
    { src: "CSES 1681", name: "Game Routes", lv: "★★☆", url: "https://cses.fi/problemset/task/1681/" },
    { src: "CSES 1680", name: "Longest Flight Route", lv: "★★☆", url: "https://cses.fi/problemset/task/1680/" },
  ],
  sceneOptions: { unit: U, view: [-75, -125, 405, 450] },
  legend: [
    { cls: "acc", label: { vi: "đỉnh dùng để tính", en: "input vertex" } },
    { cls: "ac", label: { vi: "đỉnh vừa tính hoặc đường dài nhất", en: "computed vertex or longest path" } },
  ],
  steps: [
    {
      title: { vi: "Tìm đường từ S", en: "Find paths from S" }, kind: "problem",
      body: {
        vi: "Mỗi mũi tên là một cạnh có hướng, độ dài 1. Từ <code>S</code> đến <code>T</code>, đường dài nhất có bao nhiêu cạnh và có tất cả bao nhiêu đường? Liệt kê từng đường có thể tốn thời gian theo cấp số nhân.",
        en: "Each arrow is a directed edge of length 1. How many edges are on a longest path from <code>S</code> to <code>T</code>, and how many paths are there in total? Listing every path can take exponential time.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(-1),
    },
    {
      title: { vi: "Xếp theo thứ tự tô-pô", en: "Use topological order" }, kind: "concept",
      body: {
        vi: "<code>order = [S, A, B, C, T]</code> đặt đầu mỗi cạnh trước đích của nó. Vì vậy, khi xét <code>v</code>, ta đã tính xong mọi đỉnh trong <code>pred[v]</code>, tức các đỉnh có cạnh đi thẳng vào <code>v</code>.",
        en: "<code>order = [S, A, B, C, T]</code> puts each edge's start before its end. When we reach <code>v</code>, every vertex in <code>pred[v]</code>, the list of incoming neighbors of <code>v</code>, is already computed.",
      },
      lines: [5, 6], watch: {}, verdict: "run", fit: "all", scene: picture(0, undefined, ["order: S, A, B, C, T"]),
    },
    {
      title: { vi: "Khởi tạo đỉnh S", en: "Initialize the source" }, kind: "concept",
      body: {
        vi: "Cặp số trên mỗi đỉnh là <code>best · ways</code>: độ dài lớn nhất tính theo cạnh và số đường đi từ <code>S</code>. Tại <code>S</code>, có đúng 1 đường rỗng dài 0. Trong mã, <code>best = -1</code> và <code>ways = 0</code> biểu thị đỉnh chưa có đường tới.",
        en: "Each vertex shows <code>best · ways</code>: the greatest length in edges and the number of paths from <code>S</code>. At <code>S</code>, there is one empty path of length 0. The code uses <code>best = -1</code> and <code>ways = 0</code> for a vertex with no path yet.",
      },
      lines: [2, 3, 4], watch: { v: "S", best: best.S, ways: ways.S }, verdict: "run", fit: "all",
      scene: picture(1, "S", ["best[S] = 0", "ways[S] = 1"]),
    },
    {
      title: { vi: "Nối thêm cạnh S→A", en: "Add the edge S→A" }, kind: "step",
      body: {
        vi: "<code>A</code> chỉ nhận cạnh từ <code>S</code>. Nối cạnh đó vào đường dài nhất đến <code>S</code> được <code>0 + 1 = 1</code>. Mỗi đường đến <code>S</code> cho một đường đến <code>A</code>, nên <code>ways[A] = 1</code>.",
        en: "<code>A</code> has just one incoming edge, from <code>S</code>. Appending it to the longest path to <code>S</code> gives <code>0 + 1 = 1</code>. Every path to <code>S</code> gives one path to <code>A</code>, so <code>ways[A] = 1</code>.",
      },
      lines: [6, 7, 8, 9, 11], watch: { v: "A", best: best.A, ways: ways.A }, verdict: "run", fit: "all", scene: compute("A"),
    },
    {
      title: { vi: "Tính nhánh qua B", en: "Compute the branch through B" }, kind: "step",
      body: {
        vi: "Cạnh duy nhất vào <code>B</code> cũng đến từ <code>S</code>. Vì thế <code>best[B] = 0 + 1 = 1</code> và <code>ways[B] = 1</code>.",
        en: "The only incoming edge to <code>B</code> also comes from <code>S</code>. This gives <code>best[B] = 0 + 1 = 1</code> and <code>ways[B] = 1</code>.",
      },
      lines: [6, 7, 8, 9, 11], watch: { v: "B", best: best.B, ways: ways.B }, verdict: "run", fit: "all", scene: compute("B"),
    },
    {
      title: { vi: "Kéo dài đến C", en: "Extend the path to C" }, kind: "step",
      body: {
        vi: "<code>C</code> chỉ nhận cạnh từ <code>A</code>, nơi đã có <code>best[A] = 1</code> và <code>ways[A] = 1</code>. Nối <code>A→C</code> cho đường dài <code>1 + 1 = 2</code> cạnh và vẫn chỉ có 1 đường đến <code>C</code>.",
        en: "<code>C</code> only receives an edge from <code>A</code>, where <code>best[A] = 1</code> and <code>ways[A] = 1</code>. Appending <code>A→C</code> makes a path of <code>1 + 1 = 2</code> edges, with one path to <code>C</code>.",
      },
      lines: [6, 7, 8, 9, 11], watch: { v: "C", best: best.C, ways: ways.C }, verdict: "run", fit: "all", scene: compute("C"),
    },
    {
      title: { vi: "Gộp tại đích T", en: "Combine paths at T" }, kind: "answer",
      body: {
        vi: "Ba cạnh cuối vào <code>T</code> đến từ <code>A</code>, <code>B</code> và <code>C</code>. Ta lấy <code>max(2, 2, 3) = 3</code> cho độ dài và cộng <code>1 + 1 + 1 = 3</code> cho số đường. Mỗi đường đi có đúng một cạnh cuối nên không bị đếm trùng.",
        en: "The three incoming edges to <code>T</code> come from <code>A</code>, <code>B</code>, and <code>C</code>. Take <code>max(2, 2, 3) = 3</code> for length and add <code>1 + 1 + 1 = 3</code> for the count. Each path has exactly one last edge, so it is counted once.",
      },
      lines: [6, 7, 8, 9, 11], watch: { v: "T", best: best.T, ways: ways.T }, verdict: "ac", fit: "all", scene: compute("T"),
    },
    {
      title: { vi: "Lần ngược đường dài nhất", en: "Trace the longest path" }, kind: "recap",
      body: {
        vi: "Lần theo <code>parent</code> từ <code>T</code> về <code>S</code> rồi đảo lại, ta được <code>S→A→C→T</code> gồm 3 cạnh và 4 đỉnh. Mỗi cạnh được xét một lần khi mọi kết quả ở đầu cạnh đã sẵn sàng. Cả sắp xếp tô-pô và DP tốn O(V + E) thời gian và bộ nhớ, tính cả đồ thị.",
        en: "Following <code>parent</code> from <code>T</code> to <code>S</code> and reversing gives <code>S→A→C→T</code>, with 3 edges and 4 vertices. Each edge is processed once its start value is final. Topological sorting and DP take O(V + E) time and space, including the graph.",
      },
      note: {
        vi: "Game Routes lấy số đường theo modulo 10⁹ + 7. Longest Flight Route in số đỉnh và đường đi, nên cộng 1 vào số cạnh nếu tới được đích.",
        en: "Game Routes counts modulo 10⁹ + 7. Longest Flight Route prints the vertex count and the route, so add 1 to the edge count if the destination is reachable.",
      },
      lines: [5, 6, 8, 9, 11], watch: { v: "T", best: best.T, ways: ways.T }, verdict: "ac", fit: "all",
      scene: picture(5, undefined, [longest.join(" → "), `ways[T] = ${ways.T}`], true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  vertices.forEach((v) => {
    const [x, y] = positions[v];
    scene.add(v, { shape: shapes.block({ label: "— · —", sub: v, w: 66, h: 34, depth: 4 }), x, y });
  });
  edges.forEach(({ from, to }, i) => {
    scene.link(`edge${i}`, { from, to, anchor: "center", arrow: true, bend: 0 });
  });
  scene.add("formula0", { shape: shapes.pill(), x: 2.9, y: 7.42, o: 0 });
  scene.add("formula1", { shape: shapes.pill(), x: 2.9, y: 8.68, o: 0 });
}
