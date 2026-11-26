import type { Lesson, SceneMap } from "../../../lib/types";

const A = [7, 2, 9, 1, 3];
const TARGET = 14;
const U = 62;
const CELLS = A.map((_, index) => `c${index + 1}`);
const SORTED = A.map((value, index) => ({ value, id: CELLS[index] }))
  .sort((a, b) => a.value - b.value);
const SCAN = [...CELLS, "pi", "pl", "pr", "sum"];

const sortedRow = (sort = false): SceneMap =>
  Object.fromEntries(SORTED.map(({ id }, x) => [id, {
    x,
    ...(sort ? { arc: x < 3 ? 1.25 : 0.35, dur: 520, delay: x === 0 || x === 3 ? 0 : 520 } : {}),
  }]));

const candidate = (i: number, l: number, r: number, result?: "lt" | "gt" | "eq"): SceneMap => {
  const anchor = SORTED[i].value;
  const left = SORTED[l].value;
  const right = SORTED[r].value;
  const total = anchor + left + right;
  const match = result === "eq";

  return {
    ...Object.fromEntries(SORTED.map(({ id }, x) => {
      const picked = x === i || x === l || x === r;
      const out = x !== i && (x < l || x > r);
      return [id, {
        x,
        cls: picked ? (match ? "is-good" : "is-active") : (out ? "is-out" : ""),
        o: out ? 0.5 : 1,
        ...(picked && match ? { delay: 850, fx: "hop" } : {}),
      }];
    })),
    pi: { x: i, o: 1, arc: 0.55, dur: 560 },
    pl: { x: l, o: 1, arc: 0.55, dur: 560 },
    pr: { x: r, o: 1, arc: 0.55, dur: 560 },
    win: { x: (l + r) / 2, w: (r - l) * U + 70, o: 1 },
    sum: result ? {
      text: `${anchor} + ${left} + ${right} = ${total}${match ? " ✓" : ` ${result === "lt" ? "<" : ">"} ${TARGET}`}`,
      o: 1, s: 1, from: { o: 0, s: 0.7 }, cls: `v-${result}`, delay: 620, dur: 320, ease: "back",
    } : { text: "" },
  };
};

