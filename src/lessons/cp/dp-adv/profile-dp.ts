import type { Lesson, SceneMap } from "../../../lib/types";

const masks = [0, 1, 2, 3];
const binary = (mask: number) => mask.toString(2).padStart(2, "0");
const incoming = [[0, 3], [2], [1], [0]];
const rows = [[1, 0, 0, 0]];
for (let c = 0; c < 3; c++) {
  rows.push(incoming.map((sources) => sources.reduce((total, mask) => total + rows[c][mask], 0)));
}

// Board sketches use the same letter for the two squares of a domino.
const boards = [
  ["···", "···"],
  ["A··", "A··"],
  ["AA·", "BB·"],
  ["AAB", "CCB"],
];
const cell = (c: number, mask: number) => `d${c}-${mask}`;

function picture(c: number, board = 0, focus = -1, formula = "", sources: number[] = []): SceneMap {
  const scene: SceneMap = {
    formula: { text: formula, o: formula ? 1 : 0, from: { o: 0 }, delay: 280, dur: 320 },
  };
  boards[board].forEach((row, r) => [...row].forEach((square, col) => {
    scene[`b${r}${col}`] = {
      text: square,
      cls: square === "·" ? "" : board === 2 && c === 1 && col === 1 ? "is-active" : "is-good",
    };
  }));
  rows.forEach((row, i) => {
    scene[`row${i}`] = { cls: i === c ? "is-active" : "" };
    row.forEach((value, mask) => {
      const pending = i > c || (i === c && c === 1 && focus === 0 && mask === 3);
      scene[cell(i, mask)] = {
        text: pending ? "·" : String(value),
        ...(i === c && mask === focus ? { fx: { type: "pulse", amp: 0.06, delay: 300 } } : {}),
        cls: pending ? "is-out" : i === c && mask === focus ? "is-good"
          : i === c - 1 && sources.includes(mask) ? "is-active" : "",
      };
    });
  });
  masks.forEach((mask) => {
    const shown = c >= 1 && !(c === 1 && focus === 0 && mask === 3);
    scene[`sum${mask}`] = {
      text: shown ? incoming[mask].map((source) => rows[c - 1][source]).join("+") : "",
      o: shown ? 1 : 0,
      cls: mask === focus ? "is-active" : "",
    };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "dp-adv",
  slug: "profile-dp",
  title: { vi: "DP theo profile (lát gạch)", en: "Broken-profile DP" },
  added: "2026-11-27",
  summary: {
    vi: "Lát từng cột bằng domino, dùng mask để ghi những ô đã bị chiếm ở cột kế tiếp.",
    en: "Place dominoes one column at a time, using a mask to track filled squares in the next column.",
  },
  level: "hard",
  minutes: 10,
  time: "O(m · n · 3ⁿ)",
  memory: "O(2ⁿ)",
  goal: { vi: "Đếm cách lát hình chữ nhật <b>2 × 3</b> bằng domino", en: "Count domino tilings of a <b>2 × 3</b> rectangle" },
  codeLang: "C++17",
  code: [
    '<span class="kw">const int</span> M = 1 &lt;&lt; n, MOD = 1000000007;',
    'vector&lt;int&gt; dp(M), next(M); dp[0] = 1;',
    '<span class="kw">auto</span> fillCol = [&amp;](<span class="kw">auto</span>&amp;&amp; self, <span class="kw">int</span> used, <span class="kw">int</span> out, <span class="kw">int</span> ways) -&gt; void {',
    '  <span class="kw">if</span> (used == M - 1) { next[out] = (next[out] + ways) % MOD; <span class="kw">return</span>; }',
    '  <span class="kw">int</span> b = (M - 1) &amp; ~used; b &amp;= -b;',
    '  self(self, used | b, out | b, ways);',
    '  <span class="kw">if</span> ((b &lt;&lt; 1) &lt; M &amp;&amp; !(used &amp; (b &lt;&lt; 1)))',
    '    self(self, used | b | (b &lt;&lt; 1), out, ways);',
    '};',
    '<span class="kw">for</span> (<span class="kw">int</span> c = 0; c &lt; m; ++c) {',
    '  fill(next.begin(), next.end(), 0);',
    '  <span class="kw">for</span> (<span class="kw">int</span> in = 0; in &lt; M; ++in) <span class="kw">if</span> (dp[in]) fillCol(fillCol, in, 0, dp[in]);',
    '  dp.swap(next);',
    '}',
    '<span class="kw">return</span> dp[0];',
  ],
  watch: [
    { key: "c", label: { vi: "số cột đã xử lý", en: "columns processed" } },
    { key: "in", label: "in" },
    { key: "out", label: "out" },
    { key: "ways", label: "dp[0]" },
  ],
  practice: [
    { src: "LeetCode 790", name: "Domino and Tromino Tiling", lv: "★★☆", url: "https://leetcode.com/problems/domino-and-tromino-tiling/" },
    { src: "CSES 2181", name: "Counting Tilings", lv: "★★★", url: "https://cses.fi/problemset/task/2181" },
  ],
  sceneOptions: { unit: 54 },
  legend: [
    { cls: "acc", label: { vi: "ô lấn sang cột sau hoặc nguồn cộng", en: "overhang or source count" } },
    { cls: "ac", label: { vi: "gạch đã đặt hoặc số cách đang xét", en: "placed tile or count in focus" } },
  ],
  steps: [
    {
      title: { vi: "Lát hình chữ nhật", en: "Tile the rectangle" }, kind: "problem",
      body: {
        vi: "Lấp kín lưới 2 hàng, 3 cột bằng domino dọc hoặc ngang. Hai ô cùng chữ thuộc một viên gạch. Nếu liệt kê từng cách lát, ta lặp lại cùng một bài toán phía bên phải mỗi khi các cách lát khác nhau để lại cùng một mép.",
        en: "Fill a board of 2 rows and 3 columns with vertical or horizontal dominoes. Matching letters mark the two squares of one tile. Enumerating tilings repeats the same problem on the right whenever different partial tilings leave the same boundary.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(-1),
    },
    {
      title: { vi: "Ghi mép bằng mask", en: "Encode the boundary" }, kind: "concept",
      body: {
        vi: "Hàng <code>c</code> trong bảng đếm số cách sau khi lấp kín <code>c</code> cột. Mỗi bit 1 ứng với một ô đã có gạch ở cột kế tiếp, bit thấp nhất là ô trên. Ở <code>c = 0</code>, chỉ mask <code>00</code> có 1 cách.",
        en: "Table row <code>c</code> counts arrangements after filling <code>c</code> columns. A 1 marks a covered square in the next column, with the lowest bit for the top square. At <code>c = 0</code>, only mask <code>00</code> has one way.",
      },
      lines: [1, 2], watch: { c: 0, out: "00", ways: 1 }, verdict: "run", fit: "all",
      scene: picture(0, 0, 0, "dp[00₂] = 1"),
    },
    {
      title: { vi: "Thử một viên dọc", en: "Try a vertical domino" }, kind: "step",
      body: {
        vi: "Tìm ô trống trên cùng. Hai ô cột đầu đều trống, nên có thể đặt viên dọc A. Cột kế tiếp vẫn trống, vì vậy chuyển 1 cách từ <code>in = 00</code> sang <code>out = 00</code>.",
        en: "Find the first empty square from the top. Both squares in column one are free, so vertical tile A fits. The next column stays empty, so transfer one way from <code>in = 00</code> to <code>out = 00</code>.",
      },
      lines: [4, 5, 7, 8, 12], watch: { c: 1, in: "00", out: "00", ways: 1 }, verdict: "run", fit: "all",
      scene: picture(1, 1, 0, "00 → 00", [0]),
    },
    {
      title: { vi: "Thử hai viên ngang", en: "Try two horizontal dominoes" }, kind: "step",
      body: {
        vi: "Đặt ngang ở ô trên thì ô dưới cũng phải đặt ngang. Hai viên A và B lấn sang cột 2, nên <code>out = 11</code> nhận thêm 1 cách từ <code>00</code>. Mask có đúng một bit 1 vẫn có 0 cách sau cột đầu.",
        en: "Placing across the top forces another horizontal tile at the bottom. Tiles A and B reach into column two, so <code>out = 11</code> gets one way from <code>00</code>. Masks with a single 1 still have zero ways after column one.",
      },
      lines: [4, 5, 6, 12, 13], watch: { c: 1, in: "00", out: "11", ways: 1 }, verdict: "run", fit: "all",
      scene: picture(1, 2, 3, "00 → 11", [0]),
    },
    {
      title: { vi: "Gộp hai nguồn", en: "Merge two sources" }, kind: "step",
      body: {
        vi: "Sau cột 2, mask <code>00</code> nhận 1 cách từ <code>00</code> nhờ đặt dọc, và 1 cách từ <code>11</code> vì cột này đã kín. Các ô dưới bảng ghi các số hạng lấy từ hàng trước, theo thứ tự mask nguồn tăng dần.",
        en: "After column two, mask <code>00</code> gets one way from <code>00</code> by placing vertically and one from <code>11</code> because the column is already full. The pills below the table show counts from the previous row in increasing source-mask order.",
      },
      lines: [4, 7, 8, 10, 11, 12, 13], watch: { c: 2, in: "00, 11", out: "00", ways: 2 }, verdict: "run", fit: "all",
      scene: picture(2, 2, 0, "1 + 1 = 2", [0, 3]),
    },
    {
      title: { vi: "Chốt mép trống", en: "Finish with an empty mask" }, kind: "answer",
      body: {
        vi: "Cột 3 lại gộp hai nguồn cho mask <code>00</code>, lần này được <code>2 + 1 = 3</code>. Đọc duy nhất mask này vì mọi cách có bit 1 đều có gạch nhô ra ngoài lưới. Hình minh họa một trong ba cách.",
        en: "Column three merges the same two sources for mask <code>00</code>, now yielding <code>2 + 1 = 3</code>. Read only this mask because a 1 would mark a domino sticking out of the board. The board shows one of the three tilings.",
      },
      lines: [4, 12, 13, 15], watch: { c: 3, in: "00, 11", out: "00", ways: 3 }, verdict: "ac", fit: "all",
      scene: picture(3, 3, 0, "2 + 1 = 3", [0, 3]),
    },
    {
      title: { vi: "Chỉ cần nhớ mép", en: "Keep only the boundary" }, kind: "recap",
      body: {
        vi: "Hai cách có cùng mask sẽ có cùng lựa chọn ở cột sau. Luôn đặt vào ô trống đầu tiên để mỗi cách chỉ được đếm một lần. Với <code>n</code> hàng, <code>m</code> cột, hai hàng DP cần O(2ⁿ) bộ nhớ và duyệt tốn tối đa O(m · n · 3ⁿ) thời gian.",
        en: "Arrangements with the same mask have identical choices in the next column. Always filling the first free square counts each tiling once. For <code>n</code> rows and <code>m</code> columns, two DP rows use O(2ⁿ) space and the search takes at most O(m · n · 3ⁿ) time.",
      },
      note: {
        vi: "Mỗi hàng ở mép thuộc tối đa một trong ba nhóm: có gạch lấn từ trái, có gạch lấn sang phải, hoặc không lấn. Duyệt từng cặp mask hợp lệ có độ sâu tối đa n.",
        en: "Each boundary square belongs to one of three groups: incoming, outgoing, or neither. The search has at most n levels for each compatible mask pair.",
      },
      lines: [3, 4, 5, 10, 12, 13, 15], watch: { c: 3, out: "00", ways: 3 }, verdict: "ac", fit: "all",
      scene: picture(3, 3, 0, "dp[00₂] = 3", [0, 3]),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  boards[0].forEach((row, r) => [...row].forEach((_, col) => {
    scene.add(`b${r}${col}`, {
      shape: shapes.block({ w: 37, h: 27, depth: 4 }), x: col * 0.76, y: 1.6 + r * 1.35,
    });
  }));
  scene.add("formula", { shape: shapes.pill(), x: 0.76, y: 4.42, o: 0 });
  scene.add("axis", { shape: shapes.pill({ text: "c" }), x: 2.53, y: 0 });
  masks.forEach((mask) => {
    const x = 3.25 + mask * 0.82;
    scene.add(`mask${mask}`, { shape: shapes.pill({ text: binary(mask) }), x, y: 0 });
    scene.add(`sum${mask}`, { shape: shapes.pill({ h: 20, pad: 5 }), x, y: 6.43, o: 0 });
  });
  rows.forEach((row, i) => {
    const y = 1.26 + i * 1.26;
    scene.add(`row${i}`, { shape: shapes.pill({ text: i }), x: 2.53, y });
    row.forEach((_, mask) => {
      scene.add(cell(i, mask), { shape: shapes.block({ w: 38, h: 25, depth: 4 }), x: 3.25 + mask * 0.82, y });
    });
  });
}
