import type { Lesson, SceneMap } from "../../../lib/types";

const A = [2, 1, 2, 3, 1, 4];
const VALUES = [1, 2, 3, 4];
const U = 51;
const B = Math.floor(Math.sqrt(A.length));
const QUERIES = [{ l: 2, r: 3 }, { l: 1, r: 4 }, { l: 0, r: 2 }, { l: 2, r: 5 }];
const ORDER = QUERIES.map((_, i) => i).sort((i, j) =>
  Math.floor(QUERIES[i].l / B) - Math.floor(QUERIES[j].l / B) || QUERIES[i].r - QUERIES[j].r);
const queryX = (slot: number) => -0.08 + slot * 1.72;
const FIT = ["a0", "a5", "calc"];

function picture(l: number, r: number, phase: "input" | "sorted" | "output", done = 0, formula = "", changed: number[] = []): SceneMap {
  const window = A.slice(l, r + 1);
  const counts = VALUES.map((value) => window.filter((x) => x === value).length);
  const hasWindow = l <= r;
  const d = counts.filter(Boolean).length;
  const state: SceneMap = {
    win: { x: (l + r) / 2, w: (r - l) * U + 47, o: hasWindow ? 1 : 0 },
    left: { x: l, o: hasWindow ? 1 : 0, dur: 520 },
    right: { x: r, o: hasWindow ? 1 : 0, dur: 520 },
    freq: { o: phase === "input" ? 0 : 1 },
    distinct: { text: `d = ${d}`, o: phase === "input" ? 0 : 1, cls: done > 0 ? "v-eq" : "" },
    calc: { y: phase === "input" ? 2.7 : formula ? 7.6 : 6.25, text: formula, o: formula ? 1 : 0, delay: 260, cls: done > 0 ? "v-eq" : "" },
  };
  A.forEach((_, i) => {
    state[`a${i}`] = { cls: i >= l && i <= r ? "is-active" : phase === "input" ? "" : "is-out" };
  });
  VALUES.forEach((value, i) => {
    state[`cnt${value}`] = {
      text: String(counts[i]), o: phase === "input" ? 0 : 1,
      cls: changed.includes(value) ? (counts[i] ? "is-good" : "is-bad") : "",
    };
  });
  QUERIES.forEach(({ l: left, r: right }, id) => {
    const rank = ORDER.indexOf(id);
    const answered = rank < done;
    const result = new Set(A.slice(left, right + 1)).size;
    state[`q${id}`] = {
      x: queryX(phase === "sorted" ? rank : id), y: phase === "input" ? 2.7 : 6.25,
      text: answered ? `Q${id + 1} = ${result}` : `Q${id + 1}[${left},${right}]`,
      cls: answered ? "v-eq" : "",
      arc: phase === "sorted" && !hasWindow ? 0.22 : 0, dur: 420, delay: id * 35,
    };
  });
  return state;
}

