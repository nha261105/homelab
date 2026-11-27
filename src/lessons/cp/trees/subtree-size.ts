import type { Lesson, SceneMap } from "../../../lib/types";

const VERTICES = [
  { v: 1, x: 0, y: 0, size: 6 },
  { v: 2, x: -1.25, y: 3, size: 3 },
  { v: 3, x: 1.25, y: 3, size: 2 },
  { v: 4, x: -2, y: 6, size: 1 },
  { v: 5, x: -0.6, y: 6, size: 1 },
  { v: 6, x: 1.25, y: 6, size: 1 },
];
const EDGES = [[1, 2], [1, 3], [2, 4], [2, 5], [3, 6]];
const FIT = VERTICES.map(({ v }) => `v${v}`);

function tree(done: number[] = [], stack: number[] = [], fresh: number[] = []): SceneMap {
  const scene: SceneMap = {};
  for (const { v, size } of VERTICES) {
    const ready = done.includes(v);
    const open = stack.includes(v);
    scene[`v${v}`] = {
      text: ready ? String(size) : open ? "1" : "?",
      cls: ready ? "is-good" : open ? "is-active" : "is-out",
      ...(fresh.includes(v) ? { fx: { type: "hop", amp: 0.22, delay: 260 } } : {}),
    };
  }
  for (const [parent, child] of EDGES) {
    const returning = done.includes(child) && fresh.includes(parent);
    scene[`e${child}`] = { p: 1, cls: returning ? "v-eq" : "" };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "trees",
  slug: "subtree-size",
  title: { vi: "DFS trên cây: kích thước cây con", en: "Tree DFS: subtree sizes" },
  added: "2026-11-27",
  summary: {
    vi: "Tính kích thước của mọi cây con bằng cách cộng kết quả từ lá lên gốc.",
    en: "Compute every subtree size by combining results from the leaves up to the root.",
  },
  level: "basic",
  minutes: 7,
  time: "O(n)",
  memory: "O(n)",
  goal: { vi: "Đếm số đỉnh trong cây con của <b>mỗi đỉnh</b>", en: "Count the vertices in <b>every subtree</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> dfs(<span class="kw">int</span> u, <span class="kw">int</span> p) {',
    '  sz[u] = <span class="nm">1</span>;',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[u]) {',
    '    <span class="kw">if</span> (v == p) <span class="kw">continue</span>;',
    '    sz[u] += dfs(v, u);',
    '  }',
    '  <span class="kw">return</span> sz[u];',
    '}',
    '',
    'dfs(<span class="nm">1</span>, <span class="nm">0</span>);',
  ],
  watch: [
    { key: "u", label: "u" },
    { key: "p", label: "p" },
    { key: "size", label: "sz[u]" },
  ],
  practice: [
    { src: "CSES 1674", name: "Subordinates", lv: "★☆☆", url: "https://cses.fi/problemset/task/1674" },
    { src: "LeetCode 1519", name: "Number of Nodes in the Sub-Tree With the Same Label", lv: "★★☆", url: "https://leetcode.com/problems/number-of-nodes-in-the-sub-tree-with-the-same-label/" },
  ],
  sceneOptions: { unit: 63 },
  legend: [
    { cls: "dim", label: { vi: "chưa thăm", en: "unvisited" } },
    { cls: "acc", label: { vi: "đang tính", en: "in progress" } },
    { cls: "ac", label: { vi: "đã tính xong", en: "size complete" } },
  ],
  entrance: FIT,
  steps: [
    {
      title: { vi: "Đếm đỉnh cây con", en: "Count subtree vertices" }, kind: "problem",
      body: {
        vi: "Cây có 6 đỉnh, gốc là 1. Với mỗi đỉnh <code>u</code>, hãy đếm chính <code>u</code> và mọi đỉnh bên dưới nó. Đếm lại từ từng đỉnh có thể tốn O(n²) nếu cây là một đường thẳng.",
        en: "The tree has 6 vertices and root 1. For each vertex <code>u</code>, count <code>u</code> itself and all its descendants. Counting from scratch at each vertex can take O(n²) on a chain.",
      },
      lines: [], watch: {}, verdict: "run", fit: FIT, scene: tree(),
    },
    {
      title: { vi: "Đi xuống từ gốc", en: "Descend from the root" }, kind: "concept",
      body: {
        vi: "DFS đi từ 1 xuống 2. Khi vào một đỉnh, đặt <code>sz[u] = 1</code> để đếm chính đỉnh đó. Tại 2, bỏ qua cạnh về cha 1 rồi lần lượt thăm 4 và 5.",
        en: "DFS goes from 1 down to 2. On entry, set <code>sz[u] = 1</code> to count the vertex itself. At 2, skip the edge back to parent 1, then visit 4 and 5 in order.",
      },
      lines: [1, 2, 3, 4, 10], watch: { u: 2, p: 1, size: 1 }, verdict: "run", fit: FIT,
      scene: tree([], [1, 2]),
    },
    {
      title: { vi: "Lá trả về một", en: "A leaf returns one" }, kind: "step",
      body: {
        vi: "Đỉnh 4 chỉ nối với cha 2, nên vòng lặp bỏ qua cạnh duy nhất và trả về <code>sz[4] = 1</code>. Đỉnh 2 sẽ cộng giá trị này trước khi đi tiếp sang 5.",
        en: "Vertex 4 connects only to parent 2, so the loop skips its only edge and returns <code>sz[4] = 1</code>. Vertex 2 will add that result before moving on to 5.",
      },
      lines: [2, 4, 7], watch: { u: 4, p: 2, size: 1 }, verdict: "run", fit: FIT,
      scene: tree([4], [1, 2], [4]),
    },
    {
      title: { vi: "Cộng hai nhánh con", en: "Combine the two children" }, kind: "step",
      body: {
        vi: "Lá 5 cũng trả về 1. Cộng kết quả từ 4 và 5 vào số 1 ban đầu, ta được <code>sz[2] = 1 + 1 + 1 = 3</code>.",
        en: "Leaf 5 also returns 1. Add the results from 4 and 5 to the initial 1 to get <code>sz[2] = 1 + 1 + 1 = 3</code>.",
      },
      lines: [5, 7], watch: { u: 2, p: 1, size: 3 }, verdict: "run", fit: FIT,
      scene: tree([2, 4, 5], [1], [2]),
    },
    {
      title: { vi: "Xong nhánh còn lại", en: "Finish the other branch" }, kind: "step",
      body: {
        vi: "Sau nhánh 2, DFS từ gốc đi sang 3 rồi đến lá 6. Lá trả về 1, nên <code>sz[3] = 1 + sz[6] = 2</code>.",
        en: "After branch 2, DFS goes from the root to 3 and then leaf 6. The leaf returns 1, so <code>sz[3] = 1 + sz[6] = 2</code>.",
      },
      lines: [3, 5, 7], watch: { u: 3, p: 1, size: 2 }, verdict: "run", fit: FIT,
      scene: tree([2, 3, 4, 5, 6], [1], [3]),
    },
    {
      title: { vi: "Gộp ở gốc", en: "Combine at the root" }, kind: "answer",
      body: {
        vi: "Cả hai con của 1 đã trả về kết quả. Gốc tính <code>sz[1] = 1 + 3 + 2 = 6</code>, đúng bằng số đỉnh của cả cây.",
        en: "Both children of 1 have returned their results. The root computes <code>sz[1] = 1 + 3 + 2 = 6</code>, the number of vertices in the whole tree.",
      },
      lines: [5, 7, 10], watch: { u: 1, p: 0, size: 6 }, verdict: "ac", fit: FIT,
      scene: tree([1, 2, 3, 4, 5, 6], [], [1]),
    },
    {
      title: { vi: "Mỗi đỉnh tính một lần", en: "Compute each size once" }, kind: "recap",
      body: {
        vi: "Các cây con của 2 và 3 rời nhau. Tương tự ở mọi đỉnh, cộng kích thước các cây con trực tiếp rồi thêm 1 sẽ đếm mỗi đỉnh đúng một lần trong cây con đó. DFS duyệt mỗi cạnh hai lượt, tốn O(n) thời gian và O(n) bộ nhớ.",
        en: "The subtrees of 2 and 3 are disjoint. At any vertex, adding its children's subtree sizes and 1 counts every vertex in its subtree exactly once. DFS scans each edge twice and uses O(n) time and O(n) space.",
      },
      note: { vi: "Bài Subordinates chỉ đếm cấp dưới, nên in sz[u] − 1.", en: "Subordinates counts only descendants, so print sz[u] − 1." },
      lines: [2, 3, 4, 5, 7], watch: { u: 1, p: 0, size: 6 }, verdict: "ac", fit: FIT,
      scene: tree([1, 2, 3, 4, 5, 6]),
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  for (const { v, x, y } of VERTICES) {
    scene.add(`v${v}`, { shape: shapes.block({ label: "?", sub: `v = ${v}`, w: 49, h: 37 }), x, y });
  }
  for (const [parent, child] of EDGES) {
    scene.link(`e${child}`, { from: `v${parent}`, to: `v${child}`, anchor: "center", bend: 0 });
  }
}
