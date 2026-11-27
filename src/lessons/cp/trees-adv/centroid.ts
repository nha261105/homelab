import type { Lesson, SceneMap } from "../../../lib/types";

const vertices = [1, 2, 3, 4, 5, 6, 7, 8];
const edges = [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [5, 8]];
const acrossRoot = [1, 2, 3, 4, 5, 8];
const insideRight = [7, 6, 5, 8];

interface Picture {
  path?: number[];
  cut?: number[];
  centroids?: number[];
  tooLargeAt?: number;
  formula?: string;
  levels?: boolean;
  answer?: boolean;
}

function picture({
  path = [], cut = [], centroids = [], tooLargeAt, formula = "", levels = false, answer = false,
}: Picture = {}): SceneMap {
  const scene: SceneMap = {
    calc: { text: formula, o: formula ? 1 : 0, cls: answer ? "v-eq" : "" },
  };
  for (const v of vertices) {
    const removed = cut.includes(v);
    const selected = centroids.includes(v);
    scene[`v${v}`] = {
      cls: removed ? "is-out" : selected ? "is-good" : v === tooLargeAt ? "is-bad" : path.includes(v) ? "is-active" : "",
      o: removed ? 0.6 : 1,
      ...(selected ? { fx: { type: "pulse", delay: 240 } } : {}),
    };
  }
  edges.forEach(([u, v], i) => {
    const removed = cut.includes(u) || cut.includes(v);
    const onPath = path.some((w, j) => (w === u && path[j + 1] === v) || (w === v && path[j + 1] === u));
    scene[`e${i}`] = {
      p: removed ? 0 : 1,
      o: path.length && !onPath ? 0.32 : 1,
      cls: onPath && answer ? "v-eq" : "",
      ...(onPath && answer ? { from: { p: 0 }, delay: 100, dur: 410 } : {}),
    };
  });
  for (let level = 0; level < 4; level++) scene[`level${level}`] = { o: levels ? 1 : 0 };
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "trees-adv", slug: "centroid",
  title: { vi: "Phân rã trọng tâm", en: "Centroid decomposition" },
  added: "2026-11-27",
  summary: {
    vi: "Tách cây thành các phần không quá nửa và xác định tầng xử lý từng đường đi.",
    en: "Split a tree into at-most-half pieces and identify the level that handles each path.",
  },
  level: "hard", minutes: 12, time: "O(n log n)", memory: "O(n)",
  goal: { vi: "Tìm tầng xử lý đường <b>7 → 8</b> trong cây 8 đỉnh", en: "Find which level handles <b>7 → 8</b> in an 8-vertex tree" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> sizes(<span class="kw">int</span> u, <span class="kw">int</span> p) {',
    '  sz[u] = 1;',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[u]) <span class="kw">if</span> (v != p &amp;&amp; !cut[v]) sz[u] += sizes(v, u);',
    '  <span class="kw">return</span> sz[u];',
    '}',
    '<span class="kw">int</span> find_centroid(<span class="kw">int</span> u, <span class="kw">int</span> p, <span class="kw">int</span> m) {',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[u])',
    '    <span class="kw">if</span> (v != p &amp;&amp; !cut[v] &amp;&amp; sz[v] &gt; m / 2) <span class="kw">return</span> find_centroid(v, u, m);',
    '  <span class="kw">return</span> u;',
    '}',
    '<span class="kw">void</span> decompose(<span class="kw">int</span> u, <span class="kw">int</span> level) {',
    '  <span class="kw">int</span> c = find_centroid(u, 0, sizes(u, 0));',
    '  cdLevel[c] = level; cut[c] = <span class="kw">true</span>;',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[c]) <span class="kw">if</span> (!cut[v]) decompose(v, level + 1);',
    '}',
  ],
  watch: [
    { key: "u", label: "u" }, { key: "m", label: "m" },
    { key: "c", label: "c" }, { key: "level", label: "level" },
  ],
  practice: [
    { src: "CSES 2079", name: "Finding a Centroid", lv: "★★☆", url: "https://cses.fi/problemset/task/2079" },
    { src: "CSES 2080", name: "Fixed-Length Paths I", lv: "★★★", url: "https://cses.fi/problemset/task/2080" },
  ],
  sceneOptions: { unit: 47 },
  legend: [
    { cls: "acc", label: { vi: "đường đi đang xét", en: "path in focus" } },
    { cls: "ac", label: { vi: "trọng tâm đã chọn", en: "chosen centroid" } },
    { cls: "wa", label: { vi: "đỉnh có nhánh quá lớn", en: "vertex with an oversized branch" } },
    { cls: "dim", label: { vi: "đỉnh đã cắt", en: "removed vertex" } },
  ],
  steps: [
    {
      title: { vi: "Chia việc theo đường đi", en: "Group paths by separator" }, kind: "problem",
      body: {
        vi: "Muốn đếm các đường đi dài đúng 3 cạnh, chẳng hạn 7 → 6 → 5 → 8, ta có thể thử từng cặp đầu mút, nhưng riêng việc liệt kê đã có Θ(n²) cặp. Ta sẽ chia các đường đi theo trọng tâm đầu tiên nằm trên chúng, để có thể gộp nhiều cặp theo khoảng cách tới cùng một đỉnh.",
        en: "To count paths of exactly 3 edges, such as 7 → 6 → 5 → 8, we could try every pair of endpoints, but there are Θ(n²) pairs to enumerate. We'll group paths by the first centroid on them, so we can combine many endpoint pairs by their distance to the same vertex.",
      },
      lines: [], watch: { m: 8 }, verdict: "run", fit: "all", scene: picture({ path: insideRight }),
    },
    {
      title: { vi: "Đi về nhánh lớn", en: "Follow the oversized branch" }, kind: "concept",
      body: {
        vi: "Trọng tâm của thành phần có <code>m</code> đỉnh là đỉnh mà khi bỏ đi, mỗi phần còn lại có nhiều nhất <code>⌊m/2⌋</code> đỉnh. Bắt đầu DFS ở 3, ta có <code>m = 8</code>. Nhánh qua 4 có 5 đỉnh, lớn hơn 4, nên đi sang 4.",
        en: "A centroid of an <code>m</code>-vertex component leaves pieces of at most <code>⌊m/2⌋</code> vertices when removed. Start the DFS at 3 and get <code>m = 8</code>. The branch through 4 has 5 vertices, more than 4, so move to 4.",
      },
      lines: [1, 2, 3, 4, 6, 7, 8, 12], watch: { u: 3, m: 8, level: 0 }, verdict: "run", fit: "all",
      scene: picture({ tooLargeAt: 3, formula: "sz[4] = 5 > ⌊8/2⌋" }),
    },
    {
      title: { vi: "Chốt trọng tâm 4", en: "Choose centroid 4" }, kind: "step",
      body: {
        vi: "Từ 4, nhánh qua 5 có 4 đỉnh, phần quay về 3 có <code>8 − sz[4] = 3</code> đỉnh. Cả hai đều không quá 4, nên chọn 4. Mỗi lần bước vào nhánh lớn hơn nửa, phần phía sau tự động nhỏ hơn nửa, vì vậy <code>find_centroid</code> có thể bỏ qua cha.",
        en: "From 4, the branch through 5 has 4 vertices, and the side back through 3 has <code>8 − sz[4] = 3</code>. Both are at most 4, so choose 4. After stepping into a branch larger than half, the side behind us is smaller than half, so <code>find_centroid</code> can skip the parent.",
      },
      lines: [6, 7, 8, 9, 12], watch: { u: 4, m: 8, c: 4, level: 0 }, verdict: "run", fit: "all",
      scene: picture({ centroids: [4], formula: "max(3, 4) = 4 ≤ ⌊8/2⌋" }),
    },
    {
      title: { vi: "Cắt thành hai phần", en: "Split into two pieces" }, kind: "step",
      body: {
        vi: "Ghi <code>cdLevel[4] = 0</code>, rồi đánh dấu <code>cut[4]</code>. Các cạnh 3–4 và 4–5 biến mất khỏi cây đang xét, để lại hai thành phần <code>{1, 2, 3}</code> và <code>{5, 6, 7, 8}</code>.",
        en: "Set <code>cdLevel[4] = 0</code>, then mark <code>cut[4]</code>. Edges 3–4 and 4–5 disappear from the active tree, leaving components <code>{1, 2, 3}</code> and <code>{5, 6, 7, 8}</code>.",
      },
      lines: [13, 14], watch: { c: 4, level: 0 }, verdict: "run", fit: "all",
      scene: picture({ cut: [4], formula: "{1, 2, 3}   ·   {5, 6, 7, 8}" }),
    },
    {
      title: { vi: "Tìm trong từng phần", en: "Recurse on each piece" }, kind: "step",
      body: {
        vi: "Tính lại <code>sz</code> trong từng thành phần, bỏ qua các đỉnh đã cắt. Phần trái chọn 2 vì hai nhánh đều có 1 đỉnh. Phần phải bắt đầu ở 5, có nhánh qua 6 gồm 2 đỉnh và nhánh qua 8 gồm 1 đỉnh, nên chọn 5.",
        en: "Recompute <code>sz</code> within each component, skipping removed vertices. The left piece chooses 2 because both branches have 1 vertex. The right piece starts at 5 and has a size-2 branch through 6 and a size-1 branch through 8, so it chooses 5.",
      },
      lines: [3, 8, 9, 12, 14], watch: { m: "3, 4", c: "2, 5", level: 1 }, verdict: "run", fit: "all",
      scene: picture({ cut: [4], centroids: [2, 5], formula: "cdLevel[2] = cdLevel[5] = 1" }),
    },
    {
      title: { vi: "Xử lý đường qua 4", en: "Handle a path through 4" }, kind: "step",
      body: {
        vi: "Nhìn lại tầng 0: 1 và 8 nằm ở hai phía của 4, nên đường 1 → 8 đi qua 4 và được xử lý ngay tại đây. Độ dài là <code>dist(1, 4) + dist(4, 8) = 3 + 2 = 5</code>.",
        en: "Look back at level 0. Vertices 1 and 8 are on opposite sides of 4, so their path goes through 4 and is handled here. Its length is <code>dist(1, 4) + dist(4, 8) = 3 + 2 = 5</code>.",
      },
      lines: [12, 13], watch: { c: 4, level: 0 }, verdict: "run", fit: "all",
      scene: picture({ centroids: [4], path: acrossRoot, formula: "dist(1, 8) = 3 + 2 = 5" }),
    },
    {
      title: { vi: "Đường 7–8 qua 5", en: "Path 7–8 crosses 5" }, kind: "answer",
      body: {
        vi: "Cả 7 và 8 cùng còn ở phần bên phải sau khi cắt 4. Tại tầng 1, 5 tách hai đầu mút, nên xử lý đường này ở 5 với độ dài <code>2 + 1 = 3</code>. Khi đếm đường dài 3, ta ghép độ sâu 2 của 7 với độ sâu 1 của 8 từ hai nhánh khác nhau.",
        en: "Vertices 7 and 8 both remain in the right piece after cutting 4. At level 1, vertex 5 separates them, so handle the path at 5 with length <code>2 + 1 = 3</code>. To count length-3 paths, pair vertex 7 at depth 2 with vertex 8 at depth 1 from different branches.",
      },
      lines: [12, 13, 14], watch: { m: 4, c: 5, level: 1 }, verdict: "ac", fit: "all",
      scene: picture({ cut: [4], centroids: [5], path: insideRight, formula: "dist(7, 8) = 2 + 1 = 3", answer: true }),
    },
    {
      title: { vi: "Mỗi đường một tầng", en: "One level per path" }, kind: "recap",
      body: {
        vi: "Hàng dưới liệt kê các trọng tâm theo tầng, từ 0 đến 3. Một đường chỉ được tính ở trọng tâm đầu tiên nằm trên nó: khi cắt trọng tâm, hai đầu mút thuộc hai phần khác nhau hoặc một đầu mút bị cắt. Mỗi phần co lại ít nhất một nửa, nên O(log n) tầng, mỗi tầng duyệt tổng cộng O(n) đỉnh và cạnh, với O(n) bộ nhớ.",
        en: "The bottom row lists centroids by level, from 0 to 3. A path is counted at its first centroid: removing that centroid separates the endpoints or removes one of them. Each component shrinks by at least half, so O(log n) levels take O(n) vertex and edge visits each, with O(n) space.",
      },
      lines: [11, 12, 13, 14], watch: { c: 5, level: 1 }, verdict: "ac", fit: "all",
      scene: picture({ centroids: [5], path: insideRight, levels: true, answer: true }),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const v of vertices) {
    const x = v === 8 ? 4 : v - 1;
    const y = v === 8 ? 1.45 : 0;
    scene.add(`v${v}`, { shape: shapes.block({ label: v, w: 39, h: 30, depth: 4 }), x, y });
  }
  edges.forEach(([u, v], i) => {
    scene.link(`e${i}`, { from: `v${u}`, to: `v${v}`, anchor: "center", bend: 0 });
  });
  scene.add("calc", { shape: shapes.pill(), x: 3, y: 2.8, o: 0 });
  const levels = ["0: 4", "1: 2 5", "2: 1 3 6 8", "3: 7"];
  const positions = [0.43, 1.9, 3.94, 5.84];
  levels.forEach((text, i) => {
    scene.add(`level${i}`, { shape: shapes.pill({ text, pad: 7 }), x: positions[i], y: 2.8, o: 0 });
  });
}
