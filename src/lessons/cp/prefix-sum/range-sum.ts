import type { Lesson, SceneMap } from "../../../lib/types";

/* Prefix Sum — answer "sum of a[l..r]" in O(1) after an O(n) precomputation.
   Scene: array a on the top row, pre on the row below, shifted half a cell so that
   pre[i] sits on the boundary before a[i] (pre[i] = sum of everything to its left). */

const A = [3, 1, 4, 1, 5, 9, 2, 6];
const PRE = A.reduce((p, v) => [...p, p[p.length - 1] + v], [0]); // [0,3,4,8,9,14,23,25,31]
const L = 2, R = 5;                                                   // query a[2..5] = 4+1+5+9 = 19
const U = 62;
const ROW = 3;                                                         // y of the pre row

// ---- helpers: every step states the whole pre row, so jumping between steps is always right
/** pre cells 0..k are known (value shown), the rest are "?" and faded. */
const preUpTo = (k: number, fresh = -1): SceneMap =>
  Object.fromEntries(PRE.map((v, i) => [`p${i}`, i <= k
    ? { o: 1, text: String(v), cls: "", ...(i === fresh ? { from: { z: 0.9, o: 0 }, ease: "drop", land: true, dur: 520 } : {}) }
    : { o: 0.35, text: "?", cls: "is-out" }]));
const frame = (id: string, l: number, r: number, cls = "", delay = 0): SceneMap =>
  ({ [id]: { x: (l + r) / 2, w: (r - l) * U + 70, o: 1, cls, delay } });
const active = (ids: string[], cls = "is-active", delay = 0): SceneMap => Object.fromEntries(ids.map((id) => [id, { cls, delay }]));
const say = (text: string, cls = "", delay = 640): SceneMap =>
  ({ calc: { o: 1, s: 1, from: { o: 0, s: 0.7 }, text, cls, delay, dur: 340, ease: "back" } });
const rec = (k: number, delay = 640): SceneMap => ({
  rec: { x: k - 1, o: 1, s: 1, from: { o: 0, s: 0.7 }, text: `pre[${k}] = pre[${k - 1}] + a[${k - 1}] = ${PRE[k - 1]} + ${A[k - 1]} = ${PRE[k]}`, delay, dur: 340, ease: "back" },
});
// camera: both rows and their labels; WITH_REC also keeps the formula under the pre row in view
const ALL = ["labP", "labA", "c7", "p8"];
const WITH_REC = [...ALL, "rec"];

