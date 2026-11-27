import type { Lesson, SceneMap } from "../../../lib/types";

const U = 50;
const vertices = [1, 2, 3, 4, 5];
const positions = [[1.15, 0.65], [0, 3.3], [2.3, 3.3], [0, 5.9], [2.3, 5.9]];
const edges = [[1, 2], [1, 3], [2, 3], [2, 4], [3, 5]];
const neighbors = vertices.map((u) => edges.flatMap(([a, b]) => a === u ? [b] : b === u ? [a] : []));
const vertexIds = vertices.map((u) => `v${u}`);
const edgeId = (u: number, v: number) => `e${u}-${v}`;

function picture(
  table: "graph" | "list" | "matrix",
  { edge = "", row = 0, query = false, draw = false } = {},
): SceneMap {
  const scene: SceneMap = {
    list: { o: table === "list" ? 1 : 0 },
    matrix: { o: table === "matrix" ? 1 : 0 },
  };
  for (const [u, v] of edges) {
    const id = edgeId(u, v);
    scene[id] = {
      p: 1, cls: id === edge ? "v-eq" : "",
      ...(draw ? { from: { p: 0 }, delay: 160, dur: 420 } : {}),
    };
  }
  for (const [i, u] of vertices.entries()) {
    scene[`v${u}`] = { cls: u === row ? "is-active" : "" };
    scene[`list${u}`] = { o: table === "list" ? 1 : 0, cls: u === row ? "is-active" : "" };
    scene[`row${u}`] = { o: table === "matrix" ? 1 : 0 };
    scene[`col${u}`] = { o: table === "matrix" ? 1 : 0 };
    for (const [j, v] of neighbors[i].entries()) {
      const isPair = edge === edgeId(Math.min(u, v), Math.max(u, v));
      scene[`a${u}-${j}`] = {
        o: table === "list" ? 1 : 0,
        cls: isPair ? "is-good" : u === row ? "is-active" : "",
      };
    }
    for (const v of vertices) {
      const compared = query && u === 2 && (v === 4 || v === 5);
      const isEdge = edge === edgeId(Math.min(u, v), Math.max(u, v));
      scene[`m${u}-${v}`] = {
        o: table === "matrix" ? 1 : 0,
        cls: compared ? (v === 4 ? "is-good" : "is-bad") : isEdge ? "is-good" : "",
      };
    }
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "graphs",
  slug: "graph-basics",
  title: { vi: "Biểu diễn đồ thị", en: "Representing a graph" },
  added: "2026-11-27",
  summary: {
    vi: "Lưu cùng một đồ thị vô hướng bằng danh sách kề và ma trận kề, rồi thử hai cách tra cứu.",
    en: "Store the same undirected graph as an adjacency list and a matrix, then compare two lookups.",
  },
  level: "basic",
  minutes: 7,
  time: "O(n + m) / O(n² + m)",
  memory: "O(n + m) / O(n²)",
  goal: { vi: "Lưu đồ thị <b>5 đỉnh, 5 cạnh</b> để tra cứu láng giềng", en: "Store a graph with <b>5 vertices and 5 edges</b> to look up neighbors" },
  codeLang: "C++17",
  code: [
    '<span class="kw">vector</span>&lt;<span class="kw">vector</span>&lt;<span class="kw">int</span>&gt;&gt; adj(n + 1);',
    '<span class="kw">vector</span>&lt;<span class="kw">vector</span>&lt;<span class="kw">bool</span>&gt;&gt; mat(n + 1, <span class="kw">vector</span>&lt;<span class="kw">bool</span>&gt;(n + 1));',
    '<span class="kw">for</span> (<span class="kw">auto</span> [u, v] : edges) {',
    '  adj[u].push_back(v);',
    '  adj[v].push_back(u);',
    '  mat[u][v] = mat[v][u] = <span class="kw">true</span>;',
    '}',
    '<span class="kw">for</span> (<span class="kw">int</span> v : adj[2]) cout &lt;&lt; v &lt;&lt; <span class="nm">\' \'</span>;',
    '<span class="kw">bool</span> has4 = mat[2][4], has5 = mat[2][5];',
  ],
  watch: [
    { key: "n", label: "n" },
    { key: "m", label: "m" },
    { key: "edge", label: { vi: "cạnh", en: "edge" } },
    { key: "lookup", label: { vi: "tra cứu", en: "lookup" } },
  ],
  practice: [
    { src: "LeetCode 1791", name: "Find Center of Star Graph", lv: "★☆☆", url: "https://leetcode.com/problems/find-center-of-star-graph/" },
    { src: "CSES 1666", name: "Building Roads", lv: "★★☆", url: "https://cses.fi/problemset/task/1666" },
  ],
  sceneOptions: { unit: U, view: [-55, -85, 440, 280] },
  legend: [
    { cls: "acc", label: { vi: "đỉnh và danh sách đang xét", en: "selected vertex and list" } },
    { cls: "ac", label: { vi: "có cạnh", en: "edge present" } },
    { cls: "wa", label: { vi: "không có cạnh", en: "no edge" } },
  ],
  entrance: vertexIds,
  steps: [
    {
      title: { vi: "Tìm các đỉnh kề", en: "Find adjacent vertices" }, kind: "problem",
      body: {
        vi: "Đồ thị vô hướng có 5 đỉnh và 5 cạnh. Muốn tìm mọi đỉnh kề với 2, ta có thể quét cả 5 cạnh, nhưng nếu hỏi nhiều lần thì mỗi lượt quét lại tốn O(m).",
        en: "This undirected graph has 5 vertices and 5 edges. To find all neighbors of 2, we could scan all 5 edges, at a cost of O(m) each time we ask.",
      },
      lines: [], watch: { n: 5, m: 5 }, verdict: "run", fit: "all", scene: picture("graph", { draw: true }),
    },
    {
      title: { vi: "Lưu cạnh hai chiều", en: "Store both directions" }, kind: "concept",
      body: {
        vi: "Cạnh <code>(2, 4)</code> đi được hai chiều. Khi đọc cạnh này, thêm 4 vào <code>adj[2]</code> và thêm 2 vào <code>adj[4]</code>.",
        en: "The edge <code>(2, 4)</code> can be followed in either direction. When we read it, append 4 to <code>adj[2]</code> and 2 to <code>adj[4]</code>.",
      },
      lines: [1, 3, 4, 5], watch: { edge: "(2, 4)" }, verdict: "run", fit: "all",
      scene: picture("list", { edge: "e2-4" }),
    },
    {
      title: { vi: "Đọc danh sách kề", en: "Read the adjacency list" }, kind: "step",
      body: {
        vi: "Hàng <code>adj[2]</code> chỉ chứa 1, 3, 4. Duyệt đúng 3 phần tử này để liệt kê láng giềng của 2, tức O(deg(2)).",
        en: "The row <code>adj[2]</code> contains just 1, 3, and 4. Visit those three entries to enumerate the neighbors of 2 in O(deg(2)).",
      },
      lines: [8], watch: { lookup: "adj[2] = [1, 3, 4]" }, verdict: "run", fit: "all",
      scene: picture("list", { row: 2 }),
    },
    {
      title: { vi: "Chuyển sang ma trận", en: "Switch to the matrix" }, kind: "step",
      body: {
        vi: "Trong <code>mat</code>, hàng là đỉnh xuất phát, cột là đỉnh đến. Cạnh <code>(2, 4)</code> bật cả hai ô <code>mat[2][4]</code> và <code>mat[4][2]</code>, nên ma trận của đồ thị vô hướng đối xứng.",
        en: "In <code>mat</code>, rows are source vertices and columns are destinations. The edge <code>(2, 4)</code> sets both <code>mat[2][4]</code> and <code>mat[4][2]</code>, so the undirected graph's matrix is symmetric.",
      },
      lines: [2, 3, 6], watch: { edge: "(2, 4)" }, verdict: "run", fit: "all",
      scene: picture("matrix", { edge: "e2-4" }),
    },
    {
      title: { vi: "Tra một ô", en: "Look up one entry" }, kind: "answer",
      body: {
        vi: "<code>mat[2][4] = 1</code> cho biết có cạnh 2–4, còn <code>mat[2][5] = 0</code> cho biết không có cạnh 2–5. Mỗi câu chỉ cần đọc một ô, tốn O(1).",
        en: "<code>mat[2][4] = 1</code> confirms edge 2–4, and <code>mat[2][5] = 0</code> rules out edge 2–5. Each answer takes one lookup in O(1).",
      },
      lines: [9], watch: { lookup: "has4 = 1, has5 = 0" }, verdict: "ac", fit: "all",
      scene: picture("matrix", { row: 2, query: true }),
    },
    {
      title: { vi: "Chọn cách lưu", en: "Choose a representation" }, kind: "recap",
      body: {
        vi: "Danh sách kề lưu 10 mục cho 5 cạnh và dùng O(n + m) bộ nhớ. Ma trận dành 25 ô cho 5 đỉnh, dùng O(n²) bộ nhớ và tốn O(n) khi quét một hàng tìm láng giềng. Chọn theo thao tác cần làm thường xuyên.",
        en: "The list stores 10 entries for 5 edges and uses O(n + m) memory. The matrix reserves 25 entries for 5 vertices, uses O(n²) memory, and takes O(n) to scan a row for neighbors. Choose based on the operations you expect to run often.",
      },
      lines: [1, 2, 8, 9], watch: { n: 5, m: 5 }, verdict: "ac", fit: "all",
      scene: picture("matrix", { row: 2, query: true }),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  vertices.forEach((u, i) => {
    const [x, y] = positions[i];
    scene.add(`v${u}`, { shape: shapes.block({ label: u, w: 42, h: 31 }), x, y, shadow: true });
  });
  for (const [u, v] of edges) {
    scene.link(edgeId(u, v), { from: `v${u}`, to: `v${v}`, anchor: "center", bend: 0 });
  }
  scene.add("list", { shape: shapes.pill({ text: "adj" }), x: 5.1, y: -0.1, o: 0 });
  scene.add("matrix", { shape: shapes.pill({ text: "mat" }), x: 5.7, y: -0.1, o: 0 });
  for (const [i, u] of vertices.entries()) {
    const y = 1.8 + i * 1.21;
    scene.add(`list${u}`, { shape: shapes.pill({ text: `adj[${u}]` }), x: 4.08, y: y - 0.08, o: 0 });
    scene.add(`row${u}`, { shape: shapes.pill({ text: u }), x: 3.65, y: y + 0.7, o: 0 });
    scene.add(`col${u}`, { shape: shapes.pill({ text: u }), x: 4.35 + i * 0.68, y: 1.3, o: 0 });
    neighbors[i].forEach((v, j) => {
      scene.add(`a${u}-${j}`, { shape: shapes.block({ label: v, w: 32, h: 24 }), x: 5.23 + j * 0.74, y, o: 0 });
    });
    vertices.forEach((v, j) => {
      const label = neighbors[i].includes(v) ? 1 : 0;
      scene.add(`m${u}-${v}`, { shape: shapes.block({ label, w: 29, h: 24, depth: 3 }), x: 4.35 + j * 0.68, y: y + 0.72, o: 0 });
    });
  }
}
