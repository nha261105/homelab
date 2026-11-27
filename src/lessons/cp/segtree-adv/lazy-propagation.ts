import type { Lesson, SceneMap } from "../../../lib/types";

const A = [2, 1, 4, 3];
const nodes = [
  { range: "[0,3]", x: 0, level: 0 },
  { range: "[0,1]", x: -1.1, level: 1 },
  { range: "[2,3]", x: 1.1, level: 1 },
  { range: "0", x: -1.65, level: 2 },
  { range: "1", x: -0.55, level: 2 },
  { range: "2", x: 0.55, level: 2 },
  { range: "3", x: 1.65, level: 2 },
];
const left = A[0] + A[1], right = A[2] + A[3];
const initial = [left + right, left, right, ...A];
const first = [initial[0] + 2 * 3, left + 2 * 3, right, ...A];
const second = [first[0] + 2 * 2, first[1] + 2 * 2, right, ...A];
const pushed = [...second];
pushed[3] += 5;
pushed[4] += 5;
const answer = pushed[4] + pushed[5];

const U = 65;
const sceneOptions: NonNullable<Lesson["sceneOptions"]> & { pad: number } = {
  unit: U, pad: 12, view: [-220, -75, 390, 365],
};
const ROW = 2.55;
const fit = [...nodes.map((_, i) => `v${i + 1}`), "formulaBounds"];

