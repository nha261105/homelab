import type { Lesson, SceneMap } from "../../../lib/types";

const A = [1, 2, 3, 2];
const MID = Math.floor(A.length / 2);
const TARGET = 5;
const U = 57;

function sums(values: number[]) {
  const entries = [{ sum: 0, add: "∅" }];
  for (const value of values) {
    entries.push(...entries.map(({ sum }) => ({ sum: sum + value, add: `${sum}+${value}` })));
  }
  return entries;
}

const L = sums(A.slice(0, MID));
const R = sums(A.slice(MID));
const sortedRight = R.map((_, i) => i).sort((i, j) => R[i].sum - R[j].sum);
const counts = L.map(({ sum }) => R.filter((entry) => entry.sum === TARGET - sum).length);
const answer = counts.reduce((total, count) => total + count, 0);

function picture(phase: number, formula: string, left = -1, right: number[] = [], done = false): SceneMap {
  const sorted = phase >= 4;
  const scene: SceneMap = {
    labL: { o: phase >= 2 ? 1 : 0 },
    labR: { o: phase >= 3 ? 1 : 0 },
    calc: { text: formula, y: phase < 2 ? 1.85 : phase === 2 ? 3.95 : 6.1, o: 1, cls: done ? "v-eq" : "" },
  };
  A.forEach((_, i) => {
    scene[`a${i}`] = { cls: phase === 0 ? "" : i < MID ? "is-active" : "is-good" };
  });
  L.forEach((_, i) => {
    scene[`l${i}`] = { o: phase >= 2 ? 1 : 0, cls: i === left || done ? "is-active" : "" };
  });
  R.forEach((_, i) => {
    const x = sorted ? sortedRight.indexOf(i) : i;
    scene[`r${i}`] = {
      x, o: phase >= 3 ? 1 : 0,
      cls: right.includes(i) ? "is-good" : "",
      ...(phase === 4 && x !== i && left === -1 && !done ? { arc: i === 1 ? 0.35 : 0, dur: 600 } : {}),
    };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "bitmask",
  slug: "meet-in-middle",
  title: { vi: "Meet in the middle", en: "Meet in the middle" },
  added: "2026-11-27",
  summary: {
    vi: "Chia mảng thành hai nửa, liệt kê tổng tập con của mỗi nửa rồi tìm các cặp tổng bù nhau.",
    en: "Split the array, list the subset sums of each half, then find pairs of complementary sums.",
  },
  level: "hard",
  minutes: 9,
  time: "O(n · 2^⌈n/2⌉)",
  memory: "O(2^⌈n/2⌉)",
  goal: {
    vi: "Đếm số tập con của [1, 2, 3, 2] có tổng bằng <b>5</b>",
    en: "Count subsets of [1, 2, 3, 2] with sum <b>5</b>",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">auto</span> sums = [&amp;](<span class="kw">int</span> lo, <span class="kw">int</span> hi) {',
    '  vector&lt;<span class="kw">long long</span>&gt; s{0};',
    '  <span class="kw">for</span> (<span class="kw">int</span> i = lo; i &lt; hi; ++i) {',
    '    <span class="kw">int</span> k = s.size();',
    '    <span class="kw">for</span> (<span class="kw">int</span> j = 0; j &lt; k; ++j) s.push_back(s[j] + a[i]);',
    '  }',
    '  <span class="kw">return</span> s;',
    '};',
    '<span class="kw">auto</span> L = sums(0, n / 2), R = sums(n / 2, n);',
    'sort(R.begin(), R.end());',
    '<span class="kw">long long</span> ans = 0;',
    '<span class="kw">for</span> (<span class="kw">long long</span> l : L) {',
    '  <span class="kw">auto</span> [lo, hi] = equal_range(R.begin(), R.end(), target - l);',
    '  ans += hi - lo;',
    '}',
  ],
  watch: [
    { key: "l", label: "l" },
    { key: "need", label: "target − l" },
    { key: "matches", label: "hi − lo" },
    { key: "ans", label: "ans" },
  ],
  practice: [
    { src: "CSES 1628", name: "Meet in the Middle", lv: "★★☆", url: "https://cses.fi/problemset/task/1628" },
    { src: "LeetCode 1755", name: "Closest Subsequence Sum", lv: "★★★", url: "https://leetcode.com/problems/closest-subsequence-sum/" },
  ],
  sceneOptions: { unit: U, view: [-83, -130, 350, 330] },
  legend: [
    { cls: "acc", label: { vi: "nửa trái / tổng trái đang xét", en: "left half / current left sum" } },
    { cls: "ac", label: { vi: "nửa phải / tổng phải khớp", en: "right half / matching right sums" } },
  ],
  entrance: A.map((_, i) => `a${i}`),
  steps: [
    {
      title: { vi: "Đếm tập con tổng 5", en: "Count subsets summing to 5" }, kind: "problem",
      body: {
        vi: "Trong <code>[1, 2, 3, 2]</code>, đếm số cách chọn các vị trí sao cho tổng bằng 5. Duyệt thẳng cần thử 16 tập con với 4 phần tử; đến 40 phần tử đã có hơn một nghìn tỷ tập.",
        en: "In <code>[1, 2, 3, 2]</code>, count the ways to pick positions that sum to 5. Brute force checks 16 subsets for 4 elements and over a trillion for 40.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all",
      scene: picture(0, "2⁴ = 16"),
    },
    {
      title: { vi: "Chia mảng làm đôi", en: "Split the array" }, kind: "concept",
      body: {
        vi: "Nửa trái là <code>[1, 2]</code>, nửa phải là <code>[3, 2]</code>. Mỗi tập con gốc ghép duy nhất từ một tập con của mỗi nửa, nên ta có thể tính tổng riêng từng bên.",
        en: "The left half is <code>[1, 2]</code> and the right half is <code>[3, 2]</code>. Each original subset comes from exactly one subset of each half, so we can compute the two sides' sums independently.",
      },
      lines: [9], watch: {}, verdict: "run", fit: "all",
      scene: picture(1, "2² = 4"),
    },
    {
      title: { vi: "Tính các tổng trái", en: "Generate left sums" }, kind: "step",
      body: {
        vi: "Bắt đầu từ tổng 0 của tập rỗng. Gặp 1, thêm <code>0 + 1 = 1</code>. Gặp 2, giữ hai tổng cũ và nối thêm <code>0 + 2 = 2</code> cùng <code>1 + 2 = 3</code>.",
        en: "Start with the empty subset's sum 0. With 1, append <code>0 + 1 = 1</code>. With 2, keep both old sums and append <code>0 + 2 = 2</code> and <code>1 + 2 = 3</code>.",
      },
      lines: [2, 3, 4, 5], watch: {}, verdict: "run", fit: "all",
      scene: picture(2, "[0, 1] → [0, 1, 2, 3]"),
    },
    {
      title: { vi: "Tính các tổng phải", en: "Generate right sums" }, kind: "step",
      body: {
        vi: "Làm tương tự với <code>[3, 2]</code>: từ 0 thêm 3, rồi cộng 2 vào hai tổng đã có để ra 2 và 5. Biến <code>k</code> chốt số tổng cũ trước mỗi lượt, để mỗi phần tử chỉ được dùng một lần trong một tập con.",
        en: "Repeat for <code>[3, 2]</code>: append 3 to the initial 0, then add 2 to both old sums to get 2 and 5. Saving the old length in <code>k</code> prevents using the same element twice in a subset.",
      },
      lines: [2, 3, 4, 5, 9], watch: {}, verdict: "run", fit: "all",
      scene: picture(3, "[0, 3] → [0, 3, 2, 5]"),
    },
    {
      title: { vi: "Sắp xếp nửa phải", en: "Sort the right sums" }, kind: "step",
      body: {
        vi: "Sắp xếp <code>R</code> từ <code>[0, 3, 2, 5]</code> thành <code>[0, 2, 3, 5]</code>. Giờ có thể tìm cả đoạn bằng <code>target − l</code> bằng hai lần tìm kiếm nhị phân.",
        en: "Sort <code>R</code> from <code>[0, 3, 2, 5]</code> to <code>[0, 2, 3, 5]</code>. Two binary searches can now locate the full range equal to <code>target − l</code>.",
      },
      lines: [10, 13], watch: { ans: 0 }, verdict: "run", fit: "all",
      scene: picture(4, "[0, 3, 2, 5] → [0, 2, 3, 5]"),
    },
    {
      title: { vi: "Tìm các tổng bù", en: "Find complementary sums" }, kind: "step",
      body: {
        vi: "Với <code>l = 0</code>, cần tổng phải <code>5 − 0 = 5</code>. <code>equal_range</code> cho đoạn chỉ số nửa mở <code>[3, 4)</code>, nên cộng một cách. Với <code>l = 1</code>, cần 4 và đoạn tìm được rỗng.",
        en: "For <code>l = 0</code>, the right sum must be <code>5 − 0 = 5</code>. <code>equal_range</code> finds the half-open index range <code>[3, 4)</code>, adding one match. For <code>l = 1</code>, the required 4 gives an empty range.",
      },
      lines: [12, 13, 14], watch: { l: 0, need: TARGET, matches: counts[0], ans: counts[0] }, verdict: "run", fit: "all",
      scene: picture(4, "5 − 0 = 5    [3, 4)", 0, [3]),
    },
    {
      title: { vi: "Cộng đủ ba cách", en: "Count all three matches" }, kind: "answer",
      body: {
        vi: "Tổng trái 2 ghép với 3, còn tổng trái 3 ghép với 2. Cộng số cách theo thứ tự các tổng trái 0, 1, 2, 3, ta được <code>1 + 0 + 1 + 1 = 3</code>.",
        en: "Left sum 2 pairs with 3, and left sum 3 pairs with 2. Adding the counts in left-sum order 0, 1, 2, 3 gives <code>1 + 0 + 1 + 1 = 3</code>.",
      },
      lines: [12, 13, 14], watch: { l: 3, need: TARGET - L[3].sum, matches: counts[3], ans: answer }, verdict: "ac", fit: "all",
      scene: picture(4, `${counts.join(" + ")} = ${answer}`, 3, [1, 2, 3]),
    },
    {
      title: { vi: "Giữ cả tổng trùng", en: "Keep duplicate sums" }, kind: "recap",
      body: {
        vi: "Mỗi cặp tập con hai nửa cho đúng một tập con gốc, nên phải giữ mọi lần xuất hiện của cùng một tổng và đếm cả đoạn <code>hi − lo</code>. Hai nửa có tối đa O(2^⌈n/2⌉) tổng mỗi bên. Sắp xếp và tìm kiếm cho tổng thời gian O(n · 2^⌈n/2⌉), bộ nhớ O(2^⌈n/2⌉).",
        en: "Every pair of half-subsets gives one original subset, so keep every occurrence of an equal sum and count the full range <code>hi − lo</code>. The halves each have O(2^⌈n/2⌉) sums. Sorting and searching give O(n · 2^⌈n/2⌉) time and O(2^⌈n/2⌉) space.",
      },
      lines: [9, 10, 12, 13, 14], watch: { ans: answer }, verdict: "ac", fit: "all",
      scene: picture(4, `${counts.join(" + ")} = ${answer}`, -1, [1, 2, 3], true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  A.forEach((value, i) => {
    scene.add(`a${i}`, {
      shape: shapes.block({ label: value, sub: `a[${i}]`, w: 45, h: 33, depth: 4 }),
      x: i + (i < MID ? 0 : 0.3),
    });
  });
  for (const [row, entries] of [["l", L], ["r", R]] as const) {
    const y = row === "l" ? 2.15 : 4.3;
    entries.forEach(({ sum, add }, i) => {
      scene.add(`${row}${i}`, {
        shape: shapes.block({ label: sum, sub: add, w: 45, h: 33, depth: 4 }),
        x: i,
        y,
        o: 0,
      });
    });
    scene.add(row === "l" ? "labL" : "labR", {
      shape: shapes.pill({ text: row.toUpperCase(), pad: 7 }), x: -0.8, y: y - 0.08, o: 0,
    });
  }
  scene.add("calc", { shape: shapes.pill(), x: 1.5, y: 6.1, o: 0 });
}
