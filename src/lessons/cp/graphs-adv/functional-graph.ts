import type { Lesson, SceneMap } from "../../../lib/types";

const NEXT = [0, 2, 3, 4, 5, 3, 2, 5];
const POSITIONS = [[0, 2.25], [1.18, 2.25], [2.53, 2.25], [3.75, 0], [5.02, 2.25], [1.18, 0], [5.02, 4.5]];
const UP = [NEXT];
for (let b = 1; b < 4; b++) {
  const prev = UP[b - 1];
  UP.push(prev.map((v) => prev[v]));
}

type Cell = [b: number, v: number];
const cell = (b: number, v: number) => `up${b}v${v}`;

function picture(rows: number, current: number, lookups: Cell[] = [], showCycle = true, done = false): SceneMap {
  const scene: SceneMap = {
    header: { o: rows ? 1 : 0 },
  };
  POSITIONS.forEach((_, i) => {
    const v = i + 1;
    scene[`v${v}`] = {
      cls: v === current ? (done ? "is-good" : "is-active") : "",
      ...(v === current && !done ? { fx: { type: "pulse", delay: 240 } } : {}),
    };
    scene[`e${v}`] = { cls: showCycle && v >= 3 && v <= 5 ? "v-eq" : "" };
    scene[`h${v}`] = { o: rows ? 1 : 0 };
  });
  UP.forEach((row, b) => {
    scene[`row${b}`] = { o: rows ? 1 : 0 };
    row.slice(1).forEach((target, i) => {
      const v = i + 1;
      const focused = lookups.some(([r, c]) => r === b && c === v);
      scene[cell(b, v)] = {
        text: b < rows ? String(target) : "—",
        o: rows ? 1 : 0,
        cls: focused ? (done ? "is-good" : "is-active") : b < rows ? "" : "is-out",
      };
    });
  });
  return scene;
}

const final = picture(4, 5, [[3, 3]], true, true);

