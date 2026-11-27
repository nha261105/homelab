import type { Lesson, SceneMap } from "../../../lib/types";

const states = ["A0", "B0", "C0", "A1", "B1", "C1"];
const flights = [
  { from: "A", to: "B", fare: 5 },
  { from: "B", to: "C", fare: 10 },
];
const edges = flights.flatMap(({ from, to, fare }) => [
  { from: from + "0", to: to + "0", fare, discounted: false },
  { from: from + "1", to: to + "1", fare, discounted: false },
  { from: from + "0", to: to + "1", fare: Math.floor(fare / 2), discounted: true },
]);
const U = 53;
const fit = [...states, "dist", ...states.map((id) => `d${id}`)];

function picture(
  values: Record<string, number>,
  done: string[] = [],
  routes: string[] = [],
  path: string[] = [],
): SceneMap {
  const scene: SceneMap = {};
  const updated = new Set(routes.map((id) => id.slice(2)));
  for (const state of states) {
    const value = values[state];
    const cls = done.includes(state) ? "is-good" : value !== undefined ? "is-active" : "is-out";
    scene[state] = { cls };
    scene[`d${state}`] = {
      text: value === undefined ? "∞" : String(value), cls,
      ...(updated.has(state) ? { fx: { type: "pulse", delay: 350 } } : {}),
    };
  }
  for (const { from, to, discounted } of edges) {
    const id = from + to;
    const cls = path.includes(id) ? "v-eq" : discounted && routes.includes(id) ? "v-lt" : "";
    scene[id] = { p: 1, o: routes.includes(id) || path.includes(id) ? 1 : 0.48, cls };
    scene[`w${id}`] = { cls };
  }
  return scene;
}

const start = { A0: 0 };
const viaA = { ...start, B0: 5, B1: 2 };
const viaB1 = { ...viaA, C1: 12 };
const viaB0 = { ...viaB1, C0: 15, C1: 10 };
const settled = ["A0", "B1", "B0", "C1"];
const bestPath = ["A0B0", "B0C1"];

