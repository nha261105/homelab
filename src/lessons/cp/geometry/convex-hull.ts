import type { Lesson, SceneMap } from "../../../lib/types";

const POINTS = {
  A: [0, 2], B: [1, 0], C: [2, 2], D: [3, 1], E: [4, 5], F: [5, 2],
} as const;
type Point = keyof typeof POINTS;
type Turn = [Point, Point, Point];
const ORDER: Point[] = ["A", "B", "C", "D", "E", "F"];
const LOWER: Point[] = ["A", "B", "D", "F"];
const UPPER: Point[] = ["F", "E", "A"];
const edge = (a: Point, b: Point) => a < b ? a + b : b + a;

function turn([a, b, c]: Turn) {
  const [ax, ay] = POINTS[a];
  const [bx, by] = POINTS[b];
  const [cx, cy] = POINTS[c];
  const [ux, uy, vx, vy] = [bx - ax, by - ay, cx - ax, cy - ay];
  const value = ux * vy - uy * vx;
  const factor = (v: number) => v < 0 ? `(−${-v})` : String(v);
  return `${a}${b}${c}: ${factor(ux)}·${factor(vy)} − ${factor(uy)}·${factor(vx)} = ${value < 0 ? `−${-value}` : value}`;
}

function picture({
  lower = [], upper = [], tests = [], formula = "", rejected = [], trial = [], done = false,
}: {
  lower?: Point[]; upper?: Point[]; tests?: Turn[]; formula?: string;
  rejected?: Point[]; trial?: [Point, Point][]; done?: boolean;
} = {}): SceneMap {
  const first = tests[0] ? turn(tests[0]) : formula;
  const second = tests[1] ? turn(tests[1]) : "";
  const scene: SceneMap = {
    calc: { text: first, o: first ? 1 : 0, cls: done ? "v-eq" : "" },
    check: { text: second, o: second ? 1 : 0 },
  };
  const inChain = new Set([...lower, ...upper]);
  for (const p of ORDER) {
    scene[p] = {
      cls: rejected.includes(p) ? "is-bad" : done && inChain.has(p) ? "is-good"
        : inChain.has(p) ? "is-active" : done ? "is-out" : "",
    };
  }
  for (const chain of [lower, upper]) {
    for (let i = 1; i < chain.length; ++i) {
      scene[edge(chain[i - 1], chain[i])] = { p: 1, cls: done ? "v-eq" : "" };
    }
  }
  for (const [a, b] of trial) {
    scene[edge(a, b)] = { p: 1, cls: "v-gt", from: { p: 0 }, delay: 200, dur: 360 };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "geometry", slug: "convex-hull",
  title: { vi: "Bao lồi", en: "Convex hull" },
  added: "2026-11-27",
  summary: {
    vi: "Dựng hai nửa của bao lồi bằng thuật toán monotone chain và kiểm tra hướng rẽ.",
    en: "Build both halves of a convex hull with the monotone chain algorithm and turn tests.",
  },
  level: "hard", minutes: 10, time: "O(n log n)", memory: "O(n)",
  goal: {
    vi: "Tìm đường bao lồi và giữ <b>mọi điểm nằm trên biên</b>",
    en: "Find the convex hull and keep <b>every boundary point</b>",
  },
  codeLang: "C++17",
  code: [
    'using P = pair&lt;<span class="kw">long long</span>, <span class="kw">long long</span>&gt;;',
    '<span class="kw">auto</span> cross = [](P a, P b, P c) {',
    '  <span class="kw">return</span> (b.first-a.first)*(c.second-a.second)',
    '       - (b.second-a.second)*(c.first-a.first);',
    '};',
    'sort(p.begin(), p.end());',
    'p.erase(unique(p.begin(), p.end()), p.end());',
    '<span class="kw">auto</span> chain = [&amp;](<span class="kw">const</span> vector&lt;P&gt;&amp; order) {',
    '  vector&lt;P&gt; h;',
    '  <span class="kw">for</span> (P c : order) {',
    '    <span class="kw">while</span> (h.size() &gt; 1 &amp;&amp; cross(h[h.size()-2], h.back(), c) &lt; 0) h.pop_back();',
    '    h.push_back(c);',
    '  } <span class="kw">return</span> h;',
    '};',
    '<span class="kw">auto</span> lo = chain(p), hi = chain(vector&lt;P&gt;(p.rbegin(), p.rend()));',
    '<span class="kw">if</span> (lo.size() == p.size() &amp;&amp; hi.size() == p.size()) <span class="kw">return</span> p;',
    'lo.pop_back(); hi.pop_back();',
    'lo.insert(lo.end(), hi.begin(), hi.end()); <span class="kw">return</span> lo;',
  ],
  watch: [
    { key: "c", label: "c" },
    { key: "cross", label: "cross" },
    { key: "lo", label: "lo" },
    { key: "hi", label: "hi" },
  ],
  practice: [
    { src: "CSES 2195", name: "Convex Hull", lv: "★★☆", url: "https://cses.fi/problemset/task/2195" },
    { src: "LeetCode 587", name: "Erect the Fence", lv: "★★★", url: "https://leetcode.com/problems/erect-the-fence/" },
  ],
  sceneOptions: { unit: 58 },
  legend: [
    { cls: "acc", label: { vi: "chuỗi đang dựng", en: "chain being built" } },
    { cls: "wa", label: { vi: "rẽ phải, bỏ điểm giữa", en: "right turn, pop middle point" } },
    { cls: "ac", label: { vi: "biên bao lồi", en: "hull boundary" } },
  ],
  entrance: ORDER,
  steps: [
    {
      title: { vi: "Tìm đường bao lồi", en: "Find the convex hull" }, kind: "problem",
      body: {
        vi: "Tìm đa giác lồi nhỏ nhất chứa cả 6 điểm. Thử từng đường qua hai điểm rồi kiểm tra xem các điểm còn lại có nằm cùng phía không có thể tốn O(n³).",
        en: "Find the smallest convex polygon containing all 6 points. Trying every line through two points and checking whether all other points lie on one side can cost O(n³).",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(),
    },
    {
      title: { vi: "Sắp điểm theo x", en: "Sort points by x" }, kind: "concept",
      body: {
        vi: "Sắp theo <code>x</code>, nếu bằng nhau thì theo <code>y</code>. Ta được thứ tự A → B → C → D → E → F. Bắt đầu chuỗi dưới <code>lo</code> với A và B.",
        en: "Sort by <code>x</code>, breaking ties by <code>y</code>. The order is A → B → C → D → E → F. Start the lower chain <code>lo</code> with A and B.",
      },
      lines: [6, 7, 8, 9, 10, 12], watch: { c: "B", lo: "A B" }, verdict: "run", fit: "all",
      scene: picture({ lower: ["A", "B"], formula: "A → B → C → D → E → F" }),
    },
    {
      title: { vi: "Giữ lượt rẽ trái", en: "Keep the left turn" }, kind: "step",
      body: {
        vi: "Tính tích có hướng <code>(B − A) × (C − A)</code> từ hai vectơ (1, −2) và (2, 0). Kết quả 4 &gt; 0 là rẽ trái trong hệ tọa độ toán học, nên giữ B và thêm C.",
        en: "Compute <code>(B − A) × (C − A)</code> from vectors (1, −2) and (2, 0). The result 4 &gt; 0 is a left turn in mathematical coordinates, so keep B and append C.",
      },
      lines: [2, 3, 4, 11, 12], watch: { c: "C", cross: 4, lo: "A B C" }, verdict: "run", fit: "all",
      scene: picture({ lower: ["A", "B", "C"], tests: [["A", "B", "C"]] }),
    },
    {
      title: { vi: "Bỏ điểm rẽ phải", en: "Pop the right turn" }, kind: "step",
      body: {
        vi: "Khi thử D, bộ B, C, D cho −3 nên bỏ C khỏi chuỗi dưới. Kiểm tra lại với A, B, D được 5, vậy nối B với D.",
        en: "When trying D, the triple B, C, D gives −3, so pop C from the lower chain. Testing A, B, D again gives 5, so join B to D.",
      },
      lines: [11, 12], watch: { c: "D", cross: "−3 → 5", lo: "A B D" }, verdict: "run", fit: "all",
      scene: picture({ lower: ["A", "B", "D"], tests: [["B", "C", "D"], ["A", "B", "D"]], rejected: ["C"], trial: [["B", "C"], ["C", "D"]] }),
    },
    {
      title: { vi: "Giữ điểm thẳng hàng", en: "Keep the collinear point" }, kind: "step",
      body: {
        vi: "B, D, E cho 7 nên thêm E. Khi đến F, D, E, F cho −7 nên bỏ E. B, D, F cho 0, vậy giữ D trên cạnh B–F và kết thúc chuỗi dưới ở F.",
        en: "B, D, E gives 7, so append E. At F, D, E, F gives −7, so pop E. B, D, F gives 0, so keep D on edge B–F and finish the lower chain at F.",
      },
      note: { vi: "Điều kiện <code>cross &lt; 0</code> giữ cả các điểm thẳng hàng trên biên.", en: "The <code>cross &lt; 0</code> test preserves collinear boundary points." },
      lines: [10, 11, 12], watch: { c: "F", cross: "−7 → 0", lo: "A B D F" }, verdict: "run", fit: "all",
      scene: picture({ lower: LOWER, tests: [["D", "E", "F"], ["B", "D", "F"]], rejected: ["E"], trial: [["D", "E"], ["E", "F"]] }),
    },
    {
      title: { vi: "Quét từ phải sang", en: "Sweep back from F" }, kind: "step",
      body: {
        vi: "Dựng chuỗi trên <code>hi</code> bằng cùng phép thử khi đi từ F về A. F, E, D cho 7 nên thêm D, rồi E, D, C cho −5 nên bỏ D. Kiểm tra F, E, C được 9, vậy chuỗi lúc này là F → E → C.",
        en: "Build the upper chain <code>hi</code> with the same test while going from F to A. F, E, D gives 7, so append D, then E, D, C gives −5, so pop D. F, E, C gives 9, leaving F → E → C.",
      },
      lines: [10, 11, 12, 15], watch: { c: "C", cross: "−5 → 9", lo: "A B D F", hi: "F E C" }, verdict: "run", fit: "all",
      scene: picture({ upper: ["F", "E", "C"], tests: [["E", "D", "C"], ["F", "E", "C"]], rejected: ["D"], trial: [["E", "D"], ["D", "C"]] }),
    },
    {
      title: { vi: "Khép chuỗi trên", en: "Finish the upper chain" }, kind: "step",
      body: {
        vi: "E, C, B cho 1 nên thêm B tạm thời. Khi đến A, C, B, A cho −4 và E, C, A cho −6 nên lần lượt bỏ B và C. F, E, A cho 15, vậy chuỗi trên kết thúc bằng cạnh E–A.",
        en: "E, C, B gives 1, so append B temporarily. At A, C, B, A gives −4 and E, C, A gives −6, so pop B and then C. F, E, A gives 15, so the upper chain ends with edge E–A.",
      },
      lines: [10, 11, 12, 15], watch: { c: "A", cross: "−4 → −6 → 15", lo: "A B D F", hi: "F E A" }, verdict: "run", fit: "all",
      scene: picture({ upper: UPPER, tests: [["E", "C", "A"], ["F", "E", "A"]], rejected: ["C"], trial: [["E", "C"], ["C", "A"]] }),
    },
    {
      title: { vi: "Ghép hai nửa", en: "Join the two chains" }, kind: "answer",
      body: {
        vi: "Bỏ F ở cuối <code>lo</code> và A ở cuối <code>hi</code> vì mỗi điểm đã là đầu của chuỗi kia. Danh sách Đường bao đi qua A, B, D, F, E rồi về A. C nằm trong bao.",
        en: "Drop F from the end of <code>lo</code> and A from the end of <code>hi</code> since each starts the other chain. The hull goes through A, B, D, F, E and closes back at A. C lies inside.",
      },
      lines: [15, 17, 18], watch: { lo: "A B D", hi: "F E" }, verdict: "ac", fit: "all",
      scene: picture({ lower: LOWER, upper: UPPER, done: true, formula: "A → B → D → F → E → A" }),
    },
    {
      title: { vi: "Vì sao chuỗi đúng", en: "Why the chains work" }, kind: "recap",
      body: {
        vi: "Một góc rẽ phải đặt điểm giữa phía trong so với cạnh nối tắt, nên nó không thuộc biên của nửa đang dựng. Mỗi lượt quét chỉ thêm và bỏ mỗi điểm tối đa một lần, nên sắp xếp quyết định thời gian O(n log n). Nếu cả hai chuỗi đều giữ mọi điểm thì tất cả thẳng hàng (hoặc có tối đa 2 điểm), trả về <code>p</code> một lần.",
        en: "A right turn puts the middle point on the inside of the shortcut edge, so it cannot belong to the boundary being built. Each sweep pushes and pops each point at most once, so sorting dominates at O(n log n). If both chains keep every point, the points are collinear or there are at most 2, so return <code>p</code> once.",
      },
      lines: [6, 10, 11, 12, 16], watch: { lo: "A B D", hi: "F E" }, verdict: "ac", fit: "all",
      scene: picture({ lower: LOWER, upper: UPPER, done: true, formula: "A → B → D → F → E → A" }),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  ORDER.forEach((p, i) => {
    const [x, y] = POINTS[p];
    scene.add(p, { shape: shapes.pill({ text: `${p}(${x},${y})`, h: 22, pad: 4 }), x, y });
    for (const q of ORDER.slice(i + 1)) {
      scene.link(edge(p, q), { from: p, to: q, anchor: "center", bend: 0 });
    }
  });
  scene.add("calc", { shape: shapes.pill({ h: 23, pad: 8 }), x: 2.5, y: 6.45, o: 0 });
  scene.add("check", { shape: shapes.pill({ h: 23, pad: 8 }), x: 2.5, y: 7.45, o: 0 });
}
