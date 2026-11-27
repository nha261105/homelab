import type { Lesson, SceneMap } from "../../../lib/types";

const N = 5;
const U = 49;
const ways = [1, 1];
for (let i = 2; i <= N; ++i) ways[i] = ways[i - 1] + ways[i - 2];

interface Call {
  id: string;
  i: number;
  x: number;
  depth: number;
  parent?: string;
}

const calls: Call[] = [];
let leaf = 0;
function placeCall(i: number, id: string, depth = 0, parent?: string): number {
  const call = { id, i, x: 0, depth, parent };
  calls.push(call);
  if (i < 2) call.x = leaf++ * 0.91;
  else {
    const left = placeCall(i - 1, id + "l", depth + 1, id);
    const right = placeCall(i - 2, id + "r", depth + 1, id);
    call.x = (left + right) / 2;
  }
  return call.x;
}
placeCall(N, "root");

const cell = (i: number) => "dp" + i;
const tableIds = ways.map((_, i) => cell(i));
const drawEdge = { p: 1, from: { p: 0 }, delay: 120, dur: 440 };
const active = { cls: "is-active" };

function tree(expanded: boolean): SceneMap {
  const scene: SceneMap = Object.fromEntries(tableIds.map((id) => [id, { text: "?", o: 0 }]));
  for (const { id, depth, parent } of calls) {
    const visible = expanded || depth <= 1;
    const repeated = expanded && (id === "rootll" || id === "rootr");
    scene[id] = { o: visible ? 1 : 0, cls: repeated ? "is-active" : "" };
    if (parent && visible) scene["edge-" + id] = { ...drawEdge, delay: depth * 100 };
  }
  return { ...scene, calc: { text: "", o: 0 } };
}

function table(i: number, recap = false): SceneMap {
  const scene: SceneMap = {};
  for (const [k, value] of ways.entries()) {
    const fresh = k === i || (i === 1 && k === 0);
    const source = i > 1 && (k === i - 1 || k === i - 2);
    scene[cell(k)] = {
      text: k <= i ? String(value) : "?",
      o: k <= i ? 1 : 0.42,
      cls: fresh ? "is-good" : source ? active.cls : k <= i ? "" : "is-out",
      ...(fresh && !recap ? { from: { o: 0, z: 0.5 }, ease: "drop", dur: 430, delay: i > 1 ? 360 : 0 } : {}),
    };
  }
  if (i > 1) {
    scene.one = { ...drawEdge, ends: [cell(i - 1), cell(i)], cls: "v-eq" };
    scene.two = { ...drawEdge, ends: [cell(i - 2), cell(i)], cls: "v-eq" };
  }
  scene.calc = {
    text: i === 1 ? "dp[0] = dp[1] = 1" : `dp[${i}] = ${ways[i - 1]} + ${ways[i - 2]} = ${ways[i]}`,
    o: 1, from: { o: 0, s: 0.8 }, delay: recap ? 0 : 550, dur: 330, ease: "back", cls: "v-eq",
  };
  return scene;
}

const tableFit = [...tableIds, "calc"];
const treeFit = calls.map(({ id }) => id);

