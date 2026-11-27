import type { Lesson, SceneMap } from "../../../lib/types";

const nodes = [
  { key: 2, p: 30 }, { key: 4, p: 90 }, { key: 6, p: 50 },
  { key: 7, p: 20 }, { key: 8, p: 70 },
];

type Placement = [x: number, y: number, parent?: number];
type Forest = Record<number, Placement>;

const original: Forest = {
  2: [-2.4, 2.65, 4], 4: [-1.1, 0], 6: [0.15, 5.3, 8],
  7: [1.4, 7.95, 6], 8: [2.65, 2.65, 4],
};
const split: Forest = {
  2: [-2.4, 2.65, 4], 4: [-1.1, 0], 6: [0.15, 2.65, 4],
  7: [1.4, 2.65, 8], 8: [2.65, 0],
};
const fit = [...nodes.map(({ key }) => `v${key}`), "calc"];

function picture(forest: Forest, focus: number[], formula: string, good = false, redraw: number[] = []): SceneMap {
  const bottom = Math.max(...Object.values(forest).map(([, y]) => y));
  const scene: SceneMap = {
    calc: { y: bottom + 2.45, text: formula, cls: good ? "v-eq" : "", o: 1 },
  };
  for (const { key } of nodes) {
    const [x, y, parent] = forest[key];
    const selected = focus.includes(key);
    scene[`v${key}`] = { x, y, cls: selected ? (good ? "is-good" : "is-active") : "" };
    scene[`e${key}`] = {
      ends: [`v${parent ?? (key === 4 ? 8 : 4)}`, `v${key}`],
      p: parent === undefined ? 0 : 1,
      ...(redraw.includes(key) ? { from: { p: 0 }, delay: 260, dur: 400 } : {}),
    };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "ds-adv",
  slug: "treap",
  title: { vi: "Treap", en: "Treap" },
  added: "2026-11-27",
  summary: {
    vi: "Kết hợp thứ tự khoá của BST với độ ưu tiên ngẫu nhiên của heap để tách và gộp cây.",
    en: "Combine BST key order with randomly assigned heap priorities to split and merge trees.",
  },
  level: "hard",
  minutes: 9,
  time: "O(log n) expected per operation",
  memory: "O(n)",
  goal: { vi: "Tách tại khoá <b>7</b>, rồi gộp hai cây", en: "Split at key <b>7</b>, then merge the two trees" },
  codeLang: "C++17",
  code: [
    '<span class="kw">struct</span> Node { int key; uint64_t p; Node *l = nullptr, *r = nullptr; };',
    'pair&lt;Node*, Node*&gt; split(Node* t, int x) {',
    '  <span class="kw">if</span> (!t) <span class="kw">return</span> {nullptr, nullptr};',
    '  <span class="kw">if</span> (t-&gt;key &lt; x) {',
    '    <span class="kw">auto</span> [a, b] = split(t-&gt;r, x); t-&gt;r = a;',
    '    <span class="kw">return</span> {t, b};',
    '  }',
    '  <span class="kw">auto</span> [a, b] = split(t-&gt;l, x); t-&gt;l = b;',
    '  <span class="kw">return</span> {a, t};',
    '}',
    'Node* merge(Node* a, Node* b) {',
    '  <span class="kw">if</span> (!a || !b) <span class="kw">return</span> a ? a : b;',
    '  <span class="kw">if</span> (a-&gt;p &gt; b-&gt;p) { a-&gt;r = merge(a-&gt;r, b); <span class="kw">return</span> a; }',
    '  b-&gt;l = merge(a, b-&gt;l); <span class="kw">return</span> b;',
    '}',
  ],
  watch: [
    { key: "x", label: "x" },
    { key: "path", label: { vi: "đường tách", en: "split path" } },
    { key: "roots", label: { vi: "gốc", en: "roots" } },
  ],
  practice: [
    { src: "CSES 1144", name: "Salary Queries", lv: "★★☆", url: "https://cses.fi/problemset/task/1144" },
    { src: "CSES 2072", name: "Cut and Paste", lv: "★★★", url: "https://cses.fi/problemset/task/2072" },
  ],
  sceneOptions: { unit: 48, view: [-160, -100, 330, 390] },
  legend: [
    { cls: "acc", label: { vi: "nút đang xét", en: "node in focus" } },
    { cls: "ac", label: { vi: "gốc sau khi gộp", en: "merged root" } },
  ],
  steps: [
    {
      title: { vi: "Tách theo khoá", en: "Split by key" }, kind: "problem",
      body: {
        vi: "Tách các khoá 2, 4, 6, 7, 8 thành hai nhóm tại <code>x = 7</code>, rồi gộp lại. Với mảng đã sắp xếp, tìm được biên nhanh nhưng mỗi lần chép ra hai mảng riêng vẫn tốn O(n).",
        en: "Split the keys 2, 4, 6, 7, 8 at <code>x = 7</code>, then join them again. A sorted array lets us find the boundary quickly, but copying into two separate arrays still takes O(n).",
      },
      lines: [], watch: { x: 7 }, verdict: "run", fit,
      scene: picture(original, [7], "key < 7 | key ≥ 7"),
    },
    {
      title: { vi: "Một cây, hai thứ tự", en: "One tree, two orders" }, kind: "concept",
      body: {
        vi: "Đọc trái–gốc–phải cho dãy tăng 2, 4, 6, 7, 8. Số <code>p</code> dưới mỗi khoá là độ ưu tiên lấy ngẫu nhiên. Ta dùng max-heap theo <code>p</code>, nên ở cạnh 4–8, độ ưu tiên của cha là 90 lớn hơn 70 của con.",
        en: "An inorder traversal gives the sorted keys 2, 4, 6, 7, 8. The <code>p</code> beneath each key is randomly assigned. Priorities form a max-heap, so on edge 4–8 the parent's priority 90 exceeds the child's 70.",
      },
      lines: [1], watch: { x: 7, roots: "4" }, verdict: "run", fit,
      scene: picture(original, [4, 8], "4 < 8 · p(4) = 90 > 70"),
    },
    {
      title: { vi: "Lần theo biên tách", en: "Follow the split boundary" }, kind: "step",
      body: {
        vi: "Vì 4 nhỏ hơn 7, ta giữ 4 và cả cây con trái ở nhóm nhỏ hơn 7, chỉ tách tiếp bên phải. Ở 8 thì đi trái, ở 6 đi phải, đến 7 bằng ngưỡng thì đi trái vào cây rỗng.",
        en: "Since 4 is below 7, keep 4 and its entire left subtree on the below-7 side and split only its right subtree. Go left at 8, right at 6, then left at 7 because it equals the cutoff, reaching an empty tree.",
      },
      lines: [2, 3, 4, 5, 8], watch: { x: 7, path: "4 → 8 → 6 → 7" }, verdict: "run", fit,
      scene: picture(original, [4, 8, 6, 7], "4 < 7 · 8 ≥ 7 · 6 < 7 · 7 ≥ 7"),
    },
    {
      title: { vi: "Nối lại hai nhóm", en: "Reconnect the two groups" }, kind: "step",
      body: {
        vi: "Khi quay lui, 7 về nhóm lớn hơn hoặc bằng 7, nên 6 bỏ con phải. Kết quả từ nhánh chứa 6 gồm gốc nhỏ là 6 và gốc lớn là 7. Nối 7 vào trái của 8, rồi nối 6 vào phải của 4.",
        en: "On the way back up, 7 goes to the at-least-7 side, so 6 loses its right child. Splitting the subtree at 6 returns 6 on the low side and 7 on the high side. Attach 7 to the left of 8 and 6 to the right of 4.",
      },
      lines: [5, 6, 8, 9], watch: { x: 7, roots: "4, 8" }, verdict: "run", fit,
      scene: picture(split, [4, 8], "[2, 4, 6] | [7, 8]", false, [6, 7]),
    },
    {
      title: { vi: "Chọn gốc theo ưu tiên", en: "Choose the root by priority" }, kind: "step",
      body: {
        vi: "Có thể gộp vì mọi khoá nhóm trái nhỏ hơn mọi khoá nhóm phải, với biên <code>6 &lt; 7</code>. So hai gốc, 4 thắng 8 vì <code>90 &gt; 70</code>. Giữ nguyên con trái 2 và gộp cây con phải gốc 6 với cây gốc 8.",
        en: "Merging is valid because every key on the left is below every key on the right, with <code>6 &lt; 7</code> at the boundary. Root 4 beats 8 because <code>90 &gt; 70</code>. Keep its left child 2 and merge its right subtree rooted at 6 with the tree rooted at 8.",
      },
      lines: [11, 13], watch: { roots: "4, 8" }, verdict: "run", fit,
      scene: picture(split, [4, 8], "max(90, 70) = 90"),
    },
    {
      title: { vi: "Gộp xong ở biên", en: "Finish merging at the boundary" }, kind: "answer",
      body: {
        vi: "Trong lần gộp tiếp theo, 8 thắng 6 vì <code>70 &gt; 50</code>, rồi 6 thắng 7 vì <code>50 &gt; 20</code>. Nhánh phải của 6 đang rỗng nên nhận 7. Gắn 6 vào trái của 8 và 8 vào phải của 4 để được cây ban đầu.",
        en: "In the recursive merges, 8 beats 6 by <code>70 &gt; 50</code>, then 6 beats 7 by <code>50 &gt; 20</code>. The empty right branch of 6 takes 7. Attach 6 to the left of 8 and 8 to the right of 4 to recover the original tree.",
      },
      lines: [12, 13, 14], watch: { roots: "4" }, verdict: "ac", fit,
      scene: picture(original, [4], "90 > 70 > 50 > 20", true, [6, 7, 8]),
    },
    {
      title: { vi: "Chỉ sửa đường biên", en: "Only the boundary changes" }, kind: "recap",
      body: {
        vi: "Tách chỉ theo một nhánh nhờ thứ tự khoá, còn gộp chọn gốc có ưu tiên cao hơn để giữ tính chất heap. Với thứ tự ưu tiên ngẫu nhiên, mỗi phép tốn O(log n) kỳ vọng và có thể tốn O(n) nếu cây lệch.",
        en: "Key order sends split down one branch, and merge picks the higher-priority root to preserve heap order. With randomly ordered priorities, each operation takes expected O(log n) and can take O(n) if the tree is skewed.",
      },
      lines: [4, 8, 13, 14], watch: { roots: "4" }, verdict: "ac", fit,
      scene: picture(original, [4], "[2, 4, 6] + [7, 8]", true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const { key, p } of nodes) {
    const [x, y] = original[key];
    scene.add(`v${key}`, { shape: shapes.block({ label: key, sub: `p=${p}`, w: 47, h: 33, depth: 4 }), x, y });
  }
  for (const { key } of nodes) {
    scene.link(`e${key}`, { from: `v${key === 4 ? 8 : 4}`, to: `v${key}`, anchor: "center", bend: 0 });
  }
  scene.add("calc", { shape: shapes.pill(), x: 0.1, y: 10.65 });
}
