import type { Lesson, SceneMap } from "../../../lib/types";

type Stats = [sum: number, pref: number, suff: number, best: number];

const A = [-2, 4, 3, -5];
const nodes = [
  { range: "[0,3]", x: 0, level: 0 },
  { range: "[0,1]", x: -1.34, level: 1 },
  { range: "[2,3]", x: 1.34, level: 1 },
  { range: "0", x: -2.02, level: 2 },
  { range: "1", x: -0.66, level: 2 },
  { range: "2", x: 0.66, level: 2 },
  { range: "3", x: 2.02, level: 2 },
];
const leaf = (x: number): Stats => {
  const b = Math.max(0, x);
  return [x, b, b, b];
};
function merge(L: Stats, R: Stats): Stats {
  return [
    L[0] + R[0],
    Math.max(L[1], L[0] + R[1]),
    Math.max(R[2], R[0] + L[2]),
    Math.max(L[3], R[3], L[2] + R[1]),
  ];
}

const leaves = A.map(leaf);
const left = merge(leaves[0], leaves[1]);
const right = merge(leaves[2], leaves[3]);
const root = merge(left, right);
const newLeaf = leaf(-1);
const newLeft = merge(leaves[0], newLeaf);
const newRoot = merge(newLeft, right);

const FIELDS = "sum · pref · suff · best";
const U = 58;
const sceneOptions: NonNullable<Lesson["sceneOptions"]> & { pad: number } = {
  unit: U, pad: 12, view: [-175, -115, 350, 405],
};
const ROW = 2.65;
const fit = ["fields", ...nodes.map((_, i) => `v${i + 1}`), "formulaBounds"];
const signed = (x: number) => String(x).replace("-", "−");
const tuple = (stats: Stats, count = 4) => stats.map((x, i) => i < count ? signed(x) : "?").join("·");

