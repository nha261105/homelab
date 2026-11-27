import type { Lesson, SceneMap } from "../../../lib/types";

const VERTICES = ["A", "B", "C", "D", "E"] as const;
const POSITIONS = [[0, 2.2], [1.65, 0], [1.65, 4.4], [3.3, 2.2], [4.95, 2.2]];
const EDGES = [
  ["A", "B", 7, 0.1], ["A", "C", 2, -0.85], ["B", "D", 2, 0.1],
  ["C", "D", 1, -0.85], ["D", "E", 3, 0.35],
] as const;
const FIT = [...VERTICES, ...VERTICES.map((v) => `d${v}`), "dist", "heap"];

function picture(
  dist: (number | undefined)[], heap: string[], done = "",
  changed: string[] = [], rejected: string[] = [], stale = "",
): SceneMap {
  const scene: SceneMap = {};
  VERTICES.forEach((v, i) => {
    const cls = done.includes(v) ? "is-good" : dist[i] === undefined ? "is-out" : "is-active";
    scene[v] = { cls };
    scene[`d${v}`] = { text: dist[i] ?? "∞", cls };
    scene[`q${i}`] = {
      text: heap[i] ?? (i === 0 ? "∅" : ""),
      o: i === 0 || i < heap.length ? 1 : 0,
      cls: heap[i] === stale ? "is-bad" : i === 0 ? (heap.length === 0 ? "is-out" : "is-active") : "",
    };
  });
  EDGES.forEach(([a, b]) => {
    const id = a + b;
    const cls = changed.includes(id) ? "v-eq" : rejected.includes(id) ? "v-gt" : "";
    scene[id] = cls ? { p: 1, cls, from: { p: 0 }, dur: 420 } : { p: 1, o: 0.48 };
    scene[`w${id}`] = { cls };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "shortest-path", slug: "dijkstra",
  title: { vi: "Dijkstra", en: "Dijkstra" },
  added: "2026-11-27",
  summary: {
    vi: "Chốt đỉnh gần nhất bằng min-heap rồi dùng khoảng cách vừa chốt để nới lỏng các cạnh kề.",
    en: "Use a min-heap to settle the nearest vertex, then relax its edges using the newly settled distance.",
  },
  level: "medium", minutes: 9, time: "O(V + E log(E + 1))", memory: "O(V + E)",
  goal: { vi: "Tìm khoảng cách ngắn nhất từ <b>A</b> đến mọi đỉnh", en: "Find the shortest distances from <b>A</b> to every vertex" },
  codeLang: "C++17",
  code: [
    '<span class="kw">using</span> State = pair&lt;<span class="kw">long long</span>, <span class="kw">int</span>&gt;;',
    'priority_queue&lt;State, vector&lt;State&gt;, greater&lt;State&gt;&gt; pq;',
    'vector&lt;<span class="kw">long long</span>&gt; dist(n, 1LL &lt;&lt; 62);',
    'dist[s] = 0; pq.emplace(0, s);',
    '<span class="kw">while</span> (!pq.empty()) {',
    '  <span class="kw">auto</span> [d, u] = pq.top(); pq.pop();',
    '  <span class="kw">if</span> (d != dist[u]) <span class="kw">continue</span>;',
    '  <span class="kw">for</span> (<span class="kw">auto</span> [v, w] : adj[u]) {',
    '    <span class="kw">if</span> (d + w &gt;= dist[v]) <span class="kw">continue</span>;',
    '    dist[v] = d + w;',
    '    pq.emplace(dist[v], v);',
    '  }',
    '}',
  ],
  watch: [
    { key: "u", label: "u" },
    { key: "d", label: "d" },
    { key: "change", label: { vi: "cập nhật", en: "update" } },
  ],
  practice: [
    { src: "CSES 1671", name: "Shortest Routes I", lv: "★★☆", url: "https://cses.fi/problemset/task/1671" },
    { src: "LeetCode 743", name: "Network Delay Time", lv: "★★☆", url: "https://leetcode.com/problems/network-delay-time/" },
  ],
  sceneOptions: { unit: 49 },
  legend: [
    { cls: "dim", label: { vi: "chưa tới", en: "unreached" } },
    { cls: "acc", label: { vi: "khoảng cách tạm", en: "tentative distance" } },
    { cls: "ac", label: { vi: "đã chốt", en: "settled" } },
    { cls: "wa", label: { vi: "mục cũ hoặc cạnh không giảm", en: "stale entry or no improvement" } },
  ],
  steps: [
    {
      title: { vi: "Đường nào rẻ hơn?", en: "Which route costs less?" }, kind: "problem",
      body: {
        vi: "Các cạnh hai chiều có trọng số không âm. Đi thẳng A → B tốn 7, còn A → C → D → B chỉ tốn 2 + 1 + 2 = 5. BFS đếm cạnh sẽ ưu tiên đường tốn 7, còn liệt kê mọi đường đi đơn có thể mất thời gian theo hàm mũ.",
        en: "The undirected edges have nonnegative weights. A → B costs 7, while A → C → D → B costs 2 + 1 + 2 = 5. Counting edges with BFS favors the cost-7 route, and enumerating every simple path can take exponential time.",
      },
      lines: [], watch: {}, verdict: "run", fit: FIT, scene: picture([], []),
    },
    {
      title: { vi: "Khởi tạo min-heap", en: "Initialize the min-heap" }, kind: "concept",
      body: {
        vi: "Đặt <code>dist[A] = 0</code> và các khoảng cách còn lại là ∞. Mỗi khối <code>đỉnh:khoảng cách</code> trong hàng <code>pq</code> là một mục trong min-heap. Hàng hiển thị theo thứ tự lấy ra, với mục nhỏ nhất ở bên trái.",
        en: "Set <code>dist[A] = 0</code> and the other distances to ∞. Each <code>vertex:distance</code> block in <code>pq</code> is a min-heap entry. The row shows pop order, with the minimum on the left.",
      },
      lines: [1, 2, 3, 4], watch: {}, verdict: "run", fit: FIT, scene: picture([0], ["A:0"]),
    },
    {
      title: { vi: "Chốt A ở 0", en: "Settle A at 0" }, kind: "step",
      body: {
        vi: "Lấy A:0 ra rồi thử hai cạnh kề. <code>0 + 7</code> và <code>0 + 2</code> đều nhỏ hơn ∞, nên cập nhật B thành 7, C thành 2 rồi đưa cả hai vào heap.",
        en: "Pop A:0 and try its two edges. Both <code>0 + 7</code> and <code>0 + 2</code> beat ∞, so set B to 7 and C to 2 and push both into the heap.",
      },
      lines: [6, 7, 8, 9, 10, 11], watch: { u: "A", d: 0, change: "B:7, C:2" }, verdict: "run", fit: FIT,
      scene: picture([0, 7, 2], ["C:2", "B:7"], "A", ["AB", "AC"]),
    },
    {
      title: { vi: "Chốt C ở 2", en: "Settle C at 2" }, kind: "step",
      body: {
        vi: "C:2 ra trước B:7 vì 2 nhỏ hơn 7. Qua cạnh C–D, ta tìm được <code>dist[D] = 2 + 1 = 3</code>, nên D:3 lên đầu hàng.",
        en: "C:2 comes out before B:7 because 2 is smaller than 7. Taking the C–D edge gives <code>dist[D] = 2 + 1 = 3</code>, so D:3 moves to the front.",
      },
      lines: [6, 8, 9, 10, 11], watch: { u: "C", d: 2, change: "D:3" }, verdict: "run", fit: FIT,
      scene: picture([0, 7, 2, 3], ["D:3", "B:7"], "AC", ["CD"]),
    },
    {
      title: { vi: "Giảm khoảng cách tới B", en: "Improve the distance to B" }, kind: "step",
      body: {
        vi: "Chốt D ở 3. Qua D, ta tới B với giá <code>3 + 2 = 5 &lt; 7</code> và tới E với giá <code>3 + 3 = 6</code>. Thêm B:5 và E:6 vào heap, giữ B:7 ở đó tới khi nó được lấy ra.",
        en: "Settle D at 3. From D, B costs <code>3 + 2 = 5 &lt; 7</code> and E costs <code>3 + 3 = 6</code>. Push B:5 and E:6, leaving B:7 in the heap until it is popped.",
      },
      lines: [6, 8, 9, 10, 11], watch: { u: "D", d: 3, change: "B:5, E:6" }, verdict: "run", fit: FIT,
      scene: picture([0, 5, 2, 3, 6], ["B:5", "E:6", "B:7"], "ACD", ["BD", "DE"], [], "B:7"),
    },
    {
      title: { vi: "Chốt B ở 5", en: "Settle B at 5" }, kind: "step",
      body: {
        vi: "Lấy B:5 để chốt B. Đi tiếp sang D tốn <code>5 + 2 = 7</code>, lớn hơn <code>dist[D] = 3</code>, nên không cập nhật.",
        en: "Pop B:5 to settle B. Continuing to D costs <code>5 + 2 = 7</code>, more than <code>dist[D] = 3</code>, so there is no update.",
      },
      lines: [6, 7, 8, 9], watch: { u: "B", d: 5 }, verdict: "run", fit: FIT,
      scene: picture([0, 5, 2, 3, 6], ["E:6", "B:7"], "ABCD", [], ["BD"], "B:7"),
    },
    {
      title: { vi: "Chốt E ở 6", en: "Settle E at 6" }, kind: "answer",
      body: {
        vi: "Lấy E:6 để chốt đỉnh cuối. Hàng <code>dist</code> đã cho kết quả theo thứ tự A, B, C, D, E là <code>[0, 5, 2, 3, 6]</code>.",
        en: "Pop E:6 to settle the last vertex. The <code>dist</code> row gives the results for A, B, C, D, E as <code>[0, 5, 2, 3, 6]</code>.",
      },
      lines: [6, 7, 8, 9], watch: { u: "E", d: 6 }, verdict: "ac", fit: FIT,
      scene: picture([0, 5, 2, 3, 6], ["B:7"], "ABCDE", [], [], "B:7"),
    },
    {
      title: { vi: "Bỏ mục cũ", en: "Skip the stale entry" }, kind: "step",
      body: {
        vi: "Mục B:7 còn lại trong heap mang giá cũ 7, còn <code>dist[B] = 5</code>. Điều kiện <code>d != dist[u]</code> bỏ qua mục này trước khi duyệt các cạnh của B lần nữa.",
        en: "The remaining B:7 entry carries the old value 7, while <code>dist[B] = 5</code>. The <code>d != dist[u]</code> check skips it before scanning B’s edges again.",
      },
      lines: [5, 6, 7], watch: { u: "B", d: 7 }, verdict: "ac", fit: FIT,
      scene: picture([0, 5, 2, 3, 6], [], "ABCDE"),
    },
    {
      title: { vi: "Vì sao chốt được?", en: "Why settling works" }, kind: "recap",
      body: {
        vi: "Một đường ngắn hơn tới đỉnh sắp chốt phải đi qua một đỉnh chưa chốt có giá nhỏ hơn. Cạnh không âm giữ giá đường đi không giảm, và min-heap đã ưu tiên đỉnh rẻ nhất. Có O(E) lần thêm và lấy mục, mỗi lần tốn O(log(E + 1)), cộng O(V) để khởi tạo.",
        en: "A shorter route to the next settled vertex would have to enter an unsettled vertex at a smaller cost. Nonnegative edges keep path costs from decreasing, and the heap already chose the cheapest vertex. There are O(E) heap pushes and pops at O(log(E + 1)) each, plus O(V) initialization.",
      },
      lines: [5, 6, 7, 8, 9], watch: {}, verdict: "ac", fit: FIT,
      scene: picture([0, 5, 2, 3, 6], [], "ABCDE"),
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  VERTICES.forEach((v, i) => {
    const [x, y] = POSITIONS[i];
    scene.add(v, { shape: shapes.block({ label: v, w: 47, h: 37 }), x, y, shadow: true });
    const slot = 0.85 + i * 1.04;
    scene.add(`d${v}`, { shape: shapes.block({ sub: v, w: 38, h: 26, depth: 4 }), x: slot, y: 7.25 });
    scene.add(`q${i}`, { shape: shapes.block({ w: 48, h: 26, depth: 4 }), x: slot, y: 9.8, o: 0 });
  });
  scene.add("dist", { shape: shapes.pill({ text: "dist", h: 23, pad: 5 }), x: -0.4, y: 6.97 });
  scene.add("heap", { shape: shapes.pill({ text: "pq", h: 23, pad: 5 }), x: -0.4, y: 9.5 });
  EDGES.forEach(([from, to, weight, bend]) => {
    const id = from + to;
    scene.link(id, { from, to, bend });
    scene.add(`w${id}`, { shape: shapes.pill({ text: weight, h: 19, pad: 5 }), follow: id });
  });
}
