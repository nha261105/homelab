import type { Lesson, SceneMap } from "../../../lib/types";

const VERTICES = ["A", "B", "C", "D", "E"] as const;
const POSITIONS = [[0, 2.2], [1.65, 0], [1.65, 4.4], [3.3, 2.2], [4.95, 2.2]];
const EDGES = [
  ["A", "B", 0.1], ["A", "C", -0.85], ["B", "D", 0.1],
  ["C", "D", -0.85], ["D", "E", 0.35],
] as const;
const FIT = [...VERTICES, ...VERTICES.map((v) => `p${v}`), "parent", "queue"];
const BACKTRACK = ["E", "D", "B", "A"];

function picture(
  parents: string[], queue: string[], done = "",
  edges: string[] = [], showPath = false, trace = false,
): SceneMap {
  const scene: SceneMap = {};
  VERTICES.forEach((v, i) => {
    const value = parents[i] ?? "–";
    const pathIndex = showPath ? BACKTRACK.indexOf(v) : -1;
    scene[v] = { cls: done.includes(v) ? "is-good" : queue.includes(v) ? "is-active" : "is-out" };
    scene[`p${v}`] = {
      text: value, cls: pathIndex >= 0 ? "is-good" : value === "–" ? "is-out" : "",
      delay: trace && pathIndex >= 0 ? pathIndex * 200 : 0,
    };
    scene[`q${i}`] = {
      text: queue[i] ?? (i === 0 ? "∅" : ""),
      o: i === 0 || i < queue.length ? 1 : 0,
      cls: i === 0 && queue.length > 0 ? "is-active" : queue.length === 0 ? "is-out" : "",
    };
  });
  EDGES.forEach(([a, b]) => {
    const id = a + b;
    const pathIndex = showPath ? BACKTRACK.indexOf(b) : -1;
    if (pathIndex >= 0 && BACKTRACK[pathIndex + 1] === a) {
      scene[id] = {
        ends: [b, a], p: 1, cls: "v-eq",
        ...(trace ? { from: { p: 0 }, delay: pathIndex * 200, dur: 320 } : {}),
      };
    } else {
      scene[id] = edges.includes(id)
        ? { ends: [a, b], p: 1, cls: "v-eq", from: { p: 0 }, dur: 420 }
        : { ends: [a, b], p: 1, o: 0.4 };
    }
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "shortest-path", slug: "bfs-shortest",
  title: { vi: "Đường ngắn nhất không trọng số", en: "Unweighted shortest paths" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng BFS để đi theo từng lớp khoảng cách, rồi lần ngược mảng parent để dựng đường đi.",
    en: "Use BFS to visit vertices by distance, then retrace the path through the parent array.",
  },
  level: "basic", minutes: 8, time: "O(V + E)", memory: "O(V)",
  goal: { vi: "Tìm đường ít cạnh nhất từ <b>A</b> đến <b>E</b>", en: "Find a path with the fewest edges from <b>A</b> to <b>E</b>" },
  codeLang: "C++17",
  code: [
    'vector&lt;<span class="kw">int</span>&gt; parent(n, -1);',
    'queue&lt;<span class="kw">int</span>&gt; q;',
    'parent[s] = s; q.push(s);',
    '<span class="kw">while</span> (!q.empty()) {',
    '  <span class="kw">int</span> u = q.front(); q.pop();',
    '  <span class="kw">if</span> (u == t) <span class="kw">break</span>;',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[u]) <span class="kw">if</span> (parent[v] == -1) {',
    '    parent[v] = u; q.push(v);',
    '  }',
    '}',
    '<span class="kw">if</span> (parent[t] == -1) <span class="kw">return</span> {};',
    'vector&lt;<span class="kw">int</span>&gt; path{t};',
    '<span class="kw">while</span> (path.back() != s) path.push_back(parent[path.back()]);',
    'reverse(path.begin(), path.end()); <span class="kw">return</span> path;',
  ],
  watch: [
    { key: "u", label: "u" },
    { key: "q", label: "q" },
    { key: "length", label: { vi: "số cạnh", en: "edges" } },
  ],
  practice: [
    { src: "CSES 1667", name: "Message Route", lv: "★☆☆", url: "https://cses.fi/problemset/task/1667" },
    { src: "CSES 1193", name: "Labyrinth", lv: "★★☆", url: "https://cses.fi/problemset/task/1193" },
  ],
  sceneOptions: { unit: 49 },
  legend: [
    { cls: "dim", label: { vi: "chưa gặp", en: "undiscovered" } },
    { cls: "acc", label: { vi: "trong hàng đợi", en: "queued" } },
    { cls: "ac", label: { vi: "đã lấy ra", en: "dequeued" } },
    { cls: "wa", label: { vi: "giữ cha cũ", en: "parent already set" } },
  ],
  steps: [
    {
      title: { vi: "Đếm số cạnh", en: "Count the edges" }, kind: "problem",
      body: {
        vi: "Mỗi cạnh đi được hai chiều và tính là 1 bước. Ta cần tìm đường ít bước nhất từ A đến E. Liệt kê mọi đường đi đơn có thể tốn thời gian theo hàm mũ.",
        en: "Each edge goes both ways and costs one step. Find the fewest steps from A to E. Listing every simple path can take exponential time.",
      },
      lines: [], watch: {}, verdict: "run", fit: FIT, scene: picture([], []),
    },
    {
      title: { vi: "Bắt đầu từ A", en: "Start from A" }, kind: "concept",
      body: {
        vi: "Đưa A vào <code>q</code> và đặt <code>parent[A] = A</code> để đánh dấu gốc. Mỗi lần lấy đỉnh ở đầu hàng và thêm hàng xóm mới vào cuối hàng.",
        en: "Put A in <code>q</code> and set <code>parent[A] = A</code> to mark the root. Take vertices from the front and append newly discovered neighbors to the back.",
      },
      lines: [1, 2, 3], watch: { q: "[A]" }, verdict: "run", fit: FIT, scene: picture(["A"], ["A"]),
    },
    {
      title: { vi: "Tìm lớp thứ nhất", en: "Find the first layer" }, kind: "step",
      body: {
        vi: "Lấy A ra rồi thêm B và C. Cả hai cách A đúng 1 cạnh, nên ta ghi A vào hai ô <code>parent[B]</code> và <code>parent[C]</code>.",
        en: "Pop A and append B and C. Both are one edge from A, so write A into <code>parent[B]</code> and <code>parent[C]</code>.",
      },
      lines: [5, 7, 8], watch: { u: "A", q: "[B, C]" }, verdict: "run", fit: FIT,
      scene: picture(["A", "A", "A"], ["B", "C"], "A", ["AB", "AC"]),
    },
    {
      title: { vi: "Ghi cha của D", en: "Record D’s parent" }, kind: "step",
      body: {
        vi: "Từ B, ta gặp D lần đầu qua đường A → B → D dài 2 cạnh. Ghi <code>parent[D] = B</code> rồi đưa D vào sau C, đỉnh vẫn còn ở lớp 1.",
        en: "B discovers D along the two-edge route A → B → D. Set <code>parent[D] = B</code> and append D behind C, which is still in layer 1.",
      },
      lines: [5, 7, 8], watch: { u: "B", q: "[C, D]" }, verdict: "run", fit: FIT,
      scene: picture(["A", "A", "A", "B"], ["C", "D"], "AB", ["BD"]),
    },
    {
      title: { vi: "Giữ cha đầu tiên", en: "Keep the first parent" }, kind: "step",
      body: {
        vi: "Từ C cũng đến được D sau 2 cạnh. Vì <code>parent[D]</code> đã là B, ta giữ nguyên ô này và hàng đợi chỉ còn D.",
        en: "C also reaches D in two edges. Since <code>parent[D]</code> already holds B, leave it in place. Only D remains queued.",
      },
      lines: [5, 7], watch: { u: "C", q: "[D]" }, verdict: "run", fit: FIT,
      scene: { ...picture(["A", "A", "A", "B"], ["D"], "ABC"), CD: { ends: ["C", "D"], p: 1, cls: "v-gt" } },
    },
    {
      title: { vi: "Chạm tới E", en: "Reach E" }, kind: "step",
      body: {
        vi: "Lấy D ra, ghi <code>parent[E] = D</code> và thêm E vào hàng. Ngay sau đó E lên đầu hàng, nên lần lấy tiếp theo sẽ kết thúc BFS.",
        en: "Pop D, set <code>parent[E] = D</code>, and enqueue E. E is now at the front, so the next pop will end the BFS.",
      },
      lines: [5, 7, 8], watch: { u: "D", q: "[E]" }, verdict: "run", fit: FIT,
      scene: picture(["A", "A", "A", "B", "D"], ["E"], "ABCD", ["DE"]),
    },
    {
      title: { vi: "Lần ngược từ E", en: "Trace back from E" }, kind: "answer",
      body: {
        vi: "Khi lấy E ra, lần theo <code>parent</code> ta được E → D → B → A. Đảo lại thành A → B → D → E, đường đi gồm 3 cạnh.",
        en: "After popping E, follow <code>parent</code> to get E → D → B → A. Reverse it to obtain A → B → D → E, a path of three edges.",
      },
      lines: [5, 6, 12, 13, 14], watch: { u: "E", q: "∅", length: 3 }, verdict: "ac", fit: FIT,
      scene: picture(["A", "A", "A", "B", "D"], [], "ABCDE", [], true, true),
    },
    {
      title: { vi: "Duyệt theo từng lớp", en: "Search one layer at a time" }, kind: "recap",
      body: {
        vi: "Hàng đợi xử lý hết lớp 1 trước lớp 2, nên lần đầu gặp E ở lớp 3 đã cho đường ngắn nhất. Nếu <code>parent[E]</code> vẫn là −1 khi hàng cạn thì không có đường. Mỗi đỉnh vào hàng tối đa một lần và mỗi cạnh được xem tối đa hai lần, mất O(V + E) thời gian và O(V) bộ nhớ phụ.",
        en: "The queue processes all of layer 1 before layer 2, so reaching E in layer 3 gives a shortest path. If <code>parent[E]</code> is still −1 when the queue empties, E is unreachable. Each vertex enters once at most and each edge is checked at most twice, for O(V + E) time and O(V) extra space.",
      },
      lines: [4, 7, 8, 11], watch: { length: 3 }, verdict: "ac", fit: FIT,
      scene: picture(["A", "A", "A", "B", "D"], [], "ABCDE", [], true),
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  VERTICES.forEach((v, i) => {
    const [x, y] = POSITIONS[i];
    scene.add(v, { shape: shapes.block({ label: v, w: 47, h: 37 }), x, y, shadow: true });
    const slot = 0.85 + i * 1.04;
    scene.add(`p${v}`, { shape: shapes.block({ sub: v, w: 38, h: 26, depth: 4 }), x: slot, y: 7.25 });
    scene.add(`q${i}`, { shape: shapes.block({ w: 38, h: 26, depth: 4 }), x: slot, y: 9.8, o: 0 });
  });
  scene.add("parent", { shape: shapes.pill({ text: "parent", h: 23, pad: 5 }), x: -0.4, y: 6.97 });
  scene.add("queue", { shape: shapes.pill({ text: "q", h: 23, pad: 5 }), x: -0.4, y: 9.5 });
  EDGES.forEach(([from, to, bend]) => scene.link(from + to, { from, to, anchor: "center", bend }));
}
