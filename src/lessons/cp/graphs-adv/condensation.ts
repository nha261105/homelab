import type { Lesson, SceneMap } from "../../../lib/types";

const rooms = [
  { id: "A", coins: 2, group: 0, x: 0, y: 0 },
  { id: "B", coins: 3, group: 0, x: 0, y: 3.4 },
  { id: "C", coins: 4, group: 1, x: 2.05, y: 3.4 },
  { id: "D", coins: 1, group: 1, x: 3.65, y: 1.7 },
  { id: "E", coins: 2, group: 1, x: 3.65, y: 5.15 },
  { id: "F", coins: 6, group: 2, x: 5.5, y: 1.7 },
];
const tunnels = [
  ["A", "B", 1.4], ["B", "A", 1.4], ["B", "C", 0], ["A", "D", 0],
  ["C", "D", 0], ["D", "E", 0], ["E", "C", 0], ["D", "F", 0], ["A", "F", -1.9],
] as const;
const groups = [
  { x: 0, y: 2.6, members: "A B", coins: 5 },
  { x: 2.75, y: 2.6, members: "C D E", coins: 7 },
  { x: 5.5, y: 2.6, members: "F", coins: 6 },
];
const arcs = [[0, 1, 0], [0, 2, -1.8], [1, 2, 0]] as const;
const colors = ["is-good", "is-active", "is-bad"];
const roomFit = rooms.map(({ id }) => id);
const dagFit = groups.map((_, i) => `group${i}`);
const dpFit = [...dagFit, "dp", ...groups.map((_, i) => `dp${i}`)];

function original(markGroups = false): SceneMap {
  const scene: SceneMap = {};
  rooms.forEach(({ id, group }) => {
    scene[id] = { cls: markGroups ? colors[group] : "" };
  });
  tunnels.forEach((_, i) => { scene[`tunnel${i}`] = { p: 1 }; });
  groups.forEach((_, i) => { scene[`dp${i}`] = { text: "" }; });
  return scene;
}

