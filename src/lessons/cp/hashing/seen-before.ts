import type { Lesson, SceneMap } from "../../../lib/types";

const A = [8, 3, 3, 5];
const TARGET = 6;
const CELLS = A.map((_, i) => `a${i}`);
const FIT = ["labA", ...CELLS, "labSeen", "seen8", "seen3", "calc"];

const scan = (i: number): SceneMap => ({
  [`a${i}`]: { cls: "is-active" },
  i: { x: i, o: 1, arc: 0.25, dur: 520 },
});
const stored = (id: string): SceneMap => ({
  [id]: { o: 1, cls: "is-active", from: { o: 0, z: 0.35 }, ease: "out", dur: 340, delay: 350 },
});
const formula = (text = "", cls = ""): SceneMap => ({
  calc: text
    ? { text, cls, o: 1, from: { o: 0 }, delay: 170, dur: 320, ease: "out" }
    : { text, o: 0 },
});
const map = (size: number): SceneMap => ({
  labSeen: { o: 1 },
  seen8: { o: size >= 1 ? 1 : 0 },
  seen3: { o: size >= 2 ? 1 : 0 },
});
const pair = (animate: boolean): SceneMap => ({
  ...map(2), ...scan(2), ...formula("3 + 3 = 6", "v-eq"),
  a1: { cls: "is-good" },
  a2: { cls: "is-good", ...(animate ? { fx: { type: "hop", amp: 0.22, delay: 450 } } : {}) },
  seen3: { o: 1, cls: "v-eq" },
});

