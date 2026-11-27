import type { Lesson, SceneMap } from "../../../lib/types";

const POSITIONS = [[0, 0], [0, 2.9], [2.35, 0], [2.35, 2.9], [4.7, 1.45]];
const EDGES = [
  { u: 1, v: 3, arrow: "→", bend: 0.15 },
  { u: 2, v: 3, arrow: "↗", bend: -0.8 },
  { u: 2, v: 4, arrow: "→", bend: -0.1 },
  { u: 3, v: 5, arrow: "↘", bend: -0.4 },
  { u: 4, v: 5, arrow: "↗", bend: -0.4 },
];

function picture(order: number[], queue: number[], showRows = true, changed: number[] = []): SceneMap {
  const scene: SceneMap = {
    indeg: { o: showRows ? 1 : 0 }, queue: { o: showRows ? 1 : 0 }, order: { o: showRows ? 1 : 0 },
  };
  POSITIONS.forEach((_, i) => {
    const v = i + 1;
    const done = order.includes(v);
    const ready = queue.includes(v);
    const count = EDGES.filter((edge) => edge.v === v && !order.includes(edge.u)).length;
    scene[`v${v}`] = { cls: done ? "is-good" : ready ? "is-active" : "" };
    scene[`d${i}`] = {
      o: showRows ? 1 : 0, cls: done ? "is-out" : ready ? "is-active" : "",
      text: `${v}:${done ? "–" : count}`,
      ...(changed.includes(v) ? { fx: { type: "pulse", delay: 240 } } : {}),
    };
    scene[`o${i}`] = {
      o: showRows ? 1 : 0, cls: order[i] ? "is-good" : "is-out", text: String(order[i] ?? "—"),
    };
  });
  for (let i = 0; i < 2; i++) {
    scene[`q${i}`] = {
      o: showRows ? 1 : 0, cls: queue[i] ? "is-active" : "is-out", text: String(queue[i] ?? "—"),
    };
  }
  const last = order[order.length - 1];
  EDGES.forEach(({ u, v }, i) => {
    const removed = order.includes(u);
    const justRemoved = u === last && changed.includes(v);
    scene[`e${i}`] = { p: 1, o: removed ? 0.44 : 1, cls: justRemoved ? "v-eq" : "" };
    scene[`dir${i}`] = { o: removed ? 0.58 : 1, cls: justRemoved ? "v-eq" : "" };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "graphs", slug: "topo-sort",
  title: { vi: "Sắp xếp tô-pô", en: "Topological sort" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng thuật toán Kahn để xếp lịch học, mỗi lần lấy một môn không còn tiên quyết.",
    en: "Use Kahn's algorithm to schedule courses by taking one with no prerequisites left.",
  },
  level: "medium", minutes: 8, time: "O(V + E)", memory: "O(V)",
  goal: { vi: "Xếp thứ tự học <b>5 môn</b> sao cho mỗi môn tiên quyết đứng trước môn cần nó", en: "Order <b>5 courses</b> so every prerequisite comes before the course that needs it" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> n = adj.size() - 1;',
    'vector&lt;int&gt; indeg(n + 1), order;',
    '<span class="kw">for</span> (<span class="kw">int</span> u = 1; u &lt;= n; ++u)',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[u]) ++indeg[v];',
    'queue&lt;int&gt; q;',
    '<span class="kw">for</span> (<span class="kw">int</span> v = 1; v &lt;= n; ++v) <span class="kw">if</span> (!indeg[v]) q.push(v);',
    '<span class="kw">while</span> (!q.empty()) {',
    '  <span class="kw">int</span> u = q.front(); q.pop();',
    '  order.push_back(u);',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[u])',
    '    <span class="kw">if</span> (--indeg[v] == 0) q.push(v);',
    '}',
    '<span class="kw">bool</span> possible = order.size() == n;',
  ],
  watch: [
    { key: "u", label: "u" },
    { key: "update", label: { vi: "bậc vào vừa đổi", en: "updated indegree" } },
    { key: "size", label: "order.size()" },
  ],
  practice: [
    { src: "LeetCode 207", name: "Course Schedule", lv: "★★☆", url: "https://leetcode.com/problems/course-schedule/" },
    { src: "CSES 1679", name: "Course Schedule", lv: "★★☆", url: "https://cses.fi/problemset/task/1679" },
  ],
  sceneOptions: { unit: 52, view: [-65, -125, 380, 335] },
  legend: [
    { cls: "acc", label: { vi: "đã vào hàng đợi", en: "queued" } },
    { cls: "ac", label: { vi: "đã xếp lịch", en: "scheduled" } },
  ],
  steps: [
    {
      title: { vi: "Xếp lịch năm môn", en: "Schedule five courses" }, kind: "problem",
      body: {
        vi: "Mũi tên 1→3 nghĩa là phải học xong môn 1 trước môn 3. Ta cần một thứ tự thỏa cả 5 mũi tên. Thử từng hoán vị có tới <code>5! = 120</code> thứ tự.",
        en: "Arrow 1→3 means course 1 must come before course 3. We need an order that respects all 5 arrows. Trying every permutation gives <code>5! = 120</code> possible orders.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture([], [], false),
    },
    {
      title: { vi: "Đếm bậc vào", en: "Count incoming edges" }, kind: "concept",
      body: {
        vi: "Mỗi ô <code>v:số</code> trong hàng <code>indeg</code> ghi môn <code>v</code> còn bao nhiêu môn tiên quyết. Môn 3 phải chờ 1 và 2 nên có bậc vào 2. Hai môn 1 và 2 có bậc vào 0, nên đưa vào hàng đợi <code>q</code> trước.",
        en: "Each <code>v:count</code> cell in <code>indeg</code> shows how many prerequisites remain for course <code>v</code>. Course 3 waits for 1 and 2, so its indegree is 2. Courses 1 and 2 have indegree 0 and enter queue <code>q</code> first.",
      },
      lines: [2, 3, 4, 5, 6], watch: { size: 0 }, verdict: "run", fit: "all",
      scene: picture([], [1, 2]),
    },
    {
      title: { vi: "Xếp môn 1 trước", en: "Schedule course 1" }, kind: "step",
      body: {
        vi: "Lấy 1 khỏi <code>q</code> rồi thêm vào <code>order</code>. Bỏ ràng buộc 1→3, bậc vào của 3 giảm từ 2 xuống 1: môn 3 vẫn phải chờ môn 2.",
        en: "Pop 1 from <code>q</code> and append it to <code>order</code>. Removing prerequisite 1→3 drops 3's indegree from 2 to 1: course 3 still needs course 2.",
      },
      lines: [8, 9, 10, 11], watch: { u: 1, update: "3: 2 → 1", size: 1 }, verdict: "run", fit: "all",
      scene: picture([1], [2], true, [3]),
    },
    {
      title: { vi: "Mở khóa hai môn", en: "Unlock two courses" }, kind: "step",
      body: {
        vi: "Xếp môn 2 rồi bỏ 2→3 và 2→4. Cả hai bậc vào đều giảm từ 1 xuống 0, nên đưa lần lượt 3 và 4 vào <code>q</code>.",
        en: "Schedule course 2 and remove 2→3 and 2→4. Both indegrees drop from 1 to 0, so add 3 and then 4 to <code>q</code>.",
      },
      lines: [8, 9, 10, 11], watch: { u: 2, update: "3, 4: 1 → 0", size: 2 }, verdict: "run", fit: "all",
      scene: picture([1, 2], [3, 4], true, [3, 4]),
    },
    {
      title: { vi: "Môn 5 vẫn chờ", en: "Course 5 still waits" }, kind: "step",
      body: {
        vi: "Xếp môn 3, bỏ cạnh 3→5 và giảm bậc vào của 5 từ 2 xuống 1. Hàng đợi lúc này chỉ còn môn 4.",
        en: "Schedule course 3, remove 3→5, and reduce 5's indegree from 2 to 1. Course 4 is now the only course in the queue.",
      },
      lines: [8, 9, 10, 11], watch: { u: 3, update: "5: 2 → 1", size: 3 }, verdict: "run", fit: "all",
      scene: picture([1, 2, 3], [4], true, [5]),
    },
    {
      title: { vi: "Đưa 5 vào hàng", en: "Queue course 5" }, kind: "step",
      body: {
        vi: "Xếp môn 4 và bỏ cạnh 4→5. Bậc vào của 5 về 0, nên 5 là môn kế tiếp trong <code>q</code>.",
        en: "Schedule course 4 and remove 4→5. The indegree of 5 reaches 0, so 5 is next in <code>q</code>.",
      },
      lines: [8, 9, 10, 11], watch: { u: 4, update: "5: 1 → 0", size: 4 }, verdict: "run", fit: "all",
      scene: picture([1, 2, 3, 4], [5], true, [5]),
    },
    {
      title: { vi: "Xếp đủ năm môn", en: "Schedule all five courses" }, kind: "answer",
      body: {
        vi: "Lấy nốt 5 để được <code>order = [1, 2, 3, 4, 5]</code>. Cả 5 môn đã được xếp. Đổi chỗ 3 và 4 cũng hợp lệ vì cả hai đã sẵn sàng ngay sau môn 2.",
        en: "Pop 5 to get <code>order = [1, 2, 3, 4, 5]</code>. All 5 courses are scheduled. Swapping 3 and 4 also works because both were ready right after course 2.",
      },
      lines: [8, 9, 13], watch: { u: 5, size: 5 }, verdict: "ac", fit: "all",
      scene: picture([1, 2, 3, 4, 5], []),
    },
    {
      title: { vi: "Kiểm tra số môn", en: "Check the course count" }, kind: "recap",
      body: {
        vi: "Mỗi môn vào <code>order</code> khi tất cả tiên quyết đã được xếp. Nếu <code>q</code> rỗng mà <code>order.size() &lt; n</code>, mỗi môn còn lại đều phải chờ một môn khác trong phần còn lại, nên lần theo các tiên quyết sẽ gặp chu trình. Mỗi cạnh được đếm rồi bỏ tối đa một lần, tốn O(V + E) thời gian và O(V) bộ nhớ phụ.",
        en: "Each course enters <code>order</code> once all its prerequisites are scheduled. If <code>q</code> is empty with <code>order.size() &lt; n</code>, every remaining course depends on another remaining course, so following prerequisites eventually finds a cycle. Each edge is counted and removed at most once, giving O(V + E) time and O(V) extra space.",
      },
      lines: [6, 10, 11, 13], watch: { size: 5 }, verdict: "ac", fit: "all",
      scene: picture([1, 2, 3, 4, 5], []),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  POSITIONS.forEach(([x, y], i) => {
    scene.add(`v${i + 1}`, { shape: shapes.block({ label: i + 1, w: 43, h: 32 }), x, y });
  });
  EDGES.forEach(({ u, v, arrow, bend }, i) => {
    scene.link(`e${i}`, { from: `v${u}`, to: `v${v}`, bend });
    scene.add(`dir${i}`, { shape: shapes.pill({ text: arrow, h: 18, pad: 4 }), follow: `e${i}`, s: 1.25 });
  });
  scene.add("indeg", { shape: shapes.pill({ text: "indeg" }), x: -0.27, y: 4.5 });
  scene.add("queue", { shape: shapes.pill({ text: "q" }), x: -0.27, y: 5.92 });
  scene.add("order", { shape: shapes.pill({ text: "order" }), x: -0.27, y: 7.34 });
  for (let i = 0; i < 5; i++) {
    const x = 0.87 + 0.95 * i;
    scene.add(`d${i}`, { shape: shapes.block({ w: 45, h: 25 }), x, y: 4.5 });
    if (i < 2) scene.add(`q${i}`, { shape: shapes.block({ w: 40, h: 25 }), x, y: 5.92 });
    scene.add(`o${i}`, { shape: shapes.block({ w: 40, h: 25 }), x, y: 7.34 });
  }
}
