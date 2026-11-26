import type { Lesson, SceneEntry, SceneMap } from "../../../lib/types";

const A = [
  [2, 1, 3, 4],
  [5, 2, 1, 3],
  [4, 0, 6, 2],
  [1, 3, 2, 5],
];
const N = A.length, M = A[0].length;
const PRE = Array.from({ length: N + 1 }, () => Array<number>(M + 1).fill(0));
A.forEach((row, r) => row.forEach((v, c) => {
  PRE[r + 1][c + 1] = v + PRE[r][c + 1] + PRE[r + 1][c] - PRE[r][c];
}));

const U = 58;
const ROW = 2.36;
const PRE_X = 4.7;
const GRID = ["labA", "a00", "a33"];
const TABLE = [...GRID, "labP", "p00", "p44"];
const WITH_CALC = [...TABLE, "calc"];

// The prefix table always supplies its labels, even when hidden.
function table(known: number, marks: SceneMap = {}): SceneMap {
  return Object.fromEntries(PRE.flatMap((row, r) => row.map((v, c) => {
    const id = `p${r}${c}`;
    const ready = r === 0 || c === 0 || (r - 1) * M + c <= known;
    return [id, {
      text: ready ? String(v) : "?",
      o: known < 0 ? 0 : ready ? 1 : 0.36,
      cls: ready ? "" : "is-out",
      ...marks[id],
    }];
  })));
}
const grid = (mark: (r: number, c: number) => SceneEntry): SceneMap =>
  Object.fromEntries(A.flatMap((row, r) => row.map((_, c) => [`a${r}${c}`, mark(r, c)])));
const active = { cls: "is-active" };
const removed = { cls: "is-bad" };
const good = { cls: "is-good" };
const outside = { cls: "is-out", o: 0.35 };
const query = grid((r, c) => r >= 1 && c >= 2 ? active : outside);
const answer = grid((r, c) => r >= 1 && c >= 2 ? good : outside);
const corners = { p44: active, p14: removed, p42: removed, p12: good };
const calc = (text = "", cls = "", delay = 400): SceneMap => ({
  calc: text
    ? { text, cls, o: 1, from: { o: 0, s: 0.8 }, ease: "back", dur: 320, delay }
    : { text, o: 0 },
});

