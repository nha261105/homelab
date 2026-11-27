import type { Lesson, SceneMap } from "../../../lib/types";

const ITEMS = [
  { weight: 2, value: 4 },
  { weight: 3, value: 5 },
  { weight: 4, value: 7 },
];
const W = 5;
const CAPACITIES = Array.from({ length: W + 1 }, (_, c) => c);
const dp = [CAPACITIES.map(() => 0)];
const cell = (i: number, c: number) => `d${i}-${c}`;

function choices(i: number, c: number) {
  const { weight, value } = ITEMS[i - 1];
  const skip = dp[i - 1][c];
  const rest = c >= weight ? dp[i - 1][c - weight] : undefined;
  return { skip, rest, value };
}

ITEMS.forEach((_, index) => {
  const i = index + 1;
  dp.push(CAPACITIES.map((c) => {
    const { skip, rest, value } = choices(i, c);
    return rest === undefined ? skip : Math.max(skip, rest + value);
  }));
});

function picture(row: number, focus = -1): SceneMap {
  const scene: SceneMap = { max: { o: row > 0 ? 1 : 0 } };
  dp.forEach((values, i) => {
    scene[`row${i}`] = { cls: i === row ? "is-active" : "" };
    values.forEach((v, c) => {
      scene[cell(i, c)] = {
        text: i <= row ? String(v) : "?",
        o: i <= row ? 1 : 0.56,
        cls: i > row ? "is-out" : i === row && c === focus ? "is-good" : "",
      };
    });
  });
  CAPACITIES.forEach((c) => {
    const options = row > 0 ? choices(row, c) : undefined;
    const text = options
      ? `${options.skip}, ${options.rest === undefined ? "—" : `${options.rest}+${options.value}`}`
      : "";
    scene[`formula${c}`] = { text, o: options ? 1 : 0, cls: c === focus ? "is-active" : "" };
  });
  if (row > 0 && focus >= 0) {
    const { weight } = ITEMS[row - 1];
    scene[cell(row, focus)].fx = { type: "pulse", delay: 320 };
    scene[cell(row - 1, focus)].cls = "is-active";
    if (focus >= weight) scene[cell(row - 1, focus - weight)].cls = "is-active";
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "dp",
  slug: "knapsack",
  title: { vi: "Cái túi 0/1", en: "0/1 knapsack" },
  added: "2026-11-27",
  summary: {
    vi: "Điền bảng theo từng vật, so sánh giá trị khi chọn và khi bỏ vật đó.",
    en: "Fill the table one item at a time by comparing the value of taking or skipping it.",
  },
  level: "medium",
  minutes: 9,
  time: "O(nW)",
  memory: "O(nW)",
  goal: {
    vi: "Tối đa hóa giá trị với sức chứa <b>W = 5</b>, mỗi vật chọn tối đa một lần",
    en: "Maximize value with capacity <b>W = 5</b>, using each item at most once",
  },
  codeLang: "C++17",
  code: [
    'vector&lt;vector&lt;<span class="kw">long long</span>&gt;&gt; dp(n + 1, vector&lt;<span class="kw">long long</span>&gt;(W + 1));',
    '<span class="kw">for</span> (<span class="kw">int</span> i = 1; i &lt;= n; ++i) {',
    '  <span class="kw">auto</span> [w, v] = items[i - 1];',
    '  <span class="kw">for</span> (<span class="kw">int</span> c = 0; c &lt;= W; ++c) {',
    '    dp[i][c] = dp[i - 1][c];',
    '    <span class="kw">if</span> (c &gt;= w)',
    '      dp[i][c] = max(dp[i][c], dp[i - 1][c - w] + v);',
    '  }',
    '}',
    '<span class="kw">return</span> dp[n][W];',
  ],
  watch: [
    { key: "i", label: "i" },
    { key: "c", label: "c" },
    { key: "skip", label: { vi: "bỏ", en: "skip" } },
    { key: "take", label: { vi: "chọn", en: "take" } },
    { key: "best", label: "dp[i][c]" },
  ],
  practice: [
    { src: "CSES 1158", name: "Book Shop", lv: "★☆☆", url: "https://cses.fi/problemset/task/1158" },
    { src: "LeetCode 416", name: "Partition Equal Subset Sum", lv: "★★☆", url: "https://leetcode.com/problems/partition-equal-subset-sum/" },
    { src: "CSES 1745", name: "Money Sums", lv: "★★☆", url: "https://cses.fi/problemset/task/1745" },
  ],
  sceneOptions: { unit: 51 },
  legend: [
    { cls: "acc", label: { vi: "đang xét", en: "in use" } },
    { cls: "ac", label: { vi: "ô kết quả", en: "result cell" } },
    { cls: "dim", label: { vi: "chưa tính", en: "pending" } },
  ],
  steps: [
    {
      title: { vi: "Chọn đồ vào túi", en: "Pack the bag" }, kind: "problem",
      body: {
        vi: "Túi chứa tối đa 5 đơn vị khối lượng. Ba vật có cặp (khối lượng, giá trị) lần lượt là (2, 4), (3, 5), (4, 7). Mỗi vật chỉ được chọn một lần, nên thử mọi tập con mất O(2ⁿ) thời gian ngay cả khi cập nhật tổng trong lúc duyệt.",
        en: "The bag can hold up to 5 units of weight. The three items have (weight, value) pairs (2, 4), (3, 5), and (4, 7). Each item can be taken once, so trying every subset costs O(2ⁿ) time even if we keep running totals.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(-1),
    },
    {
      title: { vi: "Khởi tạo hàng 0", en: "Initialize row zero" }, kind: "concept",
      body: {
        vi: "<code>dp[i][c]</code> là giá trị lớn nhất khi chỉ xét <code>i</code> vật đầu và dùng tối đa <code>c</code> sức chứa. Cột <code>c</code> chạy từ 0 đến 5. Chưa xét vật nào thì cả hàng <code>dp[0]</code> bằng 0.",
        en: "<code>dp[i][c]</code> is the best value using the first <code>i</code> items and up to <code>c</code> capacity. The columns run from 0 to 5. With no items considered, all of <code>dp[0]</code> is 0.",
      },
      lines: [1], watch: { i: 0, c: 5, best: 0 }, verdict: "run", fit: "all", scene: picture(0, 5),
    },
    {
      title: { vi: "Thử vật đầu tiên", en: "Try the first item" }, kind: "step",
      body: {
        vi: "Ở <code>c = 2</code>, bỏ vật được <code>dp[0][2] = 0</code>, chọn vật còn sức chứa 0 và được <code>dp[0][0] + 4 = 4</code>. Các ô công thức bên dưới ghi hai phương án (bỏ, chọn) cho từng cột. Ở cột 0 và 1, dấu — cho biết vật không vừa túi.",
        en: "At <code>c = 2</code>, skipping gives <code>dp[0][2] = 0</code>, while taking leaves 0 capacity and gives <code>dp[0][0] + 4 = 4</code>. The formula pills below list (skip, take) for each column. In columns 0 and 1, — means the item cannot fit.",
      },
      lines: [2, 3, 4, 5, 6, 7], watch: { i: 1, c: 2, skip: 0, take: 4, best: 4 }, verdict: "run",
      fit: "all", scene: picture(1, 2),
    },
    {
      title: { vi: "Ghép hai vật đầu", en: "Combine two items" }, kind: "step",
      body: {
        vi: "Ở <code>c = 5</code>, bỏ vật 2 giữ <code>dp[1][5] = 4</code>. Chọn vật 2 tốn 3 sức chứa, còn 2 để dùng cho vật 1, nên phương án này được <code>dp[1][2] + 5 = 4 + 5 = 9</code>.",
        en: "At <code>c = 5</code>, skipping item 2 keeps <code>dp[1][5] = 4</code>. Taking it uses 3 capacity, leaving 2 for item 1 and yielding <code>dp[1][2] + 5 = 4 + 5 = 9</code>.",
      },
      lines: [4, 5, 6, 7], watch: { i: 2, c: 5, skip: 4, take: 9, best: 9 }, verdict: "run",
      fit: "all", scene: picture(2, 5),
    },
    {
      title: { vi: "Thử vật cuối", en: "Try the last item" }, kind: "step",
      body: {
        vi: "Ở <code>c = 4</code>, bỏ vật 3 giữ giá trị 5 từ hàng trên. Chọn nó dùng hết sức chứa, cho <code>dp[2][0] + 7 = 7</code>. Ta ghi 7 vào <code>dp[3][4]</code>.",
        en: "At <code>c = 4</code>, skipping item 3 keeps the value 5 from the row above. Taking it uses all the capacity, giving <code>dp[2][0] + 7 = 7</code>. Put 7 in <code>dp[3][4]</code>.",
      },
      lines: [5, 6, 7], watch: { i: 3, c: 4, skip: 5, take: 7, best: 7 }, verdict: "run",
      fit: "all", scene: {
        ...picture(3, 4),
        [cell(3, 5)]: { text: "?", o: 0.56, cls: "is-out" },
        formula5: { text: "", o: 0 },
      },
    },
    {
      title: { vi: "Đọc ô cuối", en: "Read the last cell" }, kind: "answer",
      body: {
        vi: "Ở <code>c = 5</code>, chọn vật 3 chỉ được <code>dp[2][1] + 7 = 7</code>, còn bỏ nó giữ được 9. Vậy <code>dp[3][5] = 9</code> nhờ chọn vật 1 và 2, vừa đủ khối lượng <code>2 + 3 = 5</code>.",
        en: "At <code>c = 5</code>, taking item 3 gives <code>dp[2][1] + 7 = 7</code>, while skipping it keeps 9. So <code>dp[3][5] = 9</code>, achieved by taking items 1 and 2 for a total weight of <code>2 + 3 = 5</code>.",
      },
      lines: [5, 6, 7, 10], watch: { i: 3, c: 5, skip: 9, take: 7, best: 9 }, verdict: "ac",
      fit: "all", scene: picture(3, 5),
    },
    {
      title: { vi: "Chỉ đọc hàng trước", en: "Use the previous row" }, kind: "recap",
      body: {
        vi: "Bỏ hay chọn vật <code>i</code> đều để lại một bài toán chỉ dùng <code>i − 1</code> vật đầu. Vì cả hai phương án đều đọc hàng trước, vật <code>i</code> chỉ được tính tối đa một lần. Với <code>(n + 1)(W + 1)</code> ô và O(1) việc mỗi ô, bảng dùng O(nW) thời gian và bộ nhớ.",
        en: "Both skipping and taking item <code>i</code> leave a subproblem using only the first <code>i − 1</code> items. Reading both choices from the previous row ensures item <code>i</code> is counted at most once. With <code>(n + 1)(W + 1)</code> entries and O(1) work each, the table uses O(nW) time and space.",
      },
      lines: [4, 5, 6, 7], watch: { i: 3, c: 5, best: 9 }, verdict: "ac",
      fit: "all", scene: picture(3, 5),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  CAPACITIES.forEach((c) => {
    scene.add(`col${c}`, { shape: shapes.pill({ text: c, h: 21 }), x: c + 1.4 });
    scene.add(`formula${c}`, { shape: shapes.pill({ h: 21, pad: 4 }), x: c + 1.4, y: 8.2, s: 0.72, o: 0 });
  });
  scene.add("axes", { shape: shapes.pill({ text: "i / c", h: 21 }), x: 0 });
  scene.add("max", { shape: shapes.pill({ text: "max", h: 21 }), x: 0, y: 8.2, o: 0 });
  dp.forEach((row, i) => {
    const y = 1.6 * (i + 1);
    const item = ITEMS[i - 1];
    const label = item ? `${i} (${item.weight}, ${item.value})` : "0";
    scene.add(`row${i}`, { shape: shapes.pill({ text: label, h: 24, pad: 6 }), x: 0, y });
    row.forEach((_, c) => {
      scene.add(cell(i, c), {
        shape: shapes.block({ label: "?", w: 44, h: 27, depth: 4 }),
        x: c + 1.4, y,
      });
    });
  });
}