export const lesson: Lesson = {
  track: "cp", topic: "graphs-adv", slug: "functional-graph",
  title: { vi: "Đồ thị hàm", en: "Functional graphs" },
  added: "2026-11-27",
  summary: {
    vi: "Lần theo đúng một cạnh ra ở mỗi đỉnh sẽ tới chu trình. Dùng nhảy nhị phân để tìm đích sau k bước.",
    en: "Following each vertex’s sole outgoing edge eventually reaches a cycle. Use binary lifting to find the destination after k steps.",
  },
  level: "hard", minutes: 9, time: "O((n + q) log(K + 1))", memory: "O(n log(K + 1))",
  goal: { vi: "Xuất phát từ 1, tìm đỉnh đến sau <b>13 bước</b>", en: "Start at 1 and find the destination after <b>13 steps</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">constexpr int</span> LOG = 30; <span class="cm">// k &lt;= 10^9</span>',
    'vector&lt;vector&lt;<span class="kw">int</span>&gt;&gt; up(LOG, vector&lt;<span class="kw">int</span>&gt;(n + 1));',
    'up[0] = nxt;',
    '<span class="kw">for</span> (<span class="kw">int</span> b = 1; b &lt; LOG; ++b)',
    '  <span class="kw">for</span> (<span class="kw">int</span> v = 1; v &lt;= n; ++v)',
    '    up[b][v] = up[b - 1][up[b - 1][v]];',
    '<span class="kw">auto</span> jump = [&amp;](<span class="kw">int</span> v, <span class="kw">int</span> k) {',
    '  <span class="kw">for</span> (<span class="kw">int</span> b = 0; b &lt; LOG; ++b)',
    '    <span class="kw">if</span> ((k &gt;&gt; b) &amp; 1) v = up[b][v];',
    '  <span class="kw">return</span> v;',
    '};',
  ],
  watch: [
    { key: "v", label: "v" },
    { key: "jump", label: "2^b" },
    { key: "walked", label: { vi: "đã đi", en: "steps taken" } },
  ],
  practice: [
    { src: "CSES 1750", name: "Planets Queries I", lv: "★★☆", url: "https://cses.fi/problemset/task/1750/" },
    { src: "CSES 1751", name: "Planets Cycles", lv: "★★☆", url: "https://cses.fi/problemset/task/1751/" },
  ],
  sceneOptions: { unit: 54, view: [-50, -105, 415, 380] },
  legend: [
    { cls: "acc", label: { vi: "vị trí hoặc ô đang xét", en: "current position or lookup" } },
    { cls: "ac", label: { vi: "cạnh chu trình hoặc đáp án", en: "cycle edge or answer" } },
  ],
  steps: [
    {
      title: { vi: "Đi đúng 13 bước", en: "Take exactly 13 steps" }, kind: "problem",
      body: {
        vi: "Mỗi đỉnh có đúng một cạnh ra, nên từ 1 chỉ có một cách đi đúng 13 bước. Lần từng cạnh tốn 13 lượt, và làm vậy cho mọi truy vấn có thể tốn tới O(qK), với K là số bước tối đa.",
        en: "Each vertex has exactly one outgoing edge, so there is only one way to walk 13 steps from 1. Following edges one by one takes 13 lookups here, and using that approach for every query can cost O(qK), where K is the maximum step count.",
      },
      lines: [], watch: { v: 1, walked: 0 }, verdict: "run", fit: "all",
      scene: picture(0, 1, [], false),
    },
    {
      title: { vi: "Đuôi dẫn vào vòng", en: "A tail enters a cycle" }, kind: "concept",
      body: {
        vi: "Từ 1 đi qua đuôi 1→2→3 rồi vào chu trình 3→4→5→3. Đỉnh lặp đầu tiên là 3 sau <code>2 + 3 = 5</code> bước. Hễ gặp lại một đỉnh, cạnh ra duy nhất buộc đường đi lặp theo cùng một vòng.",
        en: "Starting at 1, the tail 1→2→3 leads into cycle 3→4→5→3. The first repeated vertex is 3 after <code>2 + 3 = 5</code> moves. Once a vertex repeats, its single outgoing edge forces the walk to repeat the same cycle.",
      },
      lines: [], watch: { v: 3, walked: 5 }, verdict: "run", fit: "all",
      scene: picture(0, 3),
    },
    {
      title: { vi: "Lưu bước nhảy 1", en: "Store one-edge jumps" }, kind: "concept",
      body: {
        vi: "Ô <code>up[b][v]</code> lưu đỉnh đến khi đi đúng 2<sup>b</sup> cạnh từ <code>v</code>. Hàng <code>b = 0</code> chép mảng <code>nxt</code> đánh số từ 1, chẳng hạn <code>up[0][1] = 2</code> và <code>up[0][2] = 3</code>.",
        en: "Entry <code>up[b][v]</code> is the destination exactly 2<sup>b</sup> edges from <code>v</code>. Row <code>b = 0</code> copies the 1-indexed <code>nxt</code> array, so <code>up[0][1] = 2</code> and <code>up[0][2] = 3</code>.",
      },
      lines: [1, 2, 3], watch: { jump: 1 }, verdict: "run", fit: "all",
      scene: picture(1, 0, [[0, 1], [0, 2]]),
    },
    {
      title: { vi: "Ghép hai nửa bằng nhau", en: "Combine two equal halves" }, kind: "step",
      body: {
        vi: "Muốn đi 2 cạnh từ 1, nhảy 1→2 rồi 2→3, nên <code>up[1][1] = 3</code>. Cứ ghép hai bước ở hàng trước để dựng hàng 4 và 8 cạnh, kể cả khi bước nhảy đi vòng qua chu trình.",
        en: "For 2 edges from 1, jump 1→2 and then 2→3, so <code>up[1][1] = 3</code>. Pair jumps from the preceding row to build the 4- and 8-edge rows, even when a jump wraps around the cycle.",
      },
      lines: [4, 5, 6], watch: { jump: 2 }, verdict: "run", fit: "all",
      scene: picture(4, 0, [[0, 1], [0, 2], [1, 1]]),
    },
    {
      title: { vi: "Đọc bit thấp trước", en: "Read the low bit first" }, kind: "step",
      body: {
        vi: "<code>13 = (1101)₂ = 8 + 4 + 1</code>. Code xét từ bit thấp: bit 0 bật nên tra <code>up[0][1] = 2</code> để đi 1 bước, rồi bỏ qua bit 1 vì nó bằng 0.",
        en: "<code>13 = (1101)₂ = 8 + 4 + 1</code>. The code starts at the low bit: bit 0 is set, so <code>up[0][1] = 2</code> advances 1 step. Bit 1 is zero and is skipped.",
      },
      lines: [7, 8, 9], watch: { v: 2, jump: 1, walked: 1 }, verdict: "run", fit: "all",
      scene: picture(4, 2, [[0, 1]]),
    },
    {
      title: { vi: "Nhảy thêm 4 bước", en: "Jump four more steps" }, kind: "step",
      body: {
        vi: "Bit 2 bật, nên tra từ vị trí hiện tại 2 và lấy <code>up[2][2] = 3</code>. Bước nhảy gói gọn đoạn 2→3→4→5→3. Tổng cộng đã đi <code>1 + 4 = 5</code> cạnh.",
        en: "Bit 2 is set, so use the current position 2 and read <code>up[2][2] = 3</code>. The jump covers 2→3→4→5→3. So far we have taken <code>1 + 4 = 5</code> edges.",
      },
      lines: [8, 9], watch: { v: 3, jump: 4, walked: 5 }, verdict: "run", fit: "all",
      scene: picture(4, 3, [[2, 2]]),
    },
    {
      title: { vi: "Chốt ở đỉnh 5", en: "Finish at vertex 5" }, kind: "answer",
      body: {
        vi: "Bit 3 bật, nên lấy <code>up[3][3] = 5</code>. Tám bước trên vòng dài 3 đưa ta đi hai vòng trọn rồi tiến thêm 2 cạnh. Đã đi <code>1 + 4 + 8 = 13</code> bước và tới 5.",
        en: "Bit 3 is set, so take <code>up[3][3] = 5</code>. Eight steps on the length-3 cycle make two complete loops and advance 2 more edges. We have taken <code>1 + 4 + 8 = 13</code> steps and reached 5.",
      },
      lines: [8, 9, 10], watch: { v: 5, jump: 8, walked: 13 }, verdict: "ac", fit: "all",
      scene: { ...final, v5: { cls: "is-good", fx: { type: "hop", amp: 0.16, delay: 260 } } },
    },
    {
      title: { vi: "Mỗi bit một lần", en: "Handle each bit once" }, kind: "recap",
      body: {
        vi: "Mỗi hàng ghép hai lần đi 2<sup>b−1</sup> cạnh, nên ô ở hàng <code>b</code> luôn đi đúng 2<sup>b</sup> cạnh. Cộng các bước nhảy ứng với bit bật sẽ đi đúng <code>k</code> bước, kể cả <code>k = 0</code> thì giữ nguyên đỉnh. Với K là cận trên dương của k, dựng bảng tốn O(n log(K + 1)) thời gian và bộ nhớ, mỗi truy vấn tốn O(log(K + 1)).",
        en: "Each row combines two walks of 2<sup>b−1</sup> edges, so an entry in row <code>b</code> advances exactly 2<sup>b</sup> edges. Jumps for the set bits add up to exactly <code>k</code> steps, leaving the start unchanged at <code>k = 0</code>. For a positive bound K on k, preprocessing takes O(n log(K + 1)) time and space and each query takes O(log(K + 1)).",
      },
      lines: [4, 5, 6, 8, 9, 10], watch: { v: 5, walked: 13 }, verdict: "ac", fit: "all", scene: final,
    },
  ],
};

export function setup(scene: any, shapes: any) {
  POSITIONS.forEach(([x, y], i) => {
    const v = i + 1;
    scene.add(`v${v}`, { shape: shapes.block({ label: v, w: 44, h: 34 }), x, y });
    const col = i * 0.88 + 0.6;
    scene.add(`h${v}`, { shape: shapes.pill({ text: v, h: 21 }), x: col, y: 6.15, o: 0 });
    UP.forEach((_, b) => {
      scene.add(cell(b, v), { shape: shapes.block({ w: 40, h: 25, depth: 4 }), x: col, y: 7.36 + b * 1.19, o: 0 });
    });
  });
  NEXT.slice(1).forEach((to, i) => {
    const v = i + 1;
    scene.link(`e${v}`, { from: `v${v}`, to: `v${to}`, anchor: "center", arrow: true, bend: 0, p: 1 });
  });
  scene.add("header", { shape: shapes.pill({ text: "v", h: 21 }), x: -0.4, y: 6.15, o: 0 });
  UP.forEach((_, b) => {
    scene.add(`row${b}`, { shape: shapes.pill({ text: `b = ${b}`, h: 21, pad: 6 }), x: -0.4, y: 7.29 + b * 1.19, o: 0 });
  });
}
