import type { Lesson, SceneMap } from "../../../lib/types";

const A = [2, -2, 3, 0];
const K = 3;
const PRE = [0, 2, 0, 3, 3];
const CELLS = A.map((_, i) => `a${i}`);
const FIT = ["labA", ...CELLS, "labPre", "p0", "p4", "labCnt", "cnt0", "cnt3", "calc"];

const prefix = (r: number, lefts: number[] = []): SceneMap =>
  Object.fromEntries(PRE.map((value, j) => {
    const known = j <= r;
    const cls = lefts.includes(j) ? "is-good" : j === r ? "is-active" : known ? "" : "is-out";
    return [`p${j}`, { text: known ? String(value) : "?", o: r < 0 ? 0 : known ? 1 : 0.45, cls }];
  }));

const frequency = (zero: number, two: number, three: number, hit?: number): SceneMap => ({
  labCnt: { o: zero ? 1 : 0 },
  ...Object.fromEntries([[0, zero], [2, two], [3, three]].map(([key, count]) => [
    `cnt${key}`, { text: String(count), o: count ? 1 : 0, cls: hit === key ? "is-good" : "" },
  ])),
});

const calc = (text = "", cls = ""): SceneMap => ({
  calc: text
    ? { text, cls, o: 1, from: { o: 0 }, delay: 200, dur: 320, ease: "out" }
    : { text, o: 0 },
});
const scan = (i: number): SceneMap => ({
  [`a${i}`]: { cls: "is-active" },
  r: { x: i + 1, o: 1, arc: 0.22, dur: 520 },
});
const matches = (r: number): SceneMap => ({
  ...prefix(r, [0, 2]),
  ...scan(r - 1),
  labPre: { o: 1 },
});