export const lesson: Lesson = {
  track: "cp", topic: "offline", slug: "mo-algorithm",
  title: { vi: "Thuật toán Mo", en: "Mo's algorithm" },
  added: "2026-11-27",
  summary: {
    vi: "Sắp các truy vấn theo khối để tái sử dụng bảng tần suất khi hai đầu đoạn dịch chuyển.",
    en: "Sort queries by block to reuse a frequency table as the two range endpoints move.",
  },
  level: "hard", minutes: 11, time: "O(q log q + (n + q)√n)", memory: "O(n + q)",
  goal: { vi: "Dịch cửa sổ để đếm số giá trị phân biệt cho <b>4 truy vấn</b>", en: "Slide a window to count distinct values for <b>4 queries</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> B = max(1, (<span class="kw">int</span>)sqrt(n));',
    'sort(q.begin(), q.end(), [B](<span class="kw">auto</span> a, <span class="kw">auto</span> b) {',
    '  <span class="kw">return</span> pair{a.l/B, a.r} &lt; pair{b.l/B, b.r};',
    '});',
    '<span class="kw">int</span> L = 0, R = -1, d = 0;',
    '<span class="kw">auto</span> add = [&amp;](<span class="kw">int</span> i) { <span class="kw">if</span> (++cnt[a[i]] == 1) ++d; };',
    '<span class="kw">auto</span> del = [&amp;](<span class="kw">int</span> i) { <span class="kw">if</span> (--cnt[a[i]] == 0) --d; };',
    '<span class="kw">for</span> (<span class="kw">auto</span> [l, r, id] : q) {',
    '  <span class="kw">while</span> (L &gt; l) add(--L);',
    '  <span class="kw">while</span> (R &lt; r) add(++R);',
    '  <span class="kw">while</span> (L &lt; l) del(L++);',
    '  <span class="kw">while</span> (R &gt; r) del(R--);',
    '  ans[id] = d;',
    '}',
  ],
  watch: [
    { key: "target", label: { vi: "truy vấn", en: "query" } },
    { key: "window", label: "[L, R]" },
    { key: "d", label: "d" },
  ],
  practice: [
    { src: "SPOJ DQUERY", name: "D-query", lv: "★★☆", url: "https://www.spoj.com/problems/DQUERY/" },
    { src: "CSES 1734", name: "Distinct Values Queries", lv: "★★★", url: "https://cses.fi/problemset/task/1734" },
  ],
  sceneOptions: { unit: U, view: [-68, -114, 388, 316] },
  legend: [
    { cls: "acc", label: { vi: "ô trong cửa sổ", en: "cell in the window" } },
    { cls: "ac", label: { vi: "tần suất vừa đổi hoặc đáp án", en: "changed count or answer" } },
    { cls: "wa", label: { vi: "tần suất vừa về 0", en: "count just dropped to zero" } },
  ],
  entrance: A.map((_, i) => `a${i}`),
  steps: [
    {
      title: { vi: "Tái sử dụng cửa sổ", en: "Reuse the window" }, kind: "problem",
      body: {
        vi: "Bốn truy vấn trên mảng tĩnh đều hỏi số giá trị phân biệt. Đếm lại từng đoạn có thể tốn O(nq). Hai đoạn gần nhau như Q1 <code>[2,3]</code> và Q4 <code>[2,5]</code> chỉ khác hai ô ở đầu phải.",
        en: "Four queries on a static array each ask for the distinct count. Counting each range from scratch can cost O(nq). Nearby ranges such as Q1 <code>[2,3]</code> and Q4 <code>[2,5]</code> differ by only two cells at the right edge.",
      },
      lines: [], watch: {}, verdict: "run", fit: FIT, scene: picture(0, -1, "input"),
    },
    {
      title: { vi: "Sắp theo khối trái", en: "Sort by left block" }, kind: "concept",
      body: {
        vi: "Với <code>B = ⌊√6⌋ = 2</code>, khóa <code>(l/B, r)</code> là (0,2) cho Q3, (0,4) cho Q2, (1,3) cho Q1 và (1,5) cho Q4. Cửa sổ bắt đầu rỗng ở <code>[0,−1]</code>, với mọi <code>cnt[x] = 0</code>.",
        en: "With <code>B = ⌊√6⌋ = 2</code>, the <code>(l/B, r)</code> keys are (0,2) for Q3, (0,4) for Q2, (1,3) for Q1, and (1,5) for Q4. The window starts empty at <code>[0,−1]</code>, with every <code>cnt[x] = 0</code>.",
      },
      lines: [1, 2, 3, 5], watch: { window: "[0, −1]", d: 0 }, verdict: "run", fit: FIT,
      scene: picture(0, -1, "sorted"),
    },
    {
      title: { vi: "Mở rộng đến Q3", en: "Expand to Q3" }, kind: "step",
      body: {
        vi: "Tăng <code>R</code> qua 0, 1, 2 để thêm 2, 1, 2. Chỉ khi tần suất từ 0 lên 1 mới tăng <code>d</code>, nên bản sao của 2 ở ô 2 giữ <code>d = 2</code>.",
        en: "Move <code>R</code> through 0, 1, 2 to add 2, 1, 2. Only a frequency rising from 0 to 1 increases <code>d</code>, so the second 2 at cell 2 leaves <code>d = 2</code>.",
      },
      lines: [6, 10, 13], watch: { target: "Q3 [0,2]", window: "[0, 2]", d: 2 }, verdict: "ac", fit: FIT,
      scene: picture(0, 2, "sorted", 1, "d = 0 + 1 + 1 + 0 = 2", [1, 2]),
    },
    {
      title: { vi: "Trượt cửa sổ sang phải", en: "Slide the window right" }, kind: "step",
      body: {
        vi: "Để tới Q2 <code>[1,4]</code>, thêm 3 và 1 ở đầu phải, rồi bỏ một bản sao của 2 ở đầu trái. Chỉ giá trị 3 làm tăng <code>d</code>. Số 2 vẫn có mặt ở ô 2.",
        en: "To reach Q2 <code>[1,4]</code>, add 3 and 1 at the right, then remove one copy of 2 at the left. Only 3 increases <code>d</code>. The 2 at cell 2 is still present.",
      },
      lines: [6, 7, 10, 11, 13], watch: { target: "Q2 [1,4]", window: "[1, 4]", d: 3 }, verdict: "ac", fit: FIT,
      scene: picture(1, 4, "sorted", 2, "d = 2 + 1 + 0 − 0 = 3", [1, 2, 3]),
    },
    {
      title: { vi: "Bỏ một bản sao", en: "Remove one copy" }, kind: "step",
      body: {
        vi: "Q1 ở khối trái kế tiếp. Trước hết tăng <code>L</code> từ 1 lên 2, bỏ số 1 ở ô 1. Ô 4 vẫn giữ một số 1, nên <code>cnt[1]</code> giảm từ 2 xuống 1 và <code>d</code> vẫn là 3.",
        en: "Q1 is in the next left block. First move <code>L</code> from 1 to 2 and remove the 1 at cell 1. Cell 4 still holds a 1, so <code>cnt[1]</code> falls from 2 to 1 and <code>d</code> stays at 3.",
      },
      lines: [7, 11], watch: { target: "Q1 [2,3]", window: "[2, 4]", d: 3 }, verdict: "ac", fit: FIT,
      scene: picture(2, 4, "sorted", 2, "cnt[1] = 2 − 1 = 1", [1]),
    },
    {
      title: { vi: "Bỏ bản sao cuối", en: "Remove the last copy" }, kind: "step",
      body: {
        vi: "Giảm <code>R</code> từ 4 về 3, bỏ nốt số 1. Lần này <code>cnt[1]</code> về 0 nên <code>d</code> giảm từ 3 xuống 2. Cửa sổ Q1 chỉ còn 2 và 3.",
        en: "Move <code>R</code> back from 4 to 3 to remove the last 1. Now <code>cnt[1]</code> reaches 0, so <code>d</code> falls from 3 to 2. The Q1 window contains 2 and 3.",
      },
      lines: [7, 12, 13], watch: { target: "Q1 [2,3]", window: "[2, 3]", d: 2 }, verdict: "ac", fit: FIT,
      scene: picture(2, 3, "sorted", 3, "cnt[1]: 1 → 0 · d = 3 − 1", [1]),
    },
    {
      title: { vi: "Thêm hai giá trị", en: "Add two values" }, kind: "answer",
      body: {
        vi: "Q4 giữ nguyên <code>L = 2</code> và đưa <code>R</code> tới 5. Hai ô thêm vào chứa 1 và 4, đều đang có tần suất 0. Vậy <code>d = 2 + 1 + 1 = 4</code>.",
        en: "Q4 keeps <code>L = 2</code> and moves <code>R</code> to 5. The new cells contain 1 and 4, both with frequency 0 before insertion. Thus <code>d = 2 + 1 + 1 = 4</code>.",
      },
      lines: [6, 10, 13], watch: { target: "Q4 [2,5]", window: "[2, 5]", d: 4 }, verdict: "ac", fit: FIT,
      scene: picture(2, 5, "sorted", 4, "d = 2 + 1 + 1 = 4", [1, 4]),
    },
    {
      title: { vi: "Giới hạn số lần dịch", en: "Bound the pointer moves" }, kind: "recap",
      body: {
        vi: "Lưu theo <code>id</code> được 2, 3, 2, 4. Tần suất luôn đúng cho <code>[L,R]</code>. Trong mỗi khối trái, <code>R</code> chỉ tiến, còn <code>L</code> dịch O(B) giữa hai truy vấn cùng khối. Tính cả lần đổi khối, số lần dịch là O(n²/B + qB).",
        en: "Saving by <code>id</code> gives 2, 3, 2, 4. Frequencies always match <code>[L,R]</code>. Within each left block, <code>R</code> only moves forward and <code>L</code> moves O(B) between queries in that block. Including block transitions, total movement is O(n²/B + qB).",
      },
      note: {
        vi: "Dùng tần suất mảng cho giá trị nhỏ, hoặc nén tọa độ trước để mỗi lần thêm/bỏ tốn O(1).",
        en: "Use array frequencies for small values, or coordinate-compress first so each add/remove costs O(1).",
      },
      lines: [2, 3, 6, 7, 13], watch: { window: "[2, 5]", d: 4 }, verdict: "ac", fit: FIT,
      scene: picture(2, 5, "output", 4, "ans = [2, 3, 2, 4]"),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("win", { shape: shapes.frame({ h: 48, top: -43, r: 8 }), layer: "back", o: 0 });
  const cell = { w: 37, h: 29, depth: 4, r: 6 };
  A.forEach((v, i) => scene.add(`a${i}`, { shape: shapes.block({ ...cell, label: v, sub: i }), x: i }));
  scene.add("left", { shape: shapes.pointer({ text: "L" }), z: -0.52, o: 0 });
  scene.add("right", { shape: shapes.pointer({ text: "R" }), z: -0.52, o: 0 });
  scene.add("freq", { shape: shapes.pill({ text: "cnt[x]", pad: 6 }), x: -0.13, y: 3.9, o: 0 });
  VALUES.forEach((v, i) => scene.add(`cnt${v}`, {
    shape: shapes.block({ ...cell, label: 0, sub: v }), x: 1 + i, y: 4.02, o: 0,
  }));
  scene.add("distinct", { shape: shapes.pill({ pad: 6 }), x: 5.07, y: 3.9, o: 0 });
  QUERIES.forEach(({ l, r }, i) => scene.add(`q${i}`, {
    shape: shapes.pill({ text: `Q${i + 1}[${l},${r}]`, pad: 5 }), x: queryX(i), y: 6.25,
  }));
  scene.add("calc", { shape: shapes.pill({ pad: 6 }), x: 2.5, y: 7.6, o: 0 });
}
