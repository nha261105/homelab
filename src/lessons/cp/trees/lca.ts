import type { Lesson, SceneMap } from "../../../lib/types";

const PARENT = [0, 0, 1, 2, 2, 3, 4, 5, 7];
const VERTICES = [1, 2, 3, 4, 5, 6, 7, 8];
const POSITIONS = [
  [0, 1.2], [1.18, 1.2], [2.36, 0], [2.36, 2.4],
  [3.54, 0], [3.54, 2.4], [4.72, 0], [5.9, 0],
];
const TREE = VERTICES.map((v) => `v${v}`);
const WITH_LOOKUPS = [...TREE, "labelU", "labelV", "lookupU", "lookupV"];
const active = { cls: "is-active" };
const good = { cls: "is-good" };
const blocked = { cls: "is-bad" };
const moveEdge = { cls: "v-eq" };

interface Lookup {
  k: number;
  vertex: number;
  ancestor: number;
  cls: string;
}

function picture(marks: SceneMap, u?: Lookup, v?: Lookup): SceneMap {
  return {
    ...marks,
    labelU: { text: u ? `up[${u.k}][${u.vertex}]` : "", o: u ? 1 : 0 },
    labelV: { text: v ? `up[${v.k}][${v.vertex}]` : "", o: v ? 1 : 0 },
    lookupU: { text: u ? String(u.ancestor) : "", o: u ? 1 : 0, cls: u?.cls ?? "" },
    lookupV: { text: v ? String(v.ancestor) : "", o: v ? 1 : 0, cls: v?.cls ?? "" },
  };
}

const result = { v2: good, v3: active, v4: active, edge3: moveEdge, edge4: moveEdge };
const parentOf3 = { k: 0, vertex: 3, ancestor: 2, ...good };
const parentOf4 = { k: 0, vertex: 4, ancestor: 2, ...good };