export const lesson: Lesson = {
  track: "cp",
  topic: "prefix-sum",
  slug: "prefix-2d",
  title: { vi: "Prefix sum 2 chiều", en: "2D prefix sums" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng bốn ô trong bảng prefix sum để tính tổng một hình chữ nhật trong O(1).",
    en: "Use four entries in a prefix sum table to find a rectangle's sum in O(1).",
  },
  level: "basic",
  minutes: 8,
  time: "O(nm + q)",
  memory: "O(nm)",
  goal: {
    vi: "Tính tổng vùng từ <b>(1, 2)</b> đến <b>(3, 3)</b> trên lưới 4×4",
    en: "Sum the rectangle from <b>(1, 2)</b> to <b>(3, 3)</b> in a 4×4 grid",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">vector</span>&lt;<span class="kw">vector</span>&lt;<span class="kw">long long</span>&gt;&gt; pre(n + 1, <span class="kw">vector</span>&lt;<span class="kw">long long</span>&gt;(m + 1, 0));',
    '<span class="kw">for</span> (<span class="kw">int</span> r = 0; r &lt; n; ++r)',
    '  <span class="kw">for</span> (<span class="kw">int</span> c = 0; c &lt; m; ++c)',
    '    pre[r+1][c+1] = a[r][c] + pre[r][c+1] + pre[r+1][c] - pre[r][c];',
    '',
    '<span class="kw">auto</span> sum = [&amp;](<span class="kw">int</span> r1, <span class="kw">int</span> c1, <span class="kw">int</span> r2, <span class="kw">int</span> c2) {',
    '  <span class="kw">return</span> pre[r2+1][c2+1] - pre[r1][c2+1]',
    '       - pre[r2+1][c1] + pre[r1][c1];',
    '};',
  ],
  watch: [
    { key: "cell", label: { vi: "ô đang điền", en: "cell being filled" } },
    { key: "pre", label: { vi: "tổng prefix", en: "prefix total" } },
    { key: "sum", label: { vi: "tổng đang tính", en: "current sum" } },
  ],
  practice: [
    { src: "CSES 1652", name: "Forest Queries", lv: "★★☆", url: "https://cses.fi/problemset/task/1652" },
    { src: "LeetCode 304", name: "Range Sum Query 2D - Immutable", lv: "★★☆", url: "https://leetcode.com/problems/range-sum-query-2d-immutable/" },
  ],
  sceneOptions: { unit: U, view: [-55, -100, 630, 500] },
  legend: [
    { cls: "acc", label: { vi: "đang xét", en: "in use" } },
    { cls: "wa", label: { vi: "vùng bị trừ", en: "subtracted area" } },
    { cls: "ac", label: { vi: "ô mới, góc cộng lại hoặc kết quả", en: "new entry, restored corner, or result" } },
  ],
  entrance: A.flatMap((row, r) => row.map((_, c) => `a${r}${c}`)),
  steps: [
    {
      title: { vi: "Tổng hình chữ nhật", en: "Sum a rectangle" }, kind: "problem",
      body: {
        vi: "Trên lưới 4×4 đánh số từ 0, vùng từ <code>(1, 2)</code> đến <code>(3, 3)</code> có 6 ô. Nếu cộng lại từng ô cho mỗi truy vấn, trường hợp xấu nhất tốn O(nm) cho một truy vấn.",
        en: "In the zero-indexed 4×4 grid, the rectangle from <code>(1, 2)</code> to <code>(3, 3)</code> has 6 cells. Adding the cells from scratch can cost O(nm) per query.",
      },
      lines: [], watch: {}, verdict: "run", fit: GRID,
      scene: { ...query, ...table(-1), ...calc() },
    },
    {
      title: { vi: "Thêm hàng và cột 0", en: "Pad with zeros" }, kind: "concept",
      body: {
        vi: "<code>pre[r][c]</code> là tổng hình chữ nhật gồm <code>r</code> hàng đầu và <code>c</code> cột đầu. Lưới 4×4 cần bảng 5×5, với hàng 0 và cột 0 bằng 0 vì các vùng đó rỗng.",
        en: "<code>pre[r][c]</code> sums the rectangle formed by the first <code>r</code> rows and first <code>c</code> columns. The 4×4 grid needs a 5×5 table, with row 0 and column 0 set to 0 for empty rectangles.",
      },
      lines: [1], watch: { cell: "pre[0][0]", pre: 0 }, verdict: "run", fit: TABLE,
      scene: { labP: { o: 1 }, ...table(0, { p00: good }), ...calc() },
    },
    {
      title: { vi: "Điền một ô", en: "Fill one entry" }, kind: "step",
      body: {
        vi: "Để tính <code>pre[2][2]</code>, lấy tổng phía trên là 3 và phía trái là 7. Hai tổng đều chứa ô <code>a[0][0] = 2</code>, nên trừ 2 một lần rồi cộng ô mới <code>a[1][1] = 2</code>, ra 10.",
        en: "To find <code>pre[2][2]</code>, take the sum above, 3, and the sum to the left, 7. Both include <code>a[0][0] = 2</code>, so subtract 2 once, then add the new cell <code>a[1][1] = 2</code> to get 10.",
      },
      lines: [2, 3, 4], watch: { cell: "pre[2][2]", pre: 10 }, verdict: "run", fit: WITH_CALC,
      scene: {
        labP: { o: 1 },
        ...grid((r, c) => {
          if (r > 1 || c > 1) return outside;
          if (r === 0 && c === 0) return removed;
          return r === 1 && c === 1 ? good : active;
        }),
        ...table(6, {
          p12: active, p21: active, p11: removed,
          p22: { ...good, from: { z: 0.7, o: 0 }, ease: "drop", land: true, delay: 240, dur: 500 },
        }),
        ...calc("pre[2][2] = 3 + 7 − 2 + 2 = 10", "", 580),
      },
    },
    {
      title: { vi: "Lấy vùng lớn", en: "Start with the whole" }, kind: "step",
      body: {
        vi: "Điền hết bảng theo thứ tự từng hàng. Để tính vùng có góc dưới phải <code>(3, 3)</code>, bắt đầu từ <code>pre[4][4] = 44</code>, tổng cả lưới 4×4.",
        en: "Finish filling the table one row at a time. For a rectangle ending at <code>(3, 3)</code>, start with <code>pre[4][4] = 44</code>, the sum of the entire 4×4 grid.",
      },
      lines: [2, 3, 4, 7], watch: { cell: "pre[4][4]", pre: 44, sum: 44 }, verdict: "run", fit: WITH_CALC,
      scene: {
        labP: { o: 1 }, ...grid(() => active),
        ...table(16, { p44: { ...active, fx: { type: "hop", delay: 180 } } }), ...calc("pre[4][4] = 44"),
      },
    },
    {
      title: { vi: "Trừ dải phía trên", en: "Subtract the top strip" }, kind: "step",
      body: {
        vi: "Vùng cần tính bắt đầu ở hàng 1, nên bỏ hàng 0. Bốn ô trên hàng đó có tổng <code>pre[1][4] = 10</code>, còn lại <code>44 − 10 = 34</code>.",
        en: "The query starts at row 1, so remove row 0. Its four cells sum to <code>pre[1][4] = 10</code>, leaving <code>44 − 10 = 34</code>.",
      },
      lines: [7], watch: { sum: 34 }, verdict: "run", fit: WITH_CALC,
      scene: {
        labP: { o: 1 }, ...grid((r) => r === 0 ? removed : active),
        ...table(16, { p44: active, p14: { ...removed, fx: { type: "pulse", delay: 180 } } }), ...calc("44 − 10 = 34"),
      },
    },
    {
      title: { vi: "Trừ dải bên trái", en: "Subtract the left strip" }, kind: "step",
      body: {
        vi: "Vùng cần tính bắt đầu ở cột 2, nên trừ hai cột đầu với tổng <code>pre[4][2] = 18</code>. Còn 16, nhưng hai ô góc trên trái có tổng <code>2 + 1 = 3</code> đã bị trừ hai lần.",
        en: "The query starts at column 2, so subtract the first two columns, with sum <code>pre[4][2] = 18</code>. That leaves 16, but the upper-left pair, with sum <code>2 + 1 = 3</code>, was subtracted twice.",
      },
      lines: [7, 8], watch: { sum: 16 }, verdict: "run", fit: WITH_CALC,
      scene: {
        labP: { o: 1 },
        ...grid((r, c) => {
          if (r === 0 && c < 2) return { ...removed, fx: { type: "pulse", delay: 500 } };
          return r === 0 || c < 2 ? removed : active;
        }),
        ...table(16, { p44: active, p14: removed, p42: { ...removed, fx: { type: "pulse", delay: 180 } } }),
        ...calc("44 − 10 − 18 = 16"),
      },
    },
    {
      title: { vi: "Cộng lại phần góc", en: "Restore the shared corner" }, kind: "answer",
      body: {
        vi: "Cộng lại <code>pre[1][2] = 3</code> để hai ô góc trên trái chỉ bị loại một lần. Sáu ô trong vùng cần tìm có tổng <code>44 − 10 − 18 + 3 = 19</code>.",
        en: "Add back <code>pre[1][2] = 3</code> so the two upper-left cells are removed exactly once. The six query cells sum to <code>44 − 10 − 18 + 3 = 19</code>.",
      },
      lines: [7, 8], watch: { sum: 19 }, verdict: "ac", fit: WITH_CALC,
      scene: {
        labP: { o: 1 }, ...answer,
        ...table(16, { ...corners, p12: { ...good, fx: { type: "hop", delay: 180 } } }),
        ...calc("44 − 10 − 18 + 3 = 19", "v-eq"),
      },
    },
    {
      title: { vi: "Bốn giá trị là đủ", en: "Four entries suffice" }, kind: "recap",
      body: {
        vi: "Sau khi trừ dải trên và dải trái, cộng lại phần giao để mỗi ô thừa trong vùng lớn bị loại đúng một lần. Tạo bảng tốn O(nm) thời gian và bộ nhớ, rồi mỗi truy vấn chỉ đọc bốn ô trong O(1).",
        en: "Subtract the top and left strips, then add back their overlap so each extra cell in the large prefix is removed once. The table takes O(nm) time and space to build, then each query reads four entries in O(1).",
      },
      lines: [1, 7, 8], watch: { sum: 19 }, verdict: "ac", fit: WITH_CALC,
      scene: { labP: { o: 1 }, ...answer, ...table(16, corners), ...calc("44 − 10 − 18 + 3 = 19", "v-eq", 0) },
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  scene.add("labA", { shape: shapes.pill({ text: "a" }), x: 1.5, z: 0.98 });
  scene.add("labP", { shape: shapes.pill({ text: "pre" }), x: PRE_X + 2, z: 0.98, o: 0 });
  A.forEach((row, r) => row.forEach((v, c) => {
    scene.add(`a${r}${c}`, { shape: shapes.block({ label: v, sub: `${r},${c}`, w: 48, h: 36 }), x: c, y: r * ROW, shadow: true });
  }));
  PRE.forEach((row, r) => row.forEach((_, c) => {
    scene.add(`p${r}${c}`, { shape: shapes.block({ label: "?", sub: `${r},${c}`, w: 48, h: 36 }), x: PRE_X + c, y: r * ROW, o: 0 });
  }));
  scene.add("calc", { shape: shapes.pill(), x: 4.35, y: 4 * ROW + 2.05, o: 0 });
}
