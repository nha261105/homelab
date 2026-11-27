import type { Lesson, SceneMap } from "../../../lib/types";

const coins = [1, 3, 4];
const target = 6;
const amounts = Array.from({ length: target + 1 }, (_, x) => x);
const few = amounts.map(() => Infinity);
const ordered = amounts.map(() => 0);
few[0] = 0;
ordered[0] = 1;
const sources = (x: number) => coins.filter((c) => c <= x).map((c) => x - c);
for (let x = 1; x <= target; ++x) {
  few[x] = 1 + Math.min(...sources(x).map((y) => few[y]));
  ordered[x] = sources(x).reduce((sum, y) => sum + ordered[y], 0);
}

const passes = [amounts.map((x) => Number(x === 0))];
for (const c of coins) {
  const next = [...passes[passes.length - 1]];
  for (let x = c; x <= target; ++x) next[x] += next[x - c];
  passes.push(next);
}

const U = 48;
const dx = 1.04;
const lowerY = 2.18;
const cell = (x: number) => `c${x}`;
const prev = (x: number) => `prev${x}`;
const formulas = [0, 1, 2].map((i) => `calc${i}`);

function picture(
  values: number[], end: number, first: number, before: number[] | undefined, formulasText: string[],
  focus: number[] = [], coin = 0,
): SceneMap {
  const scene: SceneMap = {};
  for (const x of amounts) {
    const fresh = x >= first && x <= end;
    scene[cell(x)] = {
      text: x <= end ? String(values[x]) : "?",
      y: before ? lowerY : 0,
      cls: fresh ? "is-good" : focus.includes(x) ? "is-active" : x <= end ? "" : "is-out",
      o: x <= end ? 1 : 0.44,
      ...(fresh ? { from: { o: 0.45, z: 0.36 }, delay: (x - first) * 75, dur: 370, ease: "drop" } : {}),
    };
    scene[prev(x)] = { text: before ? String(before[x]) : "", o: before ? 1 : 0 };
    if (coin && x >= coin) scene[`use${x}`] = {
      ends: [cell(x - coin), cell(x)], p: 1, from: { p: 0 }, delay: (x - coin) * 75, dur: 440, cls: "v-eq",
    };
  }
  formulas.forEach((id, i) => {
    const text = formulasText[i] ?? "";
    scene[id] = {
      text, o: text ? 1 : 0, y: (before ? lowerY : 0) + 2.23 + i * 1.15,
      ...(text ? { from: { o: 0, s: 0.8 }, cls: "v-eq", delay: 470 + i * 75, dur: 320, ease: "back" } : {}),
    };
  });
  return scene;
}

const range = (first: number, end: number) => amounts.slice(first, end + 1);
function minimize(first: number, end: number): SceneMap {
  const text = range(first, end).map((x) => {
    const inputs = sources(x).map((y) => few[y]);
    const best = inputs.length === 1 ? inputs[0] : `min(${inputs.join(", ")})`;
    return `few[${x}] = 1 + ${best} = ${few[x]}`;
  });
  return picture(few, end, first, undefined, text, sources(first));
}
function countOrdered(first: number, end: number): SceneMap {
  const text = range(first, end).map((x) => {
    const inputs = sources(x).map((y) => ordered[y]);
    return inputs.length === 1
      ? `ordered[${x}] = ordered[${x - 1}] = ${ordered[x]}`
      : `ordered[${x}] = ${inputs.join(" + ")} = ${ordered[x]}`;
  });
  return picture(ordered, end, first, undefined, text, sources(first));
}
function countUnordered(pass: number): SceneMap {
  const coin = coins[pass - 1];
  const before = passes[pass - 1];
  const after = passes[pass];
  const sourcesAtTarget = `unordered[${target}] = ${before[target]} + ${after[target - coin]} = ${after[target]}`;
  const text = [`c = ${coin} · x ↑`, sourcesAtTarget];
  if (pass === 2) text.unshift("c = 1: 0 + 1 = 1 (x ≥ 1)");
  return picture(after, target, coin, before, text, [], coin);
}

