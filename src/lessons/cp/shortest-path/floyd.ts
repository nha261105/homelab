import type { Lesson, SceneMap } from "../../../lib/types";

const vertices = ["A", "B", "C", "D", "E"];
const roads = [
  { u: 0, v: 1, w: 3, bend: 0.1 },
  { u: 1, v: 2, w: 2, bend: 0.1 },
  { u: 2, v: 3, w: 4, bend: 0.1 },
  { u: 3, v: 4, w: 1, bend: 0.1 },
  { u: 0, v: 2, w: 9, bend: -3.5 },
];

const direct = vertices.map((_, i) => vertices.map((_, j) => i === j ? 0 : Infinity));
for (const { u, v, w } of roads) direct[u][v] = direct[v][u] = w;

const phases = [direct];
for (let k = 0; k < vertices.length; k++) {
  const prev = phases[k];
  phases.push(prev.map((row, i) => row.map((value, j) => Math.min(value, prev[i][k] + prev[k][j]))));
}

const U = 52;
const cell = (i: number, j: number) => `d${i}${j}`;

function picture(phase: number, pivot = -1, focus?: [number, number]): SceneMap {
  const scene: SceneMap = {};
  vertices.forEach((v, i) => {
    const cls = i === pivot ? "is-active" : "";
    scene[v] = { cls };
    scene[`row${i}`] = { cls };
    scene[`col${i}`] = { cls };
  });
  phases[phase].forEach((row, i) => row.forEach((value, j) => {
    const improved = pivot >= 0 && value < phases[phase - 1][i][j];
    const inputs = focus && ((i === focus[0] && j === pivot) || (i === pivot && j === focus[1]));
    const answer = focus && i === focus[0] && j === focus[1];
    scene[cell(i, j)] = {
      text: value === Infinity ? "∞" : String(value),
      cls: improved || (answer && pivot < 0) ? "is-good"
        : inputs || answer ? "is-active" : value === Infinity ? "is-out" : "",
      ...(answer && improved ? { fx: { type: "pulse", delay: 350 } } : {}),
    };
  }));
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "shortest-path",
  slug: "floyd",
  title: { vi: "Floyd–Warshall", en: "Floyd–Warshall" },
  added: "2026-11-27",
  summary: {
    vi: "Cập nhật cả ma trận khoảng cách bằng cách lần lượt cho phép đi qua từng đỉnh trung gian.",
    en: "Update the whole distance matrix by allowing one additional intermediate vertex at a time.",
  },
  level: "medium",
  minutes: 9,
  time: "O(n³)",
  memory: "O(n²)",
  goal: { vi: "Tính khoảng cách giữa mọi cặp đỉnh, rồi đọc <b>d[A][E]</b>", en: "Find all pairwise distances, then read <b>d[A][E]</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">const long long</span> INF = 1LL &lt;&lt; 60;',
    'vector&lt;vector&lt;<span class="kw">long long</span>&gt;&gt; d(n, vector&lt;<span class="kw">long long</span>&gt;(n, INF));',
    '<span class="kw">for</span> (<span class="kw">int</span> i = 0; i &lt; n; ++i) d[i][i] = 0;',
    '<span class="kw">for</span> (<span class="kw">auto</span> [u, v, w] : roads)',
    '  d[u][v] = d[v][u] = min&lt;<span class="kw">long long</span>&gt;(d[u][v], w);',
    '<span class="kw">for</span> (<span class="kw">int</span> k = 0; k &lt; n; ++k)',
    '  <span class="kw">for</span> (<span class="kw">int</span> i = 0; i &lt; n; ++i)',
    '    <span class="kw">for</span> (<span class="kw">int</span> j = 0; j &lt; n; ++j)',
    '      <span class="kw">if</span> (d[i][k] != INF &amp;&amp; d[k][j] != INF)',
    '        d[i][j] = min(d[i][j], d[i][k] + d[k][j]);',
  ],
  watch: [{ key: "k", label: "k" }, { key: "pair", label: "(i, j)" }, { key: "via", label: "d[i][k] + d[k][j]" }, { key: "best", label: "d[i][j]" }],
  practice: [
    { src: "CSES 1672", name: "Shortest Routes II", lv: "★★☆", url: "https://cses.fi/problemset/task/1672" },
    { src: "LeetCode 1334", name: "Find the City With the Smallest Number of Neighbors at a Threshold Distance", lv: "★★☆", url: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/" },
  ],
  sceneOptions: { unit: U, view: [-40, -125, 320, 390] },
  legend: [
    { cls: "acc", label: { vi: "đỉnh trung gian và hai đoạn đang xét", en: "pivot and its two segments" } },
    { cls: "ac", label: { vi: "ô vừa giảm hoặc ô đáp án", en: "improved cell or answer" } },
    { cls: "dim", label: { vi: "chưa có đường đi", en: "no known route" } },
  ],
  steps: [
    {
      title: { vi: "Nhiều cặp cần hỏi", en: "Many pairs to query" }, kind: "problem",
      body: {
        vi: "Năm thành phố A đến E nối với nhau bằng đường hai chiều. Ta sẽ có nhiều câu hỏi, chẳng hạn từ A đến E tốn ít nhất bao nhiêu. Nếu chạy lại thuật toán tìm đường cho từng câu hỏi, ta có thể lặp lại cùng một phép tính.",
        en: "Five cities A through E are joined by two-way roads. We have many queries, such as the cheapest cost from A to E. Running a fresh shortest-path search for every query can repeat the same work.",
      },
      lines: [], watch: { pair: "(A, E)" }, verdict: "run", fit: "all", scene: picture(0),
    },
    {
      title: { vi: "Điền các cạnh trực tiếp", en: "Fill in direct roads" }, kind: "concept",
      body: {
        vi: "Hàng <code>i</code> là nơi đi, cột <code>j</code> là nơi đến. Khi chưa cho qua đỉnh trung gian, đường chéo bằng 0, cạnh A ↔ C cho <code>d[A][C] = d[C][A] = 9</code>, còn A tới E là ∞.",
        en: "Row <code>i</code> is the source and column <code>j</code> the destination. Before any intermediate vertex is allowed, the diagonal is 0, A ↔ C gives <code>d[A][C] = d[C][A] = 9</code>, and A to E is ∞.",
      },
      lines: [1, 2, 3, 4, 5], watch: { pair: "(A, C)", best: 9 }, verdict: "run", fit: "all", scene: picture(0, -1, [0, 2]),
    },
    {
      title: { vi: "Thử đi qua A", en: "Try going through A" }, kind: "step",
      body: {
        vi: "Đầu tiên cho phép A làm đỉnh trung gian. Đường B → A → C dài <code>3 + 9 = 12</code>, trong khi B ↔ C chỉ dài 2. Lượt <code>k = A</code> giữ nguyên mọi ô.",
        en: "First, allow A as an intermediate vertex. B → A → C costs <code>3 + 9 = 12</code>, while B ↔ C costs just 2. The <code>k = A</code> pass leaves every cell unchanged.",
      },
      lines: [6, 7, 8, 9, 10], watch: { k: "A", pair: "(B, C)", via: 12, best: 2 }, verdict: "run", fit: "all", scene: picture(1, 0, [1, 2]),
    },
    {
      title: { vi: "Qua B rẻ hơn", en: "Going via B saves" }, kind: "step",
      body: {
        vi: "Cho phép thêm B. Ghép A → B với B → C được <code>3 + 2 = 5</code>, nhỏ hơn 9. Hai ô đối xứng <code>d[A][C]</code> và <code>d[C][A]</code> cùng giảm xuống 5.",
        en: "Allow B too. Joining A → B with B → C costs <code>3 + 2 = 5</code>, lower than 9. Both symmetric cells <code>d[A][C]</code> and <code>d[C][A]</code> drop to 5.",
      },
      lines: [6, 9, 10], watch: { k: "B", pair: "(A, C)", via: 5, best: 5 }, verdict: "run", fit: "all", scene: picture(2, 1, [0, 2]),
    },
    {
      title: { vi: "Qua C tới D", en: "Reach D via C" }, kind: "step",
      body: {
        vi: "Ở lượt C, đoạn A → C đã có giá 5 nhờ đi qua B. Ghép thêm cạnh C → D giá 4, ta hạ <code>d[A][D]</code> từ ∞ xuống <code>5 + 4 = 9</code>.",
        en: "In C's pass, A → C already costs 5 thanks to B. Add the C → D edge of cost 4, and <code>d[A][D]</code> drops from ∞ to <code>5 + 4 = 9</code>.",
      },
      lines: [6, 9, 10], watch: { k: "C", pair: "(A, D)", via: 9, best: 9 }, verdict: "run", fit: "all", scene: picture(3, 2, [0, 3]),
    },
    {
      title: { vi: "Qua D tới E", en: "Reach E via D" }, kind: "step",
      body: {
        vi: "Lượt D dùng <code>d[A][D] = 9</code> và cạnh D → E giá 1. Ô <code>d[A][E]</code> giảm từ ∞ xuống <code>9 + 1 = 10</code>.",
        en: "D's pass uses <code>d[A][D] = 9</code> and the D → E edge of cost 1. The cell <code>d[A][E]</code> drops from ∞ to <code>9 + 1 = 10</code>.",
      },
      lines: [6, 9, 10], watch: { k: "D", pair: "(A, E)", via: 10, best: 10 }, verdict: "run", fit: "all", scene: picture(4, 3, [0, 4]),
    },
    {
      title: { vi: "Đọc ô đáp án", en: "Read the answer cell" }, kind: "answer",
      body: {
        vi: "Lượt cuối cho qua E không giảm ô nào: muốn đi qua E rồi sang thành phố khác phải quay lại D. Giờ đọc hàng A, cột E được 10, đúng bằng <code>3 + 2 + 4 + 1</code>.",
        en: "The final pass through E improves no cell: leaving E for another city would take us back through D. Now read row A, column E to get 10, the sum <code>3 + 2 + 4 + 1</code>.",
      },
      lines: [6, 7, 8, 10], watch: { k: "E", pair: "(A, E)", best: 10 }, verdict: "ac", fit: "all", scene: picture(5, -1, [0, 4]),
    },
    {
      title: { vi: "Vì sao k ở ngoài", en: "Why k goes outside" }, kind: "recap",
      body: {
        vi: "Lượt <code>k</code> giữ đường tốt nhất đã có hoặc tách đường mới tại <code>k</code> thành hai đoạn chỉ dùng các đỉnh trung gian đã mở trước đó. Đặt vòng <code>k</code> ngoài cùng để hoàn thành cả ma trận trước khi mở đỉnh tiếp theo. Tổng cộng O(n³) thời gian, O(n²) bộ nhớ và O(1) mỗi truy vấn.",
        en: "Pass <code>k</code> keeps the best known route or splits a new route at <code>k</code> into two pieces using previously allowed intermediate vertices. Keeping <code>k</code> outermost completes the entire matrix before allowing the next vertex. This costs O(n³) time and O(n²) space, with O(1) per query.",
      },
      lines: [6, 7, 8, 9, 10], watch: { pair: "(A, E)", best: 10 }, verdict: "ac", fit: "all", scene: picture(5, -1, [0, 4]),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  vertices.forEach((v, i) => {
    const x = 1.12 + i * 0.94;
    const y = 2.85 + i * 1.22;
    scene.add(v, { shape: shapes.block({ label: v, w: 33, h: 26, depth: 4 }), x });
    scene.add(`col${i}`, { shape: shapes.pill({ text: v }), x, y: 1.38 });
    scene.add(`row${i}`, { shape: shapes.pill({ text: v }), x: 0.22, y: y - 0.06 });
    vertices.forEach((_, j) => {
      scene.add(cell(i, j), {
        shape: shapes.block({ label: "∞", w: 40, h: 26, depth: 4, r: 6 }),
        x: 1.12 + j * 0.94, y,
      });
    });
  });
  scene.add("matrix", { shape: shapes.pill({ text: "d[i][j]" }), x: -0.15, y: 1.38 });
  roads.forEach(({ u, v, w, bend }, i) => {
    scene.link(`road${i}`, { from: vertices[u], to: vertices[v], anchor: "center", bend, p: 1 });
    scene.add(`w${i}`, { shape: shapes.pill({ text: w, h: 20, pad: 5 }), follow: `road${i}` });
  });
}
