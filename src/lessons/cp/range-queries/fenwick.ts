import type { Lesson, SceneMap } from "../../../lib/types";

const A = [0, 3, 2, 4, 5, 1, 1, 5, 3];
const N = A.length - 1;
const I = A.slice(1).map((_, i) => i + 1);
const U = 51;
const L = 3, R = 7, NEW = 1;
const DELTA = NEW - A[L];
const low = (i: number) => i & -i;
const parent = (i: number) => i + low(i);
const start = (i: number) => i - low(i) + 1;
const edges = I.filter((i) => parent(i) <= N);
const tree = (processed: number) => {
  const bit = [...A];
  edges.filter((i) => i <= processed).forEach((i) => { bit[parent(i)] += bit[i]; });
  return bit;
};

const BIT = tree(N);
const UPDATED = [...BIT];
const UPDATE_PATH: number[] = [];
for (let i = L; i <= N; i = parent(i)) {
  UPDATE_PATH.push(i);
  UPDATED[i] += DELTA;
}
const prefix = (i: number) => {
  const path: number[] = [];
  for (; i > 0; i -= low(i)) path.push(i);
  return path;
};
const RIGHT_PATH = prefix(R);
const LEFT_PATH = prefix(L - 1);
const sum = (path: number[]) => path.reduce((total, i) => total + UPDATED[i], 0);
const RIGHT_SUM = sum(RIGHT_PATH), LEFT_SUM = sum(LEFT_PATH), RESULT = RIGHT_SUM - LEFT_SUM;
const node = (i: number) => `bit-${i}`;

interface Picture {
  bit?: number[];
  updated?: boolean;
  active?: number[];
  good?: number[];
  cut?: number[];
  showEdges?: number[];
  activeEdges?: number[];
  walk?: boolean;
  range?: boolean;
  formulas?: string[];
}

function picture({
  bit, updated = false, active = [], good = [], cut = [], showEdges = [], activeEdges = [],
  walk = false, range = false, formulas = [],
}: Picture = {}): SceneMap {
  const scene: SceneMap = { bit: { o: bit ? 1 : 0 } };
  I.forEach((i) => {
    scene[`a-${i}`] = {
      text: String(updated && i === L ? NEW : A[i]),
      cls: range && i >= L && i <= R ? "is-good" : active.includes(i) ? "is-active" : "",
    };
    scene[node(i)] = {
      text: bit ? String(bit[i]) : "",
      o: bit ? 1 : 0,
      cls: good.includes(i) ? "is-good" : cut.includes(i) ? "is-bad" : active.includes(i) ? "is-active" : "",
    };
  });
  edges.forEach((i) => {
    const focused = activeEdges.includes(i);
    scene[`edge-${i}`] = {
      p: showEdges.includes(i) ? 1 : 0,
      o: focused ? 1 : 0.32,
      cls: focused ? "v-eq" : "",
      ...(focused ? { from: { p: 0 }, dur: 520 } : {}),
    };
  });
  RIGHT_PATH.slice(0, -1).forEach((_, i) => {
    scene[`walk-${i}`] = { p: walk ? 1 : 0, cls: "v-eq", ...(walk ? { from: { p: 0 }, delay: 120 * i, dur: 450 } : {}) };
  });
  for (let i = 0; i < 2; i++) {
    const text = formulas[i] ?? "";
    scene[`calc-${i}`] = { text, o: text ? 1 : 0, cls: range ? "v-eq" : "" };
  }
  return scene;
}

const query: Picture = { bit: UPDATED, updated: true, showEdges: edges, good: RIGHT_PATH, walk: true };
const answer: Picture = {
  ...query,
  cut: LEFT_PATH,
  range: true,
  formulas: [`prefix(7) − prefix(2)`, `${RIGHT_SUM} − ${LEFT_SUM} = ${RESULT}`],
};

