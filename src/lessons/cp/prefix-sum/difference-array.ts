import type { Lesson, SceneMap } from "../../../lib/types";

const A = [3, 1, 4, 1, 5, 9];
const N = A.length;
const U = 62;
const DIFF_Y = 3;
const OUT_Y = 7.45;
const FIRST = { l: 1, r: 3, x: 3 };
const SECOND = { l: 3, r: 5, x: 2 };

function record(previous: number[], { l, r, x }: typeof FIRST): number[] {
  const diff = [...previous];
  diff[l] += x;
  diff[r + 1] -= x;
  return diff;
}

const START = Array<number>(N + 1).fill(0);
START[FIRST.l] = FIRST.x;
const AFTER_FIRST = record(Array<number>(N + 1).fill(0), FIRST);
const DIFF = record(AFTER_FIRST, SECOND);
const OUT = A.map((v, i) => v + DIFF.slice(0, i + 1).reduce((sum, delta) => sum + delta, 0));

const TOP = ["labA", "a5"];
const WITH_DIFF = [...TOP, "labD", "d6", "calc"];
const ALL = [...WITH_DIFF, "labOut", "out5"];

const active = { cls: "is-active" };
const stop = { cls: "is-bad" };
const good = { cls: "is-good" };
const hop = { ...good, fx: { type: "hop", delay: 220 } };
const signed = (v: number) => v > 0 ? `+${v}` : String(v).replace("-", "−");
const frame = (l: number, r: number): SceneMap => ({
  win: { x: (l + r) / 2, w: (r - l) * U + 58, o: 1 },
});
const diffRow = (values: number[] = DIFF, marks: SceneMap = {}, visible = true): SceneMap => ({
  labD: { o: visible ? 1 : 0 },
  ...Object.fromEntries(values.map((v, i) => [`d${i}`, {
    text: signed(v), o: visible ? (i === N ? 0.6 : 1) : 0, ...marks[`d${i}`],
  }])),
});
const output = (last = -1, marks: SceneMap = {}): SceneMap => ({
  labOut: { o: last < 0 ? 0 : 1 },
  ...Object.fromEntries(OUT.map((v, i) => [`out${i}`, {
    text: i <= last ? String(v) : "?",
    o: last < 0 ? 0 : i <= last ? 1 : 0.35,
    cls: i <= last ? "" : "is-out",
    ...marks[`out${i}`],
  }])),
});
const calc = (text = "", result = false, delay = 430): SceneMap => ({
  calc: text
    ? { text, cls: result ? "v-eq" : "", o: 1, from: { o: 0, s: 0.8 }, delay, dur: 320, ease: "back" }
    : { text, o: 0 },
});