function compressed(dp: number[] = [], focus: number[] = [], merge = false): SceneMap {
  const scene: SceneMap = { dp: { o: dp.length ? 1 : 0 } };
  rooms.forEach(({ id, group }) => {
    const { x, y } = groups[group];
    scene[id] = { x, y, s: 0.65, o: 0, dur: 480, cls: colors[group] };
  });
  tunnels.forEach((_, i) => { scene[`tunnel${i}`] = { p: 0, dur: 330 }; });
  groups.forEach((_, i) => {
    scene[`group${i}`] = {
      o: 1, cls: focus.includes(i) ? "is-active" : "",
      ...(merge ? { from: { o: 0, s: 0.75 }, delay: 340, dur: 380, ease: "back" } : {}),
    };
    scene[`dp${i}`] = {
      text: dp[i] ?? "", o: dp.length ? 1 : 0,
      cls: focus.at(-1) === i ? "is-good" : "",
      ...(focus.at(-1) === i ? { fx: { type: "pulse", delay: 260 } } : {}),
    };
  });
  arcs.forEach(([u, v], i) => {
    const active = focus[0] === u && focus[1] === v;
    scene[`arc${i}`] = {
      p: 1, cls: active ? "v-eq" : "", o: active || !focus.length ? 1 : 0.5,
      ...(merge || active ? { from: { p: 0 }, delay: merge ? 550 : 130, dur: 420 } : {}),
    };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "graphs-adv", slug: "condensation",
  title: { vi: "Đồ thị nén + DP", en: "Condensation graph + DP" },
  added: "2026-11-27",
  summary: {
    vi: "Gộp từng SCC thành một đỉnh để quy bài toán nhặt xu về DP trên DAG.",
    en: "Contract each SCC into one vertex to turn coin collection into a DAG DP.",
  },
  level: "hard", minutes: 10, time: "O(V + E)", memory: "O(V + E)",
  goal: { vi: "Nhặt nhiều xu nhất trong <b>6 phòng</b> nối bằng đường một chiều", en: "Collect the most coins in <b>6 rooms</b> connected by one-way tunnels" },
  codeLang: "C++17",
  code: [
    '<span class="cm">// comp[u]: SCC id from Kosaraju, in topological order</span>',
    'vector&lt;<span class="kw">long long</span>&gt; sum(k);',
    'vector&lt;vector&lt;int&gt;&gt; dag(k);',
    '<span class="kw">for</span> (int u = 0; u &lt; n; ++u) {',
    '  int a = comp[u]; sum[a] += coins[u];',
    '  for (int v : g[u]) {',
    '    int b = comp[v];',
    '    if (a != b) dag[a].push_back(b);',
    '  }',
    '}',
    '<span class="kw">auto</span> dp = sum;',
    '<span class="kw">for</span> (int a = 0; a &lt; k; ++a)',
    '  for (int b : dag[a]) dp[b] = max(dp[b], dp[a] + sum[b]);',
    '<span class="kw">long long</span> answer = *max_element(dp.begin(), dp.end());',
  ],
  watch: [
    { key: "edge", label: "a → b" }, { key: "dp", label: "dp[0..2]" },
    { key: "answer", label: { vi: "nhiều nhất", en: "maximum" } },
  ],
  practice: [
    { src: "CSES 1686", name: "Coin Collector", lv: "★★☆", url: "https://cses.fi/problemset/task/1686" },
    { src: "Codeforces 894E", name: "Ralph and Mushrooms", lv: "★★★", url: "https://codeforces.com/problemset/problem/894/E" },
  ],
  sceneOptions: { unit: 57 },
  legend: [
    { cls: "ac", label: { vi: "SCC 0 hoặc ô DP vừa cập nhật", en: "SCC 0 or updated DP entry" } },
    { cls: "acc", label: { vi: "SCC 1 hoặc đỉnh đang xét", en: "SCC 1 or vertex in focus" } },
    { cls: "wa", label: { vi: "SCC 2 trước khi nén", en: "SCC 2 before contraction" } },
  ],
  steps: [
    {
      title: { vi: "Nhặt xu qua các phòng", en: "Collect coins across rooms" }, kind: "problem",
      body: {
        vi: "Mỗi ô ghi tên phòng và số xu trong đó, chẳng hạn A có 2 xu. Ta có thể đi qua một phòng nhiều lần nhưng chỉ nhặt xu một lượt. Thử mọi hành trình sẽ mắc ở vòng A→B→A vì có thể quay vòng mãi.",
        en: "Each block shows a room and its coins, such as 2 coins in A. You can revisit a room but collect its coins only once. Enumerating walks runs into cycles such as A→B→A, which can repeat forever.",
      },
      lines: [], watch: {}, verdict: "run", fit: roomFit, scene: original(),
    },
    {
      title: { vi: "Cộng xu theo SCC", en: "Sum coins by SCC" }, kind: "concept",
      body: {
        vi: "Kosaraju gán SCC 0 cho A và B, SCC 1 cho C, D, E, và SCC 2 cho F. Trong SCC 1, ta có thể nhặt hết <code>4 + 1 + 2 = 7</code> xu rồi quay về D để đi tiếp tới F. Tương tự, SCC 0 có 5 xu, SCC 2 có 6 xu.",
        en: "Kosaraju labels A and B as SCC 0, C, D, and E as SCC 1, and F as SCC 2. Inside SCC 1, collect all <code>4 + 1 + 2 = 7</code> coins and then return to D to leave for F. SCC 0 has 5 coins and SCC 2 has 6.",
      },
      lines: [1, 2, 4, 5], watch: {}, verdict: "run", fit: roomFit, scene: original(true),
    },
    {
      title: { vi: "Thay nhóm bằng đỉnh", en: "Contract each group" }, kind: "step",
      body: {
        vi: "Thay mỗi SCC bằng một đỉnh mang tổng xu của nhóm. Giữ các cạnh nối hai nhóm, chẳng hạn B→C và A→D đều cho cạnh 0→1. Ta vẽ một mũi tên cho cặp này, còn code có thể giữ cả hai vì phép <code>max</code> cho cùng kết quả.",
        en: "Replace each SCC with one vertex carrying its coin total. Keep edges between groups: B→C and A→D both give 0→1. The diagram draws a single arrow for that pair, while the code can keep both because <code>max</code> gives the same result.",
      },
      note: {
        vi: "Nếu các nhóm nối thành một vòng, chúng đi được tới nhau và phải thuộc cùng một SCC.",
        en: "If groups formed a cycle, they would reach one another and belong to a single SCC.",
      },
      lines: [3, 6, 7, 8], watch: {}, verdict: "run", fit: dagFit, scene: compressed([], [], true),
    },
    {
      title: { vi: "Khởi tạo từ mỗi đỉnh", en: "Initialize at each vertex" }, kind: "step",
      body: {
        vi: "<code>dp[b]</code> là số xu lớn nhất khi kết thúc ở SCC <code>b</code>. Vì được xuất phát ở bất kỳ đâu, khởi tạo bằng <code>sum = [5, 7, 6]</code>. Nhãn của Kosaraju trong bài này đã theo thứ tự tô-pô 0, 1, 2.",
        en: "<code>dp[b]</code> is the most coins we can collect while ending at SCC <code>b</code>. Since we may start anywhere, initialize with <code>sum = [5, 7, 6]</code>. Kosaraju's labels here are already in topological order: 0, 1, 2.",
      },
      lines: [1, 11, 12], watch: { dp: "5, 7, 6" }, verdict: "run", fit: dpFit, scene: compressed([5, 7, 6]),
    },
    {
      title: { vi: "Lan DP từ 0", en: "Propagate from 0" }, kind: "step",
      body: {
        vi: "Qua 0→1, nâng <code>dp[1]</code> từ 7 lên <code>5 + 7 = 12</code>. Qua 0→2, nâng <code>dp[2]</code> từ 6 lên <code>5 + 6 = 11</code>.",
        en: "Along 0→1, raise <code>dp[1]</code> from 7 to <code>5 + 7 = 12</code>. Along 0→2, raise <code>dp[2]</code> from 6 to <code>5 + 6 = 11</code>.",
      },
      lines: [12, 13], watch: { edge: "0→1, 0→2", dp: "5, 12, 11" }, verdict: "run", fit: dpFit,
      scene: {
        ...compressed([5, 12, 11], [0, 1]),
        arc1: { p: 1, cls: "v-eq", from: { p: 0 }, delay: 380, dur: 400 },
        dp2: { text: 11, o: 1, cls: "is-good", delay: 500 },
      },
    },
    {
      title: { vi: "Chọn đường qua 1", en: "Choose the route via 1" }, kind: "answer",
      body: {
        vi: "Qua 1→2, <code>12 + 6 = 18</code> thắng 11, nên <code>dp[2] = 18</code>. Đó là giá trị lớn nhất trong ba ô, đạt được khi đi qua cả ba SCC theo thứ tự 0→1→2.",
        en: "Along 1→2, <code>12 + 6 = 18</code> beats 11, so <code>dp[2] = 18</code>. It is the largest of the three entries, reached by visiting all three SCCs in order 0→1→2.",
      },
      lines: [12, 13, 14], watch: { edge: "1→2", dp: "5, 12, 18", answer: 18 }, verdict: "ac", fit: dpFit,
      scene: compressed([5, 12, 18], [1, 2]),
    },
    {
      title: { vi: "Chốt theo thứ tự tô-pô", en: "Finish in topological order" }, kind: "recap",
      body: {
        vi: "Khi xử lý một SCC, mọi đỉnh có cạnh dẫn tới nó đều đã gửi giá trị DP. Trong đồ thị gốc, chẳng hạn A→B→C→D→E→C→D→F nhặt đủ 18 xu vì các phòng ghé lại không cho thêm xu. Tìm SCC, dựng DAG và chạy DP đều tốn tổng cộng O(V + E).",
        en: "When we process an SCC, all its predecessors have already sent their DP values. In the original graph, for example, A→B→C→D→E→C→D→F collects all 18 coins because revisited rooms give no more. Finding SCCs, building the DAG, and running DP cost O(V + E) in total.",
      },
      lines: [8, 11, 12, 13, 14], watch: { dp: "5, 12, 18", answer: 18 }, verdict: "ac", fit: dpFit,
      scene: {
        ...compressed([5, 12, 18], [2]),
        arc0: { p: 1, cls: "v-eq" },
        arc2: { p: 1, cls: "v-eq" },
      },
    },
  ],
};

export function setup(scene: any, shapes: any) {
  rooms.forEach(({ id, coins, x, y }) => {
    scene.add(id, { shape: shapes.block({ label: `${id} · ${coins}`, w: 53, h: 30, depth: 4 }), x, y });
  });
  tunnels.forEach(([from, to, bend], i) => {
    scene.link(`tunnel${i}`, { from, to, anchor: "center", arrow: true, bend });
  });
  groups.forEach(({ x, y, coins, members }, i) => {
    scene.add(`group${i}`, {
      shape: shapes.block({ label: `${i} · ${coins}`, sub: members, w: 62, h: 34, depth: 4 }), x, y, o: 0,
    });
    scene.add(`dp${i}`, { shape: shapes.block({ w: 40, h: 28, depth: 4 }), x, y: 5.5, o: 0 });
  });
  scene.add("dp", { shape: shapes.pill({ text: "dp", h: 22, pad: 6 }), x: -0.92, y: 5.42, o: 0 });
  arcs.forEach(([u, v, bend], i) => {
    scene.link(`arc${i}`, { from: `group${u}`, to: `group${v}`, anchor: "center", arrow: true, bend });
  });
}