export const lesson: Lesson = {
  track: "cp",
  topic: "shortest-path",
  slug: "state-graph",
  title: { vi: "Đồ thị trạng thái", en: "Graphs of states" },
  added: "2026-11-27",
  summary: {
    vi: "Tách mỗi thành phố thành hai trạng thái, rồi dùng Dijkstra để chọn chuyến bay được giảm giá.",
    en: "Split each city into two states, then use Dijkstra to choose which flight to discount.",
  },
  level: "medium",
  minutes: 9,
  time: "O(n + m log(m + 1))",
  memory: "O(n + m)",
  goal: { vi: "Bay từ <b>A</b> tới <b>C</b> với một phiếu giảm nửa giá", en: "Fly from <b>A</b> to <b>C</b> using one half-price coupon" },
  codeLang: "C++17",
  code: [
    '<span class="kw">using</span> State = tuple&lt;<span class="kw">long long</span>, <span class="kw">int</span>, <span class="kw">int</span>&gt;;',
    'priority_queue&lt;State, vector&lt;State&gt;, greater&lt;State&gt;&gt; pq;',
    'vector&lt;array&lt;<span class="kw">long long</span>, 2&gt;&gt; d(n, {1LL &lt;&lt; 60, 1LL &lt;&lt; 60});',
    'd[s][0] = 0; pq.emplace(0, s, 0);',
    '<span class="kw">while</span> (!pq.empty()) {',
    '  <span class="kw">auto</span> [cost, u, used] = pq.top(); pq.pop();',
    '  <span class="kw">if</span> (cost != d[u][used]) <span class="kw">continue</span>;',
    '  <span class="kw">if</span> (u == t &amp;&amp; used == 1) <span class="kw">break</span>;',
    '  <span class="kw">for</span> (<span class="kw">auto</span> [v, w] : adj[u]) <span class="kw">for</span> (<span class="kw">int</span> next = used; next &lt;= 1; ++next) {',
    '    <span class="kw">long long</span> cand = cost + (next == used ? w : w / 2);',
    '    <span class="kw">if</span> (cand &gt;= d[v][next]) <span class="kw">continue</span>;',
    '    d[v][next] = cand; pq.emplace(cand, v, next);',
    '  }',
    '}',
  ],
  watch: [{ key: "state", label: "(u, used)" }, { key: "cost", label: "cost" }, { key: "target", label: "d[C][1]" }],
  practice: [
    { src: "CSES 1195", name: "Flight Discount", lv: "★★☆", url: "https://cses.fi/problemset/task/1195" },
    { src: "LeetCode 1293", name: "Shortest Path in a Grid with Obstacles Elimination", lv: "★★★", url: "https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/" },
  ],
  sceneOptions: { unit: U, view: [-55, -125, 370, 340] },
  legend: [
    { cls: "dim", label: { vi: "chưa tới được", en: "not yet reached" } },
    { cls: "acc", label: { vi: "đang chờ trong hàng đợi", en: "queued" } },
    { cls: "ac", label: { vi: "đã chốt hoặc đường đi tối ưu", en: "settled or optimal route" } },
    { cls: "tle", label: { vi: "cạnh dùng phiếu đang xét", en: "current coupon edge" } },
  ],
  steps: [
    {
      title: { vi: "Giảm giá một chuyến", en: "Discount one flight" }, kind: "problem",
      body: {
        vi: "Vé A → B giá 5, vé B → C giá 10. Phiếu giảm nửa giá một vé và làm tròn xuống. Thử mọi đường bay rồi thử mọi chỗ đặt phiếu có thể tốn rất nhiều thời gian khi mạng bay lớn.",
        en: "A → B costs 5, and B → C costs 10. A coupon halves one fare and rounds down. Trying every itinerary and every place to use the coupon can take far too long in a large network.",
      },
      lines: [], watch: {}, verdict: "run", fit, scene: picture({}),
    },
    {
      title: { vi: "Tách đôi mỗi đỉnh", en: "Split each vertex" }, kind: "concept",
      body: {
        vi: "<code>(B, 0)</code> là tới B khi còn phiếu, <code>(B, 1)</code> là tới B khi đã dùng phiếu. Hàng trên mang số 0, hàng dưới mang số 1. Ta bắt đầu ở <code>(A, 0)</code> với chi phí 0.",
        en: "<code>(B, 0)</code> means arriving at B with the coupon available, and <code>(B, 1)</code> means arriving after spending it. The top row has state 0, the bottom row state 1. Start at <code>(A, 0)</code> with cost 0.",
      },
      lines: [1, 2, 3, 4], watch: { state: "(A, 0)", cost: 0 }, verdict: "run", fit, scene: picture(start),
    },
    {
      title: { vi: "Hai cách tới B", en: "Two ways to B" }, kind: "step",
      body: {
        vi: "Từ <code>(A, 0)</code>, trả đủ 5 để tới <code>(B, 0)</code>, hoặc dùng phiếu để tới <code>(B, 1)</code> với giá <code>⌊5/2⌋ = 2</code>. Hai giá trị vào hàng đợi riêng vì các lựa chọn sau khi tới B khác nhau.",
        en: "From <code>(A, 0)</code>, pay 5 to reach <code>(B, 0)</code> or use the coupon to reach <code>(B, 1)</code> for <code>⌊5/2⌋ = 2</code>. Queue both costs because the options after reaching B differ.",
      },
      lines: [6, 9, 10, 12], watch: { state: "(A, 0)", cost: 0 }, verdict: "run", fit,
      scene: picture(viaA, ["A0"], ["A0B0", "A0B1"]),
    },
    {
      title: { vi: "Phiếu đã hết", en: "The coupon is spent" }, kind: "step",
      body: {
        vi: "Hàng đợi lấy <code>(B, 1)</code> trước vì 2 nhỏ hơn 5. Từ trạng thái 1 chỉ có thể trả đủ 10 và ở lại hàng dưới, nên tạm có <code>d[C][1] = 2 + 10 = 12</code>.",
        en: "The queue pops <code>(B, 1)</code> first because 2 is less than 5. From state 1, we can only pay the full 10 and stay on the lower row, giving <code>d[C][1] = 2 + 10 = 12</code> for now.",
      },
      lines: [6, 7, 9, 10, 12], watch: { state: "(B, 1)", cost: 2, target: 12 }, verdict: "run", fit,
      scene: picture(viaB1, ["A0", "B1"], ["B1C1"]),
    },
    {
      title: { vi: "Giữ phiếu tới B", en: "Save the coupon for B" }, kind: "step",
      body: {
        vi: "Tiếp theo lấy <code>(B, 0)</code> giá 5. Trả đủ cho chặng cuối cho <code>d[C][0] = 15</code>; dùng phiếu cho chặng đó hạ <code>d[C][1]</code> từ 12 xuống <code>5 + 5 = 10</code>.",
        en: "Next pop <code>(B, 0)</code> at cost 5. Paying full fare for the last leg gives <code>d[C][0] = 15</code>; spending the coupon there lowers <code>d[C][1]</code> from 12 to <code>5 + 5 = 10</code>.",
      },
      lines: [6, 9, 10, 11, 12], watch: { state: "(B, 0)", cost: 5, target: 10 }, verdict: "run", fit,
      scene: picture(viaB0, ["A0", "B1", "B0"], ["B0C0", "B0C1"]),
    },
    {
      title: { vi: "Chốt giá ở C", en: "Settle the fare at C" }, kind: "answer",
      body: {
        vi: "Lấy <code>(C, 1)</code> với giá 10 ra khỏi hàng đợi, ta chốt được đáp án. Đường màu xanh lá giữ phiếu ở chặng A → B rồi dùng trên B → C.",
        en: "Popping <code>(C, 1)</code> at cost 10 settles the answer. The green route keeps the coupon on A → B and spends it on B → C.",
      },
      lines: [6, 7, 8], watch: { state: "(C, 1)", cost: 10, target: 10 }, verdict: "ac", fit,
      scene: picture(viaB0, settled, [], bestPath),
    },
    {
      title: { vi: "Trạng thái giữ lựa chọn", en: "States preserve options" }, kind: "recap",
      body: {
        vi: "Nếu chỉ lưu giá rẻ nhất tới B, ta giữ 2 và bỏ mất lựa chọn còn phiếu, vốn cho tổng 10. Cờ <code>used</code> lưu đúng thông tin cần cho chặng sau. Đồ thị có 2n đỉnh và 3m cạnh không âm, nên dùng được Dijkstra với hàng đợi ưu tiên.",
        en: "Keeping only the cheapest cost to B would keep 2 and discard the option with the coupon, which gives a total of 10. The <code>used</code> flag preserves the information needed for the next flight. The graph has 2n vertices and 3m nonnegative edges, so Dijkstra with a priority queue applies.",
      },
      lines: [6, 9, 10, 12], watch: { target: 10 }, verdict: "ac", fit, scene: picture(viaB0, settled, [], bestPath),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  states.forEach((id, i) => {
    scene.add(id, {
      shape: shapes.block({ label: `${id[0]},${id[1]}`, w: 53, h: 36 }),
      x: 0.38 + (i % 3) * 2.35, y: i < 3 ? 0 : 3.5,
    });
    scene.add(`d${id}`, {
      shape: shapes.block({ label: "∞", sub: `${id[0]},${id[1]}`, w: 44, h: 33 }),
      x: i * 0.98, y: 6,
    });
  });
  scene.add("dist", { shape: shapes.pill({ text: "d" }), x: -0.89, y: 5.7 });
  for (const { from, to, fare, discounted } of edges) {
    const id = from + to;
    scene.link(id, { from, to, bend: discounted ? -0.75 : 0.1 });
    scene.add(`w${id}`, {
      shape: shapes.pill({ text: `${fare} ${discounted ? "↘" : "→"}`, h: 22, pad: 5 }), follow: id,
    });
  }
}
