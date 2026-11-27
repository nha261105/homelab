import type { Lesson, SceneMap } from "../../../lib/types";

const A = [3, 2, 4, 5, 1, 7, 6, 8];
const LENGTHS = [1, 2, 4, 8];
const ST = [A];
for (const [k, len] of LENGTHS.entries()) {
  if (k === 0) continue;
  const prev = ST[k - 1];
  ST.push(A.slice(len - 1).map((_, i) => Math.min(prev[i], prev[i + len / 2])));
}

const L = 1, R = 6, K = 2;
const RIGHT = R - LENGTHS[K] + 1;
const BEST = Math.min(ST[K][L], ST[K][RIGHT]);
const U = 54;
const ROW = 2.38;
const cell = (k: number, i: number) => `st-${k}-${i}`;
const formula = (k: number, i: number) => `min-${k}-${i}`;

function table(last: number, computing = -1, query = false, answer = false, calc = ""): SceneMap {
  const scene: SceneMap = { calc: { text: calc, o: calc ? 1 : 0, cls: answer ? "v-eq" : "" } };
  for (const [k, row] of ST.entries()) {
    scene[`length-${k}`] = { o: k <= last ? 1 : 0 };
    if (k > 0) scene[`operator-${k}`] = { o: k === computing ? 1 : 0 };
    row.forEach((_, i) => {
      const picked = k === K && (i === L || i === RIGHT);
      const overlap = k === 0 && i >= RIGHT && i < L + LENGTHS[K];
      const cls = k === computing || (query && picked && answer) ? "is-good"
        : query && overlap ? "is-good"
        : k === computing - 1 || (query && (picked || (k === 0 && i >= L && i <= R))) ? "is-active" : "";
      scene[cell(k, i)] = { o: k <= last ? 1 : 0, cls };
      if (k > 0) scene[formula(k, i)] = {
        o: k === computing ? 1 : 0,
        ...(k === computing ? { from: { o: 0 }, delay: 260, dur: 330 } : {}),
      };
    });
  }
  for (const [id, start, y] of [["left", L, -1.68], ["right", RIGHT, -2.1]] as const) {
    scene[id] = {
      o: query ? 1 : 0,
      x: start + (LENGTHS[K] - 1) / 2,
      y,
      w: (LENGTHS[K] - 1) * U + 38,
      cls: id === "right" ? "is-good" : "",
    };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "range-queries",
  slug: "sparse-table",
  title: { vi: "Sparse table", en: "Sparse table" },
  added: "2026-11-27",
  summary: {
    vi: "Tính trước min của các đoạn dài lũy thừa của 2 để trả lời truy vấn bằng hai đoạn có thể chồng nhau.",
    en: "Precompute minima for power-of-two lengths, then answer each query with two possibly overlapping blocks.",
  },
  level: "medium",
  minutes: 8,
  time: "O(n log n + q)",
  memory: "O(n log n)",
  goal: { vi: "Tìm <b>min a[1..6]</b> trên mảng đánh số từ 0", en: "Find <b>min a[1..6]</b> in a zero-indexed array" },
  codeLang: "C++17",
  code: [
    '<span class="kw">vector</span>&lt;<span class="kw">int</span>&gt; lg(n + 1);',
    '<span class="kw">for</span> (<span class="kw">int</span> len = 2; len &lt;= n; ++len)',
    '  lg[len] = lg[len / 2] + 1;',
    '<span class="kw">vector</span>&lt;<span class="kw">vector</span>&lt;<span class="kw">int</span>&gt;&gt; st(lg[n] + 1);',
    'st[0] = a;',
    '<span class="kw">for</span> (<span class="kw">int</span> k = 1; k &lt;= lg[n]; ++k) {',
    '  <span class="kw">int</span> len = 1 &lt;&lt; k;',
    '  <span class="kw">for</span> (<span class="kw">int</span> i = 0; i + len &lt;= n; ++i)',
    '    st[k].push_back(min(st[k-1][i], st[k-1][i + len/2]));',
    '}',
    '<span class="kw">auto</span> rmq = [&amp;](<span class="kw">int</span> l, <span class="kw">int</span> r) {',
    '  <span class="kw">int</span> k = lg[r - l + 1];',
    '  <span class="kw">return</span> min(st[k][l], st[k][r - (1 &lt;&lt; k) + 1]);',
    '};',
  ],
  watch: [
    { key: "k", label: "k" },
    { key: "len", label: "len" },
    { key: "blocks", label: { vi: "hai đoạn", en: "two blocks" } },
    { key: "best", label: "min" },
  ],
  practice: [
    { src: "CSES 1647", name: "Static Range Minimum Queries", lv: "★☆☆", url: "https://cses.fi/problemset/task/1647" },
    { src: "LeetCode 239", name: "Sliding Window Maximum", lv: "★★★", url: "https://leetcode.com/problems/sliding-window-maximum/" },
  ],
  sceneOptions: { unit: U, view: [-90, -136, 530, 360] },
  legend: [
    { cls: "acc", label: { vi: "ô nguồn hoặc đoạn đang xét", en: "source or query entry" } },
    { cls: "ac", label: { vi: "ô mới, phần giao hoặc kết quả", en: "new entry, overlap, or result" } },
  ],
  entrance: A.map((_, i) => cell(0, i)),
  steps: [
    {
      title: { vi: "Tìm min trên đoạn", en: "Find a range minimum" }, kind: "problem",
      body: {
        vi: "Mảng có 8 phần tử và giữ nguyên giữa các truy vấn. Nếu cứ quét từng đoạn để tìm min, riêng đoạn <code>[1, 6]</code> đã phải đọc 6 ô, còn trường hợp xấu nhất mỗi truy vấn tốn O(n).",
        en: "The eight-element array stays fixed between queries. Scanning for the minimum means reading six entries for <code>[1, 6]</code> alone, and costs O(n) in the worst case per query.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all",
      scene: {
        ...table(0),
        ...Object.fromEntries(A.map((_, i) => [cell(0, i), { cls: i >= L && i <= R ? "is-active" : "" }])),
      },
    },
    {
      title: { vi: "Đoạn dài một ô", en: "Start with singletons" }, kind: "concept",
      body: {
        vi: "<code>st[k][i]</code> lưu min của đoạn dài <code>2ᵏ</code> bắt đầu tại cột <code>i</code>. Hàng <code>k = 0</code> chép nguyên mảng vì mỗi đoạn chỉ có một phần tử, như <code>st[0][1] = 2</code>.",
        en: "<code>st[k][i]</code> stores the minimum of the length-<code>2ᵏ</code> block starting at column <code>i</code>. Row <code>k = 0</code> copies the array because each block has one entry, as in <code>st[0][1] = 2</code>.",
      },
      lines: [4, 5], watch: { k: 0, len: 1 }, verdict: "run", fit: "all",
      scene: table(0, 0),
    },
    {
      title: { vi: "Ghép hai ô", en: "Combine adjacent singletons" }, kind: "step",
      body: {
        vi: "Hàng độ dài 2 lấy min của từng cặp liền kề ở hàng độ dài 1, chẳng hạn <code>st[1][0] = min(3, 2) = 2</code>. Nhãn dưới mỗi ô ghi hai giá trị đem so. Ô cuối bắt đầu tại 6 vì đoạn bắt đầu tại 7 sẽ vượt khỏi mảng.",
        en: "The length-2 row takes the minimum of each adjacent pair from the length-1 row, for example <code>st[1][0] = min(3, 2) = 2</code>. The pill below each entry shows the two inputs. The last block starts at 6 because starting at 7 would run off the array.",
      },
      lines: [6, 7, 8, 9], watch: { k: 1, len: 2 }, verdict: "run", fit: "all",
      scene: table(1, 1),
    },
    {
      title: { vi: "Ghép thành bốn ô", en: "Build length-four blocks" }, kind: "step",
      body: {
        vi: "Hai nửa của <code>[1, 4]</code> bắt đầu tại 1 và 3. Đọc hai ô tương ứng ở hàng độ dài 2, ta được <code>st[2][1] = min(2, 1) = 1</code>.",
        en: "The two halves of <code>[1, 4]</code> start at 1 and 3. Read those entries from the length-2 row to get <code>st[2][1] = min(2, 1) = 1</code>.",
      },
      lines: [6, 7, 8, 9], watch: { k: 2, len: 4 }, verdict: "run", fit: "all",
      scene: table(2, 2),
    },
    {
      title: { vi: "Ghép đủ tám ô", en: "Build the length-eight block" }, kind: "step",
      body: {
        vi: "Đoạn dài 8 duy nhất là <code>[0, 7]</code>. Hai nửa bắt đầu tại 0 và 4, nên <code>st[3][0] = min(2, 1) = 1</code>.",
        en: "The only length-8 block is <code>[0, 7]</code>. Its halves start at 0 and 4, so <code>st[3][0] = min(2, 1) = 1</code>.",
      },
      lines: [6, 7, 8, 9], watch: { k: 3, len: 8 }, verdict: "run", fit: "all",
      scene: table(3, 3),
    },
    {
      title: { vi: "Phủ bằng hai khối", en: "Cover with two blocks" }, kind: "step",
      body: {
        vi: "Đoạn <code>[1, 6]</code> dài 6, nên lũy thừa của 2 lớn nhất vừa với đoạn là 4. Đặt một khối sát đầu trái <code>[1, 4]</code> và một khối sát đầu phải <code>[3, 6]</code>. Chúng phủ kín đoạn và cùng chứa hai ô 3, 4.",
        en: "The range <code>[1, 6]</code> has length 6, so the largest power of two that fits is 4. Use a block flush left, <code>[1, 4]</code>, and a block flush right, <code>[3, 6]</code>. Together they cover the range and share indices 3 and 4.",
      },
      lines: [1, 2, 3, 11, 12, 13], watch: { k: K, len: LENGTHS[K], blocks: "[1, 4] · [3, 6]" }, verdict: "run", fit: "all",
      scene: table(3, -1, true, false, "[1, 4] ∪ [3, 6] = [1, 6]"),
    },
    {
      title: { vi: "Đọc hai giá trị", en: "Read the two minima" }, kind: "answer",
      body: {
        vi: "Đọc hàng độ dài 4 tại cột 1 và 3. Cả hai min đều là 1, vì <code>a[4] = 1</code> nằm ở phần giao. Lấy <code>min(1, 1) = 1</code> cho cả đoạn.",
        en: "Read columns 1 and 3 from the length-4 row. Both minima are 1 because <code>a[4] = 1</code> lies in the overlap. Taking <code>min(1, 1) = 1</code> gives the range minimum.",
      },
      lines: [13], watch: { k: K, len: LENGTHS[K], blocks: "[1, 4] · [3, 6]", best: BEST }, verdict: "ac", fit: "all",
      scene: table(3, -1, true, true, `min(${ST[K][L]}, ${ST[K][RIGHT]}) = ${BEST}`),
    },
    {
      title: { vi: "Min chịu được chồng lấp", en: "Overlap preserves the minimum" }, kind: "recap",
      body: {
        vi: "Với <code>len = 2ᵏ</code> lớn nhất vừa đoạn, độ dài truy vấn nhỏ hơn <code>2·len</code>, nên hai khối luôn phủ kín. Lặp lại phần giao vẫn giữ nguyên min. Bảng tốn O(n log n) thời gian và bộ nhớ, còn mỗi truy vấn tốn O(1).",
        en: "For the largest fitting <code>len = 2ᵏ</code>, the query is shorter than <code>2·len</code>, so the two blocks always cover it. Repeating the overlap leaves the minimum unchanged. The table takes O(n log n) time and space, and each query takes O(1).",
      },
      lines: [6, 9, 12, 13], watch: { k: K, len: LENGTHS[K], best: BEST }, verdict: "ac", fit: "all",
      scene: table(3, -1, true, true, `min(${ST[K][L]}, ${ST[K][RIGHT]}) = ${BEST}`),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("left", { shape: shapes.frame({ h: 7, top: -7, r: 3 }), layer: "back", o: 0 });
  scene.add("right", { shape: shapes.frame({ h: 7, top: -7, r: 3 }), layer: "back", o: 0 });
  for (const [k, row] of ST.entries()) {
    const y = k * ROW;
    scene.add(`length-${k}`, { shape: shapes.pill({ text: `len ${LENGTHS[k]}`, h: 23, pad: 6 }), x: -1.11, y: y - 0.23, o: 0 });
    if (k > 0) {
      scene.add(`operator-${k}`, {
        shape: shapes.pill({ text: "min", h: 22, pad: 5 }), x: -1.11, y: y + 0.87, s: 0.84, o: 0,
      });
    }
    row.forEach((value, i) => {
      scene.add(cell(k, i), {
        shape: shapes.block({ label: value, sub: k === 0 ? i : null, w: 41, h: 32, depth: 4, r: 7 }),
        x: i, y,
      });
      if (k > 0) {
        const prev = ST[k - 1];
        scene.add(formula(k, i), {
          shape: shapes.pill({ text: `(${prev[i]},${prev[i + LENGTHS[k] / 2]})`, h: 22, pad: 3 }),
          x: i, y: y + 0.87, s: 0.84, o: 0,
        });
      }
    });
  }
  scene.add("calc", { shape: shapes.pill(), x: 3.45, y: 8.35, o: 0 });
}
