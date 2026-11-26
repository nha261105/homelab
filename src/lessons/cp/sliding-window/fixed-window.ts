import type { Lesson, SceneMap } from "../../../lib/types";

const A = [2, 1, 4, 3, 5, 2];
const K = 3;
const U = 62;
const FIT = ["c0", "c5", "sum"];

function windowAt(l: number, formula: string, outgoing = -1, cls = "is-active"): SceneMap {
  const r = l + K - 1;
  const scene: SceneMap = {
    window: { x: (l + r) / 2, o: 1, cls },
    sum: {
      text: formula, o: 1, s: 1, cls: cls === "is-good" ? "v-eq" : "",
      from: { o: 0, s: 0.7 }, delay: 560, dur: 340, ease: "back",
    },
  };
  for (let i = l; i <= r; i++) {
    scene[`c${i}`] = { cls, ...(i === r && outgoing >= 0 ? { fx: { type: "hop", delay: 280 } } : {}) };
  }
  if (outgoing >= 0) {
    scene[`c${outgoing}`] = { cls: "is-out", z: -0.12, s: 0.9, o: 0.55, dur: 480 };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "sliding-window",
  slug: "fixed-window",
  title: { vi: "Cửa sổ độ dài k", en: "Fixed-size window" },
  added: "2026-11-27",
  summary: {
    vi: "Trượt cửa sổ dài k qua mảng và cập nhật tổng bằng hai phần tử ở hai đầu.",
    en: "Slide a window of length k across the array and update its sum using the two endpoints.",
  },
  level: "basic",
  minutes: 6,
  time: "O(n)",
  memory: "O(1)",
  goal: { vi: "Tìm tổng lớn nhất của đoạn dài <b>k = 3</b>", en: "Find the largest sum of a window of length <b>k = 3</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">long long</span> sum = <span class="nm">0</span>;',
    '<span class="kw">for</span> (<span class="kw">int</span> r = 0; r &lt; k; ++r) sum += a[r];',
    '<span class="kw">long long</span> best = sum;',
    '<span class="kw">for</span> (<span class="kw">int</span> r = k; r &lt; n; ++r) {',
    '  sum += a[r];',
    '  sum -= a[r - k];',
    '  best = max(best, sum);',
    '}',
    '<span class="kw">return</span> best;',
  ],
  watch: [
    { key: "l", label: { vi: "đầu trái", en: "left edge" } },
    { key: "r", label: "r" },
    { key: "sum", label: "sum" },
    { key: "best", label: "best" },
  ],
  practice: [
    { src: "LeetCode 643", name: "Maximum Average Subarray I", lv: "★☆☆", url: "https://leetcode.com/problems/maximum-average-subarray-i/" },
    { src: "CSES 1643", name: "Maximum Subarray Sum", lv: "★★☆", url: "https://cses.fi/problemset/task/1643" },
  ],
  sceneOptions: { unit: U, view: [-60, -165, 430, 230] },
  legend: [
    { cls: "acc", label: { vi: "cửa sổ hiện tại", en: "current window" } },
    { cls: "dim", label: { vi: "phần tử vừa rời", en: "outgoing element" } },
    { cls: "ac", label: { vi: "cửa sổ có tổng lớn nhất", en: "window with the largest sum" } },
  ],
  entrance: A.map((_, i) => `c${i}`),
  steps: [
    {
      title: { vi: "Tìm tổng lớn nhất", en: "Find the largest sum" },
      kind: "problem",
      body: {
        vi: "Tìm đoạn gồm đúng <code>k = 3</code> phần tử liên tiếp có tổng lớn nhất trong mảng 6 phần tử. Cộng lại từ đầu cho từng đoạn mất O((n − k + 1)·k).",
        en: "Find the largest sum of exactly <code>k = 3</code> consecutive elements in this 6-element array. Summing each window from scratch takes O((n − k + 1)·k).",
      },
      lines: [], watch: {}, verdict: "run", fit: FIT, scene: { sum: { text: "" } },
    },
    {
      title: { vi: "Tính tổng cửa sổ đầu", en: "Sum the first window" },
      kind: "concept",
      body: {
        vi: "Đặt khung lên ba ô đầu, từ vị trí 0 đến 2. Tổng là <code>2 + 1 + 4 = 7</code>, nên khởi tạo <code>best = 7</code>.",
        en: "Frame the first three cells, from index 0 through 2. Their sum is <code>2 + 1 + 4 = 7</code>, so initialize <code>best = 7</code>.",
      },
      lines: [1, 2, 3], watch: { l: 0, r: 2, sum: 7, best: 7 }, verdict: "run", fit: FIT,
      scene: windowAt(0, "2 + 1 + 4 = 7"),
    },
    {
      title: { vi: "Thêm 3, bỏ 2", en: "Add 3, remove 2" },
      kind: "step",
      body: {
        vi: "Dịch khung sang phải một ô: thêm <code>a[3] = 3</code> và bỏ <code>a[3 − k] = a[0] = 2</code>. Hai ô ở giữa vẫn giữ nguyên, nên tổng mới là <code>7 + 3 − 2 = 8</code>.",
        en: "Slide right one cell: add <code>a[3] = 3</code> and remove <code>a[3 − k] = a[0] = 2</code>. The two shared cells stay, giving <code>7 + 3 − 2 = 8</code>.",
      },
      lines: [4, 5, 6, 7], watch: { l: 1, r: 3, sum: 8, best: 8 }, verdict: "run", fit: FIT,
      scene: windowAt(1, "7 + 3 − 2 = 8", 0),
    },
    {
      title: { vi: "Nâng kỷ lục lên 12", en: "Raise best to 12" },
      kind: "step",
      body: {
        vi: "Ở <code>r = 4</code>, thêm 5 và bỏ 1, được <code>8 + 5 − 1 = 12</code>. Cập nhật <code>best</code> từ 8 lên 12.",
        en: "At <code>r = 4</code>, add 5 and remove 1 to get <code>8 + 5 − 1 = 12</code>. Update <code>best</code> from 8 to 12.",
      },
      lines: [5, 6, 7], watch: { l: 2, r: 4, sum: 12, best: 12 }, verdict: "run", fit: FIT,
      scene: windowAt(2, "8 + 5 − 1 = 12", 1),
    },
    {
      title: { vi: "Xét cửa sổ cuối", en: "Check the final window" },
      kind: "step",
      body: {
        vi: "Bước cuối thêm 2 và bỏ 4, được <code>12 + 2 − 4 = 10</code>. Tổng này nhỏ hơn 12, nên giữ nguyên <code>best</code>.",
        en: "The last slide adds 2 and removes 4, giving <code>12 + 2 − 4 = 10</code>. This is below 12, so keep <code>best</code>.",
      },
      lines: [5, 6, 7], watch: { l: 3, r: 5, sum: 10, best: 12 }, verdict: "run", fit: FIT,
      scene: windowAt(3, "12 + 2 − 4 = 10", 2),
    },
    {
      title: { vi: "Trả về tổng lớn nhất", en: "Return the largest sum" },
      kind: "answer",
      body: {
        vi: "Bốn cửa sổ có tổng lần lượt là 7, 8, 12 và 10. Trả về <code>best = 12</code>, tổng của đoạn <code>[4, 3, 5]</code>.",
        en: "The four windows have sums 7, 8, 12, and 10. Return <code>best = 12</code>, the sum of <code>[4, 3, 5]</code>.",
      },
      lines: [9], watch: { best: 12 }, verdict: "ac", fit: FIT,
      scene: windowAt(2, "4 + 3 + 5 = 12 ✓", -1, "is-good"),
    },
    {
      title: { vi: "Mỗi lần trượt O(1)", en: "Constant work per slide" },
      kind: "recap",
      body: {
        vi: "Khung luôn dài <code>k</code> và lần lượt đi qua mọi điểm bắt đầu. Tính tổng đầu mất O(k), sau đó mỗi lần trượt chỉ cộng một ô và trừ một ô, nên cả lượt quét mất O(n) thời gian và O(1) bộ nhớ phụ.",
        en: "The frame keeps length <code>k</code> and visits every starting index in order. The first sum takes O(k), then each slide adds one cell and removes one, for O(n) time and O(1) extra space.",
      },
      lines: [2, 4, 5, 6], watch: { best: 12 }, verdict: "ac", fit: FIT,
      scene: windowAt(2, "4 + 3 + 5 = 12 ✓", -1, "is-good"),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("window", { shape: shapes.frame(), layer: "back", x: 1, w: (K - 1) * U + 70, o: 0 });
  A.forEach((value, i) => scene.add(`c${i}`, { shape: shapes.block({ label: value, sub: i }), x: i, shadow: true }));
  scene.add("sum", { shape: shapes.pill(), x: 2.5, z: 1.6, o: 0 });
}
