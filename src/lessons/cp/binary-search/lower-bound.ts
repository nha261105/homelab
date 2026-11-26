import type { Lesson, SceneMap } from "../../../lib/types";

const A = [1, 3, 5, 5, 5, 8, 11, 14];
const X = 5;
const N = A.length;
const U = 58;
const FIT = ["c0", "end", "lo", "hi", "calc"];

function searchWindow(lo: number, hi: number): SceneMap {
  const scene: SceneMap = {
    lo: { x: lo, o: lo < hi ? 1 : 0, dur: 560 },
    hi: { x: hi, o: lo < hi ? 1 : 0, dur: 560 },
    win: { x: (lo + hi - 1) / 2, w: lo < hi ? (hi - lo - 1) * U + 54 : 0, o: lo < hi ? 1 : 0, dur: 560 },
    end: { o: hi === N ? 0.65 : 0.4 },
  };
  A.forEach((_, i) => {
    if (i < lo || i > hi) {
      scene[`c${i}`] = { cls: "is-out", z: -0.12, s: 0.9, o: 0.55, dur: 480, ease: "out" };
    }
  });
  return scene;
}

function comparison(lo: number, hi: number, mid: number): SceneMap {
  const small = A[mid] < X;
  return {
    ...searchWindow(lo, hi),
    [`c${mid}`]: { cls: "is-active", fx: { type: "pulse", delay: 280 } },
    calc: {
      text: `a[${mid}] = ${A[mid]} ${small ? "<" : "≥"} ${X}`,
      o: 1, from: { o: 0 }, delay: 420, dur: 340, cls: small ? "v-gt" : "v-eq",
    },
  };
}

function found(animate: boolean): SceneMap {
  return {
    ...searchWindow(2, 2),
    c2: { cls: "is-good", bob: 0.05, ...(animate ? { fx: { type: "hop", delay: 520 } } : {}) },
    calc: { text: "lo = hi = 2", o: 1, cls: "v-eq" },
  };
}

