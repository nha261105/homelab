import type { Lesson, SceneMap } from "../../../lib/types";

const POSITIONS = [[2.4, 0], [1, 2.1], [3.8, 2.1], [0.65, 4.25], [2.5, 4.25], [4.8, 4.25], [4.8, 6.4]];
const PARENT = [0, 1, 1, 2, 3, 3, 6];
const STATES = [[3, 3], [0, 1], [1, 2], [0, -1], [0, -1], [0, 1], [0, -1]];
const LEAVES = [4, 5, 7];
const BRANCHES = [...LEAVES, 2, 6];
const CHILDREN = [...BRANCHES, 3];
const ALL = [...CHILDREN, 1];

function picture(done: number[], active: number[] = [], edges: number[] = [], matching = false): SceneMap {
  const scene: SceneMap = {};
  const showTable = done.length > 0;
  for (const key of ["u", "skip", "take"]) scene[key] = { o: showTable ? 1 : 0 };
  POSITIONS.forEach((_, i) => {
    const u = i + 1;
    const ready = done.includes(u);
    const selected = active.includes(u);
    scene[`v${u}`] = { cls: selected ? "is-active" : matching && u !== 1 ? "is-good" : "" };
    scene[`col${u}`] = { o: showTable ? 1 : 0, cls: selected ? "is-active" : "" };
    STATES[i].forEach((value, j) => {
      scene[`dp${u}-${j}`] = {
        text: ready ? value : "·", o: showTable ? 1 : 0,
        cls: !ready || value < 0 ? "is-out" : selected ? "is-good" : "",
      };
    });
    if (i > 0) {
      scene[`e${u}`] = edges.includes(u)
        ? { cls: matching ? "v-eq" : "v-lt", p: 1, from: { p: 0 }, dur: 320 }
        : { o: edges.length ? 0.54 : 1 };
    }
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "trees-adv", slug: "tree-dp",
  title: { vi: "DP trên cây", en: "Tree DP" },
  added: "2026-11-27",
  summary: {
    vi: "Tính ghép cặp cực đại từ lá lên gốc bằng hai trạng thái cho mỗi đỉnh.",
    en: "Find a maximum matching from leaves to root using two states per vertex.",
  },
  level: "hard", minutes: 10, time: "O(n)", memory: "O(n)",
  goal: {
    vi: "Chọn nhiều cạnh nhất sao cho <b>mỗi đỉnh thuộc tối đa một cạnh</b>",
    en: "Choose as many edges as possible with <b>at most one edge per vertex</b>",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">void</span> dfs(<span class="kw">int</span> u, <span class="kw">int</span> p) {',
    '  skip[u] = 0; take[u] = -1;',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[u]) <span class="kw">if</span> (v != p) {',
    '    dfs(v, u);',
    '    skip[u] += max(skip[v], take[v]);',
    '  }',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[u]) <span class="kw">if</span> (v != p) {',
    '    <span class="kw">int</span> cand = skip[u] - max(skip[v], take[v]) + skip[v] + 1;',
    '    take[u] = max(take[u], cand);',
    '  }',
    '}',
    'dfs(1, 0);',
    '<span class="kw">int</span> answer = max(skip[1], take[1]);',
  ],
  watch: [
    { key: "u", label: "u" }, { key: "skip", label: "skip[u]" },
    { key: "take", label: "take[u]" }, { key: "answer", label: { vi: "đáp án", en: "answer" } },
  ],
  practice: [
    { src: "CSES 1130", name: "Tree Matching", lv: "★★☆", url: "https://cses.fi/problemset/task/1130" },
    { src: "CSES 1132", name: "Tree Distances I", lv: "★★☆", url: "https://cses.fi/problemset/task/1132" },
  ],
  sceneOptions: { unit: 44, view: [-75, -65, 350, 325] },
  legend: [
    { cls: "acc", label: { vi: "đỉnh đang xét", en: "current vertex" } },
    { cls: "tle", label: { vi: "cạnh đang thử", en: "candidate edge" } },
    { cls: "ac", label: { vi: "giá trị vừa tính hoặc cạnh được chọn", en: "computed value or selected edge" } },
  ],
  steps: [
    {
      title: { vi: "Chọn các cạnh rời", en: "Choose disjoint edges" }, kind: "problem",
      body: {
        vi: "Cây có 7 đỉnh và 6 cạnh. Mỗi đỉnh chỉ được xuất hiện trong tối đa một cạnh đã chọn. Thử hết các tập con của 6 cạnh phải xét tới 2⁶ = 64 tập.",
        en: "The tree has 7 vertices and 6 edges. Each vertex can belong to at most one chosen edge. Exhaustive search would consider all 2⁶ = 64 edge subsets.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture([]),
    },
    {
      title: { vi: "Khởi tạo ở lá", en: "Start at the leaves" }, kind: "concept",
      body: {
        vi: "Trong cây con của <code>u</code>, <code>skip[u]</code> là số cạnh tối đa khi không lấy cạnh nào từ <code>u</code> xuống con, còn <code>take[u]</code> là khi lấy đúng một cạnh như vậy. Lá 4, 5 và 7 có <code>skip = 0</code> và <code>take = -1</code>, với −1 đánh dấu trạng thái bất khả thi.",
        en: "Inside <code>u</code>'s subtree, <code>skip[u]</code> is the best matching with zero edges from <code>u</code> to a child, and <code>take[u]</code> is the best with exactly one. Leaves 4, 5, and 7 have <code>skip = 0</code> and <code>take = -1</code>, where −1 marks an impossible state.",
      },
      lines: [1, 2, 3], watch: { skip: 0, take: -1 }, verdict: "run", fit: "all",
      scene: picture(LEAVES, LEAVES),
    },
    {
      title: { vi: "Tính nhánh một con", en: "Solve single-child branches" }, kind: "step",
      body: {
        vi: "Đỉnh 2 chỉ có con 4. Bỏ cạnh 2–4 thì còn 0 cạnh, còn lấy nó thì được <code>1 + skip[4] = 1</code>. Đỉnh 6 với con 7 cũng cho cặp giá trị <code>(0, 1)</code>.",
        en: "Vertex 2 has only child 4. Skipping edge 2–4 gives 0 edges, while taking it gives <code>1 + skip[4] = 1</code>. Vertex 6 and its child 7 give the same pair <code>(0, 1)</code>.",
      },
      lines: [5, 7, 8, 9], watch: { u: "2, 6", skip: 0, take: 1 }, verdict: "run", fit: "all",
      scene: picture(BRANCHES, [2, 6], [4, 7]),
    },
    {
      title: { vi: "So hai cạnh con", en: "Compare two child edges" }, kind: "step",
      body: {
        vi: "Ở đỉnh 3, bỏ cả hai cạnh xuống con cho <code>skip[3] = 0 + 1 = 1</code>. Lấy 3–5 cho <code>1 + 0 + 1 = 2</code> vì nhánh 6 vẫn giữ cạnh 6–7. Lấy 3–6 buộc dùng <code>skip[6] = 0</code>, nên chỉ được <code>1 + 0 + 0 = 1</code>.",
        en: "At vertex 3, skipping both child edges gives <code>skip[3] = 0 + 1 = 1</code>. Taking 3–5 gives <code>1 + 0 + 1 = 2</code> since branch 6 can keep edge 6–7. Taking 3–6 forces <code>skip[6] = 0</code>, yielding just <code>1 + 0 + 0 = 1</code>.",
      },
      note: {
        vi: "Dùng lại tổng <code>skip[u]</code> và chỉ thay phần đóng góp của đứa con được ghép với <code>u</code>.",
        en: "Reuse the total <code>skip[u]</code> and replace just the contribution of the child matched to <code>u</code>.",
      },
      lines: [5, 7, 8, 9], watch: { u: 3, skip: 1, take: 2 }, verdict: "run", fit: "all",
      scene: picture(CHILDREN, [3], [5, 6]),
    },
    {
      title: { vi: "Chốt ở gốc", en: "Read the root result" }, kind: "answer",
      body: {
        vi: "Bỏ các cạnh xuống con của gốc cho <code>skip[1] = 1 + 2 = 3</code>. Lấy 1–2 cho <code>1 + 0 + 2 = 3</code>, lấy 1–3 cho <code>1 + 1 + 1 = 3</code>, nên <code>take[1] = 3</code>. Một cách đạt tối đa là lấy các cạnh xanh 2–4, 3–5 và 6–7.",
        en: "Skipping the root's child edges gives <code>skip[1] = 1 + 2 = 3</code>. Taking 1–2 gives <code>1 + 0 + 2 = 3</code> and taking 1–3 gives <code>1 + 1 + 1 = 3</code>, so <code>take[1] = 3</code>. The green edges 2–4, 3–5, and 6–7 form one optimal matching.",
      },
      lines: [8, 9, 12, 13], watch: { u: 1, skip: 3, take: 3, answer: 3 },
      verdict: "ac", fit: "all", scene: picture(ALL, [1], [4, 5, 7], true),
    },
    {
      title: { vi: "Vì sao đủ hai trạng thái", en: "Why two states suffice" }, kind: "recap",
      body: {
        vi: "Mọi cách ghép hoặc bỏ hết cạnh từ <code>u</code> xuống con, hoặc lấy đúng một cạnh <code>u–v</code>. Trong trường hợp thứ hai, chỉ nhánh của <code>v</code> bị buộc dùng <code>skip[v]</code>, các nhánh khác vẫn lấy giá trị tốt nhất. Mỗi cạnh được duyệt số lần cố định nên thời gian và bộ nhớ đều là O(n).",
        en: "Every matching uses either zero child edges at <code>u</code> or exactly one edge <code>u–v</code>. In the latter case only <code>v</code>'s branch must use <code>skip[v]</code>, while the other branches take their best states. Each edge is visited a constant number of times, so time and space are O(n).",
      },
      lines: [5, 8, 9, 13], watch: { u: 1, skip: 3, take: 3, answer: 3 },
      verdict: "ac", fit: "all", scene: picture(ALL, [1], [4, 5, 7], true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  POSITIONS.forEach(([x, y], i) => {
    scene.add(`v${i + 1}`, { shape: shapes.block({ label: i + 1, w: 38, h: 28, depth: 4 }), x, y });
    const col = i * 0.84;
    scene.add(`col${i + 1}`, { shape: shapes.pill({ text: i + 1, h: 19 }), x: col, y: 7.85, o: 0 });
    STATES[i].forEach((_, j) => {
      scene.add(`dp${i + 1}-${j}`, {
        shape: shapes.block({ w: 31, h: 23, depth: 3 }), x: col, y: 9.14 + 1.29 * j, o: 0,
      });
    });
  });
  PARENT.slice(1).forEach((p, i) => {
    const u = i + 2;
    scene.link(`e${u}`, { from: `v${p}`, to: `v${u}`, anchor: "center", bend: 0, p: 1 });
  });
  ["u", "skip", "take"].forEach((key, i) => {
    scene.add(key, { shape: shapes.pill({ text: key, h: 21 }), x: -1.09, y: 7.85 + 1.29 * i, o: 0 });
  });
}
