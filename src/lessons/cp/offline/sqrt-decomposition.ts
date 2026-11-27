import type { Lesson, SceneMap } from "../../../lib/types";

const A = [3, 1, 4, 1, 5, 9, 2, 6];
const B = Math.ceil(Math.sqrt(A.length));
const U = 43;
const L = 1, R = 6;
const ARRAY_FIT = ["a0", "a7"];
const BLOCK_FIT = [...ARRAY_FIT, "sum1"];
const CALC_FIT = [...BLOCK_FIT, "calc"];
const UPDATED = A.map((value, i) => i === 4 ? 7 : value);
const blocks = Array.from({ length: Math.ceil(A.length / B) }, (_, b) => {
  const first = b * B, last = Math.min(first + B, A.length) - 1;
  return { first, last, center: (first + last) / 2 };
});
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
const blockValues = (a: number[], b: number) => a.slice(blocks[b].first, blocks[b].last + 1);
const blockFormula = (a: number[], b: number) => {
  const values = blockValues(a, b);
  return `${values.join("+")} = ${sum(values)}`;
};

function picture(a: number[], showBlocks = false, focus: number[] = [], grouped = -1, formula = ""): SceneMap {
  const state: SceneMap = {
    calc: { text: formula, o: formula ? 1 : 0, delay: 240, cls: grouped >= 0 ? "v-eq" : "" },
  };
  a.forEach((value, i) => {
    state[`a${i}`] = { text: String(value), cls: focus.includes(i) ? "is-active" : "" };
  });
  blocks.forEach((_, b) => {
    state[`frame${b}`] = { o: showBlocks ? 1 : 0, cls: b === grouped ? "is-good" : "" };
    state[`sum${b}`] = {
      text: blockFormula(a, b),
      o: showBlocks ? 1 : 0,
      cls: b === grouped ? "v-eq" : "",
      delay: 170 + 90 * b,
    };
  });
  return state;
}

