import type { Lesson, SceneMap } from "../../../lib/types";

const vertices = [1, 2, 3, 4];
const changes = [
  { child: 2, root: 1, old: 1 },
  { child: 4, root: 3, old: 1 },
  { child: 3, root: 1, old: 2 },
];
const initial = [[-2.25, 0], [-0.75, 0], [0.75, 0], [2.25, 0]];
const firstPair = [[-1.45, 0], [-1.45, 2.45], [0.45, 0], [2, 0]];
const twoPairs = [[-1.3, 0], [-1.3, 2.45], [1.3, 0], [1.3, 2.45]];
const joined = [[-0.65, 0], [-1.65, 2.45], [0.65, 2.45], [0.65, 4.9]];
const layouts = [initial, firstPair, twoPairs, joined];

function forest(depth: number, formula: string, focus: number[] = [], changed?: number, restored = false): SceneMap {
  const parent = [0, ...vertices];
  const size = [0, 1, 1, 1, 1];
  for (const { child, root } of changes.slice(0, depth)) {
    parent[child] = root;
    size[root] += size[child];
  }

  const scene: SceneMap = {
    calc: { text: formula, o: 1, cls: restored ? "v-eq" : "" },
  };
  vertices.forEach((v, i) => {
    const [x, y] = layouts[depth][i];
    const cls = focus.includes(v) ? (restored ? "is-good" : "is-active") : "";
    scene[`v${v}`] = { x, y, cls, ...(v === changed ? { arc: 0.23, dur: 540 } : {}) };
    scene[`size${v}`] = { x, y, text: `sz=${size[v]}`, o: parent[v] === v ? 1 : 0 };
  });
  changes.forEach(({ child, root }, i) => {
    const visible = i < depth;
    const added = visible && child === changed;
    scene[`parent${child}`] = {
      p: visible ? 1 : 0, cls: focus.includes(child) && focus.includes(root) ? "v-lt" : "",
      ...(added ? { from: { p: 0 }, delay: 280, dur: 420 } : {}),
    };
    scene[`entry${child}`] = {
      o: visible ? 1 : 0, cls: added ? "v-lt" : "",
      ...(added ? { from: { z: 0.5, o: 0 }, dur: 350, delay: 260, ease: "out" } : {}),
    };
  });
  scene.empty = { o: depth === 0 ? 1 : 0 };
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "ds-adv", slug: "dsu-rollback",
  title: { vi: "DSU có hoàn tác", en: "DSU with rollback" },
  added: "2026-11-27",
  summary: {
    vi: "Ghi lại những ô bị đổi khi gộp hai nhóm để có thể quay về một mốc trước đó.",
    en: "Log the entries changed by each merge so the DSU can return to an earlier snapshot.",
  },
  level: "hard", minutes: 10,
  time: "O(log n) find/union · O(1) per undo",
  memory: "O(n)",
  goal: {
    vi: "Nối hai nhóm chứa <b>2</b> và <b>4</b>, rồi quay lại mốc đã lưu",
    en: "Join the groups containing <b>2</b> and <b>4</b>, then restore the snapshot",
  },
  codeLang: "C++17",
  code: [
    'vector&lt;<span class="kw">int</span>&gt; p(n + 1), sz(n + 1, 1); iota(p.begin(), p.end(), 0);',
    'vector&lt;array&lt;<span class="kw">int</span>, 3&gt;&gt; hist;',
    '<span class="kw">int</span> cc = n;',
    '<span class="kw">auto</span> find = [&amp;](<span class="kw">int</span> v) { <span class="kw">while</span> (p[v] != v) v = p[v]; <span class="kw">return</span> v; };',
    '<span class="kw">auto</span> unite = [&amp;](<span class="kw">int</span> a, <span class="kw">int</span> b) {',
    '  a = find(a); b = find(b); <span class="kw">if</span> (a == b) <span class="kw">return</span>;',
    '  <span class="kw">if</span> (sz[a] &lt; sz[b]) swap(a, b);',
    '  hist.push_back({b, a, sz[a]});',
    '  p[b] = a; sz[a] += sz[b]; --cc;',
    '};',
    '<span class="kw">auto</span> snapshot = [&amp;] { <span class="kw">return</span> hist.size(); };',
    '<span class="kw">auto</span> rollback = [&amp;](size_t t) {',
    '  <span class="kw">while</span> (hist.size() &gt; t) {',
    '    <span class="kw">auto</span> [b, a, old] = hist.back(); hist.pop_back();',
    '    p[b] = b; sz[a] = old; ++cc;',
    '  }',
    '};',
  ],
  watch: [
    { key: "cc", label: { vi: "số nhóm", en: "components" } },
    { key: "hist", label: "hist.size()" },
    { key: "t", label: { vi: "mốc t", en: "snapshot t" } },
    { key: "roots", label: { vi: "gốc của 2 và 4", en: "roots of 2 and 4" } },
  ],
  practice: [
    { src: "CSES 3408", name: "MST Edge Set Check", lv: "★★★", url: "https://cses.fi/problemset/task/3408" },
    { src: "CSES 2133", name: "Dynamic Connectivity", lv: "★★★", url: "https://cses.fi/problemset/task/2133/" },
  ],
  sceneOptions: { unit: 53, view: [-160, -125, 320, 375] },
  legend: [
    { cls: "acc", label: { vi: "nút hoặc bản ghi đang xét", en: "vertex or record in focus" } },
    { cls: "ac", label: { vi: "trạng thái đã khôi phục", en: "restored state" } },
  ],
  steps: [
    {
      title: { vi: "Thử nối rồi quay lại", en: "Try a temporary merge" }, kind: "problem",
      body: {
        vi: "Bắt đầu với 4 đỉnh riêng lẻ. Ta sẽ ghép hai cặp, lưu mốc rồi thử nối hai nhóm đó. Dựng lại DSU từ đầu sau mỗi lần thử sẽ lặp lại các phép gộp đã có.",
        en: "Start with four separate vertices. Make two pairs, save a snapshot, then try joining the two groups. Rebuilding the DSU after every trial would repeat the earlier merges.",
      },
      lines: [1, 2, 3], watch: { cc: 4, hist: 0 }, verdict: "run", fit: "all",
      scene: forest(0, "p[v] = v   ·   sz[v] = 1"),
    },
    {
      title: { vi: "Ghi trước khi gộp", en: "Log before merging" }, kind: "concept",
      body: {
        vi: "Khi gộp 1 và 2, hai gốc cùng có cỡ 1 nên giữ 1 làm gốc. Đẩy <code>(2, 1, 1)</code> vào <code>hist</code> để ghi gốc bị gắn, gốc nhận và cỡ cũ của gốc nhận. Đổi <code>p[2] = 1</code>, tăng <code>sz[1]</code> lên 2 và giảm số nhóm còn 3.",
        en: "When merging 1 and 2, both roots have size 1, so keep 1 as the root. Push <code>(2, 1, 1)</code> to <code>hist</code> to record the attached root, receiving root, and receiver’s old size. Set <code>p[2] = 1</code>, grow <code>sz[1]</code> to 2, and reduce the component count to 3.",
      },
      lines: [5, 6, 7, 8, 9], watch: { cc: 3, hist: 1 }, verdict: "run", fit: "all",
      scene: forest(1, "sz[1] = 1 + 1 = 2", [1, 2], 2),
    },
    {
      title: { vi: "Lưu độ dài stack", en: "Save the stack length" }, kind: "step",
      body: {
        vi: "Khi gộp 3 với 4, đặt <code>p[4] = 3</code>, <code>sz[3] = 2</code> và đẩy <code>(4, 3, 1)</code> vào bên phải stack. Giờ có hai nhóm và mốc <code>t = hist.size() = 2</code>.",
        en: "To merge 3 and 4, set <code>p[4] = 3</code> and <code>sz[3] = 2</code>, and push <code>(4, 3, 1)</code> onto the right end of the stack. We now have two groups and a snapshot <code>t = hist.size() = 2</code>.",
      },
      lines: [7, 8, 9, 11], watch: { cc: 2, hist: 2, t: 2, roots: "1, 3" }, verdict: "run", fit: "all",
      scene: forest(2, "sz[3] = 1 + 1 = 2   ·   t = 2", [3, 4], 4),
    },
    {
      title: { vi: "Nối qua hai gốc", en: "Join at the roots" }, kind: "step",
      body: {
        vi: "<code>find(2)</code> tới 1 và <code>find(4)</code> tới 3. Hai gốc cùng có cỡ 2, nên <code>unite(2, 4)</code> gắn gốc 3 dưới 1 và đẩy <code>(3, 1, 2)</code> lên đỉnh stack.",
        en: "<code>find(2)</code> reaches 1 and <code>find(4)</code> reaches 3. Both roots have size 2, so <code>unite(2, 4)</code> attaches root 3 under 1 and pushes <code>(3, 1, 2)</code> onto the stack.",
      },
      lines: [4, 6, 7, 8, 9], watch: { cc: 1, hist: 3, t: 2, roots: "1, 1" }, verdict: "run", fit: "all",
      scene: forest(3, "sz[1] = 2 + 2 = 4", [1, 3], 3),
    },
    {
      title: { vi: "Chỉ đọc đường cha", en: "Follow parent links" }, kind: "step",
      body: {
        vi: "<code>find(4)</code> đi theo 4 → 3 → 1 và giữ nguyên <code>p[4] = 3</code>. Nếu nén đường đi thành <code>p[4] = 1</code>, bản ghi vừa lưu sẽ thiếu lần sửa đó. Thử <code>unite(1, 4)</code> cũng không thêm bản ghi vì hai gốc trùng nhau.",
        en: "<code>find(4)</code> follows 4 → 3 → 1 and leaves <code>p[4] = 3</code>. Compressing the path to <code>p[4] = 1</code> would introduce a change the latest record cannot undo. Trying <code>unite(1, 4)</code> adds no record because both roots match.",
      },
      lines: [4, 6], watch: { cc: 1, hist: 3, t: 2, roots: "1, 1" }, verdict: "run", fit: "all",
      scene: forest(3, "p[4] = 3   ·   p[3] = 1", [4, 3, 1]),
    },
    {
      title: { vi: "Gỡ bản ghi cuối", en: "Pop the latest change" }, kind: "answer",
      body: {
        vi: "<code>rollback(2)</code> lấy <code>(3, 1, 2)</code> ra khỏi stack, trả <code>p[3] = 3</code> và <code>sz[1] = 2</code>. Số nhóm tăng từ 1 lên 2. Stack còn đúng 2 bản ghi nên dừng, với 2 thuộc gốc 1 và 4 thuộc gốc 3.",
        en: "<code>rollback(2)</code> pops <code>(3, 1, 2)</code>, restoring <code>p[3] = 3</code> and <code>sz[1] = 2</code>. The component count rises from 1 to 2. The stack now has exactly two records, so stop with 2 rooted at 1 and 4 rooted at 3.",
      },
      lines: [12, 13, 14, 15], watch: { cc: 2, hist: 2, t: 2, roots: "1, 3" }, verdict: "ac", fit: "all",
      scene: forest(2, "p[3] = 3   ·   sz[1] = 2", [1, 3], 3, true),
    },
    {
      title: { vi: "Gộp nhỏ vào lớn", en: "Merge smaller into larger" }, kind: "recap",
      body: {
        vi: "Hoàn tác theo thứ tự ngược khôi phục đúng trạng thái trước từng lần gộp, với O(k) thời gian cho k bản ghi. Mỗi lần một đỉnh xuống sâu hơn, nhóm chứa nó ít nhất tăng gấp đôi, nên <code>find</code> và <code>unite</code> tốn O(log n). Stack có tối đa n − 1 bản ghi.",
        en: "Undoing in reverse order restores the state before each merge and takes O(k) time for k records. Whenever a vertex gets deeper, its group at least doubles, so <code>find</code> and <code>unite</code> take O(log n). The stack has at most n − 1 records.",
      },
      note: {
        vi: "Với Dynamic Connectivity offline, chia thời gian thành các đoạn, gộp các cạnh có hiệu lực trong từng đoạn và hoàn tác khi rời đoạn đó.",
        en: "For offline dynamic connectivity, divide time into intervals, merge the edges active throughout each interval, and roll back when leaving it.",
      },
      lines: [4, 7, 13, 14, 15], watch: { cc: 2, hist: 2, t: 2, roots: "1, 3" }, verdict: "ac", fit: "all",
      scene: forest(2, "hist.size() = t = 2", [1, 3], undefined, true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  vertices.forEach((v, i) => {
    const [x, y] = initial[i];
    scene.add(`v${v}`, { shape: shapes.block({ label: v, w: 46, h: 35 }), x, y });
    scene.add(`size${v}`, { shape: shapes.pill({ text: "sz=1", h: 20, pad: 6 }), x, y, z: 0.79 });
  });
  scene.add("hist", { shape: shapes.pill({ text: "hist", h: 23, pad: 7 }), x: -2.38, y: 6.75 });
  scene.add("empty", { shape: shapes.pill({ text: "∅", h: 23, pad: 7 }), x: -1.17, y: 6.75, o: 0 });
  changes.forEach(({ child, root, old }, i) => {
    scene.link(`parent${child}`, {
      from: `v${child}`, to: `v${root}`, anchor: "center", arrow: true, bend: 0,
    });
    scene.add(`entry${child}`, {
      shape: shapes.pill({ text: `(${child},${root},${old})`, h: 23, pad: 7 }),
      x: -1.17 + i * 1.48, y: 6.75, o: 0,
    });
  });
  scene.add("calc", { shape: shapes.pill(), y: 8.3, o: 0 });
}
