import type { Lesson, SceneMap } from "../../../lib/types";

const U = 62;
const TILE_HEIGHT = 5;
const TILE_HALF_GAP = 13;
const COLUMNS = ["O(1)", "O(log n)", "O(n)", "O(n²)"];
const CAPACITY = [1, 3, 8, 64];
const X = [0, 1.5, 3, 4.5];
const FIT = ["input", ...COLUMNS.map((_, i) => `order${i}`)];

// Two blocks fit on each tier, keeping all 64 countable in the scene.
const countZ = (count: number) => (Math.ceil(count / 2) * TILE_HEIGHT + 29) / U;

function columns(n: number, focus: number[] = []): SceneMap {
  const counts = [1, Math.log2(n), n, n * n];
  const picture: SceneMap = { input: { text: `n = ${n}` } };

  counts.forEach((count, i) => {
    const active = focus.includes(i);
    const delay = active ? i * 90 : 0;
    picture[`count${i}`] = {
      z: countZ(count), text: String(count),
      cls: active ? "v-eq" : "", delay, dur: 560, ease: "out",
    };
    for (let k = 0; k < CAPACITY[i]; k++) {
      const single = k === count - 1 && count % 2 === 1;
      const offset = single ? 0 : (k % 2 === 0 ? -TILE_HALF_GAP : TILE_HALF_GAP);
      picture[`tile${i}-${k}`] = {
        x: X[i] + offset / U,
        o: k < count ? 1 : 0, cls: active ? "is-active" : "",
        delay, dur: 560, ease: "out",
      };
    }
  });

  return picture;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "complexity",
  slug: "big-o",
  title: { vi: "Đếm bước, không đếm giây", en: "Count steps, not seconds" },
  added: "2026-11-27",
  summary: {
    vi: "Tăng n từ 2 lên 4 rồi 8 để thấy số bước của bốn kiểu thuật toán tăng khác nhau thế nào.",
    en: "Double n from 2 to 4 to 8 to see how four kinds of algorithms grow at different rates.",
  },
  level: "basic",
  minutes: 6,
  time: "O(1) · O(log n) · O(n) · O(n²)",
  memory: "O(1)",
  goal: {
    vi: "Mỗi khối ứng với một bước · <b>n = 2 → 4 → 8</b>",
    en: "One block per counted step · <b>n = 2 → 4 → 8</b>",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> one = <span class="nm">1</span>, halve = <span class="nm">0</span>, scan = <span class="nm">0</span>;',
    '<span class="kw">long long</span> pairs = <span class="nm">0</span>;',
    '',
    '<span class="kw">for</span> (<span class="kw">int</span> m = n; m &gt; <span class="nm">1</span>; m /= <span class="nm">2</span>)',
    '  ++halve;',
    '',
    '<span class="kw">for</span> (<span class="kw">int</span> i = <span class="nm">0</span>; i &lt; n; ++i)',
    '  ++scan;',
    '',
    '<span class="kw">for</span> (<span class="kw">int</span> i = <span class="nm">0</span>; i &lt; n; ++i)',
    '  <span class="kw">for</span> (<span class="kw">int</span> j = <span class="nm">0</span>; j &lt; n; ++j)',
    '    ++pairs;',
  ],
  watch: [
    { key: "n", label: "n" },
    { key: "one", label: "one" },
    { key: "halve", label: "halve" },
    { key: "scan", label: "scan" },
    { key: "pairs", label: "pairs" },
  ],
  practice: [
    { src: "CSES 1068", name: "Weird Algorithm", lv: "★☆☆", url: "https://cses.fi/problemset/task/1068" },
    { src: "CSES 1083", name: "Missing Number", lv: "★☆☆", url: "https://cses.fi/problemset/task/1083" },
  ],
  sceneOptions: { unit: U, view: [-54, -315, 388, 375] },
  legend: [{ cls: "acc", label: { vi: "cột đang xét", en: "column in focus" } }],
  steps: [
    {
      title: { vi: "Cùng xuất phát", en: "Start at two" }, kind: "problem",
      body: {
        vi: "Khi <code>n = 2</code>, cách thử mọi cặp chỉ cần 4 lượt, khá gần với 2 lượt của một lần duyệt. Hãy đếm số lượt khi đầu vào lớn dần để thấy cách nào sẽ chậm trước.",
        en: "At <code>n = 2</code>, checking every pair takes just 4 iterations, close to the 2 in a single scan. Count iterations as the input grows to see which approach slows down first.",
      },
      lines: [], watch: { n: 2, one: 1, halve: 1, scan: 2, pairs: 4 },
      verdict: "run", fit: FIT, scene: columns(2),
    },
    {
      title: { vi: "Đếm từng lượt", en: "Count the iterations" }, kind: "concept",
      body: {
        vi: "<code>one</code> tính một bước cố định, còn <code>halve</code> chia 2 thành 1 trong đúng một lượt. <code>scan</code> đi qua 2 vị trí, còn <code>pairs</code> ghép mỗi vị trí <code>i</code> với cả 2 vị trí <code>j</code>, tổng cộng 2 × 2 = 4 lượt.",
        en: "<code>one</code> counts one fixed step, and <code>halve</code> takes one iteration to turn 2 into 1. <code>scan</code> visits 2 positions, while <code>pairs</code> combines every <code>i</code> with both <code>j</code> positions for 2 × 2 = 4 iterations.",
      },
      lines: [1, 4, 5, 7, 8, 10, 11, 12], watch: { n: 2, one: 1, halve: 1, scan: 2, pairs: 4 },
      verdict: "run", fit: FIT, scene: columns(2, [1, 2, 3]),
    },
    {
      title: { vi: "Tăng lên 4", en: "Double to four" }, kind: "step",
      body: {
        vi: "Cột cố định vẫn là 1, còn <code>halve</code> thêm một lượt vì 4 → 2 → 1. <code>scan</code> tăng từ 2 lên 4, còn <code>pairs</code> tăng từ 4 lên 16 vì cả hai vòng lặp đều dài gấp đôi.",
        en: "The fixed column stays at 1, and <code>halve</code> adds one iteration because 4 → 2 → 1. <code>scan</code> grows from 2 to 4, while <code>pairs</code> grows from 4 to 16 because both loops double in length.",
      },
      lines: [4, 5, 7, 8, 10, 11, 12], watch: { n: 4, one: 1, halve: 2, scan: 4, pairs: 16 },
      verdict: "run", fit: FIT, scene: columns(4, [1, 2, 3]),
    },
    {
      title: { vi: "Tăng lên 8", en: "Double to eight" }, kind: "step",
      body: {
        vi: "<code>halve</code> thực hiện 3 lượt: 8 → 4 → 2 → 1. <code>scan</code> có 8 lượt, còn hai vòng lặp của <code>pairs</code> thực hiện 8 × 8 = 64 lượt.",
        en: "<code>halve</code> takes 3 iterations: 8 → 4 → 2 → 1. <code>scan</code> takes 8 iterations, and the two loops in <code>pairs</code> run the inner body 8 × 8 = 64 times.",
      },
      lines: [4, 5, 7, 8, 10, 11, 12], watch: { n: 8, one: 1, halve: 3, scan: 8, pairs: 64 },
      verdict: "run", fit: FIT, scene: columns(8, [1, 2, 3]),
    },
    {
      title: { vi: "So tốc độ tăng", en: "Compare growth rates" }, kind: "answer",
      body: {
        vi: "Mỗi lần gấp đôi <code>n</code>, số lượt chia đôi tăng thêm 1, số lượt duyệt tăng gấp 2, còn số lượt thử cặp tăng gấp 4 (4 → 16 → 64). Đó là ba tốc độ tăng O(log n), O(n) và O(n²), bên cạnh O(1) luôn giữ nguyên.",
        en: "Each doubling of <code>n</code> adds 1 halving, doubles the scan, and quadruples the pair checks (4 → 16 → 64). Those are O(log n), O(n), and O(n²) growth, alongside O(1), which stays fixed.",
      },
      lines: [10, 11, 12], watch: { n: 8, one: 1, halve: 3, scan: 8, pairs: 64 },
      verdict: "ac", fit: FIT,
      scene: {
        ...columns(8, [3]),
        count3: { z: countZ(64), text: "64", cls: "v-eq", fx: "pulse" },
      },
    },
    {
      title: { vi: "Giữ bậc tăng chính", en: "Keep the dominant term" }, kind: "recap",
      body: {
        vi: "Big-O mô tả cận trên của tốc độ tăng khi <code>n</code> lớn. Nếu mỗi lượt thử cặp làm 2 việc và chương trình còn duyệt thêm một lượt qua mảng, <code>2n² + n</code> vẫn thuộc O(n²) vì phần bậc hai chi phối khi <code>n</code> tăng.",
        en: "Big-O gives an upper bound on growth for large <code>n</code>. With 2 operations per pair and an extra scan, <code>2n² + n</code> is still O(n²) because the quadratic term dominates as <code>n</code> grows.",
      },
      lines: [7, 8, 10, 11, 12], watch: { n: 8, one: 1, halve: 3, scan: 8, pairs: 64 },
      verdict: "ac", fit: FIT, scene: columns(8, [3]),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("input", { shape: shapes.pill({ text: "n = 2" }), x: 2.25, z: 3.3 });
  COLUMNS.forEach((order, i) => {
    const x = X[i];
    scene.add(`order${i}`, { shape: shapes.pill({ text: order }), x, z: -0.55 });
    for (let k = 0; k < CAPACITY[i]; k++) {
      scene.add(`tile${i}-${k}`, {
        shape: shapes.block({ w: 22, h: 3, depth: 1, r: 1 }),
        x, z: Math.floor(k / 2) * TILE_HEIGHT / U, o: 0,
      });
    }
    scene.add(`count${i}`, { shape: shapes.pill({ text: "1" }), x, z: countZ(1) });
  });
}
