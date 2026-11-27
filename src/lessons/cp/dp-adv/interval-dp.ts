import type { Lesson, SceneMap } from "../../../lib/types";

const A = [4, 5, 1, 3];
const N = A.length;
const U = 54;
const cell = (l: number, r: number) => `d${l}-${r}`;
const dp = A.map(() => A.map(() => 0));

A.forEach((value, i) => { dp[i][i] = value; });
for (let len = 2; len <= N; ++len) {
  for (let l = 0, r = len - 1; r < N; ++l, ++r) {
    dp[l][r] = Math.max(A[l] - dp[l + 1][r], A[r] - dp[l][r - 1]);
  }
}

function picture(length: number, formula = "", focus?: [number, number], answer = false): SceneMap {
  const scene: SceneMap = {
    axes: { o: length > 0 ? 1 : 0 },
    formula: { text: formula, o: formula ? 1 : 0, cls: answer ? "v-eq" : "is-active" },
  };
  for (let l = 0; l < N; ++l) {
    scene[`row${l}`] = { o: length > 0 ? 1 : 0 };
    scene[`col${l}`] = { o: length > 0 ? 1 : 0 };
    for (let r = l; r < N; ++r) {
      const id = cell(l, r);
      const len = r - l + 1;
      const current = len === length;
      const input = focus && ((l === focus[0] + 1 && r === focus[1]) || (l === focus[0] && r === focus[1] - 1));
      scene[id] = {
        text: len <= length ? String(dp[l][r]) : "?",
        cls: current ? "is-good" : input ? "is-active" : len > length ? "is-out" : "",
        o: length > 0 ? 1 : 0,
      };
      if (len === 1) continue;
      for (const side of ["L", "R"]) {
        scene[`${id}-${side}`] = current
          ? { p: 1, from: { p: 0 }, delay: 100, dur: 480, cls: "v-eq" }
          : { p: 0 };
      }
    }
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "dp-adv", slug: "interval-dp",
  title: { vi: "DP khoảng", en: "Interval DP" },
  added: "2026-11-27",
  summary: {
    vi: "Giải trò chơi lấy số ở hai đầu bằng cách điền bảng DP từ đoạn ngắn đến đoạn dài.",
    en: "Solve an end-picking game by filling the DP table from short intervals to long ones.",
  },
  level: "hard", minutes: 9, time: "O(n²)", memory: "O(n²)",
  goal: {
    vi: "Tính số điểm tối đa của người đi trước với dãy <b>[4, 5, 1, 3]</b>",
    en: "Find the first player's best score for <b>[4, 5, 1, 3]</b>",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> n = a.size();',
    'vector&lt;vector&lt;<span class="kw">long long</span>&gt;&gt; dp(n, vector&lt;<span class="kw">long long</span>&gt;(n));',
    '<span class="kw">for</span> (<span class="kw">int</span> i = 0; i &lt; n; ++i) dp[i][i] = a[i];',
    '<span class="kw">for</span> (<span class="kw">int</span> len = 2; len &lt;= n; ++len) {',
    '  <span class="kw">for</span> (<span class="kw">int</span> l = 0, r = len - 1; r &lt; n; ++l, ++r) {',
    '    <span class="kw">auto</span> left = a[l] - dp[l + 1][r];',
    '    <span class="kw">auto</span> right = a[r] - dp[l][r - 1];',
    '    dp[l][r] = max(left, right);',
    '  }',
    '}',
    '<span class="kw">return</span> (accumulate(a.begin(), a.end(), 0LL) + dp[0][n - 1]) / 2;',
  ],
  watch: [
    { key: "len", label: "len" }, { key: "range", label: "[l,r]" }, { key: "diff", label: "dp[l][r]" },
    { key: "score", label: { vi: "điểm người đầu", en: "first score" } },
  ],
  practice: [
    { src: "CSES 1097", name: "Removal Game", lv: "★★☆", url: "https://cses.fi/problemset/task/1097/" },
    { src: "CSES 1744", name: "Rectangle Cutting", lv: "★★☆", url: "https://cses.fi/problemset/task/1744/" },
  ],
  sceneOptions: { unit: U },
  legend: [
    { cls: "acc", label: { vi: "ô nguồn", en: "input cell" } },
    { cls: "ac", label: { vi: "vừa tính", en: "new value" } },
    { cls: "dim", label: { vi: "chưa tính", en: "pending" } },
  ],
  steps: [
    {
      title: { vi: "Lấy số ở hai đầu", en: "Pick from either end" }, kind: "problem",
      body: {
        vi: "Hai người lần lượt lấy số bên trái hoặc bên phải của dãy [4, 5, 1, 3], cộng số đó vào điểm của mình. Cả hai đều chơi tối ưu. Thử mọi diễn biến tốn O(2ⁿ) vì hầu hết lượt đều có hai lựa chọn.",
        en: "Two players take turns picking the left or right end of [4, 5, 1, 3], adding the number to their own score. Both play optimally. Exploring every play sequence costs O(2ⁿ) because most turns have two choices.",
      },
      lines: [], watch: {}, verdict: "run", fit: ["a0", "a3", "array"], scene: picture(0),
    },
    {
      title: { vi: "Điền đường chéo chính", en: "Fill the main diagonal" }, kind: "concept",
      body: {
        vi: "<code>dp[l][r]</code> là chênh lệch điểm tối đa của người sắp đi so với đối thủ trên đoạn <code>[l,r]</code>. Đoạn chỉ có một số thì người đó lấy hết, nên <code>dp[i][i] = a[i]</code>: lần lượt là 4, 5, 1, 3.",
        en: "<code>dp[l][r]</code> is the best score difference for the player about to move on <code>[l,r]</code>. That player takes the only number in a singleton, so <code>dp[i][i] = a[i]</code>: 4, 5, 1, and 3.",
      },
      lines: [2, 3], watch: { len: 1 }, verdict: "run", fit: "all", scene: picture(1, "dp[i][i] = a[i]"),
    },
    {
      title: { vi: "Xét đoạn hai số", en: "Solve length two" }, kind: "step",
      body: {
        vi: "Trên đoạn [0,1], lấy 4 thì đến lượt đối thủ lấy 5, nên chênh lệch là <code>4 − 5 = −1</code>. Lấy 5 cho <code>5 − 4 = 1</code>, vậy ô [0,1] nhận 1. Mỗi cặp mũi tên đi từ hai đoạn còn lại vào ô vừa tính.",
        en: "On [0,1], taking 4 lets the opponent take 5, giving a difference of <code>4 − 5 = −1</code>. Taking 5 gives <code>5 − 4 = 1</code>, so [0,1] gets 1. Each arrow pair leads from the two remaining intervals to the new cell.",
      },
      lines: [4, 5, 6, 7, 8], watch: { len: 2, range: "[0,1]", diff: 1 }, verdict: "run",
      fit: "all", scene: picture(2, "max(4−5, 5−4) = 1", [0, 1]),
    },
    {
      title: { vi: "Dùng lại đoạn ngắn", en: "Reuse shorter intervals" }, kind: "step",
      body: {
        vi: "Trên [1,3], lấy 5 để lại [2,3], nơi đối thủ có thể dẫn 2 điểm. Lấy 3 để lại [1,2], nơi đối thủ có thể dẫn 4 điểm. Đổi góc nhìn bằng dấu trừ, ta được <code>max(5 − 2, 3 − 4) = 3</code>.",
        en: "On [1,3], taking 5 leaves [2,3], where the opponent can lead by 2. Taking 3 leaves [1,2], where the opponent can lead by 4. Subtract to switch perspectives, giving <code>max(5 − 2, 3 − 4) = 3</code>.",
      },
      lines: [5, 6, 7, 8], watch: { len: 3, range: "[1,3]", diff: 3 }, verdict: "run",
      fit: "all", scene: picture(3, "max(5−2, 3−4) = 3", [1, 3]),
    },
    {
      title: { vi: "Tính cả đoạn", en: "Solve the full interval" }, kind: "step",
      body: {
        vi: "Lấy 4 để lại đoạn [1,3] có chênh lệch 3. Lấy 3 để lại đoạn [0,2] có chênh lệch 0. Vậy đi đầu bằng số 3 cho chênh lệch tốt nhất: <code>max(4 − 3, 3 − 0) = 3</code>.",
        en: "Taking 4 leaves [1,3] with a difference of 3. Taking 3 leaves [0,2] with a difference of 0. Opening with 3 gives the best difference: <code>max(4 − 3, 3 − 0) = 3</code>.",
      },
      lines: [5, 6, 7, 8], watch: { len: 4, range: "[0,3]", diff: 3 }, verdict: "run",
      fit: "all", scene: picture(4, "max(4−3, 3−0) = 3", [0, 3]),
    },
    {
      title: { vi: "Đổi sang điểm số", en: "Recover the first score" }, kind: "answer",
      body: {
        vi: "Hai người chia nhau tổng 13 điểm, và người đầu hơn 3 điểm. Cộng tổng với chênh lệch rồi chia đôi, ta được <code>(13 + 3) / 2 = 8</code> điểm cho người đi trước.",
        en: "The players split 13 points, and the first player leads by 3. Add the total to the difference and halve it to get <code>(13 + 3) / 2 = 8</code> points for the first player.",
      },
      lines: [11], watch: { len: 4, range: "[0,3]", diff: 3, score: 8 }, verdict: "ac",
      fit: "all", scene: picture(4, "(13 + 3) / 2 = 8", undefined, true),
    },
    {
      title: { vi: "Tăng dần độ dài", en: "Grow the interval length" }, kind: "recap",
      body: {
        vi: "Mỗi nước đi để lại đúng một đoạn ngắn hơn một phần tử, và giá trị của đoạn đó đã có khi ta tăng dần <code>len</code>. Có O(n²) đoạn và mỗi đoạn xét hai đầu, nên tốn O(n²) thời gian và bộ nhớ.",
        en: "Each move leaves an interval shorter by one element, already solved when we process by increasing <code>len</code>. There are O(n²) intervals with two choices each, so time and space are O(n²).",
      },
      lines: [4, 5, 6, 7, 8], watch: { len: 4, range: "[0,3]", diff: 3, score: 8 }, verdict: "ac",
      fit: "all", scene: picture(4, "(13 + 3) / 2 = 8", undefined, true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("array", { shape: shapes.pill({ text: "a" }), x: 0 });
  A.forEach((value, i) => {
    scene.add(`a${i}`, { shape: shapes.block({ label: value, w: 35, h: 24, depth: 4, r: 6 }), x: i + 1 });
    scene.add(`col${i}`, { shape: shapes.pill({ text: i, h: 21 }), x: i + 1, y: 1.04 });
    scene.add(`row${i}`, { shape: shapes.pill({ text: i, h: 21 }), x: 0, y: 2.35 + i * 1.58 });
    for (let r = i; r < N; ++r) {
      scene.add(cell(i, r), {
        shape: shapes.block({ label: "?", w: 32, h: 21, depth: 3, r: 6 }),
        x: r + 1, y: 2.42 + i * 1.58, o: 0,
      });
    }
  });
  scene.add("axes", { shape: shapes.pill({ text: "l / r", h: 21 }), x: 0, y: 1.04 });
  scene.add("formula", { shape: shapes.pill(), x: 2.25, y: 8.37, o: 0 });
  for (let l = 0; l < N; ++l) {
    for (let r = l + 1; r < N; ++r) {
      const to = cell(l, r);
      scene.link(`${to}-L`, { from: cell(l + 1, r), to, anchor: "center", arrow: true, bend: 0 });
      scene.link(`${to}-R`, { from: cell(l, r - 1), to, anchor: "center", arrow: true, bend: 0 });
    }
  }
}