export const lesson: Lesson = {
  track: "cp",
  topic: "prefix-sum",
  slug: "range-sum",
  title: { vi: "Prefix Sum", en: "Prefix Sums" },
  added: "2026-11-26",
  summary: {
    vi: "Tính trước tổng cộng dồn một lần trong O(n), sau đó mọi truy vấn tổng đoạn chỉ còn một phép trừ.",
    en: "Precompute running sums once in O(n); after that every range-sum query is a single subtraction.",
  },
  level: "basic",
  minutes: 7,
  time: "O(n + q)",
  memory: "O(n)",
  goal: { vi: `tổng <b>a[${L}..${R}]</b> · nhiều truy vấn`, en: `sum of <b>a[${L}..${R}]</b> · many queries` },
  codeLang: "C++17",
  code: [
    '<span class="kw">vector</span>&lt;<span class="kw">long long</span>&gt; pre(n + <span class="nm">1</span>, <span class="nm">0</span>);',
    '<span class="kw">for</span> (<span class="kw">int</span> i = <span class="nm">0</span>; i &lt; n; i++)',
    '  pre[i + <span class="nm">1</span>] = pre[i] + a[i];',
    '',
    '<span class="cm">// tổng a[l..r], 0-indexed</span>',
    '<span class="kw">long long</span> sum(<span class="kw">int</span> l, <span class="kw">int</span> r) {',
    '  <span class="kw">return</span> pre[r + <span class="nm">1</span>] - pre[l];',
    '}',
  ],
  watch: [
    { key: "i", label: "i" },
    { key: "pre", label: { vi: "giá trị vừa tính", en: "just computed" } },
    { key: "lr", label: "[l, r]" },
    { key: "sum", label: { vi: "tổng", en: "sum" } },
  ],
  practice: [
    { src: "CSES 1646", name: "Static Range Sum Queries", lv: "★☆☆", url: "https://cses.fi/problemset/task/1646" },
    { src: "LeetCode 303", name: "Range Sum Query - Immutable", lv: "★☆☆", url: "https://leetcode.com/problems/range-sum-query-immutable/" },
    { src: "LeetCode 724", name: "Find Pivot Index", lv: "★☆☆", url: "https://leetcode.com/problems/find-pivot-index/" },
    { src: "CSES 1660", name: "Subarray Sums I", lv: "★★☆", url: "https://cses.fi/problemset/task/1660" },
  ],
  sceneOptions: { unit: U, view: [-120, -150, 620, 360] },
  legend: [
    { cls: "acc", label: { vi: "đang dùng", en: "in use" } },
    { cls: "ac", label: { vi: "vừa tính / đáp án", en: "just computed / answer" } },
    { cls: "wa", label: { vi: "phần bị trừ", en: "subtracted part" } },
    { cls: "dim", label: { vi: "chưa tính", en: "not computed yet" } },
  ],
  entrance: A.map((_, k) => `c${k}`),
  steps: [
    {
      title: { vi: "Bài toán", en: "The problem" }, kind: "problem",
      body: {
        vi: `Cho mảng <code>a</code> có n phần tử và q câu hỏi "tổng từ <code>a[l]</code> đến <code>a[r]</code> là bao nhiêu?". Cộng từng phần tử thì mỗi câu tốn O(n), cả bài tốn O(n·q): với n = q = 2·10⁵ là quá chậm.`,
        en: `Given an array <code>a</code> of n numbers and q questions "what is the sum from <code>a[l]</code> to <code>a[r]</code>?". Adding the elements one by one costs O(n) per question, O(n·q) in total: far too slow for n = q = 2·10⁵.`,
      },
      note: { vi: "Mảng không đổi giữa các câu hỏi → tính trước được.", en: "The array never changes between questions → we can precompute." },
      lines: [], watch: { lr: `[${L}, ${R}]` }, verdict: "run", fit: ALL,
      scene: { ...preUpTo(-1), ...frame("win", L, R), ...active(["c2", "c3", "c4", "c5"], "is-active", 200), ...say("4 + 1 + 5 + 9 = 19", "", 520) },
    },
    {
      title: { vi: "Hàng cộng dồn", en: "A running-total row" }, kind: "concept",
      body: {
        vi: "Thêm hàng <code>pre</code> dài n + 1. <code>pre[i]</code> là tổng mọi phần tử <b>đứng trước</b> <code>a[i]</code>, nên nó nằm ở khe giữa hai ô. Bắt đầu với <code>pre[0] = 0</code>: trước <code>a[0]</code> không có gì.",
        en: "Add a row <code>pre</code> of length n + 1. <code>pre[i]</code> is the sum of everything <b>before</b> <code>a[i]</code>, so it sits in the gap between two cells. Start with <code>pre[0] = 0</code>: nothing comes before <code>a[0]</code>.",
      },
      lines: [1], watch: { pre: 0 }, verdict: "run", fit: ALL,
      scene: { ...preUpTo(0, 0), p0: { o: 1, text: "0", cls: "is-good", from: { z: 0.9, o: 0 }, ease: "drop", land: true, dur: 520 } },
    },
    {
      title: { vi: "Cộng dồn từng ô", en: "Add one cell at a time" }, kind: "step",
      body: {
        vi: "Mỗi ô mới bằng ô trước cộng phần tử vừa đi qua: <code>pre[i+1] = pre[i] + a[i]</code>. Ví dụ <code>pre[3] = 4 + 4 = 8</code>.",
        en: "Each new cell is the previous one plus the element just passed: <code>pre[i+1] = pre[i] + a[i]</code>. For example <code>pre[3] = 4 + 4 = 8</code>.",
      },
      lines: [2, 3], watch: { i: 2, pre: 8 }, verdict: "run", fit: WITH_REC,
      scene: { ...preUpTo(3, 3), ...active(["c2", "p2"]), p3: { o: 1, text: "8", cls: "is-good", from: { z: 0.9, o: 0 }, ease: "drop", land: true, dur: 520, delay: 280 }, ...rec(3) },
    },
    {
      title: { vi: "Xong hàng pre", en: "The pre row is done" }, kind: "step",
      body: {
        vi: "Đi hết mảng một lần là có đủ <code>pre[0..8]</code>, mất O(n). Ô cuối <code>pre[8] = 31</code> là tổng cả mảng.",
        en: "One pass over the array fills <code>pre[0..8]</code> in O(n). The last cell <code>pre[8] = 31</code> is the sum of the whole array.",
      },
      note: { vi: "Phần tốn công chỉ làm một lần, trước mọi câu hỏi.", en: "The expensive part happens once, before any question." },
      lines: [2, 3], watch: { i: 7, pre: 31 }, verdict: "run", fit: WITH_REC,
      scene: { ...preUpTo(8), ...active(["c7", "p7"]), p8: { o: 1, text: "31", cls: "is-good", fx: { type: "hop", delay: 300 } }, ...rec(8) },
    },
    {
      title: { vi: "Trả lời bằng một phép trừ", en: "Answer with one subtraction" }, kind: "answer",
      body: {
        vi: `Tổng <code>a[${L}..${R}]</code> = <code>pre[${R + 1}] − pre[${L}]</code> = <code>${PRE[R + 1]} − ${PRE[L]} = ${PRE[R + 1] - PRE[L]}</code>. Đúng bằng 4 + 1 + 5 + 9, nhưng chỉ tốn O(1).`,
        en: `The sum of <code>a[${L}..${R}]</code> is <code>pre[${R + 1}] − pre[${L}]</code> = <code>${PRE[R + 1]} − ${PRE[L]} = ${PRE[R + 1] - PRE[L]}</code>. Same as 4 + 1 + 5 + 9, but in O(1).`,
      },
      lines: [6, 7], watch: { i: 8, pre: 31, lr: `[${L}, ${R}]`, sum: PRE[R + 1] - PRE[L] }, verdict: "ac", fit: ALL,
      scene: {
        ...preUpTo(8), ...frame("win", L, R, "is-good", 900),
        ...active(["c2", "c3", "c4", "c5"]),
        p6: { o: 1, text: String(PRE[6]), cls: "is-good", fx: { type: "hop", delay: 280 } },
        p2: { o: 1, text: String(PRE[2]), cls: "is-active is-bad", fx: { type: "shake", delay: 560 } },
        ...say(`pre[6] − pre[2] = ${PRE[6]} − ${PRE[2]} = ${PRE[6] - PRE[2]} ✓`, "v-eq"),
      },
    },
    {
      title: { vi: "Vì sao phép trừ đúng", en: "Why the subtraction works" }, kind: "recap",
      body: {
        vi: "<code>pre[6]</code> là tổng <code>a[0..5]</code>, <code>pre[2]</code> là tổng <code>a[0..1]</code>. Trừ đi thì phần chung <code>a[0..1]</code> triệt tiêu, còn lại đúng <code>a[2..5]</code>. Tổng cộng O(n) để chuẩn bị, O(1) mỗi câu hỏi.",
        en: "<code>pre[6]</code> is the sum of <code>a[0..5]</code> and <code>pre[2]</code> is the sum of <code>a[0..1]</code>. Subtracting cancels the shared part <code>a[0..1]</code> and leaves exactly <code>a[2..5]</code>. O(n) to prepare, O(1) per question.",
      },
      note: { vi: "Cùng ý này mở rộng sang 2 chiều (bài tiếp theo) và sang mảng hiệu.", en: "The same idea extends to 2D (next lesson) and to difference arrays." },
      lines: [7], watch: { i: 8, pre: 31, lr: `[${L}, ${R}]`, sum: 19 }, verdict: "ac", fit: ALL,
      scene: {
        ...preUpTo(8), ...frame("win", L, R, "is-good"), ...frame("cut", 0, L - 1, "is-bad", 200),
        ...active(["c0", "c1"], "is-bad", 200), ...active(["c2", "c3", "c4", "c5"], "is-good", 400),
        p6: { o: 1, text: String(PRE[6]), cls: "is-good" }, p2: { o: 1, text: String(PRE[2]), cls: "is-bad" },
        ...say("23 − 4 = 19", "v-eq", 0),
      },
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  scene.add("win", { shape: shapes.frame(), layer: "back", x: (L + R) / 2, w: (R - L) * U + 70, o: 0 });
  scene.add("cut", { shape: shapes.frame(), layer: "back", x: (L - 1) / 2, w: (L - 1) * U + 70, o: 0 });
  scene.add("labA", { shape: shapes.pill({ text: "a" }), x: -1.15, y: 0, z: 0.3 });
  scene.add("labP", { shape: shapes.pill({ text: "pre" }), x: -1.75, y: ROW, z: 0.3 });
  A.forEach((v, i) => scene.add(`c${i}`, { shape: shapes.block({ label: v, sub: i }), x: i, shadow: true }));
  PRE.forEach((v, i) => scene.add(`p${i}`, { shape: shapes.block({ label: "?", sub: i, w: 50, h: 46 }), x: i - 0.5, y: ROW, o: 0.35 }));
  scene.add("calc", { shape: shapes.pill(), x: (L + R) / 2, y: 0, z: 1.6, o: 0, s: 0.7 });
  scene.add("rec", { shape: shapes.pill(), x: 2, y: ROW, z: -1.05, o: 0, s: 0.7 });
}
