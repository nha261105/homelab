import type { Lesson, SceneMap } from "../../../lib/types";

const A = [3, 2, 4, 5, 1, 1, 5, 3];
const K = A.length;
const U = 41;
const T = [...Array<number>(K).fill(Infinity), ...A];

interface Interval {
  l: number;
  r: number;
  depth: number;
}

const intervals: Interval[] = [];
function split(v: number, l: number, r: number, depth: number) {
  intervals[v] = { l, r, depth };
  if (l === r) return;
  const m = (l + r) >> 1;
  split(2 * v, l, m, depth + 1);
  split(2 * v + 1, m + 1, r, depth + 1);
}
split(1, 0, K - 1, 0);
for (let v = K - 1; v > 0; --v) T[v] = Math.min(T[2 * v], T[2 * v + 1]);

const ids = intervals.slice(1).map((_, i) => `v${i + 1}`);
const leaves = ids.slice(K - 1);
const treeFit = [...ids, "calc"];
const left = [1, 2, 5];
const visited = [...left, 3, 6, 7, 14];
const chosen = [5, 6, 14];
const answer = Math.min(...chosen.map((v) => T[v]));
const updated = [...T];
updated[13] = 0;
for (const v of [6, 3, 1]) updated[v] = Math.min(updated[2 * v], updated[2 * v + 1]);