export const lesson: Lesson = {
  track: "cp",
  topic: "range-queries",
  slug: "fenwick",
  title: { vi: "Cây Fenwick (BIT)", en: "Fenwick tree" },
  added: "2026-11-27",
  summary: {
    vi: "Mỗi ô BIT giữ tổng một đoạn có độ dài bằng bit 1 thấp nhất của chỉ số. Dùng bit đó để cập nhật và hỏi tổng nhanh.",
    en: "Each BIT entry sums a block whose length is the index's lowest set bit. That bit also guides updates and queries.",
  },
  level: "medium",
  minutes: 9,
  time: "O(n + q log n)",
  memory: "O(n)",
  goal: { vi: "Đổi <b>a[3] = 1</b>, rồi tính tổng <b>a[3..7]</b>", en: "Set <b>a[3] = 1</b>, then sum <b>a[3..7]</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">vector</span>&lt;<span class="kw">long long</span>&gt; bit(a.begin(), a.end()); <span class="cm">// a[1..n]</span>',
    '<span class="kw">for</span> (<span class="kw">int</span> i = 1; i &lt;= n; ++i) {',
    '  <span class="kw">int</span> p = i + (i &amp; -i);',
    '  <span class="kw">if</span> (p &lt;= n) bit[p] += bit[i];',
    '}',
    '<span class="kw">auto</span> set = [&amp;](<span class="kw">int</span> i, <span class="kw">long long</span> value) {',
    '  <span class="kw">long long</span> delta = value - a[i]; a[i] = value;',
    '  <span class="kw">for</span> (; i &lt;= n; i += i &amp; -i) bit[i] += delta;',
    '};',
    '<span class="kw">auto</span> prefix = [&amp;](<span class="kw">int</span> i) {',
    '  <span class="kw">long long</span> s = 0;',
    '  <span class="kw">for</span> (; i &gt; 0; i -= i &amp; -i) s += bit[i];',
    '  <span class="kw">return</span> s;',
    '}; <span class="cm">// sum(l, r) = prefix(r) - prefix(l - 1)</span>',
  ],
  watch: [
    { key: "i", label: "i" },
    { key: "low", label: "i & −i" },
    { key: "path", label: { vi: "đường đi", en: "path" } },
    { key: "value", label: { vi: "giá trị", en: "value" } },
  ],
  practice: [
    { src: "CSES 1648", name: "Dynamic Range Sum Queries", lv: "★☆☆", url: "https://cses.fi/problemset/task/1648" },
    { src: "LeetCode 307", name: "Range Sum Query - Mutable", lv: "★★☆", url: "https://leetcode.com/problems/range-sum-query-mutable/" },
  ],
  sceneOptions: { unit: U, view: [-74, -135, 476, 487] },
  legend: [
    { cls: "acc", label: { vi: "ô đang xét", en: "entry in use" } },
    { cls: "ac", label: { vi: "ô đã tính hoặc đoạn được cộng", en: "computed entry or added block" } },
    { cls: "wa", label: { vi: "prefix bị trừ", en: "subtracted prefix" } },
  ],
  entrance: I.map((i) => `a-${i}`),
  steps: [
    {
      title: { vi: "Tổng khi mảng đổi", en: "Sum a changing array" }, kind: "problem",
      body: {
        vi: "Mảng đánh số từ 1. Ta đổi <code>a[3]</code> từ 4 thành 1, rồi hỏi tổng từ 3 đến 7. Quét từng phần tử có thể tốn O(n) mỗi lần hỏi, còn sửa bảng prefix sum có thể tốn O(n) mỗi lần cập nhật.",
        en: "The array is one-indexed. Change <code>a[3]</code> from 4 to 1, then sum indices 3 through 7. Scanning can cost O(n) per query, and repairing a prefix-sum table can cost O(n) per update.",
      },
      lines: [], watch: { i: L, value: "4 → 1" }, verdict: "run", fit: "all",
      scene: picture({ active: [L] }),
    },
    {
      title: { vi: "Xác định đoạn phụ trách", en: "Find each covered block" }, kind: "concept",
      body: {
        vi: "Mỗi ô <code>bit[i]</code> khởi đầu bằng <code>a[i]</code>. Nhãn dưới ô chỉ đoạn mà ô sẽ giữ tổng sau khi dựng cây: đoạn kết thúc ở <code>i</code>, dài <code>i &amp; -i</code>. Chẳng hạn 6 có dạng nhị phân 110, nên bit 1 thấp nhất có giá trị 2 và <code>bit[6]</code> phụ trách <code>[5, 6]</code>.",
        en: "Each <code>bit[i]</code> starts with <code>a[i]</code>. Its caption shows the block it will sum once built: ending at <code>i</code>, with length <code>i &amp; -i</code>. For example, 6 is binary 110, so its lowest set bit has value 2 and <code>bit[6]</code> covers <code>[5, 6]</code>.",
      },
      lines: [1, 3], watch: { i: 6, low: 2 }, verdict: "run", fit: "all",
      scene: picture({ bit: A, active: [6], formulas: ["6 & −6 = 2", "bit[6] → [5, 6]"] }),
    },
    {
      title: { vi: "Gộp nửa đầu", en: "Merge the first half" }, kind: "step",
      body: {
        vi: "Duyệt từ trái sang phải, mỗi ô chuyển tổng đang giữ cho <code>p = i + (i &amp; -i)</code>. Ô 1 gửi 3 cho ô 2, rồi ô 2 gửi 5 và ô 3 gửi 4 cho ô 4. Ô 4 cộng thêm giá trị sẵn có là 5, thành 14.",
        en: "Scan left to right, passing each accumulated total to <code>p = i + (i &amp; -i)</code>. Entry 1 sends 3 to 2, then entry 2 sends 5 and entry 3 sends 4 to 4. Entry 4 adds its own 5 to reach 14.",
      },
      lines: [2, 3, 4], watch: { i: 3, low: 1, path: "1 → 2 → 4 · 3 → 4", value: 14 }, verdict: "run", fit: "all",
      scene: picture({
        bit: tree(3), good: [2, 4], showEdges: [1, 2, 3], activeEdges: [1, 2, 3],
        formulas: ["bit[2] = 3 + 2 = 5", "bit[4] = 5 + 4 + 5 = 14"],
      }),
    },
    {
      title: { vi: "Gộp đến ô cuối", en: "Merge into the last entry" }, kind: "step",
      body: {
        vi: "Ô 5 gửi 1 cho ô 6, nên ô 6 giữ tổng 2 của <code>[5, 6]</code>. Ô 8 nhận 14 từ ô 4, 2 từ ô 6 và 5 từ ô 7. Cộng thêm <code>a[8] = 3</code> được 24 cho cả mảng.",
        en: "Entry 5 sends 1 to 6, so entry 6 holds 2 for <code>[5, 6]</code>. Entry 8 receives 14 from 4, 2 from 6, and 5 from 7. Adding <code>a[8] = 3</code> gives 24 for the whole array.",
      },
      lines: [2, 3, 4], watch: { i: 8, low: 8, value: 24 }, verdict: "run", fit: "all",
      scene: picture({
        bit: BIT, good: [6, 8], showEdges: edges, activeEdges: [4, 5, 6, 7],
        formulas: ["bit[6] = 1 + 1 = 2", "bit[8] = 14 + 2 + 5 + 3 = 24"],
      }),
    },
    {
      title: { vi: "Truyền phần chênh lệch", en: "Propagate the change" }, kind: "step",
      body: {
        vi: "Đổi 4 thành 1 tức là cộng <code>delta = −3</code>. Dùng <code>i += i &amp; -i</code> đi qua 3 → 4 → 8 rồi dừng ở 16: ba ô đó giữ các đoạn chứa vị trí 3. Tổng của chúng lần lượt đổi thành 1, 11 và 21.",
        en: "Changing 4 to 1 means adding <code>delta = −3</code>. Use <code>i += i &amp; -i</code> to visit 3 → 4 → 8 and stop at 16. Those three entries cover index 3, so their totals become 1, 11, and 21.",
      },
      lines: [6, 7, 8], watch: { path: "3 → 4 → 8 → 16", value: DELTA }, verdict: "run", fit: "all",
      scene: picture({
        bit: UPDATED, updated: true, active: UPDATE_PATH, showEdges: edges, activeEdges: [3, 4],
        formulas: ["(4, 14, 24) − 3", "= (1, 11, 21)"],
      }),
    },
    {
      title: { vi: "Thu từng khối prefix", en: "Collect the prefix blocks" }, kind: "step",
      body: {
        vi: "Để tính <code>prefix(7)</code>, lấy tổng khối cuối rồi nhảy lùi qua khối bằng <code>i -= i &amp; -i</code>. Đường 7 → 6 → 4 → 0 lần lượt lấy <code>[7, 7]</code>, <code>[5, 6]</code>, <code>[1, 4]</code>, được <code>5 + 2 + 11 = 18</code>.",
        en: "For <code>prefix(7)</code>, take the final block and jump back past it with <code>i -= i &amp; -i</code>. The path 7 → 6 → 4 → 0 takes <code>[7, 7]</code>, <code>[5, 6]</code>, and <code>[1, 4]</code> in turn, giving <code>5 + 2 + 11 = 18</code>.",
      },
      lines: [10, 11, 12, 13], watch: { path: "7 → 6 → 4 → 0", value: RIGHT_SUM }, verdict: "run", fit: "all",
      scene: picture({ ...query, formulas: [`prefix(7) = ${RIGHT_PATH.map((i) => UPDATED[i]).join(" + ")} = ${RIGHT_SUM}`] }),
    },
    {
      title: { vi: "Trừ prefix bên trái", en: "Subtract the left prefix" }, kind: "answer",
      body: {
        vi: "Tổng đến 2 chỉ cần <code>bit[2] = 5</code>, vì từ 2 ta nhảy thẳng về 0. Trừ đoạn <code>[1, 2]</code> khỏi <code>[1, 7]</code> để lấy đúng tổng <code>[3, 7]</code>: <code>18 − 5 = 13</code>.",
        en: "The sum through index 2 is just <code>bit[2] = 5</code>, since 2 jumps straight to 0. Subtract <code>[1, 2]</code> from <code>[1, 7]</code> to get the sum of <code>[3, 7]</code>: <code>18 − 5 = 13</code>.",
      },
      lines: [12, 13, 14], watch: { path: "2 → 0", value: RESULT }, verdict: "ac", fit: "all",
      scene: picture(answer),
    },
    {
      title: { vi: "Hai hướng, cùng lowbit", en: "One lowbit, two directions" }, kind: "recap",
      body: {
        vi: "Cộng lowbit để đến khối cha chứa vị trí vừa đổi. Trừ lowbit để bỏ khối cuối của prefix, nên mỗi phần tử được cộng đúng một lần. Dựng cây mất O(n) thời gian và bộ nhớ, mỗi lần cập nhật hay truy vấn mất O(log n).",
        en: "Add the lowbit to reach the parent block covering the changed index. Subtract it to remove the last block of a prefix, so every entry contributes once. Building takes O(n) time and space, and updates and queries take O(log n) each.",
      },
      lines: [3, 8, 12, 14], watch: { value: RESULT }, verdict: "ac", fit: "all",
      scene: picture(answer),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("array", { shape: shapes.pill({ text: "a" }), x: -0.86, y: 7.93 });
  scene.add("bit", { shape: shapes.pill({ text: "bit", pad: 6 }), x: -0.86, y: 5.73, o: 0 });
  I.forEach((i) => {
    const x = i - 1;
    const y = 5.85 - 1.95 * Math.log2(low(i));
    scene.add(`a-${i}`, { shape: shapes.block({ label: A[i], sub: i, w: 37, h: 30, depth: 4, r: 6 }), x, y: 8.05 });
    scene.add(node(i), {
      shape: shapes.block({ label: "", sub: `[${start(i)},${i}]`, w: 40, h: 29, depth: 4, r: 6 }), x, y, o: 0,
    });
  });
  edges.forEach((i) => scene.link(`edge-${i}`, { from: node(i), to: node(parent(i)), bend: -0.64 }));
  RIGHT_PATH.slice(0, -1).forEach((i, j) => {
    scene.link(`walk-${j}`, { from: node(i), to: node(RIGHT_PATH[j + 1]), bend: -1.38 });
  });
  for (let i = 0; i < 2; i++) {
    scene.add(`calc-${i}`, { shape: shapes.pill(), x: 3.45, y: 10.10 + 1.14 * i, o: 0 });
  }
}
