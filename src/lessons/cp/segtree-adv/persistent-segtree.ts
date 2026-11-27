import type { Lesson, SceneMap } from "../../../lib/types";

const A = [2, 3, 1, 4];
const P = 1;
const X = 6;
const sharedRightSum = A[2] + A[3];
const oldLeftSum = A[0] + A[1];
const newLeftSum = A[0] + X;
const oldSum = oldLeftSum + sharedRightSum;
const newSum = newLeftSum + sharedRightSum;

const nodes = {
  r0: { value: oldSum, sub: null, x: 0.9, y: 0, stage: 0 },
  l0: { value: oldLeftSum, sub: "[0,1]", x: 0.65, y: 3, stage: 0 },
  b0: { value: A[P], sub: "a[1]", x: 0, y: 5.65, stage: 0 },
  a: { value: A[0], sub: "a[0]", x: 2.5, y: 7.55, stage: 0 },
  r: { value: sharedRightSum, sub: "[2,3]", x: 2.5, y: 2.7, stage: 0 },
  c: { value: A[2], sub: "a[2]", x: 1.65, y: 5.4, stage: 0 },
  d: { value: A[3], sub: "a[3]", x: 3.35, y: 5.4, stage: 0 },
  b1: { value: X, sub: "a[1]", x: 5, y: 5.65, stage: 1 },
  l1: { value: newLeftSum, sub: "[0,1]", x: 4.35, y: 3, stage: 2 },
  r1: { value: newSum, sub: null, x: 4.1, y: 0, stage: 3 },
};
type NodeId = keyof typeof nodes;
const edges: [NodeId, NodeId][] = [
  ["r0", "l0"], ["r0", "r"], ["l0", "b0"], ["l0", "a"], ["r", "c"], ["r", "d"],
  ["l1", "b1"], ["l1", "a"], ["r1", "l1"], ["r1", "r"],
];