function tree({
  pairs = false, fields = false, rootCount = 0, update = false, active = [], good = [],
  edges = [], formula = "", extra = "", answer = false,
}: {
  pairs?: boolean; fields?: boolean; rootCount?: number; update?: boolean; active?: number[];
  good?: number[]; edges?: number[]; formula?: string; extra?: string; answer?: boolean;
} = {}): SceneMap {
  const labels = [
    tuple(update ? newRoot : root, rootCount), tuple(update ? newLeft : left), tuple(right),
    ...A.map((x, i) => signed(update && i === 1 ? newLeaf[0] : x)),
  ];
  const first = rootCount ? 1 : pairs ? 2 : 4;
  const scene: SceneMap = { fields: { o: fields ? 1 : 0 } };
  nodes.forEach((_, i) => {
    const v = i + 1;
    scene[`v${v}`] = {
      text: labels[i], o: v >= first ? 1 : 0,
      cls: good.includes(v) ? "is-good" : active.includes(v) ? "is-active" : "",
    };
    if (v > 1) scene[`e${v}`] = {
      p: (v >> 1) >= first ? 1 : 0, o: edges.includes(v) ? 1 : 0.42,
      ...(edges.includes(v) ? { cls: "v-eq", from: { p: 0 }, dur: 360 } : {}),
    };
  });
  for (const [id, text] of [["calc", formula], ["extra", extra]]) {
    scene[id] = {
      text, o: text ? 1 : 0, cls: answer ? "v-eq" : "",
      ...(text ? { from: { o: 0, s: 0.86 }, dur: 360, ease: "back" } : {}),
    };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "segtree-adv",
  slug: "segtree-merge",
  title: { vi: "Nút lưu nhiều thông tin", en: "Nodes that store more" },
  added: "2026-11-27",
  summary: {
    vi: "Gộp bốn giá trị ở mỗi nút để tìm tổng đoạn con lớn nhất sau mỗi lần đổi một phần tử.",
    en: "Merge four values per node to maintain the maximum subarray sum after each point update.",
  },
  level: "hard",
  minutes: 11,
  time: "O(n + q log n)",
  memory: "O(n)",
  goal: {
    vi: "Tìm <b>tổng đoạn con lớn nhất</b> trước và sau khi đổi <b>a[1]</b> thành <b>−1</b>",
    en: "Find the <b>maximum subarray sum</b> before and after setting <b>a[1]</b> to <b>−1</b>",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">struct</span> Node { long long sum, pref, suff, best; };',
    'Node leaf(long long x) { auto b = max(0LL, x); <span class="kw">return</span> {x, b, b, b}; }',
    'Node merge(Node L, Node R) {',
    '  <span class="kw">return</span> {L.sum + R.sum,',
    '          max(L.pref, L.sum + R.pref),',
    '          max(R.suff, R.sum + L.suff),',
    '          max({L.best, R.best, L.suff + R.pref})};',
    '}',
    'vector&lt;Node&gt; t(2*k); <span class="cm">// k ≥ n, k is a power of two</span>',
    '<span class="kw">for</span> (int i = 0; i &lt; n; ++i) t[k+i] = leaf(a[i]);',
    '<span class="kw">for</span> (int v = k-1; v &gt; 0; --v) t[v] = merge(t[2*v], t[2*v+1]);',
    '<span class="kw">void</span> set_value(int i, long long x) {',
    '  int v = k+i; t[v] = leaf(x);',
    '  <span class="kw">while</span> ((v /= 2) &gt; 0) t[v] = merge(t[2*v], t[2*v+1]);',
    '}',
  ],
  watch: [
    { key: "range", label: { vi: "đoạn đang xét", en: "current range" } },
    { key: "stats", label: { vi: "bộ giá trị", en: "node values" } },
    { key: "answer", label: "t[1].best" },
  ],
  practice: [
    { src: "CSES 2166", name: "Prefix Sum Queries", lv: "★★☆", url: "https://cses.fi/problemset/task/2166" },
    { src: "CSES 1190", name: "Subarray Sum Queries", lv: "★★★", url: "https://cses.fi/problemset/task/1190" },
  ],
  sceneOptions,
  legend: [
    { cls: "acc", label: { vi: "giá trị dùng để gộp", en: "merge input" } },
    { cls: "ac", label: { vi: "nút vừa tính", en: "computed node" } },
  ],
  steps: [
    {
      title: { vi: "Tìm đoạn con tốt nhất", en: "Find the best subarray" }, kind: "problem",
      body: {
        vi: "Mảng là <code>[−2, 4, 3, −5]</code>. Ta cần tổng lớn nhất của một đoạn liên tiếp sau mỗi lần sửa một ô. Chạy lại Kadane từ đầu tốn O(n) mỗi lần.",
        en: "Start with <code>[−2, 4, 3, −5]</code>. After each point update, we need the largest sum of any contiguous subarray. Rerunning Kadane's algorithm costs O(n) per update.",
      },
      lines: [], watch: { range: "[0,3]" }, verdict: "run", fit: ["v4", "v7"],
      scene: tree(),
    },
    {
      title: { vi: "Biểu diễn một lá", en: "Represent a leaf" }, kind: "concept",
      body: {
        vi: "Mỗi nút lưu <code>sum</code> là tổng cả đoạn, <code>pref</code> là tổng tiền tố lớn nhất, <code>suff</code> là tổng hậu tố lớn nhất và <code>best</code> là tổng đoạn con lớn nhất. Ba giá trị cực đại đều cho phép đoạn rỗng có tổng 0. Vì thế lá −2 có bộ <code>(−2, 0, 0, 0)</code>, còn lá 4 có bộ <code>(4, 4, 4, 4)</code>.",
        en: "Each node stores the total <code>sum</code>, maximum prefix sum <code>pref</code>, maximum suffix sum <code>suff</code>, and maximum subarray sum <code>best</code>. All three maxima allow an empty segment with sum 0. The leaf −2 gives <code>(−2, 0, 0, 0)</code>, while the leaf 4 gives <code>(4, 4, 4, 4)</code>.",
      },
      lines: [1, 2, 10], watch: { range: "[0,0]", stats: tuple(leaves[0]) }, verdict: "run",
      fit: ["v4", "v7", "formulaBounds"],
      scene: tree({ good: [4, 5], formula: "−2 → (−2, 0, 0, 0)", extra: "4 → (4, 4, 4, 4)" }),
    },
    {
      title: { vi: "Gộp từng cặp lá", en: "Merge pairs of leaves" }, kind: "step",
      body: {
        vi: "Ở nửa trái, tiền tố tốt nhất lấy cả hai ô, tổng <code>−2 + 4 = 2</code>, còn hậu tố và đoạn con tốt nhất chỉ lấy 4. Ở nửa phải, tiền tố và đoạn con tốt nhất lấy 3, còn hậu tố tốt nhất là đoạn rỗng vì cả <code>−5</code> lẫn <code>3 − 5 = −2</code> đều âm.",
        en: "On the left, the best prefix takes both entries for <code>−2 + 4 = 2</code>, while the best suffix and subarray take just 4. On the right, the best prefix and subarray take 3, while the best suffix is empty because both <code>−5</code> and <code>3 − 5 = −2</code> are negative.",
      },
      lines: [3, 4, 5, 6, 7, 11], watch: { range: "[0,1]", stats: tuple(left) }, verdict: "run", fit,
      scene: tree({ pairs: true, fields: true, active: [4, 5, 6, 7], good: [2, 3], edges: [4, 5, 6, 7], formula: "−2 + 4 = 2 · 3 − 5 = −2" }),
    },
    {
      title: { vi: "Cộng tổng hai nửa", en: "Add the two totals" }, kind: "step",
      body: {
        vi: "Để gộp gốc, gọi hai con lần lượt là <code>L</code> và <code>R</code>. Tổng của gốc là <code>L.sum + R.sum = 2 + (−2) = 0</code>.",
        en: "To merge the root, call the left child <code>L</code> and the right child <code>R</code>. The root's total is <code>L.sum + R.sum = 2 + (−2) = 0</code>.",
      },
      lines: [3, 4, 11], watch: { range: "[0,3]", stats: tuple(root, 1) }, verdict: "run", fit,
      scene: tree({ rootCount: 1, fields: true, active: [2, 3], good: [1], edges: [2, 3], formula: "sum = 2 + (−2) = 0" }),
    },
    {
      title: { vi: "Tính tiền tố, hậu tố", en: "Merge prefixes and suffixes" }, kind: "step",
      body: {
        vi: "Tiền tố tốt nhất nằm trọn bên trái (2) hoặc lấy cả trái rồi nối tiền tố phải (<code>2 + 3 = 5</code>). Đối xứng lại, hậu tố tốt nhất nằm trọn bên phải (0) hoặc lấy hậu tố trái rồi nối cả phải (<code>4 − 2 = 2</code>).",
        en: "The best prefix stays on the left (2) or takes the entire left side plus a right prefix (<code>2 + 3 = 5</code>). The best suffix stays on the right (0) or joins a left suffix to the entire right side (<code>4 − 2 = 2</code>).",
      },
      lines: [5, 6], watch: { range: "[0,3]", stats: tuple(root, 3) }, verdict: "run", fit,
      scene: tree({ rootCount: 3, fields: true, active: [2, 3], good: [1], edges: [2, 3], formula: "pref = max(2, 2 + 3) = 5", extra: "suff = max(0, 4 − 2) = 2" }),
    },
    {
      title: { vi: "Xét đoạn qua giữa", en: "Check the crossing subarray" }, kind: "answer",
      body: {
        vi: "Đoạn con tốt nhất nằm hẳn bên trái (4), hẳn bên phải (3), hoặc băng qua giữa. Trường hợp băng qua nối hậu tố trái 4 với tiền tố phải 3, cho <code>4 + 3 = 7</code> trên đoạn <code>[1,2]</code>.",
        en: "The best subarray lies entirely on the left (4), entirely on the right (3), or crosses the split. The crossing option joins left suffix 4 to right prefix 3 for <code>4 + 3 = 7</code> on <code>[1,2]</code>.",
      },
      lines: [7], watch: { range: "[0,3]", stats: tuple(root), answer: root[3] }, verdict: "ac", fit,
      scene: tree({ rootCount: 4, fields: true, active: [2, 3, 5, 6], good: [1], edges: [2, 3], formula: "best = max(4, 3, 4 + 3) = 7", answer: true }),
    },
    {
      title: { vi: "Sửa từ lá lên", en: "Update from the leaf" }, kind: "step",
      body: {
        vi: "Đổi <code>a[1]</code> thành −1 rồi gộp lại dọc đường lên gốc. Nửa trái chỉ còn số âm nên có bộ <code>(−3, 0, 0, 0)</code>. Gốc so sánh 0, 3 và <code>0 + 3</code>, nên đáp án mới là 3, đạt được khi lấy riêng <code>a[2]</code>.",
        en: "Set <code>a[1]</code> to −1, then merge again along the path to the root. The left half is all negative and becomes <code>(−3, 0, 0, 0)</code>. The root compares 0, 3, and <code>0 + 3</code>, giving a new answer of 3 from <code>a[2]</code> alone.",
      },
      lines: [2, 7, 12, 13, 14], watch: { range: "[0,3]", stats: tuple(newRoot), answer: newRoot[3] }, verdict: "ac", fit,
      scene: tree({ rootCount: 4, fields: true, update: true, good: [1, 2, 5], edges: [2, 5], formula: "L.sum = −2 − 1 = −3", extra: "best = max(0, 3, 0 + 3) = 3", answer: true }),
    },
    {
      title: { vi: "Gộp đủ ba trường hợp", en: "Cover all three cases" }, kind: "recap",
      body: {
        vi: "Mọi đoạn con nằm trong một nửa hoặc qua ranh giới, nên ba ứng viên của <code>best</code> là đủ. Mỗi lần gộp tốn O(1), dựng cây tốn O(n), sửa một ô tốn O(log n), và đọc <code>t[1].best</code> tốn O(1). Giữ đúng thứ tự trái, phải khi gộp vì tiền tố và hậu tố phụ thuộc thứ tự.",
        en: "Every subarray stays in one half or crosses the boundary, so the three <code>best</code> candidates cover every case. A merge takes O(1), building takes O(n), updating one entry takes O(log n), and reading <code>t[1].best</code> takes O(1). Keep left and right in order because prefixes and suffixes depend on that order.",
      },
      lines: [4, 5, 6, 7, 11, 14], watch: { range: "[0,3]", stats: tuple(newRoot), answer: newRoot[3] }, verdict: "ac", fit,
      scene: tree({ rootCount: 4, fields: true, update: true, active: [2, 3], good: [1], edges: [2, 3], formula: "best = max(0, 3, 0 + 3) = 3", answer: true }),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  nodes.forEach(({ range, x, level }, i) => {
    const v = i + 1;
    scene.add(`v${v}`, {
      shape: shapes.block({ label: "", sub: range, w: level === 2 ? 49 : 125, h: 34, depth: 4, r: 7 }),
      x, y: level * ROW, o: v >= 4 ? 1 : 0,
    });
    if (v > 1) scene.link(`e${v}`, { from: `v${v >> 1}`, to: `v${v}`, anchor: "center", bend: 0 });
  });
  scene.add("fields", { shape: shapes.pill({ text: FIELDS }), x: 0, y: -1.62, o: 0 });
  // Fixed bounds keep the camera independent of the previous formula’s width.
  scene.add("formulaBounds", { shape: shapes.block({ w: 290, h: 1, depth: 0 }), x: 0, y: 8.52, o: 0 });
  scene.add("calc", { shape: shapes.pill(), x: 0, y: 7.32, o: 0 });
  scene.add("extra", { shape: shapes.pill(), x: 0, y: 8.52, o: 0 });
}
