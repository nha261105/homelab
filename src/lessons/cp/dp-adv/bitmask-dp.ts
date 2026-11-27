import type { Lesson, SceneMap } from "../../../lib/types";

const W = [4, 6, 8];
const CAP = 10;
const U = 54;
const LABELS = ["000", "001", "010", "011", "100", "101", "110", "111"];
const LAYERS = [[0], [1, 2, 4], [3, 5, 6], [7]];
type State = [rides: number, load: number];
const dp: State[] = [[1, 0]];
const parents = LABELS.map((_, mask) => W.flatMap((weight, i) => {
  const bit = 1 << i;
  return mask & bit ? [{ prev: mask ^ bit, weight }] : [];
}));
for (let mask = 1; mask < LABELS.length; ++mask) {
  let best: State = [W.length + 1, 0];
  for (const { prev, weight } of parents[mask]) {
    const [rides, load] = dp[prev];
    const next: State = load + weight <= CAP ? [rides, load + weight] : [rides + 1, weight];
    if (next[0] < best[0] || (next[0] === best[0] && next[1] < best[1])) best = next;
  }
  dp.push(best);
}

function picture(layer: number, pending: number[] = [], formula = "", focus = -1, answer = false): SceneMap {
  const scene: SceneMap = {
    calc: { text: formula, o: formula ? 1 : 0, cls: answer ? "v-eq" : "is-active" },
    limit: { o: layer < 0 ? 1 : 0 },
  };
  W.forEach((_, i) => { scene[`w${i}`] = { o: layer < 0 ? 1 : 0 }; });
  LAYERS.forEach((masks, k) => masks.forEach((mask) => {
    const known = k <= layer && !pending.includes(mask);
    const current = k === layer && known;
    const input = focus >= 0 && parents[focus].some(({ prev }) => prev === mask);
    scene[`m${mask}`] = {
      text: `${LABELS[mask]}  ${known ? `(${dp[mask].join(",")})` : "?"}`,
      o: layer >= 0 ? 1 : 0,
      cls: !known ? "is-out" : current ? "is-good" : input ? "is-active" : "",
    };
    for (const { prev } of parents[mask]) {
      scene[`e${prev}-${mask}`] = current && (focus < 0 || focus === mask)
        ? { p: 1, cls: "v-eq", from: { p: 0 }, delay: 150, dur: 440 }
        : { p: 0 };
    }
  }));
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "dp-adv", slug: "bitmask-dp",
  title: { vi: "DP trên bitmask", en: "Bitmask DP" },
  added: "2026-11-27",
  summary: {
    vi: "Mã hóa tập người bằng bitmask và lưu phương án đi thang máy tốt nhất cho từng tập.",
    en: "Encode each subset as a bitmask and keep its best elevator plan.",
  },
  level: "hard", minutes: 11, time: "O(n · 2ⁿ)", memory: "O(2ⁿ)",
  goal: {
    vi: "Đưa ba người nặng <b>4, 6, 8</b> lên bằng thang máy tải tối đa <b>10</b>",
    en: "Carry three people weighing <b>4, 6, 8</b> in an elevator with capacity <b>10</b>",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> n = w.size(), states = 1 &lt;&lt; n;',
    'vector&lt;pair&lt;<span class="kw">int</span>, <span class="kw">long long</span>&gt;&gt; dp(states, {n + 1, 0});',
    'dp[0] = {1, 0};',
    '<span class="kw">for</span> (<span class="kw">int</span> mask = 1; mask &lt; states; ++mask) {',
    '  <span class="kw">for</span> (<span class="kw">int</span> i = 0; i &lt; n; ++i) {',
    '    <span class="kw">int</span> bit = 1 &lt;&lt; i;',
    '    <span class="kw">if</span> ((mask &amp; bit) == 0) <span class="kw">continue</span>;',
    '    <span class="kw">auto</span> [rides, load] = dp[mask ^ bit];',
    '    <span class="kw">if</span> (load + w[i] &lt;= cap) load += w[i];',
    '    <span class="kw">else</span> { ++rides; load = w[i]; }',
    '    dp[mask] = min(dp[mask], {rides, load});',
    '  }',
    '}',
    '<span class="kw">return</span> dp[states - 1].first;',
  ],
  watch: [
    { key: "mask", label: "mask" }, { key: "best", label: "dp[mask]" },
    { key: "cap", label: { vi: "tải tối đa", en: "capacity" } },
  ],
  practice: [
    { src: "CSES 1653", name: "Elevator Rides", lv: "★★☆", url: "https://cses.fi/problemset/task/1653/" },
    { src: "LeetCode 698", name: "Partition to K Equal Sum Subsets", lv: "★★☆", url: "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/" },
  ],
  sceneOptions: { unit: U },
  legend: [
    { cls: "acc", label: { vi: "tập con nguồn", en: "input subset" } },
    { cls: "ac", label: { vi: "vừa tính", en: "new state" } },
    { cls: "dim", label: { vi: "chưa tính", en: "pending" } },
  ],
  steps: [
    {
      title: { vi: "Xếp người vào thang", en: "Pack the elevator" }, kind: "problem",
      body: {
        vi: "Ba người có cân nặng 4, 6, 8 và mỗi chuyến chở tối đa 10. Ta muốn dùng ít chuyến nhất. Thử mọi thứ tự đưa người vào thang có đến <code>n!</code> cách.",
        en: "The three people weigh 4, 6, and 8, and a ride can carry at most 10. We want the fewest rides. There are <code>n!</code> possible boarding orders to try.",
      },
      lines: [], watch: { cap: CAP }, verdict: "run", fit: "all", scene: picture(-1),
    },
    {
      title: { vi: "Mã hóa tập người", en: "Encode each subset" }, kind: "concept",
      body: {
        vi: "Ba bit từ phải sang trái ứng với các cân nặng 4, 6, 8, nên <code>101</code> chứa người nặng 4 và 8. Mỗi <code>dp[mask]</code> lưu cặp (số chuyến, tải chuyến cuối), ưu tiên ít chuyến rồi đến tải nhẹ. Quy ước <code>dp[000] = (1, 0)</code> để bắt đầu với một chuyến rỗng.",
        en: "From right to left the bits represent weights 4, 6, and 8, so <code>101</code> contains 4 and 8. Each <code>dp[mask]</code> stores (ride count, last load), minimizing rides first and then load. Start with one empty ride, <code>dp[000] = (1, 0)</code>.",
      },
      lines: [1, 2, 3], watch: { mask: "000", best: "(1, 0)", cap: CAP }, verdict: "run",
      fit: "all", scene: picture(0, [], "dp[000] = (1, 0)"),
    },
    {
      title: { vi: "Thêm từng người", en: "Add one person" }, kind: "step",
      body: {
        vi: "Ba tập một người đều lấy <code>dp[000] = (1, 0)</code> làm nguồn. Thêm lần lượt người nặng 4, 6, 8 vào chuyến rỗng thì được các cặp (1, 4), (1, 6), (1, 8).",
        en: "Each singleton uses <code>dp[000] = (1, 0)</code> as its input. Adding weight 4, 6, or 8 to the empty ride gives (1, 4), (1, 6), or (1, 8), respectively.",
      },
      lines: [4, 5, 6, 7, 8, 9, 11], watch: { mask: "001", best: "(1, 4)", cap: CAP }, verdict: "run",
      fit: "all", scene: picture(1, [], "0 + 4, 0 + 6, 0 + 8"),
    },
    {
      title: { vi: "Ghép hai người vừa tải", en: "Fit two in one ride" }, kind: "step",
      body: {
        vi: "Để tính <code>011</code>, thử bỏ mỗi bit đang bật để biết ai lên cuối. Ta thêm 4 sau 6 hoặc thêm 6 sau 4. Cả hai cho tải đúng 10, nên chỉ cần một chuyến.",
        en: "To compute <code>011</code>, clear each set bit in turn to choose who boards last. Append 4 after 6 or append 6 after 4. Both give load 10, so one ride is enough.",
      },
      lines: [6, 7, 8, 9, 11], watch: { mask: "011", best: "(1, 10)", cap: CAP }, verdict: "run",
      fit: "all", scene: picture(2, [5, 6], "6 + 4 = 4 + 6 = 10", 3),
    },
    {
      title: { vi: "Mở chuyến mới", en: "Open another ride" }, kind: "step",
      body: {
        vi: "Với <code>101</code>, tổng <code>8 + 4 = 12</code> vượt tải. Thêm 4 sau 8 cho (2, 4), còn thêm 8 sau 4 cho (2, 8), nên ta giữ (2, 4). Tương tự, <code>110</code> giữ (2, 6) khi so với (2, 8).",
        en: "For <code>101</code>, <code>8 + 4 = 12</code> exceeds capacity. Adding 4 after 8 gives (2, 4) and adding 8 after 4 gives (2, 8), so keep (2, 4). Similarly, <code>110</code> keeps (2, 6) over (2, 8).",
      },
      lines: [8, 9, 10, 11], watch: { mask: "101", best: "(2, 4)", cap: CAP }, verdict: "run",
      fit: "all", scene: picture(2, [], "min((2,4), (2,8)) = (2,4)"),
    },
    {
      title: { vi: "Đủ ba người", en: "Carry all three" }, kind: "answer",
      body: {
        vi: "Thêm 4 vào <code>110</code> hay thêm 6 vào <code>101</code> đều cho (2, 10). Thêm 8 vào <code>011</code> cho (2, 8), cặp nhỏ nhất. Vậy cần 2 chuyến, một chuyến chở 4 và 6, chuyến còn lại chở 8.",
        en: "Adding 4 to <code>110</code> or 6 to <code>101</code> gives (2, 10). Adding 8 to <code>011</code> gives (2, 8), the smallest pair. The answer is two rides, one for 4 and 6 and one for 8.",
      },
      lines: [8, 9, 10, 11, 14], watch: { mask: "111", best: "(2, 8)", cap: CAP }, verdict: "ac",
      fit: "all", scene: picture(3, [], "min((2,10), (2,8)) = (2,8)", 7, true),
    },
    {
      title: { vi: "Mỗi tập giữ một cặp", en: "Keep one pair per subset" }, kind: "recap",
      body: {
        vi: "Xếp người theo thứ tự các chuyến của một phương án tối ưu rồi ghép vào chuyến cuối khi còn chỗ sẽ không làm tăng số chuyến. Khi thêm cùng một người, cặp đang tốt hơn vẫn tốt ít nhất bằng cặp kia: tải nhẹ dễ ghép hơn, còn số chuyến ít hơn chỉ có thể tăng thêm một. Mỗi trong 2ⁿ tập thử tối đa <code>n</code> người lên cuối, và xóa một bit luôn cho mask nhỏ hơn.",
        en: "List people in the order of an optimal ride plan and fill the last ride whenever possible, and the ride count cannot increase. Adding the same person preserves the pair ordering: a lighter load has more room, and the plan with fewer rides can add at most one. Each of the 2ⁿ subsets tries at most <code>n</code> last riders, and clearing a bit always gives a smaller mask.",
      },
      lines: [4, 7, 8, 9, 10, 11], watch: { mask: "111", best: "(2, 8)", cap: CAP }, verdict: "ac",
      fit: "all", scene: picture(3, [], "dp[111] = (2, 8)", 7, true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  W.forEach((weight, i) => {
    scene.add(`w${i}`, { shape: shapes.block({ label: weight, w: 52, h: 32 }), x: 2 - i, y: 1 });
  });
  scene.add("limit", { shape: shapes.pill({ text: `cap = ${CAP}` }), x: 1, y: -0.65 });
  LAYERS.forEach((masks, layer) => masks.forEach((mask, i) => {
    scene.add(`m${mask}`, {
      shape: shapes.block({ w: 128, h: 24, depth: 4, r: 6 }),
      x: masks.length === 1 ? 0 : (i - 1) * 2.65, y: layer * 2.03, o: 0,
    });
  }));
  scene.add("calc", { shape: shapes.pill(), x: 0, y: 7.41, o: 0 });
  parents.forEach((choices, mask) => choices.forEach(({ prev }) => {
    scene.link(`e${prev}-${mask}`, { from: `m${prev}`, to: `m${mask}`, anchor: "center", arrow: true, bend: 0 });
  }));
}
