import type { Lesson, SceneMap } from "../../../lib/types";

const POSITIONS = [[0, 2], [1.12, 0], [2.24, 2], [3.5, 2], [4.62, 0], [5.74, 2], [0, 4.2]];
const EDGES = [[1, 2], [2, 3], [1, 3], [3, 4], [4, 5], [5, 6], [4, 6], [1, 7]];

function picture(low: number[], focus: number[] = [], backEdge?: number, bridges: number[] = [], cuts: number[] = []): SceneMap {
  const scene: SceneMap = {};
  EDGES.forEach(([u, v], i) => {
    scene[`e${i}`] = {
      cls: bridges.includes(i) ? "v-eq" : i === backEdge ? "v-lt" : "",
      o: low.length && Math.max(u, v) > low.length ? 0.4 : 1,
      ...(i === backEdge ? { from: { p: 0 }, dur: 460 } : {}),
    };
  });
  POSITIONS.forEach((_, i) => {
    const v = i + 1;
    const cls = cuts.includes(v) ? "is-good" : focus.includes(v) ? "is-active" : i < low.length ? "" : "is-out";
    scene[`v${v}`] = { cls: low.length ? cls : "" };
    scene[`t${v}`] = { text: i < low.length ? String(v) : "—", cls };
    scene[`l${v}`] = { text: String(low[i] ?? "—"), cls };
  });
  return scene;
}

const finalLow = [1, 1, 1, 4, 4, 4, 7];
const final = picture(finalLow, [], undefined, [3, 7], [1, 3, 4]);