function tree({
  values = initial, debt = 0, active = [], good = [], edges = [],
  formula = "", extra = "", answer = false, leavesOnly = false,
}: {
  values?: number[]; debt?: number; active?: number[]; good?: number[]; edges?: number[];
  formula?: string; extra?: string; answer?: boolean; leavesOnly?: boolean;
} = {}): SceneMap {
  const scene: SceneMap = {};
  nodes.forEach((_, i) => {
    const v = i + 1;
    scene[`v${v}`] = {
      text: String(values[i]), o: leavesOnly && v < 4 ? 0 : 1,
      cls: good.includes(v) ? "is-good" : active.includes(v) ? "is-active" : "",
    };
    if (v > 1) scene[`e${v}`] = {
      p: leavesOnly ? 0 : 1, o: edges.includes(v) ? 1 : 0.42,
      ...(edges.includes(v) ? { cls: "v-eq", from: { p: 0 }, dur: 360 } : {}),
    };
  });
  scene.tag = { text: debt ? `lazy +${debt}` : "", o: debt ? 1 : 0, cls: "v-lt" };
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
  slug: "lazy-propagation",
  title: { vi: "Lazy propagation", en: "Lazy propagation" },
  added: "2026-11-27",
  summary: {
    vi: "Cộng vào cả đoạn bằng cách sửa tổng ở nút cha và hoãn cập nhật xuống hai con.",
    en: "Add to an entire range by updating the parent sum and deferring the work on its children.",
  },
  level: "hard",
  minutes: 11,
  time: "O(n + q log n)",
  memory: "O(n)",
  goal: {
    vi: "Cộng <b>3</b> rồi <b>2</b> vào <b>[0,1]</b>, sau đó tính tổng <b>[1,2]</b>",
    en: "Add <b>3</b> and then <b>2</b> to <b>[0,1]</b>, then sum <b>[1,2]</b>",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">void</span> apply(int v, int len, long long d) {',
    '  sum[v] += d * len;',
    '  <span class="kw">if</span> (len &gt; 1) lazy[v] += d;',
    '}',
    '<span class="kw">void</span> push(int v, int l, int m, int r) {',
    '  apply(2*v, m-l+1, lazy[v]); apply(2*v+1, r-m, lazy[v]);',
    '  lazy[v] = 0;',
    '}',
    '<span class="kw">long long</span> visit(int v, int l, int r, int L, int R, long long d = 0) {',
    '  <span class="kw">if</span> (r &lt; L || R &lt; l) <span class="kw">return</span> 0;',
    '  <span class="kw">if</span> (L &lt;= l &amp;&amp; r &lt;= R) { apply(v, r-l+1, d); <span class="kw">return</span> sum[v]; }',
    '  <span class="kw">int</span> m = l + (r-l)/2; push(v, l, m, r);',
    '  <span class="kw">auto</span> x = visit(2*v,l,m,L,R,d) + visit(2*v+1,m+1,r,L,R,d);',
    '  sum[v] = sum[2*v] + sum[2*v+1];',
    '  <span class="kw">return</span> x;',
    '}',
  ],
  watch: [
    { key: "range", label: { vi: "đoạn thao tác", en: "operation range" } },
    { key: "sum", label: "sum[2]" },
    { key: "lazy", label: "lazy[2]" },
    { key: "answer", label: { vi: "kết quả truy vấn", en: "query result" } },
  ],
  practice: [
    { src: "CSES 1735", name: "Range Updates and Sums", lv: "★★☆", url: "https://cses.fi/problemset/task/1735" },
    { src: "CSES 1736", name: "Polynomial Queries", lv: "★★★", url: "https://cses.fi/problemset/task/1736" },
  ],
  sceneOptions,
  legend: [
    { cls: "acc", label: { vi: "nút đang xét", en: "node in focus" } },
    { cls: "ac", label: { vi: "giá trị vừa tính hoặc được lấy", en: "computed or selected value" } },
    { cls: "tle", label: { vi: "lượng cộng còn nợ mỗi phần tử", en: "pending addition per element" } },
  ],
  steps: [
    {
      title: { vi: "Cộng cả đoạn", en: "Add to a range" }, kind: "problem",
      body: {
        vi: "Mảng ban đầu là <code>[2, 1, 4, 3]</code>. Ta cộng 3 rồi cộng 2 vào từng ô trong <code>[0,1]</code> và hỏi tổng <code>[1,2]</code>. Nếu cập nhật từng ô trên segment tree, một lần cộng cả đoạn có thể tốn O(n log n).",
        en: "Start with <code>[2, 1, 4, 3]</code>. Add 3 and then 2 to each entry in <code>[0,1]</code>, and query the sum of <code>[1,2]</code>. A range update can cost O(n log n) if each entry gets its own segment-tree update.",
      },
      lines: [], watch: { range: "[0,1]" }, verdict: "run", fit: ["v4", "v7"],
      scene: tree({ leavesOnly: true, active: [4, 5] }),
    },
    {
      title: { vi: "Lưu tổng và nợ", en: "Store sums and tags" }, kind: "concept",
      body: {
        vi: "Dựng cây tổng từ các lá: <code>[0,1]</code> có <code>2 + 1 = 3</code>, <code>[2,3]</code> có <code>4 + 3 = 7</code>, gốc có <code>3 + 7 = 10</code>. Ban đầu mọi <code>lazy[v]</code> bằng 0. Khi có nợ, tổng ở nút đã tính phần cộng đó, còn hai con sẽ nhận sau.",
        en: "Build sums from the leaves: <code>[0,1]</code> gives <code>2 + 1 = 3</code>, <code>[2,3]</code> gives <code>4 + 3 = 7</code>, and the root gives <code>3 + 7 = 10</code>. All <code>lazy[v]</code> tags start at 0. A pending tag is already included in that node's sum and still needs to reach its children.",
      },
      lines: [2, 3, 14], watch: { sum: left, lazy: 0 }, verdict: "run", fit,
      scene: tree({ good: [1, 2, 3], edges: [2, 3, 4, 5, 6, 7], formula: "2 + 1 = 3 · 4 + 3 = 7", extra: "3 + 7 = 10" }),
    },
    {
      title: { vi: "Dừng khi phủ trọn", en: "Stop at full cover" }, kind: "step",
      body: {
        vi: "Đoạn cập nhật phủ trọn nút <code>[0,1]</code>. Tăng tổng của nút thêm <code>2 × 3</code>, ghi <code>lazy[2] = 3</code> rồi dừng trước hai lá. Khi quay lên, tính lại tổng gốc thành <code>9 + 7 = 16</code>.",
        en: "The update fully covers <code>[0,1]</code>. Increase its sum by <code>2 × 3</code>, record <code>lazy[2] = 3</code>, and stop before the leaves. On the way back up, recompute the root as <code>9 + 7 = 16</code>.",
      },
      lines: [1, 2, 3, 11, 14], watch: { range: "[0,1]", sum: first[1], lazy: 3 }, verdict: "run", fit,
      scene: tree({ values: first, debt: 3, active: [2], good: [1], edges: [2], formula: "3 + 2 × 3 = 9", extra: "9 + 7 = 16" }),
    },
    {
      title: { vi: "Cộng dồn nợ", en: "Accumulate pending adds" }, kind: "step",
      body: {
        vi: "Cộng thêm 2 trên cùng đoạn: tổng nút thành <code>9 + 2 × 2 = 13</code>, gốc thành <code>13 + 7 = 20</code>. Hai lần cộng gộp lại thành một khoản nợ <code>3 + 2 = 5</code> cho mỗi lá.",
        en: "Add 2 to the same range: the node's sum becomes <code>9 + 2 × 2 = 13</code>, and the root becomes <code>13 + 7 = 20</code>. The two additions combine into one pending amount of <code>3 + 2 = 5</code> per leaf.",
      },
      lines: [2, 3, 11, 14], watch: { range: "[0,1]", sum: second[1], lazy: 5 }, verdict: "run", fit,
      scene: tree({ values: second, debt: 5, active: [2], good: [1], edges: [2], formula: "9 + 2 × 2 = 13", extra: "13 + 7 = 20" }),
    },
    {
      title: { vi: "Hỏi trọn nút", en: "Read a covered node" }, kind: "step",
      body: {
        vi: "Thử hỏi tổng <code>[0,1]</code> bằng <code>visit</code> với <code>d = 0</code>. Nút đã tính cả phần nợ, nên trả ngay 13 và giữ nguyên thẻ <code>+5</code>.",
        en: "Try querying <code>[0,1]</code> by calling <code>visit</code> with <code>d = 0</code>. The node's sum already accounts for the pending additions, so it returns 13 and keeps its <code>+5</code> tag.",
      },
      lines: [9, 10, 11], watch: { range: "[0,1]", sum: second[1], lazy: 5, answer: second[1] }, verdict: "run", fit,
      scene: tree({ values: second, debt: 5, good: [2], edges: [2], formula: "sum[2] = 13" }),
    },
    {
      title: { vi: "Đẩy nợ xuống", en: "Push the tag down" }, kind: "step",
      body: {
        vi: "Đoạn hỏi <code>[1,2]</code> chỉ lấy một ô từ <code>[0,1]</code>, nên phải gọi <code>push</code> trước khi xuống. Mỗi con nhận <code>+5</code>: <code>2 → 7</code> và <code>1 → 6</code>. Xoá nợ ở cha, tổng của nút vẫn là <code>7 + 6 = 13</code>.",
        en: "The query <code>[1,2]</code> needs only one entry from <code>[0,1]</code>, so call <code>push</code> before descending. Each child gets <code>+5</code>: <code>2 → 7</code> and <code>1 → 6</code>. Clear the parent tag and keep its sum at <code>7 + 6 = 13</code>.",
      },
      lines: [2, 5, 6, 7, 12], watch: { range: "[1,2]", sum: second[1], lazy: 0 }, verdict: "run", fit,
      scene: tree({ values: pushed, active: [2], good: [4, 5], edges: [4, 5], formula: "2 + 5 = 7 · 1 + 5 = 6", extra: "7 + 6 = 13" }),
    },
    {
      title: { vi: "Cộng hai phần", en: "Add the two pieces" }, kind: "answer",
      body: {
        vi: "Lấy lá 1 có tổng 6 và lá 2 có tổng 4. Hai lá ngoài đoạn trả về 0, nên kết quả là <code>6 + 4 = 10</code>.",
        en: "Take leaf 1 with sum 6 and leaf 2 with sum 4. The two disjoint leaves return 0, so the result is <code>6 + 4 = 10</code>.",
      },
      lines: [10, 11, 13, 15], watch: { range: "[1,2]", sum: second[1], lazy: 0, answer }, verdict: "ac", fit,
      scene: tree({ values: pushed, active: [1, 2, 3], good: [5, 6], edges: [2, 3, 5, 6], formula: "6 + 4 = 10", answer: true }),
    },
    {
      title: { vi: "Chỉ tách ở biên", en: "Split at the boundaries" }, kind: "recap",
      body: {
        vi: "<code>apply</code> sửa tổng và giữ phần cộng cho con, còn <code>push</code> chuyển phần đó xuống mà không đổi tổng đoạn. Mỗi tầng có tối đa hai nút giao một phần phải tách tiếp, nên cộng đoạn và hỏi tổng đều tốn O(log n). Dựng cây tốn O(n) thời gian và bộ nhớ.",
        en: "<code>apply</code> updates the sum and defers the addition for the children, while <code>push</code> passes it down without changing the range sum. At most two partially covered nodes per level need splitting, so range additions and sum queries take O(log n). Building takes O(n) time and space.",
      },
      lines: [2, 3, 6, 7, 10, 11, 12, 14], watch: { range: "[1,2]", sum: second[1], lazy: 0, answer }, verdict: "ac", fit,
      scene: tree({ values: pushed, good: [5, 6], edges: [5, 6], formula: "6 + 4 = 10", answer: true }),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  nodes.forEach(({ range, x, level }, i) => {
    const v = i + 1;
    scene.add(`v${v}`, {
      shape: shapes.block({ label: initial[i], sub: range, w: 48, h: 34, depth: 4, r: 7 }),
      x, y: level * ROW, o: v >= 4 ? 1 : 0,
    });
    if (v > 1) scene.link(`e${v}`, { from: `v${v >> 1}`, to: `v${v}`, anchor: "center", bend: 0 });
  });
  scene.add("tag", { shape: shapes.pill({ h: 25, pad: 7 }), x: -2.28, y: ROW - 0.2, o: 0 });
  // Fixed bounds keep the camera independent of the previous formula’s width.
  scene.add("formulaBounds", { shape: shapes.block({ w: 330, h: 1, depth: 0 }), x: -0.55, y: 7.97, o: 0 });
  scene.add("calc", { shape: shapes.pill(), x: 0, y: 6.9, o: 0 });
  scene.add("extra", { shape: shapes.pill(), x: 0, y: 7.97, o: 0 });
}
