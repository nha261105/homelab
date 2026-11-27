import type { Lesson, SceneMap } from "../../../lib/types";

const points = {
  A: [0, 2], B: [6, 2], C: [1, 0], D: [5, 4],
  X: [3, 2], E: [4, 2], F: [8, 2], G: [10, 2],
} as const;
type Edge = "AB" | "CD" | "EF" | "FG";

function picture(
  edge: Exclude<Edge, "AB">, formula = "", focus: Edge = edge, result = "", hit = false,
): SceneMap {
  const overlap = edge === "EF" && result === "v-eq";
  const edgeClass = focus === edge ? "v-eq" : "";
  return {
    AB: { p: 1, cls: focus === "AB" && !overlap ? "v-eq" : "" },
    [edge]: { p: 1, cls: overlap ? "" : result || edgeClass },
    [edge[0]]: { o: 1 },
    [edge[1]]: { o: 1 },
    EB: { p: overlap ? 1 : 0, cls: "v-eq", from: { p: 0 }, dur: 420 },
    X: { o: hit ? 1 : 0, cls: "is-good" },
    calc: { text: formula, o: formula ? 1 : 0, cls: result },
  };
}

export const lesson: Lesson = {
  track: "cp",
  topic: "geometry",
  slug: "segment-intersection",
  title: { vi: "Hai đoạn thẳng có cắt nhau?", en: "Do two segments intersect?" },
  added: "2026-11-27",
  summary: {
    vi: "Kiểm tra hướng ở cả hai đoạn, rồi dùng khoảng tọa độ để xử lý các điểm thẳng hàng.",
    en: "Check orientations against both segments and use coordinate ranges for collinear points.",
  },
  level: "hard",
  minutes: 9,
  time: "O(1)",
  memory: "O(1)",
  goal: {
    vi: "Tìm giao của <b>AB</b> với CD, EF và FG, kể cả khi hai đoạn thẳng hàng",
    en: "Test <b>AB</b> against CD, EF, and FG, including collinear segments",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">struct</span> Point { <span class="kw">long long</span> x, y; };',
    '<span class="kw">long long</span> orient(Point a, Point b, Point c) {',
    '  <span class="kw">return</span> (b.x-a.x)*(c.y-a.y) - (b.y-a.y)*(c.x-a.x);',
    '}',
    '<span class="kw">bool</span> inBox(Point a, Point b, Point p) {',
    '  <span class="kw">return</span> min(a.x,b.x) &lt;= p.x &amp;&amp; p.x &lt;= max(a.x,b.x)',
    '      &amp;&amp; min(a.y,b.y) &lt;= p.y &amp;&amp; p.y &lt;= max(a.y,b.y);',
    '}',
    '<span class="kw">bool</span> opposite(<span class="kw">long long</span> x, <span class="kw">long long</span> y) { <span class="kw">return</span> x &amp;&amp; y &amp;&amp; ((x &gt; 0) != (y &gt; 0)); }',
    '<span class="kw">bool</span> intersects(Point a, Point b, Point c, Point d) {',
    '  <span class="kw">auto</span> p = orient(a,b,c), q = orient(a,b,d), r = orient(c,d,a), s = orient(c,d,b);',
    '  <span class="kw">return</span> (opposite(p,q) &amp;&amp; opposite(r,s))',
    '      || (!p &amp;&amp; inBox(a,b,c)) || (!q &amp;&amp; inBox(a,b,d))',
    '      || (!r &amp;&amp; inBox(c,d,a)) || (!s &amp;&amp; inBox(c,d,b));',
    '}',
  ],
  watch: [
    { key: "pair", label: { vi: "hai đoạn", en: "segments" } },
    { key: "pq", label: "(p, q)" },
    { key: "rs", label: "(r, s)" },
    { key: "hit", label: { vi: "có giao?", en: "intersect?" } },
  ],
  practice: [
    { src: "CSES 2190", name: "Line Segment Intersection", lv: "★☆☆", url: "https://cses.fi/problemset/task/2190" },
    { src: "LeetCode 335", name: "Self Crossing", lv: "★★★", url: "https://leetcode.com/problems/self-crossing/" },
  ],
  sceneOptions: { unit: 54 },
  legend: [
    { cls: "ac", label: { vi: "đoạn mốc hoặc phần giao", en: "reference segment or shared part" } },
    { cls: "wa", label: { vi: "đoạn rời AB", en: "disjoint from AB" } },
  ],
  steps: [
    {
      title: { vi: "Tìm điểm chung", en: "Look for a shared point" }, kind: "problem",
      body: {
        vi: "AB nối (0,2) với (6,2), còn CD nối (1,0) với (5,4). Giải phương trình hai đường thẳng rồi kiểm tra đoạn sẽ phải xử lý riêng trường hợp song song hoặc trùng đường. Ta dùng dấu của tích có hướng để tránh phép chia.",
        en: "AB joins (0,2) to (6,2), while CD joins (1,0) to (5,4). Solving for the two lines and then checking the segments needs special handling for parallel or coincident lines. Orientation signs let us avoid division.",
      },
      lines: [], watch: { pair: "AB, CD" }, verdict: "run", fit: "all", scene: picture("CD"),
    },
    {
      title: { vi: "Xét hai đầu CD", en: "Test both CD endpoints" }, kind: "concept",
      body: {
        vi: "Theo hướng A → B, C cho <code>p = 6·(−2) = −12</code>, D cho <code>q = 6·2 = 12</code>. Hai dấu trái nhau, nên CD đi xuyên qua đường thẳng AB.",
        en: "Along A → B, C gives <code>p = 6·(−2) = −12</code> and D gives <code>q = 6·2 = 12</code>. The opposite signs mean CD crosses the line through AB.",
      },
      lines: [2, 3, 11], watch: { pair: "AB, CD", pq: "−12, 12" }, verdict: "run", fit: "all",
      scene: picture("CD", "6·(−2) = −12 < 0 < 12 = 6·2", "AB"),
    },
    {
      title: { vi: "Xét hai đầu AB", en: "Test both AB endpoints" }, kind: "step",
      body: {
        vi: "Đổi sang hướng C → D. A cho <code>r = 4·2 − 4·(−1) = 12</code>, B cho <code>s = 4·2 − 4·5 = −12</code>. Vậy AB cũng đi xuyên qua đường thẳng CD.",
        en: "Switch to C → D. A gives <code>r = 4·2 − 4·(−1) = 12</code> and B gives <code>s = 4·2 − 4·5 = −12</code>. So AB also crosses the line through CD.",
      },
      lines: [2, 3, 11], watch: { pair: "AB, CD", pq: "−12, 12", rs: "12, −12" }, verdict: "run", fit: "all",
      scene: picture("CD", "4·2 − 4·(−1) = 12;   4·2 − 4·5 = −12"),
    },
    {
      title: { vi: "Giao ngay trong đoạn", en: "Cross within both segments" }, kind: "answer",
      body: {
        vi: "Hai cặp dấu đều trái nhau, nên giao điểm nằm trong cả hai đoạn. Sơ đồ đánh dấu X(3,2), trung điểm của cả AB lẫn CD. Hàm chỉ cần trả <code>true</code>.",
        en: "Both pairs have opposite signs, so the intersection lies in the interior of both segments. The diagram marks X(3,2), the midpoint of both AB and CD. The function only needs to return <code>true</code>.",
      },
      lines: [9, 12], watch: { pair: "AB, CD", pq: "−12, 12", rs: "12, −12", hit: "YES" }, verdict: "ac", fit: "all",
      scene: picture("CD", "X = (3,2)", "AB", "v-eq", true),
    },
    {
      title: { vi: "Xét đoạn thẳng hàng", en: "Check collinear overlap" }, kind: "step",
      body: {
        vi: "EF nối (4,2) với (8,2), nên cả bốn tích có hướng đều bằng 0. Vì <code>0 ≤ 4 ≤ 6</code> và <code>y = 2</code>, E nằm trên đoạn AB. Hai đoạn có chung phần từ E đến B.",
        en: "EF joins (4,2) to (8,2), giving four zero cross products. Since <code>0 ≤ 4 ≤ 6</code> and <code>y = 2</code>, E lies on segment AB. The segments overlap from E to B.",
      },
      lines: [5, 6, 7, 11, 13], watch: { pair: "AB, EF", pq: "0, 0", rs: "0, 0", hit: "YES" }, verdict: "ac", fit: "all",
      scene: picture("EF", "6·(2−2) = 0;   0 ≤ 4 ≤ 6", "AB", "v-eq"),
    },
    {
      title: { vi: "Thẳng hàng vẫn rời", en: "Collinear but disjoint" }, kind: "step",
      body: {
        vi: "FG cũng nằm trên đường <code>y = 2</code>, nhưng khoảng x của nó là <code>[8,10]</code>, rời khoảng <code>[0,6]</code> của AB. Bốn tích có hướng vẫn bằng 0, song không đầu mút nào lọt vào hộp tọa độ của đoạn kia.",
        en: "FG also lies on <code>y = 2</code>, but its x-range <code>[8,10]</code> is disjoint from AB's <code>[0,6]</code>. All four orientations are still zero, but no endpoint lies in the other segment's bounding box.",
      },
      lines: [5, 6, 7, 13, 14], watch: { pair: "AB, FG", pq: "0, 0", rs: "0, 0", hit: "NO" }, verdict: "ac", fit: "all",
      scene: picture("FG", "[0,6] ∩ [8,10] = ∅", "AB", "v-gt"),
    },
    {
      title: { vi: "Giao trong hoặc chạm", en: "Crossing or touching" }, kind: "recap",
      body: {
        vi: "Đoạn cắt qua phần trong của nhau khi cả hai cặp dấu đều trái nhau. Mọi giao còn lại đều có ít nhất một đầu mút nằm trên đoạn kia, kể cả chạm đúng đầu mút vì <code>inBox</code> dùng dấu ≤. Số phép tính cố định, nên thời gian và bộ nhớ đều là O(1).",
        en: "The segments cross through their interiors when both sign pairs are opposite. Every other intersection has an endpoint on the other segment, and inclusive ≤ tests in <code>inBox</code> count endpoint contact. The number of operations is fixed, so time and space are both O(1).",
      },
      lines: [9, 12, 13, 14], watch: { pair: "AB, CD", pq: "−12, 12", rs: "12, −12", hit: "YES" }, verdict: "ac", fit: "all",
      scene: picture("CD", "(−12, 12)  ·  (12, −12)", "AB", "v-eq", true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const [id, [x, y]] of Object.entries(points)) {
    scene.add(id, {
      shape: shapes.block({ label: id, sub: `(${x},${y})`, w: 36, h: 21, depth: 4, r: 6 }),
      x, y, o: id === "A" || id === "B" ? 1 : 0,
    });
  }
  for (const edge of ["AB", "CD", "EF", "FG", "EB"]) {
    scene.link(edge, { from: edge[0], to: edge[1], anchor: "center", bend: 0 });
  }
  scene.add("calc", { shape: shapes.pill(), x: 3, y: 6, o: 0 });
}
