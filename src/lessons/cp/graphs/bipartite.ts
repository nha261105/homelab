import type { Lesson, SceneMap } from "../../../lib/types";

const POSITIONS = [[0, 0], [2.65, 0], [2.65, 4], [0, 4], [4.15, 4]];
const EDGES = [[1, 2], [1, 4], [2, 3], [3, 4], [3, 5], [2, 4]];
const GROUP = [-1, 0, 1, 0, 1, 1];

function picture(colored: number[], queue: number[], checked: number[] = [], conflict = false, checking = false): SceneMap {
  const scene: SceneMap = { queue: { o: checking ? 1 : 0 } };
  POSITIONS.forEach((_, i) => {
    const v = i + 1;
    const color = colored.includes(v) ? GROUP[v] : -1;
    const cls = color === -1 ? "is-out" : color === 0 ? "is-active" : "is-good";
    scene[`v${v}`] = { cls, text: color === -1 ? String(v) : `${v}·${color}` };
  });
  EDGES.forEach((_, i) => {
    scene[`e${i}`] = { p: i === 5 && !conflict ? 0 : 1, cls: i === 5 ? "v-gt" : checked.includes(i) ? "v-eq" : "" };
  });
  for (let i = 0; i < 2; i++) {
    scene[`q${i}`] = {
      text: String(queue[i] ?? "—"), o: checking ? 1 : 0,
      cls: queue[i] === undefined ? "is-out" : "is-active",
    };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "graphs", slug: "bipartite",
  title: { vi: "Đồ thị hai phía", en: "Bipartite check" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng BFS để tô xen kẽ hai màu và phát hiện cạnh nối hai đỉnh cùng màu.",
    en: "Use BFS to alternate two colors and detect an edge joining vertices of the same color.",
  },
  level: "basic", minutes: 8, time: "O(V + E)", memory: "O(V)",
  goal: { vi: "Chia <b>5 đỉnh</b> thành hai nhóm sao cho mọi cạnh nối hai nhóm khác nhau", en: "Split <b>5 vertices</b> into two groups so each edge joins different groups" },
  codeLang: "C++17",
  code: [
    '<span class="kw">bool</span> bipartite(<span class="kw">const</span> vector&lt;vector&lt;int&gt;&gt;&amp; adj) {',
    '  <span class="kw">int</span> n = adj.size() - 1;',
    '  vector&lt;int&gt; color(n + 1, -1);',
    '  queue&lt;int&gt; q;',
    '  <span class="kw">for</span> (<span class="kw">int</span> s = 1; s &lt;= n; ++s) <span class="kw">if</span> (color[s] == -1) {',
    '    color[s] = 0; q.push(s);',
    '    <span class="kw">while</span> (!q.empty()) {',
    '      <span class="kw">int</span> u = q.front(); q.pop();',
    '      <span class="kw">for</span> (<span class="kw">int</span> v : adj[u]) {',
    '        <span class="kw">if</span> (color[v] == -1) { color[v] = 1 - color[u]; q.push(v); }',
    '        <span class="kw">else if</span> (color[u] == color[v]) <span class="kw">return false</span>;',
    '      }',
    '    }',
    '  }',
    '  <span class="kw">return true</span>;',
    '}',
  ],
  watch: [
    { key: "u", label: "u" },
    { key: "colors", label: { vi: "màu của 1…5", en: "colors of 1…5" } },
    { key: "ok", label: { vi: "chia được?", en: "bipartite?" } },
  ],
  practice: [
    { src: "LeetCode 785", name: "Is Graph Bipartite?", lv: "★★☆", url: "https://leetcode.com/problems/is-graph-bipartite/" },
    { src: "CSES 1668", name: "Building Teams", lv: "★★☆", url: "https://cses.fi/problemset/task/1668" },
  ],
  sceneOptions: { unit: 60, view: [-50, -110, 360, 330] },
  legend: [
    { cls: "dim", label: { vi: "chưa tô", en: "uncolored" } },
    { cls: "acc", label: { vi: "màu 0", en: "color 0" } },
    { cls: "ac", label: { vi: "màu 1", en: "color 1" } },
    { cls: "wa", label: { vi: "cạnh xung đột", en: "conflicting edge" } },
  ],
  steps: [
    {
      title: { vi: "Chia thành hai nhóm", en: "Split into two groups" }, kind: "problem",
      body: {
        vi: "Đồ thị vô hướng có 5 đỉnh. Ta muốn hai đầu của mỗi cạnh, chẳng hạn 1–2, thuộc hai nhóm khác nhau. Thử cả 2⁵ cách gán nhóm đã cần 32 lượt, và số cách tăng theo hàm mũ.",
        en: "This undirected graph has 5 vertices. Each edge, such as 1–2, must join different groups. Trying all 2⁵ assignments takes 32 attempts, and that number grows exponentially.",
      },
      lines: [3], watch: { colors: "– – – – –" }, verdict: "run", fit: "all", scene: picture([], []),
    },
    {
      title: { vi: "Chọn màu cho gốc", en: "Color the start vertex" }, kind: "concept",
      body: {
        vi: "Chọn màu 0 cho đỉnh 1 rồi đưa 1 vào hàng đợi <code>q</code>. Nhãn <code>1·0</code> ghi đỉnh 1 có màu 0, còn đỉnh chưa tô mang giá trị <code>−1</code> trong mã.",
        en: "Give vertex 1 color 0 and put it in queue <code>q</code>. The label <code>1·0</code> means vertex 1 has color 0, while uncolored vertices have value <code>−1</code> in the code.",
      },
      lines: [3, 5, 6], watch: { colors: "0 – – – –" }, verdict: "run", fit: "all",
      scene: picture([1], [1], [], false, true),
    },
    {
      title: { vi: "Tô láng giềng", en: "Color the neighbors" }, kind: "step",
      body: {
        vi: "Lấy <code>u = 1</code> khỏi hàng đợi. Hai láng giềng 2 và 4 chưa có màu, nên cả hai nhận màu <code>1 − 0 = 1</code> rồi vào hàng đợi.",
        en: "Pop <code>u = 1</code> from the queue. Its neighbors 2 and 4 are uncolored, so both get color <code>1 − 0 = 1</code> and enter the queue.",
      },
      lines: [8, 9, 10], watch: { u: 1, colors: "0 1 – 1 –" }, verdict: "run", fit: "all",
      scene: picture([1, 2, 4], [2, 4], [0, 1], false, true),
    },
    {
      title: { vi: "Đổi màu qua cạnh", en: "Alternate across edges" }, kind: "step",
      body: {
        vi: "Từ đỉnh 2 màu 1, ta tô đỉnh 3 màu 0. Sau đó khi lấy 4 ra, cạnh 4–3 đã có hai đầu khác màu, nên giữ nguyên màu của 3.",
        en: "From vertex 2 of color 1, give vertex 3 color 0. When 4 comes off the queue, edge 4–3 already joins different colors, so 3 keeps its color.",
      },
      lines: [8, 9, 10, 11], watch: { u: 4, colors: "0 1 0 1 –" }, verdict: "run", fit: "all",
      scene: picture([1, 2, 3, 4], [3], [2, 3], false, true),
    },
    {
      title: { vi: "Chốt hai nhóm", en: "Finish the two groups" }, kind: "answer",
      body: {
        vi: "Đỉnh 3 màu 0 tô đỉnh 5 màu 1. Sau khi xử lý 5, hàng đợi rỗng và cả 5 cạnh đều nối khác màu. Hai nhóm là <code>{1, 3}</code> và <code>{2, 4, 5}</code>.",
        en: "Vertex 3 of color 0 gives vertex 5 color 1. After processing 5, the queue is empty and all 5 edges join different colors. The groups are <code>{1, 3}</code> and <code>{2, 4, 5}</code>.",
      },
      lines: [10, 15], watch: { u: 5, colors: "0 1 0 1 1", ok: "true" }, verdict: "ac", fit: "all",
      scene: picture([1, 2, 3, 4, 5], [], [0, 1, 2, 3, 4], false, true),
    },
    {
      title: { vi: "Thêm cạnh xung đột", en: "Add a conflicting edge" }, kind: "answer",
      body: {
        vi: "Thêm cạnh 2–4 rồi chạy lại từ 1. Cả 2 và 4 buộc phải mang màu 1 vì đều kề với 1. Khi BFS xét cạnh 2–4, nó gặp hai đầu cùng màu và trả về <code>false</code>.",
        en: "Add edge 2–4 and rerun from 1. Both 2 and 4 must have color 1 because both touch 1. When BFS checks edge 2–4, it finds equal colors and returns <code>false</code>.",
      },
      lines: [8, 9, 11], watch: { u: 2, colors: "0 1 0 1 –", ok: "false" }, verdict: "ac", fit: "all",
      scene: { ...picture([1, 2, 3, 4], [4, 3], [], true, true), e5: { p: 1, cls: "v-gt", from: { p: 0 }, dur: 420 } },
    },
    {
      title: { vi: "Mỗi cạnh một ràng buộc", en: "Each edge imposes a constraint" }, kind: "recap",
      body: {
        vi: "Màu gốc có thể đổi, nhưng mỗi cạnh trên đường BFS buộc màu phải đảo. Tam giác 1–2–4–1 có ba cạnh nên đảo màu ba lần sẽ mâu thuẫn. Khởi động BFS ở mỗi thành phần chưa tô để kiểm tra cả đồ thị trong O(V + E) thời gian và O(V) bộ nhớ phụ.",
        en: "The starting color is arbitrary, but each BFS path edge forces a flip. Triangle 1–2–4–1 has three edges, so three flips force a contradiction. Start BFS in every uncolored component to check the graph in O(V + E) time and O(V) extra space.",
      },
      lines: [5, 10, 11, 15], watch: { u: 2, colors: "0 1 0 1 –", ok: "false" }, verdict: "ac", fit: "all",
      scene: picture([1, 2, 3, 4], [4, 3], [0, 1], true, true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  POSITIONS.forEach(([x, y], i) => {
    scene.add(`v${i + 1}`, { shape: shapes.block({ label: i + 1, w: 46, h: 34 }), x, y });
  });
  EDGES.forEach(([u, v], i) => {
    scene.link(`e${i}`, { from: `v${u}`, to: `v${v}`, anchor: "center", bend: 0 });
  });
  scene.add("queue", { shape: shapes.pill({ text: "q" }), x: 0.45, y: 5.7 });
  for (let i = 0; i < 2; i++) {
    scene.add(`q${i}`, { shape: shapes.block({ w: 35, h: 26 }), x: 1.25 + 0.75 * i, y: 5.7 });
  }
}
