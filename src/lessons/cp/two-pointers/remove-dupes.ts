import type { Lesson, SceneMap } from "../../../lib/types";

const A = [1, 1, 2, 2, 4, 4];
const U = 62;
const CELLS = A.map((_, i) => `c${i}`);
const SCAN = [...CELLS, "pi", "pk"];

const row = (values: number[], k = 0, i = 0): SceneMap =>
  Object.fromEntries(values.map((value, index) => [`c${index}`, {
    text: String(value),
    cls: index < k ? "is-good" : index < i ? "is-out" : "",
    o: index >= k && index < i ? 0.5 : 1,
  }]));

const pointers = (i: number, k: number): SceneMap => ({
  pi: { x: i + (i === k ? 0.27 : 0), o: 1, arc: 0.55, dur: 620 },
  pk: { x: k - (i === k ? 0.27 : 0), o: 1, arc: 0.55, dur: 620 },
});

const copy = (i: number, dest: number): SceneMap => ({
  write: { ends: [`c${i}`, `c${dest}`], p: 1, from: { p: 0 }, cls: "v-eq", delay: 280, dur: 420 },
  [`c${i}`]: { text: String(A[i]), cls: "is-active" },
  [`c${dest}`]: { text: String(A[i]), cls: "is-good", delay: 700, fx: "pulse" },
});

const skipped = (i: number): SceneMap => ({
  [`c${i}`]: { text: String(A[i]), cls: "is-out", o: 0.5, delay: 650, dur: 300 },
});

const AFTER_TWO = [1, 2, 2, 2, 4, 4];
const AFTER_FOUR = [1, 2, 4, 2, 4, 4];

