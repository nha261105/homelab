import type { Lesson, SceneMap } from "../../../lib/types";

const vertices = ["s", "A", "B", "X", "Y", "t"] as const;
const positions = [[0, 2.25], [1.75, 0], [1.75, 4.5], [4, 4.5], [4, 0], [5.75, 2.25]];
const edges = [
  ["s", "A", 2, 2, 0], ["s", "B", 2, 1, 0],
  ["A", "X", 2, 1, -0.8], ["A", "Y", 1, 1, 0], ["B", "X", 2, 1, 0],
  ["X", "t", 2, 2, 0], ["Y", "t", 2, 1, 0],
] as const;
const sourceSide = "sBXA";

function picture(
  reached = "", path: string[] = [], cutSide = "", reverse = false,
): SceneMap {
  const hasFlow = Boolean(reached) || cutSide === sourceSide;
  const map: SceneMap = {
    side: { o: cutSide ? 1 : 0, text: cutSide === "s" ? "S = {s}     T = {A, B, X, Y, t}" : "S = {s, B, X, A}     T = {Y, t}" },
  };
  vertices.forEach((v) => {
    map[v] = { cls: cutSide ? (cutSide.includes(v) ? "is-good" : "is-out") : reached.includes(v) ? "is-active" : "" };
  });
  edges.forEach(([u, v, cap, flow]) => {
    const id = u + v;
    const crossing = cutSide && cutSide.includes(u) && !cutSide.includes(v);
    const hot = path.includes(id);
    const cls = crossing ? (cutSide === "s" ? "v-gt" : "v-eq") : hot ? "v-eq" : "";
    map[id] = { p: 1, cls, o: (cutSide || path.length) && !crossing && !hot ? 0.5 : 1 };
    map[`w${id}`] = { text: `${hasFlow ? flow : 0}/${cap}`, cls };
  });
  map.XA = reverse ? { cls: "v-lt", p: 1, from: { p: 0 }, dur: 480 } : { p: 0 };
  map.wXA = { text: "r=1", o: reverse ? 1 : 0, cls: "v-lt" };
  return map;
}

