import type { Lesson, SceneMap } from "../../../lib/types";

const VERTICES = [
  ["A", 0, 0], ["B", 2.3, 0], ["C", 1.15, 4.1], ["D", 3.45, 4.1], ["E", 4.6, 0],
] as const;
const EDGES = [
  ["A", "B", 4, 0.12], ["A", "C", 1, -1.25], ["B", "C", 2, -1.25],
  ["B", "D", 5, -1.25], ["C", "D", 6, -0.35], ["D", "E", 3, -1.25], ["B", "E", 8, 0.12],
] as const;
const SORTED = [...EDGES].sort((a, b) => a[2] - b[2]);
const MST = ["AC", "BC", "DE", "BD"];
const U = 58;

function graph(
  accepted: string[] = [], rejected: string[] = [], current = "", sorted = true, finished = false,
): SceneMap {
  const scene: SceneMap = {};
  for (const [vertex] of VERTICES) {
    scene[vertex] = { cls: finished ? "is-good" : current.includes(vertex) ? "is-active" : "" };
  }
  for (const [u, v] of EDGES) {
    const id = u + v;
    const keep = accepted.includes(id);
    const skip = rejected.includes(id);
    const focus = current === id;
    const cls = keep ? "v-eq" : skip ? "v-gt" : "";
    scene[`edge${id}`] = { p: 1, cls, o: keep || focus ? 1 : finished ? 0.18 : 0.42 };
    scene[`weight${id}`] = { cls, o: finished && !keep ? 0 : 1 };
    scene[`slot${id}`] = {
      x: (sorted ? SORTED : EDGES).findIndex(edge => edge[0] + edge[1] === id) * 0.77,
      cls: keep ? "is-good" : skip ? "is-bad" : focus ? "is-active" : finished ? "is-out" : "",
      ...(focus ? { fx: "pulse" } : {}),
    };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "dsu-mst",
  slug: "kruskal",
  title: { vi: "Kruskal", en: "Kruskal's MST" },
  added: "2026-11-27",
  summary: {
    vi: "Duyệt cạnh từ rẻ đến đắt và dùng DSU để bỏ qua cạnh tạo chu trình.",
    en: "Process edges from cheapest to most expensive and use DSU to skip any edge that forms a cycle.",
  },
  level: "medium",
  minutes: 8,
  time: "O(m log m + n)",
  memory: "O(n + m)",
  goal: {
    vi: "Nối <b>5 đỉnh</b> bằng các cạnh có tổng trọng số nhỏ nhất",
    en: "Connect <b>5 vertices</b> with the smallest possible total edge weight",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">using</span> Edge = tuple&lt;<span class="kw">int</span>, <span class="kw">int</span>, <span class="kw">int</span>&gt;;',
    'sort(edges.begin(), edges.end());',
    '',
    '<span class="kw">long long</span> cost = 0;',
    '<span class="kw">int</span> used = 0;',
    '<span class="kw">for</span> (<span class="kw">auto</span> [w, u, v] : edges) {',
    '  <span class="kw">if</span> (!unite(u, v)) <span class="kw">continue</span>;',
    '  cost += w;',
    '  <span class="kw">if</span> (++used == n - 1) <span class="kw">break</span>;',
    '}',
    '<span class="kw">if</span> (used == n - 1) cout &lt;&lt; cost;',
    '<span class="kw">else</span> cout &lt;&lt; "IMPOSSIBLE";',
  ],
  watch: [
    { key: "edge", label: { vi: "cạnh", en: "edge" } },
    { key: "parts", label: { vi: "số nhóm", en: "components" } },
    { key: "cost", label: "cost" },
  ],
  practice: [
    { src: "CSES 1675", name: "Road Reparation", lv: "★★☆", url: "https://cses.fi/problemset/task/1675" },
    { src: "LeetCode 1584", name: "Min Cost to Connect All Points", lv: "★★☆", url: "https://leetcode.com/problems/min-cost-to-connect-all-points/" },
  ],
  sceneOptions: { unit: U, view: [-53, -130, 375, 365] },
  legend: [
    { cls: "acc", label: { vi: "đang xét", en: "in focus" } },
    { cls: "ac", label: { vi: "đã chọn", en: "accepted" } },
    { cls: "wa", label: { vi: "tạo chu trình", en: "forms a cycle" } },
  ],
  entrance: VERTICES.map(([id]) => id),
  steps: [
    {
      title: { vi: "Nối cả đồ thị", en: "Connect the whole graph" }, kind: "problem",
      body: {
        vi: "Với đồ thị vô hướng liên thông có 5 đỉnh và 7 cạnh, ta cần chọn 4 cạnh nối được mọi đỉnh với tổng trọng số nhỏ nhất. Thử mọi cách chọn 4 cạnh đã có 35 tổ hợp, và số tổ hợp tăng rất nhanh khi đồ thị lớn hơn.",
        en: "In this connected undirected graph with 5 vertices and 7 edges, choose 4 edges that connect every vertex at minimum total weight. There are already 35 ways to pick 4 edges, and that count grows rapidly on larger graphs.",
      },
      watch: { parts: 5, cost: 0 }, lines: [], verdict: "run", fit: "all", scene: graph([], [], "", false),
    },
    {
      title: { vi: "Sắp cạnh theo giá", en: "Sort edges by weight" }, kind: "concept",
      body: {
        vi: "Mỗi cạnh trong <code>edges</code> là bộ <code>(w, u, v)</code>, nên <code>sort</code> đưa trọng số 1, 2, 3, 4, 5, 6, 8 về đúng thứ tự. Dùng <code>unite</code> từ bài DSU, với mỗi đỉnh ban đầu là một nhóm.",
        en: "Each entry in <code>edges</code> is a tuple <code>(w, u, v)</code>, so <code>sort</code> orders the weights 1, 2, 3, 4, 5, 6, 8. Use <code>unite</code> from the Union-Find lesson, starting with one component per vertex.",
      },
      watch: { parts: 5, cost: 0 }, lines: [1, 2], verdict: "run", fit: "all", scene: graph(),
    },
    {
      title: { vi: "Nối A, C và B", en: "Join A, C, and B" }, kind: "step",
      body: {
        vi: "Cạnh A–C giá 1 nối hai nhóm khác nhau. Tiếp đó B–C giá 2 đưa B vào nhóm chứa A và C, nâng <code>cost</code> lên 3.",
        en: "Edge A–C costs 1 and joins two different components. Next B–C costs 2 and brings B into the component with A and C, raising <code>cost</code> to 3.",
      },
      watch: { edge: "B–C (2)", parts: 3, cost: 3 }, lines: [6, 7, 8], verdict: "run", fit: "all",
      scene: graph(["AC", "BC"], [], "BC"),
    },
    {
      title: { vi: "Nối riêng D và E", en: "Join D and E" }, kind: "step",
      body: {
        vi: "D–E giá 3 nối hai đỉnh còn đứng riêng, tạo nhóm thứ hai bên cạnh nhóm A, B, C. Tổng lúc này là <code>1 + 2 + 3 = 6</code>.",
        en: "D–E costs 3 and joins the two isolated vertices, leaving a second component alongside A, B, C. The running cost is <code>1 + 2 + 3 = 6</code>.",
      },
      watch: { edge: "D–E (3)", parts: 2, cost: 6 }, lines: [6, 7, 8], verdict: "run", fit: "all",
      scene: graph(["AC", "BC", "DE"], [], "DE"),
    },
    {
      title: { vi: "Bỏ cạnh tạo chu trình", en: "Skip the cycle edge" }, kind: "step",
      body: {
        vi: "A và B đã nối với nhau qua C. Thêm A–B giá 4 sẽ khép chu trình A–C–B–A, nên <code>unite</code> trả về <code>false</code> và <code>cost</code> giữ nguyên ở 6.",
        en: "A and B already connect through C. Adding A–B for 4 would close the cycle A–C–B–A, so <code>unite</code> returns <code>false</code> and <code>cost</code> stays at 6.",
      },
      watch: { edge: "A–B (4)", parts: 2, cost: 6 }, lines: [6, 7], verdict: "run", fit: "all",
      scene: graph(["AC", "BC", "DE"], ["AB"], "AB"),
    },
    {
      title: { vi: "Nối hai nhóm cuối", en: "Merge the last components" }, kind: "answer",
      body: {
        vi: "B–D giá 5 nối nhóm A, B, C với nhóm D, E. Ta có đủ 4 cạnh cho 5 đỉnh, tổng nhỏ nhất là <code>1 + 2 + 3 + 5 = 11</code>.",
        en: "B–D costs 5 and links the component A, B, C to D, E. We now have 4 edges for 5 vertices, with minimum total weight <code>1 + 2 + 3 + 5 = 11</code>.",
      },
      watch: { edge: "B–D (5)", parts: 1, cost: 11 }, lines: [7, 8, 9, 11], verdict: "ac", fit: "all",
      scene: graph(MST, ["AB"], "BD", true, true),
    },
    {
      title: { vi: "Vì sao chọn cạnh rẻ", en: "Why cheap edges work" }, kind: "recap",
      body: {
        vi: "Khi chọn B–D, 5 là giá thấp nhất của cạnh bắc qua ranh giới hai nhóm, nên có thể thêm cạnh này theo tính chất lát cắt. Sắp xếp chi phối thời gian O(m log m + n), còn thiếu 4 cạnh khi duyệt xong ví dụ 5 đỉnh sẽ báo <code>IMPOSSIBLE</code>.",
        en: "When B–D is chosen, 5 is the lowest weight crossing the boundary between the two components, so the cut property makes it safe to add. Sorting dominates the O(m log m + n) runtime, and finishing with fewer than 4 edges for 5 vertices would give <code>IMPOSSIBLE</code>.",
      },
      watch: { parts: 1, cost: 11 }, lines: [2, 7, 11, 12], verdict: "ac", fit: "all",
      scene: graph(MST, ["AB"], "", true, true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const [id, x, y] of VERTICES) {
    scene.add(id, { shape: shapes.block({ label: id, w: 42, h: 30 }), x, y });
  }
  EDGES.forEach(([u, v, weight, bend], i) => {
    const id = u + v;
    scene.link(`edge${id}`, { from: u, to: v, anchor: "center", bend });
    scene.add(`weight${id}`, { shape: shapes.pill({ text: weight, h: 22, pad: 7 }), follow: `edge${id}`, s: 0.88 });
    scene.add(`slot${id}`, { shape: shapes.block({ label: weight, sub: `${u}–${v}`, w: 39, h: 30 }), x: i * 0.77, y: 6.45 });
  });
}
