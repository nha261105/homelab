import type { Lesson, SceneMap } from "../../../lib/types";

const nodes = [
  { key: 6, size: 7, x: 0, y: 0 },
  { key: 3, size: 3, x: -1.35, y: 2.65, parent: 6 },
  { key: 10, size: 3, x: 1.35, y: 2.65, parent: 6 },
  { key: 1, size: 1, x: -2.05, y: 5.3, parent: 3 },
  { key: 4, size: 1, x: -0.7, y: 5.3, parent: 3 },
  { key: 8, size: 1, x: 0.7, y: 5.3, parent: 10 },
  { key: 13, size: 1, x: 2.05, y: 5.3, parent: 10 },
];

function tree(formula: string, active: number[] = [], counted: number[] = [], answer?: number): SceneMap {
  const scene: SceneMap = {
    calc: { text: formula, o: 1, cls: answer === undefined ? "" : "v-eq" },
  };
  for (const { key, parent } of nodes) {
    scene[`key${key}`] = {
      cls: key === answer || counted.includes(key) ? "is-good" : active.includes(key) ? "is-active" : "",
      ...(key === answer ? { fx: { type: "pulse", delay: 420 } } : {}),
    };
    if (parent === undefined) continue;
    const onPath = active.includes(parent) && active.includes(key);
    scene[`edge${key}`] = {
      p: 1, cls: onPath ? "v-lt" : "",
      ...(onPath && key === active.at(-1) ? { from: { p: 0 }, delay: 200, dur: 420 } : {}),
    };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "ds-adv", slug: "ordered-set",
  title: { vi: "Ordered set (PBDS)", en: "Order-statistics tree" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng kích thước cây con để tìm phần tử theo thứ hạng và đếm số khóa nhỏ hơn một ngưỡng.",
    en: "Use subtree sizes to select a key by rank and count keys below a threshold.",
  },
  level: "hard", minutes: 9, time: "O(log n)", memory: "O(n)",
  goal: {
    vi: "Tìm <b>phần tử thứ 5</b> và đếm <b>số khóa nhỏ hơn 9</b>",
    en: "Find the <b>5th smallest key</b> and count <b>keys below 9</b>",
  },
  codeLang: "GNU C++17",
  code: [
    '#include &lt;iostream&gt;',
    '#include &lt;ext/pb_ds/assoc_container.hpp&gt;',
    '#include &lt;ext/pb_ds/tree_policy.hpp&gt;',
    '<span class="kw">using namespace</span> __gnu_pbds;',
    '<span class="kw">using</span> OrderedSet = tree&lt;<span class="kw">int</span>, null_type, std::less&lt;<span class="kw">int</span>&gt;,',
    '                        rb_tree_tag, tree_order_statistics_node_update&gt;;',
    'OrderedSet os;',
    '<span class="kw">for</span> (<span class="kw">int</span> v : {6, 3, 10, 1, 4, 8, 13}) os.insert(v);',
    '<span class="kw">auto</span> it = os.find_by_order(4);',
    '<span class="kw">if</span> (it != os.end()) std::cout &lt;&lt; *it &lt;&lt; \'\\n\';',
    'std::cout &lt;&lt; os.order_of_key(9) &lt;&lt; \'\\n\';',
  ],
  watch: [
    { key: "node", label: { vi: "khóa đang xét", en: "current key" } },
    { key: "left", label: { vi: "cỡ cây con trái", en: "left subtree size" } },
    { key: "k", label: { vi: "chỉ số cần tìm", en: "target index" } },
    { key: "count", label: { vi: "số khóa < 9", en: "keys < 9" } },
  ],
  practice: [
    { src: "CSES 1076", name: "Sliding Window Median", lv: "★★☆", url: "https://cses.fi/problemset/task/1076/" },
    { src: "CSES 1144", name: "Salary Queries", lv: "★★★", url: "https://cses.fi/problemset/task/1144/" },
  ],
  sceneOptions: { unit: 53, view: [-160, -120, 320, 350] },
  legend: [
    { cls: "acc", label: { vi: "đường truy vấn", en: "query path" } },
    { cls: "ac", label: { vi: "khóa trả về hoặc đã đếm", en: "key returned or counted" } },
  ],
  steps: [
    {
      title: { vi: "Hai câu hỏi", en: "Two order queries" }, kind: "problem",
      body: {
        vi: "Với các khóa 1, 3, 4, 6, 8, 10, 13, hãy tìm khóa thứ 5 theo thứ tự tăng dần và đếm số khóa nhỏ hơn 9. Mảng đã sắp xếp trả lời nhanh nhưng thêm hay xóa có thể phải dời O(n) phần tử.",
        en: "For the keys 1, 3, 4, 6, 8, 10, 13, find the fifth smallest key and count the keys below 9. A sorted array answers both queries quickly, but insertion or deletion can shift O(n) elements.",
      },
      lines: [], watch: { k: 4 }, verdict: "run", fit: "all", scene: tree("k = 5 − 1 = 4"),
    },
    {
      title: { vi: "Lưu cỡ cây con", en: "Store subtree sizes" }, kind: "concept",
      body: {
        vi: "Mỗi nút lưu <code>s</code>, số nút trong cây con kể cả chính nó. Lá có <code>s = 1</code>, nút 3 có <code>s = 1 + 1 + 1 = 3</code>, rồi gốc 6 lấy <code>3 + 1 + 3 = 7</code>.",
        en: "Each node stores <code>s</code>, the number of nodes in its subtree including itself. A leaf has <code>s = 1</code>, node 3 has <code>s = 1 + 1 + 1 = 3</code>, and root 6 gets <code>3 + 1 + 3 = 7</code>.",
      },
      lines: [5, 6, 8], watch: { node: 6, left: 3 }, verdict: "run", fit: "all",
      scene: tree("s[6] = 3 + 1 + 3 = 7", [6, 3, 10]),
    },
    {
      title: { vi: "Bỏ qua nửa trái", en: "Skip the left subtree" }, kind: "step",
      body: {
        vi: "Tìm theo chỉ số từ 0, nên khóa thứ 5 có <code>k = 4</code>. Ba khóa bên trái gốc 6 chiếm chỉ số 0–2, còn 6 ở chỉ số 3, nên sang phải với <code>k = 4 − (3 + 1) = 0</code>.",
        en: "Selection uses zero-based indexing, so the fifth key has <code>k = 4</code>. The three keys left of root 6 occupy indices 0–2 and 6 sits at index 3, so go right with <code>k = 4 − (3 + 1) = 0</code>.",
      },
      lines: [9], watch: { node: 6, left: 3, k: 4 }, verdict: "run", fit: "all",
      scene: tree("k′ = 4 − (3 + 1) = 0", [6, 10]),
    },
    {
      title: { vi: "Tìm được khóa thứ 5", en: "Find the fifth key" }, kind: "answer",
      body: {
        vi: "Ở nút 10, cây con trái có một nút nên <code>k = 0</code> vẫn nằm bên trái. Đến 8, bên trái có 0 nút và đúng bằng <code>k</code>, vậy <code>find_by_order(4)</code> trỏ đến 8.",
        en: "At node 10, the left subtree has one node, so <code>k = 0</code> goes left. At 8, the left subtree size is 0 and equals <code>k</code>, so <code>find_by_order(4)</code> points to 8.",
      },
      lines: [9, 10], watch: { node: 8, left: 0, k: 0 }, verdict: "ac", fit: "all",
      scene: tree("k = 0 = s[∅]  ⇒  8", [6, 10, 8], [], 8),
    },
    {
      title: { vi: "Đếm cả nhánh trái", en: "Count the left subtree" }, kind: "step",
      body: {
        vi: "Với <code>order_of_key(9)</code>, vì <code>6 &lt; 9</code>, cả ba khóa bên trái và 6 đều được tính. Cộng <code>3 + 1 = 4</code> rồi sang phải tìm tiếp.",
        en: "For <code>order_of_key(9)</code>, <code>6 &lt; 9</code>, so all three keys on the left and 6 itself count. Add <code>3 + 1 = 4</code> and continue right.",
      },
      lines: [11], watch: { node: 6, left: 3, count: 4 }, verdict: "ac", fit: "all",
      scene: tree("0 + (3 + 1) = 4", [6, 10], [1, 3, 4, 6]),
    },
    {
      title: { vi: "Rẽ trái tại 10", en: "Go left at 10" }, kind: "step",
      body: {
        vi: "Vì <code>9 ≤ 10</code>, nút 10 và mọi khóa bên phải nó đều không đạt điều kiện nhỏ hơn 9. Giữ tổng là 4 rồi rẽ trái tới 8.",
        en: "Since <code>9 ≤ 10</code>, neither 10 nor any key to its right is strictly below 9. Keep the count at 4 and go left to 8.",
      },
      lines: [11], watch: { node: 10, left: 1, count: 4 }, verdict: "ac", fit: "all",
      scene: tree("9 ≤ 10  ⇒  4 + 0 = 4", [6, 10, 8], [1, 3, 4, 6]),
    },
    {
      title: { vi: "Cộng thêm khóa 8", en: "Count one more key" }, kind: "answer",
      body: {
        vi: "Ở nút 8, <code>8 &lt; 9</code> và cây con trái rỗng. Cộng <code>0 + 1</code> rồi dừng ở nhánh phải rỗng. Năm khóa nhỏ hơn 9 là 1, 3, 4, 6 và 8.",
        en: "At node 8, <code>8 &lt; 9</code> and the left subtree is empty. Add <code>0 + 1</code> and stop at the empty right branch. The five keys below 9 are 1, 3, 4, 6, and 8.",
      },
      lines: [11], watch: { node: 8, left: 0, count: 5 }, verdict: "ac", fit: "all",
      scene: tree("4 + (0 + 1) = 5", [6, 10, 8], [1, 3, 4, 6, 8], 8),
    },
    {
      title: { vi: "Mỗi tầng một nhánh", en: "One branch per level" }, kind: "recap",
      body: {
        vi: "Thứ tự của cây tìm kiếm và cỡ cây con giúp mỗi truy vấn chỉ đi một nhánh. PBDS dùng cây đỏ-đen để giữ chiều cao O(log n), nên cả truy vấn lẫn thêm, xóa khóa đều tốn O(log n).",
        en: "Search-tree order and subtree sizes let each query follow just one branch. PBDS uses a red-black tree to keep its height O(log n), giving O(log n) queries, insertions, and deletions.",
      },
      note: {
        vi: "Ordered set chỉ lưu khóa phân biệt. Nếu có nhiều phần tử cùng giá trị, dùng cặp <code>(giá trị, id)</code> với id riêng cho từng phần tử.",
        en: "An ordered set stores distinct keys. For repeated values, use pairs <code>(value, id)</code> with a unique id for each item.",
      },
      lines: [5, 6, 9, 11], watch: { count: 5 }, verdict: "ac", fit: "all",
      scene: tree("k = 4 → 8   ·   #(< 9) = 5", [], [1, 3, 4, 6, 8]),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const { key, size, x, y } of nodes)
    scene.add(`key${key}`, { shape: shapes.block({ label: key, sub: `s=${size}`, w: 47, h: 35 }), x, y });
  for (const { key, parent } of nodes) {
    if (parent !== undefined)
      scene.link(`edge${key}`, { from: `key${parent}`, to: `key${key}`, anchor: "center", bend: 0 });
  }
  scene.add("calc", { shape: shapes.pill(), y: 7.4, o: 0 });
}
