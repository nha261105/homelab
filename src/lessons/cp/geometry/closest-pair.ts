import type { Lesson, SceneMap } from "../../../lib/types";

const POINTS = {
  A: [0, 2], B: [2, 0], C: [3, 4], D: [4, 0], E: [5, 1], F: [7, 4],
} as const;
type Point = keyof typeof POINTS;
type Pair = [Point, Point];
const ORDER: Point[] = ["A", "B", "C", "D", "E", "F"];
const edge = (a: Point, b: Point) => a < b ? a + b : b + a;
const U = 45;

function squaredDistance([a, b]: Pair) {
  const [ax, ay] = POINTS[a];
  const [bx, by] = POINTS[b];
  const dx = Math.abs(bx - ax), dy = Math.abs(by - ay);
  return `δ²(${a},${b}) = ${dx}² + ${dy}² = ${dx * dx + dy * dy}`;
}

function picture({
  current, active = [], retired = [], pair, before, formula = "", done = false,
}: {
  current?: Point; active?: Point[]; retired?: Point[]; pair?: Pair;
  before?: number; formula?: string; done?: boolean;
} = {}): SceneMap {
  const result = formula || (pair ? squaredDistance(pair) : "");
  const scene: SceneMap = {
    calc: { text: result, o: result ? 1 : 0, cls: done ? "v-eq" : "" },
  };
  for (const p of ORDER) {
    const best = pair?.includes(p);
    const cls = best ? "is-good" : p === current || active.includes(p) ? "is-active" : retired.includes(p) ? "is-out" : "";
    scene[p] = { cls, o: retired.includes(p) ? (best ? 0.8 : 0.55) : 1 };
  }
  if (pair) scene[edge(...pair)] = { p: 1, cls: "v-eq" };
  if (current && before !== undefined) {
    const x = POINTS[current][0];
    const bounds = { left: x - Math.sqrt(before), sweep: x };
    for (const [id, x] of Object.entries(bounds)) {
      scene[`${id}Top`] = { x };
      scene[`${id}Bottom`] = { x };
      scene[id] = { p: 1, cls: id === "left" ? "v-lt" : "" };
    }
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "geometry", slug: "closest-pair",
  title: { vi: "Cặp điểm gần nhất", en: "Closest pair of points" },
  added: "2026-11-27",
  summary: {
    vi: "Quét theo x và chỉ xét các điểm còn đủ gần theo cả hai trục.",
    en: "Sweep by x and compare only points that are still close enough on both axes.",
  },
  level: "hard", minutes: 11, time: "O(n log n)", memory: "O(n)",
  goal: {
    vi: "Tìm cặp gần nhất trong <b>6 điểm</b> và trả về bình phương khoảng cách",
    en: "Find the closest pair among <b>6 points</b> and return its squared distance",
  },
  codeLang: "C++17",
  code: [
    'using ll = <span class="kw">long long</span>; using P = pair&lt;ll, ll&gt;;',
    '<span class="kw">auto</span> sq = [](ll t) { <span class="kw">return</span> t*t; };',
    'sort(p.begin(), p.end());',
    'll best = sq(p[0].first-p[1].first) + sq(p[0].second-p[1].second);',
    'set&lt;P&gt; s; s.insert({p[0].second, p[0].first}); s.insert({p[1].second, p[1].first});',
    '<span class="kw">for</span> (size_t l = 0, i = 2; i &lt; p.size() &amp;&amp; best; ++i) {',
    '  <span class="kw">auto</span> [x, y] = p[i];',
    '  <span class="kw">while</span> (l &lt; i &amp;&amp; sq(x-p[l].first) &gt;= best) {',
    '    s.erase({p[l].second, p[l].first}); ++l;',
    '  }',
    '  ll r = sqrtl(best - 1);',
    '  <span class="kw">while</span> (sq(r+1) &lt; best) ++r;',
    '  <span class="kw">while</span> (sq(r) &gt;= best) --r;',
    '  <span class="kw">for</span> (<span class="kw">auto</span> it = s.lower_bound({y-r, LLONG_MIN}); it != s.end() &amp;&amp; it-&gt;first &lt;= y+r; ++it)',
    '    best = min(best, sq(x-it-&gt;second) + sq(y-it-&gt;first));',
    '  s.insert({y, x});',
    '} <span class="kw">return</span> best;',
  ],
  watch: [
    { key: "p", label: { vi: "điểm đang xét", en: "current point" } },
    { key: "s", label: "s (y, x)" },
    { key: "best", label: "best = d²" },
  ],
  practice: [
    { src: "CSES 2194", name: "Minimum Euclidean Distance", lv: "★★☆", url: "https://cses.fi/problemset/task/2194" },
    { src: "Codeforces 429D", name: "Tricky Function", lv: "★★★", url: "https://codeforces.com/problemset/problem/429/D" },
  ],
  sceneOptions: { unit: U },
  legend: [
    { cls: "acc", label: { vi: "đường quét và điểm đang xét", en: "sweep line and active points" } },
    { cls: "tle", label: { vi: "mép trái của dải", en: "left edge of strip" } },
    { cls: "ac", label: { vi: "cặp tốt nhất", en: "best pair" } },
    { cls: "dim", label: { vi: "đã rời dải", en: "outside the strip" } },
  ],
  entrance: ORDER,
  steps: [
    {
      title: { vi: "Tìm cặp gần nhất", en: "Find the closest pair" }, kind: "problem",
      body: {
        vi: "Trong 6 điểm, cặp nào có khoảng cách Euclid nhỏ nhất? Thử cả <code>6 · 5 / 2 = 15</code> cặp là cách O(n²). So sánh bình phương khoảng cách cho cùng thứ tự, nên ta lưu <code>best = d²</code>.",
        en: "Which of the 6 points are closest by Euclidean distance? Trying all <code>6 · 5 / 2 = 15</code> pairs takes O(n²). Squared distances have the same ordering, so we store <code>best = d²</code>.",
      },
      lines: [1, 2], watch: {}, verdict: "run", fit: "all", scene: picture(),
    },
    {
      title: { vi: "Lấy cặp đầu tiên", en: "Seed with one pair" }, kind: "concept",
      body: {
        vi: "Sắp theo x rồi y, được thứ tự A → B → C → D → E → F. Lấy A và B làm cặp đầu tiên, với <code>best = 2² + 2² = 8</code>. Đưa hai điểm vào <code>s</code>, sắp theo khóa (y, x).",
        en: "Sort by x then y to get A → B → C → D → E → F. Seed with A and B, giving <code>best = 2² + 2² = 8</code>. Insert both into <code>s</code>, keyed by (y, x).",
      },
      lines: [3, 4, 5], watch: { p: "B", s: "B A", best: 8 }, verdict: "run", fit: "all",
      scene: picture({ pair: ["A", "B"] }),
    },
    {
      title: { vi: "Lọc theo hai trục", en: "Filter on both axes" }, kind: "step",
      body: {
        vi: "Tại C, dải giữa hai đường có bề rộng <code>d = √8</code>. A cách theo x 3 đơn vị nên bị xóa: <code>3² ≥ 8</code>. B vẫn trong dải, nhưng <code>|Δy| = 4</code> nên cũng không thể cải thiện <code>best</code>.",
        en: "At C the two lines enclose a strip of width <code>d = √8</code>. Remove A since its x gap is 3 and <code>3² ≥ 8</code>. B is still in the strip, but <code>|Δy| = 4</code> also rules out an improvement.",
      },
      note: {
        vi: "Khi đường quét đi sang phải, khoảng cách theo x tới một điểm đã qua chỉ tăng, còn d chỉ giảm hoặc đứng yên.",
        en: "As the sweep moves right, the x gap to an earlier point can only grow, and d can only stay the same or shrink.",
      },
      lines: [6, 7, 8, 9, 11, 14], watch: { p: "C", s: "B", best: 8 }, verdict: "run", fit: "all",
      scene: picture({ current: "C", before: 8, active: ["B"], retired: ["A"], pair: ["A", "B"], formula: "AC: 3² ≥ 8   ·   BC: 4² ≥ 8" }),
    },
    {
      title: { vi: "Thu hẹp dải tại D", en: "Narrow the strip at D" }, kind: "step",
      body: {
        vi: "B và C còn trong dải theo x. Với <code>best = 8</code>, bán kính y nguyên lớn nhất là <code>r = 2</code> vì <code>2² &lt; 8 ≤ 3²</code>. Truy vấn quanh <code>y = 0</code> chỉ lấy B, rồi hạ <code>best</code> xuống <code>2² + 0² = 4</code>.",
        en: "B and C remain in the x strip. With <code>best = 8</code>, the largest integer y radius is <code>r = 2</code> because <code>2² &lt; 8 ≤ 3²</code>. Querying around <code>y = 0</code> finds only B, reducing <code>best</code> to <code>2² + 0² = 4</code>.",
      },
      lines: [8, 11, 12, 13, 14, 15], watch: { p: "D", s: "B C", best: 4 }, verdict: "run", fit: "all",
      scene: picture({ current: "D", before: 8, active: ["B", "C"], retired: ["A"], pair: ["B", "D"] }),
    },
    {
      title: { vi: "Cải thiện tại E", en: "Improve at E" }, kind: "step",
      body: {
        vi: "Dải trước E rộng <code>√4 = 2</code>. Xóa B vì <code>3² ≥ 4</code> và C vì <code>2² = 4</code>. D cách E một đơn vị theo mỗi trục, nên <code>best = 1² + 1² = 2</code>.",
        en: "The strip before E is <code>√4 = 2</code> wide. Remove B because <code>3² ≥ 4</code> and C because <code>2² = 4</code>. D is one unit from E on each axis, so <code>best = 1² + 1² = 2</code>.",
      },
      lines: [8, 9, 14, 15, 16], watch: { p: "E", s: "D", best: 2 }, verdict: "run", fit: "all",
      scene: picture({ current: "E", before: 4, active: ["D"], retired: ["A", "B", "C"], pair: ["D", "E"] }),
    },
    {
      title: { vi: "Chốt cặp D và E", en: "Finish with D and E" }, kind: "answer",
      body: {
        vi: "Ở F, ngay cả E cũng cách theo x 2 đơn vị, nên <code>2² ≥ 2</code>. Tập ứng viên rỗng. Cặp gần nhất là D và E, với <code>d² = 2</code> hay <code>d = √2</code>.",
        en: "At F even E has an x gap of 2, so <code>2² ≥ 2</code>. The candidate set is empty. D and E are closest, with <code>d² = 2</code> or <code>d = √2</code>.",
      },
      lines: [8, 9, 14, 17], watch: { p: "F", s: "∅", best: 2 }, verdict: "ac", fit: "all",
      scene: picture({ current: "F", before: 2, retired: ["A", "B", "C", "D", "E"], pair: ["D", "E"], formula: "EF: 2² ≥ 2   ⇒   d² = 2", done: true }),
    },
    {
      title: { vi: "Vì sao dải đủ", en: "Why the strip suffices" }, kind: "recap",
      body: {
        vi: "Bất kỳ cặp nào cải thiện đáp án đều phải có cả hai độ lệch nhỏ hơn d. Các điểm đã quét cách nhau ít nhất d, nên chia vùng ứng viên d × 2d thành 8 ô vuông cạnh d/2 thì mỗi ô chứa tối đa một điểm. Mỗi điểm vào và ra <code>s</code> tối đa một lần, nên sắp xếp và thao tác trên <code>set</code> tốn O(n log n).",
        en: "Any pair that improves the answer needs both gaps below d. Earlier points are at least d apart, so splitting the d × 2d candidate box into 8 squares of side d/2 leaves at most one point per square. Each point enters and leaves <code>s</code> at most once, giving O(n log n) for sorting and set operations.",
      },
      lines: [3, 6, 8, 14, 16], watch: { best: 2 }, verdict: "ac", fit: "all",
      scene: picture({ pair: ["D", "E"], retired: ["A", "B", "C", "F"], done: true }),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  ORDER.forEach((p, i) => {
    const [x, y] = POINTS[p];
    scene.add(p, { shape: shapes.pill({ text: `${p}(${x},${y})`, h: 15, pad: 4 }), x, y });
    for (const q of ORDER.slice(i + 1)) {
      scene.link(edge(p, q), { from: p, to: q, anchor: "center", bend: 0 });
    }
  });
  for (const id of ["left", "sweep"]) {
    const pin = shapes.block({ w: 0, h: 0, depth: 0 });
    scene.add(`${id}Top`, { shape: pin, y: -1.5, o: 0 });
    scene.add(`${id}Bottom`, { shape: pin, y: 4.7, o: 0 });
    scene.link(id, { from: `${id}Top`, to: `${id}Bottom`, anchor: "center", bend: 0 });
  }
  scene.add("calc", { shape: shapes.pill({ h: 23, pad: 8 }), x: 3.5, y: 6.3, o: 0 });
}