export const lesson: Lesson = {
  track: "cp",
  topic: "binary-search",
  slug: "lower-bound",
  title: { vi: "lower_bound từng bước", en: "lower_bound step by step" },
  added: "2026-11-27",
  summary: {
    vi: "Chia đôi khoảng tìm kiếm để tìm vị trí đầu tiên có giá trị ít nhất bằng x trong mảng đã sắp xếp.",
    en: "Halve the search window to find the first index with a value of at least x in a sorted array.",
  },
  level: "basic",
  minutes: 7,
  time: "O(log n)",
  memory: "O(1)",
  goal: { vi: "chỉ số đầu tiên có <b>a[i] ≥ 5</b>", en: "first index with <b>a[i] ≥ 5</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> lo = <span class="nm">0</span>, hi = n;',
    '<span class="kw">while</span> (lo &lt; hi) {',
    '  <span class="kw">int</span> mid = lo + (hi - lo) / <span class="nm">2</span>;',
    '  <span class="kw">if</span> (a[mid] &lt; x) lo = mid + <span class="nm">1</span>;',
    '  <span class="kw">else</span> hi = mid;',
    "}",
    '<span class="kw">return</span> lo;',
  ],
  watch: [
    { key: "lo", label: "lo" },
    { key: "hi", label: "hi" },
    { key: "mid", label: "mid" },
    { key: "value", label: "a[mid]" },
  ],
  practice: [
    { src: "LeetCode 704", name: "Binary Search", lv: "★☆☆", url: "https://leetcode.com/problems/binary-search/" },
    { src: "LeetCode 35", name: "Search Insert Position", lv: "★☆☆", url: "https://leetcode.com/problems/search-insert-position/" },
  ],
  sceneOptions: { unit: U, view: [-52, -190, 568, 280] },
  legend: [
    { cls: "acc", label: { vi: "đang xét", en: "under review" } },
    { cls: "dim", label: { vi: "đã loại", en: "ruled out" } },
    { cls: "ac", label: { vi: "đáp án", en: "answer" } },
  ],
  entrance: A.map((_, i) => `c${i}`),
  steps: [
    {
      title: { vi: "Tìm vị trí đầu", en: "Find the first" }, kind: "problem",
      body: {
        vi: "Trong mảng đã sắp xếp, cần tìm chỉ số đầu tiên có <code>a[i] ≥ 5</code>. Có tới ba số 5 liền nhau, còn quét từ đầu mảng có thể tốn O(n).",
        en: "In this sorted array, find the first index with <code>a[i] ≥ 5</code>. There are three consecutive 5s, and scanning from the start can take O(n).",
      },
      lines: [], watch: {}, verdict: "run", fit: FIT, scene: { calc: { text: "" } },
    },
    {
      title: { vi: "Đặt hai biên", en: "Set the bounds" }, kind: "concept",
      body: {
        vi: "Bắt đầu với <code>[lo, hi) = [0, 8)</code>. Khung chứa các ô có thể đem so sánh, còn <code>hi</code> vẫn có thể là đáp án: vị trí 8 nằm sau mảng và được trả về nếu mọi phần tử đều nhỏ hơn 5.",
        en: "Start with <code>[lo, hi) = [0, 8)</code>. The frame holds the cells we can inspect, and <code>hi</code> remains a possible answer: index 8 is past the array and is returned if every element is below 5.",
      },
      lines: [1, 2], watch: { lo: 0, hi: 8 }, verdict: "run", fit: FIT,
      scene: { ...searchWindow(0, 8), calc: { text: "[0, 8)", o: 1 } },
    },
    {
      title: { vi: "Giữ lại biên 4", en: "Keep index 4" }, kind: "step",
      body: {
        vi: "Khung <code>[0, 8)</code> cho <code>mid = 4</code> và <code>a[4] = 5</code>. Vị trí 4 đã đạt ngưỡng, nên đáp án ở vị trí 4 hoặc bên trái nó: đặt <code>hi = 4</code>.",
        en: "In <code>[0, 8)</code>, <code>mid = 4</code> and <code>a[4] = 5</code>. Index 4 meets the threshold, so the answer is at 4 or to its left. Set <code>hi = 4</code>.",
      },
      lines: [3, 5], watch: { lo: 0, hi: 8, mid: 4, value: 5 }, verdict: "run", fit: FIT,
      scene: comparison(0, 8, 4),
    },
    {
      title: { vi: "Tiếp tục tìm trái", en: "Search farther left" }, kind: "step",
      body: {
        vi: "Trong <code>[0, 4)</code>, <code>mid = 2</code> cũng cho <code>a[2] = 5</code>. Đặt <code>hi = 2</code> để kiểm tra xem còn vị trí nào đạt ngưỡng sớm hơn không.",
        en: "In <code>[0, 4)</code>, <code>mid = 2</code> also gives <code>a[2] = 5</code>. Set <code>hi = 2</code> to check whether any earlier index meets the threshold.",
      },
      lines: [3, 5], watch: { lo: 0, hi: 4, mid: 2, value: 5 }, verdict: "run", fit: FIT,
      scene: comparison(0, 4, 2),
    },
    {
      title: { vi: "Bỏ qua hai ô", en: "Skip two cells" }, kind: "step",
      body: {
        vi: "Trong <code>[0, 2)</code>, <code>mid = 1</code> cho <code>a[1] = 3 &lt; 5</code>. Cả vị trí 0 lẫn 1 đều quá nhỏ, nên đặt <code>lo = mid + 1 = 2</code>.",
        en: "In <code>[0, 2)</code>, <code>mid = 1</code> gives <code>a[1] = 3 &lt; 5</code>. Both index 0 and index 1 are too small, so set <code>lo = mid + 1 = 2</code>.",
      },
      lines: [3, 4], watch: { lo: 0, hi: 2, mid: 1, value: 3 }, verdict: "run", fit: FIT,
      scene: comparison(0, 2, 1),
    },
    {
      title: { vi: "Hai biên gặp nhau", en: "The bounds meet" }, kind: "answer",
      body: {
        vi: "Khung <code>[2, 2)</code> đã rỗng. Trả về chỉ số 2: <code>a[2] = 5</code> và cả hai phần tử đứng trước đều nhỏ hơn 5.",
        en: "The window <code>[2, 2)</code> is empty. Return index 2: <code>a[2] = 5</code> and both preceding values are below 5.",
      },
      lines: [2, 7], watch: { lo: 2, hi: 2 }, verdict: "ac", fit: FIT,
      scene: found(true),
    },
    {
      title: { vi: "Đáp án luôn còn", en: "The answer stays inside" }, kind: "recap",
      body: {
        vi: "Đáp án luôn nằm trong <code>[lo, hi]</code>, kể cả vị trí cuối mảng <code>n</code> khi không có phần tử đạt ngưỡng. Mỗi lần so sánh giảm ít nhất một nửa số ô trong <code>[lo, hi)</code>, nên tốn O(log n) thời gian và O(1) bộ nhớ phụ.",
        en: "The answer stays in <code>[lo, hi]</code>, including the end position <code>n</code> when no element qualifies. Each comparison removes at least half the cells in <code>[lo, hi)</code>, giving O(log n) time and O(1) extra space.",
      },
      lines: [2, 3, 4, 5, 7], watch: { lo: 2, hi: 2 }, verdict: "ac", fit: FIT,
      scene: found(false),
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  scene.add("win", { shape: shapes.frame(), layer: "back", x: 3.5, w: 0, o: 0 });
  A.forEach((v, i) => scene.add(`c${i}`, { shape: shapes.block({ label: v, sub: i, w: 46 }), x: i, shadow: true }));
  scene.add("end", { shape: shapes.block({ label: "∅", sub: N, w: 46 }), x: N, cls: "is-out", o: 0.65 });
  scene.add("lo", { shape: shapes.pointer({ text: "lo" }), x: 0, z: -0.52, o: 0 });
  scene.add("hi", { shape: shapes.pointer({ text: "hi" }), x: N, z: -0.52, o: 0 });
  scene.add("calc", { shape: shapes.pill(), x: 4, z: 1.46, o: 0 });
}
