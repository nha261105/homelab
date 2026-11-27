import type { Lesson, SceneMap } from "../../../lib/types";

const A = [2, 1, 2, 3, 1, 4];
const QUERIES = [{ l: 2, r: 6 }, { l: 1, r: 2 }, { l: 3, r: 4 }];
const ORDER = QUERIES.map((_, id) => id).sort((a, b) => QUERIES[a].r - QUERIES[b].r);
const U = 46;
const ARRAY_FIT = ["a1", "a6"];
const INPUT_FIT = [...ARRAY_FIT, "calc"];
const SWEEP_FIT = [...INPUT_FIT, "mark"];

function picture(r: number, phase: "input" | "sweep" | "output", done = 0, query = -1, formula = "", changes: number[] = []): SceneMap {
  const showTree = phase !== "input";
  const last = new Map(A.slice(0, r).map((value, i) => [value, i + 1]));
  const marks = A.map((value, i) => Number(last.get(value) === i + 1));
  const state: SceneMap = {
    sweep: { x: r === 0 ? -0.84 : r - 1, o: showTree ? 1 : 0, dur: 520 },
    mark: { o: showTree ? 1 : 0 },
    bit: { o: showTree ? 1 : 0 },
    calc: { y: phase === "input" ? 2.7 : formula ? 7.25 : 5.8, text: formula, o: formula ? 1 : 0, delay: 280, cls: query >= 0 ? "v-eq" : "" },
  };
  A.forEach((_, i) => {
    const j = i + 1;
    const inRange = query >= 0 && j >= QUERIES[query].l && j <= QUERIES[query].r;
    state[`a${j}`] = { cls: changes.includes(j) || inRange ? "is-active" : j > r && showTree ? "is-out" : "" };
    state[`m${j}`] = {
      text: String(marks[i]), o: showTree ? 1 : 0,
      cls: changes.includes(j) ? (marks[i] ? "is-good" : "is-bad") : inRange && marks[i] ? "is-good" : "",
    };
    const lo = j - (j & -j);
    state[`f${j}`] = {
      text: String(marks.slice(lo, j).reduce((sum, mark) => sum + mark, 0)),
      o: showTree ? 1 : 0, cls: changes.some((k) => lo < k && k <= j) ? "is-active" : "",
    };
  });
  QUERIES.forEach(({ l, r: right }, id) => {
    const rank = ORDER.indexOf(id);
    const slot = phase === "sweep" ? rank : id;
    const answered = rank < done;
    const distinct = new Set(A.slice(l - 1, right)).size;
    state[`q${id}`] = {
      x: 0.15 + slot * 2.35, y: phase === "input" ? 2.7 : 5.8,
      text: answered ? `Q${id + 1} = ${distinct}` : `Q${id + 1} [${l},${right}]`,
      cls: answered ? "v-eq" : "", arc: r === 0 && showTree ? 0.25 : 0, dur: 420, delay: id * 40,
    };
  });
  return state;
}