export const lesson: Lesson = {
  track: "cp",
  topic: "trees",
  slug: "lca",
  title: { vi: "Tổ tiên chung gần nhất", en: "Lowest common ancestor" },
  added: "2026-11-27",
  summary: {
    vi: "Đưa hai đỉnh về cùng độ sâu rồi nhảy cùng nhau đến ngay dưới tổ tiên chung gần nhất.",
    en: "Bring two vertices to the same depth, then lift them together to just below their lowest common ancestor.",
  },
  level: "medium",
  minutes: 9,
  time: "O((n + q) log n)",
  memory: "O(n log n)",
  goal: { vi: "Tìm tổ tiên chung gần nhất của <b>8</b> và <b>6</b>", en: "Find the lowest common ancestor of <b>8</b> and <b>6</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">auto</span> lca = [&amp;](<span class="kw">int</span> u, <span class="kw">int</span> v) {',
    '  <span class="kw">if</span> (depth[u] &lt; depth[v]) swap(u, v);',
    '  <span class="kw">int</span> d = depth[u] - depth[v];',
    '  <span class="kw">for</span> (<span class="kw">int</span> k = LOG - 1; k &gt;= 0; --k)',
    '    <span class="kw">if</span> ((d &gt;&gt; k) &amp; 1) u = up[k][u];',
    '  <span class="kw">if</span> (u == v) <span class="kw">return</span> u;',
    '  <span class="kw">for</span> (<span class="kw">int</span> k = LOG - 1; k &gt;= 0; --k) {',
    '    <span class="kw">if</span> (up[k][u] != up[k][v]) {',
    '      u = up[k][u];',
    '      v = up[k][v];',
    '    }',
    '  }',
    '  <span class="kw">return</span> up[0][u];',
    '};',
  ],
  watch: [
    { key: "u", label: "u" },
    { key: "v", label: "v" },
    { key: "jump", label: { vi: "độ dài bước nhảy", en: "jump length" } },
    { key: "answer", label: "LCA(8, 6)" },
  ],
  practice: [
    { src: "CSES 1688", name: "Company Queries II", lv: "★★☆", url: "https://cses.fi/problemset/task/1688" },
    { src: "CSES 1135", name: "Distance Queries", lv: "★★☆", url: "https://cses.fi/problemset/task/1135" },
  ],
  sceneOptions: { unit: 56, view: [-60, -123, 455, 250] },
  legend: [
    { cls: "acc", label: { vi: "đỉnh hoặc ô đang xét", en: "current vertex or entry" } },
    { cls: "wa", label: { vi: "bước nhảy bị bỏ qua", en: "skipped jump" } },
    { cls: "ac", label: { vi: "tổ tiên chung gần nhất", en: "lowest common ancestor" } },
  ],
  entrance: TREE,
  steps: [
    {
      title: { vi: "Tìm tổ tiên chung", en: "Find a common ancestor" }, kind: "problem",
      body: {
        vi: "Cây có gốc 1 bên trái. Trong các đỉnh nằm trên cả hai đường từ 8 và 6 về gốc, ta cần đỉnh sâu nhất. Nếu lần từng cạnh để tìm chỗ hai đường gặp nhau, mỗi truy vấn có thể tốn O(n).",
        en: "The tree is rooted at 1 on the left. We want the deepest vertex on both paths from 8 and 6 back to the root. Following those paths one edge at a time can cost O(n) per query.",
      },
      lines: [], watch: { u: 8, v: 6 }, verdict: "run", fit: TREE,
      scene: picture({ v8: active, v6: active }),
    },
    {
      title: { vi: "Cân bằng độ sâu", en: "Match the depths" }, kind: "concept",
      body: {
        vi: "Tính trước <code>depth</code> từ gốc có độ sâu 0 và bảng nhảy <code>up</code>, dùng 0 khi không có tổ tiên. Đỉnh 8 sâu 5, đỉnh 6 sâu 3, nên nhảy 2 cạnh từ 8 đến <code>up[1][8] = 5</code>. Nếu hai đỉnh trùng nhau sau khi cân bằng, đỉnh đó là đáp án.",
        en: "Precompute <code>depth</code> from the root at depth 0 and the jump table <code>up</code>, using 0 for missing ancestors. Vertex 8 has depth 5 and vertex 6 has depth 3, so lift 8 two edges to <code>up[1][8] = 5</code>. If the vertices then coincide, that vertex is the answer.",
      },
      lines: [2, 3, 4, 5, 6], watch: { u: 5, v: 6, jump: 2 }, verdict: "run", fit: [...TREE, "labelU", "lookupU"],
      scene: picture({
        v5: { ...active, fx: { type: "pulse", delay: 340 } }, v6: active,
        align: { p: 1, cls: "v-eq", from: { p: 0 }, delay: 140, dur: 460 },
        length: { o: 1 },
      }, { k: 1, vertex: 8, ancestor: 5, ...active }),
    },
    {
      title: { vi: "Bỏ bước quá dài", en: "Skip the long jump" }, kind: "step",
      body: {
        vi: "Xét độ dài từ lớn xuống nhỏ. Với <code>k = 3</code>, cả hai ô đều bằng 0 vì không có tổ tiên cách 8 cạnh. Với <code>k = 2</code>, hai đỉnh sâu 3 cũng có <code>up[2][5] = up[2][6] = 0</code>, nên vẫn đứng tại 5 và 6.",
        en: "Consider jump lengths from largest to smallest. At <code>k = 3</code>, both entries are 0 because neither vertex has an ancestor eight edges away. At <code>k = 2</code>, the depth-3 vertices also have <code>up[2][5] = up[2][6] = 0</code>, so stay at 5 and 6.",
      },
      lines: [7, 8], watch: { u: 5, v: 6, jump: 4 }, verdict: "run", fit: WITH_LOOKUPS,
      scene: picture({ v5: active, v6: active },
        { k: 2, vertex: 5, ancestor: 0, ...blocked }, { k: 2, vertex: 6, ancestor: 0, ...blocked }),
    },
    {
      title: { vi: "Cùng nhảy hai cạnh?", en: "Can both jump twice?" }, kind: "step",
      body: {
        vi: "Từ 5 và 6, nhảy 2 cạnh thì cả hai đều tới <code>2</code>. Điều kiện hai tổ tiên khác nhau không thoả, nên giữ nguyên vị trí và thử bước ngắn hơn.",
        en: "A two-edge jump from 5 and 6 would take both vertices to <code>2</code>. The ancestors are equal, so keep both positions and try the shorter jump.",
      },
      lines: [7, 8], watch: { u: 5, v: 6, jump: 2 }, verdict: "run", fit: WITH_LOOKUPS,
      scene: picture({ v5: active, v6: active, v2: blocked },
        { k: 1, vertex: 5, ancestor: 2, ...blocked }, { k: 1, vertex: 6, ancestor: 2, ...blocked }),
    },
    {
      title: { vi: "Cùng nhảy một cạnh", en: "Lift both one edge" }, kind: "step",
      body: {
        vi: "<code>up[0][5] = 3</code> và <code>up[0][6] = 4</code> khác nhau. Ta có thể nhảy cùng lúc tới 3 và 4 vì cả hai vẫn nằm dưới chỗ hai đường gặp nhau.",
        en: "<code>up[0][5] = 3</code> and <code>up[0][6] = 4</code> differ. Lift both vertices to 3 and 4 because they will still be below the point where their paths meet.",
      },
      lines: [8, 9, 10], watch: { u: 3, v: 4, jump: 1 }, verdict: "run", fit: WITH_LOOKUPS,
      scene: picture({
        v3: { ...active, fx: { type: "pulse", delay: 220 } },
        v4: { ...active, fx: { type: "pulse", delay: 280 } },
        edge5: moveEdge, edge6: moveEdge,
      }, { k: 0, vertex: 5, ancestor: 3, ...active }, { k: 0, vertex: 6, ancestor: 4, ...active }),
    },
    {
      title: { vi: "Trả về cha chung", en: "Return their shared parent" }, kind: "answer",
      body: {
        vi: "Sau khi xét hết các độ dài, hai đỉnh 3 và 4 còn cách điểm gặp đúng một cạnh. Cha của cả hai là 2, nên <code>LCA(8, 6) = 2</code>.",
        en: "After all jump lengths have been considered, vertices 3 and 4 are one edge below the meeting point. Their shared parent is 2, so <code>LCA(8, 6) = 2</code>.",
      },
      lines: [13], watch: { u: 3, v: 4, answer: 2 }, verdict: "ac", fit: WITH_LOOKUPS,
      scene: picture({ ...result, v2: { ...good, fx: { type: "hop", amp: 0.18, delay: 200 } } }, parentOf3, parentOf4),
    },
    {
      title: { vi: "Dừng ngay dưới LCA", en: "Stop just below LCA" }, kind: "recap",
      body: {
        vi: "Khi hai đỉnh cùng độ sâu, hai tổ tiên sau một bước nhảy chỉ khác nhau nếu cả hai còn ở dưới LCA. Xét từng lũy thừa của 2 từ lớn xuống nhỏ sẽ đi hết khoảng cách có thể nhảy an toàn, đưa 3 và 4 tới ngay dưới 2. Tính trước tốn O(n log n) thời gian và bộ nhớ, mỗi truy vấn tốn O(log n).",
        en: "At equal depth, the jump targets differ only while both stay below the LCA. Testing powers of two from largest to smallest covers the full distance we can safely jump, leaving 3 and 4 immediately below 2. Preprocessing costs O(n log n) time and space, with O(log n) per query.",
      },
      lines: [7, 8, 13], watch: { u: 3, v: 4, answer: 2 }, verdict: "ac", fit: WITH_LOOKUPS,
      scene: picture(result, parentOf3, parentOf4),
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  VERTICES.forEach((v, i) => {
    const [x, y] = POSITIONS[i];
    scene.add(`v${v}`, { shape: shapes.block({ label: v, w: 42, h: 30, depth: 4 }), x, y });
  });
  VERTICES.slice(1).forEach((v) => {
    scene.link(`edge${v}`, { from: `v${PARENT[v]}`, to: `v${v}`, bend: 0, p: 1 });
  });
  scene.link("align", { from: "v8", to: "v5", bend: 1.3 });
  scene.add("length", { shape: shapes.pill({ text: "2¹ = 2", h: 22 }), follow: "align", o: 0 });
  [["U", 1.95], ["V", 3.95]].forEach(([id, x]) => {
    scene.add(`label${id}`, { shape: shapes.pill({ text: "up[0][0]", h: 23 }), x, y: 3.45, o: 0 });
    scene.add(`lookup${id}`, { shape: shapes.block({ label: "", w: 44, h: 29, depth: 4 }), x, y: 4.85, o: 0 });
  });
}
