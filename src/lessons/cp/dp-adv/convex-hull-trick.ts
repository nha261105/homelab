import type { Lesson, SceneMap } from "../../../lib/types";

const strength = [1, 2, 4, 10];
const factor = [6, 5, 2, 1];
const dp = [0];
const value = (j: number, x: number) => factor[j] * x + dp[j];
strength.forEach((x, i) => {
  dp.push(Math.min(...factor.slice(0, i + 1).map((_, j) => value(j, x))));
});
const cross = (a: number, b: number) => (dp[b] - dp[a]) / (factor[a] - factor[b]);

const U = 46;
const px = (x: number) => 26 * x / U;
const py = (y: number) => 2 * (192 - 3 * y) / U;
const plot = (x: number, y: number) => ({ x: px(x), y: py(y) });
const fit = ["origin", "axisX", "axisY", "labelX", "labelY", "height", "key0", "key3", "calc"];

function picture(visible: number[], formula: string, query?: [number, number], discarded: number[] = []): SceneMap {
  const best = query?.[1];
  const scene: SceneMap = {
    calc: { text: formula, cls: query ? "v-eq" : "", from: { s: 0.88 }, dur: 310, ease: "back" },
    guide: { p: query ? 1 : 0, from: { p: 0 }, dur: 430 },
    tick: { text: query ? String(query[0]) : "", o: query ? 1 : 0 },
    height: { text: query ? String(value(query[1], query[0])) : "", o: query ? 1 : 0, cls: "v-eq" },
    point: { o: query ? 1 : 0, cls: "is-good" },
  };
  if (query) {
    const [x, j] = query;
    const xy = plot(x, value(j, x));
    scene.base = plot(x, 0);
    scene.top = xy;
    scene.tick.x = xy.x;
    scene.height.y = xy.y + 19 / U;
    Object.assign(scene.point, { x: xy.x, y: xy.y + 10 / U });
  }
  factor.forEach((_, j) => {
    const shown = visible.includes(j);
    const dim = discarded.includes(j);
    const color = j === best ? "v-eq" : j === 1 ? "v-gt" : j === 2 ? "v-lt" : "";
    scene[`line${j}`] = {
      p: shown ? 1 : 0, o: dim ? 0.35 : 1, cls: color,
    };
    scene[`key${j}`] = {
      o: shown ? (dim ? 0.56 : 1) : 0,
      cls: dim ? "is-out" : color || "is-active",
    };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "dp-adv", slug: "convex-hull-trick",
  title: { vi: "Convex hull trick", en: "Convex hull trick" },
  added: "2026-11-27",
  level: "hard", minutes: 12, time: "O(n)", memory: "O(n)",
  summary: {
    vi: "Biến mỗi trạng thái thành một đường thẳng, rồi dùng deque để tìm giá trị trên bao dưới.",
    en: "Turn each state into a line, then use a deque to query the lower envelope.",
  },
  goal: {
    vi: "Hạ quái cuối với tổng thời gian nhỏ nhất · <b>s = [1, 2, 4, 10]</b>",
    en: "Defeat the final monster in minimum total time · <b>s = [1, 2, 4, 10]</b>",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">using</span> ll = long long; <span class="kw">using</span> i128 = __int128_t;',
    '<span class="kw">struct</span> Line { ll m, b; ll at(ll x) { <span class="kw">return</span> m*x+b; } };',
    '<span class="kw">auto</span> bad = [](Line a, Line b, Line c) {',
    '  <span class="kw">return</span> (i128)(b.b-a.b)*(b.m-c.m) &gt;= (i128)(c.b-b.b)*(a.m-b.m);',
    '};',
    'deque&lt;Line&gt; q{{f[0], 0}}; ll dp = 0;',
    '<span class="kw">for</span> (<span class="kw">int</span> i = 1; i &lt;= n; ++i) {',
    '  <span class="kw">while</span> (q.size() &gt; 1 &amp;&amp; q[1].at(s[i]) &lt;= q[0].at(s[i])) q.pop_front();',
    '  dp = q.front().at(s[i]);',
    '  <span class="kw">if</span> (i == n) <span class="kw">break</span>;',
    '  Line v{f[i], dp};',
    '  <span class="kw">if</span> (q.back().m == v.m) {',
    '    <span class="kw">if</span> (q.back().b &lt;= v.b) <span class="kw">continue</span>;',
    '    q.pop_back();',
    '  }',
    '  <span class="kw">while</span> (q.size() &gt; 1 &amp;&amp; bad(q[q.size()-2], q.back(), v)) q.pop_back();',
    '  q.push_back(v);',
    '}',
  ],
  watch: [
    { key: "i", label: "i" },
    { key: "x", label: "x = s[i]" },
    { key: "dp", label: "dp[i]" },
    { key: "q", label: "q" },
  ],
  practice: [
    { src: "CSES 2084", name: "Monster Game I", lv: "★★☆", url: "https://cses.fi/problemset/task/2084" },
    { src: "CSES 2085", name: "Monster Game II", lv: "★★★", url: "https://cses.fi/problemset/task/2085" },
  ],
  sceneOptions: { unit: U },
  legend: [
    { cls: "acc", label: { vi: "đường đang xét", en: "candidate line" } },
    { cls: "ac", label: { vi: "giá trị nhỏ nhất", en: "minimum value" } },
    { cls: "dim", label: { vi: "đường bị loại", en: "discarded line" } },
  ],
  steps: [
    {
      title: { vi: "Chọn quái để hạ", en: "Choose which monsters" }, kind: "problem",
      body: {
        vi: "Hạ quái <code>i</code> sau khi hạ quái <code>j</code> tốn thêm <code>f[j] × s[i]</code>; ta có thể bỏ qua các quái ở giữa. Khởi đầu <code>f[0] = 6</code>, sau ba quái đầu hệ số lần lượt là 5, 2, 1. Thử mọi <code>j &lt; i</code> cho mỗi <code>dp[i]</code> tốn O(n²).",
        en: "Defeating monster <code>i</code> after monster <code>j</code> costs another <code>f[j] × s[i]</code>; any monsters between them can be skipped. Start with <code>f[0] = 6</code>; the first three monsters give factors 5, 2, 1. Trying every <code>j &lt; i</code> for each <code>dp[i]</code> takes O(n²).",
      },
      lines: [], watch: { q: "L₀" }, verdict: "run", fit,
      scene: picture([0], "dp[i] = minⱼ (f[j]·s[i] + dp[j])"),
    },
    {
      title: { vi: "DP thành đường thẳng", en: "Turn states into lines" }, kind: "concept",
      body: {
        vi: "Mỗi <code>j</code> sinh đường <code>Lⱼ(x) = f[j]x + dp[j]</code>; tại <code>x = s[i]</code> ta lấy đường thấp nhất. Ở <code>x = 1</code> chỉ có <code>L₀</code>, cho <code>dp[1] = 6</code>; dùng kết quả này để thêm <code>L₁(x) = 5x + 6</code>.",
        en: "Each <code>j</code> gives a line <code>Lⱼ(x) = f[j]x + dp[j]</code>; at <code>x = s[i]</code> take the lowest line. At <code>x = 1</code> only <code>L₀</code> is available, giving <code>dp[1] = 6</code>; use that result to add <code>L₁(x) = 5x + 6</code>.",
      },
      lines: [2, 6, 9, 11, 17], watch: { i: 1, x: 1, dp: dp[1], q: "L₀, L₁" },
      verdict: "run", fit, scene: picture([0, 1], "L₀(1) = 6·1 + 0 = 6", [1, 0]),
    },
    {
      title: { vi: "Tính trạng thái thứ hai", en: "Compute the second state" }, kind: "step",
      body: {
        vi: "Tại <code>x = 2</code>, <code>L₀</code> cho 12, còn <code>L₁</code> cho <code>5·2 + 6 = 16</code>. Giá trị 12 là tung độ gốc của đường mới <code>L₂(x) = 2x + 12</code>.",
        en: "At <code>x = 2</code>, <code>L₀</code> gives 12 and <code>L₁</code> gives <code>5·2 + 6 = 16</code>. The value 12 becomes the intercept of the new line <code>L₂(x) = 2x + 12</code>.",
      },
      lines: [8, 9, 11], watch: { i: 2, x: 2, dp: dp[2], q: "L₀, L₁" },
      verdict: "run", fit, scene: picture([0, 1, 2], "min(6·2, 5·2 + 6) = 12", [2, 0]),
    },
    {
      title: { vi: "Loại đường ở giữa", en: "Drop the middle line" }, kind: "step",
      body: {
        vi: "Để <code>L₁</code> thấp hơn cả hai đường kia, nó phải vượt <code>L₀</code> sau <code>x = 6</code> và còn thấp hơn <code>L₂</code> trước <code>x = 2</code>. Khoảng đó rỗng, nên ta bỏ <code>L₁</code> ở cuối deque trước khi thêm <code>L₂</code>.",
        en: "For <code>L₁</code> to beat both other lines, it would have to beat <code>L₀</code> after <code>x = 6</code> and stay below <code>L₂</code> before <code>x = 2</code>. That interval is empty, so pop <code>L₁</code> from the back before adding <code>L₂</code>.",
      },
      note: {
        vi: "<code>bad</code> so sánh hai hoành độ giao bằng phép nhân chéo để giữ độ chính xác.",
        en: "<code>bad</code> compares the two intersection x-coordinates by cross multiplication to keep the test exact.",
      },
      lines: [3, 4, 16, 17], watch: { i: 2, q: "L₀, L₂" }, verdict: "run", fit,
      scene: picture([0, 1, 2], `x₀₁ = ${cross(0, 1)} ≥ x₁₂ = ${cross(1, 2)}`, undefined, [1]),
    },
    {
      title: { vi: "Tiến đầu deque", en: "Advance the deque front" }, kind: "step",
      body: {
        vi: "Tại <code>x = 4</code>, <code>L₂(4) = 20</code> đã thấp hơn <code>L₀(4) = 24</code>. Hai đường cắt nhau tại <code>x = 3</code>; vì <code>L₂</code> có hệ số góc nhỏ hơn và các truy vấn sau có <code>x ≥ 4</code>, ta bỏ <code>L₀</code> ở đầu deque.",
        en: "At <code>x = 4</code>, <code>L₂(4) = 20</code> is already below <code>L₀(4) = 24</code>. The two lines intersect at <code>x = 3</code>; since <code>L₂</code> has the smaller slope and later queries have <code>x ≥ 4</code>, pop <code>L₀</code> from the front.",
      },
      lines: [8, 9], watch: { i: 3, x: 4, dp: dp[3], q: "L₂" }, verdict: "run", fit,
      scene: picture([0, 2], "min(6·4, 2·4 + 12) = 20", [4, 2], [0]),
    },
    {
      title: { vi: "Thêm đường thứ ba", en: "Add the third state" }, kind: "step",
      body: {
        vi: "Từ <code>dp[3] = 20</code> và <code>f[3] = 1</code>, ta thêm <code>L₃(x) = x + 20</code>. Giao điểm với <code>L₂</code> có hoành độ 8; qua mốc đó, <code>L₃</code> cho giá trị nhỏ hơn.",
        en: "From <code>dp[3] = 20</code> and <code>f[3] = 1</code>, add <code>L₃(x) = x + 20</code>. It intersects <code>L₂</code> at <code>x = 8</code>; beyond that point <code>L₃</code> gives the smaller value.",
      },
      lines: [11, 16, 17], watch: { i: 3, dp: dp[3], q: "L₂, L₃" }, verdict: "run", fit,
      scene: picture([2, 3], `x₂₃ = (20 − 12) / (2 − 1) = ${cross(2, 3)}`),
    },
    {
      title: { vi: "Hạ quái cuối", en: "Defeat the final monster" }, kind: "answer",
      body: {
        vi: "Tại <code>x = 10</code>, <code>L₃</code> cho 30 còn <code>L₂</code> cho 32, nên ta bỏ <code>L₂</code>. Lộ trình tối ưu hạ quái 2, 3 và 4, mất <code>12 + 8 + 10 = 30</code>.",
        en: "At <code>x = 10</code>, <code>L₃</code> gives 30 and <code>L₂</code> gives 32, so pop <code>L₂</code>. The optimal route defeats monsters 2, 3, and 4 in <code>12 + 8 + 10 = 30</code> time.",
      },
      lines: [8, 9, 10], watch: { i: 4, x: 10, dp: dp[4], q: "L₃" }, verdict: "ac", fit,
      scene: picture([2, 3], "min(2·10 + 12, 10 + 20) = 30", [10, 3], [2]),
    },
    {
      title: { vi: "Mỗi đường vào một lần", en: "Each line enters once" }, kind: "recap",
      body: {
        vi: "Hệ số góc giảm và hoành độ truy vấn tăng (đều cho phép bằng nhau), nên bao dưới có các giao điểm tăng dần và đáp án chỉ tiến về phía cuối deque. Với hai đường song song, giữ đường có tung độ gốc nhỏ hơn. Mỗi đường vào và ra deque tối đa một lần, nên tổng thời gian O(n), bộ nhớ O(n).",
        en: "Slopes decrease and query coordinates increase, with ties allowed, so lower-envelope breakpoints are ordered and the answer only moves toward the back of the deque. For parallel lines, keep the smaller intercept. Each line enters and leaves at most once, giving O(n) time and O(n) space.",
      },
      note: {
        vi: "Monster Game II bỏ điều kiện đơn điệu; dùng cấu trúc như Li Chao tree để hỏi min.",
        en: "Monster Game II drops the monotonicity conditions; a structure such as a Li Chao tree can answer its minimum queries.",
      },
      lines: [8, 12, 13, 16, 17], watch: { i: 4, x: 10, dp: dp[4], q: "L₃" }, verdict: "ac", fit,
      scene: picture([3], "L₃(10) = 10 + 20 = 30", [10, 3]),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  function anchor(id: string, x: number, y: number) {
    scene.add(id, { shape: shapes.block({ w: 0, h: 0, depth: 0 }), ...plot(x, y), o: 0 });
  }
  anchor("origin", 0, 0);
  anchor("axisX", 10.8, 0);
  anchor("axisY", 0, 64);
  scene.link("horizontal", { from: "origin", to: "axisX", anchor: "center", bend: 0, arrow: true, p: 1, o: 0.48 });
  scene.link("vertical", { from: "origin", to: "axisY", anchor: "center", bend: 0, arrow: true, p: 1, o: 0.48 });
  scene.add("labelX", { shape: shapes.pill({ text: "x", h: 18, pad: 5 }), ...plot(11.1, 0) });
  scene.add("labelY", { shape: shapes.pill({ text: "y", h: 18, pad: 5 }), ...plot(0, 65) });
  anchor("base", 0, 0);
  anchor("top", 0, 0);
  scene.link("guide", { from: "base", to: "top", anchor: "center", bend: 0, o: 0.55 });
  const names = ["L₀", "L₁", "L₂", "L₃"];
  factor.forEach((m, j) => {
    anchor(`left${j}`, 0, dp[j]);
    anchor(`right${j}`, 10.5, value(j, 10.5));
    scene.link(`line${j}`, { from: `left${j}`, to: `right${j}`, anchor: "center", bend: 0 });
    const equation = `${m === 1 ? "" : m}x${dp[j] ? `+${dp[j]}` : ""}`;
    scene.add(`key${j}`, {
      shape: shapes.pill({ text: `${names[j]}=${equation}`, h: 22, pad: 5 }), ...plot(j * 3.3 + 0.5, -17), o: 0,
    });
  });
  scene.add("tick", { shape: shapes.pill({ h: 19, pad: 6 }), ...plot(0, -8), o: 0 });
  scene.add("height", { shape: shapes.pill({ h: 19, pad: 6 }), ...plot(-0.9, 18), o: 0 });
  scene.add("point", { shape: shapes.block({ w: 10, h: 10, depth: 0, r: 5 }), o: 0 });
  scene.add("calc", { shape: shapes.pill(), ...plot(5.4, -29) });
}
