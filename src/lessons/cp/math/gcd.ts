import type { Lesson, SceneMap } from "../../../lib/types";

// Offsets are in tiles, so the pieces meet at the original cut lines.
const pieces = [
  { id: "whole", x: 0, y: 0, w: 48, h: 18, label: "48×18" },
  { id: "squareA", x: 0, y: 0, w: 18, h: 18, label: "18×18" },
  { id: "squareB", x: 18, y: 0, w: 18, h: 18, label: "18×18" },
  { id: "restA", x: 36, y: 0, w: 12, h: 18, label: "12×18" },
  { id: "squareC", x: 36, y: 0, w: 12, h: 12, label: "12×12" },
  { id: "restB", x: 36, y: 12, w: 12, h: 6, label: "12×6" },
  { id: "squareD", x: 36, y: 12, w: 6, h: 6, label: "6" },
  { id: "squareE", x: 42, y: 12, w: 6, h: 6, label: "6" },
];
const firstCut = ["squareA", "squareB", "restA"];
const secondCut = ["squareA", "squareB", "squareC", "restB"];
const tiled = ["squareA", "squareB", "squareC", "squareD", "squareE"];
const fit = ["whole", "calc"];
const SCALE = 6;

function rectangle(visible: string[], selected: string[], text: string, solved = false): SceneMap {
  const scene: SceneMap = Object.fromEntries(visible.map((id) => [
    id, { o: 1, cls: selected.includes(id) ? solved ? "is-good" : "is-active" : "" },
  ]));
  scene.calc = { o: 1, text, cls: solved ? "v-eq" : "" };
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "math",
  slug: "gcd",
  title: { vi: "Euclid & Euclid mở rộng", en: "Euclid and extended Euclid" },
  added: "2026-11-27",
  summary: {
    vi: "Cắt hình chữ nhật để tìm ước chung lớn nhất, rồi lần ngược các phép chia để tìm hệ số Bézout.",
    en: "Cut a rectangle to find its greatest common divisor, then reverse the divisions to find Bézout coefficients.",
  },
  level: "medium",
  minutes: 8,
  time: "O(log(min(a, b) + 1))",
  memory: "O(log(min(a, b) + 1))",
  goal: { vi: "Tìm <b>gcd(48, 18)</b> và viết nó dưới dạng <b>48x + 18y</b>", en: "Find <b>gcd(48, 18)</b> and write it as <b>48x + 18y</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">#include</span> &lt;tuple&gt;',
    'std::tuple&lt;<span class="kw">long long</span>, <span class="kw">long long</span>, <span class="kw">long long</span>&gt;',
    'egcd(<span class="kw">long long</span> a, <span class="kw">long long</span> b) {',
    '  <span class="kw">if</span> (b == 0) <span class="kw">return</span> {a, 1, 0};',
    '  <span class="kw">auto</span> [g, x, y] = egcd(b, a % b);',
    '  <span class="kw">return</span> {g, y, x - (a / b) * y};',
    '}',
  ],
  watch: [
    { key: "pair", label: "(a, b)" },
    { key: "rest", label: "a % b" },
    { key: "result", label: "(g, x, y)" },
  ],
  practice: [
    { src: "LeetCode 1979", name: "Find Greatest Common Divisor of Array", lv: "★☆☆", url: "https://leetcode.com/problems/find-greatest-common-divisor-of-array/" },
    { src: "CSES 1081", name: "Common Divisors", lv: "★★☆", url: "https://cses.fi/problemset/task/1081" },
  ],
  sceneOptions: { unit: 1, view: [-30, -135, 348, 245] },
  legend: [
    { cls: "acc", label: { vi: "phần đang xét", en: "piece in focus" } },
    { cls: "ac", label: { vi: "ô vuông cạnh 6", en: "square of side 6" } },
  ],
  steps: [
    {
      title: { vi: "Tìm cạnh ô vuông", en: "Find the tile size" }, kind: "problem",
      body: {
        vi: "Muốn lát hình 48×18 bằng các ô vuông cùng cỡ, cạnh ô phải chia hết cả 48 lẫn 18. Có thể thử từ 18 xuống 1 để tìm cạnh lớn nhất, nhưng với số lớn thì thử lần lượt rất chậm.",
        en: "To tile a 48×18 rectangle with equal squares, the square's side length must divide both 48 and 18. You could test every length from 18 down to 1, but scanning candidates is slow for large inputs.",
      },
      lines: [], watch: { pair: "(48, 18)" }, verdict: "run", fit,
      scene: rectangle(["whole"], ["whole"], "gcd(48, 18) = ?"),
    },
    {
      title: { vi: "Cắt hai ô 18", en: "Cut two 18-squares" }, kind: "concept",
      body: {
        vi: "Cắt hai ô 18×18 theo cạnh dài 48, phần còn lại rộng 12 và cao 18. Vì 48 = 2·18 + 12, số nào chia hết 18 và 48 thì cũng chia hết 12, và ngược lại.",
        en: "Cut two 18×18 squares along the long side of 48, leaving a piece 12 wide and 18 high. Since 48 = 2·18 + 12, a divisor common to 18 and 48 also divides 12, and the implication works in reverse.",
      },
      lines: [5], watch: { pair: "(48, 18)", rest: 12 }, verdict: "run", fit,
      scene: rectangle(firstCut, ["restA"], "48 = 2·18 + 12"),
    },
    {
      title: { vi: "Cắt một ô 12", en: "Cut one 12-square" }, kind: "step",
      body: {
        vi: "Xét phần 12×18, cạnh dài lúc này là 18. Cắt một ô 12×12, còn hình 12×6, nên chuyển từ cặp (18, 12) sang (12, 6).",
        en: "The long side of the 12×18 piece is now 18. Cutting one 12×12 square leaves 12×6, so the pair (18, 12) becomes (12, 6).",
      },
      lines: [5], watch: { pair: "(18, 12)", rest: 6 }, verdict: "run", fit,
      scene: rectangle(secondCut, ["restB"], "18 = 1·12 + 6"),
    },
    {
      title: { vi: "Hết phần dư", en: "Reach zero remainder" }, kind: "step",
      body: {
        vi: "Hai ô 6×6 phủ kín phần 12×6. Lời gọi <code>egcd(6, 0)</code> trả về <code>(6, 1, 0)</code>, vì ước chung lớn nhất là 6 và 6 = 1·6 + 0·0.",
        en: "Two 6×6 squares fill the 12×6 piece. The call <code>egcd(6, 0)</code> returns <code>(6, 1, 0)</code> because the gcd is 6 and 6 = 1·6 + 0·0.",
      },
      lines: [4, 5], watch: { pair: "(12, 6)", rest: 0, result: "(6, 1, 0)" }, verdict: "run", fit,
      scene: rectangle(tiled, ["squareD", "squareE"], "12 = 2·6 + 0", true),
    },
    {
      title: { vi: "Lần ngược từ đáy", en: "Unwind the base case" }, kind: "step",
      body: {
        vi: "Quay về cặp (12, 6), ta có 6 = 0·12 + 1·6. Thay 6 bằng phần dư 18 − 12 ở lượt trước, ta được 6 = 1·18 − 1·12.",
        en: "Back at (12, 6), we have 6 = 0·12 + 1·6. Substitute the remainder 18 − 12 from the previous division to get 6 = 1·18 − 1·12.",
      },
      lines: [6], watch: { pair: "(18, 12)", result: "(6, 1, −1)" }, verdict: "run", fit,
      scene: rectangle(tiled, ["squareC", "squareD", "squareE"], "6 = 18 − 12"),
    },
    {
      title: { vi: "Tìm hai hệ số", en: "Recover both coefficients" }, kind: "answer",
      body: {
        vi: "Thay <code>12 = 48 − 2·18</code> vào <code>6 = 18 − 12</code>. Thu gọn được <code>6 = −48 + 3·18</code>, nên <code>x = −1</code> và <code>y = 3</code>.",
        en: "Substitute <code>12 = 48 − 2·18</code> into <code>6 = 18 − 12</code>. Simplifying gives <code>6 = −48 + 3·18</code>, so <code>x = −1</code> and <code>y = 3</code>.",
      },
      lines: [6], watch: { pair: "(48, 18)", result: "(6, −1, 3)" }, verdict: "ac", fit,
      scene: rectangle(tiled, ["squareD", "squareE"], "6 = −1·48 + 3·18", true),
    },
    {
      title: { vi: "Giữ nguyên ước chung", en: "Preserve the common divisors" }, kind: "recap",
      body: {
        vi: "Mỗi phép chia giữ nguyên tập ước chung và giảm số đang xét. Với <code>q = a / b</code>, thay phần dư bằng <code>a − qb</code> biến hệ số con <code>(x, y)</code> thành <code>(y, x − qy)</code>. Với hai đầu vào dương, số bước và bộ nhớ ngăn xếp đều tăng theo logarit của số nhỏ hơn.",
        en: "Each division preserves the common divisors and shrinks the pair. With <code>q = a / b</code>, substituting <code>a − qb</code> for the remainder turns the child's <code>(x, y)</code> into <code>(y, x − qy)</code>. For positive inputs, both the step count and stack space grow logarithmically with the smaller input.",
      },
      lines: [4, 5, 6], watch: { pair: "(48, 18)", result: "(6, −1, 3)" }, verdict: "ac", fit,
      scene: rectangle(tiled, ["squareD", "squareE"], "6 = −1·48 + 3·18", true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const { id, x, y, w, h, label } of pieces) {
    scene.add(id, {
      shape: shapes.block({ label, w: w * SCALE, h: h * SCALE, depth: 0, r: 0 }),
      x: (x + w / 2) * SCALE, y: (y + h - 18) * SCALE * 2, o: 0,
    });
  }
  scene.add("calc", { shape: shapes.pill({ h: 28 }), x: 24 * SCALE, y: 76, o: 0 });
}
