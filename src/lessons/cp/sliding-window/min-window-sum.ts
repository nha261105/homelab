import type { Lesson, SceneMap } from "../../../lib/types";

const A = [2, 3, 1, 2, 4, 3];
const S = 7;
const U = 62;
const FIT = ["c0", "c5", "status"];

function windowAt(l: number, r: number, sum: number, answer = false): SceneMap {
  const cls = answer ? "is-good" : "is-active";
  const scene: SceneMap = {
    window: { x: (l + r) / 2, w: (r - l) * U + 70, o: 1, cls },
    status: {
      text: answer ? "best = 2 ✓" : `sum = ${sum} ${sum >= S ? "≥" : "<"} ${S}`,
      o: 1, s: 1, cls: answer ? "v-eq" : "",
      from: { o: 0, s: 0.7 }, delay: 560, dur: 340, ease: "back",
    },
  };
  for (let i = l; i <= r; i++) scene[`c${i}`] = { cls };
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "sliding-window",
  slug: "min-window-sum",
  title: { vi: "Đoạn ngắn nhất có tổng ≥ S", en: "Shortest window with sum ≥ S" },
  added: "2026-11-27",
  summary: {
    vi: "Với mảng số dương, mở rộng khi tổng chưa đủ và ghi lại độ dài trước mỗi lần co.",
    en: "For a positive array, expand while the sum is too small and record the length before each shrink.",
  },
  level: "basic",
  minutes: 8,
  time: "O(n)",
  memory: "O(1)",
  goal: { vi: "Tìm độ dài nhỏ nhất với tổng <b>≥ 7</b>", en: "Find the minimum length with sum <b>≥ 7</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">long long</span> sum = 0;',
    '<span class="kw">int</span> l = 0, best = n + 1;',
    '<span class="kw">for</span> (<span class="kw">int</span> r = 0; r &lt; n; ++r) {',
    '  sum += a[r];',
    '  <span class="kw">while</span> (sum &gt;= S) {',
    '    best = min(best, r - l + 1);',
    '    sum -= a[l];',
    '    ++l;',
    '  }',
    '}',
    '<span class="kw">return</span> best == n + 1 ? 0 : best;',
  ],
  watch: [
    { key: "l", label: "l" },
    { key: "r", label: "r" },
    { key: "sum", label: "sum" },
    { key: "len", label: { vi: "độ dài khung", en: "window length" } },
    { key: "best", label: "best" },
  ],
  practice: [
    { src: "LeetCode 209", name: "Minimum Size Subarray Sum", lv: "★★☆", url: "https://leetcode.com/problems/minimum-size-subarray-sum/" },
    { src: "CSES 1660", name: "Subarray Sums I", lv: "★★☆", url: "https://cses.fi/problemset/task/1660" },
  ],
  sceneOptions: { unit: U, view: [-60, -165, 430, 230] },
  legend: [
    { cls: "acc", label: { vi: "cửa sổ hiện tại", en: "current window" } },
    { cls: "ac", label: { vi: "cửa sổ ngắn nhất", en: "shortest window" } },
  ],
  entrance: A.map((_, i) => `c${i}`),
  steps: [
    {
      title: { vi: "Tìm đoạn ngắn nhất", en: "Find the shortest window" },
      kind: "problem",
      body: {
        vi: "Trong mảng gồm 6 số nguyên dương, tìm độ dài nhỏ nhất của đoạn liên tiếp có tổng ít nhất <code>S = 7</code>. Xét mọi cặp đầu mút mất O(n²), kể cả khi giữ tổng trong lúc mở rộng từng đoạn.",
        en: "In this array of six positive integers, find the shortest contiguous window with sum at least <code>S = 7</code>. Checking every pair of endpoints takes O(n²), even with a running sum.",
      },
      lines: [], watch: {}, verdict: "run", fit: FIT, scene: { status: { text: "" } },
    },
    {
      title: { vi: "Tổng vẫn chưa đủ", en: "The sum falls short" },
      kind: "concept",
      body: {
        vi: "Mở rộng từ <code>r = 0</code> đến <code>r = 2</code>, ta được <code>sum = 2 + 3 + 1 = 6 &lt; 7</code>. Bỏ một số dương chỉ làm tổng giảm, nên giữ <code>l = 0</code> và tiếp tục mở rộng.",
        en: "Expand from <code>r = 0</code> to <code>r = 2</code> to get <code>sum = 2 + 3 + 1 = 6 &lt; 7</code>. Removing a positive value would lower the sum, so keep <code>l = 0</code> and expand again.",
      },
      lines: [1, 2, 3, 4, 5], watch: { l: 0, r: 2, sum: 6, len: 3, best: 7 }, verdict: "run", fit: FIT,
      scene: windowAt(0, 2, 6),
    },
    {
      title: { vi: "Ghi độ dài đầu tiên", en: "Record the first length" },
      kind: "step",
      body: {
        vi: "Thêm <code>a[3] = 2</code>, tổng tăng từ 6 lên 8 và đạt ngưỡng 7. Đoạn <code>[0, 3]</code> dài 4, nên cập nhật <code>best</code> từ giá trị ban đầu <code>n + 1 = 7</code> xuống 4.",
        en: "Add <code>a[3] = 2</code> to bring the sum from 6 to 8, past the threshold of 7. The window <code>[0, 3]</code> has length 4, so update <code>best</code> from its starting value <code>n + 1 = 7</code> to 4.",
      },
      note: { vi: "Ghi độ dài khi tổng còn đủ, rồi mới bỏ ô trái.", en: "Record the length while the sum still qualifies, then remove the left cell." },
      lines: [4, 5, 6], watch: { l: 0, r: 3, sum: 8, len: 4, best: 4 }, verdict: "run", fit: FIT,
      scene: windowAt(0, 3, 8),
    },
    {
      title: { vi: "Co đến khi thiếu", en: "Shrink until below target" },
      kind: "step",
      body: {
        vi: "Bỏ <code>a[0] = 2</code> rồi tăng <code>l</code> lên 1. Tổng còn <code>8 − 2 = 6</code>, nên vòng <code>while</code> dừng và <code>best</code> vẫn là 4.",
        en: "Remove <code>a[0] = 2</code> and advance <code>l</code> to 1. The sum falls to <code>8 − 2 = 6</code>, so the <code>while</code> loop stops and <code>best</code> stays at 4.",
      },
      lines: [5, 7, 8], watch: { l: 1, r: 3, sum: 6, len: 3, best: 4 }, verdict: "run", fit: FIT,
      scene: windowAt(1, 3, 6),
    },
    {
      title: { vi: "Mở rộng với số 4", en: "Extend by adding 4" },
      kind: "step",
      body: {
        vi: "Thêm <code>a[4] = 4</code> vào đoạn đang có tổng 6. Đoạn <code>[1, 4]</code> có tổng 10 và dài 4, nên <code>best</code> vẫn là 4, rồi ta thử co tiếp.",
        en: "Add <code>a[4] = 4</code> to the current sum of 6. The window <code>[1, 4]</code> has sum 10 and length 4, so <code>best</code> stays at 4 and we try shrinking again.",
      },
      lines: [3, 4, 5, 6], watch: { l: 1, r: 4, sum: 10, len: 4, best: 4 }, verdict: "run", fit: FIT,
      scene: windowAt(1, 4, 10),
    },
    {
      title: { vi: "Bằng 7 vẫn đủ", en: "Exactly 7 still qualifies" },
      kind: "step",
      body: {
        vi: "Bỏ số 3 ở vị trí 1, tổng còn <code>10 − 3 = 7</code>. Vì điều kiện là <code>sum ≥ S</code>, đoạn <code>[2, 4]</code> dài 3 vẫn hợp lệ, nên <code>best</code> giảm còn 3.",
        en: "Remove the 3 at index 1, leaving <code>10 − 3 = 7</code>. The condition is <code>sum ≥ S</code>, so the length-3 window <code>[2, 4]</code> qualifies and <code>best</code> drops to 3.",
      },
      lines: [5, 6, 7, 8], watch: { l: 2, r: 4, sum: 7, len: 3, best: 3 }, verdict: "run", fit: FIT,
      scene: windowAt(2, 4, 7),
    },
    {
      title: { vi: "Thêm phần tử cuối", en: "Add the final element" },
      kind: "step",
      body: {
        vi: "Co thêm một lần, bỏ <code>a[2] = 1</code>, tổng xuống 6. Khi thêm <code>a[5] = 3</code>, đoạn <code>[3, 5]</code> có tổng 9 và dài 3, nên ta lại có thể co.",
        en: "Shrink again by dropping <code>a[2] = 1</code>, lowering the sum to 6. Add <code>a[5] = 3</code> to make the length-3 window <code>[3, 5]</code> with sum 9, so we can shrink again.",
      },
      lines: [3, 4, 5, 6, 7, 8], watch: { l: 3, r: 5, sum: 9, len: 3, best: 3 }, verdict: "run", fit: FIT,
      scene: windowAt(3, 5, 9),
    },
    {
      title: { vi: "Đáp án dài 2", en: "Return length 2" },
      kind: "answer",
      body: {
        vi: "Bỏ <code>a[3] = 2</code>, còn hai ô <code>[4, 3]</code> có tổng 7, nên ghi <code>best = 2</code>. Bỏ tiếp 4 thì tổng chỉ còn 3. Đã xét hết mảng, ta trả về 2.",
        en: "Drop <code>a[3] = 2</code> to leave <code>[4, 3]</code> with sum 7, and record <code>best = 2</code>. Dropping 4 next leaves a sum of 3. The scan is complete, so return 2.",
      },
      lines: [5, 6, 7, 8, 11], watch: { l: 4, r: 5, sum: 7, len: 2, best: 2 }, verdict: "ac", fit: FIT,
      scene: windowAt(4, 5, 7, true),
    },
    {
      title: { vi: "Vì sao co được", en: "Why shrinking is safe" },
      kind: "recap",
      body: {
        vi: "Khi tổng còn thiếu, co chỉ làm tổng giảm vì mọi phần tử đều dương. Khi tổng đã đủ, ta ghi độ dài rồi bỏ <code>l</code> vì các đoạn cùng bắt đầu ở <code>l</code> và kết thúc muộn hơn đều dài hơn. Hai đầu chỉ tiến, nên thời gian là O(n) và bộ nhớ phụ là O(1).",
        en: "When the sum falls short, shrinking only lowers it because all values are positive. Once the sum qualifies, record the length and move past <code>l</code> because any window with the same start and a later end is longer. Both ends only advance, giving O(n) time and O(1) extra space.",
      },
      lines: [3, 5, 6, 8], watch: { best: 2 }, verdict: "ac", fit: FIT,
      scene: windowAt(4, 5, 7, true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("window", { shape: shapes.frame(), layer: "back", x: 0, w: 70, o: 0 });
  A.forEach((value, i) => scene.add(`c${i}`, { shape: shapes.block({ label: value, sub: i }), x: i, shadow: true }));
  scene.add("status", { shape: shapes.pill(), x: 2.5, z: 1.6, o: 0 });
}