export const lesson: Lesson = {
  track: "cp",
  topic: "hashing",
  slug: "subarray-sum-k",
  title: { vi: "Đếm đoạn con có tổng k", en: "Counting subarrays with sum k" },
  added: "2026-11-27",
  summary: {
    vi: "Với mỗi đầu phải, tra số prefix trước đó có giá trị bằng tổng hiện tại trừ k.",
    en: "For each right endpoint, count earlier prefixes equal to the current prefix sum minus k.",
  },
  level: "medium",
  minutes: 9,
  time: "O(n)",
  memory: "O(n)",
  goal: { vi: `Đếm các đoạn con liên tiếp có tổng bằng <b>${K}</b>`, en: `Count contiguous subarrays whose sum is <b>${K}</b>` },
  codeLang: "C++17",
  code: [
    '<span class="kw">unordered_map</span>&lt;long long, long long&gt; cnt{{0, 1}};',
    '<span class="kw">long long</span> pre = 0, ans = 0;',
    '<span class="kw">for</span> (long long x : a) {',
    '  pre += x;',
    '  <span class="kw">auto</span> it = cnt.find(pre - k);',
    '  <span class="kw">if</span> (it != cnt.end()) ans += it-&gt;second;',
    '  ++cnt[pre];',
    '}',
    '<span class="kw">return</span> ans;',
  ],
  watch: [
    { key: "r", label: "r" },
    { key: "pre", label: "pre" },
    { key: "need", label: "pre − k" },
    { key: "hits", label: "cnt[pre − k]" },
    { key: "ans", label: "ans" },
  ],
  practice: [
    { src: "LeetCode 560", name: "Subarray Sum Equals K", lv: "★★☆", url: "https://leetcode.com/problems/subarray-sum-equals-k/" },
    { src: "CSES 1661", name: "Subarray Sums II", lv: "★★☆", url: "https://cses.fi/problemset/task/1661/" },
  ],
  sceneOptions: { unit: 56 },
  legend: [
    { cls: "acc", label: { vi: "ô đang xét", en: "current entry" } },
    { cls: "ac", label: { vi: "prefix khớp và số lần gặp", en: "matching prefixes and their count" } },
    { cls: "dim", label: { vi: "prefix chưa tính", en: "prefix yet to compute" } },
  ],
  entrance: CELLS,
  steps: [
    {
      title: { vi: "Đếm các đoạn con", en: "Count the subarrays" }, kind: "problem",
      body: {
        vi: "Trong <code>[2, −2, 3, 0]</code>, có bao nhiêu đoạn con liên tiếp, không rỗng có tổng bằng 3? Ngay cả khi cộng dồn lúc mở rộng từng đoạn, thử mọi cặp đầu mút vẫn tốn O(n²).",
        en: "How many nonempty contiguous subarrays of <code>[2, −2, 3, 0]</code> sum to 3? Even if we keep a running sum as we extend each subarray, trying every pair of endpoints takes O(n²).",
      },
      lines: [], watch: {}, verdict: "run", fit: FIT,
      scene: { ...prefix(-1), ...frequency(0, 0, 0), ...calc() },
    },
    {
      title: { vi: "Ghi prefix rỗng", en: "Store the empty prefix" }, kind: "concept",
      body: {
        vi: "<code>pre[r]</code> là tổng <code>r</code> phần tử đầu, nên đoạn <code>a[l..r−1]</code> có tổng <code>pre[r] − pre[l]</code>. Muốn tổng bằng 3 thì cần <code>pre[l] = pre[r] − 3</code>. Khởi tạo <code>cnt[0] = 1</code> từ <code>pre[0] = 0</code> để tính được cả đoạn bắt đầu ở chỉ số 0.",
        en: "<code>pre[r]</code> sums the first <code>r</code> elements, so <code>a[l..r−1]</code> sums to <code>pre[r] − pre[l]</code>. For a sum of 3, we need <code>pre[l] = pre[r] − 3</code>. Seed <code>cnt[0] = 1</code> for <code>pre[0] = 0</code> so subarrays starting at index 0 can count.",
      },
      lines: [1, 2], watch: { r: 0, pre: 0, ans: 0 }, verdict: "run", fit: FIT,
      scene: { labPre: { o: 1 }, ...prefix(0), ...frequency(1, 0, 0), ...calc("cnt[0] = 1") },
    },
    {
      title: { vi: "Tra giá trị −1", en: "Look up −1" }, kind: "step",
      body: {
        vi: "Qua <code>a[0] = 2</code>, tổng hiện tại là <code>pre[1] = 2</code>. Cần prefix bằng <code>2 − 3 = −1</code>, nhưng bảng chưa có. Giữ <code>ans = 0</code>, rồi ghi <code>cnt[2] = 1</code>.",
        en: "After <code>a[0] = 2</code>, the running sum is <code>pre[1] = 2</code>. We need a prefix of <code>2 − 3 = −1</code>, which is absent. Keep <code>ans = 0</code>, then record <code>cnt[2] = 1</code>.",
      },
      lines: [3, 4, 5, 6, 7], watch: { r: 1, pre: 2, need: -1, hits: 0, ans: 0 }, verdict: "run", fit: FIT,
      scene: { labPre: { o: 1 }, ...prefix(1), ...scan(0), ...frequency(1, 1, 0), ...calc("2 − 3 = −1") },
    },
    {
      title: { vi: "Gặp lại prefix 0", en: "See prefix 0 again" }, kind: "step",
      body: {
        vi: "Cộng <code>a[1] = −2</code> được <code>pre[2] = 0</code>. Bảng chưa có <code>0 − 3 = −3</code>, nên chưa đếm thêm đoạn nào. Giờ <code>pre[0]</code> và <code>pre[2]</code> đều bằng 0, vì vậy tăng <code>cnt[0]</code> lên 2.",
        en: "Adding <code>a[1] = −2</code> gives <code>pre[2] = 0</code>. The map has no <code>0 − 3 = −3</code>, so no subarray is added. Both <code>pre[0]</code> and <code>pre[2]</code> are now 0, so increment <code>cnt[0]</code> to 2.",
      },
      lines: [4, 5, 6, 7], watch: { r: 2, pre: 0, need: -3, hits: 0, ans: 0 }, verdict: "run", fit: FIT,
      scene: { labPre: { o: 1 }, ...prefix(2), ...scan(1), ...frequency(2, 1, 0), ...calc("cnt[0]: 1 → 2") },
    },
    {
      title: { vi: "Một khóa, hai đoạn", en: "One key, two subarrays" }, kind: "step",
      body: {
        vi: "Với <code>pre[3] = 3</code>, ta tra <code>3 − 3 = 0</code> và thấy <code>cnt[0] = 2</code>. Hai vị trí <code>l = 0</code> và <code>l = 2</code> cho hai đoạn <code>a[0..2]</code> và <code>a[2..2]</code>, nên <code>ans = 2</code>.",
        en: "With <code>pre[3] = 3</code>, looking up <code>3 − 3 = 0</code> gives <code>cnt[0] = 2</code>. The two left endpoints, <code>l = 0</code> and <code>l = 2</code>, give <code>a[0..2]</code> and <code>a[2..2]</code>, so <code>ans = 2</code>.",
      },
      lines: [4, 5, 6], watch: { r: 3, pre: 3, need: 0, hits: 2, ans: 2 }, verdict: "run", fit: FIT,
      scene: { ...matches(3), ...frequency(2, 1, 0, 0), ...calc("a[0..2] · a[2..2]", "v-eq") },
    },
    {
      title: { vi: "Lưu prefix vừa xét", en: "Record the current prefix" }, kind: "step",
      body: {
        vi: "Đếm xong các đoạn kết thúc ở chỉ số 2 mới lưu <code>pre[3] = 3</code> vào bảng. Thứ tự này giữ cho mỗi prefix dùng làm đầu trái có <code>l &lt; r</code>. Nếu <code>k = 0</code>, lưu trước sẽ đếm nhầm cả đoạn rỗng.",
        en: "After counting subarrays ending at index 2, record <code>pre[3] = 3</code>. This order ensures every prefix used as a left endpoint has <code>l &lt; r</code>. If <code>k = 0</code>, inserting first would count the empty subarray.",
      },
      lines: [7], watch: { r: 3, pre: 3, need: 0, hits: 2, ans: 2 }, verdict: "run", fit: FIT,
      scene: { labPre: { o: 1 }, ...prefix(3), ...scan(2), ...frequency(2, 1, 1), ...calc("cnt[3] = 1") },
    },
    {
      title: { vi: "Thêm hai đoạn cuối", en: "Count two final subarrays" }, kind: "answer",
      body: {
        vi: "Ô cuối là 0 nên <code>pre[4] = 3</code>. Tra 0 lại được 2 đầu trái, lần này cho <code>a[0..3]</code> và <code>a[2..3]</code>. Tổng cộng <code>ans = 2 + 2 = 4</code>, rồi lưu thêm một lần gặp prefix 3.",
        en: "The last value is 0, so <code>pre[4] = 3</code>. Looking up 0 again gives two left endpoints, this time for <code>a[0..3]</code> and <code>a[2..3]</code>. The total is <code>ans = 2 + 2 = 4</code>, then we record one more occurrence of prefix 3.",
      },
      lines: [4, 5, 6, 7, 9], watch: { r: 4, pre: 3, need: 0, hits: 2, ans: 4 }, verdict: "ac", fit: FIT,
      scene: { ...matches(4), ...frequency(2, 1, 2, 0), ...calc("a[0..3] · a[2..3]", "v-eq") },
    },
    {
      title: { vi: "Mỗi đoạn đếm một lần", en: "Count each subarray once" }, kind: "recap",
      body: {
        vi: "Tại mỗi <code>r</code>, bảng đếm đúng các prefix trước <code>r</code>; mỗi lần khớp cho một đầu trái. Mỗi đoạn chỉ xuất hiện ở lượt xét đầu phải của nó. Duyệt một lần với hash map tốn trung bình O(n) thời gian và dùng O(n) bộ nhớ.",
        en: "At each <code>r</code>, the map counts precisely the prefixes before <code>r</code>, and each match gives one left endpoint. Each subarray is counted when its own right endpoint is processed. One scan with a hash map takes O(n) average time and O(n) space.",
      },
      lines: [3, 5, 6, 7, 9], watch: { r: 4, pre: 3, need: 0, hits: 2, ans: 4 }, verdict: "ac", fit: FIT,
      scene: { ...matches(4), ...frequency(2, 1, 2, 0), ...calc("ans = 4", "v-eq") },
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("labA", { shape: shapes.pill({ text: "a" }), x: -0.9, z: 0.2 });
  A.forEach((value, i) => {
    scene.add(`a${i}`, { shape: shapes.block({ label: value, sub: i, w: 46, h: 38 }), x: i + 0.5, shadow: true });
  });
  scene.add("r", { shape: shapes.pointer({ text: "r" }), x: 0, z: -0.47, o: 0 });
  scene.add("labPre", { shape: shapes.pill({ text: "pre" }), x: -0.95, y: 4.05, z: 0.2, o: 0 });
  PRE.forEach((_, j) => {
    scene.add(`p${j}`, { shape: shapes.block({ label: "?", sub: j, w: 45, h: 34 }), x: j, y: 4.05, o: 0 });
  });
  scene.add("labCnt", { shape: shapes.pill({ text: "cnt" }), x: -0.95, y: 6.6, z: 0.15, o: 0 });
  [0, 2, 3].forEach((key, j) => {
    scene.add(`cnt${key}`, { shape: shapes.block({ label: 0, sub: `pre = ${key}`, w: 50, h: 34 }), x: 0.3 + 1.4 * j, y: 6.6, o: 0 });
  });
  scene.add("calc", { shape: shapes.pill(), x: 1.7, y: 8.95, o: 0 });
}
