import type { Lesson, SceneMap } from "../../../lib/types";

const VERTICES = [
  ["A", 0, 0], ["B", 2.3, 0], ["C", 1.15, 4.1], ["D", 3.45, 4.1], ["E", 4.6, 0],
] as const;
const EDGES = [
  ["A", "B", 4, 0.12], ["A", "C", 1, -1.25], ["B", "C", 2, -1.25],
  ["B", "D", 5, -1.25], ["C", "D", 6, -0.35], ["D", "E", 3, -1.25], ["B", "E", 8, 0.12],
] as const;
const U = 58;
const MST = ["AC", "BC", "BD", "DE"];
const FINAL_KEYS = [0, 2, 1, 5, 3];

function graph(keys: number[], tree = "", accepted: string[] = [], candidates: string[] = [], updated = ""): SceneMap {
  const scene: SceneMap = {};
  VERTICES.forEach(([id], i) => {
    const cls = tree.includes(id) ? "is-good" : Number.isFinite(keys[i]) ? "is-active" : "is-out";
    scene[id] = { cls };
    scene[`key${id}`] = {
      text: Number.isFinite(keys[i]) ? String(keys[i]) : "∞",
      cls,
      ...(updated.includes(id) ? { fx: "pulse" } : {}),
    };
  });
  for (const [u, v] of EDGES) {
    const id = u + v;
    const keep = accepted.includes(id);
    const candidate = candidates.includes(id);
    const cls = keep ? "v-eq" : "";
    scene[`edge${id}`] = { p: 1, cls, o: keep || candidate || !tree ? 1 : 0.22 };
    scene[`weight${id}`] = { cls, o: tree.length === VERTICES.length && !keep ? 0 : 1 };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "dsu-mst",
  slug: "prim",
  title: { vi: "Prim", en: "Prim's MST" },
  added: "2026-11-27",
  summary: {
    vi: "Nuôi một cây từ đỉnh xuất phát bằng cách luôn lấy cạnh rẻ nhất đi ra ngoài cây.",
    en: "Grow one tree from a starting vertex by always taking the cheapest edge leaving it.",
  },
  level: "medium",
  minutes: 8,
  time: "O((n + m) log n)",
  memory: "O(n + m)",
  goal: {
    vi: "Tìm cây khung nhỏ nhất bằng cách bành rộng từ <b>A</b>",
    en: "Find a minimum spanning tree by growing it from <b>A</b>",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">using</span> Item = pair&lt;<span class="kw">long long</span>, <span class="kw">int</span>&gt;;',
    '<span class="kw">vector</span>&lt;<span class="kw">long long</span>&gt; best(n, LLONG_MAX);',
    '<span class="kw">vector</span>&lt;<span class="kw">int</span>&gt; parent(n, -1), in(n, 0);',
    '<span class="kw">set</span>&lt;Item&gt; q{{0, 0}}; best[0] = 0;',
    '<span class="kw">long long</span> cost = 0; <span class="kw">int</span> taken = 0;',
    '<span class="kw">while</span> (!q.empty()) {',
    '  <span class="kw">auto</span> [w, u] = *q.begin(); q.erase(q.begin());',
    '  in[u] = 1; cost += w; ++taken;',
    '  <span class="kw">for</span> (<span class="kw">auto</span> [v, c] : adj[u]) {',
    '    <span class="kw">if</span> (in[v] || c &gt;= best[v]) <span class="kw">continue</span>;',
    '    q.erase({best[v], v});',
    '    best[v] = c; parent[v] = u; q.emplace(c, v);',
    '  }',
    '}',
    '<span class="kw">if</span> (taken == n) cout &lt;&lt; cost; <span class="kw">else</span> cout &lt;&lt; "IMPOSSIBLE";',
  ],
  watch: [
    { key: "u", label: { vi: "đỉnh mới", en: "new vertex" } },
    { key: "w", label: { vi: "giá cạnh lấy", en: "chosen edge cost" } },
    { key: "cost", label: "cost" },
  ],
  practice: [
    { src: "CSES 1675", name: "Road Reparation", lv: "★★☆", url: "https://cses.fi/problemset/task/1675" },
    { src: "LeetCode 1584", name: "Min Cost to Connect All Points", lv: "★★☆", url: "https://leetcode.com/problems/min-cost-to-connect-all-points/" },
  ],
  sceneOptions: { unit: U, view: [-55, -127, 375, 403] },
  legend: [
    { cls: "acc", label: { vi: "đang chờ trong hàng đợi", en: "waiting in the queue" } },
    { cls: "ac", label: { vi: "đã vào cây", en: "in the tree" } },
    { cls: "dim", label: { vi: "chưa có cạnh nối vào cây", en: "no edge from the tree yet" } },
  ],
  entrance: VERTICES.map(([id]) => id),
  steps: [
    {
      title: { vi: "Nối năm đỉnh", en: "Connect five vertices" }, kind: "problem",
      body: {
        vi: "Ta cần nối 5 đỉnh trong đồ thị vô hướng này bằng 4 cạnh có tổng giá nhỏ nhất. Thử đủ các bộ 4 cạnh trong 7 cạnh cần xét 35 tổ hợp, còn Prim xây cây bằng cách thêm từng đỉnh.",
        en: "We need to connect all 5 vertices in this undirected graph using 4 edges of minimum total cost. Trying all 4-edge subsets of the 7 edges takes 35 combinations. Prim grows the tree one vertex at a time.",
      },
      watch: { cost: 0 }, lines: [], verdict: "run", fit: "all",
      scene: graph([Infinity, Infinity, Infinity, Infinity, Infinity]),
    },
    {
      title: { vi: "Bắt đầu từ A", en: "Start at A" }, kind: "concept",
      body: {
        vi: "Đưa A vào <code>q</code> với giá 0 rồi lấy ra làm gốc. Từ A, cạnh rẻ nhất nối đến B giá 4 và đến C giá 1, nên <code>best[B] = 4</code> và <code>best[C] = 1</code>.",
        en: "Put A into <code>q</code> with cost 0, then extract it as the root. From A, the cheapest links to B and C cost 4 and 1, so <code>best[B] = 4</code> and <code>best[C] = 1</code>.",
      },
      note: {
        vi: "<code>best[v]</code> là giá một cạnh đi từ cây đến v, không phải tổng giá đường đi từ A.",
        en: "<code>best[v]</code> measures one edge from the tree to v. Path length from A plays no role.",
      },
      watch: { u: "A", w: 0, cost: 0 }, lines: [4, 6, 7, 8, 9, 12], verdict: "run", fit: "all",
      scene: graph([0, 4, 1, Infinity, Infinity], "A", [], ["AB", "AC"], "BC"),
    },
    {
      title: { vi: "C vào, B rẻ hơn", en: "Add C, improve B" }, kind: "step",
      body: {
        vi: "<code>q</code> lấy C trước vì 1 &lt; 4. C–B giá 2 tốt hơn A–B giá 4, nên thay mục của B bằng giá 2 và đổi <code>parent[B]</code> sang C. C–D đưa D vào hàng đợi với giá 6.",
        en: "<code>q</code> takes C first because 1 &lt; 4. C–B costs 2, improving on A–B at 4, so replace B's entry with cost 2 and set <code>parent[B]</code> to C. C–D queues D with cost 6.",
      },
      watch: { u: "C", w: 1, cost: 1 }, lines: [7, 8, 9, 10, 11, 12], verdict: "run", fit: "all",
      scene: graph([0, 2, 1, 6, Infinity], "AC", ["AC"], ["BC", "CD"], "BD"),
    },
    {
      title: { vi: "B cập nhật biên", en: "B updates the frontier" }, kind: "step",
      body: {
        vi: "Lấy B qua cạnh C–B giá 2. B–D giá 5 hạ <code>best[D]</code> từ 6 xuống 5, còn B–E giá 8 lần đầu đưa E vào hàng đợi.",
        en: "Take B via C–B for 2. B–D at 5 lowers <code>best[D]</code> from 6 to 5, and B–E at 8 puts E into the queue for the first time.",
      },
      watch: { u: "B", w: 2, cost: 3 }, lines: [7, 8, 9, 10, 11, 12], verdict: "run", fit: "all",
      scene: graph([0, 2, 1, 5, 8], "ACB", ["AC", "BC"], ["BD", "BE"], "DE"),
    },
    {
      title: { vi: "D mở đường tới E", en: "D opens a route to E" }, kind: "step",
      body: {
        vi: "Chọn B–D giá 5 vì D và E vẫn ở ngoài cây, nên cạnh D–E giá 3 chưa dùng được. Khi D vào cây, D–E trở thành ứng viên và hạ <code>best[E]</code> từ 8 xuống 3.",
        en: "Take B–D for 5 because D and E are both outside the tree, so D–E at 3 is still unavailable. Once D joins the tree, D–E becomes a candidate and lowers <code>best[E]</code> from 8 to 3.",
      },
      watch: { u: "D", w: 5, cost: 8 }, lines: [7, 8, 9, 10, 11, 12], verdict: "run", fit: "all",
      scene: graph([0, 2, 1, 5, 3], "ACBD", ["AC", "BC", "BD"], ["DE"], "E"),
    },
    {
      title: { vi: "Đủ cả năm đỉnh", en: "Reach all five vertices" }, kind: "answer",
      body: {
        vi: "Lấy E qua D–E giá 3. Cây đã có đủ 5 đỉnh và 4 cạnh, tổng trọng số là <code>1 + 2 + 5 + 3 = 11</code>.",
        en: "Take E via D–E for 3. The tree now spans all 5 vertices with 4 edges of total weight <code>1 + 2 + 5 + 3 = 11</code>.",
      },
      watch: { u: "E", w: 3, cost: 11 }, lines: [7, 8, 10, 15], verdict: "ac", fit: "all",
      scene: graph(FINAL_KEYS, "ACBDE", MST),
    },
    {
      title: { vi: "Cạnh rẻ qua lát cắt", en: "Use the cheapest crossing" }, kind: "recap",
      body: {
        vi: "Tính chất lát cắt cho phép lấy cạnh rẻ nhất giữa cây và phần còn lại, chẳng hạn B–D giá 5 lúc cây có A, C, B. Với tối đa một mục mỗi đỉnh trong <code>q</code>, thời gian là O((n + m) log n). Hết ứng viên mà chưa lấy đủ n đỉnh thì đồ thị không liên thông.",
        en: "The cut property makes the cheapest edge out of the tree safe, such as B–D for 5 when the tree contains A, C, and B. With at most one queue entry per vertex, runtime is O((n + m) log n). If the queue empties before n vertices are taken, the graph is disconnected.",
      },
      watch: { cost: 11 }, lines: [7, 10, 11, 12, 15], verdict: "ac", fit: "all",
      scene: graph(FINAL_KEYS, "ACBDE", MST),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  VERTICES.forEach(([id, x, y], i) => {
    scene.add(id, { shape: shapes.block({ label: id, w: 42, h: 30 }), x, y });
    scene.add(`key${id}`, { shape: shapes.block({ label: "∞", sub: id, w: 42, h: 30 }), x: i * 1.15, y: 7.55 });
  });
  for (const [u, v, weight, bend] of EDGES) {
    const id = u + v;
    scene.link(`edge${id}`, { from: u, to: v, bend });
    scene.add(`weight${id}`, { shape: shapes.pill({ text: weight, h: 22, pad: 7 }), follow: `edge${id}`, s: 0.88 });
  }
  scene.add("best", { shape: shapes.pill({ text: "best[v]" }), x: 2.3, y: 5.95 });
}