export const lesson: Lesson = {
  track: "cp",
  topic: "two-pointers",
  slug: "remove-dupes",
  title: { vi: "Xoá phần tử trùng tại chỗ", en: "Remove duplicates in place" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng con trỏ đọc và con trỏ ghi để dồn các giá trị phân biệt về đầu mảng đã sắp xếp.",
    en: "Use read and write pointers to compact the distinct values into the front of a sorted array.",
  },
  level: "basic",
  minutes: 7,
  time: "O(n)",
  memory: "O(1)",
  goal: { vi: "Dồn <b>[1, 2, 4]</b> về đầu mảng <code>a</code>", en: "Compact <b>[1, 2, 4]</b> into the front of <code>a</code>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> removeDuplicates(vector&lt;<span class="kw">int</span>&gt;&amp; a) {',
    '  <span class="kw">if</span> (a.empty()) <span class="kw">return</span> <span class="nm">0</span>;',
    '  <span class="kw">int</span> k = <span class="nm">1</span>;',
    '  <span class="kw">for</span> (<span class="kw">int</span> i = <span class="nm">1</span>; i &lt; (int)a.size(); ++i) {',
    '    <span class="kw">if</span> (a[i] == a[k - <span class="nm">1</span>]) <span class="kw">continue</span>;',
    '    a[k] = a[i];',
    '    ++k;',
    '  }',
    '  <span class="kw">return</span> k;',
    '}',
  ],
  watch: [
    { key: "i", label: "i" },
    { key: "k", label: "k" },
    { key: "prefix", label: { vi: "đoạn đã giữ", en: "kept prefix" } },
  ],
  practice: [
    { src: "LeetCode 26", name: "Remove Duplicates from Sorted Array", lv: "★☆☆", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
    { src: "CSES 1090", name: "Ferris Wheel", lv: "★★☆", url: "https://cses.fi/problemset/task/1090" },
  ],
  sceneOptions: { unit: U, view: [-60, -145, 430, 255] },
  legend: [
    { cls: "acc", label: { vi: "đang đọc", en: "reading" } },
    { cls: "ac", label: { vi: "đã giữ", en: "kept" } },
    { cls: "dim", label: { vi: "đã duyệt ngoài đoạn giữ", en: "scanned outside prefix" } },
  ],
  entrance: CELLS,
  steps: [
    {
      title: { vi: "Bài toán", en: "The problem" }, kind: "problem",
      body: {
        vi: "Từ mảng đã sắp xếp <code>[1, 1, 2, 2, 4, 4]</code>, giữ mỗi giá trị một lần ngay trong mảng. Nếu cứ xoá một ô rồi dịch cả đoạn phía sau, trường hợp xấu nhất mất O(n²).",
        en: "Keep one copy of each value in the sorted array <code>[1, 1, 2, 2, 4, 4]</code> using the same array. Erasing a cell and shifting the suffix each time can cost O(n²).",
      },
      lines: [], watch: {}, verdict: "run", fit: CELLS, scene: row(A),
    },
    {
      title: { vi: "Giữ số đầu tiên", en: "Keep the first value" }, kind: "concept",
      body: {
        vi: "Giữ <code>a[0] = 1</code> và đặt <code>k = 1</code>. <code>i</code> đọc từ ô 1, còn <code>k</code> chỉ ô sẽ ghi khi gặp giá trị mới.",
        en: "Keep <code>a[0] = 1</code> and set <code>k = 1</code>. <code>i</code> reads from index 1, while <code>k</code> marks where the next new value will go.",
      },
      lines: [2, 4], watch: { i: 1, k: 1, prefix: "[1]" }, verdict: "run", fit: SCAN,
      scene: { ...row(A, 1, 1), ...pointers(1, 1), c1: { text: "1", cls: "is-active" } },
    },
    {
      title: { vi: "Bỏ qua số 1", en: "Skip the repeated 1" }, kind: "step",
      body: {
        vi: "<code>a[1] = a[k − 1] = 1</code>, nên bỏ qua ô 1. <code>i</code> sẽ tiến đến 2, còn <code>k</code> vẫn ở 1.",
        en: "<code>a[1] = a[k − 1] = 1</code>, so skip index 1. <code>i</code> will advance to 2 and <code>k</code> stays at 1.",
      },
      lines: [5], watch: { i: 1, k: 1, prefix: "[1]" }, verdict: "run", fit: SCAN,
      scene: { ...row(A, 1, 1), ...pointers(1, 1), ...skipped(1) },
    },
    {
      title: { vi: "Ghi số 2", en: "Write the value 2" }, kind: "step",
      body: {
        vi: "<code>a[2] = 2</code> khác số 1 vừa giữ. Ghi 2 vào <code>a[1]</code> rồi tăng <code>k</code> lên 2.",
        en: "<code>a[2] = 2</code> differs from the last kept value, 1. Write 2 to <code>a[1]</code>, then advance <code>k</code> to 2.",
      },
      lines: [5, 6, 7], watch: { i: 2, k: 2, prefix: "[1, 2]" }, verdict: "run", fit: SCAN,
      scene: {
        ...row(AFTER_TWO, 2, 2),
        pi: { x: 2, o: 1, arc: 0.55, dur: 560 },
        pk: { x: 1.73, o: 1, delay: 740, dur: 480 },
        ...copy(2, 1),
      },
    },
    {
      title: { vi: "Bỏ qua số 2", en: "Skip the repeated 2" }, kind: "step",
      body: {
        vi: "Đọc <code>a[3] = 2</code> và so với số 2 ở ô 1 vừa ghi. Hai số bằng nhau nên <code>k</code> vẫn ở 2.",
        en: "Read <code>a[3] = 2</code> and compare it with the 2 just written at index 1. They are equal, so <code>k</code> stays at 2.",
      },
      lines: [5], watch: { i: 3, k: 2, prefix: "[1, 2]" }, verdict: "run", fit: SCAN,
      scene: { ...row(AFTER_TWO, 2, 3), ...pointers(3, 2), ...skipped(3) },
    },
    {
      title: { vi: "Ghi số 4", en: "Write the value 4" }, kind: "step",
      body: {
        vi: "<code>a[4] = 4</code> khác số 2 vừa giữ. Ghi 4 vào ô 2 rồi tăng <code>k</code> lên 3.",
        en: "<code>a[4] = 4</code> differs from the last kept value, 2. Write 4 at index 2, then advance <code>k</code> to 3.",
      },
      lines: [5, 6, 7], watch: { i: 4, k: 3, prefix: "[1, 2, 4]" }, verdict: "run", fit: SCAN,
      scene: {
        ...row(AFTER_FOUR, 3, 4),
        pi: { x: 4, o: 1, arc: 0.55, dur: 560 },
        pk: { x: 3, o: 1, delay: 740, dur: 480 },
        ...copy(4, 2),
      },
    },
    {
      title: { vi: "Trả về độ dài", en: "Return the length" }, kind: "answer",
      body: {
        vi: "Ô cuối <code>a[5] = 4</code> trùng với số 4 ở ô 2. Trả về <code>k = 3</code>: ba ô đầu là <code>[1, 2, 4]</code>, phần sau có thể bỏ qua.",
        en: "The final cell <code>a[5] = 4</code> repeats the 4 at index 2. Return <code>k = 3</code>: the first three cells are <code>[1, 2, 4]</code>, and the suffix can be ignored.",
      },
      lines: [5, 9], watch: { i: 5, k: 3, prefix: "[1, 2, 4]" }, verdict: "ac", fit: SCAN,
      scene: {
        ...row(AFTER_FOUR, 3, 5), ...pointers(5, 3), ...skipped(5),
        kept: { x: 1, w: 2 * U + 70, o: 1, cls: "is-good", delay: 950 },
      },
    },
    {
      title: { vi: "Vì sao ghi an toàn", en: "Why writes are safe" }, kind: "recap",
      body: {
        vi: "Mảng đã sắp xếp nên các bản sao đứng liền nhau. Trước mỗi lần ghi, <code>k ≤ i</code>, nên ô ghi chỉ có thể là ô đã đọc hoặc chính ô đang đọc. Duyệt một lượt mất O(n) thời gian và O(1) bộ nhớ phụ.",
        en: "Equal values are adjacent in a sorted array. Before each write, <code>k ≤ i</code>, so the destination is a previously read cell or the current one. One pass takes O(n) time and O(1) extra space.",
      },
      lines: [4, 6, 9], watch: { k: 3, prefix: "[1, 2, 4]" }, verdict: "ac", fit: CELLS,
      scene: {
        ...row(AFTER_FOUR, 3, A.length),
        kept: { x: 1, w: 2 * U + 70, o: 1, cls: "is-good" },
      },
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("kept", { shape: shapes.frame(), layer: "back", x: 1, w: 2 * U + 70, o: 0 });
  A.forEach((value, i) => scene.add(`c${i}`, { shape: shapes.block({ label: value, sub: i }), x: i, shadow: true }));
  scene.add("pi", { shape: shapes.pointer({ text: "i" }), x: 1.27, z: -0.5, o: 0 });
  scene.add("pk", { shape: shapes.pointer({ text: "k" }), x: 0.73, z: -0.5, o: 0 });
  scene.link("write", { from: "c2", to: "c1" });
}
