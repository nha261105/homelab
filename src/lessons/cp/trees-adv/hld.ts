import type { Lesson, SceneMap } from "../../../lib/types";

const parent = [0, 0, 1, 1, 2, 2, 3, 4, 6];
const value = [0, 4, 9, 3, 2, 7, 6, 12, 5];
const vertices = [1, 2, 3, 4, 5, 6, 7, 8];
const positions = [
  [0, 1.55], [1.65, 0], [1.65, 3.6], [3.3, 0],
  [2.55, 1.55], [3.3, 3.6], [4.95, 0], [4.95, 3.6],
];
const heavyChildren = [2, 4, 7, 6, 8];
const order = [1, 2, 4, 7, 5, 3, 6, 8];
const queryPath = [5, 2, 1, 3, 6, 8];
const ranges = [[4, 4], [5, 7], [0, 1]];
const maxima = ranges.map(([l, r]) => Math.max(...order.slice(l, r + 1).map((v) => value[v])));
const answer = Math.max(...maxima);

interface Picture {
  focus?: number[];
  heavy?: boolean;
  row?: boolean;
  taken?: number;
  formula?: string;
}

function picture({ focus = [], heavy = false, row = false, taken = 0, formula = "" }: Picture = {}): SceneMap {
  const collected = ranges.slice(0, taken).flatMap(([l, r]) => order.slice(l, r + 1));
  const finished = taken === ranges.length;
  const scene: SceneMap = {
    calc: { text: formula, o: formula ? 1 : 0, cls: finished ? "v-eq" : "" },
  };
  for (const v of vertices) {
    const cls = focus.includes(v) && !finished ? "is-active" : collected.includes(v) ? "is-good" : "";
    scene[`v${v}`] = { cls };
    scene[`cell${v}`] = { o: row ? 1 : 0, cls };
    if (v === 1) continue;
    const p = parent[v];
    const onPath = queryPath.includes(v) && queryPath.includes(p);
    const queried = taken > 0 && onPath && [v, p].every((u) => collected.includes(u) || focus.includes(u));
    const isHeavy = heavy && heavyChildren.includes(v);
    const jump = (taken === 1 && v === 5) || (taken === 2 && v === 3);
    const shown = queried || jump || (taken === 0 && (isHeavy || (!heavy && onPath)));
    scene[`e${v}`] = {
      p: 1,
      o: shown ? 1 : 0.3,
      cls: (finished && queried) || (taken === 0 && isHeavy) ? "v-eq" : "",
      ...(jump ? { from: { p: 0 }, delay: 180, dur: 390 } : {}),
    };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "trees-adv", slug: "hld",
  title: { vi: "Heavy-light decomposition", en: "Heavy-light decomposition" },
  added: "2026-11-27",
  summary: {
    vi: "Đánh số theo chuỗi nặng để biến truy vấn trên đường đi thành vài truy vấn đoạn.",
    en: "Number vertices by heavy chain to turn a path query into a few range queries.",
  },
  level: "hard", minutes: 12, time: "O(n + q log² n)", memory: "O(n)",
  goal: { vi: "Tìm giá trị lớn nhất trên đường <b>5 → 8</b>", en: "Find the maximum value on the path <b>5 → 8</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">void</span> flatten(<span class="kw">int</span> u, <span class="kw">int</span> h) {',
    '  head[u] = h; pos[u] = timer++; base[pos[u]] = a[u];',
    '  <span class="kw">if</span> (heavy[u]) flatten(heavy[u], h);',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : children[u]) <span class="kw">if</span> (v != heavy[u]) flatten(v, v);',
    '}',
    '<span class="kw">int</span> path_max(<span class="kw">int</span> u, <span class="kw">int</span> v) {',
    '  <span class="kw">int</span> ans = INT_MIN;',
    '  <span class="kw">while</span> (head[u] != head[v]) {',
    '    <span class="kw">if</span> (depth[head[u]] &lt; depth[head[v]]) swap(u, v);',
    '    ans = max(ans, seg.max(pos[head[u]], pos[u]));',
    '    u = parent[head[u]];',
    '  }',
    '  <span class="kw">if</span> (pos[u] &gt; pos[v]) swap(u, v);',
    '  <span class="kw">return</span> max(ans, seg.max(pos[u], pos[v]));',
    '}',
  ],
  watch: [
    { key: "ends", label: "(u, v)" }, { key: "heads", label: "(head[u], head[v])" },
    { key: "range", label: { vi: "đoạn chỉ số", en: "index interval" } },
    { key: "ans", label: "ans" },
  ],
  practice: [
    { src: "CSES 2134", name: "Path Queries II", lv: "★★★", url: "https://cses.fi/problemset/task/2134" },
    { src: "Codeforces 191C", name: "Fools and Roads", lv: "★★★", url: "https://codeforces.com/problemset/problem/191/C" },
  ],
  sceneOptions: { unit: 41 },
  legend: [
    { cls: "acc", label: { vi: "đỉnh hoặc đoạn đang xét", en: "current vertex or interval" } },
    { cls: "ac", label: { vi: "cạnh nặng hoặc đoạn đã lấy", en: "heavy edge or collected interval" } },
  ],
  steps: [
    {
      title: { vi: "Hỏi max trên đường", en: "Query a path maximum" }, kind: "problem",
      body: {
        vi: "Cây có gốc 1, số dưới mỗi đỉnh là giá trị của nó. Ta cần tìm max trên đường 5 → 2 → 1 → 3 → 6 → 8. Khi có nhiều truy vấn xen kẽ cập nhật, đi qua từng đỉnh có thể tốn O(n) cho mỗi câu hỏi.",
        en: "The tree is rooted at 1, and each vertex has its value underneath. Find the maximum along 5 → 2 → 1 → 3 → 6 → 8. With many queries interleaved with updates, walking each path can cost O(n) per query.",
      },
      lines: [], watch: { ends: "(5, 8)" }, verdict: "run", fit: "all", scene: picture({ focus: queryPath }),
    },
    {
      title: { vi: "Đếm kích thước cây con", en: "Count subtree sizes" }, kind: "concept",
      body: {
        vi: "DFS từ gốc 1 để lưu <code>parent</code>, <code>depth</code> và các con. Khi quay lui, tính <code>size[u]</code> bằng 1 cộng kích thước các cây con. Nhánh gốc 2 có 4 đỉnh, nhánh gốc 3 có 3 đỉnh.",
        en: "Run DFS from root 1 to record <code>parent</code>, <code>depth</code>, and children. On the way back, compute <code>size[u]</code> as 1 plus the sizes of its children's subtrees. The subtree rooted at 2 has 4 vertices, and the one at 3 has 3.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all",
      scene: picture({ focus: [2, 3], formula: "size[2] = 4 > 3 = size[3]" }),
    },
    {
      title: { vi: "Nối các cạnh nặng", en: "Join the heavy edges" }, kind: "step",
      body: {
        vi: "Mỗi đỉnh chọn một con có cây con lớn nhất làm <code>heavy[u]</code>, chọn tùy ý nếu hòa và dùng 0 ở lá. Vì 4 &gt; 3, cạnh 1–2 là cạnh nặng, còn 1–3 là cạnh nhẹ. Nối theo các cạnh nặng được ba chuỗi 1–2–4–7, 5 và 3–6–8.",
        en: "Choose a child with the largest subtree as <code>heavy[u]</code>, breaking ties arbitrarily and using 0 at leaves. Since 4 &gt; 3, edge 1–2 is heavy and 1–3 is light. Following the heavy edges gives three chains: 1–2–4–7, 5, and 3–6–8.",
      },
      lines: [3, 4], watch: {}, verdict: "run", fit: "all",
      scene: picture({ heavy: true, focus: [1, 5, 3], formula: "head[8] = 3" }),
    },
    {
      title: { vi: "Trải cây thành mảng", en: "Flatten the tree" }, kind: "step",
      body: {
        vi: "Đặt <code>timer = 0</code> và gọi <code>flatten(1, 1)</code>. Luôn thăm con nặng trước nên các đỉnh 1, 2, 4, 7 nằm liền nhau ở chỉ số 0 đến 3. Mỗi ô ghi giá trị, bên dưới là đỉnh và chỉ số (<code>v7@3</code>), rồi ta dựng segment tree lấy max trên mảng <code>base</code>.",
        en: "Set <code>timer = 0</code> and call <code>flatten(1, 1)</code>. Visiting the heavy child first puts vertices 1, 2, 4, 7 together at indices 0 through 3. Each cell shows its value above the vertex and index (<code>v7@3</code>), and we build a max segment tree on <code>base</code>.",
      },
      lines: [1, 2, 3, 4], watch: { range: "[0, 3]" }, verdict: "run", fit: "all",
      scene: picture({ heavy: true, row: true, focus: [1, 2, 4, 7] }),
    },
    {
      title: { vi: "Lấy đoạn ở đỉnh 5", en: "Take vertex 5's interval" }, kind: "step",
      body: {
        vi: "Đầu chuỗi của 5 sâu 2, còn đầu chuỗi 3 của đỉnh 8 sâu 1. Lấy đoạn từ đầu chuỗi sâu hơn đến 5, tức <code>[4, 4]</code>, được 7. Sau đó nhảy từ đầu chuỗi 5 lên cha là 2.",
        en: "Vertex 5's chain head is at depth 2, while vertex 8's head, 3, is at depth 1. Take the interval from the deeper head through 5, namely <code>[4, 4]</code>, with maximum 7. Then jump from head 5 to its parent, 2.",
      },
      lines: [8, 9, 10, 11], watch: { ends: "(5, 8)", heads: "(5, 3)", range: "[4, 4]", ans: maxima[0] }, verdict: "run", fit: "all",
      scene: picture({ heavy: true, row: true, taken: 1, focus: [5], formula: "max[4, 4] = 7" }),
    },
    {
      title: { vi: "Lấy đoạn qua 3", en: "Take the interval through 3" }, kind: "step",
      body: {
        vi: "Giờ 2 thuộc chuỗi đầu 1, còn 8 thuộc chuỗi đầu 3. Đổi chỗ hai đầu truy vấn để xử lý chuỗi đầu 3 sâu hơn. Đoạn <code>[5, 7]</code> cho <code>max(3, 6, 5) = 6</code>, rồi nhảy từ 3 lên 1.",
        en: "Now 2 belongs to the chain headed by 1, and 8 belongs to the chain headed by 3. Swap the query endpoints to handle the deeper head, 3. Interval <code>[5, 7]</code> gives <code>max(3, 6, 5) = 6</code>, then jump from 3 to 1.",
      },
      lines: [8, 9, 10, 11], watch: { ends: "(8, 2)", heads: "(3, 1)", range: "[5, 7]", ans: 7 }, verdict: "run", fit: "all",
      scene: picture({ heavy: true, row: true, taken: 2, focus: [3, 6, 8], formula: "max[5, 7] = 6" }),
    },
    {
      title: { vi: "Gộp ba đoạn", en: "Combine three intervals" }, kind: "answer",
      body: {
        vi: "Hai đầu còn lại là 1 và 2, cùng chuỗi đầu 1. Lấy <code>[0, 1]</code> được <code>max(4, 9) = 9</code>. Ba đoạn phủ đúng đường 5 → 8, nên đáp án là <code>max(7, 6, 9) = 9</code>.",
        en: "The remaining endpoints, 1 and 2, share head 1. Interval <code>[0, 1]</code> gives <code>max(4, 9) = 9</code>. The three intervals cover exactly the path from 5 to 8, so the answer is <code>max(7, 6, 9) = 9</code>.",
      },
      lines: [12, 13, 14], watch: { ends: "(1, 2)", heads: "(1, 1)", range: "[0, 1]", ans: answer }, verdict: "ac", fit: "all",
      scene: {
        ...picture({ heavy: true, row: true, taken: 3, formula: "max(7, 6, 9) = 9" }),
        v2: { cls: "is-good", fx: { type: "pulse", delay: 250 } },
      },
    },
    {
      title: { vi: "Qua ít cạnh nhẹ", en: "Cross few light edges" }, kind: "recap",
      body: {
        vi: "Mỗi lần lấy đoạn ở chuỗi có đầu sâu hơn, phần đường còn lại bắt đầu tại cha của đầu chuỗi. Qua một cạnh nhẹ theo chiều xuống, kích thước cây con giảm ít nhất một nửa, nên hai nhánh từ LCA chỉ qua O(log n) chuỗi. Dựng HLD và segment tree tốn O(n), hỏi max với các đoạn đóng tốn O(log² n), còn cập nhật một đỉnh tại <code>pos[u]</code> tốn O(log n).",
        en: "After taking the interval on the chain with the deeper head, the remaining path starts at that head's parent. Descending a light edge at least halves the subtree size, so the two branches from the LCA cross only O(log n) chains. Building HLD and the segment tree costs O(n), querying inclusive intervals costs O(log² n) per path, and updating one vertex at <code>pos[u]</code> costs O(log n).",
      },
      lines: [8, 9, 10, 11, 14], watch: { ans: answer }, verdict: "ac", fit: "all",
      scene: picture({ heavy: true, row: true, taken: 3, formula: "max(7, 6, 9) = 9" }),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const v of vertices) {
    const [x, y] = positions[v - 1];
    scene.add(`v${v}`, { shape: shapes.block({ label: v, sub: value[v], w: 41, h: 29, depth: 4 }), x, y });
    if (v !== 1) scene.link(`e${v}`, { from: `v${parent[v]}`, to: `v${v}`, anchor: "center", bend: 0 });
  }
  order.forEach((v, i) => {
    const x = i + (i >= 4 ? 0.21 : 0) + (i >= 5 ? 0.21 : 0);
    scene.add(`cell${v}`, {
      shape: shapes.block({ label: value[v], sub: `v${v}@${i}`, w: 36, h: 27, depth: 4 }),
      x, y: 6.65, o: 0,
    });
  });
  scene.add("calc", { shape: shapes.pill(), x: 3.7, y: 9.45, o: 0 });
}
