import type { Lesson, SceneMap } from "../../../lib/types";

const vertices = ["s", "A", "B", "X", "Y", "t"] as const;
const positions = [[0, 2.25], [1.75, 0], [1.75, 4.5], [4, 4.5], [4, 0], [5.75, 2.25]];
const edges = [
  ["s", "A", 2, 0], ["s", "B", 2, 0],
  ["A", "X", 2, -0.8], ["A", "Y", 1, 0], ["B", "X", 2, 0],
  ["X", "t", 2, 0], ["Y", "t", 2, 0],
] as const;
const empty = [0, 0, 0, 0, 0, 0, 0];
const first = [2, 0, 2, 0, 0, 2, 0];
const last = [2, 1, 1, 1, 1, 2, 1];
const initialLevels = [0, 1, 1, 2, 2, 3];
const secondLevels = [0, 3, 1, 2, 4, 5];
const finalLevels = [0, 3, 1, 2, -1, -1];
const firstPath = ["sA", "AX", "Xt"];
const secondPath = ["sB", "BX", "AY", "Yt"];

function picture(
  flow: number[], levels?: number[], path: string[] = [],
  blocked: string[] = [], reverse = false,
): SceneMap {
  const map: SceneMap = { level: { o: levels ? 1 : 0 } };
  vertices.forEach((v, i) => {
    const l = levels?.[i];
    map[v] = { cls: l === -1 ? "is-out" : "" };
    map[`l${v}`] = { text: `${v}:${l === -1 ? "–" : l ?? ""}`, o: levels ? 1 : 0, cls: l === -1 ? "is-out" : "" };
  });
  edges.forEach(([u, v, cap], i) => {
    const id = u + v;
    const hot = path.includes(id);
    const cls = hot ? "v-eq" : blocked.includes(id) ? "v-gt" : "";
    map[id] = { p: 1, o: path.length && !hot ? 0.45 : 1, cls };
    map[`w${id}`] = { text: `${flow[i]}/${cap}`, cls };
  });
  map.XA = reverse ? { p: 1, from: { p: 0 }, cls: "v-lt", dur: 480 } : { p: 0 };
  map.wXA = { text: `r=${flow[2]}`, o: reverse ? 1 : 0, cls: "v-lt" };
  return map;
}

