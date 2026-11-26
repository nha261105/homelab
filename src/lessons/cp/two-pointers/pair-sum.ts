import type { Lesson, SceneMap } from "../../../lib/types";

/* Two Pointers — find a pair with sum = target in a sorted array.
   Data + step scenes. Motion vocabulary: see the homelab-lesson skill (references/motion.md). */

const A = [1, 3, 4, 6, 8, 11, 15];
const TARGET = 14;
const U = 62;

// helpers that keep step scenes short
const win = (l: number, r: number): SceneMap => ({
  pl: { x: l, o: 1 },
  pr: { x: r, o: 1 },
  win: { x: (l + r) / 2, w: (r - l) * U + 70, o: 1 },
});
const compare = (l: number, r: number, v: "gt" | "lt" | "eq"): SceneMap => ({
  arc: { ends: [`c${l}`, `c${r}`], p: 1, from: { p: 0 }, cls: `v-${v}`, delay: 280, dur: 520, ease: "out" },
  sum: {
    o: 1, s: 1, from: { o: 0, s: 0.7 }, cls: `v-${v}`, delay: 640, dur: 340, ease: "back",
    text: `${A[l]} + ${A[r]} = ${A[l] + A[r]} ${v === "eq" ? "✓" : `${v === "gt" ? ">" : "<"} ${TARGET}`}`,
  },
});
const out = (...ids: number[]): SceneMap =>
  Object.fromEntries(ids.map((i) => [`c${i}`, { cls: "is-out", z: -0.12, s: 0.9, o: 0.55, dur: 480, ease: "out" }]));
const ALL = ["c0", "c6", "pl", "pr"];