export const lesson: Lesson = {
  track: "cp",
  topic: "two-pointers",
  slug: "three-sum",
  title: { vi: "Ba số có tổng cho trước", en: "Three numbers with a given sum" },
  added: "2026-11-27",
  summary: {
    vi: "Sắp xếp mảng, lần lượt cố định một số rồi dùng Two Pointers để tìm hai số còn lại.",
    en: "Sort the array, fix one value at a time, and use Two Pointers to find the other two.",
  },
  level: "medium",
  minutes: 9,
  time: "O(n²)",
  memory: "O(n)",
  goal: { vi: `Tìm ba vị trí khác nhau có tổng <b>${TARGET}</b>`, en: `Find three distinct positions that sum to <b>${TARGET}</b>` },
  codeLang: "C++17",
  code: [
    'array&lt;<span class="kw">int</span>, 3&gt; threeSum(<span class="kw">const</span> vector&lt;<span class="kw">int</span>&gt;&amp; a, <span class="kw">long long</span> target) {',
    '  vector&lt;pair&lt;<span class="kw">int</span>, <span class="kw">int</span>&gt;&gt; b;',
    '  <span class="kw">for</span> (<span class="kw">int</span> j = 0; j &lt; (int)a.size(); ++j) b.emplace_back(a[j], j + 1);',
    '  sort(b.begin(), b.end());',
    '  <span class="kw">int</span> n = b.size();',
    '  <span class="kw">for</span> (<span class="kw">int</span> i = 0; i + 2 &lt; n; ++i) {',
    '    <span class="kw">int</span> l = i + 1, r = n - 1;',
    '    <span class="kw">while</span> (l &lt; r) {',
    '      <span class="kw">long long</span> s = 0LL + b[i].first + b[l].first + b[r].first;',
    '      <span class="kw">if</span> (s == target) <span class="kw">return</span> {b[i].second, b[l].second, b[r].second};',
    '      <span class="kw">if</span> (s &lt; target) ++l; <span class="kw">else</span> --r;',
    '    }',
    '  }',
    '  <span class="kw">return</span> {-1, -1, -1};',
    '}',
  ],
  watch: [
    { key: "i", label: "i" },
    { key: "l", label: "l" },
    { key: "r", label: "r" },
    { key: "s", label: "s" },
  ],
  practice: [
    { src: "CSES 1641", name: "Sum of Three Values", lv: "★★☆", url: "https://cses.fi/problemset/task/1641" },
    { src: "LeetCode 15", name: "3Sum", lv: "★★☆", url: "https://leetcode.com/problems/3sum/" },
    { src: "CSES 1642", name: "Sum of Four Values", lv: "★★★", url: "https://cses.fi/problemset/task/1642" },
  ],
  sceneOptions: { unit: U, view: [-60, -170, 365, 280] },
  legend: [
    { cls: "acc", label: { vi: "đang xét", en: "current" } },
    { cls: "dim", label: { vi: "ngoài đoạn tìm cặp", en: "outside pair window" } },
    { cls: "ac", label: { vi: "bộ ba tìm được", en: "matching triple" } },
  ],
  entrance: CELLS,
  steps: [
    {
      title: { vi: "Bài toán", en: "The problem" }, kind: "problem",
      body: {
        vi: "Trong mảng <code>[7, 2, 9, 1, 3]</code>, tìm ba vị trí khác nhau có tổng bằng 14. Thử mọi bộ ba mất O(n³).",
        en: "Find three distinct positions in <code>[7, 2, 9, 1, 3]</code> whose values add to 14. Trying every triple takes O(n³).",
      },
      lines: [], watch: {}, verdict: "run", fit: CELLS, scene: { sum: { text: "" } },
    },
    {
      title: { vi: "Sắp xếp các cặp", en: "Sort the pairs" }, kind: "concept",
      body: {
        vi: "Sắp xếp theo giá trị để được <code>[1, 2, 3, 7, 9]</code>. Số nhỏ dưới mỗi ô là vị trí ban đầu, đếm từ 1, và đi theo giá trị khi ô đổi chỗ.",
        en: "Sort by value to get <code>[1, 2, 3, 7, 9]</code>. The small number under each cell is its original one-based position and moves with the value.",
      },
      lines: [2, 3, 4], watch: {}, verdict: "run", fit: CELLS, scene: { ...sortedRow(true), sum: { text: "" } },
    },
    {
      title: { vi: "Cố định số 1", en: "Fix the value 1" }, kind: "concept",
      body: {
        vi: "Đặt <code>i = 0</code> để cố định số 1. Hai con trỏ <code>l = 1</code> và <code>r = 4</code> tìm hai số có tổng <code>14 − 1 = 13</code> trong phần bên phải.",
        en: "Set <code>i = 0</code> to fix the value 1. Start <code>l = 1</code> and <code>r = 4</code> to find two values on the right that add to <code>14 − 1 = 13</code>.",
      },
      lines: [6, 7], watch: { i: 0, l: 1, r: 4 }, verdict: "run", fit: SCAN, scene: candidate(0, 1, 4),
    },
    {
      title: { vi: "Tăng con trỏ trái", en: "Advance the left pointer" }, kind: "step",
      body: {
        vi: "<code>1 + 2 + 9 = 12 &lt; 14</code>. Với số 1 cố định, ghép 2 với số lớn nhất là 9 vẫn thiếu, nên tăng <code>l</code> để bỏ qua 2.",
        en: "<code>1 + 2 + 9 = 12 &lt; 14</code>. With 1 fixed, even pairing 2 with the largest value, 9, falls short, so advance <code>l</code> past 2.",
      },
      lines: [9, 11], watch: { i: 0, l: 1, r: 4, s: 12 }, verdict: "run", fit: SCAN, scene: candidate(0, 1, 4, "lt"),
    },
    {
      title: { vi: "Tổng vẫn còn thiếu", en: "The sum still falls short" }, kind: "step",
      body: {
        vi: "<code>1 + 3 + 9 = 13 &lt; 14</code>. Cặp có số 3 vẫn không thể đạt tổng cần tìm, nên <code>l</code> tiến thêm một ô đến số 7.",
        en: "<code>1 + 3 + 9 = 13 &lt; 14</code>. Even the largest pair using 3 falls short, so <code>l</code> moves one more cell to 7.",
      },
      lines: [9, 11], watch: { i: 0, l: 2, r: 4, s: 13 }, verdict: "run", fit: SCAN, scene: candidate(0, 2, 4, "lt"),
    },
    {
      title: { vi: "Lùi con trỏ phải", en: "Move the right pointer" }, kind: "step",
      body: {
        vi: "<code>1 + 7 + 9 = 17 &gt; 14</code>. Số 7 đã là đầu trái của đoạn đang xét, nên bỏ 9 bằng cách giảm <code>r</code>. Khi <code>l = r = 3</code>, lượt tìm với số 1 kết thúc.",
        en: "<code>1 + 7 + 9 = 17 &gt; 14</code>. Since 7 is already the leftmost remaining value, drop 9 by decreasing <code>r</code>. At <code>l = r = 3</code>, the scan for 1 ends.",
      },
      lines: [8, 9, 11], watch: { i: 0, l: 3, r: 4, s: 17 }, verdict: "run", fit: SCAN, scene: candidate(0, 3, 4, "gt"),
    },
    {
      title: { vi: "Đổi sang số 2", en: "Fix the value 2" }, kind: "step",
      body: {
        vi: "Tăng <code>i</code> lên 1 để cố định số 2. Mở lại đoạn tìm cặp bằng <code>l = 2</code> và <code>r = 4</code>, tức số 3 và số 9.",
        en: "Advance <code>i</code> to 1 to fix the value 2. Reset the pair window to <code>l = 2</code> and <code>r = 4</code>, at the values 3 and 9.",
      },
      lines: [6, 7], watch: { i: 1, l: 2, r: 4 }, verdict: "run", fit: SCAN, scene: candidate(1, 2, 4),
    },
    {
      title: { vi: "Trả về ba vị trí", en: "Return three positions" }, kind: "answer",
      body: {
        vi: "<code>2 + 3 + 9 = 14</code>. Đọc số dưới ba ô để trả về vị trí ban đầu <code>(2, 5, 3)</code>.",
        en: "<code>2 + 3 + 9 = 14</code>. Read the labels below those cells to return the original positions <code>(2, 5, 3)</code>.",
      },
      lines: [9, 10], watch: { i: 1, l: 2, r: 4, s: 14 }, verdict: "ac", fit: SCAN, scene: candidate(1, 2, 4, "eq"),
    },
    {
      title: { vi: "Vì sao là O(n²)", en: "Why it takes O(n²)" }, kind: "recap",
      body: {
        vi: "Mỗi bộ ba có đúng một vị trí trái nhất trong mảng đã sắp xếp, và vòng ngoài lần lượt chọn các vị trí đó. Với mỗi <code>i</code>, hai con trỏ chỉ đi vào trong, nên tổng thời gian là O(n²), kể cả bước sắp xếp. Các cặp giá trị và vị trí chiếm O(n) bộ nhớ phụ.",
        en: "Each triple has one leftmost position in sorted order, and the outer loop considers each possible leftmost position. For each <code>i</code>, both pointers move only inward, so the total time is O(n²), including sorting. The value–position pairs use O(n) extra space.",
      },
      lines: [6, 8, 11], watch: { i: 1, l: 2, r: 4, s: 14 }, verdict: "ac", fit: [...CELLS, "sum"],
      scene: {
        ...sortedRow(),
        c2: { x: 1, cls: "is-good" },
        c5: { x: 2, cls: "is-good" },
        c3: { x: 4, cls: "is-good" },
        sum: { text: "2 + 3 + 9 = 14 ✓", o: 1, cls: "v-eq" },
      },
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("win", { shape: shapes.frame(), layer: "back", x: 2, w: 0, o: 0 });
  A.forEach((value, x) => scene.add(CELLS[x], { shape: shapes.block({ label: value, sub: x + 1 }), x, shadow: true }));
  scene.add("pi", { shape: shapes.pointer({ text: "i" }), x: 0, z: -0.5, o: 0 });
  scene.add("pl", { shape: shapes.pointer({ text: "l" }), x: 1, z: -0.5, o: 0 });
  scene.add("pr", { shape: shapes.pointer({ text: "r" }), x: 4, z: -0.5, o: 0 });
  scene.add("sum", { shape: shapes.pill(), x: 2, z: 1.4, o: 0 });
}
