import type { Lesson, SceneMap } from "../../../lib/types";

const A = [3, 1, 5, 2, 2, 4];
const dp: number[] = [];
const prev: number[] = [];
const tails: number[] = [];
const prefixes = A.map((x, i) => {
  let best = -1;
  for (let j = 0; j < i; j++) {
    if (A[j] < x && (best === -1 || dp[j] > dp[best])) best = j;
  }
  prev.push(best);
  dp.push(best === -1 ? 1 : dp[best] + 1);
  const first = tails.findIndex((tail) => tail >= x);
  const slot = first === -1 ? tails.length : first;
  tails[slot] = x;
  return { values: [...tails], slot };
});

function dpPicture(through: number): SceneMap {
  const scene: SceneMap = {
    dpLabel: { o: through >= 0 ? 1 : 0 },
    trace: { text: "", o: 0 },
  };
  A.forEach((_, i) => {
    scene[`a${i}`] = { cls: i === through ? "is-active" : "" };
    scene[`d${i}`] = {
      text: i <= through ? String(dp[i]) : "?",
      o: i <= through ? 1 : through < 0 ? 0 : 0.55,
      cls: i === through ? "is-good" : i > through ? "is-out" : "",
    };
    scene[`calc${i}`] = {
      text: i > through ? "" : prev[i] === -1 ? "1" : `1+d[${prev[i]}]`,
      o: i <= through ? 1 : 0,
    };
    scene[`t${i}`] = { text: "", o: 0 };
  });
  if (through >= 0 && prev[through] !== -1) scene[`d${prev[through]}`].cls = "is-active";
  return scene;
}