export const lesson: Lesson = {
  track: "cp",
  topic: "two-pointers",
  slug: "pair-sum",
  title: { vi: "Two Pointers", en: "Two Pointers" },
  summary: {
    vi: "Hai con trỏ đi về phía nhau trên mảng đã sắp xếp — mỗi bước loại hẳn một phần tử.",
    en: "Two indices walk toward each other on a sorted array — every step rules one element out.",
  },
  level: "basic",
  minutes: 8,
  time: "O(n)",
  memory: "O(1)",
  goal: { vi: `target = <b>${TARGET}</b> · mảng đã sắp xếp`, en: `target = <b>${TARGET}</b> · sorted array` },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> l = <span class="nm">0</span>, r = n - <span class="nm">1</span>;',
    '<span class="kw">while</span> (l &lt; r) {',
    '  <span class="kw">int</span> s = a[l] + a[r];',
    '  <span class="kw">if</span> (s == target) <span class="kw">return</span> {l, r};',
    '  <span class="kw">if</span> (s &lt; target) l++;',
    '  <span class="kw">else</span> r--;',
    "}",
    '<span class="kw">return</span> {-<span class="nm">1</span>, -<span class="nm">1</span>};',
  ],
  watch: [
    { key: "l", label: "l" },
    { key: "r", label: "r" },
    { key: "sum", label: "a[l] + a[r]" },
    { key: "cmp", label: { vi: `so với ${TARGET}`, en: `vs ${TARGET}` } },
  ],
  practice: [
    { src: "CSES 1640", name: "Sum of Two Values", lv: "★☆☆", url: "https://cses.fi/problemset/task/1640" },
    { src: "LeetCode 167", name: "Two Sum II", lv: "★☆☆", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
    { src: "Codeforces 279B", name: "Books", lv: "★★☆", url: "https://codeforces.com/problemset/problem/279/B" },
    { src: "LeetCode 15", name: "3Sum", lv: "★★☆", url: "https://leetcode.com/problems/3sum/" },
  ],
  sceneOptions: { unit: U, view: [-60, -150, 500, 260] },
  legend: [
    { cls: "acc", label: { vi: "đang xét", en: "current" } },
    { cls: "wa", label: { vi: "quá lớn", en: "too big" } },
    { cls: "tle", label: { vi: "quá nhỏ", en: "too small" } },
    { cls: "ac", label: { vi: "đúng", en: "match" } },
    { cls: "dim", label: { vi: "đã loại", en: "ruled out" } },
  ],
  entrance: A.map((_, k) => `c${k}`),
  steps: [
    {
      title: { vi: "Bài toán", en: "The problem" }, kind: "problem",
      note: { vi: "Mảng đã sắp xếp là manh mối: nó cho ta biết nên dịch đầu nào.", en: "The array being sorted is the clue: it tells us which end to move." },
      body: {
        vi: `Cho mảng đã sắp xếp tăng dần và <code>target = ${TARGET}</code>. Tìm hai vị trí có tổng đúng bằng target. Thử mọi cặp mất O(n²). Ta sẽ làm trong O(n).`,
        en: `Given an array sorted ascending and <code>target = ${TARGET}</code>, find two positions whose values add up to target. Trying every pair costs O(n²). We will do it in O(n).`,
      },
      lines: [], watch: {}, verdict: "run", fit: ALL, scene: {},
    },
    {
      title: { vi: "Đặt hai con trỏ", en: "Place two pointers" }, kind: "concept",
      body: {
        vi: "<code>l</code> ở đầu mảng, <code>r</code> ở cuối mảng. Mọi cặp còn có thể đúng đều nằm trong khung <code>[l, r]</code>.",
        en: "<code>l</code> starts at the front, <code>r</code> at the back. Every pair that could still work lies inside the <code>[l, r]</code> frame.",
      },
      lines: [1], watch: { l: 0, r: 6 }, verdict: "run", fit: ALL,
      scene: {
        ...win(0, 6),
        pl: { x: 0, o: 1, from: { z: -1.1 }, dur: 520, ease: "back" },
        pr: { x: 6, o: 1, from: { z: -1.1 }, delay: 90, dur: 520, ease: "back" },
        c0: { cls: "is-active", fx: { type: "hop", delay: 200 } },
        c6: { cls: "is-active", fx: { type: "hop", delay: 290 } },
      },
    },
    {
      title: { vi: "Tổng quá lớn", en: "Sum too big" }, kind: "step",
      note: { vi: "Tổng lớn quá → bỏ số lớn nhất. Không cần thử 15 với ai khác nữa.", en: "Too big → drop the largest. 15 never needs to be tried again." },
      body: {
        vi: "<code>1 + 15 = 16 &gt; 14</code>. Vì 1 đã là số nhỏ nhất còn lại, 15 không ghép với ai ra 14 được. Bỏ 15: giảm <code>r</code>.",
        en: "<code>1 + 15 = 16 &gt; 14</code>. 1 is already the smallest value left, so 15 cannot pair with anything to make 14. Drop 15: move <code>r</code> left.",
      },
      lines: [3, 6], watch: { l: 0, r: 6, sum: 16, cmp: ">" }, verdict: "run", fit: ALL,
      scene: { ...win(0, 6), ...compare(0, 6, "gt"), c0: { cls: "is-active" }, c6: { cls: "is-active is-bad", delay: 900, fx: "shake" } },
    },
    {
      title: { vi: "Tổng quá nhỏ", en: "Sum too small" }, kind: "step",
      note: { vi: "Tổng nhỏ quá → bỏ số nhỏ nhất. Đối xứng với bước trước.", en: "Too small → drop the smallest. The mirror of the last step." },
      body: {
        vi: "<code>1 + 11 = 12 &lt; 14</code>. 11 đã là số lớn nhất còn lại, nên 1 không ghép được với ai. Bỏ 1: tăng <code>l</code>.",
        en: "<code>1 + 11 = 12 &lt; 14</code>. 11 is the largest value left, so 1 cannot pair with anything. Drop 1: move <code>l</code> right.",
      },
      lines: [3, 5], watch: { l: 0, r: 5, sum: 12, cmp: "<" }, verdict: "run", fit: ALL,
      scene: {
        ...win(0, 5), pr: { x: 5, o: 1, arc: 0.55, dur: 620 }, ...out(6), ...compare(0, 5, "lt"),
        c5: { cls: "is-active" }, c0: { cls: "is-active is-bad", delay: 900, fx: "shake" },
      },
    },
    {
      title: { vi: "Tìm thấy", en: "Found it" }, kind: "answer",
      body: {
        vi: "<code>3 + 11 = 14</code>. Trả về cặp vị trí <code>(1, 5)</code>. Camera thu lại vào khung đang xét.",
        en: "<code>3 + 11 = 14</code>. Return the positions <code>(1, 5)</code>. The camera closes in on the live frame.",
      },
      lines: [4], watch: { l: 1, r: 5, sum: 14, cmp: "=" }, verdict: "ac", fit: ["c1", "c5", "pl", "pr"],
      scene: {
        ...win(1, 5), pl: { x: 1, o: 1, arc: 0.55, dur: 620 }, ...out(0, 6), ...compare(1, 5, "eq"),
        win: { x: 3, w: 4 * U + 70, o: 1, cls: "is-good", delay: 900 },
        c1: { cls: "is-good", delay: 900, fx: { type: "hop", amp: 0.3 }, bob: 0.05 },
        c5: { cls: "is-good", delay: 960, fx: { type: "hop", amp: 0.3 }, bob: 0.05 },
      },
    },
    {
      title: { vi: "Vì sao là O(n)", en: "Why it is O(n)" }, kind: "recap",
      note: { vi: "Mỗi lần so sánh loại một phần tử, nên tổng số lần so sánh không vượt quá n.", en: "Every comparison rules out one element, so there are at most n comparisons." },
      body: {
        vi: "Mỗi bước loại đúng một phần tử khỏi khung <code>[l, r]</code>. Mảng có n phần tử nên có tối đa n − 1 bước. Bộ nhớ thêm là O(1).",
        en: "Each step removes exactly one element from the <code>[l, r]</code> frame. With n elements there are at most n − 1 steps. Extra memory is O(1).",
      },
      lines: [2, 7], watch: { l: 1, r: 5, sum: 14, cmp: "=" }, verdict: "ac", fit: ALL,
      scene: {
        ...win(1, 5), ...out(0, 6),
        arc: { ends: ["c1", "c5"], p: 1, cls: "v-eq" },
        sum: { o: 1, s: 1, cls: "v-eq", text: "3 + 11 = 14 ✓" },
        win: { x: 3, w: 4 * U + 70, o: 1, cls: "is-good" },
        c1: { cls: "is-good", bob: 0.05 },
        c5: { cls: "is-good", bob: 0.05 },
      },
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  scene.add("win", { shape: shapes.frame(), layer: "back", x: 3, w: 6 * U + 70, o: 0 });
  A.forEach((v, i) => scene.add(`c${i}`, { shape: shapes.block({ label: v, sub: i }), x: i, shadow: true }));
  scene.add("pl", { shape: shapes.pointer({ text: "l" }), x: 0, z: -0.5, o: 0 });
  scene.add("pr", { shape: shapes.pointer({ text: "r" }), x: 6, z: -0.5, o: 0 });
  scene.link("arc", { from: "c0", to: "c6" });
  scene.add("sum", { shape: shapes.pill(), follow: "arc", o: 0, s: 0.7 });
}
