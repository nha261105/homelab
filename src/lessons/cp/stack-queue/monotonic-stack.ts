import type { Lesson, SceneEntry, SceneMap } from "../../../lib/types";

const A = [2, 5, 1, 4, 4, 3];
const ANS = [-1, 0, -1, 2, 2, 2];
const U = 52;
const STACK_X = 2.5;
const STACK_Y = 4.92;
const ANSWER_Y = 7.3;
const GAP = 1.2;
const FIT = ["a", "a5", "ans", "ans5"];

const active: SceneEntry = { cls: "is-active" };
const good: SceneEntry = { cls: "is-good" };

function picture(i: number, stack: number[], popped: number[] = []): SceneMap {
  const scene: SceneMap = {};
  A.forEach((_, j) => {
    scene[`a${j}`] = j === i ? active : j === ANS[i] ? good : popped.includes(j) ? { cls: "is-bad" } : j < i ? { cls: "is-out" } : {};
    scene[`ans${j}`] = j <= i
      ? { cls: "is-good", o: 1, ...(j === i ? { from: { o: 0, z: 0.35 }, delay: 520, dur: 340, ease: "out" } : {}) }
      : {};
  });
  stack.forEach((j, depth) => {
    scene[`st${j}`] = {
      x: STACK_X, y: STACK_Y, z: depth * GAP, o: 1, cls: j === i ? "is-active" : "",
      ...(j === i ? { from: { x: j, y: 0, z: 0, o: 0.4 }, arc: 0.24, delay: popped.length * 190 + 140, dur: 520 } : {}),
    };
  });
  popped.forEach((j, rank) => {
    const z = (stack.length + popped.length - rank - 2) * GAP;
    scene[`st${j}`] = {
      x: STACK_X + 0.8, y: STACK_Y, z: z + 0.22, o: 0, cls: "is-bad",
      from: { x: STACK_X, y: STACK_Y, z, o: 1 },
      delay: rank * 190, dur: 280, ease: "out",
    };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "stack-queue", slug: "monotonic-stack",
  title: { vi: "Stack đơn điệu", en: "Monotonic stack" },
  added: "2026-11-27",
  summary: {
    vi: "Giữ các ứng viên theo thứ tự giá trị tăng dần để tìm phần tử nhỏ hơn gần nhất bên trái.",
    en: "Keep candidates in increasing value order to find the nearest smaller element on the left.",
  },
  level: "medium", minutes: 8, time: "O(n)", memory: "O(n)",
  goal: { vi: "Mỗi ô tìm chỉ số gần nhất bên trái có giá trị <b>nhỏ hơn</b>", en: "Find each cell's nearest <b>strictly smaller</b> index on the left" },
  codeLang: "C++17",
  code: [
    '<span class="kw">vector</span>&lt;<span class="kw">int</span>&gt; ans(n, -1);',
    'stack&lt;<span class="kw">int</span>&gt; st;',
    '<span class="kw">for</span> (<span class="kw">int</span> i = 0; i &lt; n; ++i) {',
    '  <span class="kw">while</span> (!st.empty() &amp;&amp; a[st.top()] &gt;= a[i])',
    '    st.pop();',
    '  <span class="kw">if</span> (!st.empty()) ans[i] = st.top();',
    '  st.push(i);',
    '}',
  ],
  watch: [
    { key: "i", label: "i" },
    { key: "st", label: { vi: "chỉ số trong st (đáy → đỉnh)", en: "indices in st (bottom → top)" } },
    { key: "ans", label: "ans[i]" },
  ],
  practice: [
    { src: "CSES 1645", name: "Nearest Smaller Values", lv: "★★☆", url: "https://cses.fi/problemset/task/1645" },
    { src: "LeetCode 739", name: "Daily Temperatures", lv: "★★☆", url: "https://leetcode.com/problems/daily-temperatures/" },
    { src: "LeetCode 84", name: "Largest Rectangle in Histogram", lv: "★★★", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
  ],
  sceneOptions: { unit: U },
  legend: [
    { cls: "acc", label: { vi: "phần tử đang xét", en: "current element" } },
    { cls: "wa", label: { vi: "bị lấy khỏi stack", en: "popped from stack" } },
    { cls: "ac", label: { vi: "ứng viên gần nhất / kết quả", en: "nearest candidate / result" } },
  ],
  entrance: A.map((_, i) => `a${i}`),
  steps: [
    {
      title: { vi: "Nhỏ hơn gần nhất", en: "Find the nearest smaller" }, kind: "problem",
      body: {
        vi: "Với mỗi ô trong <code>[2, 5, 1, 4, 4, 3]</code>, tìm chỉ số gần nhất bên trái có giá trị nhỏ hơn hẳn. Dùng chỉ số từ 0 và ghi <code>−1</code> nếu không có. Quét ngược từ từng ô có thể tốn O(n²).",
        en: "For each cell in <code>[2, 5, 1, 4, 4, 3]</code>, find the nearest strictly smaller index to its left. Use zero-based indices and write <code>−1</code> when none exists. Scanning back from every cell can take O(n²).",
      },
      lines: [], watch: {}, verdict: "run", fit: FIT, scene: picture(-1, []),
    },
    {
      title: { vi: "Đẩy ứng viên đầu tiên", en: "Push the first candidate" }, kind: "concept",
      body: {
        vi: "Bên trái <code>a[0] = 2</code> chưa có gì, nên <code>ans[0] = −1</code>. Đẩy chỉ số 0 vào <code>st</code>; ô stack hiện cả giá trị lẫn chỉ số.",
        en: "Nothing is left of <code>a[0] = 2</code>, so <code>ans[0] = −1</code>. Push index 0 onto <code>st</code>; each stack cell shows its value and index.",
      },
      lines: [1, 2, 6, 7], watch: { i: 0, st: "[0]", ans: -1 }, verdict: "run", fit: FIT, scene: picture(0, [0]),
    },
    {
      title: { vi: "Lấy ứng viên trên đỉnh", en: "Use the stack top" }, kind: "step",
      body: {
        vi: "<code>a[0] = 2</code> nhỏ hơn <code>a[1] = 5</code>, nên đỉnh 0 là đáp án. Đẩy 1 lên trên, ta có các giá trị tăng dần <code>2, 5</code> từ đáy lên đỉnh.",
        en: "<code>a[0] = 2</code> is smaller than <code>a[1] = 5</code>, so the top index 0 is the answer. Push 1 on top to get increasing values <code>2, 5</code> from bottom to top.",
      },
      lines: [4, 6, 7], watch: { i: 1, st: "[0, 1]", ans: 0 }, verdict: "run", fit: FIT, scene: picture(1, [0, 1]),
    },
    {
      title: { vi: "Loại cả hai số lớn", en: "Pop both larger values" }, kind: "step",
      body: {
        vi: "<code>a[2] = 1</code> làm bật 5 rồi 2 khỏi đỉnh. Stack rỗng nên <code>ans[2] = −1</code>, sau đó đẩy chỉ số 2 vào.",
        en: "<code>a[2] = 1</code> pops 5 and then 2. The stack is empty, so <code>ans[2] = −1</code>, then index 2 goes on the stack.",
      },
      note: {
        vi: "Với mọi ô về sau mà 5 hoặc 2 có thể làm đáp án, số 1 cũng nhỏ hơn ô đó và còn ở gần hơn.",
        en: "For any later cell where 5 or 2 would qualify, 1 also qualifies and is closer.",
      },
      lines: [4, 5, 6, 7], watch: { i: 2, st: "[2]", ans: -1 }, verdict: "run", fit: FIT, scene: picture(2, [2], [1, 0]),
    },
    {
      title: { vi: "Giữ lại số nhỏ", en: "Keep the smaller value" }, kind: "step",
      body: {
        vi: "Gặp <code>a[3] = 4</code>, giữ 1 ở đỉnh vì <code>1 &lt; 4</code>. Ghi <code>ans[3] = 2</code>, rồi đẩy chỉ số 3.",
        en: "For <code>a[3] = 4</code>, keep 1 on top because <code>1 &lt; 4</code>. Write <code>ans[3] = 2</code>, then push index 3.",
      },
      lines: [4, 6, 7], watch: { i: 3, st: "[2, 3]", ans: 2 }, verdict: "run", fit: FIT, scene: picture(3, [2, 3]),
    },
    {
      title: { vi: "Bỏ cả giá trị bằng nhau", en: "Pop equal values too" }, kind: "step",
      body: {
        vi: "<code>a[4] = 4</code> bằng <code>a[3]</code>, nên điều kiện <code>&gt;=</code> loại chỉ số 3. Đỉnh mới là chỉ số 2 với giá trị 1; ghi <code>ans[4] = 2</code> rồi đẩy 4.",
        en: "<code>a[4] = 4</code> equals <code>a[3]</code>, so the <code>&gt;=</code> test pops index 3. The new top is index 2 with value 1. Write <code>ans[4] = 2</code> and push index 4.",
      },
      lines: [4, 5, 6, 7], watch: { i: 4, st: "[2, 4]", ans: 2 }, verdict: "run", fit: FIT, scene: picture(4, [2, 4], [3]),
    },
    {
      title: { vi: "Hoàn tất hàng đáp án", en: "Finish the answer row" }, kind: "answer",
      body: {
        vi: "Gặp <code>a[5] = 3</code>, lấy số 4 ở vị trí 4 ra. Giá trị 1 ở vị trí 2 trở lại đỉnh, nên <code>ans[5] = 2</code> và dãy chỉ số là <code>[−1, 0, −1, 2, 2, 2]</code>.",
        en: "At <code>a[5] = 3</code>, pop the 4 at index 4. Value 1 at index 2 is back on top, so <code>ans[5] = 2</code> and the index sequence is <code>[−1, 0, −1, 2, 2, 2]</code>.",
      },
      lines: [4, 5, 6, 7], watch: { i: 5, st: "[2, 5]", ans: 2 }, verdict: "ac", fit: FIT, scene: picture(5, [2, 5], [4]),
    },
    {
      title: { vi: "Mỗi chỉ số vào một lần", en: "Each index enters once" }, kind: "recap",
      body: {
        vi: "Stack giữ ứng viên theo cả thứ tự chỉ số và thứ tự giá trị tăng dần. Sau khi bỏ các giá trị lớn hơn hoặc bằng, đỉnh là chỉ số gần nhất còn đủ điều kiện. Mỗi chỉ số vào và ra tối đa một lần, nên tốn O(n) thời gian và O(n) bộ nhớ.",
        en: "The stack keeps candidates in increasing index and value order. After popping all values at least as large as the current one, the top is the closest qualifying index. Each index enters once and leaves at most once, giving O(n) time and O(n) space.",
      },
      lines: [3, 4, 5, 6, 7], watch: { st: "[2, 5]" }, verdict: "ac", fit: FIT,
      scene: {
        ...picture(5, [2, 5]),
        a2: {}, a5: {}, ans5: { ...good, o: 1 },
        st5: { x: STACK_X, y: STACK_Y, z: GAP, o: 1 },
      },
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  scene.add("base", { shape: shapes.frame({ h: 128, top: -103 }), layer: "back", x: STACK_X, y: STACK_Y, w: 59 });
  scene.add("a", { shape: shapes.pill({ text: "a" }), x: -0.95 });
  scene.add("ans", { shape: shapes.pill({ text: "ans" }), x: -0.95, y: ANSWER_Y });
  scene.add("stack", { shape: shapes.pill({ text: "st" }), x: 1.45, y: STACK_Y });
  A.forEach((value, i) => {
    scene.add(`a${i}`, { shape: shapes.block({ label: value, sub: i, w: 42, h: 36 }), x: i, shadow: true });
    scene.add(`st${i}`, { shape: shapes.block({ label: value, sub: i, w: 42, h: 28 }), x: i, o: 0 });
    scene.add(`ans${i}`, { shape: shapes.block({ label: ANS[i] === -1 ? "−1" : ANS[i], w: 42, h: 30 }), x: i, y: ANSWER_Y, o: 0 });
  });
}