export const lesson: Lesson = {
  track: "cp",
  topic: "hashing",
  slug: "seen-before",
  title: { vi: "Đã gặp chưa? (set / map)", en: "Seen it before? (set / map)" },
  added: "2026-11-27",
  summary: {
    vi: "Duyệt mảng theo thứ tự ban đầu và dùng hash map để tìm phần bù cùng chỉ số của nó.",
    en: "Scan the array in input order and use a hash map to find each complement and its index.",
  },
  level: "basic",
  minutes: 7,
  time: "O(n)",
  memory: "O(n)",
  goal: { vi: `Tìm hai chỉ số khác nhau có tổng giá trị bằng <b>${TARGET}</b>`, en: `Find two distinct indices whose values sum to <b>${TARGET}</b>` },
  codeLang: "C++17",
  code: [
    '<span class="kw">unordered_map</span>&lt;long long, int&gt; seen;',
    '<span class="kw">for</span> (int i = 0; i &lt; n; ++i) {',
    '  long long need = 1LL * target - a[i];',
    '  <span class="kw">auto</span> it = seen.find(need);',
    '  <span class="kw">if</span> (it != seen.end()) <span class="kw">return</span> {it-&gt;second, i};',
    '  seen[a[i]] = i;',
    '}',
    '<span class="kw">return</span> {-1, -1};',
  ],
  watch: [
    { key: "i", label: "i" },
    { key: "value", label: "a[i]" },
    { key: "need", label: "need" },
    { key: "pair", label: { vi: "cặp chỉ số", en: "index pair" } },
  ],
  practice: [
    { src: "CSES 1621", name: "Distinct Numbers", lv: "★☆☆", url: "https://cses.fi/problemset/task/1621/" },
    { src: "LeetCode 1", name: "Two Sum", lv: "★☆☆", url: "https://leetcode.com/problems/two-sum/" },
  ],
  sceneOptions: { unit: 62 },
  legend: [
    { cls: "acc", label: { vi: "đang xét hoặc vừa lưu", en: "current or just stored" } },
    { cls: "ac", label: { vi: "ghép được cặp", en: "matching pair" } },
  ],
  entrance: CELLS,
  steps: [
    {
      title: { vi: "Tìm cặp trong mảng", en: "Find a pair" }, kind: "problem",
      body: {
        vi: "Trong mảng <code>[8, 3, 3, 5]</code>, tìm hai chỉ số khác nhau sao cho hai giá trị cộng lại bằng 6. Thử từng cặp mất O(n²) thời gian.",
        en: "In <code>[8, 3, 3, 5]</code>, find two distinct indices whose values add up to 6. Testing every pair takes O(n²) time.",
      },
      lines: [], watch: {}, verdict: "run", fit: FIT, scene: formula(),
    },
    {
      title: { vi: "Lập bảng đã gặp", en: "Start an empty map" }, kind: "concept",
      body: {
        vi: "Một <code>unordered_set</code> trả lời được câu hỏi “đã gặp giá trị này chưa?”. Ta cần trả về cả chỉ số, nên dùng <code>unordered_map</code> tên <code>seen</code>, lưu theo dạng <b>giá trị → chỉ số</b>. Ban đầu bảng rỗng.",
        en: "An <code>unordered_set</code> can tell us whether we have seen a value. We also need its index, so we use an <code>unordered_map</code> called <code>seen</code> that stores <b>value → index</b>. It starts empty.",
      },
      lines: [1], watch: {}, verdict: "run", fit: FIT,
      scene: { ...map(0), ...formula("∅") },
    },
    {
      title: { vi: "Hỏi phần bù", en: "Look up the complement" }, kind: "step",
      body: {
        vi: "Với <code>a[0] = 8</code>, cần thêm <code>6 − 8 = −2</code> để đủ 6. Bảng chưa có −2, nên lưu <code>seen[8] = 0</code> rồi đi tiếp.",
        en: "At <code>a[0] = 8</code>, the missing value is <code>6 − 8 = −2</code>. The map has no −2, so store <code>seen[8] = 0</code> and move on.",
      },
      lines: [2, 3, 4, 6], watch: { i: 0, value: 8, need: -2 }, verdict: "run", fit: FIT,
      scene: { ...map(1), ...scan(0), ...stored("seen8"), ...formula("6 − 8 = −2") },
    },
    {
      title: { vi: "Tra trước khi lưu", en: "Look up before storing" }, kind: "step",
      body: {
        vi: "Ở <code>i = 1</code>, <code>a[1] = 3</code> cần ghép với 3. Bảng chỉ có khóa 8, nên phép tra chưa tìm được cặp.",
        en: "At <code>i = 1</code>, <code>a[1] = 3</code> needs another 3. The map contains only the key 8, so the lookup finds no pair.",
      },
      note: {
        vi: "Tra trước khi lưu để số 3 ở vị trí 1 không tự ghép với chính nó.",
        en: "Looking up first prevents the 3 at index 1 from pairing with itself.",
      },
      lines: [2, 3, 4, 5], watch: { i: 1, value: 3, need: 3 }, verdict: "run", fit: FIT,
      scene: { ...map(1), ...scan(1), ...formula("6 − 3 = 3") },
    },
    {
      title: { vi: "Lưu số 3 đầu tiên", en: "Store the first 3" }, kind: "step",
      body: {
        vi: "Phép tra vừa thất bại, nên ghi <code>seen[3] = 1</code>. Từ lượt sau, nếu cần 3, ta có thể lấy ngay chỉ số 1.",
        en: "The lookup missed, so record <code>seen[3] = 1</code>. A later lookup for 3 can now retrieve index 1.",
      },
      lines: [6], watch: { i: 1, value: 3, need: 3 }, verdict: "run", fit: FIT,
      scene: { ...map(2), ...scan(1), ...stored("seen3"), ...formula() },
    },
    {
      title: { vi: "Ghép hai số 3", en: "Pair the two 3s" }, kind: "answer",
      body: {
        vi: "Tại <code>i = 2</code>, ta lại cần <code>6 − 3 = 3</code>. Lần này <code>seen[3] = 1</code>, nên trả về <code>(1, 2)</code> với <code>3 + 3 = 6</code>.",
        en: "At <code>i = 2</code>, we again need <code>6 − 3 = 3</code>. This time <code>seen[3] = 1</code>, so return <code>(1, 2)</code>, since <code>3 + 3 = 6</code>.",
      },
      lines: [3, 4, 5], watch: { i: 2, value: 3, need: 3, pair: "(1, 2)" }, verdict: "ac", fit: FIT,
      scene: pair(true),
    },
    {
      title: { vi: "Một lượt là đủ", en: "One scan is enough" }, kind: "recap",
      body: {
        vi: "Khi đến phần tử sau của một cặp đúng, bảng đã có phần bù từ một vị trí trước đó, như <code>seen[3] = 1</code> khi <code>i = 2</code>. Mỗi lượt chỉ tra và có thể lưu một khóa, nên thời gian trung bình là O(n), bộ nhớ O(n).",
        en: "At the later member of a valid pair, the map already holds the complement at an earlier index, as with <code>seen[3] = 1</code> at <code>i = 2</code>. Each iteration looks up a key and may store one, taking O(n) average time and O(n) space overall.",
      },
      lines: [2, 4, 5, 6], watch: { i: 2, value: 3, need: 3, pair: "(1, 2)" }, verdict: "ac", fit: FIT,
      scene: pair(false),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("labA", { shape: shapes.pill({ text: "a" }), x: -1.1, z: 0.2 });
  A.forEach((value, i) => scene.add(`a${i}`, { shape: shapes.block({ label: value, sub: i, w: 48, h: 42 }), x: i, shadow: true }));
  scene.add("i", { shape: shapes.pointer({ text: "i" }), z: -0.46, o: 0 });
  scene.add("labSeen", { shape: shapes.pill({ text: "seen" }), x: -1.1, y: 3.65, o: 0 });
  scene.add("seen8", { shape: shapes.pill({ text: "8 → 0" }), x: 0.3, y: 3.65, o: 0 });
  scene.add("seen3", { shape: shapes.pill({ text: "3 → 1" }), x: 1.85, y: 3.65, o: 0 });
  scene.add("calc", { shape: shapes.pill(), x: 1.25, y: 5.05, o: 0 });
}
