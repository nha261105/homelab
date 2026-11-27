import type { Lesson, SceneMap } from "../../../lib/types";

const faces = [1, 2, 3, 4, 5, 6];
const totals = [faces, [2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12]];
const counts = Array.from({ length: 13 }, (_, s) => Number(s === 0));
const distribution = [counts];
for (let i = 1; i <= 2; i++) {
  const prev = distribution[i - 1];
  distribution.push(prev.map((_, s) => faces.reduce((sum, face) => sum + (prev[s - face] ?? 0), 0)));
}

function picture(stage: number, focus: number[] = [], formula = "", answer = false): SceneMap {
  const scene: SceneMap = {
    seed: { o: stage === 1 ? 1 : 0 },
    formula: { text: formula, o: formula ? 1 : 0, cls: answer ? "v-eq" : "", from: { o: 0 }, delay: 280, dur: 320 },
  };
  totals.forEach((sums, row) => {
    const roll = Math.min(row + 1, 2);
    const shown = stage >= row + 2;
    sums.forEach((s, col) => {
      const selected = row > 0 && focus.includes(s);
      const feeds = row === 0 && stage >= 3 && focus.some((goal) => faces.includes(goal - s));
      const count = distribution[roll][s];
      scene[`p${row}-${col}`] = {
        text: shown ? `${count}/${6 ** roll}` : "·",
        ...(selected ? { fx: { type: "pulse", amp: 0.06, delay: 300 } } : {}),
        cls: !shown ? "is-out" : selected ? "is-good" : feeds || row === 0 && stage === 2 ? "is-active" : "",
      };
      scene[`calc${row}-${col}`] = {
        text: stage >= 5 && row > 0 ? `${s}·${count}/36` : shown ? `${count}·1/${6 ** roll}` : "",
        o: shown ? 1 : 0,
        s: 0.8,
      };
    });
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "dp-adv",
  slug: "expected-value",
  title: { vi: "Xác suất & kỳ vọng", en: "Probability and expectation" },
  added: "2026-11-27",
  summary: {
    vi: "Dựng phân phối tổng qua từng lần tung, rồi dùng nó để tính xác suất và kỳ vọng.",
    en: "Build the sum distribution one roll at a time, then use it to read probabilities and expectation.",
  },
  level: "hard",
  minutes: 9,
  time: "O(n²)",
  memory: "O(n)",
  goal: {
    vi: "Tung xúc xắc đều hai lần, tính <b>P(9 ≤ S ≤ 10)</b> và <b>E[S]</b>",
    en: "Roll a fair die twice and find <b>P(9 ≤ S ≤ 10)</b> and <b>E[S]</b>",
  },
  codeLang: "C++17",
  code: [
    'vector&lt;<span class="kw">double</span>&gt; p(6*n + 1), next(6*n + 1);',
    'p[0] = 1;',
    '<span class="kw">for</span> (<span class="kw">int</span> r = 0; r &lt; n; ++r) {',
    '  fill(next.begin(), next.end(), 0.0);',
    '  <span class="kw">for</span> (<span class="kw">int</span> s = r; s &lt;= 6*r; ++s)',
    '    <span class="kw">for</span> (<span class="kw">int</span> d = 1; d &lt;= 6; ++d)',
    '      next[s + d] += p[s] / 6.0;',
    '  p.swap(next);',
    '}',
    '<span class="kw">double</span> prob = 0, mean = 0;',
    '<span class="kw">for</span> (<span class="kw">int</span> s = n; s &lt;= 6*n; ++s) {',
    '  <span class="kw">if</span> (a &lt;= s &amp;&amp; s &lt;= b) prob += p[s];',
    '  mean += s * p[s];',
    '}',
  ],
  watch: [
    { key: "rolls", label: { vi: "số lần tung", en: "rolls" } },
    { key: "p", label: "p[s]" },
    { key: "prob", label: "prob" },
    { key: "mean", label: "mean" },
  ],
  practice: [
    { src: "CSES 1725", name: "Dice Probability", lv: "★★☆", url: "https://cses.fi/problemset/task/1725" },
    { src: "CSES 1727", name: "Candy Lottery", lv: "★★☆", url: "https://cses.fi/problemset/task/1727" },
  ],
  sceneOptions: { unit: 57 },
  legend: [
    { cls: "acc", label: { vi: "xác suất từ lần tung trước", en: "probability from the previous roll" } },
    { cls: "ac", label: { vi: "tổng đang xét", en: "sum in focus" } },
  ],
  steps: [
    {
      title: { vi: "Tổng hai lần tung", en: "Add two rolls" }, kind: "problem",
      body: {
        vi: "Tung một xúc xắc đều hai lần độc lập. Tổng <code>S</code> nằm từ 2 đến 12. Thử hết các chuỗi kết quả đã có <code>6² = 36</code> trường hợp, và con số tăng thành <code>6ⁿ</code> sau <code>n</code> lần tung.",
        en: "Roll a fair die twice independently. The sum <code>S</code> ranges from 2 to 12. Listing every outcome takes <code>6² = 36</code> cases here, growing to <code>6ⁿ</code> after <code>n</code> rolls.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(0),
    },
    {
      title: { vi: "Bắt đầu từ 0", en: "Start at zero" }, kind: "concept",
      body: {
        vi: "<code>p[s]</code> là xác suất có tổng <code>s</code> sau số lần tung đã xử lý. Trước khi tung, tổng chắc chắn bằng 0, nên <code>p[0] = 1</code> và các ô khác bằng 0.",
        en: "<code>p[s]</code> is the probability of sum <code>s</code> after the rolls processed so far. Before any roll the sum is certainly zero, so <code>p[0] = 1</code> and all other entries are zero.",
      },
      lines: [1, 2], watch: { rolls: 0, p: "p[0] = 1" }, verdict: "run", fit: "all", scene: picture(1),
    },
    {
      title: { vi: "Chia đều sáu mặt", en: "Split across six faces" }, kind: "step",
      body: {
        vi: "Xúc xắc có sáu mặt đều nhau, nên từ tổng cũ <code>s</code>, mỗi mặt <code>d</code> đóng góp <code>p[s] / 6</code> vào tổng mới <code>s + d</code>. Từ tổng 0 với xác suất 1, mỗi tổng từ 1 đến 6 nhận đúng <code>1/6</code>.",
        en: "All six faces are equally likely, so from old sum <code>s</code>, face <code>d</code> contributes <code>p[s] / 6</code> to new sum <code>s + d</code>. Starting from zero with probability 1, each sum 1 through 6 gets <code>1/6</code>.",
      },
      lines: [3, 4, 5, 6, 7, 8], watch: { rolls: 1, p: "p[1…6] = 1/6" }, verdict: "run", fit: "all",
      scene: picture(2, [], "1 ÷ 6 = 1/6"),
    },
    {
      title: { vi: "Gộp các đường đến", en: "Combine incoming contributions" }, kind: "step",
      body: {
        vi: "Sau lần tung thứ hai, tổng 7 có sáu nguồn: với mỗi tổng cũ từ 1 đến 6, ta cần đúng mặt bù lên 7. Sáu trường hợp rời nhau, mỗi trường hợp góp <code>(1/6)/6 = 1/36</code>, nên <code>p[7] = 6/36</code>.",
        en: "After roll two, sum 7 has six sources: for each old sum from 1 to 6, exactly one face completes it to 7. The six cases are disjoint and each contributes <code>(1/6)/6 = 1/36</code>, so <code>p[7] = 6/36</code>.",
      },
      lines: [5, 6, 7, 8], watch: { rolls: 2, p: "p[7] = 6/36" }, verdict: "run", fit: "all",
      scene: picture(3, [7], "6 × (1/6 ÷ 6) = 6/36"),
    },
    {
      title: { vi: "Cộng xác suất trong đoạn", en: "Add the interval probabilities" }, kind: "step",
      body: {
        vi: "Tổng 9 lấy từ bốn tổng cũ 3 đến 6, còn tổng 10 lấy từ ba tổng cũ 4 đến 6. Mỗi nguồn vẫn góp <code>1/36</code>, nên <code>P(9 ≤ S ≤ 10) = 4/36 + 3/36 = 7/36</code>.",
        en: "Sum 9 uses four old sums, 3 through 6, and sum 10 uses three, 4 through 6. Each source still contributes <code>1/36</code>, so <code>P(9 ≤ S ≤ 10) = 4/36 + 3/36 = 7/36</code>.",
      },
      lines: [5, 6, 7, 11, 12], watch: { rolls: 2, p: "4/36, 3/36", prob: "7/36" }, verdict: "run", fit: "all",
      scene: picture(4, [9, 10], "4/36 + 3/36 = 7/36", true),
    },
    {
      title: { vi: "Tính trung bình có trọng số", en: "Take the weighted average" }, kind: "answer",
      body: {
        vi: "Kỳ vọng là tổng các tích <code>s · p[s]</code> trên cả phân phối. Chẳng hạn ô 7 góp <code>7 · 6/36 = 42/36</code>. Các tổng 2 đến 7 góp <code>112/36</code>, các tổng 8 đến 12 góp <code>140/36</code>, nên <code>E[S] = 252/36 = 7</code>.",
        en: "Expectation adds <code>s · p[s]</code> across the whole distribution. For instance, sum 7 contributes <code>7 · 6/36 = 42/36</code>. Sums 2 through 7 contribute <code>112/36</code> and sums 8 through 12 contribute <code>140/36</code>, so <code>E[S] = 252/36 = 7</code>.",
      },
      lines: [10, 11, 12, 13], watch: { rolls: 2, prob: "7/36", mean: 7 }, verdict: "ac", fit: "all",
      scene: picture(5, [7], "E[S] = (112 + 140) / 36 = 7", true),
    },
    {
      title: { vi: "Giữ phân phối hiện tại", en: "Keep the current distribution" }, kind: "recap",
      body: {
        vi: "Tổng cũ đủ để mô tả lần chuyển tiếp vì lần tung mới độc lập với các lần trước. Mỗi lượt xử lý O(n) giá trị tổng và sáu mặt, nên cả DP tốn O(n²) thời gian, O(n) bộ nhớ. Nếu chỉ cần kỳ vọng của tổng, cộng hai kỳ vọng của từng lần tung cũng được <code>3,5 + 3,5 = 7</code>.",
        en: "The old sum fully describes the transition because the new roll is independent of the earlier ones. Each pass processes O(n) sums and six faces, giving O(n²) time and O(n) space. For the expected sum alone, linearity also gives <code>3.5 + 3.5 = 7</code>.",
      },
      lines: [3, 4, 5, 6, 7, 8, 13], watch: { rolls: 2, prob: "7/36", mean: 7 }, verdict: "ac", fit: "all",
      scene: picture(5, [], "E[S] = 252/36 = 7", true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("seed", { shape: shapes.pill({ text: "p[0] = 1" }), x: 2.65, y: 0, o: 0 });
  totals.forEach((sums, row) => {
    const y = 1.35 + row * 2.94;
    scene.add(`roll${row}`, { shape: shapes.pill({ text: `r = ${Math.min(row + 1, 2)}`, h: 22, pad: 5 }), x: -1.15, y: y + 1.06 });
    sums.forEach((s, col) => {
      scene.add(`s${row}-${col}`, { shape: shapes.pill({ text: s, h: 19, pad: 5 }), x: col * 1.07, y });
      scene.add(`p${row}-${col}`, { shape: shapes.block({ w: 51, h: 24, depth: 4 }), x: col * 1.07, y: y + 1.06 });
      scene.add(`calc${row}-${col}`, {
        shape: shapes.pill({ h: 20, pad: 4 }), x: col * 1.07, y: y + 1.91, o: 0,
      });
    });
  });
  scene.add("formula", { shape: shapes.pill(), x: 2.5, y: 10.4, o: 0 });
}