export const lesson: Lesson = {
  track: "cp", topic: "flows", slug: "max-flow",
  title: { vi: "Luồng cực đại (Dinic)", en: "Maximum flow (Dinic)" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng BFS để chia tầng, rồi dùng DFS để đẩy luồng và đổi hướng luồng cũ qua cạnh dư ngược.",
    en: "Build levels with BFS, then push flow with DFS and reroute earlier flow along reverse residual edges.",
  },
  level: "hard", minutes: 12, time: "O(V²E)", memory: "O(V + E)",
  goal: { vi: "Đẩy nhiều luồng nhất từ <b>s</b> tới <b>t</b>", en: "Send as much flow as possible from <b>s</b> to <b>t</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">long long</span> dfs(<span class="kw">int</span> u, <span class="kw">long long</span> f) {',
    '  <span class="kw">if</span> (u == t) <span class="kw">return</span> f;',
    '  <span class="kw">for</span> (<span class="kw">int</span> &amp;i = ptr[u]; i &lt; (<span class="kw">int</span>)g[u].size(); ++i) {',
    '    <span class="kw">auto</span> &amp;e = g[u][i];',
    '    <span class="kw">if</span> (e.r == 0 || level[e.to] != level[u] + 1) <span class="kw">continue</span>;',
    '    <span class="kw">auto</span> d = dfs(e.to, min(f, e.r));',
    '    <span class="kw">if</span> (d == 0) <span class="kw">continue</span>;',
    '    e.r -= d; g[e.to][e.rev].r += d; <span class="kw">return</span> d;',
    '  }',
    '  <span class="kw">return</span> 0;',
    '}',
    '<span class="kw">long long</span> flow = 0;',
    '<span class="kw">while</span> (bfs()) { fill(ptr.begin(), ptr.end(), 0);',
    '  <span class="kw">while</span> (<span class="kw">auto</span> d = dfs(s, LLONG_MAX)) flow += d; }',
  ],
  watch: [
    { key: "path", label: { vi: "đường tăng luồng", en: "augmenting path" } },
    { key: "d", label: "d" },
    { key: "flow", label: "flow" },
  ],
  practice: [
    { src: "CSES 1694", name: "Download Speed", lv: "★★☆", url: "https://cses.fi/problemset/task/1694" },
    { src: "CSES 1711", name: "Distinct Routes", lv: "★★★", url: "https://cses.fi/problemset/task/1711" },
  ],
  sceneOptions: { unit: 51 },
  legend: [
    { cls: "ac", label: { vi: "cạnh thuận trên đường tăng", en: "forward edge on the path" } },
    { cls: "tle", label: { vi: "cạnh dư ngược đang xét", en: "reverse residual edge in use" } },
    { cls: "wa", label: { vi: "cạnh đã đầy đang xét", en: "saturated edge in focus" } },
  ],
  steps: [
    {
      title: { vi: "Gửi luồng qua mạng", en: "Send flow through the network" }, kind: "problem",
      body: {
        vi: "Mỗi nhãn là luồng/sức chứa, chẳng hạn <code>0/2</code> trên s→A. Ở mọi đỉnh trừ s và t, tổng luồng vào phải bằng tổng luồng ra. Nếu chỉ đẩy theo các cạnh thuận còn chỗ, chọn s→A→X→t trước có thể khiến ta kẹt ở 2 dù mạng gửi được nhiều hơn.",
        en: "Each label is flow/capacity, such as <code>0/2</code> on s→A. At every vertex except s and t, inflow must equal outflow. If we push only through unused forward capacity, choosing s→A→X→t first can get us stuck at 2 even though the network can carry more.",
      },
      lines: [], watch: { flow: 0 }, verdict: "run", fit: "all", scene: picture(empty),
    },
    {
      title: { vi: "Chia tầng bằng BFS", en: "Build levels with BFS" }, kind: "concept",
      body: {
        vi: "Mỗi lần gọi <code>bfs()</code>, đặt các tầng về −1, đặt <code>level[s] = 0</code> rồi duyệt các cạnh có sức chứa dư <code>r &gt; 0</code>. Ban đầu A và B ở tầng 1, X và Y ở tầng 2, t ở tầng 3. Hàm trả về true nếu tới được t.",
        en: "On each <code>bfs()</code> call, reset all levels to −1, set <code>level[s] = 0</code>, and traverse edges with residual capacity <code>r &gt; 0</code>. Initially A and B are at level 1, X and Y at level 2, and t at level 3. Return true if BFS reaches t.",
      },
      note: {
        vi: "Mỗi cặp cạnh bắt đầu với <code>r = sức chứa</code> ở chiều thuận và <code>r = 0</code> ở chiều ngược. <code>rev</code> là chỉ số của cạnh kia trong danh sách kề.",
        en: "Each edge pair starts with <code>r = capacity</code> forward and <code>r = 0</code> backward. <code>rev</code> indexes the paired edge in the adjacency list.",
      },
      lines: [13], watch: { flow: 0 }, verdict: "run", fit: "all", scene: picture(empty, initialLevels),
    },
    {
      title: { vi: "Đẩy hai đơn vị", en: "Push two units" }, kind: "step",
      body: {
        vi: "DFS chỉ đi sang tầng kế tiếp. Thử A trước B và X trước Y, ta gặp đường s→A→X→t. Sức chứa dư nhỏ nhất là <code>min(2, 2, 2) = 2</code>, nên đẩy 2 và tăng sức chứa dư ở mỗi cạnh ngược thêm 2.",
        en: "DFS only moves to the next level. Trying A before B and X before Y gives s→A→X→t. Its bottleneck is <code>min(2, 2, 2) = 2</code>, so push 2 and add 2 to each paired reverse capacity.",
      },
      lines: [2, 5, 6, 8, 14], watch: { path: "s→A→X→t", d: 2, flow: 2 }, verdict: "run",
      fit: "all", scene: picture(first, initialLevels, firstPath),
    },
    {
      title: { vi: "Chặn mọi đường phân tầng", en: "Block all level paths" }, kind: "step",
      body: {
        vi: "DFS thử đẩy tiếp với các tầng cũ. Cạnh s→A đã đầy, còn s→B→X dừng ở X vì X→t cũng đầy. <code>dfs(s, …)</code> trả về 0 vì luồng chặn vừa đẩy đã làm đầy ít nhất một cạnh trên mỗi đường từ s đến t trong đồ thị phân tầng.",
        en: "DFS tries again with the same levels. s→A is full, and s→B→X stops at X because X→t is also full. <code>dfs(s, …)</code> returns 0, so this is a blocking flow: every s-to-t path in this level graph has a saturated edge.",
      },
      lines: [3, 5, 7, 10, 14], watch: { d: 0, flow: 2 }, verdict: "run",
      fit: "all", scene: picture(first, initialLevels, [], ["sA", "Xt"]),
    },
    {
      title: { vi: "Tìm đường qua cạnh ngược", en: "Find a reverse-edge path" }, kind: "step",
      body: {
        vi: "BFS mới đi từ s qua B tới X. Cạnh dư X→A có <code>r = 2</code> nhờ 2 đơn vị trên A→X, nên lần này BFS xếp A ở tầng 3. Từ A, BFS qua Y tới t ở tầng 5.",
        en: "The new BFS reaches X via B. The reverse edge X→A has <code>r = 2</code> from the 2 units on A→X, so BFS now places A at level 3. From A it reaches t via Y at level 5.",
      },
      lines: [13], watch: { path: "s→B→X→A→Y→t", flow: 2 }, verdict: "run",
      fit: "all", scene: picture(first, secondLevels, secondPath, [], true),
    },
    {
      title: { vi: "Đổi hướng một đơn vị", en: "Reroute one unit" }, kind: "step",
      body: {
        vi: "Đường mới có nút thắt A→Y còn đúng 1 chỗ, nên DFS đẩy <code>d = 1</code>. Đi qua X→A làm luồng trên A→X giảm từ 2 xuống 1, chuyển một đơn vị sang A→Y→t và bù vào X bằng luồng mới từ B. Tổng luồng tăng lên 3.",
        en: "A→Y is the bottleneck with 1 slot, so DFS pushes <code>d = 1</code>. Traversing X→A drops the flow on A→X from 2 to 1, moving one unit to A→Y→t and replacing it at X with new flow from B. Total flow rises to 3.",
      },
      lines: [5, 6, 8, 14], watch: { path: "s→B→X→A→Y→t", d: 1, flow: 3 }, verdict: "run",
      fit: "all", scene: picture(last, secondLevels, secondPath, [], true),
    },
    {
      title: { vi: "Chốt luồng cực đại", en: "Confirm the maximum flow" }, kind: "answer",
      body: {
        vi: "Sau khi chặn đường mới, BFS cuối chỉ tới s, B, X và A. Hai cạnh đi từ nhóm này ra ngoài, X→t và A→Y, đều đầy. Chúng cho cận trên <code>2 + 1 = 3</code>, đúng bằng luồng đã gửi.",
        en: "After blocking the new path, the final BFS reaches only s, B, X, and A. Both edges out of this group, X→t and A→Y, are saturated. Their capacities give an upper bound of <code>2 + 1 = 3</code>, which equals the flow we sent.",
      },
      lines: [10, 13, 14], watch: { flow: 3 }, verdict: "ac",
      fit: "all", scene: picture(last, finalLevels, [], ["Xt", "AY"]),
    },
    {
      title: { vi: "Vì sao chia tầng?", en: "Why build levels?" }, kind: "recap",
      body: {
        vi: "Sau mỗi luồng chặn, đường tăng ngắn nhất phải dài hơn hoặc biến mất, nên có ít hơn V pha. Trong mỗi pha, <code>ptr</code> bỏ qua các cạnh đã hết tác dụng, và mỗi lần DFS thành công làm đầy ít nhất một cạnh phân tầng. Một pha tốn O(VE), tổng cộng O(V²E) thời gian và O(V + E) bộ nhớ.",
        en: "After each blocking flow, the shortest augmenting path gets longer or disappears, so there are fewer than V phases. Within a phase, <code>ptr</code> skips exhausted edges, and each successful DFS saturates at least one level edge. A phase takes O(VE), for O(V²E) time and O(V + E) space.",
      },
      lines: [3, 5, 8, 13, 14], watch: { flow: 3 }, verdict: "ac",
      fit: "all", scene: picture(last, finalLevels, [], ["Xt", "AY"]),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  vertices.forEach((v, i) => {
    const [x, y] = positions[i];
    scene.add(v, { shape: shapes.block({ label: v, w: 39, h: 30, depth: 4 }), x, y });
    scene.add(`l${v}`, { shape: shapes.pill({ h: 23, pad: 4 }), x: 0.39 + i * 1.05, y: 5.85, o: 0 });
  });
  scene.add("level", { shape: shapes.pill({ text: "level", h: 23, pad: 5 }), x: -0.83, y: 5.85, o: 0 });
  edges.forEach(([from, to, cap, bend]) => {
    const id = from + to;
    scene.link(id, { from, to, anchor: "center", arrow: true, bend, p: 1 });
    scene.add(`w${id}`, { shape: shapes.pill({ text: `0/${cap}`, h: 22, pad: 4 }), follow: id });
  });
  scene.link("XA", { from: "X", to: "A", anchor: "center", arrow: true, bend: -1.8 });
  scene.add("wXA", { shape: shapes.pill({ h: 22, pad: 4 }), follow: "XA", o: 0 });
}
