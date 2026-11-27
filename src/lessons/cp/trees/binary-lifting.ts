import type { Lesson, SceneMap } from "../../../lib/types";

const PARENT = [0, 0, 1, 2, 3, 4, 5, 3];
const VERTICES = [1, 2, 3, 4, 5, 6, 7];
const POSITIONS = [[0, 0], [1.15, 0], [2.3, 0], [3.45, 0], [4.6, 0], [5.75, 0], [3.45, 1.65]];
const UP = [PARENT];
for (let k = 1; k <= 2; k++) {
  const previous = UP[k - 1];
  UP.push(previous.map((ancestor) => previous[ancestor]));
}

const TREE = VERTICES.map((v) => `v${v}`);
const TABLE = [
  ...TREE, ...VERTICES.map((v) => `column${v}`),
  ...UP.flatMap((_, k) => [`row${k}`, ...VERTICES.map((v) => `up-${k}-${v}`)]),
];
const active = { cls: "is-active" };
const good = { cls: "is-good" };

function picture(rows: number, marks: SceneMap = {}): SceneMap {
  const showTable = rows > 0 ? 1 : 0;
  return {
    ...marks,
    ...Object.fromEntries(VERTICES.map((v) => [`column${v}`, { o: showTable }])),
    ...Object.fromEntries(UP.flatMap((row, k) => [
      [`row${k}`, { o: showTable }],
      ...VERTICES.map((v) => {
        const id = `up-${k}-${v}`;
        return [id, { o: showTable, text: k < rows ? String(row[v]) : "?", ...marks[id] }];
      }),
    ])),
  };
}

const result = {
  v1: good, v2: active, "up-2-6": active, "up-0-2": good,
  "edge2": { cls: "v-eq" },
};

