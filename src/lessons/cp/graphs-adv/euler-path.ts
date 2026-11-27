import type { Lesson, SceneMap } from "../../../lib/types";

const POSITIONS = [[0.4, 2.5], [2.65, 2.5], [1.84, 0], [4.1, 0], [0.4, 5], [5.62, 2.5]];
const EDGES = [
  { u: 1, v: 2, bend: 0 }, { u: 2, v: 6, bend: 0 },
  { u: 2, v: 3, bend: 0 }, { u: 3, v: 4, bend: 0 }, { u: 4, v: 2, bend: 0 },
  { u: 1, v: 5, bend: 0.9 }, { u: 5, v: 1, bend: 0.9 },
];
const trail = [1, 5, 1, 2, 3, 4, 2, 6];

function picture(stack: number[], out: number[], used: number, fresh: number[] = [], done = false): SceneMap {
  const scene: SceneMap = {};
  const top = stack[stack.length - 1];
  POSITIONS.forEach((_, i) => {
    const v = i + 1;
    scene[`v${v}`] = { cls: done ? "is-good" : v === top ? "is-active" : "" };
  });
  EDGES.forEach((_, i) => {
    scene[`e${i}`] = {
      cls: done || fresh.includes(i) ? "v-eq" : "",
      o: i < used && !fresh.includes(i) && !done ? 0.34 : 1,
      ...(fresh.includes(i) ? { from: { p: 0 }, delay: 110 + fresh.indexOf(i) * 95, dur: 350 } : {}),
    };
  });
  for (let i = 0; i <= EDGES.length; i++) {
    scene[`s${i}`] = { text: String(stack[i] ?? "—"), cls: !stack[i] ? "is-out" : i === stack.length - 1 ? "is-active" : "" };
    scene[`a${i}`] = { text: String(out[i] ?? "—"), cls: !out[i] ? "is-out" : done ? "is-good" : "" };
  }
  return scene;
}

const final = picture([], trail, EDGES.length, [], true);

