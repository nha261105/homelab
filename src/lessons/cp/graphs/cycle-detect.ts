import type { Lesson, SceneMap } from "../../../lib/types";

const POSITIONS = [[0, 1], [1.55, 1], [3.65, 1], [2.6, 4.5], [2.6, -2.5]];
const EDGES = [
  { u: 1, v: 2 },
  { u: 2, v: 5 },
  { u: 2, v: 3 },
  { u: 3, v: 5 },
  { u: 3, v: 4 },
  { u: 4, v: 2 },
];

function picture(stack: number[], done: number[], focus: number[] = [], cycle = false): SceneMap {
  const scene: SceneMap = { stack: { o: stack.length ? 1 : 0 } };
  POSITIONS.forEach((_, i) => {
    const v = i + 1;
    scene[`v${v}`] = { cls: stack.includes(v) ? "is-active" : done.includes(v) ? "is-good" : "is-out" };
  });
  EDGES.forEach((_, i) => {
    const cls = focus.includes(i) ? (cycle ? "v-gt" : "v-lt") : "";
    scene[`e${i}`] = { p: 1, cls };
  });
  for (let i = 0; i < 4; i++) {
    scene[`s${i}`] = { text: String(stack[i] ?? "—"), o: stack.length ? 1 : 0, cls: stack[i] ? "is-active" : "is-out" };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "graphs", slug: "cycle-detect",
  title: { vi: "Tìm chu trình", en: "Finding a cycle" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng DFS ba màu để nhận ra cạnh quay về một đỉnh còn trên ngăn xếp.",
    en: "Use three-state DFS to find an edge back to a vertex still on the stack.",
  },
  level: "medium", minutes: 8, time: "O(V + E)", memory: "O(V)",
  goal: { vi: "Tìm một chu trình trong đồ thị có hướng gồm <b>5 đỉnh</b>", en: "Find a cycle in a directed graph with <b>5 vertices</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> n = adj.size() - 1;',
    'vector&lt;int&gt; state(n + 1, 0), parent(n + 1), cycle;',
    'function&lt;bool(int)&gt; dfs = [&amp;](<span class="kw">int</span> u) {',
    '  state[u] = 1;',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[u]) {',
    '    <span class="kw">if</span> (state[v] == 0) { parent[v] = u; <span class="kw">if</span> (dfs(v)) <span class="kw">return true</span>; }',
    '    <span class="kw">else if</span> (state[v] == 1) {',
    '      cycle = {v};',
    '      <span class="kw">for</span> (<span class="kw">int</span> x = u; x != v; x = parent[x]) cycle.push_back(x);',
    '      cycle.push_back(v); reverse(cycle.begin(), cycle.end()); <span class="kw">return true</span>;',
    '    }',
    '  }',
    '  state[u] = 2; <span class="kw">return false</span>;',
    '};',
    '<span class="kw">for</span> (<span class="kw">int</span> u = 1; u &lt;= n; ++u) <span class="kw">if</span> (state[u] == 0 &amp;&amp; dfs(u)) <span class="kw">break</span>;',
  ],
  watch: [
    { key: "edge", label: { vi: "cạnh đang xét", en: "edge in focus" } },
    { key: "done", label: { vi: "đỉnh đã xong", en: "finished vertices" } },
    { key: "cycle", label: { vi: "chu trình", en: "cycle" } },
  ],
  practice: [
    { src: "CSES 1669", name: "Round Trip", lv: "★★☆", url: "https://cses.fi/problemset/task/1669" },
    { src: "CSES 1678", name: "Round Trip II", lv: "★★☆", url: "https://cses.fi/problemset/task/1678" },
  ],
  sceneOptions: { unit: 64, view: [-55, -175, 375, 410] },
  legend: [
    { cls: "dim", label: { vi: "trắng · chưa thăm", en: "white · unvisited" } },
    { cls: "acc", label: { vi: "xám · còn trên ngăn xếp", en: "gray · on the stack" } },
    { cls: "ac", label: { vi: "đen · đã duyệt xong", en: "black · finished" } },
    { cls: "wa", label: { vi: "cạnh của chu trình", en: "cycle edge" } },
  ],
  steps: [
    {
      title: { vi: "Tìm đường quay về", en: "Find a way back" }, kind: "problem",
      body: {
        vi: "Trên đồ thị 5 đỉnh, hãy tìm một đường đi theo mũi tên và quay về đúng đỉnh xuất phát. Liệt kê mọi đường đi đơn có thể rất tốn công vì mỗi ngã rẽ lại sinh thêm lựa chọn.",
        en: "In this 5-vertex graph, find a route that follows the arrows and returns to its starting vertex. Enumerating every simple path can be expensive because each fork adds more choices.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture([], []),
    },
    {
      title: { vi: "Đánh dấu ba trạng thái", en: "Track three states" }, kind: "concept",
      body: {
        vi: "DFS gọi các trạng thái 0, 1, 2 lần lượt là trắng, xám, đen. Vào đỉnh thì đánh dấu xám và thêm vào hàng <code>DFS</code> mô phỏng ngăn xếp; duyệt xong mới đánh dấu đen. Bắt đầu tại 1 rồi đi theo cạnh 1→2.",
        en: "DFS calls states 0, 1, and 2 white, gray, and black. A vertex turns gray on entry and appears in the <code>DFS</code> stack row, then turns black when it finishes. Start at 1 and follow 1→2.",
      },
      lines: [4, 6, 13, 15], watch: { edge: "1 → 2", done: "∅" }, verdict: "run", fit: "all",
      scene: picture([1, 2], [], [0]),
    },
    {
      title: { vi: "Kết thúc nhánh 5", en: "Finish the branch at 5" }, kind: "step",
      body: {
        vi: "Từ 2, DFS thăm 5 trước. Đỉnh 5 không có cạnh đi ra nên lời gọi kết thúc ngay, 5 chuyển sang đen và chỉ còn 1, 2 trên ngăn xếp.",
        en: "From 2, DFS visits 5 first. Vertex 5 has no outgoing edges, so its call finishes immediately, 5 turns black, and only 1 and 2 remain on the stack.",
      },
      lines: [5, 6, 13], watch: { edge: "2 → 5", done: "{5}" }, verdict: "run", fit: "all",
      scene: { ...picture([1, 2], [5], [1]), v5: { cls: "is-good", fx: { type: "pulse", delay: 200 } } },
    },
    {
      title: { vi: "Bỏ qua đỉnh đen", en: "Skip the black vertex" }, kind: "step",
      body: {
        vi: "DFS từ 2 sang 3 rồi gặp lại 5 qua cạnh 3→5. Đỉnh 5 đã đen, tức lời gọi ở 5 đã kết thúc; cạnh này không nối về đường DFS hiện tại.",
        en: "DFS moves from 2 to 3 and sees 5 again via 3→5. Vertex 5 is black, so its call is already finished and this edge does not lead back to the current DFS path.",
      },
      lines: [5, 6, 7], watch: { edge: "3 → 5", done: "{5}" }, verdict: "run", fit: "all",
      scene: picture([1, 2, 3], [5], [3]),
    },
    {
      title: { vi: "Tiến đến đỉnh 4", en: "Descend to vertex 4" }, kind: "step",
      body: {
        vi: "Xét cạnh 3→4. Vì 4 còn trắng, lưu <code>parent[4] = 3</code> rồi gọi DFS ở 4. Đường đang mở trên ngăn xếp là <code>1, 2, 3, 4</code>.",
        en: "Check edge 3→4. Because 4 is white, set <code>parent[4] = 3</code> and call DFS at 4. The open path on the stack is <code>1, 2, 3, 4</code>.",
      },
      lines: [4, 5, 6], watch: { edge: "3 → 4", done: "{5}" }, verdict: "run", fit: "all",
      scene: picture([1, 2, 3, 4], [5], [4]),
    },
    {
      title: { vi: "Gặp lại đỉnh xám", en: "Reach a gray vertex" }, kind: "answer",
      body: {
        vi: "Cạnh 4→2 quay về đỉnh 2 còn xám. Lần theo <code>parent</code> từ 4 lên 3 rồi 2, đảo lại đoạn đường đó và thêm cạnh 4→2 để được <code>2 → 3 → 4 → 2</code>.",
        en: "Edge 4→2 returns to vertex 2, which is still gray. Follow <code>parent</code> from 4 through 3 to 2, reverse that path, and close it with 4→2 to get <code>2 → 3 → 4 → 2</code>.",
      },
      lines: [7, 8, 9, 10], watch: { edge: "4 → 2", done: "{5}", cycle: "2 → 3 → 4 → 2" }, verdict: "ac", fit: "all",
      scene: { ...picture([1, 2, 3, 4], [5], [2, 4, 5], true), e5: { p: 1, cls: "v-gt", from: { p: 0 }, dur: 460 } },
    },
    {
      title: { vi: "Giữ đúng đường DFS", en: "Track the active path" }, kind: "recap",
      body: {
        vi: "Cạnh về đỉnh xám khép chu trình vì đoạn từ 2 đến 4 vẫn nằm trên ngăn xếp. Duyệt mọi gốc còn trắng tốn O(V + E) thời gian và O(V) bộ nhớ phụ. Với đồ thị vô hướng đơn như Round Trip, nhớ bỏ qua cạnh ngược về cha của <code>u</code>.",
        en: "An edge to a gray vertex closes a cycle because the path from 2 to 4 is still on the stack. Searching from every remaining white root takes O(V + E) time and O(V) extra space. In a simple undirected graph such as Round Trip, skip the reverse edge to <code>u</code>'s parent.",
      },
      lines: [6, 7, 13, 15], watch: { cycle: "2 → 3 → 4 → 2" }, verdict: "ac", fit: "all",
      scene: picture([1, 2, 3, 4], [5], [2, 4, 5], true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  POSITIONS.forEach(([x, y], i) => {
    scene.add(`v${i + 1}`, { shape: shapes.block({ label: i + 1, w: 43, h: 32 }), x, y });
  });
  EDGES.forEach(({ u, v }, i) => {
    scene.link(`e${i}`, { from: `v${u}`, to: `v${v}`, anchor: "center", arrow: true, bend: 0 });
  });
  scene.add("stack", { shape: shapes.pill({ text: "DFS" }), x: -0.02, y: 5.95 });
  for (let i = 0; i < 4; i++) {
    scene.add(`s${i}`, { shape: shapes.block({ w: 35, h: 26 }), x: 0.85 + 0.77 * i, y: 5.95 });
  }
}
