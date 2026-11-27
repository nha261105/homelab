import type { Lesson, SceneMap } from "../../../lib/types";

const A = [2, 4, 7, 9];
const X = 7;
const T = [0, Math.max(...A), Math.max(A[0], A[1]), Math.max(A[2], A[3]), ...A];
const nodes = [
  { id: 1, x: 2.25, y: 0, sub: "[0,3]" },
  { id: 2, x: 0.75, y: 2.8, sub: "[0,1]" },
  { id: 3, x: 3.75, y: 2.8, sub: "[2,3]" },
  ...A.map((_, i) => ({ id: i + 4, x: i * 1.5, y: 5.6, sub: String(i) })),
];

function picture(firstVisible: number, path: number[], skipped: number[], formula = "", answer = false): SceneMap {
  const scene: SceneMap = {
    calc: { text: formula, o: formula ? 1 : 0, cls: answer ? "v-eq" : "", delay: 380 },
  };
  for (const { id } of nodes) {
    const shown = id >= firstVisible;
    const chosen = path.includes(id);
    const dimmed = skipped.includes(id);
    scene[`v${id}`] = {
      o: shown ? (dimmed ? 0.55 : 1) : 0,
      cls: answer && id === 6 ? "is-good" : dimmed ? "is-out" : chosen ? "is-active" : "",
    };
    if (id > 1) {
      const traced = chosen && path.includes(id >> 1);
      scene[`e${id}`] = { p: (id >> 1) >= firstVisible ? 1 : 0, o: dimmed ? 0.4 : 1, cls: traced ? "v-eq" : "" };
    }
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "segtree-adv", slug: "segtree-descend",
  title: { vi: "Đi xuống trên segment tree", en: "Walking down the tree" },
  added: "2026-11-27", level: "hard", minutes: 8,
  summary: {
    vi: "Dùng giá trị lớn nhất ở mỗi nút để tìm vị trí đầu tiên đủ ngưỡng chỉ qua một đường từ gốc xuống lá.",
    en: "Use each node’s maximum to find the first index that meets a threshold in one root-to-leaf walk.",
  },
  time: "O(log n)", memory: "O(n)",
  goal: { vi: "Tìm vị trí đầu tiên có <b>a[i] ≥ 7</b>", en: "Find the first index with <b>a[i] ≥ 7</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> first_at_least(<span class="kw">const</span> vector&lt;int&gt;&amp; t, <span class="kw">int</span> n, <span class="kw">int</span> x) {',
    '  <span class="kw">if</span> (t[1] &lt; x) <span class="kw">return</span> -1;',
    '  <span class="kw">int</span> v = 1, l = 0, r = n - 1;',
    '  <span class="kw">while</span> (l &lt; r) {',
    '    <span class="kw">int</span> m = l + (r - l) / 2;',
    '    <span class="kw">if</span> (t[2 * v] &gt;= x) { v = 2 * v; r = m; }',
    '    <span class="kw">else</span> { v = 2 * v + 1; l = m + 1; }',
    '  }',
    '  <span class="kw">return</span> l;',
    '}',
  ],
  watch: [
    { key: "range", label: "[l, r]" },
    { key: "max", label: "t[v]" },
    { key: "left", label: { vi: "max trái vừa xét", en: "left max checked" } },
    { key: "out", label: { vi: "vị trí", en: "index" } },
  ],
  practice: [
    { src: "CSES 1143", name: "Hotel Queries", lv: "★★☆", url: "https://cses.fi/problemset/task/1143" },
    { src: "LeetCode 3479", name: "Fruits Into Baskets III", lv: "★★☆", url: "https://leetcode.com/problems/fruits-into-baskets-iii/" },
  ],
  sceneOptions: { unit: 62 },
  legend: [
    { cls: "acc", label: { vi: "đường đang đi", en: "search path" } },
    { cls: "dim", label: { vi: "nhánh bị bỏ qua", en: "skipped branch" } },
    { cls: "ac", label: { vi: "đáp án", en: "answer" } },
  ],
  entrance: ["v4", "v5", "v6", "v7"],
  steps: [
    {
      title: { vi: "Tìm chỗ đầu tiên", en: "Find the first match" }, kind: "problem",
      body: {
        vi: "Bốn khách sạn có lần lượt 2, 4, 7 và 9 phòng trống. Nhóm cần 7 phòng phải vào khách sạn đầu tiên đủ chỗ. Quét từ trái sang phải có thể tốn O(n) cho mỗi nhóm.",
        en: "Four hotels have 2, 4, 7, and 9 free rooms. A group of 7 must take the first hotel with enough rooms. Scanning from the left can cost O(n) per group.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(4, [], []),
    },
    {
      title: { vi: "Gộp bằng max", en: "Combine with max" }, kind: "concept",
      body: {
        vi: "Lá lưu số phòng của từng khách sạn. Hai nút cha lưu <code>max(2, 4) = 4</code> và <code>max(7, 9) = 9</code>, rồi gốc lấy <code>max(4, 9) = 9</code>.",
        en: "Each leaf stores one hotel’s capacity. The two parents hold <code>max(2, 4) = 4</code> and <code>max(7, 9) = 9</code>, then the root takes <code>max(4, 9) = 9</code>.",
      },
      lines: [], watch: { range: "[0, 3]", max: T[1] }, verdict: "run", fit: "all",
      scene: picture(1, [], [], "max(4, 9) = 9"),
    },
    {
      title: { vi: "Kiểm tra gốc", en: "Check the root" }, kind: "step",
      body: {
        vi: "Gốc có <code>9 ≥ 7</code>, nên chắc chắn có lá đủ phòng. Nếu gốc nhỏ hơn <code>x</code>, trả về <code>−1</code> ngay.",
        en: "The root has <code>9 ≥ 7</code>, so some leaf must have enough rooms. If the root is below <code>x</code>, return <code>−1</code> immediately.",
      },
      lines: [2, 3], watch: { range: "[0, 3]", max: T[1] }, verdict: "run", fit: "all",
      scene: picture(1, [1], [], `${T[1]} ≥ ${X}`),
    },
    {
      title: { vi: "Rẽ sang phải", en: "Go right" }, kind: "step",
      body: {
        vi: "Con trái có max là 4, nhỏ hơn 7, nên bỏ cả đoạn <code>[0, 1]</code>. Đáp án chắc chắn nằm trong con phải <code>[2, 3]</code>.",
        en: "The left maximum is 4, below 7, so skip all of <code>[0, 1]</code>. The answer must be in the right child <code>[2, 3]</code>.",
      },
      lines: [4, 5, 6, 7], watch: { range: "[2, 3]", max: T[3], left: T[2] }, verdict: "run", fit: "all",
      scene: picture(1, [1, 3], [2, 4, 5], `${T[2]} < ${X}`),
    },
    {
      title: { vi: "Rẽ trái tới lá", en: "Go left to a leaf" }, kind: "answer",
      body: {
        vi: "Con trái của <code>[2, 3]</code> là lá 2 với <code>a[2] = 7</code>, vừa đủ ngưỡng. Khách sạn ở vị trí 3 tuy có 9 phòng nhưng đứng sau vị trí 2, nên trả về <code>2</code>.",
        en: "The left child of <code>[2, 3]</code> is leaf 2 with <code>a[2] = 7</code>, exactly enough. Index 3 has 9 rooms but comes later, so return <code>2</code>.",
      },
      lines: [6, 9], watch: { range: "[2, 2]", max: T[6], left: T[6], out: 2 }, verdict: "ac", fit: "all",
      scene: picture(1, [1, 3, 6], [2, 4, 5, 7], `a[2] = ${T[6]} ≥ ${X}`, true),
    },
    {
      title: { vi: "Mỗi tầng một nhánh", en: "One branch per level" }, kind: "recap",
      body: {
        vi: "Đoạn đang xét luôn chứa vị trí hợp lệ đầu tiên: ưu tiên con trái nếu nó đủ ngưỡng, nếu không thì bỏ cả nhánh trái. Dựng cây tốn O(n), tìm và cập nhật số phòng sau khi xếp khách đều tốn O(log n).",
        en: "The current interval always contains the first valid index: take the left child whenever it can meet the threshold, otherwise discard it. Building costs O(n), and both finding a hotel and updating its remaining rooms take O(log n).",
      },
      lines: [4, 6, 7, 9], watch: { range: "[2, 2]", max: T[6], out: 2 }, verdict: "ac", fit: "all",
      scene: picture(1, [1, 3, 6], [2, 4, 5, 7], `a[2] = ${T[6]} ≥ ${X}`, true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const { id, x, y, sub } of nodes) {
    scene.add(`v${id}`, { shape: shapes.block({ label: T[id], sub, w: 46, h: 31 }), x, y, o: id >= 4 ? 1 : 0 });
    if (id > 1) scene.link(`e${id}`, { from: `v${id >> 1}`, to: `v${id}`, anchor: "center", bend: 0 });
  }
  scene.add("calc", { shape: shapes.pill(), x: 2.25, y: 7.65, o: 0 });
}
