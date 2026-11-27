import type { Lesson, SceneMap } from "../../../lib/types";

const S = "ab";
const T = "bc";
const U = 52;
const cell = (i: number, j: number) => `d${i}${j}`;
const edit = Array.from({ length: S.length + 1 }, (_, i) =>
  Array.from({ length: T.length + 1 }, (_, j) => i || j));
const lcs = edit.map((row) => row.map(() => 0));

function editChoices(i: number, j: number) {
  return [
    edit[i - 1][j] + 1,
    edit[i][j - 1] + 1,
    edit[i - 1][j - 1] + Number(S[i - 1] !== T[j - 1]),
  ];
}

for (let i = 1; i <= S.length; ++i) {
  for (let j = 1; j <= T.length; ++j) {
    edit[i][j] = Math.min(...editChoices(i, j));
    lcs[i][j] = S[i - 1] === T[j - 1]
      ? lcs[i - 1][j - 1] + 1
      : Math.max(lcs[i - 1][j], lcs[i][j - 1]);
  }
}

function picture(count: number, mode: "dp" | "lcs", inputs: string[], outputs: string[], formulas: string[]): SceneMap {
  const table = mode === "dp" ? edit : lcs;
  const scene: SceneMap = { table: { text: mode === "dp" ? "dp" : "lcs" } };
  table.forEach((row, i) => row.forEach((value, j) => {
    const id = cell(i, j);
    const ready = count >= 0 && (i === 0 || j === 0 || (i - 1) * T.length + j <= count);
    const output = outputs.includes(id);
    scene[id] = {
      text: ready ? String(value) : "?",
      cls: output ? "is-good" : inputs.includes(id) ? "is-active" : ready ? "" : "is-out",
      o: ready ? 1 : 0.55,
      ...(output ? { fx: { type: "pulse", delay: 320 } } : {}),
    };
  }));
  for (let k = 0; k < 2; ++k) {
    const text = formulas[k] ?? "";
    scene[`formula${k}`] = {
      text, o: text ? 1 : 0,
      ...(text ? { from: { o: 0, s: 0.85 }, delay: 480, dur: 320, ease: "back" } : {}),
    };
  }
  return scene;
}

function editStep(i: number, j: number): SceneMap {
  const [del, ins, diag] = editChoices(i, j);
  return picture((i - 1) * T.length + j, "dp",
    [cell(i - 1, j), cell(i, j - 1), cell(i - 1, j - 1)], [cell(i, j)],
    [`dp[${i}][${j}] = min(${del}, ${ins}, ${diag}) = ${edit[i][j]}`]);
}

