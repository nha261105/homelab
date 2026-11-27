import type { Lesson, SceneMap } from "../../../lib/types";

const A = [4, 2, 1, 3, 5, 4];
const MAXIMA = [4, 3, 5, 5];
const K = 3;
const U = 52;
const DEQUE_Y = 2.9;
const ANSWER_Y = 5.55;
const FIT = ["a", "a5", "dq", "ans", "max3"];

function picture(
  r: number,
  deque: number[],
  outputs: number,
  { expired, popped = [], fresh }: { expired?: number; popped?: number[]; fresh?: number } = {},
): SceneMap {
  const l = Math.max(0, r - K + 1);
  const front = deque[0];
  const result = outputs > 0 && outputs === r - K + 2;
  const scene: SceneMap = {};
  A.forEach((_, i) => {
    scene[`a${i}`] = {
      cls: i === expired || popped.includes(i) ? "is-bad" : i === front && result ? "is-good" : i === r ? "is-active" : i < l ? "is-out" : "",
    };
  });
  if (r >= 0) {
    scene.win = { x: (l + r) / 2, w: (r - l) * U + 52, o: 1 };
  }
  deque.forEach((i, slot) => {
    scene[`d${i}`] = {
      x: slot, y: DEQUE_Y, o: 1,
      cls: slot === 0 && result ? "is-good" : i === fresh ? "is-active" : "",
      ...(i === fresh ? {
        from: { x: i, y: 0, z: 0, o: 0.4 }, arc: 0.32, delay: popped.length * 170 + 80, dur: 510,
      } : {}),
    };
  });
  if (expired !== undefined) {
    scene[`d${expired}`] = {
      x: -0.4, y: DEQUE_Y, z: 0.48, o: 0, cls: "is-bad",
      from: { x: 0, y: DEQUE_Y, z: 0, o: 1 }, dur: 360, ease: "out",
    };
  }
  popped.forEach((i, rank) => {
    const slot = deque.length + popped.length - rank - 2;
    scene[`d${i}`] = {
      x: slot + 0.4, y: DEQUE_Y, z: 0.42, o: 0, cls: "is-bad",
      from: { x: slot, y: DEQUE_Y, z: 0, o: 1 }, delay: rank * 170, dur: 310, ease: "out",
    };
  });
  MAXIMA.forEach((_, i) => {
    scene[`max${i}`] = i < outputs ? {
      o: 1, cls: "is-good",
      ...(result && i === outputs - 1 && fresh !== undefined ? {
        from: { o: 0, z: 0.32 }, delay: popped.length * 170 + 430, dur: 330, ease: "out",
      } : {}),
    } : {};
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "stack-queue", slug: "monotonic-deque",
  title: { vi: "Max trong cửa sổ trượt", en: "Sliding window maximum" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng deque để bỏ chỉ số hết hạn ở đầu và loại ứng viên yếu hơn ở cuối.",
    en: "Use a deque to expire old indices at the front and remove weaker candidates at the back.",
  },
  level: "hard", minutes: 9, time: "O(n)", memory: "O(k)",
  goal: { vi: "Tìm giá trị lớn nhất của mỗi cửa sổ dài <b>k = 3</b>", en: "Find the largest value in each window of length <b>k = 3</b>" },
  codeLang: "C++17",
  code: [
    'deque&lt;<span class="kw">int</span>&gt; q;',
    'vector&lt;<span class="kw">int</span>&gt; ans;',
    '<span class="kw">for</span> (<span class="kw">int</span> r = 0; r &lt; n; ++r) {',
    '  <span class="kw">int</span> l = r - k + 1;',
    '  <span class="kw">while</span> (!q.empty() &amp;&amp; q.front() &lt; l) q.pop_front();',
    '  <span class="kw">while</span> (!q.empty() &amp;&amp; a[q.back()] &lt;= a[r]) q.pop_back();',
    '  q.push_back(r);',
    '  <span class="kw">if</span> (l &gt;= 0) ans.push_back(a[q.front()]);',
    '}',
  ],
  watch: [
    { key: "window", label: "[l, r]" },
    { key: "q", label: { vi: "chỉ số trong q (đầu → cuối)", en: "indices in q (front → back)" } },
    { key: "max", label: "a[q.front()]" },
  ],
  practice: [
    { src: "CSES 1644", name: "Maximum Subarray Sum II", lv: "★★☆", url: "https://cses.fi/problemset/task/1644" },
    { src: "LeetCode 239", name: "Sliding Window Maximum", lv: "★★★", url: "https://leetcode.com/problems/sliding-window-maximum/" },
  ],
  sceneOptions: { unit: U },
  legend: [
    { cls: "acc", label: { vi: "cửa sổ / chỉ số mới", en: "window / new index" } },
    { cls: "wa", label: { vi: "chỉ số bị loại", en: "removed index" } },
    { cls: "ac", label: { vi: "max của cửa sổ", en: "window maximum" } },
  ],
  entrance: A.map((_, i) => `a${i}`),
  steps: [
    {
      title: { vi: "Max của từng cửa sổ", en: "Maximum of each window" }, kind: "problem",
      body: {
        vi: "Trượt cửa sổ dài 3 qua <code>[4, 2, 1, 3, 5, 4]</code> và ghi số lớn nhất trong mỗi cửa sổ. Quét lại cả <code>k</code> ô sau mỗi lần trượt tốn O(k) cho một cửa sổ.",
        en: "Slide a window of length 3 across <code>[4, 2, 1, 3, 5, 4]</code> and record the largest number in each window. Rescanning all <code>k</code> cells costs O(k) per window.",
      },
      lines: [], watch: {}, verdict: "run", fit: FIT, scene: picture(-1, [], 0),
    },
    {
      title: { vi: "Giữ ứng viên trong deque", en: "Keep candidates in a deque" }, kind: "concept",
      body: {
        vi: "Sau khi đọc 4 và 2, deque <code>q</code> giữ chỉ số <code>[0, 1]</code>, tương ứng với giá trị giảm dần <code>4, 2</code>. Code dùng <code>l = −1</code> ở lượt này nên cửa sổ chưa đủ 3 ô.",
        en: "After reading 4 and 2, deque <code>q</code> holds indices <code>[0, 1]</code>, whose values decrease as <code>4, 2</code>. The code has <code>l = −1</code> on this iteration, so the window has yet to reach three cells.",
      },
      lines: [1, 4, 6, 7], watch: { window: "[−1, 1]", q: "[0, 1]" }, verdict: "run", fit: FIT,
      scene: picture(1, [0, 1], 0, { fresh: 1 }),
    },
    {
      title: { vi: "Đọc max ở đầu", en: "Read the front maximum" }, kind: "step",
      body: {
        vi: "Thêm chỉ số 2 với giá trị 1 vào cuối, vì <code>2 &gt; 1</code>. Cửa sổ <code>[0, 2]</code> đã đủ 3 ô và <code>a[q.front()] = a[0] = 4</code> là max đầu tiên.",
        en: "Append index 2 with value 1 because <code>2 &gt; 1</code>. Window <code>[0, 2]</code> now has three cells, and <code>a[q.front()] = a[0] = 4</code> is the first maximum.",
      },
      lines: [6, 7, 8], watch: { window: "[0, 2]", q: "[0, 1, 2]", max: 4 }, verdict: "run", fit: FIT,
      scene: picture(2, [0, 1, 2], 1, { fresh: 2 }),
    },
    {
      title: { vi: "Bỏ đầu đã hết hạn", en: "Expire the front index" }, kind: "step",
      body: {
        vi: "Khi <code>r = 3</code>, biên trái tăng lên <code>l = 1</code>. Chỉ số 0 ở đầu đã ra khỏi cửa sổ nên gọi <code>pop_front()</code>, còn lại <code>[1, 2]</code> trước khi xét số 3.",
        en: "At <code>r = 3</code>, the left bound advances to <code>l = 1</code>. Front index 0 is outside the window, so <code>pop_front()</code> leaves <code>[1, 2]</code> before we process the new value 3.",
      },
      lines: [4, 5], watch: { window: "[1, 3]", q: "[1, 2]" }, verdict: "run", fit: FIT,
      scene: picture(3, [1, 2], 1, { expired: 0 }),
    },
    {
      title: { vi: "Loại ứng viên ở cuối", en: "Remove weaker back candidates" }, kind: "step",
      body: {
        vi: "Số 3 mới đến lớn hơn 1 rồi 2 ở cuối deque, nên lần lượt loại chỉ số 2 và 1. Thêm chỉ số 3, giờ nó ở đầu và max cửa sổ là 3.",
        en: "The incoming 3 is larger than the back values 1 and then 2, so pop indices 2 and 1. Append index 3. It is now at the front, giving a window maximum of 3.",
      },
      note: {
        vi: "Số 3 vào sau và lớn hơn cả hai, nên còn ở trong cửa sổ lâu hơn và luôn tốt hơn chúng khi tìm max.",
        en: "The 3 enters later and is larger than both, so it stays in the window longer and always beats them as a maximum.",
      },
      lines: [6, 7, 8], watch: { window: "[1, 3]", q: "[3]", max: 3 }, verdict: "run", fit: FIT,
      scene: picture(3, [3], 2, { popped: [2, 1], fresh: 3 }),
    },
    {
      title: { vi: "Số 5 thay số 3", en: "Five replaces three" }, kind: "step",
      body: {
        vi: "Với cửa sổ <code>[2, 4]</code>, chỉ số 3 vẫn còn hạn. Số 5 ở vị trí 4 lớn hơn 3, nên loại 3 ở cuối deque rồi thêm 4. Max mới là 5.",
        en: "In window <code>[2, 4]</code>, index 3 is still in range. Value 5 at index 4 beats 3, so pop index 3 from the back and append 4. The new maximum is 5.",
      },
      lines: [5, 6, 7, 8], watch: { window: "[2, 4]", q: "[4]", max: 5 }, verdict: "run", fit: FIT,
      scene: picture(4, [4], 3, { popped: [3], fresh: 4 }),
    },
    {
      title: { vi: "Giữ max ở đầu", en: "Keep the front maximum" }, kind: "answer",
      body: {
        vi: "Đến cửa sổ <code>[3, 5]</code>, số 4 ở vị trí 5 nhỏ hơn 5 nên chỉ được thêm vào cuối. Đầu deque vẫn là chỉ số 4 và cả dãy max là <code>[4, 3, 5, 5]</code>.",
        en: "In window <code>[3, 5]</code>, value 4 at index 5 is smaller than 5 and joins at the back. Index 4 stays at the front, so the full list of maxima is <code>[4, 3, 5, 5]</code>.",
      },
      lines: [6, 7, 8], watch: { window: "[3, 5]", q: "[4, 5]", max: 5 }, verdict: "ac", fit: FIT,
      scene: picture(5, [4, 5], 4, { fresh: 5 }),
    },
    {
      title: { vi: "Mỗi chỉ số ra một lần", en: "Each index leaves once" }, kind: "recap",
      body: {
        vi: "Các chỉ số tăng dần từ đầu đến cuối deque, còn giá trị giảm dần, nên đầu deque luôn cho max. Điều kiện <code>&lt;=</code> giữ chỉ số mới hơn khi hai giá trị bằng nhau. Mỗi chỉ số vào một lần, ra nhiều nhất một lần và deque chứa tối đa <code>k</code> chỉ số, nên tốn O(n) thời gian và O(k) bộ nhớ ngoài đáp án.",
        en: "Indices increase from front to back while values decrease, so the front always gives the maximum. The <code>&lt;=</code> test keeps the newer index when values tie. Each index enters once and leaves at most once, and the deque holds up to <code>k</code> indices, giving O(n) time and O(k) extra space excluding the output.",
      },
      lines: [5, 6, 7, 8], watch: { window: "[3, 5]", q: "[4, 5]", max: 5 }, verdict: "ac", fit: FIT,
      scene: picture(5, [4, 5], 4),
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  scene.add("win", { shape: shapes.frame({ h: 77, top: -48 }), layer: "back", o: 0 });
  scene.add("a", { shape: shapes.pill({ text: "a" }), x: -0.95 });
  scene.add("dq", { shape: shapes.pill({ text: "q" }), x: -0.95, y: DEQUE_Y });
  scene.add("ans", { shape: shapes.pill({ text: "ans" }), x: -0.95, y: ANSWER_Y });
  A.forEach((value, i) => {
    scene.add(`a${i}`, { shape: shapes.block({ label: value, sub: i, w: 42, h: 36 }), x: i, shadow: true });
    scene.add(`d${i}`, { shape: shapes.block({ label: value, sub: i, w: 42, h: 34 }), x: i, o: 0 });
  });
  MAXIMA.forEach((value, i) => {
    scene.add(`max${i}`, { shape: shapes.block({ label: value, sub: i, w: 42, h: 32 }), x: i, y: ANSWER_Y, o: 0 });
  });
}
