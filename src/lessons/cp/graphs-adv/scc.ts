import type { Lesson, SceneMap } from "../../../lib/types";

const vertices = ["A", "B", "C", "D", "E", "F"];
const positions = [[0, 0], [0, 3.4], [2.05, 3.4], [3.65, 1.7], [3.65, 5.15], [5.5, 1.7]];
const edges = [
  ["A", "B", 1.4], ["B", "A", 1.4], ["B", "C", 0], ["A", "D", 0],
  ["C", "D", 0], ["D", "E", 0], ["E", "C", 0], ["D", "F", 0], ["A", "F", -1.9],
] as const;
const finish = ["E", "F", "D", "C", "B", "A"];
const component = [0, 0, 1, 1, 1, 2];
const classes = ["is-good", "is-active", "is-bad"];
const edgeClasses = ["v-eq", "v-lt", "v-gt"];
const fit = [...vertices, "order", ...vertices.map((_, i) => `slot${i}`)];

function picture(count = 0, reversed = false, groups = 0, focus: readonly string[] = [], draw = false): SceneMap {
  const scene: SceneMap = { order: { o: count || reversed ? 1 : 0 } };
  vertices.forEach((v, i) => {
    const group = component[i];
    scene[v] = { cls: group < groups ? classes[group] : focus.includes(v) ? "is-active" : "" };
    scene[`slot${i}`] = {
      text: i < count ? finish[i] : "—",
      o: count || reversed ? 1 : 0,
      cls: count > 0 && i === count - 1 ? "is-active" : i < count ? "" : "is-out",
    };
  });
  edges.forEach(([u, v], i) => {
    const from = component[vertices.indexOf(u)];
    const to = component[vertices.indexOf(v)];
    const assigned = from === to && from < groups;
    const highlighted = focus.includes(u + v);
    scene[`edge${i}`] = {
      p: reversed ? 0 : 1, o: focus.length && !highlighted ? 0.45 : 1, cls: highlighted ? "v-lt" : "",
    };
    scene[`rev${i}`] = {
      p: reversed ? 1 : 0, o: assigned || !groups ? 1 : 0.45, cls: assigned ? edgeClasses[from] : "",
      ...(reversed && draw ? { from: { p: 0 }, delay: 180, dur: 490 } : {}),
    };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "graphs-adv", slug: "scc",
  title: { vi: "Thành phần liên thông mạnh", en: "Strongly connected components" },
  added: "2026-11-27",
  summary: {
    vi: "Kosaraju dùng hai lượt DFS để gom các đỉnh đi được tới nhau theo cả hai chiều.",
    en: "Kosaraju uses two DFS passes to group vertices that can reach one another in both directions.",
  },
  level: "hard", minutes: 10, time: "O(V + E)", memory: "O(V + E)",
  goal: { vi: "Chia <b>6 đỉnh</b> của đồ thị có hướng thành các SCC", en: "Partition the <b>6 vertices</b> of a directed graph into SCCs" },
  codeLang: "C++17",
  code: [
    'vector&lt;vector&lt;int&gt;&gt; rg(n);',
    '<span class="kw">for</span> (int u = 0; u &lt; n; ++u) for (int v : g[u]) rg[v].push_back(u);',
    'vector&lt;int&gt; seen(n), order, comp(n, -1);',
    '<span class="kw">auto</span> dfs = [&amp;](auto&amp;&amp; self, int u) -&gt; void {',
    '  seen[u] = 1;',
    '  for (int v : g[u]) if (!seen[v]) self(self, v);',
    '  order.push_back(u);',
    '};',
    '<span class="kw">auto</span> label = [&amp;](auto&amp;&amp; self, int u, int id) -&gt; void {',
    '  comp[u] = id;',
    '  for (int v : rg[u]) if (comp[v] == -1) self(self, v, id);',
    '};',
    '<span class="kw">for</span> (int u = 0; u &lt; n; ++u) if (!seen[u]) dfs(dfs, u);',
    'int k = 0;',
    '<span class="kw">for</span> (auto it = order.rbegin(); it != order.rend(); ++it)',
    '  if (comp[*it] == -1) label(label, *it, k++);',
  ],
  watch: [
    { key: "u", label: "u" }, { key: "order", label: { vi: "order chưa đọc", en: "unread order" } },
    { key: "k", label: { vi: "số SCC đã gán", en: "SCCs labeled" } },
  ],
  practice: [
    { src: "CSES 1682", name: "Flight Routes Check", lv: "★★☆", url: "https://cses.fi/problemset/task/1682" },
    { src: "CSES 1683", name: "Planets and Kingdoms", lv: "★★☆", url: "https://cses.fi/problemset/task/1683" },
  ],
  sceneOptions: { unit: 56 },
  legend: [
    { cls: "ac", label: { vi: "SCC 0", en: "SCC 0" } },
    { cls: "acc", label: { vi: "đang xét hoặc SCC 1", en: "in focus or SCC 1" } },
    { cls: "wa", label: { vi: "SCC 2", en: "SCC 2" } },
  ],
  steps: [
    {
      title: { vi: "Tìm các nhóm đỉnh", en: "Find the vertex groups" }, kind: "problem",
      body: {
        vi: "A đi được tới F, còn F không có cạnh đi ra. Một SCC là một nhóm lớn nhất mà từ mỗi đỉnh trong nhóm đều đi được tới mọi đỉnh còn lại. Chạy DFS từ từng đỉnh để kiểm tra mất O(V(V + E)).",
        en: "A can reach F, but F has no outgoing edges. An SCC is a maximal group in which every vertex can reach every other vertex. Checking with a DFS from each vertex costs O(V(V + E)).",
      },
      lines: [], watch: {}, verdict: "run", fit: vertices, scene: picture(),
    },
    {
      title: { vi: "Ghi khi thoát DFS", en: "Record vertices on exit" }, kind: "concept",
      body: {
        vi: "DFS từ A đi theo A→B→C→D→E. Cạnh E→C gặp đỉnh đã thăm, nên E kết thúc trước và được thêm vào <code>order</code>. Ta ghi đỉnh lúc trả về, sau khi đã xét hết cạnh đi ra.",
        en: "DFS from A follows A→B→C→D→E. Edge E→C reaches a visited vertex, so E finishes first and enters <code>order</code>. Record each vertex on return, after scanning all its outgoing edges.",
      },
      lines: [4, 5, 6, 7, 13], watch: { u: "E", order: "E" }, verdict: "run", fit,
      scene: picture(1, false, 0, ["A", "B", "C", "D", "E", "AB", "BC", "CD", "DE", "EC"]),
    },
    {
      title: { vi: "Hoàn tất lượt đầu", en: "Finish the first pass" }, kind: "step",
      body: {
        vi: "Trở về D rồi ghé F, ta ghi tiếp F, D, C, B và A. Hàng <code>order</code> giờ chứa đủ 6 đỉnh, với A ở cuối vì lời gọi DFS từ A trả về sau cùng.",
        en: "Return to D and visit F, then record F, D, C, B, and A. The <code>order</code> row now contains all 6 vertices, with A last because its DFS call returns last.",
      },
      lines: [6, 7, 13], watch: { u: "A", order: finish.join(" ") }, verdict: "run", fit, scene: picture(6),
    },
    {
      title: { vi: "Đảo mọi cạnh", en: "Reverse every edge" }, kind: "step",
      body: {
        vi: "Đổi B→C thành C→B, D→F thành F→D, và làm tương tự với các cạnh còn lại để tạo <code>rg</code>. Lượt hai đọc <code>order</code> từ phải sang trái, bắt đầu ở A.",
        en: "Turn B→C into C→B, D→F into F→D, and reverse the remaining edges to make <code>rg</code>. Read <code>order</code> from right to left for the second pass, starting at A.",
      },
      lines: [1, 2, 15], watch: { u: "A", order: finish.join(" "), k: 0 }, verdict: "run", fit,
      scene: picture(6, true, 0, ["A"], true),
    },
    {
      title: { vi: "Gom A và B", en: "Group A and B" }, kind: "step",
      body: {
        vi: "Từ A trên đồ thị đảo, DFS chỉ tới được A và B. Gán cả hai vào SCC 0, rồi bỏ qua mục B trong <code>order</code> vì B đã có nhãn.",
        en: "From A in the reversed graph, DFS can only reach A and B. Label both as SCC 0, then skip B in <code>order</code> because it is already labeled.",
      },
      lines: [9, 10, 11, 15, 16], watch: { u: "A", order: "E F D C", k: 1 }, verdict: "run", fit, scene: picture(4, true, 1),
    },
    {
      title: { vi: "Gom C, D và E", en: "Group C, D, and E" }, kind: "step",
      body: {
        vi: "Đỉnh chưa gán tiếp theo là C. Cạnh C→B dẫn tới SCC 0 nên bỏ qua, còn vòng C→E→D→C cho ta SCC 1. Mục D kế tiếp cũng đã có nhãn.",
        en: "C is the next unlabeled vertex. Skip C→B because it leads to SCC 0, while the cycle C→E→D→C gives us SCC 1. The next entry, D, is already labeled too.",
      },
      lines: [10, 11, 15, 16], watch: { u: "C", order: "E F", k: 2 }, verdict: "run", fit, scene: picture(2, true, 2),
    },
    {
      title: { vi: "Chốt ba thành phần", en: "Count three components" }, kind: "answer",
      body: {
        vi: "DFS từ F gặp A và D đã có nhãn, nên SCC 2 chỉ chứa F. Bỏ qua E đã gán, ta thu được ba nhóm <code>{A, B}</code>, <code>{C, D, E}</code> và <code>{F}</code>.",
        en: "DFS from F meets already labeled A and D, so SCC 2 contains only F. Skip labeled E to finish with three groups: <code>{A, B}</code>, <code>{C, D, E}</code>, and <code>{F}</code>.",
      },
      lines: [10, 11, 15, 16], watch: { u: "F", k: 3 }, verdict: "ac", fit, scene: picture(0, true, 3),
    },
    {
      title: { vi: "Vì sao đảo cạnh?", en: "Why reverse the edges?" }, kind: "recap",
      body: {
        vi: "Nếu có cạnh từ SCC X sang SCC Y, đỉnh thoát muộn nhất trong X luôn thoát sau đỉnh thoát muộn nhất trong Y. Sau khi đảo cạnh, một DFS chỉ có thể sang SCC đã gán nếu muốn rời nhóm hiện tại, nên bỏ qua các đỉnh có nhãn là đủ. Hai lượt DFS và việc dựng <code>rg</code> tốn O(V + E).",
        en: "If an edge runs from SCC X to SCC Y, the last exit in X comes after the last exit in Y. With edges reversed, any edge leaving the current SCC leads to a group already labeled, so DFS can skip it. Two DFS passes and building <code>rg</code> cost O(V + E).",
      },
      lines: [2, 7, 11, 15, 16], watch: { k: 3 }, verdict: "ac", fit, scene: picture(0, true, 3),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  vertices.forEach((v, i) => {
    const [x, y] = positions[i];
    scene.add(v, { shape: shapes.block({ label: v, w: 44, h: 32, depth: 4 }), x, y });
    scene.add(`slot${i}`, { shape: shapes.block({ w: 34, h: 26, depth: 4 }), x: 0.68 + i * 0.96, y: 7.12, o: 0 });
  });
  scene.add("order", { shape: shapes.pill({ text: "order", h: 23, pad: 6 }), x: -0.35, y: 7.05, o: 0 });
  edges.forEach(([from, to, bend], i) => {
    scene.link(`edge${i}`, { from, to, anchor: "center", arrow: true, bend, p: 1 });
    scene.link(`rev${i}`, { from: to, to: from, anchor: "center", arrow: true, bend: -bend });
  });
}
