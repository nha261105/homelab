import type { Lesson, SceneMap } from "../../../lib/types";

const vertices = ["A", "B", "C", "X", "Y"] as const;
const positions = [[0, 3.5], [0, 0], [0, 1.75], [4, 1.45], [4, 3.5]];
const edges = [["A", "X"], ["A", "Y"], ["B", "X"], ["C", "X"]] as const;
const path = ["BX", "XA", "AY"];
const attempt = ["CX", "XB"];
const finalPairs = ["BX", "AY"];

function picture(pairs: string[], focus = "", walk: string[] = []): SceneMap {
  const map: SceneMap = {};
  vertices.forEach((v) => {
    map[v] = { cls: focus.includes(v) ? "is-active" : pairs.some((pair) => pair.includes(v)) ? "is-good" : "" };
  });
  edges.forEach(([u, v]) => {
    const id = u + v;
    const back = v + u;
    const used = walk.includes(id) || walk.includes(back);
    const paired = pairs.includes(id);
    map[id] = { p: used ? 0 : 1, o: paired ? 1 : 0.55, cls: paired ? "v-eq" : "" };
    for (const edge of [id, back]) {
      const order = walk.indexOf(edge);
      map[`walk${edge}`] = order === -1 ? { p: 0 } : {
        p: 1, from: { p: 0 }, delay: 110 * order, dur: 350,
        cls: edge === id ? "v-lt" : "v-gt",
      };
    }
  });
  for (const v of ["X", "Y"]) {
    const owner = pairs.find((pair) => pair[1] === v)?.[0];
    map[`m${v}`] = { text: `${v}: ${owner ?? "–"}`, cls: owner ? "is-good" : "" };
  }
  return map;
}

