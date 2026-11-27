import type { Lesson, SceneMap } from "../../../lib/types";

const indices = [1, 2, 3, 4];
const cell = (r: number, c: number) => `cell-${r}-${c}`;
const boardIds = indices.flatMap((r) => indices.map((c) => cell(r, c)));
const fit = [...boardIds, "row-1", "row-4", "col-1", "col-4"];

function board(placed: number[], options: { rejected?: string[]; next?: string; solved?: boolean } = {}): SceneMap {
  const { rejected = [], next, solved } = options;
  return Object.fromEntries(indices.flatMap((r) => indices.map((c) => {
    const id = cell(r, c);
    if (placed[r - 1] === c) return [id, { text: "Q", cls: solved ? "is-good" : "is-active", o: 1 }];
    if (rejected.includes(id)) return [id, { text: "×", cls: "is-bad", o: 1, fx: { type: "pulse", delay: (c - 1) * 70 } }];
    if (id === next) return [id, { text: "·", cls: "is-active", o: 1, fx: "pulse" }];
    return [id, { text: "", o: (r + c) % 2 === 0 ? 1 : 0.62 }];
  })));
}
const rejectRow = (r: number) => indices.map((c) => cell(r, c));

export const lesson: Lesson = {
  track: "cp",
  topic: "recursion",
  slug: "n-queens",
  title: { vi: "Quay lui: đặt hậu", en: "Backtracking: N-Queens" },
  added: "2026-11-27",
  summary: {
    vi: "Đặt mỗi hàng một quân hậu, bỏ ô bị khống chế và gỡ quân khi gặp ngõ cụt.",
    en: "Place one queen per row, skip attacked squares, and undo placements at dead ends.",
  },
  level: "medium",
  minutes: 10,
  time: "O(n · n!)",
  memory: "O(n)",
  goal: { vi: "Đếm cách đặt <b>4 quân hậu</b> trên bàn 4×4", en: "Count placements of <b>4 queens</b> on a 4×4 board" },
  codeLang: "C++17",
  code: [
    'vector&lt;<span class="kw">bool</span>&gt; col(n+1), down(2*n+1), up(2*n+1);',
    '<span class="kw">int</span> ways = 0;',
    '<span class="kw">auto</span> dfs = [&amp;](<span class="kw">auto</span>&amp;&amp; self, <span class="kw">int</span> r) -&gt; <span class="kw">void</span> {',
    '  <span class="kw">if</span> (r &gt; n) { ++ways; <span class="kw">return</span>; }',
    '  <span class="kw">for</span> (<span class="kw">int</span> c = 1; c &lt;= n; ++c) {',
    '    <span class="kw">int</span> d = r-c+n, u = r+c;',
    '    <span class="kw">if</span> (col[c] || down[d] || up[u]) <span class="kw">continue</span>;',
    '    col[c] = down[d] = up[u] = <span class="kw">true</span>;',
    '    self(self, r+1);',
    '    col[c] = down[d] = up[u] = <span class="kw">false</span>;',
    '  }',
    '};',
    'dfs(dfs, 1);',
  ],
  watch: [
    { key: "r", label: "r" },
    { key: "c", label: "c" },
    { key: "placed", label: { vi: "cột theo hàng", en: "columns by row" } },
    { key: "ways", label: "ways" },
  ],
  practice: [
    { src: "CSES 1624", name: "Chessboard and Queens", lv: "★★☆", url: "https://cses.fi/problemset/task/1624" },
    { src: "LeetCode 51", name: "N-Queens", lv: "★★★", url: "https://leetcode.com/problems/n-queens/" },
  ],
  sceneOptions: { unit: 56, view: [-110, -145, 340, 400] },
  legend: [
    { cls: "acc", label: { vi: "hậu đang đặt hoặc ô sắp thử", en: "placed queen or next square" } },
    { cls: "wa", label: { vi: "ô bị tấn công", en: "attacked square" } },
    { cls: "ac", label: { vi: "cách đặt hợp lệ", en: "valid arrangement" } },
  ],
  entrance: boardIds,
  steps: [
    {
      title: { vi: "Đặt bốn quân hậu", en: "Place four queens" }, kind: "problem",
      body: {
        vi: "Đặt 4 quân hậu sao cho không có hai quân nào chung hàng, cột hay đường chéo. Chọn 4 ô bất kỳ trên bàn 4×4 cho tới 1.820 cách thử. Ta đặt đúng một quân mỗi hàng rồi loại sớm các cách đang xung đột.",
        en: "Place 4 queens so that no two share a row, column, or diagonal. Choosing any 4 squares from the 4×4 board gives 1,820 candidates. Place one queen per row and reject conflicts early.",
      },
      lines: [1, 13], watch: { r: 1, ways: 0 }, verdict: "run", fit, scene: board([]),
    },
    {
      title: { vi: "Đặt hậu hàng đầu", en: "Place the first queen" }, kind: "concept",
      body: {
        vi: "Thử các cột từ trái sang phải, bắt đầu bằng <code>(1,1)</code>. Đánh dấu cột <code>c = 1</code> và hai đường chéo <code>d = r − c + n = 4</code>, <code>u = r + c = 2</code>, rồi xuống hàng 2.",
        en: "Try columns from left to right, starting at <code>(1,1)</code>. Mark column <code>c = 1</code> and diagonals <code>d = r − c + n = 4</code> and <code>u = r + c = 2</code>, then move to row 2.",
      },
      lines: [5, 6, 8, 9], watch: { r: 1, c: 1, placed: "[1]" }, verdict: "run", fit, scene: board([1]),
    },
    {
      title: { vi: "Bỏ ô xung đột", en: "Skip attacked squares" }, kind: "step",
      body: {
        vi: "Ở hàng 2, ô <code>(2,1)</code> chung cột với hậu đầu và ô <code>(2,2)</code> có cùng <code>d = 4</code>. Bỏ qua cả hai, thử ô <code>(2,3)</code>.",
        en: "In row 2, <code>(2,1)</code> shares the first queen's column and <code>(2,2)</code> shares its <code>d = 4</code> diagonal. Skip both and try <code>(2,3)</code>.",
      },
      lines: [5, 6, 7], watch: { r: 2, c: 3, placed: "[1]" }, verdict: "run", fit,
      scene: board([1], { rejected: [cell(2, 1), cell(2, 2)], next: cell(2, 3) }),
    },
    {
      title: { vi: "Hàng ba hết chỗ", en: "Row three is blocked" }, kind: "step",
      body: {
        vi: "Sau khi đặt hậu ở <code>(2,3)</code>, hàng 3 hết ô trống an toàn: cột 1 và 3 trùng cột, cột 2 và 4 vướng đường chéo của hậu hàng 2. Quay về hàng 2, gỡ hậu ở cột 3 rồi thử cột 4.",
        en: "After placing a queen at <code>(2,3)</code>, row 3 has no safe square. Columns 1 and 3 are occupied, and 2 and 4 share a diagonal with the row-2 queen. Back up to row 2, remove its queen, then try column 4.",
      },
      lines: [7, 9, 10], watch: { r: 3, placed: "[1, 3]", ways: 0 }, verdict: "run", fit,
      scene: board([1, 3], { rejected: rejectRow(3) }),
    },
    {
      title: { vi: "Thử cột còn lại", en: "Try the remaining column" }, kind: "step",
      body: {
        vi: "Với hậu ở <code>(2,4)</code>, hàng 3 chỉ còn ô <code>(3,2)</code>. Đặt hậu vào đó thì cả hàng 4 lại bị tấn công. Gỡ hậu hàng 3 rồi hàng 2, sau đó quay về đổi cột ở hàng 1.",
        en: "With a queen at <code>(2,4)</code>, row 3 has only <code>(3,2)</code> available. Taking it leaves every square in row 4 under attack. Undo the row-3 and row-2 placements, then change columns in row 1.",
      },
      lines: [7, 9, 10], watch: { r: 4, placed: "[1, 4, 2]", ways: 0 }, verdict: "run", fit,
      scene: board([1, 4, 2], { rejected: rejectRow(4) }),
    },
    {
      title: { vi: "Đổi cột hàng đầu", en: "Change the first column" }, kind: "step",
      body: {
        vi: "Gỡ quân ở <code>(1,1)</code> và xóa ba dấu cũ. Khi chuyển hậu đầu sang <code>(1,2)</code>, hàng 2 chỉ đặt được ở cột 4. Từ đó, ô an toàn duy nhất ở hàng 3 là <code>(3,1)</code>.",
        en: "Remove the queen from <code>(1,1)</code> and clear its three marks. With the first queen at <code>(1,2)</code>, row 2 can only use column 4. That leaves <code>(3,1)</code> as the only safe square in row 3.",
      },
      lines: [5, 7, 8, 9, 10], watch: { r: 3, c: 1, placed: "[2, 4]", ways: 0 }, verdict: "run", fit,
      scene: board([2, 4], { next: cell(3, 1) }),
    },
    {
      title: { vi: "Ghi nhận cách đầu", en: "Count the first solution" }, kind: "answer",
      body: {
        vi: "Đặt tiếp hậu ở <code>(3,1)</code> và <code>(4,3)</code>, ta được thứ tự cột <code>[2, 4, 1, 3]</code>. Lời gọi với <code>r = 5</code> đã qua hết 4 hàng nên tăng <code>ways</code> lên 1.",
        en: "Place the next queens at <code>(3,1)</code> and <code>(4,3)</code> to get columns <code>[2, 4, 1, 3]</code>. The call with <code>r = 5</code> has passed all 4 rows, so increment <code>ways</code> to 1.",
      },
      lines: [4, 8, 9], watch: { r: 5, placed: "[2, 4, 1, 3]", ways: 1 }, verdict: "ac", fit,
      scene: board([2, 4, 1, 3], { solved: true }),
    },
    {
      title: { vi: "Thử hết các nhánh", en: "Finish the search" }, kind: "recap",
      body: {
        vi: "Tiếp tục quay lui để thử hết các cột đầu: cột 3 cho cách đối xứng <code>[3, 1, 4, 2]</code>, còn cột 4 bế tắc giống cột 1, nên có đúng 2 cách. Mỗi lời gọi thử n cột, chỉ xuống hàng khi đặt hợp lệ, rồi gỡ đúng quân vừa đặt để các nhánh độc lập. Có O(n!) dãy cột phân biệt tính cả tiền tố, nên thời gian là O(n · n!) và bộ nhớ O(n).",
        en: "Keep backtracking through the remaining first columns: column 3 gives the mirror solution <code>[3, 1, 4, 2]</code>, and column 4 hits the same dead ends as column 1, giving exactly 2 solutions. Each call tests n columns, descends only after a valid placement, and undoes that placement before the next branch. There are O(n!) distinct-column sequences including prefixes, giving O(n · n!) time and O(n) space.",
      },
      lines: [4, 5, 7, 9, 10], watch: { placed: "[3, 1, 4, 2]", ways: 2 }, verdict: "ac", fit,
      scene: board([3, 1, 4, 2], { solved: true }),
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  for (const r of indices) {
    const y = (r - 1) * 2;
    scene.add(`row-${r}`, { shape: shapes.pill({ text: r }), x: -0.93, y, z: 0.2 });
    for (const c of indices) {
      scene.add(cell(r, c), { shape: shapes.block({ w: 49, h: 46, depth: 4, r: 6 }), x: c - 1, y });
    }
  }
  for (const c of indices) {
    scene.add(`col-${c}`, { shape: shapes.pill({ text: c }), x: c - 1, z: 1.07 });
  }
}