function versions(stage: number, focus: NodeId[], formula: string, answer = false): SceneMap {
  const scene: SceneMap = {
    calc: { text: formula, o: 1, cls: answer ? "v-eq" : "", delay: 380 },
    version1: { o: stage >= nodes.r1.stage ? 1 : 0 },
  };
  for (const [id, node] of Object.entries(nodes)) {
    const active = focus.includes(id as NodeId);
    scene[id] = {
      o: node.stage <= stage ? 1 : 0,
      cls: active ? (answer ? "is-good" : "is-active") : "",
      ...(active && stage > 0 && node.stage === stage && !answer
        ? { from: { o: 0, z: 0.45 }, dur: 480, land: true } : {}),
    };
  }
  edges.forEach(([from, to], i) => {
    const shown = nodes[from].stage <= stage && nodes[to].stage <= stage;
    const traced = focus.includes(from) && focus.includes(to);
    scene[`e${i}`] = { p: shown ? 1 : 0, cls: traced ? "v-eq" : "" };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "segtree-adv", slug: "persistent-segtree",
  title: { vi: "Segment tree bền vững", en: "Persistent segment tree" },
  added: "2026-11-27", level: "hard", minutes: 10,
  summary: {
    vi: "Cập nhật bằng cách tạo lại đường từ lá lên gốc, rồi dùng chung các nhánh không đổi giữa hai phiên bản.",
    en: "Rebuild the updated leaf-to-root path and share the untouched branches between versions.",
  },
  time: "O(log n) / update", memory: "O(n + u log n)",
  goal: { vi: "Đổi <b>a[1] = 6</b> và giữ cả hai phiên bản", en: "Set <b>a[1] = 6</b> and keep both versions" },
  codeLang: "C++17",
  code: [
    '<span class="kw">struct</span> Node { <span class="kw">int</span> left, right; <span class="kw">long long</span> sum; };',
    'vector&lt;Node&gt; t;',
    '<span class="kw">int</span> set_value(<span class="kw">int</span> v, <span class="kw">int</span> l, <span class="kw">int</span> r, <span class="kw">int</span> p, <span class="kw">long long</span> x) {',
    '  Node next = t[v];',
    '  <span class="kw">if</span> (l == r) next.sum = x;',
    '  <span class="kw">else</span> {',
    '    <span class="kw">int</span> m = l + (r - l) / 2;',
    '    <span class="kw">if</span> (p &lt;= m) next.left = set_value(next.left, l, m, p, x);',
    '    <span class="kw">else</span> next.right = set_value(next.right, m + 1, r, p, x);',
    '    next.sum = t[next.left].sum + t[next.right].sum;',
    '  }',
    '  t.push_back(next);',
    '  <span class="kw">return</span> int(t.size()) - 1;',
    '}',
  ],
  watch: [
    { key: "p", label: "p" },
    { key: "created", label: { vi: "số nút mới", en: "new nodes" } },
    { key: "old", label: "t[root[0]].sum" },
    { key: "new", label: "t[root[1]].sum" },
  ],
  practice: [
    { src: "CSES 1737", name: "Range Queries and Copies", lv: "★★☆", url: "https://cses.fi/problemset/task/1737" },
    { src: "SPOJ MKTHNUM", name: "K-th Number", lv: "★★★", url: "https://www.spoj.com/problems/MKTHNUM/" },
  ],
  sceneOptions: { unit: 61 },
  legend: [
    { cls: "acc", label: { vi: "nút đang xét", en: "nodes in focus" } },
    { cls: "ac", label: { vi: "gốc dùng để truy vấn", en: "query roots" } },
  ],
  entrance: ["r0", "l0", "r", "a", "b0", "c", "d"],
  steps: [
    {
      title: { vi: "Giữ lại bản cũ", en: "Keep the old version" }, kind: "problem",
      body: {
        vi: "Cây tổng của <code>[2, 3, 1, 4]</code> có gốc 10. Ta muốn đổi <code>a[1]</code> từ 3 thành 6 mà vẫn hỏi được tổng ở bản cũ. Sao chép cả cây cho mỗi lần sửa sẽ tốn O(n) bộ nhớ.",
        en: "The sum tree for <code>[2, 3, 1, 4]</code> has root sum 10. Set <code>a[1]</code> from 3 to 6 while keeping the old version queryable. Copying the whole tree would cost O(n) space per update.",
      },
      lines: [1, 2], watch: { p: P, created: 0, old: oldSum }, verdict: "run", fit: "all",
      scene: versions(0, [], `${oldLeftSum} + ${sharedRightSum} = ${oldSum}`),
    },
    {
      title: { vi: "Lần theo đường sửa", en: "Trace the update path" }, kind: "concept",
      body: {
        vi: "Từ <code>root[0]</code>, chỉ các đoạn <code>[0, 3]</code>, <code>[0, 1]</code> và <code>[1, 1]</code> chứa vị trí 1. Tạo nút mới dọc đường này. Lá 0 và cả nhánh <code>[2, 3]</code> có thể dùng chung.",
        en: "From <code>root[0]</code>, only <code>[0, 3]</code>, <code>[0, 1]</code>, and <code>[1, 1]</code> contain index 1. Create new nodes along this path. Leaf 0 and the entire <code>[2, 3]</code> subtree can be shared.",
      },
      lines: [3, 4, 7, 8, 9], watch: { p: P, created: 0, old: oldSum }, verdict: "run", fit: "all",
      scene: versions(0, ["r0", "l0", "b0"], "p = 1"),
    },
    {
      title: { vi: "Tạo lá mới", en: "Create the new leaf" }, kind: "step",
      body: {
        vi: "Khi <code>l == r == 1</code>, ghi 6 vào nút mới và trả về chỉ số của nó trong <code>t</code>. Lá của phiên bản cũ vẫn giữ 3.",
        en: "When <code>l == r == 1</code>, store 6 in a new node and return its index in <code>t</code>. The old version’s leaf still holds 3.",
      },
      lines: [4, 5, 12, 13], watch: { p: P, created: 1, old: oldSum }, verdict: "run", fit: "all",
      scene: versions(1, ["b1"], `a[1] ← ${X}`),
    },
    {
      title: { vi: "Dựng lại nhánh trái", en: "Rebuild the left subtree" }, kind: "step",
      body: {
        vi: "Nút mới cho <code>[0, 1]</code> vẫn trỏ đến lá 0 có giá trị 2, nhưng trỏ sang lá mới có giá trị 6 ở vị trí 1. Tính lại tổng thành <code>2 + 6 = 8</code>.",
        en: "The new <code>[0, 1]</code> node still points to leaf 0 with value 2, and points to the new leaf with value 6 at index 1. Recompute its sum as <code>2 + 6 = 8</code>.",
      },
      lines: [4, 9, 10, 12, 13], watch: { p: P, created: 2, old: oldSum }, verdict: "run", fit: "all",
      scene: versions(2, ["a", "b1", "l1"], `${A[0]} + ${X} = ${newLeftSum}`),
    },
    {
      title: { vi: "Lưu gốc mới", en: "Save the new root" }, kind: "step",
      body: {
        vi: "Gốc mới nối với đoạn trái mới có tổng 8 và nhánh phải cũ có tổng 5. Lưu chỉ số trả về vào <code>root[1]</code>, ta có phiên bản mới với tổng <code>8 + 5 = 13</code>.",
        en: "The new root takes the new left child with sum 8 and the shared right child with sum 5. Save the returned index as <code>root[1]</code> for the version with sum <code>8 + 5 = 13</code>.",
      },
      lines: [8, 10, 12, 13], watch: { p: P, created: 3, old: oldSum, new: newSum }, verdict: "run", fit: "all",
      scene: versions(3, ["r1", "l1", "r"], `${newLeftSum} + ${sharedRightSum} = ${newSum}`),
    },
    {
      title: { vi: "Hỏi cả hai bản", en: "Query both versions" }, kind: "answer",
      body: {
        vi: "Hỏi tổng <code>[0, 3]</code> từ <code>root[0]</code> được 10, còn từ <code>root[1]</code> được 13. Với đoạn con <code>[0, 1]</code>, đi theo con trái của từng gốc sẽ được 5 và 8.",
        en: "Query <code>[0, 3]</code> from <code>root[0]</code> to get 10, or from <code>root[1]</code> to get 13. For <code>[0, 1]</code>, the two roots’ left children yield 5 and 8.",
      },
      lines: [], watch: { created: 3, old: oldSum, new: newSum }, verdict: "ac", fit: "all",
      scene: versions(3, ["r0", "r1"], `${oldSum} → ${newSum}`, true),
    },
    {
      title: { vi: "Chia sẻ nhánh cũ", en: "Share untouched branches" }, kind: "recap",
      body: {
        vi: "Hai phiên bản dùng chung 4 nút, nên tổng cộng chỉ cần <code>7 + 3 = 10</code> nút. Nút đã lưu chỉ được đọc, nên sao chép phiên bản chỉ cần giữ thêm chỉ số gốc. Sau u lần cập nhật điểm, cây dùng O(n + u log n) bộ nhớ và tốn O(log n) mỗi lần sửa hoặc hỏi tổng đoạn.",
        en: "The versions share 4 nodes, so together they use just <code>7 + 3 = 10</code> nodes. Stored nodes are read-only, so copying a version takes just another root index. After u point updates, space is O(n + u log n), with O(log n) per update or range-sum query.",
      },
      note: {
        vi: "Dùng <code>t.reserve(...)</code> nếu biết trước giới hạn số nút để tránh cấp phát lại khi thêm nút.",
        en: "Use <code>t.reserve(...)</code> if you know an upper bound on nodes to avoid reallocations while appending.",
      },
      lines: [4, 12, 13], watch: { created: 3, old: oldSum, new: newSum }, verdict: "ac", fit: "all",
      scene: versions(3, ["a", "r", "c", "d"], "7 + 3 = 10"),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const [id, { value, sub, x, y, stage }] of Object.entries(nodes)) {
    scene.add(id, {
      shape: shapes.block({ label: value, sub, w: 53, h: 31 }),
      x, y, o: stage === 0 ? 1 : 0,
    });
  }
  edges.forEach(([from, to], i) => scene.link(`e${i}`, { from, to, anchor: "center", bend: 0 }));
  scene.add("calc", { shape: shapes.pill(), x: 4.05, y: 8.55, o: 0 });
  scene.add("version0", { shape: shapes.pill({ text: "root[0]", h: 21, pad: 7 }), x: nodes.r0.x, z: 0.7 });
  scene.add("version1", { shape: shapes.pill({ text: "root[1]", h: 21, pad: 7 }), x: nodes.r1.x, z: 0.7, o: 0 });
}
