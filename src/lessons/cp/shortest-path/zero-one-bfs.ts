import type { Lesson, SceneMap } from "../../../lib/types";

const VERTICES = ["A", "B", "C", "D", "E"] as const;
const POSITIONS = [[0, 2.2], [1.65, 0], [1.65, 4.4], [3.3, 2.2], [4.95, 2.2]];
const EDGES = [
  ["A", "B", 1, 0.1], ["A", "C", 0, -0.85], ["B", "D", 0, 0.1],
  ["C", "D", 0, -0.85], ["D", "E", 1, 0.35],
] as const;
const FIT = [...VERTICES, ...VERTICES.map((v) => `d${v}`), "dist", "deque"];

function picture(
  dist: (number | undefined)[], deque: string[], done = "",
  front: string[] = [], back: string[] = [], stale = "",
): SceneMap {
  const scene: SceneMap = {};
  VERTICES.forEach((v, i) => {
    const cls = done.includes(v) ? "is-good" : dist[i] === undefined ? "is-out" : "is-active";
    scene[v] = { cls };
    scene[`d${v}`] = { text: dist[i] ?? "∞", cls };
    scene[`q${i}`] = {
      text: deque[i] ?? (i === 0 ? "∅" : ""),
      o: i === 0 || i < deque.length ? 1 : 0,
      cls: deque[i] === stale ? "is-bad" : i === 0 ? (deque.length === 0 ? "is-out" : "is-active") : "",
    };
  });
  EDGES.forEach(([a, b]) => {
    const id = a + b;
    const cls = front.includes(id) ? "v-eq" : back.includes(id) ? "v-lt" : "";
    scene[id] = cls ? { p: 1, cls, from: { p: 0 }, dur: 420 } : { p: 1, o: 0.48 };
    scene[`w${id}`] = { cls };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "shortest-path", slug: "zero-one-bfs",
  title: { vi: "BFS 0-1", en: "0-1 BFS" },
  added: "2026-11-27",
  summary: {
    vi: "Với cạnh chỉ nặng 0 hoặc 1, dùng deque để luôn lấy khoảng cách nhỏ nhất ở đầu hàng.",
    en: "With edge weights of only 0 or 1, use a deque to keep the smallest distance at the front.",
  },
  level: "medium", minutes: 9, time: "O(V + E)", memory: "O(V + E)",
  goal: { vi: "Tính khoảng cách từ <b>A</b> khi mỗi cạnh nặng <b>0 hoặc 1</b>", en: "Find distances from <b>A</b> with edge weights of <b>0 or 1</b>" },
  codeLang: "C++17",
  code: [
    'vector&lt;<span class="kw">int</span>&gt; dist(n, INT_MAX);',
    'deque&lt;pair&lt;<span class="kw">int</span>, <span class="kw">int</span>&gt;&gt; q;',
    'dist[s] = 0; q.emplace_front(0, s);',
    '<span class="kw">while</span> (!q.empty()) {',
    '  <span class="kw">auto</span> [d, u] = q.front(); q.pop_front();',
    '  <span class="kw">if</span> (d != dist[u]) <span class="kw">continue</span>;',
    '  <span class="kw">for</span> (<span class="kw">auto</span> [v, w] : adj[u]) {',
    '    <span class="kw">if</span> (d + w &gt;= dist[v]) <span class="kw">continue</span>;',
    '    dist[v] = d + w;',
    '    <span class="kw">if</span> (w == 0) q.emplace_front(dist[v], v);',
    '    <span class="kw">else</span> q.emplace_back(dist[v], v);',
    '  }',
    '}',
  ],
  watch: [
    { key: "u", label: "u" },
    { key: "d", label: "d" },
    { key: "change", label: { vi: "cập nhật", en: "update" } },
  ],
  practice: [
    { src: "Codeforces 1063B", name: "Labyrinth", lv: "★★★", url: "https://codeforces.com/contest/1063/problem/B" },
    { src: "LeetCode 2290", name: "Minimum Obstacle Removal to Reach Corner", lv: "★★★", url: "https://leetcode.com/problems/minimum-obstacle-removal-to-reach-corner/" },
  ],
  sceneOptions: { unit: 49 },
  legend: [
    { cls: "dim", label: { vi: "chưa tới", en: "unreached" } },
    { cls: "acc", label: { vi: "đang chờ", en: "queued" } },
    { cls: "ac", label: { vi: "đã chốt / thêm đầu", en: "settled / push front" } },
    { cls: "tle", label: { vi: "thêm cuối", en: "push back" } },
    { cls: "wa", label: { vi: "mục cũ", en: "stale entry" } },
  ],
  steps: [
    {
      title: { vi: "Cạnh miễn phí", en: "Some edges are free" }, kind: "problem",
      body: {
        vi: "Mỗi cạnh đi được hai chiều, với giá 0 hoặc 1. Từ A tới B, đi thẳng tốn 1, còn A → C → D → B tốn 0. BFS thường đếm cạnh nên sẽ chọn đường đi thẳng. Dijkstra tính đúng nhưng phải dùng min-heap.",
        en: "Each edge goes both ways and costs 0 or 1. A → B costs 1, while A → C → D → B costs 0. Ordinary BFS counts edges and would take the direct route. Dijkstra gets the distances right with a min-heap.",
      },
      lines: [], watch: {}, verdict: "run", fit: FIT, scene: picture([], []),
    },
    {
      title: { vi: "Dùng hàng đợi hai đầu", en: "Start with a deque" }, kind: "concept",
      body: {
        vi: "Đặt <code>dist[A] = 0</code> và đưa A:0 vào <code>q</code>. Ta lấy mục ở bên trái. Deque cho phép đưa mục mới vào cả đầu lẫn cuối hàng trong O(1).",
        en: "Set <code>dist[A] = 0</code> and put A:0 into <code>q</code>. Pop from the left. A deque lets us insert at either end in O(1).",
      },
      lines: [1, 2, 3], watch: {}, verdict: "run", fit: FIT, scene: picture([0], ["A:0"]),
    },
    {
      title: { vi: "Cạnh 1 vào cuối", en: "Weight 1 goes back" }, kind: "step",
      body: {
        vi: "Lấy A:0 ra và xét cạnh A–B trước. Giá mới là <code>0 + 1 = 1</code>, nên ghi <code>dist[B] = 1</code> rồi thêm B:1 vào cuối deque.",
        en: "Pop A:0 and inspect A–B first. The new cost is <code>0 + 1 = 1</code>, so set <code>dist[B] = 1</code> and append B:1 to the deque.",
      },
      lines: [5, 7, 8, 9, 11], watch: { u: "A", d: 0, change: "B:1" }, verdict: "run", fit: FIT,
      scene: picture([0, 1], ["B:1"], "A", [], ["AB"]),
    },
    {
      title: { vi: "Cạnh 0 vào đầu", en: "Weight 0 goes front" }, kind: "step",
      body: {
        vi: "Cạnh A–C cho giá <code>0 + 0 = 0</code>. Thêm C:0 vào đầu, trước B:1. C được lấy ra trước dù được tìm thấy sau B.",
        en: "A–C gives a cost of <code>0 + 0 = 0</code>. Push C:0 to the front, ahead of B:1. C will be popped first even though we found it after B.",
      },
      lines: [7, 8, 9, 10], watch: { u: "A", d: 0, change: "C:0" }, verdict: "run", fit: FIT,
      scene: picture([0, 1, 0], ["C:0", "B:1"], "A", ["AC"]),
    },
    {
      title: { vi: "Đi tiếp với giá 0", en: "Keep going at cost 0" }, kind: "step",
      body: {
        vi: "Lấy C:0 ra. Cạnh C–D cũng nặng 0, nên cập nhật <code>dist[D] = 0</code>. D:0 vào đầu deque và lại đứng trước B:1.",
        en: "Pop C:0. The C–D edge also weighs 0, so set <code>dist[D] = 0</code>. D:0 goes to the front, ahead of B:1 again.",
      },
      lines: [5, 7, 8, 9, 10], watch: { u: "C", d: 0, change: "D:0" }, verdict: "run", fit: FIT,
      scene: picture([0, 1, 0, 0], ["D:0", "B:1"], "AC", ["CD"]),
    },
    {
      title: { vi: "Đẩy vào hai đầu", en: "Push at both ends" }, kind: "step",
      body: {
        vi: "Từ D:0, cạnh D–B cho giá <code>0 &lt; 1</code>, nên thêm B:0 ở đầu. Cạnh D–E nặng 1 nên đưa E:1 vào cuối, sau mục cũ B:1.",
        en: "From D:0, the D–B edge gives <code>0 &lt; 1</code>, so push B:0 to the front. D–E weighs 1, so append E:1 behind the old B:1 entry.",
      },
      lines: [5, 7, 8, 9, 10, 11], watch: { u: "D", d: 0, change: "B:0, E:1" }, verdict: "run", fit: FIT,
      scene: picture([0, 0, 0, 0, 1], ["B:0", "B:1", "E:1"], "ACD", ["BD"], ["DE"], "B:1"),
    },
    {
      title: { vi: "Bỏ giá cũ của B", en: "Skip B’s old cost" }, kind: "step",
      body: {
        vi: "B:0 ra trước và chốt <code>dist[B] = 0</code>. Lần lấy kế tiếp gặp B:1. Vì 1 khác <code>dist[B]</code>, ta bỏ qua mục này và chỉ còn E:1.",
        en: "B:0 comes out first and settles <code>dist[B] = 0</code>. The next pop gets B:1. Since 1 differs from <code>dist[B]</code>, skip that entry, leaving E:1.",
      },
      lines: [4, 5, 6, 8], watch: { u: "B", d: 1 }, verdict: "run", fit: FIT,
      scene: picture([0, 0, 0, 0, 1], ["E:1"], "ABCD"),
    },
    {
      title: { vi: "Chốt E ở 1", en: "Settle E at 1" }, kind: "answer",
      body: {
        vi: "Lấy E:1 và deque cạn. B, C, D đều tới được với giá 0. Muốn tới E phải qua cạnh D–E nặng 1, nên <code>dist[E] = 1</code>.",
        en: "Pop E:1 and the deque is empty. B, C, and D are all reachable at cost 0. Getting to E requires the weight-1 edge D–E, so <code>dist[E] = 1</code>.",
      },
      lines: [4, 5, 6, 8], watch: { u: "E", d: 1 }, verdict: "ac", fit: FIT,
      scene: picture([0, 0, 0, 0, 1], [], "ABCDE"),
    },
    {
      title: { vi: "Giữ thứ tự khoảng cách", en: "Keep distances in order" }, kind: "recap",
      body: {
        vi: "Khi lấy mục có giá <code>d</code>, các mục còn lại chỉ có giá <code>d</code> hoặc <code>d + 1</code>. Thêm giá <code>d</code> vào đầu và <code>d + 1</code> vào cuối giúp mục nhỏ nhất luôn ở đầu, nên lần lấy hợp lệ đầu tiên chốt được đỉnh như Dijkstra. Duyệt cạnh một lần theo mỗi chiều và thao tác deque O(1), tổng O(V + E).",
        en: "When an entry of cost <code>d</code> is popped, remaining entries cost <code>d</code> or <code>d + 1</code>. Pushing <code>d</code> to the front and <code>d + 1</code> to the back keeps the minimum first, so the first valid pop settles a vertex as in Dijkstra. Scan each edge once per direction with O(1) deque operations, for O(V + E) total time.",
      },
      lines: [4, 5, 6, 9, 10, 11], watch: {}, verdict: "ac", fit: FIT,
      scene: picture([0, 0, 0, 0, 1], [], "ABCDE"),
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
  scene.add("deque", { shape: shapes.pill({ text: "deque", h: 23, pad: 5 }), x: -0.4, y: 9.5 });
  EDGES.forEach(([from, to, weight, bend]) => {
    const id = from + to;
    scene.link(id, { from, to, bend });
    scene.add(`w${id}`, { shape: shapes.pill({ text: weight, h: 19, pad: 5 }), follow: id });
  });
}