export const lesson: Lesson = {
  track: "cp", topic: "offline", slug: "offline-queries",
  title: { vi: "Sắp truy vấn để trả lời offline", en: "Answering queries offline" },
  added: "2026-11-27",
  summary: {
    vi: "Sắp theo đầu phải rồi dùng Fenwick tree đếm lần xuất hiện cuối của mỗi giá trị trong đoạn.",
    en: "Sort by right endpoint and use a Fenwick tree to count the latest occurrence of each value in the range.",
  },
  level: "hard", minutes: 10, time: "O(q log q + (n + q) log n)", memory: "O(n + q)",
  goal: { vi: "Đếm số giá trị phân biệt trong <b>3 đoạn</b> trên cùng một mảng", en: "Count distinct values in <b>3 ranges</b> of one array" },
  codeLang: "C++17",
  code: [
    '<span class="kw">auto</span> add = [&amp;](<span class="kw">int</span> i, <span class="kw">int</span> d) {',
    '  <span class="kw">for</span> (; i &lt;= n; i += i &amp; -i) f[i] += d; };',
    '<span class="kw">auto</span> pref = [&amp;](<span class="kw">int</span> i) { <span class="kw">int</span> s = 0;',
    '  <span class="kw">for</span> (; i &gt; 0; i -= i &amp; -i) { s += f[i]; } <span class="kw">return</span> s; };',
    'sort(q.begin(), q.end(), [](<span class="kw">auto</span> a, <span class="kw">auto</span> b) { <span class="kw">return</span> a.r &lt; b.r; });',
    'map&lt;<span class="kw">int</span>, <span class="kw">int</span>&gt; last;',
    '<span class="kw">int</span> p = 0;',
    '<span class="kw">for</span> (<span class="kw">auto</span> [l, r, id] : q) {',
    '  <span class="kw">while</span> (p &lt; r) {',
    '    <span class="kw">int</span> x = a[++p], old = last[x];',
    '    <span class="kw">if</span> (old) add(old, -1);',
    '    add(p, 1); last[x] = p;',
    '  } ans[id] = pref(r) - pref(l - 1);',
    '}',
  ],
  watch: [{ key: "p", label: "p" }, { key: "query", label: { vi: "truy vấn", en: "query" } }, { key: "answer", label: { vi: "đáp án", en: "answer" } }],
  practice: [
    { src: "CSES 1734", name: "Distinct Values Queries", lv: "★★☆", url: "https://cses.fi/problemset/task/1734" },
    { src: "LeetCode 1851", name: "Minimum Interval to Include Each Query", lv: "★★★", url: "https://leetcode.com/problems/minimum-interval-to-include-each-query/" },
  ],
  legend: [
    { cls: "acc", label: { vi: "vị trí hoặc ô Fenwick đang xét", en: "position or Fenwick cell in focus" } },
    { cls: "ac", label: { vi: "dấu đang đếm hoặc đáp án", en: "counted mark or answer" } },
    { cls: "wa", label: { vi: "dấu vừa xóa", en: "cleared mark" } },
  ],
  sceneOptions: { unit: U, view: [-72, -111, 380, 320] },
  entrance: A.map((_, i) => `a${i + 1}`),
  steps: [
    {
      title: { vi: "Đọc trước các truy vấn", en: "Read all queries first" }, kind: "problem",
      body: {
        vi: "Mỗi truy vấn hỏi có bao nhiêu giá trị phân biệt trong đoạn <code>[l, r]</code>. Quét lại từ đầu mỗi đoạn có thể tốn O(nq). Ta biết sẵn 3 truy vấn và mảng không đổi, nên có thể chọn thứ tự xử lý.",
        en: "Each query asks how many distinct values occur in <code>[l, r]</code>. Scanning each range afresh can cost O(nq). All 3 queries are known and the array stays fixed, so we can choose the processing order.",
      },
      lines: [], watch: {}, verdict: "run", fit: INPUT_FIT, scene: picture(0, "input"),
    },
    {
      title: { vi: "Sắp theo đầu phải", en: "Sort by right endpoint" }, kind: "concept",
      body: {
        vi: "Xử lý Q2, Q3, Q1 theo <code>r = 2, 4, 6</code> và giữ ID gốc. Con trỏ <code>p</code> bắt đầu ở 0 rồi chỉ tiến. Hàng <code>m</code> là dấu 0/1, hàng <code>f</code> là Fenwick tree khởi tạo bằng 0.",
        en: "Process Q2, Q3, Q1 by <code>r = 2, 4, 6</code>, keeping each original ID. The sweep pointer <code>p</code> starts at 0 and only moves forward. Row <code>m</code> holds 0/1 marks, and row <code>f</code> is the zero-initialized Fenwick tree.",
      },
      lines: [5, 6, 7, 8], watch: { p: 0 }, verdict: "run", fit: SWEEP_FIT, scene: picture(0, "sweep"),
    },
    {
      title: { vi: "Dừng ở đầu phải 2", en: "Stop at right endpoint 2" }, kind: "step",
      body: {
        vi: "Quét qua 2 rồi 1, đánh dấu cả ô 1 và ô 2. Ô <code>f[2]</code> giữ tổng hai dấu này, nên Q2 có <code>pref(2) − pref(0) = 2 − 0 = 2</code>.",
        en: "Sweep past 2 and then 1, marking both cells 1 and 2. Cell <code>f[2]</code> stores both marks, so Q2 gets <code>pref(2) − pref(0) = 2 − 0 = 2</code>.",
      },
      lines: [2, 4, 9, 10, 12, 13], watch: { p: 2, query: "Q2 [1,2]", answer: 2 }, verdict: "ac", fit: SWEEP_FIT,
      scene: picture(2, "sweep", 1, 1, "f[2] = 1 + 1 = 2", [1, 2]),
    },
    {
      title: { vi: "Dời dấu khi gặp lại", en: "Move a duplicate’s mark" }, kind: "step",
      body: {
        vi: "Ô 3 lại chứa 2. Xóa dấu cũ ở ô 1 bằng <code>add(1, −1)</code> rồi đặt dấu mới bằng <code>add(3, 1)</code>. <code>f[2]</code> giảm còn 1, <code>f[3]</code> tăng lên 1, còn <code>f[4]</code> giữ nguyên 2 vì chứa cả hai thay đổi.",
        en: "Cell 3 also holds 2. Clear its old mark at cell 1 with <code>add(1, −1)</code>, then mark cell 3 with <code>add(3, 1)</code>. <code>f[2]</code> falls to 1, <code>f[3]</code> rises to 1, and <code>f[4]</code> stays 2 because both changes are inside it.",
      },
      lines: [1, 2, 9, 10, 11, 12], watch: { p: 3 }, verdict: "ac", fit: SWEEP_FIT,
      scene: picture(3, "sweep", 1, -1, "f[4] = 2 − 1 + 1 = 2", [1, 3]),
    },
    {
      title: { vi: "Trừ phần trước đoạn", en: "Subtract the earlier prefix" }, kind: "step",
      body: {
        vi: "Ô 4 chứa 3 mới gặp, nên <code>f[4]</code> tăng từ 2 lên 3. Q3 hỏi <code>[3,4]</code>. Lấy <code>pref(4) − pref(2) = 3 − 1 = 2</code> để bỏ dấu của giá trị 1 nằm ở ô 2.",
        en: "Cell 4 introduces 3, so <code>f[4]</code> rises from 2 to 3. Q3 asks for <code>[3,4]</code>. Take <code>pref(4) − pref(2) = 3 − 1 = 2</code> to exclude the mark for value 1 at cell 2.",
      },
      lines: [3, 4, 12, 13], watch: { p: 4, query: "Q3 [3,4]", answer: 2 }, verdict: "ac", fit: SWEEP_FIT,
      scene: picture(4, "sweep", 2, 2, "f[4] − f[2] = 3 − 1 = 2", [4]),
    },
    {
      title: { vi: "Hoàn tất lượt quét", en: "Finish the sweep" }, kind: "answer",
      body: {
        vi: "Ô 5 chuyển dấu của 1 khỏi ô 2, rồi ô 6 thêm dấu cho 4. Q1 có <code>pref(6) − pref(1) = f[6] + f[4] − f[1] = 2 + 2 − 0 = 4</code>.",
        en: "Cell 5 moves the mark for 1 away from cell 2, then cell 6 adds a mark for 4. Q1 gets <code>pref(6) − pref(1) = f[6] + f[4] − f[1] = 2 + 2 − 0 = 4</code>.",
      },
      lines: [3, 4, 9, 10, 11, 12, 13], watch: { p: 6, query: "Q1 [2,6]", answer: 4 }, verdict: "ac", fit: SWEEP_FIT,
      scene: picture(6, "sweep", 3, 0, "f[6] + f[4] − f[1] = 4", [2, 5, 6]),
    },
    {
      title: { vi: "Trả theo thứ tự gốc", en: "Return in input order" }, kind: "recap",
      body: {
        vi: "Ở đầu phải <code>r</code>, một giá trị có mặt trong <code>[l,r]</code> đúng khi lần xuất hiện cuối của nó đến <code>r</code> nằm từ <code>l</code> trở đi. Mỗi ô làm tối đa hai cập nhật Fenwick, mỗi truy vấn đọc hai tổng tiền tố, rồi <code>ans[id]</code> đưa kết quả về thứ tự gốc 4, 2, 2.",
        en: "At right endpoint <code>r</code>, a value occurs in <code>[l,r]</code> exactly when its latest occurrence through <code>r</code> is at or after <code>l</code>. Each cell makes at most two Fenwick updates, each query reads two prefix sums, and <code>ans[id]</code> restores input order 4, 2, 2.",
      },
      lines: [5, 11, 12, 13], watch: { p: 6, answer: "4, 2, 2" }, verdict: "ac", fit: SWEEP_FIT,
      scene: picture(6, "output", 3),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  const cell = { w: 33, h: 27, depth: 4, r: 6 };
  scene.add("sweep", { shape: shapes.pill({ text: "p", pad: 6 }), x: -0.84, y: -1.72, o: 0 });
  A.forEach((v, i) => {
    const j = i + 1;
    scene.add(`a${j}`, { shape: shapes.block({ ...cell, label: v, sub: j }), x: i });
    scene.add(`m${j}`, { shape: shapes.block({ ...cell, label: 0 }), x: i, y: 2.59, o: 0 });
    scene.add(`f${j}`, { shape: shapes.block({ ...cell, label: 0 }), x: i, y: 4.24, o: 0 });
  });
  scene.add("mark", { shape: shapes.pill({ text: "m", pad: 6 }), x: -0.91, y: 2.55, o: 0 });
  scene.add("bit", { shape: shapes.pill({ text: "f", pad: 6 }), x: -0.91, y: 4.2, o: 0 });
  QUERIES.forEach(({ l, r }, i) =>
    scene.add(`q${i}`, { shape: shapes.pill({ text: `Q${i + 1} [${l},${r}]`, pad: 6 }), x: 0.15 + i * 2.35, y: 5.8 }));
  scene.add("calc", { shape: shapes.pill({ pad: 6 }), x: 2.5, y: 7.25, o: 0 });
}