export const lesson: Lesson = {
  track: "cp",
  topic: "dp",
  slug: "edit-distance",
  title: { vi: "LCS & khoảng cách chỉnh sửa", en: "LCS and edit distance" },
  added: "2026-11-27",
  summary: {
    vi: "Điền bảng theo cặp tiền tố để tìm số lần chỉnh sửa ít nhất và độ dài dãy con chung dài nhất.",
    en: "Fill a table of prefix pairs to find the fewest edits and the longest common subsequence length.",
  },
  level: "medium",
  minutes: 9,
  time: "O(nm)",
  memory: "O(nm)",
  goal: {
    vi: "Đổi <b>ab → bc</b> với ít thao tác nhất và tìm độ dài LCS",
    en: "Transform <b>ab → bc</b> with the fewest edits and find the LCS length",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> n = s.size(), m = t.size();',
    'vector&lt;vector&lt;int&gt;&gt; dp(n + 1, vector&lt;int&gt;(m + 1));',
    '<span class="kw">auto</span> lcs = dp;',
    '<span class="kw">for</span> (<span class="kw">int</span> i = 0; i &lt;= n; ++i) dp[i][0] = i;',
    '<span class="kw">for</span> (<span class="kw">int</span> j = 0; j &lt;= m; ++j) dp[0][j] = j;',
    '<span class="kw">for</span> (<span class="kw">int</span> i = 1; i &lt;= n; ++i)',
    '  <span class="kw">for</span> (<span class="kw">int</span> j = 1; j &lt;= m; ++j) {',
    '    <span class="kw">bool</span> same = s[i - 1] == t[j - 1];',
    '    dp[i][j] = min({dp[i-1][j] + 1, dp[i][j-1] + 1,',
    '                    dp[i-1][j-1] + !same});',
    '    lcs[i][j] = same ? lcs[i-1][j-1] + 1',
    '                     : max(lcs[i-1][j], lcs[i][j-1]);',
    '  }',
  ],
  watch: [
    { key: "cell", label: { vi: "ô đang tính", en: "current entry" } },
    { key: "value", label: { vi: "giá trị", en: "value" } },
  ],
  practice: [
    { src: "LeetCode 1143", name: "Longest Common Subsequence", lv: "★★☆", url: "https://leetcode.com/problems/longest-common-subsequence/" },
    { src: "LeetCode 72", name: "Edit Distance", lv: "★★☆", url: "https://leetcode.com/problems/edit-distance/" },
    { src: "CSES 1639", name: "Edit Distance", lv: "★★☆", url: "https://cses.fi/problemset/task/1639/" },
  ],
  sceneOptions: { unit: U, view: [-115, -100, 330, 320] },
  legend: [
    { cls: "acc", label: { vi: "ô dùng để tính", en: "input entry" } },
    { cls: "ac", label: { vi: "ô vừa tính", en: "computed entry" } },
    { cls: "dim", label: { vi: "chưa tính", en: "pending" } },
  ],
  steps: [
    {
      title: { vi: "Đổi ab thành bc", en: "Transform ab into bc" }, kind: "problem",
      body: {
        vi: "Mỗi lần thêm, xoá hoặc thay một ký tự đều tốn 1 thao tác. Để tìm cách đổi <code>ab</code> thành <code>bc</code> ít bước nhất, ta lập bảng cho các cặp tiền tố. Thử mọi nhánh chỉnh sửa sẽ tính lại nhiều cặp giống nhau.",
        en: "Each insertion, deletion, or replacement costs 1 edit. To find the fewest edits from <code>ab</code> to <code>bc</code>, build a table of prefix pairs. Branching over possible edits recomputes the same pairs.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(-1, "dp", [], [], []),
    },
    {
      title: { vi: "Bắt đầu từ rỗng", en: "Start with empty prefixes" }, kind: "concept",
      body: {
        vi: "<code>dp[i][j]</code> là số thao tác ít nhất để đổi <code>i</code> ký tự đầu của <code>s</code> thành <code>j</code> ký tự đầu của <code>t</code>. Ký hiệu ∅ là chuỗi rỗng: để có <code>bc</code> từ ∅ cần thêm 2 ký tự, còn để đưa <code>ab</code> về ∅ cần xoá 2 ký tự.",
        en: "<code>dp[i][j]</code> is the minimum cost to turn the first <code>i</code> characters of <code>s</code> into the first <code>j</code> of <code>t</code>. The symbol ∅ marks the empty string: building <code>bc</code> from ∅ takes 2 insertions, and shrinking <code>ab</code> to ∅ takes 2 deletions.",
      },
      lines: [2, 4, 5], watch: { cell: "dp[0][0]", value: 0 }, verdict: "run", fit: "all",
      scene: picture(0, "dp", [], ["d00", "d01", "d02", "d10", "d20"], ["dp[i][0] = i, dp[0][j] = j"]),
    },
    {
      title: { vi: "Thay a bằng b", en: "Replace a with b" }, kind: "step",
      body: {
        vi: "Với <code>a → b</code>, ô trên cho chi phí xoá <code>1 + 1</code>, ô trái cho chi phí thêm <code>1 + 1</code>, còn ô chéo cho chi phí thay <code>0 + 1</code>. Chọn giá trị nhỏ nhất là 1.",
        en: "For <code>a → b</code>, the entry above gives deletion at <code>1 + 1</code>, the left gives insertion at <code>1 + 1</code>, and the diagonal gives replacement at <code>0 + 1</code>. The minimum is 1.",
      },
      note: {
        vi: "Trên: bỏ ký tự cuối của s. Trái: thêm ký tự cuối của t. Chéo: ghép hai ký tự cuối, tốn 1 nếu phải thay.",
        en: "Above: delete the last character of s. Left: insert the last of t. Diagonal: pair the last two characters, paying 1 for a replacement.",
      },
      lines: [8, 9, 10], watch: { cell: "dp[1][1]", value: edit[1][1] }, verdict: "run", fit: "all", scene: editStep(1, 1),
    },
    {
      title: { vi: "Thêm ký tự c", en: "Insert character c" }, kind: "step",
      body: {
        vi: "Để đổi <code>a → bc</code>, có thể dùng ô trái: đổi <code>a</code> thành <code>b</code> mất 1 bước rồi thêm <code>c</code> mất 1 bước nữa. Ô chéo cũng cho 2, còn ô trên cho 3.",
        en: "For <code>a → bc</code>, the entry on the left lets us turn <code>a</code> into <code>b</code> in 1 edit and then insert <code>c</code> for 1 more. The diagonal also gives 2, while the entry above gives 3.",
      },
      lines: [9, 10], watch: { cell: "dp[1][2]", value: edit[1][2] }, verdict: "run", fit: "all", scene: editStep(1, 2),
    },
    {
      title: { vi: "Giữ ký tự b", en: "Keep character b" }, kind: "step",
      body: {
        vi: "Hai tiền tố <code>ab</code> và <code>b</code> cùng kết thúc bằng <code>b</code>, nên đi chéo tốn thêm 0. Ô chéo đã tính chi phí <code>a → ∅</code> là 1, tức là xoá <code>a</code> rồi giữ nguyên <code>b</code>.",
        en: "The prefixes <code>ab</code> and <code>b</code> both end in <code>b</code>, so the diagonal adds 0. Its entry already gives the cost of <code>a → ∅</code> as 1: delete <code>a</code> and keep <code>b</code>.",
      },
      lines: [8, 10], watch: { cell: "dp[2][1]", value: edit[2][1] }, verdict: "run", fit: "all", scene: editStep(2, 1),
    },
    {
      title: { vi: "Đọc khoảng cách", en: "Read the edit distance" }, kind: "answer",
      body: {
        vi: "Ô cuối lấy nhỏ nhất trong <code>3, 2, 2</code>, nên <code>dp[2][2] = 2</code>. Theo ô trái, ta có cách đạt đúng 2 thao tác: xoá <code>a</code> để còn <code>b</code>, rồi thêm <code>c</code>.",
        en: "The final entry takes the minimum of <code>3, 2, 2</code>, so <code>dp[2][2] = 2</code>. The left entry gives a two-edit solution: delete <code>a</code> to get <code>b</code>, then insert <code>c</code>.",
      },
      lines: [9, 10], watch: { cell: "dp[2][2]", value: edit[2][2] }, verdict: "ac", fit: "all", scene: editStep(2, 2),
    },
    {
      title: { vi: "Đổi sang bảng LCS", en: "Switch to the LCS table" }, kind: "concept",
      body: {
        vi: "<code>lcs[i][j]</code> là độ dài dãy con chung dài nhất của hai tiền tố, giữ nguyên thứ tự ký tự. Hàng và cột rỗng đều bằng 0. Khi ký tự cuối khác nhau, bỏ một trong hai ký tự rồi lấy giá trị lớn hơn ở ô trên và ô trái.",
        en: "<code>lcs[i][j]</code> is the longest common subsequence length of the two prefixes, keeping character order. The empty row and column are all 0. When the last characters differ, skip either one and take the larger of the entries above and to the left.",
      },
      lines: [3, 12], watch: { cell: "lcs[1][2]", value: lcs[1][2] }, verdict: "ac", fit: "all",
      scene: picture(2, "lcs", ["d01", "d02", "d10"], ["d11", "d12"],
        ["lcs[1][1] = max(0, 0) = 0", "lcs[1][2] = max(0, 0) = 0"]),
    },
    {
      title: { vi: "Giữ b trong LCS", en: "Keep b in the LCS" }, kind: "answer",
      body: {
        vi: "Khi hai ký tự cuối cùng là <code>b</code>, nối thêm <code>b</code> vào dãy con ở ô chéo được <code>0 + 1 = 1</code>. Ở ô cuối, <code>b</code> và <code>c</code> khác nhau, nên lấy <code>max(0, 1) = 1</code>. LCS là <code>b</code>.",
        en: "When both prefixes end in <code>b</code>, append <code>b</code> to the diagonal subsequence for <code>0 + 1 = 1</code>. At the last entry, <code>b</code> and <code>c</code> differ, so take <code>max(0, 1) = 1</code>. The LCS is <code>b</code>.",
      },
      lines: [8, 11, 12], watch: { cell: "lcs[2][2]", value: lcs[2][2] }, verdict: "ac", fit: "all",
      scene: picture(4, "lcs", ["d10", "d12"], ["d21", "d22"],
        ["lcs[2][1] = 0 + 1 = 1", "lcs[2][2] = max(0, 1) = 1"]),
    },
    {
      title: { vi: "Dùng lại ô đã tính", en: "Reuse earlier entries" }, kind: "recap",
      body: {
        vi: "Cả hai bảng chỉ dùng ô trên, trái hoặc chéo trên trái, nên điền từng hàng từ trái sang phải là đủ. Với hai chuỗi dài <code>n</code> và <code>m</code>, mỗi bảng tốn O(nm) thời gian và bộ nhớ.",
        en: "Both tables only read the entries above, left, or diagonally up-left, so filling each row left to right is enough. For strings of lengths <code>n</code> and <code>m</code>, each table takes O(nm) time and space.",
      },
      lines: [6, 7, 9, 10, 11, 12], watch: { cell: "lcs[2][2]", value: lcs[2][2] }, verdict: "ac", fit: "all",
      scene: picture(4, "lcs", [], ["d22"], ["dp[2][2] = 2", "lcs[2][2] = 1"]),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("table", { shape: shapes.pill({ text: "dp" }), x: -1.15 });
  edit[0].forEach((_, j) => {
    scene.add(`col${j}`, { shape: shapes.pill({ text: T.slice(0, j) || "∅" }), x: j });
  });
  edit.forEach((row, i) => {
    const y = (i + 1) * 1.63;
    scene.add(`row${i}`, { shape: shapes.pill({ text: S.slice(0, i) || "∅" }), x: -1.15, y, z: 0.17 });
    row.forEach((_, j) => {
      scene.add(cell(i, j), { shape: shapes.block({ label: "?", w: 45, h: 30, depth: 4 }), x: j, y });
    });
  });
  scene.add("formula0", { shape: shapes.pill(), x: 0.55, y: 6.32, o: 0 });
  scene.add("formula1", { shape: shapes.pill(), x: 0.55, y: 7.5, o: 0 });
}
