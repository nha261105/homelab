import type { Lesson, SceneMap } from "../../../lib/types";

const POSITIONS = [[2.4, 0], [1, 2.1], [3.8, 2.1], [0.65, 4.25], [2.5, 4.25], [4.8, 4.25], [4.8, 6.4]];
const PARENT = [0, 1, 1, 2, 3, 3, 6];
const SIZE = [7, 2, 4, 1, 1, 2, 1];
const SUM = [11, 14, 10, 19, 15, 13, 18];
const ALL = [1, 2, 3, 4, 5, 6, 7];

function picture(known: number[], root = 1, across = 0, closer: number[] = [], showSize = true): SceneMap {
  const scene: SceneMap = {};
  for (const key of ["u", "sz", "ans"]) scene[key] = { o: showSize ? 1 : 0 };
  POSITIONS.forEach((_, i) => {
    const u = i + 1;
    const ready = known.includes(u);
    const isRoot = u === root;
    scene[`v${u}`] = { cls: isRoot ? "is-good" : closer.includes(u) ? "is-active" : "" };
    scene[`col${u}`] = { o: showSize ? 1 : 0, cls: isRoot ? "is-good" : "" };
    scene[`size${u}`] = { text: SIZE[i], o: showSize ? 1 : 0, cls: u === across ? "is-active" : "" };
    scene[`sum${u}`] = { text: ready ? SUM[i] : "·", o: showSize ? 1 : 0, cls: ready ? isRoot ? "is-good" : "" : "is-out" };
    if (i > 0 && u === across) scene[`e${u}`] = { cls: "v-eq", p: 1, from: { p: 0 }, dur: 350 };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "trees-adv", slug: "rerooting",
  title: { vi: "Đổi gốc", en: "Rerooting" },
  added: "2026-11-27",
  summary: {
    vi: "Tính tổng khoảng cách tại một gốc rồi cập nhật trong O(1) khi đi qua mỗi cạnh.",
    en: "Compute the distance sum at one root, then update it in O(1) across each edge.",
  },
  level: "hard", minutes: 10, time: "O(n)", memory: "O(n)",
  goal: {
    vi: "Với từng đỉnh <b>u</b>, tính tổng khoảng cách từ <b>u</b> đến cả cây",
    en: "For each vertex <b>u</b>, find the sum of distances from <b>u</b> to the whole tree",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">void</span> prepare(<span class="kw">int</span> u, <span class="kw">int</span> p, <span class="kw">int</span> depth) {',
    '  sz[u] = 1; ans[1] += depth;',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[u]) <span class="kw">if</span> (v != p) {',
    '    prepare(v, u, depth + 1);',
    '    sz[u] += sz[v];',
    '  }',
    '}',
    '<span class="kw">void</span> reroot(<span class="kw">int</span> u, <span class="kw">int</span> p) {',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[u]) <span class="kw">if</span> (v != p) {',
    '    ans[v] = ans[u] + n - 2LL * sz[v];',
    '    reroot(v, u);',
    '  }',
    '}',
    'ans[1] = 0; prepare(1, 0, 0); reroot(1, 0);',
  ],
  watch: [
    { key: "move", label: { vi: "dời gốc", en: "root move" } },
    { key: "size", label: "sz" }, { key: "sum", label: "ans" },
  ],
  practice: [
    { src: "CSES 1133", name: "Tree Distances II", lv: "★★☆", url: "https://cses.fi/problemset/task/1133" },
    { src: "LeetCode 834", name: "Sum of Distances in Tree", lv: "★★☆", url: "https://leetcode.com/problems/sum-of-distances-in-tree/" },
  ],
  sceneOptions: { unit: 44, view: [-75, -65, 350, 325] },
  legend: [
    { cls: "acc", label: { vi: "đỉnh gần hơn sau khi dời gốc", en: "vertices that move one edge closer" } },
    { cls: "ac", label: { vi: "gốc hiện tại và cạnh vừa đi qua", en: "current root and edge just crossed" } },
  ],
  steps: [
    {
      title: { vi: "Tổng từ mọi đỉnh", en: "Sum from every vertex" }, kind: "problem",
      body: {
        vi: "Mỗi cạnh dài 1. Với mỗi đỉnh trong cây 7 đỉnh, cộng khoảng cách đến tất cả các đỉnh khác. Chạy riêng một DFS từ mỗi đỉnh sẽ tốn O(n²).",
        en: "Each edge has length 1. For each of the 7 vertices, add its distances to all the other vertices. A separate DFS from every vertex takes O(n²).",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture([], 0, 0, [], false),
    },
    {
      title: { vi: "Đếm kích thước cây con", en: "Count subtree sizes" }, kind: "concept",
      body: {
        vi: "Đặt gốc ban đầu ở 1. Khi DFS quay lui, <code>sz[u]</code> bằng 1 cộng kích thước các cây con trực tiếp. Chẳng hạn nhánh 3 gồm 3, 5, 6 và 7, nên <code>sz[3] = 1 + 1 + 2 = 4</code>.",
        en: "Start at root 1. As DFS returns, <code>sz[u]</code> is 1 plus the sizes of its child subtrees. Branch 3 contains 3, 5, 6, and 7, so <code>sz[3] = 1 + 1 + 2 = 4</code>.",
      },
      lines: [1, 2, 3, 4, 5], watch: { size: 4 }, verdict: "run", fit: "all", scene: { ...picture([]), size3: { text: SIZE[2], o: 1, cls: "is-active" } },
    },
    {
      title: { vi: "Cộng độ sâu từ 1", en: "Add depths from 1" }, kind: "step",
      body: {
        vi: "Cùng lượt DFS đó, cộng độ sâu tính từ 1. Theo thứ tự đỉnh 1 đến 7, tổng là <code>0 + 1 + 1 + 2 + 2 + 2 + 3 = 11</code>.",
        en: "During the same DFS, add the depths measured from 1. In vertex order 1 through 7, the sum is <code>0 + 1 + 1 + 2 + 2 + 2 + 3 = 11</code>.",
      },
      lines: [2, 4, 14], watch: { sum: 11 }, verdict: "run", fit: "all", scene: picture([1]),
    },
    {
      title: { vi: "Dời gốc qua 2", en: "Move the root to 2" }, kind: "step",
      body: {
        vi: "Dời từ 1 sang 2 làm hai đỉnh 2 và 4 gần hơn một cạnh, còn 5 đỉnh kia xa thêm một cạnh. Vậy <code>ans[2] = 11 − 2 + 5 = 14</code>.",
        en: "Moving from 1 to 2 brings vertices 2 and 4 one edge closer and puts the other 5 vertices one edge farther away. So <code>ans[2] = 11 − 2 + 5 = 14</code>.",
      },
      note: {
        vi: "Với cạnh cha–con <code>u–v</code>, cộng <code>n − 2 × sz[v]</code> vào tổng cũ.",
        en: "Across parent–child edge <code>u–v</code>, add <code>n − 2 × sz[v]</code> to the old sum.",
      },
      lines: [8, 9, 10], watch: { move: "1 → 2", size: 2, sum: 14 },
      verdict: "run", fit: "all", scene: picture([1, 2], 2, 2, [4]),
    },
    {
      title: { vi: "Sang nhánh còn lại", en: "Visit the other branch" }, kind: "step",
      body: {
        vi: "Sau khi tính <code>ans[4] = 14 + 7 − 2 = 19</code>, DFS trở về 1 rồi sang 3. Lần dời này kéo 4 đỉnh ở nhánh 3 lại gần và đẩy 3 đỉnh còn lại ra xa. Kết quả là <code>ans[3] = 11 − 4 + 3 = 10</code>.",
        en: "After computing <code>ans[4] = 14 + 7 − 2 = 19</code>, DFS returns to 1 and crosses to 3. This move brings the 4 vertices in branch 3 closer and puts the other 3 farther away. Thus <code>ans[3] = 11 − 4 + 3 = 10</code>.",
      },
      lines: [9, 10, 11], watch: { move: "1 → 3", size: 4, sum: 10 },
      verdict: "run", fit: "all", scene: picture([1, 2, 4, 3], 3, 3, [5, 6, 7]),
    },
    {
      title: { vi: "Điền đủ các tổng", en: "Fill in every sum" }, kind: "answer",
      body: {
        vi: "Từ 3 sang 5 được <code>10 + 7 − 2 = 15</code>, còn sang 6 được <code>10 + 7 − 4 = 13</code>. Từ 6 sang 7 được <code>13 + 7 − 2 = 18</code>. Hàng <code>ans</code> giờ có đủ 7 tổng.",
        en: "From 3 to 5 gives <code>10 + 7 − 2 = 15</code>, while 3 to 6 gives <code>10 + 7 − 4 = 13</code>. From 6 to 7 gives <code>13 + 7 − 2 = 18</code>. The <code>ans</code> row now has all 7 sums.",
      },
      lines: [9, 10, 11], watch: { move: "6 → 7", size: 1, sum: 18 },
      verdict: "ac", fit: "all", scene: picture(ALL, 7, 7),
    },
    {
      title: { vi: "Một phép tính mỗi cạnh", en: "One update per edge" }, kind: "recap",
      body: {
        vi: "Cắt cạnh <code>u–v</code> chia cây thành hai phía có đúng <code>sz[v]</code> và <code>n − sz[v]</code> đỉnh, nên dùng lại bảng kích thước ban đầu cho mọi lần dời gốc. Hai lượt DFS tốn O(n) thời gian và O(n) bộ nhớ. Khai báo <code>ans</code> kiểu <code>long long</code> vì tổng khoảng cách trên cây dạng đường thẳng có thể vượt giới hạn <code>int</code>.",
        en: "Cutting <code>u–v</code> gives sides with exactly <code>sz[v]</code> and <code>n − sz[v]</code> vertices, so the original sizes work for every move. The two DFS passes use O(n) time and O(n) space. Store <code>ans</code> as <code>long long</code> because distance sums on a path can exceed <code>int</code>.",
      },
      lines: [5, 10, 14], watch: {}, verdict: "ac", fit: "all", scene: picture(ALL, 0),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  POSITIONS.forEach(([x, y], i) => {
    const u = i + 1;
    scene.add(`v${u}`, { shape: shapes.block({ label: u, w: 38, h: 28, depth: 4 }), x, y });
    const col = i * 0.84;
    scene.add(`col${u}`, { shape: shapes.pill({ text: u, h: 19 }), x: col, y: 7.85, o: 0 });
    scene.add(`size${u}`, { shape: shapes.block({ w: 31, h: 23, depth: 3 }), x: col, y: 9.14, o: 0 });
    scene.add(`sum${u}`, { shape: shapes.block({ w: 31, h: 23, depth: 3 }), x: col, y: 10.43, o: 0 });
  });
  PARENT.slice(1).forEach((p, i) => {
    const u = i + 2;
    scene.link(`e${u}`, { from: `v${p}`, to: `v${u}`, anchor: "center", bend: 0, p: 1 });
  });
  ["u", "sz", "ans"].forEach((key, i) => {
    scene.add(key, { shape: shapes.pill({ text: key, h: 21 }), x: -1.09, y: 7.85 + 1.29 * i, o: 0 });
  });
}
