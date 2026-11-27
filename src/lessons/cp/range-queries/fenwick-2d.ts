import type { Lesson, SceneMap } from "../../../lib/types";

const A = [
  [0, 1, 0, 0],
  [1, 0, 1, 1],
  [1, 1, 0, 0],
  [1, 1, 1, 1],
];
const N = A.length, M = A[0].length;
const U = 40;
const OFFSET = 4.5;
const ROW = 2.71;
type Cell = [number, number];
const cells: Cell[] = A.flatMap((row, i) => row.map((_, j): Cell => [i + 1, j + 1]));
const lowbit = (i: number) => i & -i;
const id = (table: "a" | "b", i: number, j: number) => `${table}${i}-${j}`;
const all = ["labA", "labB", "calc", ...cells.flatMap(([i, j]) => [id("a", i, j), id("b", i, j)])];
const gridOnly = ["labA", ...cells.map(([i, j]) => id("a", i, j))];

function add(bit: number[][], r: number, c: number, delta: number): Cell[] {
  const changed: Cell[] = [];
  for (let i = r; i <= N; i += lowbit(i)) {
    for (let j = c; j <= M; j += lowbit(j)) {
      bit[i][j] += delta;
      changed.push([i, j]);
    }
  }
  return changed;
}

const initial = Array.from({ length: N + 1 }, () => Array<number>(M + 1).fill(0));
for (const [i, j] of cells) add(initial, i, j, A[i - 1][j - 1]);
const updated = initial.map((row) => [...row]);
const changed = add(updated, 3, 3, 1);

function prefix(r: number, c: number) {
  let sum = 0;
  const used: Cell[] = [];
  for (let i = r; i > 0; i -= lowbit(i)) {
    for (let j = c; j > 0; j -= lowbit(j)) {
      sum += updated[i][j];
      used.push([i, j]);
    }
  }
  return { sum, used };
}

const whole = prefix(3, 4);
const top = prefix(1, 4);
const left = prefix(3, 1);
const corner = prefix(1, 1);
const answer = whole.sum - top.sum - left.sum + corner.sum;
const expression = `${whole.sum} − ${top.sum} − ${left.sum} + ${corner.sum} = ${answer}`;
const active = "is-active";
const removed = "is-bad";
const good = "is-good";
const dim = "is-out";

function picture(
  phase: "input" | "initial" | "updated",
  gridMark: (i: number, j: number) => string,
  marks: [Cell[], string][] = [],
  formula = "",
  result = false,
): SceneMap {
  const scene: SceneMap = {
    labB: { o: phase === "input" ? 0 : 1 },
    calc: { text: formula, o: formula ? 1 : 0, cls: result ? "v-eq" : "" },
  };
  const bitClasses = Object.fromEntries(marks.flatMap(([group, cls]) =>
    group.map(([i, j]) => [id("b", i, j), cls])));
  const bit = phase === "updated" ? updated : initial;
  for (const [i, j] of cells) {
    const toggled = phase === "updated" && i === 3 && j === 3;
    const cls = gridMark(i, j);
    scene[id("a", i, j)] = { text: String(toggled ? 1 : A[i - 1][j - 1]), cls, o: cls === dim ? 0.65 : 1 };
    const key = id("b", i, j);
    scene[key] = { text: String(bit[i][j]), cls: bitClasses[key] ?? "", o: phase === "input" ? 0 : 1 };
  }
  return scene;
}

const inQuery = (i: number, j: number) => i >= 2 && i <= 3 && j >= 2;
const queryMarks: [Cell[], string][] = [[whole.used, active], [top.used, removed], [left.used, removed], [corner.used, good]];
const updatePicture = picture("updated", (i, j) => i === 3 && j === 3 ? good : dim,
  [[changed, good]], "bit[4][4] = 10 + 1 = 11");
changed.forEach(([i, j], index) => {
  Object.assign(updatePicture[id("b", i, j)], {
    delay: 120 + 110 * index, fx: { type: "pulse", amp: 0.07 },
  });
});
Object.assign(updatePicture.calc, { from: { o: 0 }, delay: 570, dur: 300 });
const resultPicture = () => picture("updated", (i, j) => inQuery(i, j) ? good : dim, queryMarks, expression, true);