export const lesson: Lesson = {
  track: "cp", topic: "offline", slug: "sqrt-decomposition",
  title: { vi: "Chia căn", en: "Square-root decomposition" },
  added: "2026-11-27",
  summary: {
    vi: "Lưu tổng từng khối để đọc nhanh cả khối và vẫn sửa được một ô trong O(1).",
    en: "Cache each block sum to read whole blocks quickly while keeping point updates O(1).",
  },
  level: "hard", minutes: 8, time: "O(n) build · O(√n) query · O(1) update", memory: "O(√n)",
  goal: { vi: "Tính tổng <b>a[1..6]</b> trước và sau khi đổi <b>a[4]</b>", en: "Sum <b>a[1..6]</b> before and after changing <b>a[4]</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> B = ceil(sqrt(n));',
    'vector&lt;<span class="kw">long long</span>&gt; s((n + B - 1) / B);',
    '<span class="kw">for</span> (<span class="kw">int</span> i = 0; i &lt; n; ++i) s[i/B] += a[i];',
    '<span class="kw">auto</span> query = [&amp;](<span class="kw">int</span> l, <span class="kw">int</span> r) {',
    '  <span class="kw">long long</span> ans = 0;',
    '  <span class="kw">while</span> (l &lt;= r) {',
    '    <span class="kw">if</span> (l % B == 0 &amp;&amp; r - l + 1 &gt;= B)',
    '      ans += s[l/B], l += B;',
    '    <span class="kw">else</span> ans += a[l++];',
    '  } <span class="kw">return</span> ans;',
    '};',
    '<span class="kw">auto</span> set = [&amp;](<span class="kw">int</span> i, <span class="kw">long long</span> x) {',
    '  s[i/B] += x - a[i]; a[i] = x;',
    '};',
  ],
  watch: [{ key: "b", label: "B" }, { key: "range", label: "[l, r]" }, { key: "ans", label: "ans" }],
  practice: [
    { src: "CSES 1648", name: "Dynamic Range Sum Queries", lv: "★★☆", url: "https://cses.fi/problemset/task/1648" },
    { src: "Codeforces 13E", name: "Holes", lv: "★★★", url: "https://codeforces.com/problemset/problem/13/E" },
  ],
  sceneOptions: { unit: U, view: [-46, -120, 397, 261] },
  legend: [
    { cls: "acc", label: { vi: "ô đang xét", en: "cells in focus" } },
    { cls: "ac", label: { vi: "tổng khối đang dùng hoặc đáp án", en: "block sum in use or answer" } },
  ],
  entrance: A.map((_, i) => `a${i}`),
  steps: [
    {
      title: { vi: "Hỏi tổng một đoạn", en: "Query a range sum" }, kind: "problem",
      body: {
        vi: "Mảng có 8 ô, đánh số từ 0. Cộng từng ô từ 1 đến 6 mất 6 lượt đọc, có thể lên đến O(n) mỗi truy vấn. Giá trị trong mảng còn có thể thay đổi giữa hai câu hỏi.",
        en: "The array has 8 cells indexed from 0. Adding cells 1 through 6 takes 6 reads, which can grow to O(n) per query. Values can also change between queries.",
      },
      lines: [], watch: { range: `[${L}, ${R}]` }, verdict: "run", fit: ARRAY_FIT,
      scene: picture(A, false, [1, 2, 3, 4, 5, 6]),
    },
    {
      title: { vi: "Tính tổng từng khối", en: "Sum each block" }, kind: "concept",
      body: {
        vi: "Chọn <code>B = ⌈√8⌉ = 3</code>. Ba khối là <code>[0,2]</code>, <code>[3,5]</code> và <code>[6,7]</code>, với tổng lần lượt là 8, 15 và 8. Khối cuối chỉ có 2 ô.",
        en: "Choose <code>B = ⌈√8⌉ = 3</code>. The blocks <code>[0,2]</code>, <code>[3,5]</code>, and <code>[6,7]</code> sum to 8, 15, and 8. The last block has just 2 cells.",
      },
      lines: [1, 2, 3], watch: { b: B }, verdict: "run", fit: BLOCK_FIT,
      scene: picture(A, true),
    },
    {
      title: { vi: "Cộng phần đầu lẻ", en: "Scan the left edge" }, kind: "step",
      body: {
        vi: "<code>l = 1</code> nằm giữa khối đầu. Cộng riêng <code>a[1] + a[2] = 1 + 4 = 5</code>, rồi dừng ở đầu khối tiếp theo, <code>l = 3</code>.",
        en: "<code>l = 1</code> lies inside the first block. Add <code>a[1] + a[2] = 1 + 4 = 5</code> one cell at a time, stopping at the next block start, <code>l = 3</code>.",
      },
      lines: [4, 5, 6, 7, 9], watch: { b: B, range: "[3, 6]", ans: 5 }, verdict: "run", fit: CALC_FIT,
      scene: picture(A, true, [1, 2], -1, "1 + 4 = 5"),
    },
    {
      title: { vi: "Lấy cả khối giữa", en: "Take the middle block" }, kind: "step",
      body: {
        vi: "Từ <code>l = 3</code>, cả 3 ô của khối giữa đều nằm trong đoạn hỏi. Dùng ngay <code>s[1] = 15</code>, cộng thành 20 rồi nhảy tới <code>l = 6</code>.",
        en: "From <code>l = 3</code>, all 3 cells of the middle block are inside the query. Read <code>s[1] = 15</code>, bringing the sum to 20, and jump to <code>l = 6</code>.",
      },
      lines: [6, 7, 8], watch: { b: B, range: "[6, 6]", ans: 20 }, verdict: "run", fit: CALC_FIT,
      scene: picture(A, true, [3, 4, 5], 1, "5 + 15 = 20"),
    },
    {
      title: { vi: "Chốt tổng bằng ô cuối", en: "Finish with one cell" }, kind: "answer",
      body: {
        vi: "Đoạn hỏi chỉ lấy ô 6 của khối cuối. Cộng <code>a[6] = 2</code> vào 20 để được 22. Ta đọc 3 ô lẻ và 1 tổng khối.",
        en: "The query takes only cell 6 from the last block. Add <code>a[6] = 2</code> to 20 to get 22. We read 3 individual cells and 1 cached sum.",
      },
      lines: [7, 9, 10], watch: { b: B, range: "[1, 6]", ans: 22 }, verdict: "ac", fit: CALC_FIT,
      scene: picture(A, true, [6], 1, "20 + 2 = 22"),
    },
    {
      title: { vi: "Sửa đúng một khối", en: "Update just one block" }, kind: "step",
      body: {
        vi: "Đổi <code>a[4]</code> từ 5 thành 7. Chỉ khối <code>4 / 3 = 1</code> theo phép chia nguyên thay đổi. Cộng chênh lệch 2 vào tổng cũ 15 để được 17.",
        en: "Change <code>a[4]</code> from 5 to 7. Only block <code>4 / 3 = 1</code> under integer division changes. Add the difference of 2 to its old sum of 15 to get 17.",
      },
      lines: [12, 13], watch: { b: B }, verdict: "ac", fit: CALC_FIT,
      scene: picture(UPDATED, true, [4], 1, "15 + (7 − 5) = 17"),
    },
    {
      title: { vi: "Cân bằng hai phần", en: "Balance both costs" }, kind: "recap",
      body: {
        vi: "Hỏi lại được <code>5 + 17 + 2 = 24</code> vì mỗi ô thuộc đúng một phần đã cộng. Hai mép tốn O(B) lượt đọc ô, phần giữa dùng O(n/B) tổng khối, nên chọn B gần √n. Dựng khối tốn O(n), sửa một ô tốn O(1).",
        en: "The query now gives <code>5 + 17 + 2 = 24</code> because each cell is counted exactly once. The two edges take O(B) cell reads and the middle uses O(n/B) cached sums, so choose B near √n. Building takes O(n), and a point update takes O(1).",
      },
      lines: [6, 7, 8, 9, 13], watch: { b: B, range: "[1, 6]", ans: 24 }, verdict: "ac", fit: CALC_FIT,
      scene: picture(UPDATED, true, [1, 2, 6], 1, "5 + 17 + 2 = 24"),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  blocks.forEach(({ first, last, center }, b) => {
    scene.add(`frame${b}`, { shape: shapes.frame({ h: 43, top: -40, r: 7 }), layer: "back", x: center, w: (last - first) * U + 41, o: 0 });
    scene.add(`sum${b}`, { shape: shapes.pill({ pad: 6 }), x: center, y: 3, o: 0 });
  });
  A.forEach((v, i) => scene.add(`a${i}`, { shape: shapes.block({ label: v, sub: i, w: 35, h: 32, depth: 4, r: 6 }), x: i }));
  scene.add("calc", { shape: shapes.pill(), x: 3.5, y: 4.7, o: 0 });
}