function tailsPicture(i: number, text: string): SceneMap {
  const scene = dpPicture(-1);
  const { values, slot } = prefixes[i];
  scene.tailsLabel = { o: 1 };
  scene.trace = {
    text, o: 1, from: { o: 0, s: 0.85 }, delay: 220, dur: 340, ease: "back",
  };
  scene[`a${i}`] = { cls: "is-active" };
  values.forEach((value, j) => {
    scene[`t${j}`] = { text: String(value), o: 1, cls: j === slot ? "is-good" : "" };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "dp",
  slug: "lis",
  title: { vi: "Dãy con tăng dài nhất", en: "Longest increasing subsequence" },
  added: "2026-11-27",
  summary: {
    vi: "Tính độ dài theo từng vị trí kết thúc, rồi tăng tốc bằng mảng đuôi và binary search.",
    en: "Compute lengths by ending position, then speed up with minimum tails and binary search.",
  },
  level: "medium",
  minutes: 10,
  time: "O(n²) → O(n log n)",
  memory: "O(n)",
  goal: { vi: "Tìm độ dài dãy con tăng nghiêm ngặt trong <b>[3, 1, 5, 2, 2, 4]</b>", en: "Find the longest strictly increasing subsequence length in <b>[3, 1, 5, 2, 2, 4]</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> lisDP(<span class="kw">const</span> vector&lt;<span class="kw">int</span>&gt;&amp; a) {',
    '  <span class="kw">int</span> n = a.size(), best = 0;',
    '  vector&lt;<span class="kw">int</span>&gt; d(n, 1);',
    '  <span class="kw">for</span> (<span class="kw">int</span> i = 0; i &lt; n; ++i) {',
    '    <span class="kw">for</span> (<span class="kw">int</span> j = 0; j &lt; i; ++j)',
    '      <span class="kw">if</span> (a[j] &lt; a[i]) d[i] = max(d[i], d[j] + 1);',
    '    best = max(best, d[i]);',
    '  }',
    '  <span class="kw">return</span> best;',
    '}',
    '<span class="kw">int</span> lisFast(<span class="kw">const</span> vector&lt;<span class="kw">int</span>&gt;&amp; a) {',
    '  vector&lt;<span class="kw">int</span>&gt; tails;',
    '  <span class="kw">for</span> (<span class="kw">int</span> x : a) {',
    '    <span class="kw">auto</span> it = lower_bound(tails.begin(), tails.end(), x);',
    '    <span class="kw">if</span> (it == tails.end()) tails.push_back(x);',
    '    <span class="kw">else</span> *it = x;',
    '  }',
    '  <span class="kw">return</span> tails.size();',
    '}',
  ],
  watch: [
    { key: "i", label: "i" },
    { key: "d", label: "d[i]" },
    { key: "slot", label: { vi: "ô đuôi", en: "tail slot" } },
    { key: "best", label: { vi: "dài nhất", en: "longest" } },
  ],
  practice: [
    { src: "LeetCode 300", name: "Longest Increasing Subsequence", lv: "★★☆", url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
    { src: "CSES 1145", name: "Increasing Subsequence", lv: "★★★", url: "https://cses.fi/problemset/task/1145" },
  ],
  sceneOptions: { unit: 55 },
  legend: [
    { cls: "acc", label: { vi: "phần tử hoặc ô đang dùng", en: "input or entry in use" } },
    { cls: "ac", label: { vi: "ô vừa cập nhật", en: "updated entry" } },
    { cls: "dim", label: { vi: "chưa tính", en: "pending" } },
  ],
  entrance: A.map((_, i) => `a${i}`),
  steps: [
    {
      title: { vi: "Tìm dãy con tăng", en: "Find an increasing subsequence" }, kind: "problem",
      body: {
        vi: "Ta được bỏ phần tử và phải giữ nguyên thứ tự, chẳng hạn lấy 1 rồi 5 ở vị trí 1 và 2. Mỗi số sau phải lớn hơn hẳn số trước. Nếu thử mọi cách lấy hoặc bỏ thì có 2ⁿ dãy con theo vị trí.",
        en: "We may drop elements while keeping their order, for example taking 1 then 5 at indices 1 and 2. Each next value must be strictly larger. Trying every keep-or-drop choice gives 2ⁿ subsequences by index.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: dpPicture(-1),
    },
    {
      title: { vi: "Cố định điểm cuối", en: "Fix the endpoint" }, kind: "concept",
      body: {
        vi: "<code>d[i]</code> là độ dài lớn nhất của dãy tăng kết thúc ngay tại <code>a[i]</code>. Số 3 đứng đầu, còn số 1 chỉ có 3 đứng trước nên cả hai đều có <code>d[i] = 1</code>.",
        en: "<code>d[i]</code> is the longest length of an increasing subsequence ending exactly at <code>a[i]</code>. The 3 comes first and only 3 precedes the 1, so both have <code>d[i] = 1</code>.",
      },
      lines: [3, 4, 5, 6], watch: { i: 1, d: 1, best: 1 }, verdict: "run",
      fit: "all", scene: dpPicture(1),
    },
    {
      title: { vi: "Nối sau số nhỏ", en: "Extend smaller endings" }, kind: "step",
      body: {
        vi: "Với số 5, cả 3 lẫn 1 đều có thể đứng ngay trước và đều cho độ dài 2. Với hai số 2, ta chỉ nối được sau số 1, vì 2 bằng 2. Mỗi ô chọn <code>d[j]</code> lớn nhất trong các vị trí trước đó có <code>a[j] &lt; a[i]</code>, rồi cộng 1.",
        en: "The 5 can follow either 3 or 1, both giving length 2. Each 2 can only follow 1, since equal values cannot extend a subsequence. Each entry takes the largest <code>d[j]</code> among earlier positions with <code>a[j] &lt; a[i]</code> and adds 1.",
      },
      lines: [4, 5, 6, 7], watch: { i: 4, d: 2, best: 2 }, verdict: "run",
      fit: "all", scene: dpPicture(4),
    },
    {
      title: { vi: "Lấy độ dài lớn nhất", en: "Take the largest length" }, kind: "answer",
      body: {
        vi: "Số 4 nối sau một trong hai số 2 có độ dài 2, nên <code>d[5] = 2 + 1 = 3</code>. Giá trị lớn nhất cả hàng là 3, ví dụ dãy <code>[1, 2, 4]</code>. Quét các vị trí <code>j</code> cho từng <code>i</code> tốn O(n²).",
        en: "The 4 can follow either 2, each with length 2, so <code>d[5] = 2 + 1 = 3</code>. The row maximum is 3, witnessed by <code>[1, 2, 4]</code>. Scanning earlier positions <code>j</code> for each <code>i</code> takes O(n²).",
      },
      lines: [5, 6, 7, 9], watch: { i: 5, d: 3, best: 3 }, verdict: "ac",
      fit: "all", scene: dpPicture(5),
    },
    {
      title: { vi: "Giữ đuôi nhỏ nhất", en: "Keep the smallest tail" }, kind: "concept",
      body: {
        vi: "<code>tails[k]</code> giữ giá trị kết thúc nhỏ nhất của dãy tăng dài <code>k + 1</code> trong phần đã duyệt. Số 3 tạo ô 0, số 1 thay 3 vì dễ nối tiếp hơn, rồi 5 tạo ô 1 nhờ nối sau 1.",
        en: "<code>tails[k]</code> keeps the smallest ending value of any length-<code>k + 1</code> increasing subsequence seen so far. The 3 creates slot 0, the 1 replaces it as an easier value to extend, then the 5 extends 1 to create slot 1.",
      },
      lines: [11, 12, 13, 14, 15, 16], watch: { i: 2, slot: 1, best: 2 }, verdict: "ac",
      fit: "all", scene: tailsPicture(2, "[] → [3] → [1] → [1, 5]"),
    },
    {
      title: { vi: "Thay đuôi bằng 2", en: "Replace a tail with 2" }, kind: "step",
      body: {
        vi: "<code>lower_bound</code> tìm ô đầu tiên có giá trị lớn hơn hoặc bằng 2. Trong <code>[1, 5]</code>, đó là ô 1. Ta nối 2 sau 1 để giữ đuôi 2 cho độ dài 2.",
        en: "<code>lower_bound</code> finds the first entry greater than or equal to 2. In <code>[1, 5]</code>, that is slot 1. Extend 1 with 2 and keep 2 as the tail for length 2.",
      },
      lines: [13, 14, 16], watch: { i: 3, slot: 1, best: 2 }, verdict: "ac",
      fit: "all", scene: tailsPicture(3, "1 < 2 ≤ 5   ⇒   tails[1] = 2"),
    },
    {
      title: { vi: "Gặp số 2 nữa", en: "Process another 2" }, kind: "step",
      body: {
        vi: "Số 2 thứ hai cũng tìm đến ô 1, vì <code>2 ≥ 2</code>. Ghi lại 2 ở ô đó, độ dài vẫn là 2. Hai giá trị bằng nhau không thể đứng liên tiếp trong dãy tăng nghiêm ngặt.",
        en: "The second 2 also lands at slot 1 because <code>2 ≥ 2</code>. Writing 2 there again keeps the length at 2. Equal values cannot be consecutive in a strictly increasing subsequence.",
      },
      lines: [13, 14, 16], watch: { i: 4, slot: 1, best: 2 }, verdict: "ac",
      fit: "all", scene: tailsPicture(4, "1 < 2 ≤ 2   ⇒   tails[1] = 2"),
    },
    {
      title: { vi: "Nối thêm đuôi 4", en: "Append a tail of 4" }, kind: "answer",
      body: {
        vi: "Cả hai đuôi 1 và 2 đều nhỏ hơn 4, nên <code>lower_bound</code> trả về <code>tails.end()</code>. Nối 4 sau đuôi 2 tạo dãy dài 3. Đọc <code>tails.size() = 3</code>, đúng bằng kết quả DP.",
        en: "Both tails, 1 and 2, are smaller than 4, so <code>lower_bound</code> returns <code>tails.end()</code>. Extending the tail 2 with 4 gives length 3. Read <code>tails.size() = 3</code>, matching the DP result.",
      },
      lines: [13, 14, 15, 18], watch: { i: 5, slot: 2, best: 3 }, verdict: "ac",
      fit: "all", scene: tailsPicture(5, "2 < 4   ⇒   tails.push_back(4)"),
    },
    {
      title: { vi: "Vì sao tìm nhị phân", en: "Why binary search works" }, kind: "recap",
      body: {
        vi: "Bỏ số cuối khỏi một dãy tăng cho đuôi nhỏ hơn ở độ dài liền trước, nên <code>tails</code> luôn tăng nghiêm ngặt. Khi ô đầu tiên có đuôi ≥ <code>x</code> là <code>k</code>, dãy dài <code>k</code> nối được với <code>x</code> (hoặc bắt đầu dãy mới nếu <code>k = 0</code>), còn các dãy dài hơn có đuôi quá lớn. Mỗi lần tìm ô mất O(log n), nên tổng cộng O(n log n) thời gian và O(n) bộ nhớ.",
        en: "Dropping the last value of an increasing subsequence gives a smaller tail for the preceding length, so <code>tails</code> stays strictly increasing. If the first tail ≥ <code>x</code> is at slot <code>k</code>, a length-<code>k</code> subsequence can extend with <code>x</code> (or start fresh when <code>k = 0</code>), while longer ones have tails too large. Finding each slot takes O(log n), for O(n log n) time and O(n) space.",
      },
      note: {
        vi: "Đuôi ở các ô trước đã nhỏ hơn x, nên chỉ ô k cần cập nhật.",
        en: "Earlier slots already have smaller tails than x, so only slot k needs an update.",
      },
      lines: [13, 14, 15, 16, 18], watch: { best: 3 }, verdict: "ac",
      fit: "all", scene: tailsPicture(5, "tails.size() = 3"),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  const row = 2.45;
  scene.add("arrayLabel", { shape: shapes.pill({ text: "a" }), x: -1.25 });
  scene.add("dpLabel", { shape: shapes.pill({ text: "d" }), x: -1.25, y: row, o: 0 });
  scene.add("tailsLabel", { shape: shapes.pill({ text: "tails", pad: 6 }), x: -1.25, y: row, o: 0 });
  scene.add("trace", { shape: shapes.pill(), x: 2.05, y: row + 1.3, o: 0 });
  A.forEach((value, i) => {
    scene.add(`a${i}`, { shape: shapes.block({ label: value, sub: i, w: 44, h: 34, depth: 4 }), x: i });
    scene.add(`d${i}`, { shape: shapes.block({ label: "?", w: 44, h: 34, depth: 4 }), x: i, y: row, o: 0 });
    scene.add(`calc${i}`, { shape: shapes.pill({ h: 22, pad: 4 }), x: i, y: row + 1.05, s: 0.75, o: 0 });
    scene.add(`t${i}`, { shape: shapes.block({ w: 44, h: 34, depth: 4 }), x: i, y: row, o: 0 });
  });
}