export const lesson: Lesson = {
  track: "cp",
  topic: "dp",
  slug: "stairs",
  title: { vi: "Leo cầu thang", en: "Climbing stairs" },
  added: "2026-11-27",
  summary: {
    vi: "Gộp những lời gọi đệ quy trùng nhau thành các ô trong bảng DP một chiều.",
    en: "Merge repeated recursive calls into entries in a one-dimensional DP table.",
  },
  level: "basic",
  minutes: 7,
  time: "O(n)",
  memory: "O(n)",
  goal: {
    vi: "Đếm cách leo <b>5 bậc</b>, mỗi lượt lên 1 hoặc 2 bậc",
    en: "Count ways to climb <b>5 stairs</b>, taking 1 or 2 at a time",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">long long</span> climb(<span class="kw">int</span> n) {',
    '  <span class="kw">if</span> (n &lt;= 1) <span class="kw">return</span> 1;',
    '  std::vector&lt;<span class="kw">long long</span>&gt; dp(n + 1);',
    '  dp[0] = dp[1] = 1;',
    '  <span class="kw">for</span> (<span class="kw">int</span> i = 2; i &lt;= n; ++i)',
    '    dp[i] = dp[i - 1] + dp[i - 2];',
    '  <span class="kw">return</span> dp[n];',
    '}',
  ],
  watch: [
    { key: "i", label: "i" },
    { key: "ways", label: "dp[i]" },
    { key: "calls", label: { vi: "số lời gọi", en: "call count" } },
  ],
  practice: [
    { src: "LeetCode 70", name: "Climbing Stairs", lv: "★☆☆", url: "https://leetcode.com/problems/climbing-stairs/" },
    { src: "CSES 1633", name: "Dice Combinations", lv: "★★☆", url: "https://cses.fi/problemset/task/1633" },
  ],
  sceneOptions: { unit: U, view: [-36, -84, 390, 340] },
  legend: [
    { cls: "acc", label: { vi: "lời gọi trùng hoặc ô nguồn", en: "repeated calls or source cells" } },
    { cls: "ac", label: { vi: "ô vừa tính", en: "newly filled cell" } },
    { cls: "dim", label: { vi: "chưa tính", en: "pending" } },
  ],
  steps: [
    {
      title: { vi: "Leo 5 bậc", en: "Climb five stairs" }, kind: "problem",
      body: {
        vi: "Mỗi lượt được lên 1 hoặc 2 bậc. Để tới bậc 5, lượt cuối phải xuất phát từ bậc 4 hoặc 3. Nếu cứ gọi đệ quy cho cả hai lựa chọn, nhiều số đếm sẽ bị tính lại.",
        en: "Each move climbs 1 or 2 stairs. To reach stair 5, the last move starts at stair 4 or 3. Recursing on both choices recomputes many counts.",
      },
      lines: [], watch: {}, verdict: "run", fit: ["root", "rootl", "rootr"], scene: tree(false),
    },
    {
      title: { vi: "Tìm lời gọi trùng", en: "Find repeated calls" }, kind: "concept",
      body: {
        vi: "Cây có 15 lời gọi nhưng chỉ có 6 giá trị <code>i</code>, từ 0 đến 5. Hai nút <code>f(3)</code> được tô sáng tính cùng một kết quả. Ta lưu kết quả vào một ô <code>dp[3]</code> để dùng lại.",
        en: "The tree has 15 calls but only 6 values of <code>i</code>, from 0 through 5. The two highlighted <code>f(3)</code> nodes compute the same result. Store it once in <code>dp[3]</code> for reuse.",
      },
      lines: [3], watch: { calls: calls.length }, verdict: "run", fit: treeFit, scene: tree(true),
    },
    {
      title: { vi: "Điền hai ô gốc", en: "Fill two base cases" }, kind: "concept",
      body: {
        vi: "<code>dp[i]</code> đếm số cách lên đúng bậc <code>i</code>. Có một cách tới bậc 0 là đứng yên, và một cách tới bậc 1 là bước 1 bậc.",
        en: "<code>dp[i]</code> counts the ways to reach exactly stair <code>i</code>. There is one way to reach stair 0 by staying put and one way to reach stair 1 with a single step.",
      },
      lines: [2, 3, 4], watch: { i: 1, ways: ways[1] }, verdict: "run", fit: tableFit, scene: table(1),
    },
    {
      title: { vi: "Xét bước cuối", en: "Check the last move" }, kind: "step",
      body: {
        vi: "Để tới bậc 2, nối một bước dài 1 vào cách tới bậc 1 hoặc nối một bước dài 2 vào cách tới bậc 0. Hai nhóm cho <code>dp[2] = 1 + 1 = 2</code>.",
        en: "To reach stair 2, append a move of 1 to a way to reach stair 1, or append a move of 2 to a way to reach stair 0. The two groups give <code>dp[2] = 1 + 1 = 2</code>.",
      },
      lines: [5, 6], watch: { i: 2, ways: ways[2] }, verdict: "run", fit: tableFit, scene: table(2),
    },
    {
      title: { vi: "Dùng lại ô trước", en: "Reuse earlier cells" }, kind: "step",
      body: {
        vi: "Bậc 3 nhận 2 cách từ bậc 2 và 1 cách từ bậc 1, nên <code>dp[3] = 2 + 1 = 3</code>. Giờ cả hai lần cần <code>f(3)</code> đều có thể đọc cùng ô này.",
        en: "Stair 3 gets 2 ways from stair 2 and 1 way from stair 1, so <code>dp[3] = 2 + 1 = 3</code>. Both places that needed <code>f(3)</code> can now read this cell.",
      },
      lines: [5, 6], watch: { i: 3, ways: ways[3] }, verdict: "run", fit: tableFit, scene: table(3),
    },
    {
      title: { vi: "Tính số cách tới 4", en: "Count routes to four" }, kind: "step",
      body: {
        vi: "Dịch sang ô tiếp theo. Bậc 4 nhận 3 cách từ bậc 3 và 2 cách từ bậc 2, nên <code>dp[4] = 3 + 2 = 5</code>.",
        en: "Move to the next cell. Stair 4 gets 3 ways from stair 3 and 2 ways from stair 2, so <code>dp[4] = 3 + 2 = 5</code>.",
      },
      lines: [5, 6], watch: { i: 4, ways: ways[4] }, verdict: "run", fit: tableFit, scene: table(4),
    },
    {
      title: { vi: "Đọc ô cuối", en: "Read the last cell" }, kind: "answer",
      body: {
        vi: "Bậc 5 lấy 5 cách từ bậc 4 và 3 cách từ bậc 3. Vậy <code>dp[5] = 5 + 3 = 8</code> cách.",
        en: "Stair 5 gets 5 ways from stair 4 and 3 ways from stair 3. That gives <code>dp[5] = 5 + 3 = 8</code> ways.",
      },
      lines: [6, 7], watch: { i: N, ways: ways[N] }, verdict: "ac", fit: tableFit, scene: table(N),
    },
    {
      title: { vi: "Mỗi ô tính một lần", en: "Compute each cell once" }, kind: "recap",
      body: {
        vi: "Mỗi cách tới bậc <code>i</code> thuộc đúng một nhóm theo độ dài bước cuối, nên phép cộng đếm đủ và không trùng. Đi từ trái sang phải tính mỗi ô một lần, dùng O(n) thời gian và O(n) bộ nhớ. Vì mỗi bước chỉ đọc hai ô trước, giữ hai giá trị là đủ nếu chỉ cần đáp án.",
        en: "Each way to stair <code>i</code> belongs to exactly one group by its last move, so the sum counts every way once. Filling left to right costs O(n) time and O(n) space. Each update reads only the two preceding cells, so two values suffice when only the answer is needed.",
      },
      lines: [5, 6, 7], watch: { i: N, ways: ways[N] }, verdict: "ac", fit: tableFit, scene: table(N, true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const { id, i, x, depth, parent } of calls) {
    scene.add(id, { shape: shapes.block({ label: `f(${i})`, w: 39, h: 27, depth: 4, r: 6 }), x, y: depth * 2.35, o: 0 });
    if (parent) scene.link("edge-" + id, { from: parent, to: id, bend: -0.72 });
  }
  for (const [i, id] of tableIds.entries()) {
    scene.add(id, { shape: shapes.block({ label: "?", sub: `dp[${i}]`, w: 43, h: 39, depth: 4 }), x: i * 1.12, o: 0 });
  }
  scene.link("one", { from: cell(1), to: cell(2), bend: 0.38 });
  scene.link("two", { from: cell(0), to: cell(2), bend: 1.1 });
  scene.add("calc", { shape: shapes.pill(), x: 2.8, y: 3.05, o: 0 });
}
