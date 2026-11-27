import type { Lesson, SceneMap } from "../../../lib/types";

const grid = ["....", ".*..", "...."];
const cols = grid[0].length;
const U = 52;
const rowIds = grid.map((_, r) => `row${r}`);
const colIds = [...grid[0]].map((_, c) => `col${c}`);

const cell = (r: number, c: number) => `g${r}-${c}`;
const cells = grid.flatMap((row, r) => [...row].map((tile, c) => ({ r, c, id: cell(r, c), blocked: tile === "*" })));
const dp = grid.map(() => Array<number>(cols).fill(0));
for (const { r, c, blocked } of cells) {
  if (!blocked) dp[r][c] = r === 0 && c === 0 ? 1 : (dp[r - 1]?.[c] ?? 0) + (dp[r][c - 1] ?? 0);
}

const edge = (source: string, target: string) => `${source}-to-${target}`;
const edgeIn = { p: 1, from: { p: 0 }, dur: 400, cls: "v-eq" };
const fit = [...cells.map(({ id }) => id), ...rowIds, ...colIds, "calc"];

function picture(end: number, firstNew: number, formula = "", animate = true): SceneMap {
  const scene: SceneMap = {};
  const sources = new Set<string>();
  for (const [i, { r, c, id, blocked }] of cells.entries()) {
    const newCell = i >= firstNew && i <= end;
    scene[id] = {
      text: i <= end ? String(dp[r][c]) : blocked ? "×" : "?",
      cls: blocked ? "is-bad" : newCell ? "is-good" : i <= end ? "" : "is-out",
      o: i <= end || blocked ? 1 : 0.42,
      ...(animate && newCell ? { from: { o: 0.42, z: 0.28 }, delay: (i - firstNew) * 140, dur: 310, ease: "drop" } : {}),
    };
    if (!newCell || blocked) continue;
    const inputs = [
      ...(r > 0 ? [cell(r - 1, c)] : []),
      ...(c > 0 ? [cell(r, c - 1)] : []),
    ];
    for (const source of inputs) {
      scene[edge(source, id)] = animate ? { ...edgeIn, delay: (i - firstNew) * 140 } : { p: 1, cls: "v-eq" };
      sources.add(source);
    }
  }
  for (const { r, c, id, blocked } of cells) {
    if (!blocked && sources.has(id) && r * cols + c < firstNew) scene[id].cls = "is-active";
  }
  scene.calc = formula
    ? { text: formula, o: 1, cls: "v-eq", from: { o: 0, s: 0.8 }, delay: animate ? 580 : 0, dur: 320, ease: "back" }
    : { text: "", o: 0 };
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "dp",
  slug: "grid-paths",
  title: { vi: "Đếm đường đi trên lưới", en: "Counting grid paths" },
  added: "2026-11-27",
  summary: {
    vi: "Đếm đường đi bằng cách cộng số cách tới ô trên và ô trái, rồi gán 0 cho ô có vật cản.",
    en: "Count paths by adding the entries above and to the left, with zero at each blocked cell.",
  },
  level: "basic",
  minutes: 8,
  time: "O(nm)",
  memory: "O(nm)",
  goal: {
    vi: "Đi từ <b>(0, 0)</b> tới <b>(2, 3)</b>, mỗi bước sang phải hoặc xuống",
    en: "Go from <b>(0, 0)</b> to <b>(2, 3)</b> by moving right or down",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">const int</span> MOD = <span class="nm">1000000007</span>;',
    'std::vector dp(n, std::vector&lt;<span class="kw">int</span>&gt;(m, 0));',
    '<span class="kw">for</span> (<span class="kw">int</span> r = 0; r &lt; n; ++r) {',
    '  <span class="kw">for</span> (<span class="kw">int</span> c = 0; c &lt; m; ++c) {',
    "    <span class=\"kw\">if</span> (grid[r][c] == '*') <span class=\"kw\">continue</span>;",
    '    <span class="kw">if</span> (r == 0 &amp;&amp; c == 0) { dp[r][c] = 1; <span class="kw">continue</span>; }',
    '    <span class="kw">int</span> up = r &gt; 0 ? dp[r - 1][c] : 0;',
    '    <span class="kw">int</span> left = c &gt; 0 ? dp[r][c - 1] : 0;',
    '    dp[r][c] = (up + left) % MOD;',
    '  }',
    '}',
    '<span class="kw">return</span> dp[n - 1][m - 1];',
  ],
  watch: [
    { key: "cell", label: { vi: "ô đang xét", en: "current cell" } },
    { key: "up", label: "up" },
    { key: "left", label: "left" },
    { key: "count", label: "dp[r][c]" },
  ],
  practice: [
    { src: "LeetCode 62", name: "Unique Paths", lv: "★☆☆", url: "https://leetcode.com/problems/unique-paths/" },
    { src: "CSES 1638", name: "Grid Paths I", lv: "★★☆", url: "https://cses.fi/problemset/task/1638" },
  ],
  sceneOptions: { unit: U, view: [-62, -95, 307, 315] },
  legend: [
    { cls: "acc", label: { vi: "ô nguồn", en: "source cell" } },
    { cls: "ac", label: { vi: "ô vừa tính", en: "newly filled cell" } },
    { cls: "wa", label: { vi: "ô có vật cản", en: "blocked cell" } },
    { cls: "dim", label: { vi: "chưa tính", en: "pending" } },
  ],
  steps: [
    {
      title: { vi: "Đếm đường tới đích", en: "Count routes to the goal" }, kind: "problem",
      body: {
        vi: "Trên lưới 3×4, đi từ góc trên trái tới góc dưới phải bằng các bước sang phải hoặc xuống. Ô <code>(1, 1)</code> có vật cản. Liệt kê từng đường sẽ chậm khi lưới lớn, vì nhiều đường cùng đi qua một ô.",
        en: "Cross a 3×4 grid from top left to bottom right using right or down moves. Cell <code>(1, 1)</code> is blocked. Listing every route gets expensive on large grids because many routes pass through the same cell.",
      },
      lines: [], watch: {}, verdict: "run", fit, scene: picture(-1, 0),
    },
    {
      title: { vi: "Đặt ô xuất phát", en: "Seed the starting cell" }, kind: "concept",
      body: {
        vi: "<code>dp[r][c]</code> đếm số đường hợp lệ từ góc trên trái tới ô <code>(r, c)</code>. Ô đầu có đúng một đường rỗng nên <code>dp[0][0] = 1</code>.",
        en: "<code>dp[r][c]</code> counts valid routes from the top-left corner to <code>(r, c)</code>. The start has one empty route, so <code>dp[0][0] = 1</code>.",
      },
      lines: [2, 5, 6], watch: { cell: "(0, 0)", count: 1 }, verdict: "run", fit, scene: picture(0, 0, "dp[0][0] = 1"),
    },
    {
      title: { vi: "Điền hàng trên cùng", en: "Fill the top row" }, kind: "step",
      body: {
        vi: "Hàng 0 không có ô phía trên, nên mỗi ô sau ô xuất phát chỉ nhận số đường từ bên trái. Cả ba ô mới đều nhận <code>0 + 1 = 1</code>.",
        en: "Row 0 has no cells above it, so each cell after the start gets its routes from the left. All three new cells get <code>0 + 1 = 1</code>.",
      },
      lines: [7, 8, 9], watch: { cell: "(0, 3)", up: 0, left: 1, count: 1 }, verdict: "run", fit, scene: picture(3, 1, "dp[0][c] = 0 + 1 = 1"),
    },
    {
      title: { vi: "Bỏ qua vật cản", en: "Skip the blocked cell" }, kind: "step",
      body: {
        vi: "Ô <code>(1, 0)</code> nhận 1 đường từ trên xuống. Ô <code>(1, 1)</code> bị chặn nên giữ nguyên 0 dù ô trên và ô trái đều có 1 đường.",
        en: "Cell <code>(1, 0)</code> gets 1 route from above. The blocked cell <code>(1, 1)</code> stays at 0 even though the cells above and to its left each have 1 route.",
      },
      lines: [5, 7, 8, 9], watch: { cell: "(1, 1)", count: 0 }, verdict: "run", fit, scene: picture(5, 4, "dp[1][1] = 0"),
    },
    {
      title: { vi: "Cộng trên và trái", en: "Add above and left" }, kind: "step",
      body: {
        vi: "Ô <code>(1, 2)</code> nhận <code>1 + 0 = 1</code> đường. Kế bên, ô <code>(1, 3)</code> nhận <code>1 + 1 = 2</code> nhờ dùng lại kết quả vừa tính.",
        en: "Cell <code>(1, 2)</code> gets <code>1 + 0 = 1</code> route. Next to it, <code>(1, 3)</code> gets <code>1 + 1 = 2</code> by reusing the result just computed.",
      },
      lines: [7, 8, 9], watch: { cell: "(1, 3)", up: 1, left: 1, count: 2 }, verdict: "run", fit, scene: picture(7, 6, "dp[1][3] = 1 + 1 = 2"),
    },
    {
      title: { vi: "Điền hàng cuối", en: "Fill the bottom row" }, kind: "step",
      body: {
        vi: "Ba ô đầu hàng 2 lần lượt nhận <code>1 + 0 = 1</code>, <code>0 + 1 = 1</code>, rồi <code>1 + 1 = 2</code>. Ô dưới vật cản vẫn tới được từ bên trái.",
        en: "The first three cells of row 2 get <code>1 + 0 = 1</code>, <code>0 + 1 = 1</code>, and <code>1 + 1 = 2</code>. The cell beneath the obstacle is still reachable from the left.",
      },
      lines: [7, 8, 9], watch: { cell: "(2, 2)", up: 1, left: 1, count: 2 }, verdict: "run", fit, scene: picture(10, 8, "dp[2][2] = 1 + 1 = 2"),
    },
    {
      title: { vi: "Đọc số đường", en: "Read the route count" }, kind: "answer",
      body: {
        vi: "Ô đích nhận 2 đường từ <code>(1, 3)</code> và 2 đường từ <code>(2, 2)</code>. Vậy có <code>2 + 2 = 4</code> đường hợp lệ.",
        en: "The goal gets 2 routes from <code>(1, 3)</code> and 2 from <code>(2, 2)</code>. That makes <code>2 + 2 = 4</code> valid routes.",
      },
      lines: [7, 8, 9, 12], watch: { cell: "(2, 3)", up: 2, left: 2, count: 4 }, verdict: "ac", fit, scene: picture(11, 11, "dp[2][3] = 2 + 2 = 4"),
    },
    {
      title: { vi: "Đếm theo bước cuối", en: "Group by the last step" }, kind: "recap",
      body: {
        vi: "Mỗi đường tới một ô trống đi vào từ đúng một trong hai hướng, nên cộng hai ô nguồn sẽ đếm đủ và không trùng. Duyệt theo hàng bảo đảm cả hai nguồn đã có kết quả. Bảng dùng O(nm) thời gian và O(nm) bộ nhớ, còn phép lấy dư phục vụ bài CSES.",
        en: "Every route enters an open cell from exactly one of the two directions, so adding the sources counts each route once. Row order ensures both sources are ready. The table takes O(nm) time and O(nm) space, and the modulo serves the CSES problem.",
      },
      lines: [3, 4, 5, 9, 12], watch: { cell: "(2, 3)", up: 2, left: 2, count: 4 }, verdict: "ac", fit, scene: picture(11, 11, "dp[2][3] = 2 + 2 = 4", false),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const [r, id] of rowIds.entries()) {
    scene.add(id, { shape: shapes.pill({ text: `r=${r}`, h: 23, pad: 6 }), x: -1.1, y: r * 2.55 - 0.34 });
  }
  for (const [c, id] of colIds.entries()) {
    scene.add(id, { shape: shapes.pill({ text: `c=${c}`, h: 23, pad: 6 }), x: c * 1.25, y: -2.24 });
  }
  for (const { r, c, id } of cells) {
    scene.add(id, {
      shape: shapes.block({ label: "?", w: 48, h: 34, depth: 4 }),
      x: c * 1.25, y: r * 2.55,
    });
    if (r > 0) {
      const source = cell(r - 1, c);
      scene.link(edge(source, id), { from: source, to: id, bend: -0.9 });
    }
    if (c > 0) {
      const source = cell(r, c - 1);
      scene.link(edge(source, id), { from: source, to: id, bend: 0.58 });
    }
  }
  scene.add("calc", { shape: shapes.pill(), x: 1.875, y: 7.22, o: 0 });
}