export const lesson: Lesson = {
  track: "cp",
  topic: "range-queries",
  slug: "fenwick-2d",
  title: { vi: "Fenwick 2 chiều", en: "2D Fenwick tree" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng các khối có kích thước theo lowbit để vừa sửa một ô, vừa tính tổng hình chữ nhật.",
    en: "Use lowbit-sized blocks to update a cell and sum a rectangle.",
  },
  level: "hard",
  minutes: 10,
  time: "O(log(n+1) · log(m+1))",
  memory: "O(nm)",
  goal: {
    vi: "Trồng cây ở <b>(3, 3)</b>, rồi đếm cây từ <b>(2, 2)</b> đến <b>(3, 4)</b>",
    en: "Plant a tree at <b>(3, 3)</b>, then count trees from <b>(2, 2)</b> to <b>(3, 4)</b>",
  },
  codeLang: "C++17",
  code: [
    'vector&lt;vector&lt;<span class="kw">long long</span>&gt;&gt; bit(n+1, vector&lt;<span class="kw">long long</span>&gt;(m+1));',
    '<span class="kw">auto</span> add = [&amp;](<span class="kw">int</span> r, <span class="kw">int</span> c, <span class="kw">int</span> delta) {',
    '  <span class="kw">for</span> (<span class="kw">int</span> i = r; i &lt;= n; i += i &amp; -i)',
    '    <span class="kw">for</span> (<span class="kw">int</span> j = c; j &lt;= m; j += j &amp; -j) bit[i][j] += delta;',
    '};',
    '<span class="kw">auto</span> pref = [&amp;](<span class="kw">int</span> r, <span class="kw">int</span> c) {',
    '  <span class="kw">long long</span> s = 0;',
    '  <span class="kw">for</span> (<span class="kw">int</span> i = r; i &gt; 0; i -= i &amp; -i)',
    '    <span class="kw">for</span> (<span class="kw">int</span> j = c; j &gt; 0; j -= j &amp; -j) s += bit[i][j];',
    '  <span class="kw">return</span> s;',
    '};',
    '<span class="kw">auto</span> rect = [&amp;](<span class="kw">int</span> r1, <span class="kw">int</span> c1, <span class="kw">int</span> r2, <span class="kw">int</span> c2) {',
    '  <span class="kw">return</span> pref(r2,c2) - pref(r1-1,c2) - pref(r2,c1-1) + pref(r1-1,c1-1);',
    '};',
  ],
  watch: [
    { key: "call", label: { vi: "lời gọi", en: "call" } },
    { key: "sum", label: { vi: "tổng đang tính", en: "running total" } },
  ],
  practice: [
    { src: "CSES 1739", name: "Forest Queries II", lv: "★★☆", url: "https://cses.fi/problemset/task/1739" },
    { src: "LeetCode 308", name: "Range Sum Query 2D - Mutable", lv: "★★★", url: "https://leetcode.com/problems/range-sum-query-2d-mutable/" },
  ],
  sceneOptions: { unit: U, view: [-43, -138, 390, 333] },
  legend: [
    { cls: "acc", label: { vi: "ô đang dùng", en: "cells in use" } },
    { cls: "wa", label: { vi: "phần bị trừ", en: "subtracted area" } },
    { cls: "ac", label: { vi: "ô vừa đổi hoặc vùng kết quả", en: "updated cell or result area" } },
  ],
  entrance: cells.filter(([i, j]) => inQuery(i, j)).map(([i, j]) => id("a", i, j)),
  steps: [
    {
      title: { vi: "Đếm cây sau khi sửa", en: "Count trees after edits" }, kind: "problem",
      body: {
        vi: "Trong lưới 4×4 đánh số từ 1, ô 1 có cây và ô 0 còn trống. Ta sẽ trồng cây ở <code>(3, 3)</code> rồi đếm cây trong vùng tô sáng. Cộng từng ô có thể tốn O(nm) mỗi truy vấn.",
        en: "In this 1-indexed 4×4 grid, 1 marks a tree and 0 marks an empty cell. Plant a tree at <code>(3, 3)</code>, then count trees in the highlighted rectangle. Scanning cells can cost O(nm) per query.",
      },
      lines: [], watch: {}, verdict: "run", fit: gridOnly,
      scene: picture("input", (i, j) => inQuery(i, j) ? active : dim),
    },
    {
      title: { vi: "Mỗi ô giữ một khối", en: "Each entry stores a block" }, kind: "concept",
      body: {
        vi: "<code>bit[i][j]</code> giữ tổng khối kết thúc ở <code>(i, j)</code>, cao <code>lowbit(i)</code> và rộng <code>lowbit(j)</code>, với <code>lowbit(x) = x &amp; -x</code>. Cả hai lowbit của <code>(2, 4)</code> lần lượt là 2 và 4, nên <code>bit[2][4] = 1 + 3 = 4</code> từ hai hàng đầu.",
        en: "<code>bit[i][j]</code> sums the block ending at <code>(i, j)</code>, with height <code>lowbit(i)</code> and width <code>lowbit(j)</code>, where <code>lowbit(x) = x &amp; -x</code>. At <code>(2, 4)</code> those lengths are 2 and 4, so <code>bit[2][4] = 1 + 3 = 4</code> from the first two rows.",
      },
      note: {
        vi: "Để dựng bảng, khởi tạo toàn số 0 rồi gọi <code>add</code> với giá trị của từng ô.",
        en: "To build the table, start with zeros and call <code>add</code> with each grid cell’s value.",
      },
      lines: [1, 2, 3, 4], watch: { sum: 4 }, verdict: "run", fit: all,
      scene: picture("initial", (i) => i <= 2 ? active : dim, [[[[2, 4]], good]], "bit[2][4] = 1 + 3 = 4"),
    },
    {
      title: { vi: "Cập nhật bốn khối", en: "Update four blocks" }, kind: "step",
      body: {
        vi: "Ô <code>a[3][3]</code> đổi từ 0 thành 1, nên gọi <code>add(3, 3, 1)</code>. Ở cả hai chiều, cộng lowbit đưa 3 lên 4 rồi 8, vượt biên. Bốn ô Fenwick tô xanh là các khối chứa ô vừa sửa, nên mỗi ô tăng 1.",
        en: "<code>a[3][3]</code> changes from 0 to 1, so call <code>add(3, 3, 1)</code>. In each dimension, adding lowbit moves from 3 to 4 and then out of bounds at 8. The four green Fenwick entries cover the edited cell and each gains 1.",
      },
      lines: [2, 3, 4], watch: { call: "add(3, 3, 1)" }, verdict: "run", fit: all,
      scene: updatePicture,
    },
    {
      title: { vi: "Ghép prefix lớn", en: "Assemble the large prefix" }, kind: "step",
      body: {
        vi: "Để tính <code>pref(3, 4)</code>, trừ lowbit cho chỉ số cột: 4 → 0. Với chỉ số hàng, 3 → 2 → 0. Vì thế lấy <code>bit[3][4] = 3</code> cho hàng 3 và <code>bit[2][4] = 4</code> cho hai hàng trên, tổng là 7.",
        en: "For <code>pref(3, 4)</code>, subtract lowbit to move the column 4 → 0 and the row 3 → 2 → 0. Take <code>bit[3][4] = 3</code> for row 3 and <code>bit[2][4] = 4</code> for the first two rows, for a total of 7.",
      },
      lines: [6, 7, 8, 9, 10, 13], watch: { call: "pref(3, 4)", sum: whole.sum }, verdict: "run", fit: all,
      scene: picture("updated", (i) => i <= 3 ? active : dim, [[whole.used, active]], "pref(3, 4) = 3 + 4 = 7"),
    },
    {
      title: { vi: "Trừ hàng phía trên", en: "Subtract the top row" }, kind: "step",
      body: {
        vi: "Vùng cần hỏi bắt đầu từ hàng 2, nên trừ <code>pref(1, 4) = bit[1][4] = 1</code> để loại hàng đầu. Còn lại <code>7 − 1 = 6</code>.",
        en: "The query starts at row 2, so subtract <code>pref(1, 4) = bit[1][4] = 1</code> to remove the first row. That leaves <code>7 − 1 = 6</code>.",
      },
      lines: [8, 9, 13], watch: { call: "pref(1, 4)", sum: whole.sum - top.sum }, verdict: "run", fit: all,
      scene: picture("updated", (i) => i === 1 ? removed : i <= 3 ? active : dim, queryMarks.slice(0, 2), "7 − 1 = 6"),
    },
    {
      title: { vi: "Trừ cột bên trái", en: "Subtract the left column" }, kind: "step",
      body: {
        vi: "Vùng bắt đầu từ cột 2, nên trừ <code>pref(3, 1)</code>. Hai khối Fenwick ở cột 1 có tổng <code>1 + 1 = 2</code>. Ô góc <code>(1, 1)</code> nằm trong cả hai phần bị trừ.",
        en: "The query starts at column 2, so subtract <code>pref(3, 1)</code>. Its two Fenwick blocks in column 1 sum to <code>1 + 1 = 2</code>. The corner <code>(1, 1)</code> belongs to both subtracted areas.",
      },
      lines: [8, 9, 13], watch: { call: "pref(3, 1)", sum: whole.sum - top.sum - left.sum }, verdict: "run", fit: all,
      scene: picture("updated", (i, j) => i > 3 ? dim : i === 1 || j === 1 ? removed : active, queryMarks.slice(0, 3), "7 − 1 − (1 + 1) = 4"),
    },
    {
      title: { vi: "Cộng lại ô góc", en: "Restore the shared corner" }, kind: "answer",
      body: {
        vi: "Cộng lại <code>pref(1, 1) = 0</code> để ô góc chỉ bị loại một lần. Vùng tô xanh có <code>7 − 1 − 2 + 0 = 4</code> cây, trong đó có cây mới ở <code>(3, 3)</code>.",
        en: "Add back <code>pref(1, 1) = 0</code> so the shared corner is removed exactly once. The green rectangle contains <code>7 − 1 − 2 + 0 = 4</code> trees, including the new one at <code>(3, 3)</code>.",
      },
      lines: [12, 13], watch: { call: "rect(2, 2, 3, 4)", sum: answer }, verdict: "ac", fit: all, scene: resultPicture(),
    },
    {
      title: { vi: "Hai vòng nhảy lowbit", en: "Two nested lowbit loops" }, kind: "recap",
      body: {
        vi: "Cộng lowbit để tìm các khối chứa ô vừa sửa. Trừ lowbit để ghép các khối rời nhau phủ đúng một prefix. Với bốn prefix cho mỗi hình chữ nhật, cả truy vấn lẫn cập nhật tốn O(log(n+1) · log(m+1)), bảng chiếm O(nm).",
        en: "Add lowbit to find blocks that contain the edited cell. Subtract lowbit to tile a prefix with disjoint blocks. A rectangle uses four prefixes, so both queries and updates take O(log(n+1) · log(m+1)), with O(nm) storage.",
      },
      lines: [3, 4, 8, 9, 13], watch: { call: "rect(2, 2, 3, 4)", sum: answer }, verdict: "ac", fit: all, scene: resultPicture(),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("labA", { shape: shapes.pill({ text: "a" }), x: 1.5, z: 1.02 });
  scene.add("labB", { shape: shapes.pill({ text: "bit" }), x: OFFSET + 1.5, z: 1.02, o: 0 });
  for (const [i, j] of cells) {
    const y = (i - 1) * ROW;
    const sub = `${i},${j}`;
    scene.add(id("a", i, j), {
      shape: shapes.block({ label: A[i - 1][j - 1], sub, w: 35, h: 21, depth: 3, r: 6 }), x: j - 1, y,
    });
    scene.add(id("b", i, j), {
      shape: shapes.block({ label: initial[i][j], sub, w: 35, h: 21, depth: 3, r: 6 }), x: OFFSET + j - 1, y, o: 0,
    });
  }
  scene.add("calc", { shape: shapes.pill(), x: (OFFSET + 3) / 2, y: 11.05, o: 0 });
}
