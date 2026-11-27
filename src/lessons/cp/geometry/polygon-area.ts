import type { Lesson, SceneMap } from "../../../lib/types";

const vertices = { A: [1, 1], B: [4, 2], C: [3, 5], D: [1, 4] } as const;
const edges = ["AB", "BC", "CD", "DA"] as const;

function picture(
  formula = "", active: readonly string[] = [],
  { ray = false, crossing = false, boundary = false, answer = false } = {},
): SceneMap {
  const scene: SceneMap = {
    Q: { o: ray ? 1 : 0 },
    T: { o: ray ? 1 : 0 },
    X: { o: crossing ? 1 : 0, cls: "is-good" },
    R: { o: boundary ? 1 : 0, cls: "is-good" },
    ray: { p: ray ? 1 : 0, from: { p: 0 }, dur: 420 },
    calc: { text: formula, o: formula ? 1 : 0, cls: answer ? "v-eq" : "" },
  };
  for (const edge of edges) {
    scene[edge] = {
      p: 1,
      o: !active.length || active.includes(edge) ? 1 : 0.45,
      cls: active.includes(edge) ? "v-eq" : "",
    };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "geometry",
  slug: "polygon-area",
  title: { vi: "Diện tích đa giác & điểm trong đa giác", en: "Polygon area and point in polygon" },
  added: "2026-11-27",
  summary: {
    vi: "Cộng tích chéo để tính diện tích, rồi đếm số cạnh một tia cắt qua để xét điểm trong đa giác.",
    en: "Sum cross products for the area, then count the edges a ray crosses to locate a point.",
  },
  level: "hard",
  minutes: 11,
  time: "O(n)",
  memory: "O(1)",
  goal: {
    vi: "Tính diện tích <b>ABCD</b> và xác định Q(2,3), R(1,3) nằm ở đâu",
    en: "Find the area of <b>ABCD</b> and locate Q(2,3) and R(1,3)",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">struct</span> Point { <span class="kw">long long</span> x, y; };',
    '<span class="kw">__int128</span> area2(<span class="kw">const</span> vector&lt;Point&gt;&amp; p) {',
    '  <span class="kw">__int128</span> s = 0;',
    '  <span class="kw">for</span> (size_t i = 0, n = p.size(); i &lt; n; ++i) {',
    '    Point a = p[i], b = p[(i+1)%n]; s += a.x*b.y - a.y*b.x;',
    '  } <span class="kw">return</span> s &lt; 0 ? -s : s;',
    '}',
    '<span class="kw">const char</span>* locate(<span class="kw">const</span> vector&lt;Point&gt;&amp; p, Point q) {',
    '  <span class="kw">bool</span> inside = false;',
    '  <span class="kw">for</span> (size_t i = 0, n = p.size(); i &lt; n; ++i) {',
    '    Point a = p[i], b = p[(i+1)%n];',
    '    <span class="kw">auto</span> d = (b.x-a.x)*(q.y-a.y) - (b.y-a.y)*(q.x-a.x);',
    '    <span class="kw">if</span> (!d &amp;&amp; min(a.x,b.x)&lt;=q.x &amp;&amp; q.x&lt;=max(a.x,b.x)',
    '           &amp;&amp; min(a.y,b.y)&lt;=q.y &amp;&amp; q.y&lt;=max(a.y,b.y)) <span class="kw">return</span> "BOUNDARY";',
    '    <span class="kw">if</span> ((a.y&gt;q.y)!=(b.y&gt;q.y) &amp;&amp; ((d&gt;0)==(b.y&gt;a.y))) inside = !inside;',
    '  } <span class="kw">return</span> inside ? "INSIDE" : "OUTSIDE";',
    '}',
  ],
  watch: [
    { key: "edge", label: { vi: "cạnh đang xét", en: "current edge" } },
    { key: "sum", label: "s" },
    { key: "crossings", label: { vi: "số lần cắt", en: "crossings" } },
    { key: "result", label: { vi: "kết quả", en: "result" } },
  ],
  practice: [
    { src: "CSES 2191", name: "Polygon Area", lv: "★☆☆", url: "https://cses.fi/problemset/task/2191" },
    { src: "CSES 2192", name: "Point in Polygon", lv: "★★☆", url: "https://cses.fi/problemset/task/2192" },
    { src: "CSES 2193", name: "Polygon Lattice Points", lv: "★★★", url: "https://cses.fi/problemset/task/2193" },
  ],
  sceneOptions: { unit: 75 },
  legend: [
    { cls: "ac", label: { vi: "cạnh đang xét hoặc điểm giao", en: "edge in focus or intersection" } },
    { cls: "dim", label: { vi: "cạnh còn lại", en: "other edges" } },
  ],
  steps: [
    {
      title: { vi: "Đọc đường bao", en: "Read the boundary" }, kind: "problem",
      body: {
        vi: "Đa giác đơn có các đỉnh A(1,1), B(4,2), C(3,5), D(1,4) theo thứ tự dọc biên. Tách thành tam giác rồi thử vị trí điểm đòi hỏi chọn đường chéo hợp lệ khi đa giác lõm. Ở đây, cả hai bài toán chỉ cần duyệt các cạnh có sẵn.",
        en: "The simple polygon has vertices A(1,1), B(4,2), C(3,5), D(1,4) in boundary order. Triangulating it and testing the point requires choosing valid diagonals for a concave polygon. Both tasks here can use just the existing edges.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(),
    },
    {
      title: { vi: "Nhân chéo cạnh AB", en: "Cross-multiply along AB" }, kind: "concept",
      body: {
        vi: "Shoelace cộng <code>a.x·b.y − a.y·b.x</code> cho từng cạnh có hướng. Mỗi số hạng là hai lần diện tích có dấu của tam giác tạo bởi gốc tọa độ và cạnh đó. Cạnh AB cho <code>1·2 − 1·4 = −2</code>.",
        en: "Shoelace adds <code>a.x·b.y − a.y·b.x</code> for each directed edge. Each term is twice the signed area of the triangle formed by the origin and that edge. Edge AB contributes <code>1·2 − 1·4 = −2</code>.",
      },
      lines: [3, 4, 5], watch: { edge: "AB", sum: -2 }, verdict: "run", fit: "all",
      scene: picture("AB: 1·2 − 1·4 = −2", ["AB"]),
    },
    {
      title: { vi: "Cộng hai cạnh tiếp", en: "Add the next edges" }, kind: "step",
      body: {
        vi: "Cạnh BC cho <code>4·5 − 2·3 = 14</code>, còn CD cho <code>3·4 − 5·1 = 7</code>. Cộng vào −2 được <code>s = −2 + 14 + 7 = 19</code>.",
        en: "Edge BC contributes <code>4·5 − 2·3 = 14</code>, and CD contributes <code>3·4 − 5·1 = 7</code>. Adding both to −2 gives <code>s = −2 + 14 + 7 = 19</code>.",
      },
      lines: [4, 5], watch: { edge: "BC, CD", sum: 19 }, verdict: "run", fit: "all",
      scene: picture("−2 + 14 + 7 = 19", ["BC", "CD"]),
    },
    {
      title: { vi: "Khép vòng, lấy diện tích", en: "Close the polygon" }, kind: "answer",
      body: {
        vi: "Cạnh cuối D → A cho <code>1·1 − 4·1 = −3</code>, đưa tổng về 16. Lấy trị tuyệt đối sau khi cộng hết rồi chia đôi, ta được diện tích <code>|16| / 2 = 8</code>. Duyệt ngược chiều sẽ đổi dấu của tổng.",
        en: "The closing edge D → A contributes <code>1·1 − 4·1 = −3</code>, bringing the sum to 16. Take the absolute value after summing and divide by two to get <code>|16| / 2 = 8</code>. Reversing the traversal flips the sign of the sum.",
      },
      lines: [5, 6], watch: { edge: "DA", sum: 16, result: "8" }, verdict: "ac", fit: "all",
      scene: picture("|19 − 3| / 2 = 8", ["DA"], { answer: true }),
    },
    {
      title: { vi: "Bắn tia sang phải", en: "Cast a ray right" }, kind: "concept",
      body: {
        vi: "Bắn tia từ Q(2,3) theo chiều x tăng. Chỉ BC và DA có một đầu với <code>y &gt; 3</code> và một đầu với <code>y ≤ 3</code>. Quy tắc nửa mở này bỏ qua cạnh ngang và giúp đếm đúng tại đỉnh.",
        en: "Cast a ray from Q(2,3) in the direction of increasing x. Only BC and DA have one endpoint with <code>y &gt; 3</code> and one with <code>y ≤ 3</code>. This half-open rule skips horizontal edges and handles vertex hits.",
      },
      lines: [9, 10, 11, 15], watch: { edge: "BC, DA", crossings: 0 }, verdict: "run", fit: "all",
      scene: picture("y = 3,  x > 2", ["BC", "DA"], { ray: true }),
    },
    {
      title: { vi: "Đếm giao phía trước", en: "Count hits ahead" }, kind: "step",
      body: {
        vi: "DA gặp đường <code>y = 3</code> ở x = 1, phía sau Q. Với BC, <code>d = (−1)·1 − 3·(−2) = 5</code> cùng dấu với <code>b.y − a.y = 3</code>, nên giao điểm ở bên phải Q, tại x = 11/3. Hàm đổi <code>inside</code> đúng một lần mà không cần chia.",
        en: "DA meets the line <code>y = 3</code> at x = 1, behind Q. For BC, <code>d = (−1)·1 − 3·(−2) = 5</code> has the same sign as <code>b.y − a.y = 3</code>, so the hit is to the right of Q at x = 11/3. The function flips <code>inside</code> exactly once without dividing.",
      },
      lines: [12, 15], watch: { edge: "BC, DA", crossings: 1 }, verdict: "run", fit: "all",
      scene: picture("x = 11/3 > 2", ["BC"], { ray: true, crossing: true }),
    },
    {
      title: { vi: "Số lẻ: ở trong", en: "Odd means inside" }, kind: "answer",
      body: {
        vi: "Phía xa theo hướng tia chắc chắn nằm ngoài đa giác. Mỗi lần cắt thực sự qua biên lại đổi giữa trong và ngoài. Tia từ Q có một giao điểm nên Q nằm trong, còn số giao chẵn sẽ cho <code>OUTSIDE</code>.",
        en: "Far along the ray we are outside the polygon. Every true crossing switches between inside and outside. The ray from Q has one crossing, so Q is inside, while an even count would yield <code>OUTSIDE</code>.",
      },
      lines: [15, 16], watch: { crossings: 1, result: "INSIDE" }, verdict: "ac", fit: "all",
      scene: picture("1 mod 2 = 1  ·  INSIDE", ["BC"], { ray: true, crossing: true, answer: true }),
    },
    {
      title: { vi: "Kiểm tra điểm biên", en: "Check for boundary" }, kind: "answer",
      body: {
        vi: "Với R(1,3), tích <code>orient(D,A,R) = 0</code>. R có x = 1 và <code>1 ≤ 3 ≤ 4</code> theo y, nên nó thuộc đoạn DA. Trả <code>BOUNDARY</code> ngay khi gặp cạnh chứa điểm.",
        en: "For R(1,3), <code>orient(D,A,R) = 0</code>. Its x is 1 and its y satisfies <code>1 ≤ 3 ≤ 4</code>, so it lies on segment DA. Return <code>BOUNDARY</code> as soon as an edge contains the point.",
      },
      lines: [12, 13, 14], watch: { edge: "DA", result: "BOUNDARY" }, verdict: "ac", fit: "all",
      scene: picture("d = 0;  1 ≤ 3 ≤ 4", ["DA"], { boundary: true, answer: true }),
    },
    {
      title: { vi: "Mỗi cạnh một lượt", en: "One pass over edges" }, kind: "recap",
      body: {
        vi: "Khi cộng các tam giác có dấu, phần ngoài đa giác triệt tiêu và phần trong cho hai lần diện tích. Khi đếm tia, nếu tia qua đỉnh thì quy tắc nửa mở đếm một lần nếu đi xuyên biên, hoặc 0 hay 2 lần nếu chỉ chạm đỉnh. Tính diện tích và kiểm tra mỗi điểm đều tốn O(n) thời gian và O(1) bộ nhớ phụ.",
        en: "The signed triangles cancel outside the polygon and yield twice the area inside. At a vertex, the half-open ray test counts once for a crossing and zero or twice for a touch. Computing the area and testing each point both take O(n) time and O(1) extra space.",
      },
      lines: [5, 6, 13, 14, 15, 16], watch: { edge: "DA", sum: 16, result: "BOUNDARY" }, verdict: "ac", fit: "all",
      scene: picture("|16| / 2 = 8   ·   R ∈ DA", ["DA"], { boundary: true, answer: true }),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const [label, [x, y]] of Object.entries(vertices)) {
    scene.add(label, { shape: shapes.block({ label, sub: `(${x},${y})`, w: 36, h: 21, depth: 4, r: 6 }), x, y });
  }
  for (const edge of edges) {
    scene.link(edge, { from: edge[0], to: edge[1], anchor: "center", arrow: true, bend: 0 });
  }
  scene.add("Q", { shape: shapes.block({ label: "Q", sub: "(2,3)", w: 36, h: 21, depth: 4, r: 6 }), x: 2, y: 3, o: 0 });
  scene.add("R", { shape: shapes.block({ label: "R", w: 32, h: 21, depth: 4, r: 6 }), x: 1, y: 3, o: 0 });
  scene.add("X", { shape: shapes.block({ label: "×", w: 18, h: 21, depth: 4, r: 6 }), x: 11 / 3, y: 3, o: 0 });
  scene.add("T", { shape: shapes.block({ w: 0, h: 21, depth: 4 }), x: 5.5, y: 3, o: 0 });
  scene.link("ray", { from: "Q", to: "T", anchor: "center", arrow: true, bend: 0 });
  scene.add("calc", { shape: shapes.pill(), x: 2.6, y: 6.85, o: 0 });
}