export const lesson: Lesson = {
  track: "cp", topic: "graphs-adv", slug: "euler-path",
  title: { vi: "Đường đi Euler", en: "Eulerian paths" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng stack trong thuật toán Hierholzer để đi mỗi cạnh đúng một lần và ghi đỉnh khi hết lối đi.",
    en: "Use Hierholzer's stack to traverse each edge once and record vertices when no exits remain.",
  },
  level: "hard", minutes: 9, time: "O(V + E)", memory: "O(V + E)",
  goal: { vi: "Đi từ <b>1 tới 6</b>, dùng đủ 7 cạnh có hướng đúng một lần", en: "Go from <b>1 to 6</b>, using each of the 7 directed edges once" },
  codeLang: "C++17",
  code: [
    '<span class="kw">for</span> (<span class="kw">int</span> v = 1; v &lt;= n; ++v)',
    '  <span class="kw">if</span> (outdeg[v] - indeg[v] != (v == s) - (v == t)) <span class="kw">return</span> {};',
    'vector&lt;<span class="kw">int</span>&gt; st{s}, ans;',
    '<span class="kw">while</span> (!st.empty()) {',
    '  <span class="kw">int</span> u = st.back();',
    '  <span class="kw">if</span> (adj[u].empty()) {',
    '    ans.push_back(u); st.pop_back();',
    '  } <span class="kw">else</span> {',
    '    <span class="kw">int</span> v = adj[u].back(); adj[u].pop_back();',
    '    st.push_back(v);',
    '  }',
    '}',
    '<span class="kw">if</span> (ans.size() != m + 1) <span class="kw">return</span> {};',
    'reverse(ans.begin(), ans.end());',
    '<span class="kw">return</span> ans;',
  ],
  watch: [
    { key: "top", label: "st.back()" },
    { key: "used", label: { vi: "cạnh đã dùng", en: "edges used" } },
    { key: "size", label: "ans.size()" },
  ],
  practice: [
    { src: "CSES 1691", name: "Mail Delivery", lv: "★★☆", url: "https://cses.fi/problemset/task/1691/" },
    { src: "CSES 1693", name: "Teleporters Path", lv: "★★★", url: "https://cses.fi/problemset/task/1693/" },
  ],
  sceneOptions: { unit: 55, view: [-50, -105, 420, 325] },
  legend: [
    { cls: "acc", label: { vi: "đỉnh trên cùng của stack", en: "top of the stack" } },
    { cls: "ac", label: { vi: "cạnh vừa lấy hoặc đường Euler", en: "newly used edge or Eulerian trail" } },
    { cls: "dim", label: { vi: "cạnh đã lấy từ trước", en: "previously used edge" } },
  ],
  steps: [
    {
      title: { vi: "Đi qua mọi cạnh", en: "Traverse every edge" }, kind: "problem",
      body: {
        vi: "Ta cần đi từ 1 tới 6 qua đủ 7 cạnh, mỗi cạnh đúng một lần. Đỉnh 1 hay 2 có thể xuất hiện lại. Nếu thử mọi thứ tự của 7 cạnh thì có tới <code>7! = 5040</code> hoán vị.",
        en: "We need to go from 1 to 6 and traverse all 7 edges exactly once. Vertices such as 1 or 2 can appear again. Trying every ordering of the 7 edges gives <code>7! = 5040</code> permutations.",
      },
      lines: [], watch: { used: 0 }, verdict: "run", fit: "all", scene: picture([], [], 0),
    },
    {
      title: { vi: "So bậc vào, ra", en: "Check the degree balance" }, kind: "concept",
      body: {
        vi: "Đỉnh 1 có 2 cạnh ra và 1 cạnh vào, đỉnh 6 có 0 cạnh ra và 1 cạnh vào. Mọi đỉnh khác có bậc ra bằng bậc vào, đúng điều kiện để bắt đầu ở <code>s = 1</code> và kết thúc ở <code>t = 6</code>. Đặt 1 vào <code>st</code>; bên phải là đỉnh trên cùng.",
        en: "Vertex 1 has 2 outgoing edges and 1 incoming edge, while 6 has 0 outgoing and 1 incoming. Every other vertex balances, as required for start <code>s = 1</code> and finish <code>t = 6</code>. Put 1 in <code>st</code>, whose top is at the right.",
      },
      lines: [1, 2, 3], watch: { top: 1, used: 0, size: 0 }, verdict: "run", fit: "all",
      scene: picture([1], [], 0),
    },
    {
      title: { vi: "Đi đến ngõ cụt", en: "Reach a dead end" }, kind: "step",
      body: {
        vi: "Lấy lần lượt 1→2 và 2→6, xóa mỗi cạnh khỏi <code>adj</code> ngay khi dùng. Đến 6 thì hết cạnh ra, nhưng mới dùng 2 trong 7 cạnh nên không thể giữ nguyên thứ tự đi này làm đáp án.",
        en: "Take 1→2 and then 2→6, removing each edge from <code>adj</code> on use. Vertex 6 has no exits, but we have used only 2 of the 7 edges, so the order taken so far cannot be the answer.",
      },
      lines: [4, 5, 8, 9, 10], watch: { top: 6, used: 2, size: 0 }, verdict: "run", fit: "all",
      scene: picture([1, 2, 6], [], 2, [0, 1]),
    },
    {
      title: { vi: "Ghi 6 rồi lùi", en: "Record 6 and backtrack" }, kind: "step",
      body: {
        vi: "Khi đỉnh trên cùng hết lối đi, lấy nó khỏi <code>st</code> rồi ghi vào <code>ans</code>. Ghi 6 trước, vì đoạn đường đã chốt nằm ở cuối đáp án. Đỉnh 2 lộ ra và vẫn còn cạnh 2→3.",
        en: "When the top has no unused exit, pop it from <code>st</code> and append it to <code>ans</code>. Record 6 first because this finalized part belongs at the end. Vertex 2 is back on top and still has edge 2→3.",
      },
      lines: [4, 5, 6, 7], watch: { top: 2, used: 2, size: 1 }, verdict: "run", fit: "all",
      scene: picture([1, 2], [6], 2),
    },
    {
      title: { vi: "Vòng lại qua 2", en: "Loop back to 2" }, kind: "step",
      body: {
        vi: "Đi nốt vòng 2→3→4→2. Lần này 2 hết cạnh ra, và khi lùi tiếp, 4, 3 rồi bản ghi 2 cũ cũng hết cạnh. Sau khi ghi 4 đỉnh đó, <code>ans = [6, 2, 4, 3, 2]</code> và stack chỉ còn 1.",
        en: "Take the loop 2→3→4→2. This time 2 is out of exits, and backtracking finds that 4, 3 and the earlier copy of 2 are out too. After recording those 4 vertices, <code>ans = [6, 2, 4, 3, 2]</code> and only 1 remains on the stack.",
      },
      lines: [4, 5, 6, 7, 9, 10], watch: { top: 1, used: 5, size: 5 }, verdict: "run", fit: "all",
      scene: picture([1], [6, 2, 4, 3, 2], 5, [2, 3, 4]),
    },
    {
      title: { vi: "Lấy vòng cuối", en: "Take the last loop" }, kind: "step",
      body: {
        vi: "Từ 1 đi tiếp 1→5→1. Không còn cạnh nào để lấy, nên lần lượt ghi 1, 5, 1 vào cuối <code>ans</code>. Stack rỗng và <code>ans.size() = 8 = m + 1</code>, tức là đã dùng đủ 7 cạnh.",
        en: "From 1, take the remaining loop 1→5→1. No edges remain, so append 1, 5, 1 to <code>ans</code> in that order. The stack is empty and <code>ans.size() = 8 = m + 1</code>, so all 7 edges were used.",
      },
      lines: [4, 6, 7, 9, 10, 13], watch: { used: 7, size: 8 }, verdict: "run", fit: "all",
      scene: picture([], [6, 2, 4, 3, 2, 1, 5, 1], 7, [5, 6]),
    },
    {
      title: { vi: "Đảo thứ tự đã ghi", en: "Reverse the recorded order" }, kind: "answer",
      body: {
        vi: "Đảo <code>ans</code> được 1→5→1→2→3→4→2→6. Vòng qua 5 được ghép vào ở 1, vòng qua 3 và 4 được ghép vào ở 2, rồi mới tới đích 6.",
        en: "Reverse <code>ans</code> to get 1→5→1→2→3→4→2→6. The loop through 5 is spliced in at 1 and the loop through 3 and 4 at 2, before the final move to 6.",
      },
      lines: [14, 15], watch: { used: 7, size: 8 }, verdict: "ac", fit: "all", scene: final,
    },
    {
      title: { vi: "Ghép vòng khi lùi", en: "Splice loops while backtracking" }, kind: "recap",
      note: {
        vi: "Với chu trình Euler vô hướng, kiểm tra mọi bậc đều chẵn và đánh dấu mỗi cạnh đã dùng bằng ID chung ở cả hai đầu.",
        en: "For an undirected Eulerian circuit, check that all degrees are even and track used edges by an ID shared by both endpoints.",
      },
      body: {
        vi: "Cân bằng bậc bảo đảm sau đoạn đi tới đích, phần cạnh còn lại cân bằng ở mọi đỉnh, nên mỗi lượt đi tiếp tạo thành một vòng ghép được. Kiểm tra <code>m + 1</code> phát hiện phần cạnh không tới được từ 1. Mỗi cạnh làm stack thêm một mục, nên cả bước kiểm tra bậc lẫn dựng đường tốn O(V + E) thời gian và bộ nhớ.",
        en: "After the initial trail reaches the finish, the degree check ensures unused edges balance at every vertex, so each further walk forms a loop that can be spliced in. The <code>m + 1</code> check catches edges unreachable from 1. Each edge adds one stack entry, so checking degrees and building the trail take O(V + E) time and space.",
      },
      lines: [1, 2, 4, 7, 10, 13, 14], watch: { used: 7, size: 8 }, verdict: "ac", fit: "all", scene: final,
    },
  ],
};

export function setup(scene: any, shapes: any) {
  POSITIONS.forEach(([x, y], i) => {
    scene.add(`v${i + 1}`, { shape: shapes.block({ label: i + 1, w: 44, h: 34 }), x, y });
  });
  EDGES.forEach(({ u, v, bend }, i) => {
    scene.link(`e${i}`, { from: `v${u}`, to: `v${v}`, anchor: "center", arrow: true, bend, p: 1 });
  });
  scene.add("st", { shape: shapes.pill({ text: "st", h: 22 }), x: -0.38, y: 6.5 });
  scene.add("ans", { shape: shapes.pill({ text: "ans", h: 22 }), x: -0.38, y: 7.9 });
  for (let i = 0; i <= EDGES.length; i++) {
    const x = 0.47 + i * 0.74;
    scene.add(`s${i}`, { shape: shapes.block({ w: 33, h: 26, depth: 4 }), x, y: 6.6 });
    scene.add(`a${i}`, { shape: shapes.block({ w: 33, h: 26, depth: 4 }), x, y: 8 });
  }
}