export const lesson: Lesson = {
  track: "cp", topic: "flows", slug: "min-cut",
  title: { vi: "Lát cắt nhỏ nhất", en: "Minimum cut" },
  added: "2026-11-27",
  summary: {
    vi: "Sau khi tìm luồng cực đại, duyệt đồ thị dư từ nguồn để lấy các cạnh của lát cắt nhỏ nhất.",
    en: "After finding maximum flow, search the residual graph from the source to recover the minimum-cut edges.",
  },
  level: "hard", minutes: 10, time: "O(V²E)", memory: "O(V + E)",
  goal: { vi: "Tách <b>s</b> khỏi <b>t</b> với tổng sức chứa bị cắt nhỏ nhất", en: "Separate <b>s</b> from <b>t</b> by cutting the least total capacity" },
  codeLang: "C++17",
  code: [
    '<span class="kw">auto</span> flow = maxflow(s, t);',
    'vector&lt;<span class="kw">bool</span>&gt; seen(n); queue&lt;<span class="kw">int</span>&gt; q;',
    'seen[s] = true; q.push(s);',
    '<span class="kw">while</span> (!q.empty()) {',
    '  <span class="kw">int</span> u = q.front(); q.pop();',
    '  <span class="kw">for</span> (<span class="kw">const auto</span> &amp;e : g[u])',
    '    <span class="kw">if</span> (e.r &gt; 0 &amp;&amp; !seen[e.to]) {',
    '      seen[e.to] = true; q.push(e.to);',
    '    }',
    '}',
    '<span class="kw">long long</span> cut = 0; vector&lt;pair&lt;<span class="kw">int</span>, <span class="kw">int</span>&gt;&gt; edges;',
    '<span class="kw">for</span> (<span class="kw">auto</span> [u, v, cap] : original)',
    '  <span class="kw">if</span> (seen[u] &amp;&amp; !seen[v]) { cut += cap; edges.emplace_back(u, v); }',
  ],
  watch: [
    { key: "side", label: "S" },
    { key: "flow", label: "flow" },
    { key: "cut", label: "cut" },
  ],
  practice: [
    { src: "CSES 1694", name: "Download Speed", lv: "★★☆", url: "https://cses.fi/problemset/task/1694" },
    { src: "CSES 1695", name: "Police Chase", lv: "★★★", url: "https://cses.fi/problemset/task/1695" },
  ],
  sceneOptions: { unit: 51 },
  legend: [
    { cls: "acc", label: { vi: "đỉnh đã tới", en: "reached vertex" } },
    { cls: "tle", label: { vi: "cạnh dư ngược đang xét", en: "reverse residual edge in use" } },
    { cls: "wa", label: { vi: "cạnh cắt thử", en: "candidate cut edge" } },
    { cls: "ac", label: { vi: "cạnh dư thuận, hoặc lát cắt đã chốt", en: "forward residual step or final cut" } },
    { cls: "dim", label: { vi: "phía chứa đích", en: "sink side" } },
  ],
  steps: [
    {
      title: { vi: "Tách nguồn khỏi đích", en: "Separate source and sink" }, kind: "problem",
      body: {
        vi: "Chia 6 đỉnh thành hai phía sao cho s ở phía S và t ở phía T. Mỗi cách chia xác định một lát cắt gồm các cạnh đi từ S sang T. Thử mọi cách xếp 4 đỉnh còn lại thì có <code>2⁴ = 16</code> cách, và con số này tăng theo hàm mũ.",
        en: "Split the 6 vertices into sides S and T with s in S and t in T. Each split gives a cut consisting of the edges from S to T. Trying all placements of the 4 other vertices gives <code>2⁴ = 16</code> splits, a number that grows exponentially.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(),
    },
    {
      title: { vi: "Thử cắt sát nguồn", en: "Try cutting at the source" }, kind: "concept",
      body: {
        vi: "Nếu S chỉ có s, phải cắt s→A và s→B với tổng sức chứa <code>2 + 2 = 4</code>. Mọi luồng từ s tới t đều phải đi qua lát cắt theo chiều S→T ít nhất một lần, nên sức chứa lát cắt là một cận trên cho lượng luồng có thể gửi.",
        en: "Putting only s in S cuts s→A and s→B, with total capacity <code>2 + 2 = 4</code>. Any flow from s to t must cross the cut in the S→T direction at least once, so the cut capacity is an upper bound on the amount of flow we can send.",
      },
      lines: [], watch: { side: "{s}", cut: 4 }, verdict: "run", fit: "all", scene: picture("", [], "s"),
    },
    {
      title: { vi: "Bắt đầu từ luồng cực đại", en: "Start from maximum flow" }, kind: "step",
      body: {
        vi: "Chạy Dinic để được <code>flow = 3</code>. Các nhãn luồng/sức chứa ghi trạng thái vừa tìm được, chẳng hạn <code>1/2</code> trên s→B. Bây giờ dùng <code>g</code> sau khi đẩy luồng, với <code>e.r</code> là sức chứa dư, và bắt đầu BFS từ s.",
        en: "Run Dinic to get <code>flow = 3</code>. The flow/capacity labels show the resulting flow, such as <code>1/2</code> on s→B. Now use <code>g</code> after the flow pushes, with <code>e.r</code> storing residual capacity, and start BFS from s.",
      },
      lines: [1, 2, 3], watch: { side: "{s}", flow: 3 }, verdict: "run", fit: "all", scene: picture("s"),
    },
    {
      title: { vi: "Đi theo sức chứa dư", en: "Follow residual capacity" }, kind: "step",
      body: {
        vi: "s→B và B→X đều còn <code>2 − 1 = 1</code> chỗ, nên BFS thêm B rồi X vào S. X→t đã đầy với nhãn <code>2/2</code>, vì vậy BFS không đi thẳng tới t.",
        en: "Both s→B and B→X have <code>2 − 1 = 1</code> capacity left, so BFS adds B and then X to S. X→t is full at <code>2/2</code>, so BFS cannot go directly to t.",
      },
      lines: [4, 5, 6, 7, 8], watch: { side: "{s, B, X}", flow: 3 }, verdict: "run",
      fit: "all", scene: picture("sBX", ["sB", "BX"]),
    },
    {
      title: { vi: "Qua cạnh dư ngược", en: "Use the reverse edge" }, kind: "step",
      body: {
        vi: "A→X đang mang 1 đơn vị luồng, nên cạnh dư ngược X→A có <code>r = 1</code> và BFS tới được A. Cạnh A→Y đã đầy <code>1/1</code>, hàng đợi rỗng và chỉ Y, t chưa được đánh dấu.",
        en: "A→X carries 1 unit, so the reverse residual edge X→A has <code>r = 1</code> and BFS reaches A. A→Y is full at <code>1/1</code>. The queue empties with only Y and t unmarked.",
      },
      lines: [4, 6, 7, 8], watch: { side: "{s, B, X, A}", flow: 3 }, verdict: "run",
      fit: "all", scene: picture(sourceSide, ["sB", "BX"], "", true),
    },
    {
      title: { vi: "Lấy hai cạnh cắt", en: "Extract the two cut edges" }, kind: "answer",
      body: {
        vi: "Quét các cạnh gốc trong <code>original</code> và lấy cạnh có đầu đi đã đánh dấu, đầu đến chưa đánh dấu. Chỉ có A→Y và X→t, nên cắt chúng với tổng sức chứa <code>1 + 2 = 3</code>, đúng bằng luồng cực đại.",
        en: "Scan the original edges in <code>original</code> and keep each edge with a marked tail and an unmarked head. Only A→Y and X→t qualify, so removing them costs <code>1 + 2 = 3</code>, exactly the maximum flow.",
      },
      lines: [11, 12, 13], watch: { side: "{s, B, X, A}", flow: 3, cut: 3 }, verdict: "ac",
      fit: "all", scene: picture("", [], sourceSide),
    },
    {
      title: { vi: "Vì sao nhỏ nhất?", en: "Why is it minimum?" }, kind: "recap",
      body: {
        vi: "Nếu cạnh S→T còn chỗ hoặc cạnh T→S mang luồng, BFS đã có thể sang T. Vì vậy luồng ròng qua lát cắt bằng đúng tổng sức chứa S→T, đạt cận trên cho mọi luồng. Dinic tốn O(V²E), còn BFS và quét cạnh sau đó chỉ tốn O(V + E).",
        en: "If an S→T edge had spare capacity or a T→S edge carried flow, BFS could have reached T. Thus net flow across the cut equals the S→T capacity, meeting the upper bound. Dinic takes O(V²E), then BFS and the edge scan take O(V + E).",
      },
      lines: [7, 12, 13], watch: { side: "{s, B, X, A}", flow: 3, cut: 3 }, verdict: "ac",
      fit: "all", scene: picture("", [], sourceSide),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  vertices.forEach((v, i) => {
    const [x, y] = positions[i];
    scene.add(v, { shape: shapes.block({ label: v, w: 39, h: 30, depth: 4 }), x, y });
  });
  edges.forEach(([from, to, cap, , bend]) => {
    const id = from + to;
    scene.link(id, { from, to, anchor: "center", arrow: true, bend, p: 1 });
    scene.add(`w${id}`, { shape: shapes.pill({ text: `0/${cap}`, h: 22, pad: 4 }), follow: id });
  });
  scene.link("XA", { from: "X", to: "A", anchor: "center", arrow: true, bend: -1.8 });
  scene.add("wXA", { shape: shapes.pill({ text: "r=1", h: 22, pad: 4 }), follow: "XA", o: 0 });
  scene.add("side", { shape: shapes.pill({ h: 25, pad: 7 }), x: 2.875, y: 5.85, o: 0 });
}