export const lesson: Lesson = {
  track: "cp", topic: "graphs-adv", slug: "bridges",
  title: { vi: "Cầu & khớp", en: "Bridges and articulation points" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng thời điểm vào DFS và cạnh ngược để tìm những cạnh hoặc đỉnh mà khi bỏ đi, đồ thị bị tách.",
    en: "Use DFS entry times and back edges to find edges and vertices whose removal disconnects the graph.",
  },
  level: "hard", minutes: 10, time: "O(V + E)", memory: "O(V)",
  goal: { vi: "Tìm mọi <b>cầu và đỉnh khớp</b> trong đồ thị vô hướng", en: "Find all <b>bridges and articulation points</b> in the undirected graph" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> timer = 0;',
    '<span class="kw">auto</span> dfs = [&amp;](<span class="kw">auto</span>&amp;&amp; self, <span class="kw">int</span> u, <span class="kw">int</span> parentEdge) -&gt; <span class="kw">void</span> {',
    '  tin[u] = low[u] = ++timer;',
    '  <span class="kw">int</span> children = 0;',
    '  <span class="kw">for</span> (<span class="kw">auto</span> [v, id] : adj[u]) {',
    '    <span class="kw">if</span> (id == parentEdge) <span class="kw">continue</span>;',
    '    <span class="kw">if</span> (tin[v]) { low[u] = min(low[u], tin[v]); <span class="kw">continue</span>; }',
    '    ++children; self(self, v, id);',
    '    low[u] = min(low[u], low[v]);',
    '    <span class="kw">if</span> (low[v] &gt; tin[u]) bridges.emplace_back(u, v);',
    '    <span class="kw">if</span> (parentEdge != -1 &amp;&amp; low[v] &gt;= tin[u]) cut[u] = true;',
    '  }',
    '  <span class="kw">if</span> (parentEdge == -1) cut[u] = children &gt; 1;',
    '};',
    '<span class="kw">for</span> (<span class="kw">int</span> u = 1; u &lt;= n; ++u) <span class="kw">if</span> (!tin[u]) dfs(dfs, u, -1);',
  ],
  watch: [
    { key: "edge", label: "(u, v)" },
    { key: "compare", label: "low[v] vs tin[u]" },
    { key: "children", label: "children" },
  ],
  practice: [
    { src: "CSES 2076", name: "Necessary Roads", lv: "★★★", url: "https://cses.fi/problemset/task/2076/" },
    { src: "CSES 2077", name: "Necessary Cities", lv: "★★★", url: "https://cses.fi/problemset/task/2077/" },
  ],
  sceneOptions: { unit: 53, view: [-40, -105, 400, 335] },
  legend: [
    { cls: "acc", label: { vi: "đang xét", en: "in focus" } },
    { cls: "tle", label: { vi: "cạnh ngược", en: "back edge" } },
    { cls: "ac", label: { vi: "cầu hoặc đỉnh khớp", en: "bridge or articulation point" } },
  ],
  steps: [
    {
      title: { vi: "Bỏ cạnh hay đỉnh?", en: "Remove an edge or vertex?" }, kind: "problem",
      body: {
        vi: "Cầu là cạnh mà khi bỏ đi, số thành phần liên thông tăng. Đỉnh khớp cũng vậy, nhưng phải bỏ cả đỉnh lẫn các cạnh kề. Nếu thử bỏ lần lượt từng cạnh và từng đỉnh trong đồ thị 7 đỉnh, 8 cạnh này, ta phải kiểm tra liên thông 15 lần.",
        en: "Removing a bridge increases the number of connected components. Removing an articulation point and its incident edges does the same. Trying each edge and vertex separately in this 7-vertex, 8-edge graph takes 15 connectivity checks.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture([]),
    },
    {
      title: { vi: "Ghi thứ tự vào", en: "Record the entry order" }, kind: "concept",
      body: {
        vi: "Ban đầu đặt <code>tin</code> bằng 0 và cho hai đầu của mỗi cạnh dùng chung một ID. DFS từ 1 đi qua 2 rồi tới 3, gán cho chúng lần lượt 1, 2, 3 ở cả hai hàng <code>tin</code> và <code>low</code>. Mỗi cột ứng với đỉnh ghi ở hàng trên cùng.",
        en: "Start with <code>tin</code> zeroed and give each undirected edge one shared ID in both adjacency lists. DFS enters 1, 2 and 3 in order, setting both <code>tin</code> and <code>low</code> to 1, 2 and 3. Each column belongs to the vertex in its header.",
      },
      lines: [1, 3, 5, 6, 8, 15], watch: { edge: "(2, 3)" }, verdict: "run", fit: "all",
      scene: picture([1, 2, 3], [1, 2, 3]),
    },
    {
      title: { vi: "Gặp cạnh ngược", en: "Find a back edge" }, kind: "step",
      body: {
        vi: "Ở 3, bỏ qua đúng cạnh cha 2–3 rồi gặp cạnh ngược 3–1. Qua cạnh này ta tới được tổ tiên 1, nên hạ <code>low[3]</code> từ 3 xuống <code>tin[1] = 1</code>. <code>low[u]</code> ghi thời điểm vào sớm nhất có thể tới bằng các cạnh cây đi xuống và tối đa một cạnh ngược.",
        en: "At 3, skip the exact parent edge 2–3 and find back edge 3–1. It reaches ancestor 1, lowering <code>low[3]</code> from 3 to <code>tin[1] = 1</code>. <code>low[u]</code> tracks the earliest entry time reachable by descending tree edges and then taking at most one back edge.",
      },
      lines: [5, 6, 7], watch: { edge: "(3, 1)" }, verdict: "run", fit: "all",
      scene: picture([1, 2, 1], [3, 1], 2),
    },
    {
      title: { vi: "Truyền low lên cha", en: "Pass low to the parent" }, kind: "step",
      body: {
        vi: "DFS đi tiếp qua 4, 5, 6. Cạnh ngược 6–4 hạ <code>low[6]</code> từ 6 xuống 4. Khi 6 trả về 5, lấy <code>min(5, 4) = 4</code> cho <code>low[5]</code>.",
        en: "DFS continues through 4, 5 and 6. Back edge 6–4 lowers <code>low[6]</code> from 6 to 4. When 6 returns to 5, take <code>min(5, 4) = 4</code> for <code>low[5]</code>.",
      },
      lines: [7, 8, 9], watch: { edge: "(5, 6)", compare: "4 < 5" }, verdict: "run", fit: "all",
      scene: picture([1, 2, 1, 4, 4, 4], [5, 6], 6),
    },
    {
      title: { vi: "Dấu bằng vẫn tách", en: "Equality still gives a cut" }, kind: "step",
      body: {
        vi: "Khi 5 trả về 4, <code>low[5] = tin[4] = 4</code>. Nhánh của 5 có đường vòng về 4 qua 6 nên cạnh 4–5 vẫn có thể bỏ. Nếu bỏ đỉnh 4 thì đường vòng cũng mất điểm nối, nên 4 là đỉnh khớp.",
        en: "When 5 returns to 4, <code>low[5] = tin[4] = 4</code>. Its branch can reach 4 via 6, so edge 4–5 can be removed. Removing vertex 4 also removes the detour's connection to the rest of the graph, so 4 is an articulation point.",
      },
      lines: [9, 10, 11], watch: { edge: "(4, 5)", compare: "4 = 4" }, verdict: "run", fit: "all",
      scene: picture([1, 2, 1, 4, 4, 4], [5], undefined, [], [4]),
    },
    {
      title: { vi: "Chốt cầu 3–4", en: "Mark bridge 3–4" }, kind: "step",
      body: {
        vi: "Khi 4 trả về 3, <code>low[4] = 4 &gt; tin[3] = 3</code>. Không có cạnh ngược nào đưa nhánh của 4 về tới 3 hay tổ tiên của 3. Cạnh 3–4 là cầu và đỉnh 3 là khớp.",
        en: "When 4 returns to 3, <code>low[4] = 4 &gt; tin[3] = 3</code>. No back edge gets the branch of 4 back to 3 or an ancestor of 3. Edge 3–4 is a bridge and vertex 3 is an articulation point.",
      },
      lines: [9, 10, 11], watch: { edge: "(3, 4)", compare: "4 > 3" }, verdict: "run", fit: "all",
      scene: picture([1, 2, 1, 4, 4, 4], [], undefined, [3], [3, 4]),
    },
    {
      title: { vi: "Xét riêng gốc DFS", en: "Check the DFS root" }, kind: "answer",
      body: {
        vi: "<code>low[3] = 1</code> truyền lên 2, rồi DFS trở về 1 và mở nhánh 7. Vì <code>low[7] = 7 &gt; tin[1] = 1</code>, cạnh 1–7 là cầu thứ hai. Gốc 1 có hai con DFS là 2 và 7, nên 1 là đỉnh khớp cùng với 3 và 4.",
        en: "<code>low[3] = 1</code> passes up to 2, then DFS returns to 1 and explores 7. Since <code>low[7] = 7 &gt; tin[1] = 1</code>, edge 1–7 is the second bridge. Root 1 has two DFS children, 2 and 7, so it joins 3 and 4 as an articulation point.",
      },
      lines: [8, 9, 10, 13], watch: { edge: "(1, 7)", compare: "7 > 1", children: 2 }, verdict: "ac", fit: "all", scene: final,
    },
    {
      title: { vi: "Chốt khi DFS về", en: "Decide on DFS return" }, kind: "recap",
      body: {
        vi: "Chỉ so sánh khi đã duyệt xong cả nhánh con: dùng <code>&gt;</code> cho cầu và <code>&gt;=</code> cho khớp ngoài gốc. Với gốc, các nhánh con DFS chỉ nối nhau qua gốc, nên cần ít nhất hai con. Duyệt mỗi đầu cạnh một lần tốn O(V + E) thời gian và O(V) bộ nhớ phụ.",
        en: "Compare only after the whole child subtree is explored. Use <code>&gt;</code> for bridges and <code>&gt;=</code> for non-root articulation points. A root needs two or more DFS children because their branches meet only at the root. Scanning each edge endpoint once takes O(V + E) time and O(V) extra space.",
      },
      lines: [9, 10, 11, 13, 15], watch: { children: 2 }, verdict: "ac", fit: "all", scene: final,
    },
  ],
};

export function setup(scene: any, shapes: any) {
  POSITIONS.forEach(([x, y], i) => {
    const v = i + 1;
    scene.add(`v${v}`, { shape: shapes.block({ label: v, w: 44, h: 34 }), x, y });
    const col = i * 0.88 + 0.54;
    scene.add(`h${v}`, { shape: shapes.pill({ text: v, h: 22 }), x: col, y: 6 });
    scene.add(`t${v}`, { shape: shapes.block({ w: 40, h: 26, depth: 4 }), x: col, y: 7.27 });
    scene.add(`l${v}`, { shape: shapes.block({ w: 40, h: 26, depth: 4 }), x: col, y: 8.55 });
  });
  scene.add("tin", { shape: shapes.pill({ text: "tin", h: 22 }), x: -0.4, y: 7.2 });
  scene.add("low", { shape: shapes.pill({ text: "low", h: 22 }), x: -0.4, y: 8.48 });
  EDGES.forEach(([u, v], i) => scene.link(`e${i}`, { from: `v${u}`, to: `v${v}`, anchor: "center", bend: 0, p: 1 }));
}
