import type { Lesson, SceneMap } from "../../../lib/types";

const NODES = [
  { prefix: "", parent: "", x: 0, depth: 0, terminal: false },
  { prefix: "c", parent: "", x: -1.35, depth: 1, terminal: false },
  { prefix: "ca", parent: "c", x: -1.35, depth: 2, terminal: false },
  { prefix: "car", parent: "ca", x: -2.15, depth: 3, terminal: true },
  { prefix: "cat", parent: "ca", x: -0.55, depth: 3, terminal: true },
  { prefix: "d", parent: "", x: 1.35, depth: 1, terminal: false },
  { prefix: "do", parent: "d", x: 1.35, depth: 2, terminal: false },
  { prefix: "dog", parent: "do", x: 1.35, depth: 3, terminal: true },
];
const id = (prefix: string) => prefix || "root";

function tree(count: number, path = "", formula = "", result = "", failure = false): SceneMap {
  const scene: SceneMap = {
    calc: { text: formula, o: formula ? 1 : 0 },
    result: { text: result, o: result ? 1 : 0, cls: failure ? "v-gt" : result.endsWith("✓") ? "v-eq" : "" },
  };
  NODES.forEach(({ prefix, terminal, depth }, i) => {
    const onPath = !!path && path.startsWith(prefix);
    scene[id(prefix)] = {
      o: i < count ? 1 : 0,
      cls: failure && prefix === path ? "is-bad" : terminal ? "is-good" : onPath ? "is-active" : "",
    };
    if (prefix) scene[`edge-${prefix}`] = i < count ? {
      p: 1,
      cls: onPath ? "v-eq" : "",
      ...(onPath ? { from: { p: 0 }, delay: (depth - 1) * 140, dur: 320 } : {}),
    } : { p: 0 };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "strings", slug: "trie",
  title: { vi: "Trie", en: "Trie" },
  added: "2026-11-27",
  summary: {
    vi: "Lưu các từ chung tiền tố trên cùng một nhánh và tra cứu bằng cách đi từng chữ.",
    en: "Store shared prefixes on a single path and look up words one letter at a time.",
  },
  level: "medium", minutes: 8, time: "O(|w|) / operation", memory: "O(26 · nodes)",
  goal: { vi: "Thêm <b>car, cat, dog</b> rồi tìm <b>ca, cab, cat</b>", en: "Insert <b>car, cat, dog</b> and look up <b>ca, cab, cat</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">struct</span> Node { <span class="kw">int</span> next[26]{}; <span class="kw">bool</span> end = false; };',
    'vector&lt;Node&gt; tr(1);',
    '<span class="kw">auto</span> walk = [&amp;](<span class="kw">const</span> string&amp; w, <span class="kw">bool</span> insert) {',
    '  <span class="kw">int</span> u = 0;',
    "  <span class=\"kw\">for</span> (<span class=\"kw\">char</span> c : w) {",
    "    <span class=\"kw\">int</span> k = c - 'a';",
    '    <span class="kw">if</span> (!tr[u].next[k]) {',
    '      <span class="kw">if</span> (!insert) <span class="kw">return</span> -1;',
    '      tr[u].next[k] = tr.size(); tr.emplace_back();',
    '    }',
    '    u = tr[u].next[k];',
    '  }',
    '  <span class="kw">if</span> (insert) tr[u].end = true;',
    '  <span class="kw">return</span> u;',
    '};',
  ],
  watch: [
    { key: "w", label: "w" },
    { key: "nodes", label: { vi: "số nút", en: "node count" } },
    { key: "end", label: "end" },
  ],
  practice: [
    { src: "LeetCode 208", name: "Implement Trie (Prefix Tree)", lv: "★★☆", url: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
    { src: "CSES 1731", name: "Word Combinations", lv: "★★★", url: "https://cses.fi/problemset/task/1731" },
  ],
  sceneOptions: { unit: 57 },
  legend: [
    { cls: "acc", label: { vi: "đường đang đi", en: "current path" } },
    { cls: "ac", label: { vi: "nút kết thúc từ (✓)", en: "word ending (✓)" } },
    { cls: "wa", label: { vi: "điểm tra cứu dừng", en: "where lookup stops" } },
  ],
  steps: [
    {
      title: { vi: "Tra trong từ điển", en: "Look up a word" }, kind: "problem",
      body: {
        vi: "Ta có ba từ <code>car</code>, <code>cat</code> và <code>dog</code>. Cần biết một chuỗi có phải từ hoàn chỉnh hoặc tiền tố trong từ điển hay không. Quét qua k từ có thể mất O(k · |w|) mỗi lần hỏi chuỗi <code>w</code>.",
        en: "The dictionary contains <code>car</code>, <code>cat</code>, and <code>dog</code>. We want to test whether a string is a whole word or a prefix. Scanning k words can cost O(k · |w|) for a query string <code>w</code>.",
      },
      lines: [], watch: { nodes: 1 }, verdict: "run", fit: "all", scene: tree(1),
    },
    {
      title: { vi: "Tạo nhánh cho car", en: "Build the car path" }, kind: "concept",
      body: {
        vi: "Gốc <code>ε</code> đại diện cho tiền tố rỗng. Từ gốc, lần lượt tạo cạnh <code>c</code>, <code>a</code>, <code>r</code> tại những chỗ còn thiếu. Đọc hết <code>car</code>, đặt <code>end = true</code> ở nút <code>r</code>.",
        en: "Root <code>ε</code> represents the empty prefix. Starting there, create missing edges for <code>c</code>, <code>a</code>, and <code>r</code>. At the end of <code>car</code>, set <code>end = true</code> on the <code>r</code> node.",
      },
      lines: [1, 2, 4, 5, 6, 7, 9, 11, 13], watch: { w: "car", nodes: 4, end: "true" }, verdict: "run", fit: "all",
      scene: tree(4, "car", "ε → c → ca → car", "end(car) = true"),
    },
    {
      title: { vi: "Dùng chung đoạn ca", en: "Share the ca path" }, kind: "step",
      body: {
        vi: "Khi thêm <code>cat</code>, đi qua hai cạnh <code>c</code> và <code>a</code> đã có. Tại nút đại diện cho <code>ca</code>, tạo thêm cạnh <code>t</code> bên cạnh cạnh <code>r</code> và đánh dấu kết thúc ở nút mới.",
        en: "When inserting <code>cat</code>, follow the existing <code>c</code> and <code>a</code> edges. At the node for <code>ca</code>, add a <code>t</code> edge alongside <code>r</code> and mark the new node as a word ending.",
      },
      lines: [7, 9, 11, 13], watch: { w: "cat", nodes: 5, end: "true" }, verdict: "run", fit: "all",
      scene: tree(5, "cat", "ca + t → cat", "end(cat) = true"),
    },
    {
      title: { vi: "Tách nhánh ở gốc", en: "Branch from the root" }, kind: "step",
      body: {
        vi: "Thêm <code>dog</code> bằng nhánh mới bắt đầu với <code>d</code> ở gốc, rồi nối thêm <code>o</code> và <code>g</code>. Trie có 8 nút kể cả gốc và 3 nút đánh dấu kết thúc.",
        en: "Insert <code>dog</code> on a new branch starting with <code>d</code> at the root, then add <code>o</code> and <code>g</code>. The trie now has 8 nodes including the root, with 3 marked as word endings.",
      },
      lines: [7, 9, 11, 13], watch: { w: "dog", nodes: 8, end: "true" }, verdict: "run", fit: "all",
      scene: tree(8, "dog", "ε → d → do → dog", "end(dog) = true"),
    },
    {
      title: { vi: "Đọc dấu kết thúc", en: "Check the end flag" }, kind: "step",
      body: {
        vi: "Gọi <code>walk(&quot;ca&quot;, false)</code> đi hết hai cạnh <code>c</code> và <code>a</code>, nên <code>ca</code> là tiền tố. Nút cuối có <code>end = false</code>, vì vậy từ điển chưa có từ <code>ca</code>.",
        en: "<code>walk(&quot;ca&quot;, false)</code> follows both <code>c</code> and <code>a</code>, so <code>ca</code> is a prefix. Its last node has <code>end = false</code>, so the dictionary lacks the whole word <code>ca</code>.",
      },
      lines: [3, 11, 14], watch: { w: "ca", nodes: 8, end: "false" }, verdict: "run", fit: "all",
      scene: tree(8, "ca", "ε → c → ca", "end(ca) = false"),
    },
    {
      title: { vi: "Dừng ở cạnh thiếu", en: "Stop at a missing edge" }, kind: "step",
      body: {
        vi: "Tra <code>cab</code> đi được tới <code>ca</code>. Các cạnh đi tiếp là <code>r</code> và <code>t</code>. Vì thiếu cạnh <code>b</code>, <code>walk(&quot;cab&quot;, false)</code> trả về −1.",
        en: "Looking up <code>cab</code> reaches <code>ca</code>. The outgoing edges are <code>r</code> and <code>t</code>. With no <code>b</code> edge, <code>walk(&quot;cab&quot;, false)</code> returns −1.",
      },
      lines: [7, 8], watch: { w: "cab", nodes: 8 }, verdict: "run", fit: "all",
      scene: tree(8, "ca", "ε → c → ca ⇥ b", 'walk("cab", false) = −1', true),
    },
    {
      title: { vi: "Tìm thấy từ cat", en: "Find the word cat" }, kind: "answer",
      body: {
        vi: "Tra <code>cat</code> qua đủ ba cạnh và đến nút <code>t</code> đã đánh dấu. <code>walk(&quot;cat&quot;, false)</code> trả ID của nút này, và <code>tr[u].end</code> xác nhận đây là từ trong từ điển.",
        en: "Looking up <code>cat</code> follows all three edges and reaches the marked <code>t</code> node. <code>walk(&quot;cat&quot;, false)</code> returns its ID, and <code>tr[u].end</code> confirms the dictionary contains the word.",
      },
      lines: [11, 14], watch: { w: "cat", nodes: 8, end: "true" }, verdict: "ac", fit: "all",
      scene: tree(8, "cat", "ε → c → ca → cat", "end(cat) = true ✓"),
    },
    {
      title: { vi: "Mỗi chữ một cạnh", en: "One edge per character" }, kind: "recap",
      body: {
        vi: "Đường từ gốc mã hóa đúng các ký tự đã đọc. Dùng <code>u != -1</code> để kiểm tra tiền tố và <code>u != -1 &amp;&amp; tr[u].end</code> để kiểm tra từ. Với mảng 26 cạnh mỗi nút, tra chuỗi chữ thường <code>w</code> tốn O(|w|), thêm tốn O(|w|) khấu hao, và cây dùng O(26 · số nút) bộ nhớ.",
        en: "A path from the root spells the letters read so far. Use <code>u != -1</code> to test for a prefix and <code>u != -1 &amp;&amp; tr[u].end</code> to test for a word. With 26 edges per node, a lowercase <code>w</code> takes O(|w|) to look up or O(|w|) amortized to insert, and the tree uses O(26 · node count) space.",
      },
      lines: [6, 8, 11, 13, 14], watch: { w: "cat", nodes: 8, end: "true" }, verdict: "ac", fit: "all",
      scene: tree(8, "cat", "ε → c → ca → cat", "end(cat) = true ✓"),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const { prefix, parent, x, depth, terminal } of NODES) {
    const label = prefix ? prefix.slice(-1) + (terminal ? " ✓" : "") : "ε";
    scene.add(id(prefix), {
      shape: shapes.block({ label, w: 55, h: 32, depth: 4 }),
      x, y: depth * 2.25, o: prefix ? 0 : 1,
    });
    if (prefix) scene.link(`edge-${prefix}`, { from: id(parent), to: prefix, bend: 0 });
  }
  scene.add("calc", { shape: shapes.pill(), x: -0.4, y: 8.3, o: 0 });
  scene.add("result", { shape: shapes.pill(), x: -0.4, y: 9.35, o: 0 });
}