export const lesson: Lesson = {
  track: "cp",
  topic: "prefix-sum",
  slug: "difference-array",
  title: { vi: "Mảng hiệu", en: "Difference arrays" },
  added: "2026-11-27",
  summary: {
    vi: "Ghi mỗi lần cộng đoạn ở hai đầu mút, rồi cộng dồn một lượt để lấy mảng cuối.",
    en: "Record each range addition at two boundaries, then recover the final array in one pass.",
  },
  level: "basic",
  minutes: 8,
  time: "O(n + q)",
  memory: "O(n)",
  goal: {
    vi: "Cộng <b>3</b> vào đoạn <b>[1, 3]</b> rồi cộng <b>2</b> vào đoạn <b>[3, 5]</b>",
    en: "Add <b>3</b> to <b>[1, 3]</b>, then add <b>2</b> to <b>[3, 5]</b>",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">vector</span>&lt;<span class="kw">long long</span>&gt; diff(n + 1, 0);',
    '<span class="kw">auto</span> add = [&amp;](<span class="kw">int</span> l, <span class="kw">int</span> r, <span class="kw">long long</span> x) {',
    '  diff[l] += x;',
    '  diff[r + 1] -= x;',
    '};',
    '<span class="kw">for</span> (<span class="kw">auto</span> [l, r, x] : updates) add(l, r, x);',
    '',
    '<span class="kw">long long</span> carry = 0;',
    '<span class="kw">vector</span>&lt;<span class="kw">long long</span>&gt; out(n);',
    '<span class="kw">for</span> (<span class="kw">int</span> i = 0; i &lt; n; ++i) {',
    '  carry += diff[i];',
    '  out[i] = a[i] + carry;',
    '}',
  ],
  watch: [
    { key: "range", label: "[l, r]" },
    { key: "x", label: "x" },
    { key: "i", label: "i" },
    { key: "carry", label: "carry" },
    { key: "out", label: { vi: "kết quả", en: "result" } },
  ],
  practice: [
    { src: "LeetCode 1094", name: "Car Pooling", lv: "★★☆", url: "https://leetcode.com/problems/car-pooling/" },
    { src: "CSES 1651", name: "Range Update Queries", lv: "★★★", url: "https://cses.fi/problemset/task/1651" },
  ],
  sceneOptions: { unit: U, view: [-135, -90, 600, 370] },
  legend: [
    { cls: "acc", label: { vi: "đang xét", en: "in use" } },
    { cls: "wa", label: { vi: "mốc kết thúc", en: "stop boundary" } },
    { cls: "ac", label: { vi: "giá trị đã tính", en: "computed value" } },
  ],
  entrance: A.map((_, i) => `a${i}`),
  steps: [
    {
      title: { vi: "Cộng cả đoạn", en: "Add to a range" }, kind: "problem",
      body: {
        vi: "Cho mảng <code>a</code> có 6 phần tử, đánh số từ 0. Cộng 3 vào các ô từ 1 đến 3, rồi cộng 2 vào các ô từ 3 đến 5 và in mảng cuối. Nếu sửa từng ô trong mỗi đoạn, q lần cập nhật có thể tốn O(nq).",
        en: "The array <code>a</code> has 6 entries indexed from 0. Add 3 to entries 1 through 3, then add 2 to entries 3 through 5 and print the final array. Updating each entry directly can cost O(nq) for q updates.",
      },
      lines: [], watch: { range: "[1, 3]", x: 3 }, verdict: "run", fit: TOP,
      scene: { ...frame(1, 3), ...diffRow(START, {}, false), ...output(), ...calc() },
    },
    {
      title: { vi: "Đánh dấu đầu đoạn", en: "Mark the start" }, kind: "concept",
      body: {
        vi: "Tạo <code>diff</code> gồm 7 ô, ban đầu đều bằng 0. Ghi <code>diff[1] += 3</code> để khi quét từ trái sang phải, mức cộng dồn tăng thêm 3 từ ô 1.",
        en: "Start with 7 zero entries in <code>diff</code>. Record <code>diff[1] += 3</code> so the running addition rises by 3 at index 1 in a left-to-right sweep.",
      },
      lines: [1, 2, 3], watch: { range: "[1, 3]", x: 3 }, verdict: "run", fit: WITH_DIFF,
      scene: {
        ...frame(1, 3),
        ...diffRow(START, { d1: { ...active, fx: { type: "hop", delay: 180 } } }),
        ...output(), ...calc("diff[1] += 3"),
      },
    },
    {
      title: { vi: "Dừng sau cuối đoạn", en: "Stop after the range" }, kind: "step",
      body: {
        vi: "Ô 3 vẫn nhận +3, nên đặt mốc dừng ở ô kế tiếp bằng <code>diff[4] −= 3</code>. Khi quét đến ô 4, mốc này triệt tiêu phần +3 đã ghi ở ô 1.",
        en: "Index 3 still gets +3, so put the stop marker at the next index with <code>diff[4] −= 3</code>. At index 4, it cancels the +3 started at index 1.",
      },
      lines: [3, 4], watch: { range: "[1, 3]", x: 3 }, verdict: "run", fit: WITH_DIFF,
      scene: {
        ...frame(1, 3),
        ...diffRow(AFTER_FIRST, { d1: active, d4: { ...stop, fx: { type: "hop", delay: 180 } } }),
        ...output(), ...calc("diff[4] −= 3"),
      },
    },
    {
      title: { vi: "Ghi lần cộng thứ hai", en: "Record the second update" }, kind: "step",
      body: {
        vi: "Với đoạn <code>[3, 5]</code>, ghi <code>diff[3] += 2</code> và <code>diff[6] −= 2</code>. Ô phụ số 6 nằm ngay sau mảng, nên vẫn ghi được mốc dừng khi đoạn chạm ô cuối.",
        en: "For <code>[3, 5]</code>, record <code>diff[3] += 2</code> and <code>diff[6] −= 2</code>. The extra entry at index 6 holds the stop marker when the range reaches the last element.",
      },
      lines: [2, 3, 4, 6], watch: { range: "[3, 5]", x: 2 }, verdict: "run", fit: WITH_DIFF,
      scene: {
        ...frame(3, 5),
        ...diffRow(DIFF, {
          d3: { ...active, fx: { type: "hop", delay: 180 } },
          d6: { ...stop, o: 1, fx: { type: "hop", delay: 320 } },
        }),
        ...output(), ...calc("diff[3] += 2, diff[6] −= 2"),
      },
    },
    {
      title: { vi: "Cộng dồn qua phần giao", en: "Sweep through the overlap" }, kind: "step",
      body: {
        vi: "Quét từ ô 0, mỗi lần cộng <code>diff[i]</code> vào <code>carry</code>. Đến ô 3, hai đoạn giao nhau nên <code>carry = 3 + 2 = 5</code>. Từ <code>a[3] = 1</code> ta được <code>out[3] = 6</code>.",
        en: "Sweep from index 0 and add <code>diff[i]</code> to <code>carry</code> at each step. Both ranges cover index 3, so <code>carry = 3 + 2 = 5</code>. With <code>a[3] = 1</code>, we get <code>out[3] = 6</code>.",
      },
      lines: [8, 9, 10, 11, 12], watch: { i: 3, carry: 5, out: 6 }, verdict: "run", fit: ALL,
      scene: { a3: active, ...diffRow(DIFF, { d3: active }), ...output(3, { out3: hop }), ...calc("out[3] = 1 + (3 + 2) = 6") },
    },
    {
      title: { vi: "Qua mốc dừng đầu tiên", en: "Pass the first stop" }, kind: "step",
      body: {
        vi: "Đến ô 4, <code>diff[4] = −3</code> làm <code>carry</code> giảm từ 5 xuống 2. Chỉ lần cộng thứ hai còn hiệu lực, nên <code>out[4] = 5 + 2 = 7</code>.",
        en: "At index 4, <code>diff[4] = −3</code> drops <code>carry</code> from 5 to 2. Only the second update still applies, so <code>out[4] = 5 + 2 = 7</code>.",
      },
      lines: [10, 11, 12], watch: { i: 4, carry: 2, out: 7 }, verdict: "run", fit: ALL,
      scene: { a4: active, ...diffRow(DIFF, { d4: stop }), ...output(4, { out4: hop }), ...calc("out[4] = 5 + (5 − 3) = 7") },
    },
    {
      title: { vi: "Hoàn tất mảng kết quả", en: "Finish the result" }, kind: "answer",
      body: {
        vi: "Ở ô 5, <code>diff[5] = 0</code> nên vẫn cộng 2 và được <code>out[5] = 11</code>. Vòng lặp dừng trước ô phụ 6. Mảng cuối là <code>[3, 4, 7, 6, 7, 11]</code>.",
        en: "At index 5, <code>diff[5] = 0</code>, so the addition stays at 2 and <code>out[5] = 11</code>. The loop stops before the extra entry at index 6. The final array is <code>[3, 4, 7, 6, 7, 11]</code>.",
      },
      lines: [10, 11, 12], watch: { i: 5, carry: 2, out: 11 }, verdict: "ac", fit: ALL,
      scene: { a5: active, ...diffRow(DIFF, { d5: active }), ...output(5, { out5: hop }), ...calc("out[5] = 9 + 2 = 11", true) },
    },
    {
      title: { vi: "Hai mốc, một lượt", en: "Two markers, one pass" }, kind: "recap",
      body: {
        vi: "Mỗi lần cộng đoạn góp đúng <code>x</code> vào tổng dồn từ <code>l</code> đến <code>r</code> vì hai mốc triệt tiêu nhau ở <code>r + 1</code>. Ghi q lần cập nhật rồi quét một lượt tốn O(n + q) thời gian và O(n) bộ nhớ.",
        en: "Each update contributes exactly <code>x</code> to the running sum from <code>l</code> through <code>r</code> because its markers cancel at <code>r + 1</code>. Recording q updates and sweeping once takes O(n + q) time and O(n) space.",
      },
      note: {
        vi: "Trong CSES 1651, truy vấn xen kẽ với cập nhật, nên dùng Fenwick tree để lấy tổng prefix của <code>diff</code> mà không phải quét lại.",
        en: "CSES 1651 interleaves queries and updates. A Fenwick tree finds the prefix sum of <code>diff</code> without rerunning the sweep.",
      },
      lines: [3, 4, 11, 12], watch: { i: 5, carry: 2 }, verdict: "ac", fit: ALL,
      scene: { ...diffRow(), ...output(5), ...calc("out = [3, 4, 7, 6, 7, 11]", true, 0) },
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  scene.add("win", { shape: shapes.frame({ h: 73, top: -54 }), layer: "back", o: 0 });
  scene.add("labA", { shape: shapes.pill({ text: "a" }), x: -1.1, z: 0.17 });
  scene.add("labD", { shape: shapes.pill({ text: "diff" }), x: -1.1, y: DIFF_Y, z: 0.17, o: 0 });
  scene.add("labOut", { shape: shapes.pill({ text: "out" }), x: -1.1, y: OUT_Y, z: 0.17, o: 0 });
  A.forEach((v, i) => {
    scene.add(`a${i}`, { shape: shapes.block({ label: v, sub: i, h: 44 }), x: i, shadow: true });
    scene.add(`out${i}`, { shape: shapes.block({ label: "?", sub: i, h: 44 }), x: i, y: OUT_Y, o: 0 });
  });
  DIFF.forEach((_, i) => {
    scene.add(`d${i}`, { shape: shapes.block({ label: "0", sub: i, h: 44 }), x: i, y: DIFF_Y, o: 0 });
  });
  scene.add("calc", { shape: shapes.pill(), x: 2.5, y: DIFF_Y + 2.25, o: 0 });
}
