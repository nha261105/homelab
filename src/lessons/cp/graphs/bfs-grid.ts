import type { Lesson, SceneMap } from "../../../lib/types";

const U = 52;
const grid = ["SA#", "BCD", "#ET"];
const cells = grid.flatMap((row, r) => [...row].map((id, c) => ({ id: id === "#" ? `wall${r}` : id, r, c })));
const edges = ["SA", "SB", "AC", "BC", "CD", "CE", "DT", "ET"];
const order = ["S", "A", "B", "C", "D", "E", "T"];
const distance = [0, 1, 1, 2, 3, 3, 4];
const discovery = ["SA", "SB", "AC", "CD", "CE", "DT"];

function picture(done: string, queue: string, fresh = ""): SceneMap {
  const scene: SceneMap = {};
  for (const [i, id] of order.entries()) {
    const pending = queue.includes(id);
    const processed = done.includes(id);
    const newCell = fresh.includes(id);
    scene[id] = {
      text: pending || processed ? String(distance[i]) : "·",
      cls: pending ? "is-active" : processed ? "is-good" : "",
      ...(newCell ? { fx: { type: "hop", amp: 0.18, delay: 220 } } : {}),
    };
  }
  for (const id of edges) {
    const recorded = discovery.includes(id) && (done + queue).includes(id[1]);
    const newEdge = recorded && fresh.includes(id[1]);
    scene[id] = {
      p: 1, cls: newEdge ? "v-eq" : "",
      o: recorded ? 1 : 0.34,
      ...(newEdge ? { from: { p: 0 }, dur: 380 } : {}),
    };
  }
  for (let i = 0; i < 2; i++) {
    scene[`q${i}`] = {
      text: queue[i] ?? "–", cls: queue[i] ? "is-active" : "is-out",
    };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "graphs",
  slug: "bfs-grid",
  title: { vi: "BFS trên lưới", en: "BFS on a grid" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng hàng đợi để lan qua từng lớp khoảng cách trên lưới có tường.",
    en: "Use a queue to spread through distance layers on a grid with walls.",
  },
  level: "basic",
  minutes: 8,
  time: "O(nm)",
  memory: "O(nm)",
  goal: { vi: "Tìm số bước ít nhất từ <b>S</b> đến <b>T</b>", en: "Find the fewest moves from <b>S</b> to <b>T</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">vector</span>&lt;<span class="kw">vector</span>&lt;<span class="kw">int</span>&gt;&gt; dist(n, <span class="kw">vector</span>&lt;<span class="kw">int</span>&gt;(m, -1));',
    '<span class="kw">queue</span>&lt;<span class="kw">pair</span>&lt;<span class="kw">int</span>, <span class="kw">int</span>&gt;&gt; q;',
    'dist[sr][sc] = 0; q.push({sr, sc});',
    '<span class="kw">int</span> dr[] = {0, 1, 0, -1}, dc[] = {1, 0, -1, 0};',
    '<span class="kw">while</span> (!q.empty()) {',
    '  <span class="kw">auto</span> [r, c] = q.front(); q.pop();',
    '  <span class="kw">for</span> (<span class="kw">int</span> k = 0; k &lt; 4; ++k) {',
    '    <span class="kw">int</span> nr = r + dr[k], nc = c + dc[k];',
    '    <span class="kw">if</span> (nr &lt; 0 || nr &gt;= n || nc &lt; 0 || nc &gt;= m) <span class="kw">continue</span>;',
    '    <span class="kw">if</span> (grid[nr][nc] == \'#\' || dist[nr][nc] != -1) <span class="kw">continue</span>;',
    '    dist[nr][nc] = dist[r][c] + 1;',
    '    q.push({nr, nc});',
    '  }',
    '}',
  ],
  watch: [
    { key: "from", label: { vi: "vừa lấy ra", en: "just popped" } },
    { key: "layer", label: { vi: "lớp mới", en: "new layer" } },
    { key: "target", label: "dist[T]" },
  ],
  practice: [
    { src: "CSES 1193", name: "Labyrinth", lv: "★★☆", url: "https://cses.fi/problemset/task/1193" },
    { src: "LeetCode 994", name: "Rotting Oranges", lv: "★★☆", url: "https://leetcode.com/problems/rotting-oranges/" },
  ],
  sceneOptions: { unit: U, view: [-65, -90, 315, 310] },
  legend: [
    { cls: "acc", label: { vi: "trong hàng đợi", en: "queued" } },
    { cls: "ac", label: { vi: "đã xử lý", en: "processed" } },
    { cls: "wa", label: { vi: "tường", en: "wall" } },
  ],
  entrance: cells.map(({ id }) => id),
  steps: [
    {
      title: { vi: "Tìm đường ngắn nhất", en: "Find the shortest route" }, kind: "problem",
      body: {
        vi: "Từ S ở góc trên trái, đi đến T ở góc dưới phải bằng các bước ngang hoặc dọc, mỗi bước tốn 1. Lưới 3×3 có 2 ô tường và 7 ô đi được. Thử mọi đường có thể sẽ nhanh chóng lặp lại việc xét cùng một ô.",
        en: "Move from S in the top left to T in the bottom right, one horizontal or vertical step at a time. The 3×3 grid has 2 walls and 7 walkable cells. Trying every route quickly repeats work at the same cells.",
      },
      lines: [], watch: { target: -1 }, verdict: "run", fit: "all", scene: picture("", ""),
    },
    {
      title: { vi: "Đưa S vào hàng", en: "Enqueue the start" }, kind: "concept",
      body: {
        vi: "Gán khoảng cách của S bằng 0 rồi đưa S vào <code>q</code>. Ô chưa gặp có <code>dist = -1</code>, hiển thị bằng dấu chấm. Hàng đợi lấy ô từ bên trái và thêm ô mới vào bên phải.",
        en: "Set S's distance to 0 and put S in <code>q</code>. Unseen cells have <code>dist = -1</code> and show a dot. The queue pops from the left and pushes new cells on the right.",
      },
      lines: [1, 2, 3], watch: { layer: 0, target: -1 }, verdict: "run", fit: "all", scene: picture("", "S", "S"),
    },
    {
      title: { vi: "Lan ra lớp 1", en: "Spread to layer 1" }, kind: "step",
      body: {
        vi: "Lấy S ra, xét lần lượt phải, xuống, trái, lên. A bên phải và B bên dưới đều nhận khoảng cách <code>0 + 1 = 1</code>, nên hàng đợi thành <code>[A, B]</code>.",
        en: "Pop S and check right, down, left, then up. A on the right and B below both get distance <code>0 + 1 = 1</code>, leaving <code>[A, B]</code> in the queue.",
      },
      lines: [4, 6, 7, 8, 9, 10, 11, 12], watch: { from: "S", layer: 1, target: -1 }, verdict: "run", fit: "all",
      scene: picture("S", "AB", "AB"),
    },
    {
      title: { vi: "Chỉ thêm C một lần", en: "Enqueue C only once" }, kind: "step",
      body: {
        vi: "A gặp tường bên phải và tìm thấy C bên dưới, nên gán C khoảng cách 2 rồi thêm vào sau B. Khi lấy B ra, B cũng kề C nhưng <code>dist[C] = 2</code> đã được gán, nên hàng đợi chỉ còn một C.",
        en: "A sees a wall to the right and finds C below, so it assigns C distance 2 and enqueues it behind B. When B comes out, it also sees C, but <code>dist[C] = 2</code> is already set, so only one C remains in the queue.",
      },
      note: { vi: "Gán khoảng cách ngay lúc đưa vào hàng đợi để mỗi ô chỉ vào hàng một lần.", en: "Assign distance on enqueue so each cell enters the queue once." },
      lines: [6, 9, 10, 11, 12], watch: { from: "A, B", layer: 2, target: -1 }, verdict: "run", fit: "all",
      scene: picture("SAB", "C", "C"),
    },
    {
      title: { vi: "Mở rộng lớp 3", en: "Expand to layer 3" }, kind: "step",
      body: {
        vi: "Từ C, tìm thấy D bên phải rồi E bên dưới. Cả hai nhận khoảng cách <code>2 + 1 = 3</code>, nên <code>q = [D, E]</code>.",
        en: "From C, discover D to the right and then E below. Both get distance <code>2 + 1 = 3</code>, so <code>q = [D, E]</code>.",
      },
      lines: [6, 10, 11, 12], watch: { from: "C", layer: 3, target: -1 }, verdict: "run", fit: "all",
      scene: picture("SABC", "DE", "DE"),
    },
    {
      title: { vi: "Chạm đích ở lớp 4", en: "Reach T in layer 4" }, kind: "answer",
      body: {
        vi: "Lấy D ra trước E và gặp T ở ngay bên dưới D. Gán <code>dist[T] = 3 + 1 = 4</code>. Đường <code>S → A → C → D → T</code> có đúng 4 bước.",
        en: "Pop D before E and discover T directly below D. Set <code>dist[T] = 3 + 1 = 4</code>. The route <code>S → A → C → D → T</code> takes exactly 4 moves.",
      },
      lines: [6, 11, 12], watch: { from: "D", layer: 4, target: 4 }, verdict: "ac", fit: "all",
      scene: picture("SABCD", "ET", "T"),
    },
    {
      title: { vi: "Khoảng cách tăng dần", en: "Distances never decrease" }, kind: "recap",
      body: {
        vi: "E và T không thêm ô nào mới. Hàng đợi lấy hết lớp 3 trước khi lấy lớp 4, nên lần đầu gặp T ở lớp 4 đã cho đường ngắn nhất. Mỗi ô vào hàng nhiều nhất một lần và có tối đa 4 láng giềng, nên thời gian và bộ nhớ đều là O(nm).",
        en: "E and T enqueue no new cells. The queue finishes popping layer 3 before layer 4, so the first discovery of T in layer 4 gives a shortest route. Each cell is queued at most once and has up to 4 neighbors, giving O(nm) time and space.",
      },
      lines: [5, 6, 7, 10, 11, 12], watch: { from: "E, T", target: 4 }, verdict: "ac", fit: "all",
      scene: picture("SABCDET", ""),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const { id, r, c } of cells) {
    const wall = id.startsWith("wall");
    scene.add(id, {
      shape: shapes.block({ label: wall ? "#" : "·", sub: wall ? "" : id, w: 47, h: 36 }),
      x: c * 1.58, y: r * 2.35, cls: wall ? "is-bad" : "", shadow: true,
    });
  }
  for (const id of edges) {
    scene.link(id, { from: id[0], to: id[1], bend: id === "SA" || id === "BC" || id === "CD" || id === "ET" ? -0.6 : 0 });
  }
  scene.add("queue", { shape: shapes.pill({ text: "q" }), x: 0, y: 7.25 });
  for (let i = 0; i < 2; i++) {
    scene.add(`q${i}`, { shape: shapes.block({ label: "–", w: 44, h: 32 }), x: 1.08 + i, y: 7.4 });
  }
}