function tree(
  first: number, active: number[] = [], good: number[] = [], skipped: number[] = [],
  values = T, formula = "", result = false,
): SceneMap {
  const scene: SceneMap = {
    calc: { text: formula, o: formula ? 1 : 0, cls: result ? "v-eq" : "" },
  };
  for (let v = 1; v < T.length; ++v) {
    const visible = v >= first;
    const accepted = good.includes(v);
    const focus = active.includes(v);
    const dim = skipped.includes(v);
    scene[`v${v}`] = {
      text: String(values[v]), o: visible ? (dim ? 0.42 : 1) : 0,
      cls: accepted ? "is-good" : focus ? "is-active" : dim ? "is-out" : "",
    };
    if (v === 1) continue;
    const parent = v >> 1;
    const onPath = (active.includes(parent) || good.includes(parent)) && (focus || accepted);
    scene[`e${v}`] = {
      p: parent >= first ? 1 : 0, o: onPath ? 1 : dim ? 0.2 : 0.42,
      cls: onPath && accepted ? "v-eq" : "",
      ...(onPath ? { from: { p: 0 }, delay: 100, dur: 320 } : {}),
    };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "range-queries",
  slug: "segment-tree",
  title: { vi: "Segment tree", en: "Segment tree" },
  added: "2026-11-27",
  summary: {
    vi: "Lưu giá trị nhỏ nhất của các đoạn để truy vấn và sửa một phần tử trong O(log n).",
    en: "Store interval minimums to answer queries and change one value in O(log n).",
  },
  level: "medium",
  minutes: 9,
  time: "O(n + q log n)",
  memory: "O(n)",
  goal: { vi: "Tìm <b>min a[2..6]</b> trên mảng 8 ô", en: "Find <b>min a[2..6]</b> in an 8-element array" },
  codeLang: "C++17",
  code: [
    'vector&lt;<span class="kw">int</span>&gt; t(2*k, INT_MAX);',
    'copy(a.begin(), a.end(), t.begin() + k);',
    '<span class="kw">for</span> (<span class="kw">int</span> v = k-1; v &gt; 0; --v) t[v] = min(t[2*v], t[2*v+1]);',
    '',
    '<span class="kw">int</span> query(<span class="kw">int</span> v, <span class="kw">int</span> l, <span class="kw">int</span> r, <span class="kw">int</span> L, <span class="kw">int</span> R) {',
    '  <span class="kw">if</span> (r &lt; L || R &lt; l) <span class="kw">return</span> INT_MAX;',
    '  <span class="kw">if</span> (L &lt;= l &amp;&amp; r &lt;= R) <span class="kw">return</span> t[v];',
    '  <span class="kw">int</span> m = (l+r)/2;',
    '  <span class="kw">return</span> min(query(2*v,l,m,L,R), query(2*v+1,m+1,r,L,R));',
    '}',
    '<span class="kw">void</span> set_value(<span class="kw">int</span> i, <span class="kw">int</span> x) {',
    '  <span class="kw">int</span> v = k+i; t[v] = x;',
    '  <span class="kw">for</span> (v /= 2; v &gt; 0; v /= 2) t[v] = min(t[2*v], t[2*v+1]);',
    '}',
  ],
  watch: [
    { key: "segment", label: { vi: "đoạn đang xét", en: "current interval" } },
    { key: "parts", label: { vi: "các giá trị lấy được", en: "collected values" } },
    { key: "answer", label: "min a[2..6]" },
  ],
  practice: [
    { src: "CSES 1650", name: "Range Xor Queries", lv: "★☆☆", url: "https://cses.fi/problemset/task/1650" },
    { src: "CSES 1649", name: "Dynamic Range Minimum Queries", lv: "★★☆", url: "https://cses.fi/problemset/task/1649" },
  ],
  sceneOptions: { unit: U, view: [-45, -120, 380, 345] },
  legend: [
    { cls: "acc", label: { vi: "nút đang xét", en: "node in focus" } },
    { cls: "ac", label: { vi: "nút vừa tính hoặc được lấy", en: "computed or selected node" } },
    { cls: "dim", label: { vi: "đoạn nằm ngoài truy vấn", en: "disjoint interval" } },
  ],
  entrance: leaves,
  steps: [
    {
      title: { vi: "Tìm giá trị nhỏ nhất", en: "Find the minimum" }, kind: "problem",
      body: {
        vi: "Mảng có 8 ô, đánh số từ 0. Đoạn <code>[2, 6]</code> gồm 5 ô đang sáng. Nếu mảng thay đổi giữa các câu hỏi, quét lại từng đoạn có thể tốn O(n) mỗi lần.",
        en: "The array has 8 cells indexed from 0. The interval <code>[2, 6]</code> contains the 5 highlighted cells. If the array changes between queries, scanning each interval can cost O(n) per query.",
      },
      lines: [], watch: { segment: "[2, 6]" }, verdict: "run", fit: leaves,
      scene: tree(8, [10, 11, 12, 13, 14]),
    },
    {
      title: { vi: "Ghép từng cặp lá", en: "Merge pairs of leaves" }, kind: "concept",
      body: {
        vi: "Chép mảng vào các lá. Mỗi nút cha giữ giá trị nhỏ nhất của hai con, ví dụ đoạn <code>[2, 3]</code> có <code>min(4, 5) = 4</code>.",
        en: "Copy the array into the leaves. Every parent stores the smaller value of its two children. For example, <code>[2, 3]</code> stores <code>min(4, 5) = 4</code>.",
      },
      note: {
        vi: "Chọn <code>k</code> là lũy thừa của 2 nhỏ nhất đủ chứa mảng. Các lá đệm mang giá trị <code>INT_MAX</code>.",
        en: "Choose <code>k</code> as the smallest power of two that fits the array. Extra leaves hold <code>INT_MAX</code>.",
      },
      lines: [1, 2, 3], watch: { segment: "[2, 3]", parts: "4, 5" }, verdict: "run", fit: treeFit,
      scene: tree(4, [10, 11], [5], [], T, "min(4, 5) = 4"),
    },
    {
      title: { vi: "Tính lên tới gốc", en: "Build up to the root" }, kind: "step",
      body: {
        vi: "Ghép tiếp để được <code>[0, 3]</code> với min 2 và <code>[4, 7]</code> với min 1. Gốc <code>[0, 7]</code> lấy <code>min(2, 1) = 1</code>.",
        en: "Merge again to get <code>[0, 3]</code> with minimum 2 and <code>[4, 7]</code> with minimum 1. The root <code>[0, 7]</code> takes <code>min(2, 1) = 1</code>.",
      },
      lines: [3], watch: { segment: "[0, 7]", parts: "2, 1" }, verdict: "run", fit: treeFit,
      scene: tree(1, [2, 3], [1], [], T, "min(2, 1) = 1"),
    },
    {
      title: { vi: "Xét nửa trái", en: "Search the left half" }, kind: "step",
      body: {
        vi: "Gọi <code>query(1, 0, 7, 2, 6)</code>. Ở nửa trái, <code>[0, 1]</code> nằm ngoài nên trả về <code>INT_MAX</code>, còn <code>[2, 3]</code> nằm trọn trong đoạn hỏi nên lấy ngay 4.",
        en: "Call <code>query(1, 0, 7, 2, 6)</code>. On the left, <code>[0, 1]</code> is disjoint and returns <code>INT_MAX</code>. The interval <code>[2, 3]</code> is fully covered, so read 4 from its node.",
      },
      lines: [5, 6, 7, 8, 9], watch: { segment: "[0, 3]", parts: "4" }, verdict: "run", fit: treeFit,
      scene: tree(1, [1, 2], [5], [4], T, "min(∞, 4) = 4"),
    },
    {
      title: { vi: "Xét nửa phải", en: "Search the right half" }, kind: "step",
      body: {
        vi: "Đoạn <code>[4, 5]</code> nằm trọn trong <code>[2, 6]</code>, nên lấy 1. Đoạn <code>[6, 7]</code> chỉ giao một phần, nên tách tiếp để lấy ô 6 có giá trị 5 và bỏ ô 7.",
        en: "The interval <code>[4, 5]</code> is fully covered by <code>[2, 6]</code>, so take 1. The interval <code>[6, 7]</code> overlaps only partly, so split it, take cell 6 with value 5, and skip cell 7.",
      },
      lines: [6, 7, 8, 9], watch: { segment: "[4, 7]", parts: "1, 5" }, verdict: "run", fit: treeFit,
      scene: tree(1, [1, 3, 7], [6, 14], [15], T, "min(1, 5) = 1"),
    },
    {
      title: { vi: "Gộp ba đoạn", en: "Combine three intervals" }, kind: "answer",
      body: {
        vi: "Ba đoạn <code>[2, 3]</code>, <code>[4, 5]</code> và <code>[6, 6]</code> phủ đúng vùng cần hỏi và không chồng nhau. Giá trị nhỏ nhất là <code>min(4, 1, 5) = 1</code>.",
        en: "The three disjoint intervals <code>[2, 3]</code>, <code>[4, 5]</code>, and <code>[6, 6]</code> cover the query exactly. The minimum is <code>min(4, 1, 5) = 1</code>.",
      },
      lines: [7, 9], watch: { segment: "[2, 6]", parts: "4, 1, 5", answer }, verdict: "ac", fit: treeFit,
      scene: tree(1, visited.filter((v) => !chosen.includes(v)), chosen, [4, 15], T, "min(4, 1, 5) = 1", true),
    },
    {
      title: { vi: "Sửa một đường lên", en: "Update one path" }, kind: "step",
      body: {
        vi: "Đổi <code>a[5]</code> từ 1 thành 0. Tính lại <code>[4, 5]</code> từ <code>min(1, 0)</code>, rồi <code>[4, 7]</code> từ <code>min(0, 3)</code> và gốc từ <code>min(2, 0)</code>.",
        en: "Change <code>a[5]</code> from 1 to 0. Recompute <code>[4, 5]</code> using <code>min(1, 0)</code>, then <code>[4, 7]</code> using <code>min(0, 3)</code> and the root using <code>min(2, 0)</code>.",
      },
      lines: [11, 12, 13], watch: { segment: "[5, 5]" }, verdict: "ac", fit: treeFit,
      scene: tree(1, [], [13, 6, 3, 1], [], updated, "min(2, 0) = 0"),
    },
    {
      title: { vi: "Chỉ đi sâu ở biên", en: "Descend at the boundaries" }, kind: "recap",
      body: {
        vi: "Hỏi lại cùng đoạn cho <code>min(4, 0, 5) = 0</code>. Mỗi tầng chỉ có tối đa hai nút giao một phần cần tách tiếp, nên mỗi truy vấn tốn O(log n), cũng như một lần cập nhật theo đường từ lá lên gốc. Dựng cây tốn O(n) thời gian và bộ nhớ.",
        en: "The same query now gives <code>min(4, 0, 5) = 0</code>. At most two partially covered nodes per level need splitting, so queries take O(log n), as do updates along one leaf-to-root path. Building uses O(n) time and space.",
      },
      lines: [6, 7, 9, 13], watch: { segment: "[2, 6]", parts: "4, 0, 5", answer: 0 }, verdict: "ac", fit: treeFit,
      scene: tree(1, visited.filter((v) => !chosen.includes(v)), chosen, [4, 15], updated, "min(4, 0, 5) = 0", true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  intervals.forEach(({ l, r, depth }, v) => {
    scene.add(`v${v}`, {
      shape: shapes.block({
        label: T[v], sub: l === r ? l : `[${l},${r}]`, w: l === r ? 33 : 42, h: 25, depth: 4, r: 6,
      }),
      x: (l + r) / 2, y: depth * 2.66, o: v < K ? 0 : 1,
    });
  });
  for (let v = 2; v < T.length; ++v) {
    scene.link(`e${v}`, { from: `v${v >> 1}`, to: `v${v}`, bend: 0 });
  }
  scene.add("calc", { shape: shapes.pill(), x: 3.5, y: 10.35, o: 0 });
}
