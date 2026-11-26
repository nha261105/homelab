import type { Lesson, SceneMap } from "../../../lib/types";

const U = 62;
const TABLE = [
  ["10", "n!", "3.63·10⁶"],
  ["20", "2ⁿ", "1.05·10⁶"],
  ["10³", "n²", "10⁶"],
  ["10⁵", "n log₂ n", "1.66·10⁶"],
  ["10⁶", "n", "10⁶"],
  ["10⁹", "log₂ n", "≈ 30"],
];
const HEADERS = ["n", "f(n)", "≈ f(n)"];
const WIDTHS = [62, 100, 112];
const X = [0, 1.55, 3.35];
const FIT = ["budget", ...HEADERS.map((_, i) => `head${i}`),
  ...TABLE.flatMap((row, r) => row.map((_, c) => `cell${r}-${c}`))];

function table(revealed: number, focus: number[] = [], conclusion = false): SceneMap {
  const picture: SceneMap = {
    budget: { cls: conclusion ? "v-eq" : "", fx: revealed === 0 ? "pulse" : undefined },
  };

  TABLE.forEach((row, r) => {
    row.forEach((_, c) => {
      const active = focus.includes(r);
      picture[`cell${r}-${c}`] = {
        o: r < revealed ? 1 : 0.28,
        cls: active ? (conclusion ? "is-good" : "is-active") : "",
        delay: active ? c * 100 : 0,
        dur: 360,
        ease: "out",
      };
    });
  });
  return picture;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "complexity",
  slug: "time-limit",
  title: { vi: "Từ n ra thuật toán", en: "From n to the algorithm" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng giới hạn của n để ước lượng số phép tính và chọn thuật toán có khả năng chạy kịp.",
    en: "Use the limit on n to estimate work and choose an algorithm likely to finish in time.",
  },
  level: "basic",
  minutes: 7,
  time: "O(n)",
  memory: "O(1)",
  goal: {
    vi: "Ước lượng số bước ở <b>n lớn nhất</b> với mốc tham khảo 10⁸ phép tính đơn giản trong 1 giây.",
    en: "Estimate the work at <b>maximum n</b> using 10⁸ simple operations in 1 second as a rough guide.",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> longestRun(std::string_view dna) {',
    '  <span class="kw">int</span> run = <span class="nm">0</span>, best = <span class="nm">0</span>;',
    "  <span class=\"kw\">char</span> prev = '\\0';",
    '  <span class="kw">for</span> (<span class="kw">char</span> c : dna) {',
    '    run = c == prev ? run + <span class="nm">1</span> : <span class="nm">1</span>;',
    '    best = std::max(best, run);',
    '    prev = c;',
    '  }',
    '  <span class="kw">return</span> best;',
    '}',
  ],
  watch: [
    { key: "n", label: { vi: "n tối đa", en: "maximum n" } },
    { key: "work", label: { vi: "số bước ước tính", en: "estimated steps" } },
    { key: "budget", label: { vi: "mốc tham khảo", en: "rough budget" } },
  ],
  practice: [
    { src: "CSES 1069", name: "Repetitions", lv: "★☆☆", url: "https://cses.fi/problemset/task/1069" },
    { src: "CSES 1094", name: "Increasing Array", lv: "★☆☆", url: "https://cses.fi/problemset/task/1094" },
  ],
  sceneOptions: { unit: U, view: [-62, -132, 356, 354] },
  legend: [
    { cls: "acc", label: { vi: "đang ước lượng", en: "estimating" } },
    { cls: "ac", label: { vi: "dưới mốc tham khảo", en: "below the rough budget" } },
  ],
  steps: [
    {
      title: { vi: "Bắt đầu từ giới hạn", en: "Start with the limit" }, kind: "problem",
      body: {
        vi: "Hai vòng lặp lồng nhau có thể chỉ mất 100 lượt khi <code>n = 10</code>, nhưng lên tới 10¹⁰ lượt khi <code>n = 10⁵</code>. Với thời hạn 1 giây, hãy dùng mốc 10⁸ phép tính đơn giản để lọc các cách làm ngay từ đầu.",
        en: "Two nested loops may take just 100 iterations at <code>n = 10</code> and reach 10¹⁰ at <code>n = 10⁵</code>. For a 1-second limit, use 10⁸ simple operations as a first-pass budget.",
      },
      lines: [], watch: { budget: "10⁸" }, verdict: "run", fit: FIT, scene: table(0),
    },
    {
      title: { vi: "Thử vét cạn", en: "Consider exhaustive search" }, kind: "concept",
      body: {
        vi: "Với 10 phần tử, liệt kê mọi hoán vị cho 10! ≈ 3,63 triệu kết quả. Với 20 phần tử, duyệt mọi tập con cho 2²⁰ ≈ 1,05 triệu kết quả, nên hãy tính cả phần việc cần làm cho mỗi kết quả.",
        en: "For 10 elements, enumerating permutations gives 10! ≈ 3.63 million results. For 20 elements, enumerating subsets gives 2²⁰ ≈ 1.05 million results, so also count the work done for each result.",
      },
      lines: [], watch: { n: "10 · 20", work: "3.63·10⁶ · 1.05·10⁶", budget: "10⁸" },
      verdict: "run", fit: FIT, scene: table(2, [0, 1]),
    },
    {
      title: { vi: "Tính số cặp", en: "Count the pairs" }, kind: "step",
      body: {
        vi: "Với <code>n = 10³</code>, hai vòng lặp dài <code>n</code> thực hiện (10³)² = 10⁶ lượt. O(n²) đáng cân nhắc nếu mỗi lượt chỉ làm vài phép tính đơn giản.",
        en: "At <code>n = 10³</code>, two loops of length <code>n</code> give (10³)² = 10⁶ iterations. O(n²) is worth considering when each iteration does only a few simple operations.",
      },
      lines: [], watch: { n: "10³", work: "10⁶", budget: "10⁸" },
      verdict: "run", fit: FIT, scene: table(3, [2]),
    },
    {
      title: { vi: "Cân nhắc sắp xếp", en: "Consider sorting" }, kind: "step",
      body: {
        vi: "Ở <code>n = 10⁵</code>, O(n²) với khoảng 10¹⁰ lượt đã vượt xa mốc. Sắp xếp O(n log n) rồi duyệt một lần là hướng đáng thử nếu bài toán cho phép, vì 10⁵ × log₂(10⁵) ≈ 1,66 triệu.",
        en: "At <code>n = 10⁵</code>, roughly 10¹⁰ quadratic iterations far exceed the budget. Sorting in O(n log n) and then scanning is a candidate when the problem allows it, since 10⁵ × log₂(10⁵) ≈ 1.66 million.",
      },
      lines: [], watch: { n: "10⁵", work: "1.66·10⁶", budget: "10⁸" },
      verdict: "run", fit: FIT, scene: table(4, [3]),
    },
    {
      title: { vi: "Duyệt đúng một lần", en: "Scan the input once" }, kind: "step",
      body: {
        vi: "Bài Repetitions có tối đa 10⁶ ký tự. Mỗi vòng lặp cập nhật độ dài đoạn hiện tại <code>run</code> và kỷ lục <code>best</code> bằng vài phép tính, nên chỉ cần 10⁶ lượt và O(1) bộ nhớ thêm.",
        en: "Repetitions has up to 10⁶ characters. Each iteration updates the current run <code>run</code> and the record <code>best</code> in a few operations, so the scan takes 10⁶ iterations and O(1) extra memory.",
      },
      lines: [4, 5, 6, 7], watch: { n: "10⁶", work: "10⁶", budget: "10⁸" },
      verdict: "run", fit: FIT, scene: table(5, [4]),
    },
    {
      title: { vi: "Chia đôi miền tìm kiếm", en: "Halve the search space" }, kind: "answer",
      body: {
        vi: "Nếu <code>n = 10⁹</code> là cận của miền tìm kiếm và mỗi lần kiểm tra cho biết nên bỏ nửa nào, khoảng 30 lần chia đôi là đủ vì 2³⁰ &gt; 10⁹. Nếu đầu vào thật sự chứa 10⁹ phần tử, phải đọc ít nhất 10⁹ lần mới xem hết.",
        en: "If <code>n = 10⁹</code> bounds a search space and each check identifies which half to discard, about 30 halvings suffice because 2³⁰ &gt; 10⁹. If the input actually contains 10⁹ elements, reading them all takes at least 10⁹ reads.",
      },
      lines: [], watch: { n: "10⁹", work: "≈ 30", budget: "10⁸" },
      verdict: "ac", fit: FIT, scene: table(6, [5], true),
    },
    {
      title: { vi: "Chốt bằng ca lớn nhất", en: "Check the largest case" }, kind: "recap",
      body: {
        vi: "Lấy <code>n</code> lớn nhất rồi thay vào hàm tăng trưởng <code>f(n)</code> của thuật toán. Chẳng hạn với <code>n = 10⁵</code>, khoảng 1,66 triệu bước của mô hình n log₂ n dễ cân nhắc hơn 10¹⁰ bước của n².",
        en: "Plug the maximum <code>n</code> into the algorithm’s growth function <code>f(n)</code>. For example, at <code>n = 10⁵</code>, about 1.66 million steps for the n log₂ n model are more plausible than the 10¹⁰ steps for n².",
      },
      note: {
        vi: "Chừa khoảng an toàn vì thời gian mỗi bước và tốc độ đọc dữ liệu còn tùy máy chấm.",
        en: "Leave headroom because the cost of each step and input speed depend on the judge.",
      },
      lines: [], watch: { n: "10⁵", work: "1.66·10⁶", budget: "10⁸" },
      verdict: "ac", fit: FIT, scene: table(6, [3], true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("budget", { shape: shapes.pill({ text: "≈ 10⁸ / 1 s" }), x: 1.75, z: 1.4 });

  HEADERS.forEach((text, c) => {
    scene.add(`head${c}`, { shape: shapes.pill({ text }), x: X[c], z: 0.65 });
  });

  TABLE.forEach((row, r) => {
    row.forEach((label, c) => {
      scene.add(`cell${r}-${c}`, {
        shape: shapes.block({ label, w: WIDTHS[c], h: 25, depth: 3, r: 7 }),
        x: X[c], y: r * 1.1, o: 0.28,
      });
    });
  });
}