export const lesson: Lesson = {
  track: "cp",
  topic: "trees",
  slug: "binary-lifting",
  title: { vi: "Nhảy nhị phân", en: "Binary lifting" },
  added: "2026-11-27",
  summary: {
    vi: "Tính trước các bước nhảy dài 1, 2, 4, … cạnh để tìm tổ tiên thứ d của một đỉnh.",
    en: "Precompute jumps of 1, 2, 4, … edges to find a vertex’s d-th ancestor.",
  },
  level: "medium",
  minutes: 8,
  time: "O((n + q) log n)",
  memory: "O(n log n)",
  goal: { vi: "Tìm tổ tiên thứ <b>5</b> của đỉnh <b>6</b>", en: "Find the <b>5th</b> ancestor of vertex <b>6</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> LOG = 1;',
    '<span class="kw">while</span> ((1LL &lt;&lt; LOG) &lt;= n) ++LOG;',
    'vector&lt;vector&lt;<span class="kw">int</span>&gt;&gt; up(LOG, vector&lt;<span class="kw">int</span>&gt;(n + 1));',
    'up[0] = parent;',
    '<span class="kw">for</span> (<span class="kw">int</span> k = 1; k &lt; LOG; ++k)',
    '  <span class="kw">for</span> (<span class="kw">int</span> v = 1; v &lt;= n; ++v)',
    '    up[k][v] = up[k-1][up[k-1][v]];',
    '',
    '<span class="kw">auto</span> ancestor = [&amp;](<span class="kw">int</span> v, <span class="kw">int</span> d) {',
    '  <span class="kw">if</span> (d &gt;= n) <span class="kw">return</span> -1;',
    '  <span class="kw">for</span> (<span class="kw">int</span> k = LOG - 1; k &gt;= 0; --k)',
    '    <span class="kw">if</span> ((d &gt;&gt; k) &amp; 1) v = up[k][v];',
    '  <span class="kw">return</span> v ? v : -1;',
    '};',
  ],
  watch: [
    { key: "v", label: "v" },
    { key: "d", label: "d" },
    { key: "entry", label: { vi: "ô trong bảng", en: "table entry" } },
  ],
  practice: [
    { src: "CSES 1687", name: "Company Queries I", lv: "★★☆", url: "https://cses.fi/problemset/task/1687" },
    { src: "LeetCode 1483", name: "Kth Ancestor of a Tree Node", lv: "★★★", url: "https://leetcode.com/problems/kth-ancestor-of-a-tree-node/" },
  ],
  sceneOptions: { unit: 51, view: [-81, -124, 470, 298] },
  legend: [
    { cls: "acc", label: { vi: "đỉnh hoặc ô đang xét", en: "current vertex or entry" } },
    { cls: "ac", label: { vi: "ô vừa tính hoặc kết quả", en: "new entry or result" } },
  ],
  entrance: TREE,
  steps: [
    {
      title: { vi: "Tìm tổ tiên thứ 5", en: "Find the fifth ancestor" }, kind: "problem",
      body: {
        vi: "Cây có gốc 1 ở bên trái. Từ đỉnh 6, ta cần đi lên đúng 5 cạnh. Nếu lần theo cha từng cạnh, một truy vấn trên cây dạng dây có thể tốn O(n).",
        en: "The tree is rooted at 1 on the left. Starting at vertex 6, we need to climb exactly 5 edges. Following one parent at a time can take O(n) per query on a chain.",
      },
      lines: [], watch: { v: 6, d: 5 }, verdict: "run", fit: TREE,
      scene: picture(0, { v6: active }),
    },
    {
      title: { vi: "Ghi lại các đỉnh cha", en: "Record each parent" }, kind: "concept",
      body: {
        vi: "Hàng <code>up[0]</code> lưu cha của từng đỉnh, tức tổ tiên cách 2⁰ = 1 cạnh. <code>up[0][6] = 5</code>. Dùng 0 cho tổ tiên không tồn tại và đặt <code>parent[0] = parent[1] = 0</code>.",
        en: "Row <code>up[0]</code> stores each parent, the ancestor 2⁰ = 1 edge away. <code>up[0][6] = 5</code>. Use 0 for a missing ancestor and set <code>parent[0] = parent[1] = 0</code>.",
      },
      lines: [1, 2, 3, 4], watch: { v: 6, entry: "up[0][6] = 5" }, verdict: "run", fit: TABLE,
      scene: picture(1, { v6: active, "up-0-6": good }),
    },
    {
      title: { vi: "Ghép hai bước 1", en: "Combine two one-edge jumps" }, kind: "step",
      body: {
        vi: "Từ 6 lên cha là 5, rồi từ 5 lên cha là 4. Vậy <code>up[1][6] = up[0][up[0][6]] = up[0][5] = 4</code>. Điền các ô còn lại của hàng 1 theo cùng cách.",
        en: "From 6, climb to its parent 5, then to 5’s parent 4. So <code>up[1][6] = up[0][up[0][6]] = up[0][5] = 4</code>. Fill the rest of row 1 the same way.",
      },
      lines: [5, 6, 7], watch: { v: 6, entry: "up[1][6] = 4" }, verdict: "run", fit: TABLE,
      scene: picture(2, {
        v6: active, v4: good, "up-0-5": active, "up-0-6": active, "up-1-6": good,
        edge5: { cls: "v-eq" }, edge6: { cls: "v-eq" },
      }),
    },
    {
      title: { vi: "Nhân đôi độ dài", en: "Double the jump length" }, kind: "step",
      body: {
        vi: "Ghép hai bước dài 2 cạnh: từ 6 tới 4, rồi từ 4 tới 2. Ô <code>up[2][6] = up[1][4] = 2</code> lưu kết quả nhảy 4 cạnh. Tổng quát, hai bước dài 2ᵏ⁻¹ cạnh tạo thành một bước dài 2ᵏ cạnh.",
        en: "Combine two two-edge jumps: 6 to 4, then 4 to 2. Entry <code>up[2][6] = up[1][4] = 2</code> stores the four-edge result. In general, two jumps of 2ᵏ⁻¹ edges make one jump of 2ᵏ edges.",
      },
      lines: [5, 6, 7], watch: { v: 6, entry: "up[2][6] = 2" }, verdict: "run", fit: TABLE,
      scene: picture(3, {
        v6: active, v4: active, v2: good, "up-1-4": active, "up-1-6": active, "up-2-6": good,
      }),
    },
    {
      title: { vi: "Nhảy 4, bỏ qua 2", en: "Jump four, skip two" }, kind: "step",
      body: {
        vi: "<code>d = 5 = 101₂</code>. Bit 2 bật nên đọc <code>up[2][6] = 2</code> để nhảy từ 6 lên 2. Bit 1 tắt nên bỏ qua bước dài 2 cạnh.",
        en: "<code>d = 5 = 101₂</code>. Bit 2 is set, so read <code>up[2][6] = 2</code> to jump from 6 to 2. Bit 1 is clear, so skip the two-edge jump.",
      },
      lines: [9, 11, 12], watch: { v: 2, d: "101₂", entry: "up[2][6] = 2" }, verdict: "run", fit: TABLE,
      scene: picture(3, {
        v6: active, v2: { ...active, fx: "pulse" }, "up-2-6": active, "up-1-2": { cls: "is-out" },
        jump: { p: 1, cls: "v-eq", from: { p: 0 }, dur: 500, delay: 180 }, length: { o: 1 },
      }),
    },
    {
      title: { vi: "Nhảy nốt 1 cạnh", en: "Jump the last edge" }, kind: "answer",
      body: {
        vi: "Bit 0 bật nên tra <code>up[0][2] = 1</code> từ đỉnh 2 hiện tại. Hai bước 4 + 1 đưa ta lên đúng 5 cạnh, tới gốc 1.",
        en: "Bit 0 is set, so look up <code>up[0][2] = 1</code> from the current vertex 2. The two jumps cover exactly 4 + 1 = 5 edges and reach root 1.",
      },
      lines: [12, 13], watch: { v: 1, d: "101₂", entry: "up[0][2] = 1" }, verdict: "ac", fit: TABLE,
      scene: picture(3, { ...result, v1: { ...good, fx: { type: "hop", amp: 0.18, delay: 220 } } }),
    },
    {
      title: { vi: "Mỗi bit một bước", en: "One jump per set bit" }, kind: "recap",
      body: {
        vi: "Các bit bật cộng lại đúng bằng <code>d</code>, như 4 + 1 = 5, nên ta đi đủ số cạnh cần thiết. Nếu một bước nhảy vượt qua gốc, đỉnh 0 sẽ giữ nguyên cho tới cuối và hàm trả −1. Tạo bảng tốn O(n log n) thời gian và bộ nhớ, mỗi truy vấn tốn O(log n).",
        en: "The set bits add up to <code>d</code>, as in 4 + 1 = 5, so the jumps cover exactly the requested distance. If a jump passes the root, vertex 0 persists and the function returns −1. Building the table takes O(n log n) time and space, and each query takes O(log n).",
      },
      lines: [7, 10, 11, 12, 13], watch: { v: 1, d: 5, entry: "up[0][2] = 1" }, verdict: "ac", fit: TABLE,
      scene: picture(3, result),
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  VERTICES.forEach((v, i) => {
    const [x, y] = POSITIONS[i];
    scene.add(`v${v}`, { shape: shapes.block({ label: v, w: 41, h: 28, depth: 4 }), x, y });
  });
  VERTICES.slice(1).forEach((v) => {
    scene.link(`edge${v}`, { from: `v${PARENT[v]}`, to: `v${v}`, anchor: "center", bend: 0, p: 1 });
  });
  scene.link("jump", { from: "v6", to: "v2", bend: 1.05 });
  scene.add("length", { shape: shapes.pill({ text: "2² = 4", h: 22 }), follow: "jump", o: 0 });
  VERTICES.forEach((v, i) => {
    scene.add(`column${v}`, { shape: shapes.pill({ text: String(v), h: 22 }), x: i, y: 2.85, o: 0 });
  });
  UP.forEach((_, k) => {
    const y = 4.1 + 1.23 * k;
    scene.add(`row${k}`, { shape: shapes.pill({ text: `up[${k}]`, h: 24, pad: 8 }), x: -1.32, y, o: 0 });
    VERTICES.forEach((v, i) => {
      scene.add(`up-${k}-${v}`, { shape: shapes.block({ label: "?", w: 40, h: 25, depth: 3 }), x: i, y, o: 0 });
    });
  });
}
