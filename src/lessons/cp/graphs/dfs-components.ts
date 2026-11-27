import type { Lesson, SceneMap } from "../../../lib/types";

const U = 56;
const vertices = [1, 2, 3, 4, 5, 6, 7];
const positions = [[0, 0], [2, 0], [1, 3.1], [3.65, 0], [5.05, 2.1], [3.85, 4.3], [1, 5.8]];
const edges = [[1, 2], [1, 3], [2, 3], [4, 5], [5, 6]];
const classes = ["is-out", "is-active", "is-good", "is-bad"];
const vertexIds = vertices.map((u) => `v${u}`);

function picture(groups: number[], stack: number[] = [], skipped = ""): SceneMap {
  const scene: SceneMap = {};
  for (const u of vertices) {
    scene[`v${u}`] = {
      cls: classes[groups[u - 1] ?? 0],
      ...(u === stack.at(-1) ? { fx: { type: "hop", amp: 0.18, delay: 180 } } : {}),
    };
  }
  for (const [u, v] of edges) {
    const id = `e${u}-${v}`;
    const sameGroup = groups[u - 1] === groups[v - 1];
    const group = sameGroup ? groups[u - 1] ?? 0 : 0;
    scene[id] = { p: 1, o: group ? 1 : 0.44, cls: id === skipped ? "v-lt" : group === 2 ? "v-eq" : "" };
  }
  for (let i = 0; i < 3; i++) {
    scene[`s${i}`] = {
      text: String(stack[i] ?? "–"),
      cls: stack[i] ? (i === stack.length - 1 ? "is-active" : "") : "is-out",
    };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "graphs",
  slug: "dfs-components",
  title: { vi: "Đếm thành phần liên thông", en: "Counting components" },
  added: "2026-11-27",
  summary: {
    vi: "Mỗi lượt DFS từ một đỉnh chưa thăm tô trọn một thành phần liên thông.",
    en: "Each DFS from an unvisited vertex colors one whole connected component.",
  },
  level: "basic",
  minutes: 8,
  time: "O(n + m)",
  memory: "O(n) extra",
  goal: { vi: "Dùng DFS để đếm các nhóm liên thông trong đồ thị <b>7 đỉnh</b>", en: "Use DFS to count the connected groups in a <b>7-vertex</b> graph" },
  codeLang: "C++17",
  code: [
    '<span class="kw">vector</span>&lt;<span class="kw">int</span>&gt; comp(n + 1, 0);',
    '<span class="kw">int</span> count = 0;',
    '<span class="kw">auto</span> dfs = [&amp;](<span class="kw">auto</span>&amp;&amp; self, <span class="kw">int</span> u) -&gt; <span class="kw">void</span> {',
    '  comp[u] = count;',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[u])',
    '    <span class="kw">if</span> (comp[v] == 0) self(self, v);',
    '};',
    '<span class="kw">for</span> (<span class="kw">int</span> u = 1; u &lt;= n; ++u) {',
    '  <span class="kw">if</span> (comp[u] != 0) <span class="kw">continue</span>;',
    '  ++count;',
    '  dfs(dfs, u);',
    '}',
  ],
  watch: [
    { key: "u", label: { vi: "đỉnh đang xét", en: "current vertex" } },
    { key: "v", label: { vi: "láng giềng vừa xét", en: "last neighbor checked" } },
    { key: "count", label: "count" },
  ],
  practice: [
    { src: "CSES 1192", name: "Counting Rooms", lv: "★☆☆", url: "https://cses.fi/problemset/task/1192" },
    { src: "LeetCode 200", name: "Number of Islands", lv: "★★☆", url: "https://leetcode.com/problems/number-of-islands/" },
  ],
  sceneOptions: { unit: U, view: [-55, -95, 390, 360] },
  legend: [
    { cls: "dim", label: { vi: "chưa thăm", en: "unvisited" } },
    { cls: "acc", label: { vi: "nhóm 1", en: "group 1" } },
    { cls: "ac", label: { vi: "nhóm 2", en: "group 2" } },
    { cls: "wa", label: { vi: "nhóm 3", en: "group 3" } },
    { cls: "tle", label: { vi: "cạnh bỏ qua", en: "skipped edge" } },
  ],
  entrance: vertexIds,
  steps: [
    {
      title: { vi: "Đếm các nhóm", en: "Count connected groups" }, kind: "problem",
      body: {
        vi: "Đồ thị vô hướng có 7 đỉnh và 5 cạnh. Hai đỉnh cùng nhóm nếu có đường đi nối chúng. Nếu khởi động một lượt tìm kiếm ở từng đỉnh, ta sẽ duyệt lại các nhóm đã gặp.",
        en: "This undirected graph has 7 vertices and 5 edges. Two vertices belong to the same group if a path connects them. Starting a search from every vertex would revisit groups we have already found.",
      },
      lines: [1, 2], watch: { count: 0 }, verdict: "run", fit: "all", scene: picture([]),
    },
    {
      title: { vi: "Tô đỉnh đầu tiên", en: "Color the first vertex" }, kind: "concept",
      body: {
        vi: "Quét đỉnh theo thứ tự 1 đến 7. Đỉnh 1 chưa thăm, nên tăng <code>count</code> lên 1 và gọi DFS từ 1. Gán <code>comp[1] = 1</code> ngay khi vào lời gọi.",
        en: "Scan vertices from 1 to 7. Vertex 1 is unvisited, so set <code>count</code> to 1 and start DFS there. Assign <code>comp[1] = 1</code> as soon as the call begins.",
      },
      lines: [3, 4, 8, 9, 10, 11], watch: { u: 1, count: 1 }, verdict: "run", fit: "all",
      scene: picture([1], [1]),
    },
    {
      title: { vi: "Đi sâu theo cạnh", en: "Follow edges deeper" }, kind: "step",
      body: {
        vi: "Từ 1 đi đến 2, rồi từ 2 đến 3. Cả ba nhận màu nhóm 1, còn hàng <code>dfs</code> cho thấy các lời gọi đang chờ trở về theo thứ tự 3, 2, 1.",
        en: "Go from 1 to 2, then from 2 to 3. All three get group 1's color, and the <code>dfs</code> row shows that the active calls will return in order 3, 2, 1.",
      },
      lines: [4, 5, 6], watch: { u: 3, count: 1 }, verdict: "run", fit: "all",
      scene: picture([1, 1, 1], [1, 2, 3]),
    },
    {
      title: { vi: "Bỏ qua đỉnh đã tô", en: "Skip a colored vertex" }, kind: "step",
      body: {
        vi: "Từ 3 có cạnh về 1, nhưng <code>comp[1] = 1</code> nên DFS bỏ qua cạnh được tô nổi. Hai láng giềng của 3 đều đã thăm, nên lời gọi ở 3 kết thúc và trả về 2.",
        en: "Vertex 3 has an edge back to 1, but <code>comp[1] = 1</code>, so DFS skips the highlighted edge. Both neighbors of 3 have been visited, so its call finishes and returns to 2.",
      },
      lines: [5, 6, 7], watch: { u: 2, v: 1, count: 1 }, verdict: "run", fit: "all",
      scene: picture([1, 1, 1], [1, 2], "e1-3"),
    },
    {
      title: { vi: "Bắt đầu nhóm 2", en: "Start group 2" }, kind: "step",
      body: {
        vi: "Sau khi DFS từ 1 trở về, vòng ngoài bỏ qua 2 và 3 vì đã có màu. Đỉnh 4 còn trống, nên tăng <code>count</code> lên 2 rồi đi theo <code>4 → 5 → 6</code> và tô cả ba đỉnh màu mới.",
        en: "After DFS from 1 returns, the outer loop skips 2 and 3 because they are colored. Vertex 4 is still unvisited, so increment <code>count</code> to 2, then follow <code>4 → 5 → 6</code> and give those vertices a new color.",
      },
      lines: [4, 5, 6, 8, 9, 10, 11], watch: { u: 6, count: 2 }, verdict: "run", fit: "all",
      scene: picture([1, 1, 1, 2, 2, 2], [4, 5, 6]),
    },
    {
      title: { vi: "Tô cả đỉnh 7", en: "Color vertex 7 too" }, kind: "step",
      body: {
        vi: "Khi lượt DFS thứ hai xong, vòng ngoài bỏ qua 5 và 6 rồi gặp đỉnh 7 chưa thăm. Đỉnh 7 không có láng giềng, nhưng vẫn tạo thành một nhóm riêng, nên <code>count</code> tăng lên 3.",
        en: "After the second DFS finishes, the outer loop skips 5 and 6 and finds unvisited vertex 7. Vertex 7 has no neighbors, but it still forms a group of its own, so <code>count</code> rises to 3.",
      },
      lines: [4, 5, 8, 9, 10, 11], watch: { u: 7, count: 3 }, verdict: "run", fit: "all",
      scene: picture([1, 1, 1, 2, 2, 2, 3], [7]),
    },
    {
      title: { vi: "Có ba nhóm", en: "Three groups remain" }, kind: "answer",
      body: {
        vi: "Vòng quét đã hết. Ba màu ứng với ba thành phần <code>{1, 2, 3}</code>, <code>{4, 5, 6}</code> và <code>{7}</code>, nên đáp án là 3.",
        en: "The scan is complete. The three colors correspond to <code>{1, 2, 3}</code>, <code>{4, 5, 6}</code>, and <code>{7}</code>, so the answer is 3.",
      },
      lines: [8, 9, 10, 11, 12], watch: { count: 3 }, verdict: "ac", fit: "all",
      scene: picture([1, 1, 1, 2, 2, 2, 3]),
    },
    {
      title: { vi: "Mỗi nhóm một lượt", en: "One search per group" }, kind: "recap",
      body: {
        vi: "DFS đi đến mọi đỉnh có đường nối với đỉnh gốc, nên một lượt tô hết đúng một nhóm và vòng ngoài không đếm lại nhóm ấy. Mỗi đỉnh được tô một lần và mỗi cạnh vô hướng được xét từ hai đầu, nên thời gian là O(n + m). Mảng <code>comp</code> và ngăn xếp dùng thêm O(n) bộ nhớ.",
        en: "DFS reaches exactly the vertices connected by paths to its root, so one search colors a whole group and the outer loop skips it thereafter. Each vertex is colored once, and each undirected edge is examined from both endpoints, for O(n + m) time. The <code>comp</code> array and call stack use O(n) extra space.",
      },
      lines: [1, 4, 5, 6, 8, 9], watch: { count: 3 }, verdict: "ac", fit: "all",
      scene: picture([1, 1, 1, 2, 2, 2, 3]),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  vertices.forEach((u, i) => {
    const [x, y] = positions[i];
    scene.add(`v${u}`, { shape: shapes.block({ label: u, w: 45, h: 33 }), x, y, shadow: true });
  });
  for (const [u, v] of edges) {
    const [x1, y1] = positions[u - 1];
    const [x2, y2] = positions[v - 1];
    const bend = y2 === y1 ? -0.55 : -Math.abs(y2 - y1) * U / (8 * (14 + Math.abs(x2 - x1) * U * 0.08));
    scene.link(`e${u}-${v}`, { from: `v${u}`, to: `v${v}`, bend });
  }
  scene.add("stack", { shape: shapes.pill({ text: "dfs" }), x: 0.43, y: 8.25 });
  for (let i = 0; i < 3; i++) {
    scene.add(`s${i}`, { shape: shapes.block({ label: "–", w: 44, h: 32 }), x: 1.55 + i, y: 8.4 });
  }
}