const board = amounts.map(cell);
const fit = [...board, ...formulas];
const withPrev = [...fit, ...amounts.map(prev)];

export const lesson: Lesson = {
  track: "cp",
  topic: "dp",
  slug: "coin-change",
  title: { vi: "Đổi tiền", en: "Coin change" },
  added: "2026-11-27",
  summary: {
    vi: "Tìm số đồng ít nhất để đạt một tổng, rồi đổi phép cập nhật và thứ tự duyệt để đếm cách.",
    en: "Find the fewest coins for a sum, then change the update and loop order to count ways.",
  },
  level: "basic",
  minutes: 9,
  time: "O(kX)",
  memory: "O(X)",
  goal: {
    vi: "Đổi <b>6</b> bằng các đồng <b>1, 3, 4</b>, mỗi loại dùng tùy ý",
    en: "Make <b>6</b> with coins <b>1, 3, 4</b>, each reusable",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">const int</span> INF = X + 1, MOD = 1000000007;',
    'std::vector&lt;<span class="kw">int</span>&gt; few(X + 1, INF), ordered(X + 1), unordered(X + 1);',
    'few[0] = 0;',
    'ordered[0] = unordered[0] = 1;',
    '<span class="kw">for</span> (<span class="kw">int</span> x = 1; x &lt;= X; ++x) {',
    '  <span class="kw">for</span> (<span class="kw">int</span> c : coins) <span class="kw">if</span> (c &lt;= x) {',
    '    few[x] = std::min(few[x], 1 + few[x - c]);',
    '    ordered[x] = (ordered[x] + ordered[x - c]) % MOD;',
    '  }',
    '}',
    '<span class="kw">for</span> (<span class="kw">int</span> c : coins)',
    '  <span class="kw">for</span> (<span class="kw">int</span> x = c; x &lt;= X; ++x)',
    '    unordered[x] = (unordered[x] + unordered[x - c]) % MOD;',
    '<span class="kw">int</span> minimum = few[X] == INF ? -1 : few[X];',
  ],
  watch: [
    { key: "x", label: "x" },
    { key: "c", label: "c" },
    { key: "few", label: "few[x]" },
    { key: "ordered", label: "ordered[x]" },
    { key: "unordered", label: "unordered[x]" },
  ],
  practice: [
    { src: "CSES 1634", name: "Minimizing Coins", lv: "★☆☆", url: "https://cses.fi/problemset/task/1634" },
    { src: "CSES 1635", name: "Coin Combinations I", lv: "★★☆", url: "https://cses.fi/problemset/task/1635" },
    { src: "CSES 1636", name: "Coin Combinations II", lv: "★★☆", url: "https://cses.fi/problemset/task/1636" },
  ],
  sceneOptions: { unit: U, view: [-55, -100, 405, 285] },
  legend: [
    { cls: "acc", label: { vi: "ô nguồn", en: "source cell" } },
    { cls: "ac", label: { vi: "ô vừa tính", en: "newly filled cell" } },
    { cls: "dim", label: { vi: "chưa tính", en: "pending" } },
  ],
  steps: [
    {
      title: { vi: "Đổi đúng 6", en: "Make exactly six" }, kind: "problem",
      body: {
        vi: "Có vô hạn đồng 1, 3 và 4. Cần ít nhất bao nhiêu đồng để được đúng 6, và có bao nhiêu cách đổi? Thử từng dãy đồng sẽ lặp lại cùng bài toán cho phần tiền còn thiếu.",
        en: "There are unlimited coins of values 1, 3, and 4. What is the fewest coins that make exactly 6, and how many ways are there? Trying every sequence repeats the same subproblem for the amount still owed.",
      },
      lines: [], watch: { x: target }, verdict: "run", fit: board, scene: picture(few, -1, 0, undefined, []),
    },
    {
      title: { vi: "Khởi tạo tổng 0", en: "Seed the zero amount" }, kind: "concept",
      body: {
        vi: "Cột <code>x</code> là số tiền cần đổi. Đổi tổng 0 cần 0 đồng, và có đúng một cách là không lấy đồng nào. Vì vậy <code>few[0] = 0</code>, còn cả hai bảng đếm bắt đầu bằng 1 ở cột 0.",
        en: "Column <code>x</code> is the amount to make. Making zero costs zero coins, and there is one way to do it: take no coins. Set <code>few[0] = 0</code> and start both counting tables with 1 at column 0.",
      },
      lines: [1, 2, 3, 4], watch: { x: 0, few: 0, ordered: 1, unordered: 1 }, verdict: "run", fit: [...board, formulas[0]],
      scene: picture(few, 0, 0, undefined, ["few[0] = 0"]),
    },
    {
      title: { vi: "Chọn đồng cuối", en: "Try the last coin" }, kind: "step",
      body: {
        vi: "Nếu đồng cuối là <code>c</code>, ta cần thêm 1 đồng vào phương án tốt nhất cho <code>x − c</code>. Với <code>x = 3</code>, chọn đồng 1 cho <code>1 + 2 = 3</code> đồng, còn chọn đồng 3 cho <code>1 + 0 = 1</code> đồng. Lấy kết quả nhỏ hơn.",
        en: "If the last coin is <code>c</code>, add 1 coin to the best solution for <code>x − c</code>. At <code>x = 3</code>, choosing coin 1 costs <code>1 + 2 = 3</code> coins, while choosing coin 3 costs <code>1 + 0 = 1</code>. Keep the smaller result.",
      },
      lines: [5, 6, 7], watch: { x: 3, few: few[3] }, verdict: "run", fit, scene: minimize(1, 3),
    },
    {
      title: { vi: "Hai đồng là đủ", en: "Two coins suffice" }, kind: "step",
      body: {
        vi: "Ở cột 6, thử lần lượt các đồng 1, 3, 4 từ những cột 5, 3, 2. Kết quả là <code>1 + min(2, 1, 2) = 2</code>, ứng với cách <code>3 + 3</code>.",
        en: "At column 6, coins 1, 3, and 4 refer to columns 5, 3, and 2. We get <code>1 + min(2, 1, 2) = 2</code>, attained by <code>3 + 3</code>.",
      },
      lines: [5, 6, 7, 14], watch: { x: target, few: few[target] }, verdict: "run", fit, scene: minimize(4, 6),
    },
    {
      title: { vi: "Cộng số cách", en: "Add the counts" }, kind: "step",
      body: {
        vi: "Khi thứ tự có ý nghĩa, mỗi dãy thuộc đúng một nhóm theo đồng cuối. Khởi tạo <code>ordered[0] = 1</code>, rồi cộng các nhóm. Với tổng 3, nhóm kết thúc bằng 1 và nhóm kết thúc bằng 3 cho <code>1 + 1 = 2</code> dãy.",
        en: "When order matters, every sequence belongs to one group by its last coin. Start with <code>ordered[0] = 1</code> and add the group sizes. At sum 3, ending in 1 or 3 gives <code>1 + 1 = 2</code> sequences.",
      },
      lines: [4, 5, 6, 8], watch: { x: 3, ordered: ordered[3] }, verdict: "run", fit, scene: countOrdered(1, 3),
    },
    {
      title: { vi: "Tách theo thứ tự", en: "Distinguish the orders" }, kind: "step",
      body: {
        vi: "Tổng 6 có <code>6 + 2 + 1 = 9</code> dãy theo thứ tự đồng cuối là 1, 3, 4. Chẳng hạn, <code>1 + 1 + 4</code>, <code>1 + 4 + 1</code> và <code>4 + 1 + 1</code> là ba dãy khác nhau.",
        en: "Sum 6 has <code>6 + 2 + 1 = 9</code> sequences, grouped here by a last coin of 1, 3, or 4. For example, <code>1 + 1 + 4</code>, <code>1 + 4 + 1</code>, and <code>4 + 1 + 1</code> are three distinct sequences.",
      },
      lines: [5, 6, 8], watch: { x: target, ordered: ordered[target] }, verdict: "run", fit, scene: countOrdered(4, 6),
    },
    {
      title: { vi: "Duyệt từng loại đồng", en: "Process one denomination at a time" }, kind: "step",
      body: {
        vi: "Khi bỏ qua thứ tự, duyệt loại đồng ở vòng ngoài. Hàng trên là kết quả sau đồng 1, mỗi tổng có một cách. Khi thêm đồng 3, hàng dưới giữ cách cũ ở mỗi cột rồi cộng cách từ cột cách 3 ô bên trái, kể cả cách vừa cập nhật.",
        en: "For unordered combinations, put denominations in the outer loop. The top row is the result after coin 1, with one way per amount. Adding coin 3 keeps the old count in each column and adds the count three columns to the left in the updated row.",
      },
      lines: [4, 11, 12, 13], watch: { x: target, c: 3, unordered: passes[2][target] }, verdict: "run", fit: withPrev, scene: countUnordered(2),
    },
    {
      title: { vi: "Thêm loại đồng cuối", en: "Add the final denomination" }, kind: "answer",
      body: {
        vi: "Khi thêm đồng 4, cột 6 giữ 3 cách cũ rồi cộng 1 cách từ cột 2, được 4 cách không xét thứ tự. Bốn cách là dùng sáu đồng 1, dùng <code>3 + 1 + 1 + 1</code>, <code>3 + 3</code>, hoặc <code>4 + 1 + 1</code>.",
        en: "When we add coin 4, column 6 keeps 3 old ways and adds 1 way from column 2, giving 4 unordered combinations. They use six 1s, <code>3 + 1 + 1 + 1</code>, <code>3 + 3</code>, or <code>4 + 1 + 1</code>.",
      },
      lines: [11, 12, 13], watch: { x: target, c: 4, few: few[target], ordered: ordered[target], unordered: passes[3][target] },
      verdict: "ac", fit: withPrev, scene: countUnordered(3),
    },
    {
      title: { vi: "Đổi thứ tự vòng lặp", en: "Choose the loop order" }, kind: "recap",
      body: {
        vi: "Duyệt tổng trước để xét đồng cuối cho mỗi dãy. Duyệt đồng trước để mỗi tổ hợp được tạo theo một thứ tự mệnh giá cố định, và tăng <code>x</code> để được lấy lại đồng đó. Với <code>k</code> mệnh giá và tổng đích <code>X</code>, mỗi bài dùng O(kX) thời gian và O(X) bộ nhớ.",
        en: "Loop over amounts first to consider the last coin of each sequence. Loop over coins first to build each combination in a fixed denomination order, and increase <code>x</code> to allow reusing that coin. With <code>k</code> denominations and target <code>X</code>, each variant takes O(kX) time and O(X) space.",
      },
      lines: [5, 6, 8, 11, 12, 13], watch: { x: target, few: few[target], ordered: ordered[target], unordered: passes[3][target] },
      verdict: "ac", fit: withPrev, scene: countUnordered(3),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const x of amounts) {
    scene.add(prev(x), { shape: shapes.block({ label: "", w: 43, h: 32, depth: 4 }), x: x * dx, o: 0 });
    scene.add(cell(x), { shape: shapes.block({ label: "?", sub: `x=${x}`, w: 43, h: 32, depth: 4 }), x: x * dx });
    if (x >= 3) scene.link(`use${x}`, { from: cell(x - 3), to: cell(x), bend: 0.65 });
  }
  for (const id of formulas) scene.add(id, { shape: shapes.pill(), x: (target * dx) / 2, o: 0 });
}
