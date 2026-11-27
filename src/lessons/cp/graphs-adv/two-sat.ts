import type { Lesson, SceneMap } from "../../../lib/types";

const literals = [
  { label: "x", x: 5.4, y: 2.4 },
  { label: "¬x", x: 0, y: 2.4 },
  { label: "y", x: 1.8, y: 0 },
  { label: "¬y", x: 3.6, y: 4.8 },
  { label: "z", x: 3.6, y: 0 },
  { label: "¬z", x: 1.8, y: 4.8 },
];
const clauses = [[0, 2], [3, 4], [5, 0], [1, 1]];
const implications = clauses.flatMap(([a, b]) =>
  a === b ? [[a ^ 1, b]] : [[a ^ 1, b], [b ^ 1, a]],
);
const ids = literals.map((_, i) => `lit${i}`);
const withClause = [...ids, "clause"];
const withComponents = [...withClause, "comp", ...literals.map((_, i) => `slot${i}`)];
const satisfiable = [5, 0, 3, 2, 4, 1];
const contradictory = [0, 0, 0, 0, 0, 0];

function picture(
  count = 0, active: number[] = [], clause = "", comp: number[] = [],
  verdict: "assign" | "conflict" | "" = "", draw = false,
): SceneMap {
  const scene: SceneMap = {
    clause: { text: clause, o: clause ? 1 : 0 },
    comp: { o: comp.length ? 1 : 0 },
  };
  const focused = new Set(active.flatMap((i) => implications[i]));
  literals.forEach((_, i) => {
    const conflict = verdict === "conflict" && i < 2;
    const cls = conflict ? "is-bad" : verdict === "assign"
      ? (comp[i] > comp[i ^ 1] ? "is-good" : "is-out") : focused.has(i) ? "is-active" : "";
    scene[`lit${i}`] = { cls };
    scene[`slot${i}`] = { text: comp[i] ?? "", o: comp.length ? 1 : 0, cls };
  });
  implications.forEach((_, i) => {
    const highlighted = active.includes(i);
    scene[`edge${i}`] = {
      p: i < count ? 1 : 0,
      o: active.length && !highlighted ? 0.45 : 1,
      cls: highlighted ? (verdict === "conflict" ? "v-gt" : "v-lt") : "",
      ...(draw && highlighted ? { from: { p: 0 }, delay: 160, dur: 490 } : {}),
    };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "graphs-adv", slug: "two-sat",
  title: { vi: "2-SAT", en: "2-SAT" },
  added: "2026-11-27",
  summary: {
    vi: "Đổi mệnh đề hai literal thành cạnh suy ra rồi dùng SCC để tìm nghiệm hoặc phát hiện mâu thuẫn.",
    en: "Turn two-literal clauses into implications and use SCCs to find an assignment or detect a contradiction.",
  },
  level: "hard", minutes: 11, time: "O(n + m)", memory: "O(n + m)",
  goal: { vi: "Tìm giá trị cho <b>x, y, z</b> sao cho mọi mệnh đề đều đúng", en: "Assign <b>x, y, z</b> so that every clause is true" },
  codeLang: "C++17",
  code: [
    'optional&lt;vector&lt;int&gt;&gt; solve(int n, const vector&lt;pair&lt;int, int&gt;&gt;&amp; clauses) {',
    '  vector&lt;vector&lt;int&gt;&gt; g(2*n);',
    '  <span class="kw">for</span> (auto [a, b] : clauses) {',
    '    g[a ^ 1].push_back(b);',
    '    g[b ^ 1].push_back(a);',
    '  }',
    '  <span class="kw">auto</span> comp = kosaraju(g);  <span class="cm">// source-to-sink SCC ids</span>',
    '  vector&lt;int&gt; value(n);',
    '  <span class="kw">for</span> (int i = 0; i &lt; n; ++i) {',
    '    int yes = comp[2*i], no = comp[2*i+1];',
    '    <span class="kw">if</span> (yes == no) return nullopt;',
    '    value[i] = yes &gt; no;',
    '  }',
    '  <span class="kw">return</span> value;',
    '}',
  ],
  watch: [
    { key: "m", label: "m" }, { key: "x", label: "comp[x], comp[¬x]" },
    { key: "value", label: "value[x, y, z]" },
  ],
  practice: [
    { src: "CSES 1684", name: "Giant Pizza", lv: "★★☆", url: "https://cses.fi/problemset/task/1684" },
    { src: "Codeforces 776D", name: "The Door Problem", lv: "★★★", url: "https://codeforces.com/problemset/problem/776/D" },
  ],
  sceneOptions: { unit: 54 },
  legend: [
    { cls: "acc", label: { vi: "literal đang xét", en: "literal in focus" } },
    { cls: "ac", label: { vi: "literal đúng", en: "true literal" } },
    { cls: "dim", label: { vi: "literal sai", en: "false literal" } },
    { cls: "wa", label: { vi: "cặp gây mâu thuẫn", en: "contradictory pair" } },
  ],
  steps: [
    {
      title: { vi: "Thỏa mọi mệnh đề", en: "Satisfy every clause" }, kind: "problem",
      body: {
        vi: "Ta cần cả ba mệnh đề <code>(x ∨ y)</code>, <code>(¬y ∨ z)</code>, <code>(¬z ∨ x)</code> cùng đúng. Mỗi biến có hai literal, chẳng hạn x và ¬x, nên đồ thị có 6 đỉnh. Thử hết cần 2³ = 8 cách gán, và số cách tăng gấp đôi mỗi khi thêm biến.",
        en: "We need all three clauses <code>(x ∨ y)</code>, <code>(¬y ∨ z)</code>, and <code>(¬z ∨ x)</code> to hold. Each variable has two literals, such as x and ¬x, making 6 vertices. Brute force tries 2³ = 8 assignments, doubling with each new variable.",
      },
      lines: [1, 2], watch: { m: 3 }, verdict: "run", fit: ids, scene: picture(),
    },
    {
      title: { vi: "Tách thành hai cạnh", en: "Make two implication edges" }, kind: "concept",
      body: {
        vi: "Với <code>x ∨ y</code>, nếu x sai thì y buộc đúng, tạo cạnh ¬x→y. Tương tự, nếu y sai thì x buộc đúng, tạo cạnh ¬y→x. Đánh số hai literal của biến <code>i</code> là <code>2*i</code> và <code>2*i+1</code> để <code>^ 1</code> đổi sang literal đối nhau.",
        en: "For <code>x ∨ y</code>, if x is false then y must be true, giving ¬x→y. Likewise, if y is false then x must be true, giving ¬y→x. Give variable <code>i</code> the literal IDs <code>2*i</code> and <code>2*i+1</code> so that <code>^ 1</code> flips a literal to its negation.",
      },
      lines: [1, 3, 4, 5], watch: { m: 3 }, verdict: "run", fit: withClause,
      scene: picture(2, [0, 1], "x ∨ y", [], "", true),
    },
    {
      title: { vi: "Nối thêm các suy ra", en: "Add the other implications" }, kind: "step",
      body: {
        vi: "<code>¬y ∨ z</code> cho y→z và ¬z→¬y. <code>¬z ∨ x</code> cho z→x và ¬x→¬z. Sáu cạnh tạo hai đường từ ¬x tới x, ví dụ ¬x→y→z→x, nên mọi nghiệm đều phải chọn x đúng.",
        en: "<code>¬y ∨ z</code> gives y→z and ¬z→¬y. <code>¬z ∨ x</code> gives z→x and ¬x→¬z. The six edges form two paths from ¬x to x, including ¬x→y→z→x, so every solution must set x true.",
      },
      lines: [3, 4, 5], watch: { m: 3 }, verdict: "run", fit: withClause,
      scene: picture(6, [2, 3, 4, 5], "(¬y ∨ z) ∧ (¬z ∨ x)", [], "", true),
    },
    {
      title: { vi: "So nhãn từng cặp", en: "Compare each literal pair" }, kind: "step",
      body: {
        vi: "Chạy Kosaraju với DFS đầu trên đồ thị gốc và DFS sau trên đồ thị đảo, thu được 6 SCC một đỉnh. Chẳng hạn <code>comp[x] = 5</code>, <code>comp[¬x] = 0</code>. Cả ba cặp literal đối nhau đều nằm ở hai SCC khác nhau.",
        en: "Run Kosaraju with the first DFS on the original graph and the second on its reverse. It finds 6 singleton SCCs, including <code>comp[x] = 5</code> and <code>comp[¬x] = 0</code>. Every pair of opposite literals belongs to distinct SCCs.",
      },
      lines: [7, 9, 10, 11], watch: { m: 3, x: "5, 0" }, verdict: "run", fit: withComponents,
      scene: picture(6, [], "(x ∨ y) ∧ (¬y ∨ z) ∧ (¬z ∨ x)", satisfiable),
    },
    {
      title: { vi: "Chọn literal đứng sau", en: "Choose the later literal" }, kind: "answer",
      body: {
        vi: "Nhãn SCC tăng theo thứ tự tô-pô, nên với mỗi cặp, chọn literal có nhãn lớn hơn làm đúng. Ta có 5 &gt; 0, 3 &gt; 2 và 4 &gt; 1, tức <code>x = y = z = 1</code>. Khi đó x, z, x lần lượt làm ba mệnh đề đúng.",
        en: "SCC IDs increase in topological order, so set the later literal in each pair to true. The comparisons 5 &gt; 0, 3 &gt; 2, and 4 &gt; 1 give <code>x = y = z = 1</code>. Then x, z, and x satisfy the three clauses, respectively.",
      },
      lines: [9, 10, 12, 14], watch: { m: 3, x: "5, 0", value: "1, 1, 1" }, verdict: "ac", fit: withComponents,
      scene: picture(6, [], "(x ∨ y) ∧ (¬y ∨ z) ∧ (¬z ∨ x)", satisfiable, "assign"),
    },
    {
      title: { vi: "Thêm điều kiện x sai", en: "Add a clause forcing ¬x" }, kind: "step",
      body: {
        vi: "Thử thêm <code>¬x ∨ ¬x</code>, tức bắt buộc x sai. Hai cạnh mà code sinh ra đều là x→¬x, nên sơ đồ chỉ vẽ một cạnh. Cạnh mới khép vòng với đường ¬x→y→z→x.",
        en: "Now add <code>¬x ∨ ¬x</code> to force x false. Both generated edges are x→¬x, so the diagram draws one arrow. The new edge closes a cycle with the path ¬x→y→z→x.",
      },
      lines: [3, 4, 5, 7], watch: { m: 4 }, verdict: "run", fit: withClause,
      scene: picture(7, [6], "¬x ∨ ¬x", [], "", true),
    },
    {
      title: { vi: "Phát hiện mâu thuẫn", en: "Detect the contradiction" }, kind: "answer",
      body: {
        vi: "Giờ x và ¬x cùng nằm ở SCC 0. Nếu x đúng, cạnh x→¬x buộc ¬x đúng. Nếu ¬x đúng, đường ¬x→y→z→x buộc x đúng, nên công thức bốn mệnh đề vô nghiệm.",
        en: "Now x and ¬x share SCC 0. If x is true, x→¬x forces ¬x to be true. If ¬x is true, ¬x→y→z→x forces x to be true, so the four-clause formula is unsatisfiable.",
      },
      lines: [7, 9, 10, 11], watch: { m: 4, x: "0, 0" }, verdict: "ac", fit: withComponents,
      scene: picture(7, [0, 2, 4, 6], "¬x ∨ ¬x", contradictory, "conflict"),
    },
    {
      title: { vi: "Vì sao phép gán đúng?", en: "Why the assignment works" }, kind: "recap",
      body: {
        vi: "Khi hai literal đối nhau có nhãn khác nhau, quy tắc chọn nhãn lớn hơn luôn giữ đúng các cạnh suy ra. Nếu có cạnh u→v từ literal đúng sang literal sai, cạnh đi kèm ¬v→¬u cho <code>comp[¬u] &lt; comp[u] ≤ comp[v] &lt; comp[¬v] ≤ comp[¬u]</code>, một mâu thuẫn. Với 2n đỉnh và 2m cạnh tính cả cạnh trùng, thời gian và bộ nhớ đều là O(n + m).",
        en: "When opposite literals have different IDs, choosing the larger ID respects all implications. If u→v went from true to false, its paired edge ¬v→¬u would give <code>comp[¬u] &lt; comp[u] ≤ comp[v] &lt; comp[¬v] ≤ comp[¬u]</code>, a contradiction. With 2n vertices and 2m edges including duplicates, time and space are both O(n + m).",
      },
      lines: [4, 5, 7, 11, 12], watch: { m: 3, x: "5, 0", value: "1, 1, 1" }, verdict: "ac", fit: withComponents,
      scene: picture(6, [], "(x ∨ y) ∧ (¬y ∨ z) ∧ (¬z ∨ x)", satisfiable, "assign"),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  literals.forEach(({ label, x, y }, i) => {
    scene.add(`lit${i}`, { shape: shapes.block({ label, w: 42, h: 31, depth: 4 }), x, y });
    scene.add(`slot${i}`, {
      shape: shapes.block({ sub: label, w: 34, h: 25, depth: 4 }),
      x: 0.7 + 0.96 * i, y: 7.3, o: 0,
    });
  });
  scene.add("comp", { shape: shapes.pill({ text: "comp", h: 22, pad: 5 }), x: -0.4, y: 7.24, o: 0 });
  scene.add("clause", { shape: shapes.pill({ h: 23 }), x: 2.7, y: -1.5, o: 0 });
  implications.forEach(([u, v], i) => {
    scene.link(`edge${i}`, { from: `lit${u}`, to: `lit${v}`, anchor: "center", arrow: true, bend: 0 });
  });
}