export const lesson: Lesson = {
  track: "cp", topic: "flows", slug: "bipartite-matching",
  title: { vi: "Ghép cặp hai phía", en: "Bipartite matching" },
  added: "2026-11-27",
  summary: {
    vi: "Tìm đường xen kẽ để đổi các cặp đang có và ghép thêm một cặp mỗi lần.",
    en: "Follow alternating paths to reassign existing pairs and add one pair at a time.",
  },
  level: "hard", minutes: 10, time: "O(L·E + L + R)", memory: "O(L + R + E)",
  goal: { vi: "Ghép nhiều cặp nhất, mỗi đỉnh có tối đa <b>một bạn ghép</b>", en: "Make as many pairs as possible, with at most <b>one partner</b> per vertex" },
  codeLang: "C++17",
  code: [
    'vector&lt;<span class="kw">int</span>&gt; matchR(R, -1), seen(R, -1);',
    '<span class="kw">auto</span> aug = [&amp;](<span class="kw">auto</span>&amp; self, <span class="kw">int</span> u, <span class="kw">int</span> root) -&gt; <span class="kw">bool</span> {',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[u]) {',
    '    <span class="kw">if</span> (seen[v] == root) <span class="kw">continue</span>;',
    '    seen[v] = root;',
    '    <span class="kw">if</span> (matchR[v] == -1 || self(self, matchR[v], root)) {',
    '      matchR[v] = u; <span class="kw">return true</span>;',
    '    }',
    '  }',
    '  <span class="kw">return false</span>;',
    '};',
    '<span class="kw">int</span> pairs = 0;',
    '<span class="kw">for</span> (<span class="kw">int</span> u = 0; u &lt; L; ++u)',
    '  pairs += aug(aug, u, u);',
  ],
  watch: [
    { key: "root", label: "root" },
    { key: "path", label: { vi: "đường đang thử", en: "path being tried" } },
    { key: "pairs", label: "pairs" },
  ],
  practice: [
    { src: "CSES 1696", name: "School Dance", lv: "★★☆", url: "https://cses.fi/problemset/task/1696" },
    { src: "CSES 1711", name: "Distinct Routes", lv: "★★★", url: "https://cses.fi/problemset/task/1711" },
  ],
  sceneOptions: { unit: 54 },
  legend: [
    { cls: "ac", label: { vi: "cặp đang ghép", en: "matched pair" } },
    { cls: "acc", label: { vi: "đỉnh trên đường đang thử", en: "vertex on the current path" } },
    { cls: "tle", label: { vi: "thử cặp mới", en: "try a new pair" } },
    { cls: "wa", label: { vi: "đi ngược qua cặp cũ", en: "follow a matched edge backward" } },
  ],
  steps: [
    {
      title: { vi: "Ghép được bao nhiêu?", en: "How many pairs fit?" }, kind: "problem",
      body: {
        vi: "Bên trái có A, B, C và bên phải có X, Y. Chỉ hai đỉnh có cạnh nối mới ghép được, và mỗi đỉnh chỉ có một bạn ghép. Nếu chọn A–X rồi giữ nguyên, cả B lẫn C đều mất lựa chọn duy nhất, nên cách chọn tham lam này chỉ được 1 cặp.",
        en: "A, B, C are on the left and X, Y on the right. Pairs must follow an edge, and each vertex may have only one partner. Choosing A–X and keeping it leaves both B and C without their only option, so this greedy choice yields just 1 pair.",
      },
      lines: [1], watch: { pairs: 0 }, verdict: "run", fit: "all", scene: picture([]),
    },
    {
      title: { vi: "Ghép A với X", en: "Match A with X" }, kind: "concept",
      body: {
        vi: "Duyệt A trước và thử X trước Y trong <code>adj[A]</code>. X còn trống nên gán <code>matchR[X] = A</code>. Hàng dưới hình lưu bạn ghép của từng đỉnh bên phải, với dấu gạch ngang cho Y đang trống.",
        en: "Process A first and try X before Y in <code>adj[A]</code>. X is free, so set <code>matchR[X] = A</code>. The row below the graph stores each right vertex’s partner, with a dash for the free Y.",
      },
      lines: [3, 5, 6, 7, 14], watch: { root: "A", path: "A→X", pairs: 1 }, verdict: "run",
      fit: "all", scene: picture(["AX"]),
    },
    {
      title: { vi: "Tìm đường xen kẽ", en: "Find an alternating path" }, kind: "step",
      body: {
        vi: "B chỉ nối với X, nhưng X đang ghép với A. Từ B đi theo cạnh chưa ghép tới X, đi ngược cặp cũ từ X về A, rồi thử A→Y vì Y còn trống. <code>seen[X] = root</code> giúp lời gọi ở A bỏ qua X vừa thăm.",
        en: "B can only use X, which is matched to A. Take the unmatched edge from B to X, follow the old pair backward to A, then try A→Y because Y is free. <code>seen[X] = root</code> makes A’s call skip the already visited X.",
      },
      lines: [3, 4, 5, 6], watch: { root: "B", path: "B→X→A→Y", pairs: 1 }, verdict: "run",
      fit: "all", scene: picture(["AX"], "BXAY", path),
    },
    {
      title: { vi: "Đổi cặp khi quay lui", en: "Rematch on the way back" }, kind: "step",
      body: {
        vi: "Lời gọi ở A tìm được Y nên gán <code>matchR[Y] = A</code>. Khi trả về B, ta gán <code>matchR[X] = B</code>, thay cặp A–X cũ. Đường tăng thêm hai cạnh ghép và bỏ một cạnh, nên số cặp tăng từ 1 lên 2.",
        en: "A finds Y and sets <code>matchR[Y] = A</code>. Back at B, set <code>matchR[X] = B</code>, replacing the old A–X pair. The augmenting path adds two matched edges and removes one, raising the total from 1 to 2.",
      },
      lines: [6, 7, 14], watch: { root: "B", path: "B→X→A→Y", pairs: 2 }, verdict: "run",
      fit: "all", scene: picture(finalPairs),
    },
    {
      title: { vi: "Thử ghép C", en: "Try to match C" }, kind: "step",
      body: {
        vi: "Ở lượt C, X lại được phép thăm vì <code>root</code> đã đổi. Đường C→X→B dừng tại B vì B chỉ có X và lượt này đã đánh dấu X. Lời gọi thất bại nên không có phép gán nào vào <code>matchR</code>.",
        en: "On C’s turn, X is available to visit again because <code>root</code> changed. C→X→B stops at B because B only has X and this search has already marked it. The call fails, so no assignment to <code>matchR</code> occurs.",
      },
      lines: [4, 5, 6, 10, 14], watch: { root: "C", path: "C→X→B", pairs: 2 }, verdict: "run",
      fit: "all", scene: picture(finalPairs, "CXB", attempt),
    },
    {
      title: { vi: "Chốt hai cặp", en: "Confirm the two pairs" }, kind: "answer",
      body: {
        vi: "Hai cặp là B–X và A–Y. Bên phải chỉ có 2 đỉnh, cả hai đã được ghép, nên không thể có cặp thứ ba.",
        en: "The pairs are B–X and A–Y. The right side has just 2 vertices and both are matched, so there is no room for a third pair.",
      },
      lines: [7, 14], watch: { pairs: 2 }, verdict: "ac", fit: "all", scene: picture(finalPairs),
    },
    {
      title: { vi: "Vì sao tìm đủ?", en: "Why it finds enough" }, kind: "recap",
      body: {
        vi: "Trước mỗi lượt, cách ghép đã tối ưu trên các đỉnh trái đã xét. Thêm một đỉnh trái chỉ có thể tăng tối đa 1 cặp, và nếu tăng được thì theo định lý Berge, phải có đường tăng xuất phát từ đỉnh mới. DFS kiểm tra đường đó bằng cách duyệt tối đa O(E) cạnh mỗi lượt, cộng O(L + R) để khởi tạo và lặp qua các đỉnh.",
        en: "Before each turn, the matching is maximum on the left vertices already processed. Adding a left vertex can add at most one pair, and by Berge’s theorem any increase requires an augmenting path starting at the new vertex. DFS checks for it in O(E) per turn, plus O(L + R) for initialization and the outer loop.",
      },
      lines: [3, 4, 6, 13, 14], watch: { pairs: 2 }, verdict: "ac", fit: "all", scene: picture(finalPairs),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  vertices.forEach((v, i) => {
    const [x, y] = positions[i];
    scene.add(v, { shape: shapes.block({ label: v, w: 44, h: 32, depth: 4 }), x, y });
  });
  edges.forEach(([from, to]) => {
    scene.link(from + to, { from, to, anchor: "center", bend: 0, p: 1 });
    scene.link(`walk${from}${to}`, { from, to, anchor: "center", arrow: true, bend: 0 });
    scene.link(`walk${to}${from}`, { from: to, to: from, anchor: "center", arrow: true, bend: 0 });
  });
  scene.add("matchR", { shape: shapes.pill({ text: "matchR", h: 25 }), x: 0.6, y: 4.55 });
  for (const [v, x] of [["X", 2.22], ["Y", 3.55]] as const) {
    scene.add(`m${v}`, { shape: shapes.pill({ h: 25, pad: 6 }), x, y: 4.55 });
  }
}
