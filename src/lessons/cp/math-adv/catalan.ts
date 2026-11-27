import type { Lesson, SceneMap } from "../../../lib/types";

const valid = "(()())";
const bad = "())(()";
const crossedAt = 3;
const reflected = [...bad].map((bracket, i) => i >= crossedAt ? bracket : bracket === "(" ? ")" : "(").join("");
const nodes = Array.from({ length: 7 }, (_, i) => `p${i}`);
const fit = [...nodes, "diagonal-label", "calc", "result"];

function path(
  word = "", prefix = 0, mark = "", calc = "", result = "", answer = false,
): SceneMap {
  const scene: SceneMap = {
    calc: { text: calc, o: calc ? 1 : 0 },
    result: { text: result, o: result ? 1 : 0, cls: answer ? "v-eq" : "" },
  };
  let x = 0;
  let y = 0;
  for (let i = 0; i < nodes.length; i++) {
    const bracket = word[i - 1];
    if (bracket === "(") y++;
    if (bracket === ")") x++;
    scene[nodes[i]] = {
      text: i === 0 ? "0" : bracket ?? "",
      x, y: -2 * y, o: i === 0 || bracket ? 1 : 0,
      cls: answer ? "is-good" : i > 0 && i <= prefix ? mark : "",
      dur: 540,
    };
    if (i > 0) {
      const active = i <= prefix;
      scene[`edge${i}`] = {
        p: bracket ? 1 : 0,
        cls: active && mark === "is-bad" ? "v-gt" : answer ? "v-eq" : "",
        ...(bracket && active ? { from: { p: 0 }, delay: 240, dur: 460 } : {}),
      };
    }
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "math-adv", slug: "catalan",
  title: { vi: "Số Catalan", en: "Catalan numbers" },
  added: "2026-11-27", level: "hard", minutes: 10,
  summary: {
    vi: "Đổi dãy ngoặc thành đường đi trên lưới rồi dùng phép phản xạ để đếm các đường phạm luật.",
    en: "Turn bracket sequences into grid paths and count the invalid paths by reflection.",
  },
  time: "O(n + log MOD)", memory: "O(1)",
  goal: {
    vi: "Đếm dãy ngoặc đúng có <b>3 cặp ngoặc</b>",
    en: "Count valid bracket sequences with <b>3 pairs</b>",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">long long</span> catalan(<span class="kw">int</span> len) {',
    '  <span class="kw">if</span> (len % 2) <span class="kw">return</span> 0;',
    '  <span class="kw">const long long</span> MOD = 1000000007;',
    '  <span class="kw">int</span> n = len / 2;',
    '  <span class="kw">long long</span> num = 1, den = n + 1;',
    '  <span class="kw">for</span> (<span class="kw">int</span> i = 1; i &lt;= n; ++i) {',
    '    num = num * (n + i) % MOD; den = den * i % MOD;',
    '  }',
    '  <span class="kw">long long</span> inv = 1;',
    '  <span class="kw">for</span> (<span class="kw">long long</span> e = MOD - 2; e; e &gt;&gt;= 1) {',
    '    <span class="kw">if</span> (e &amp; 1) inv = inv * den % MOD;',
    '    den = den * den % MOD;',
    '  }',
    '  <span class="kw">return</span> num * inv % MOD;',
    '}',
  ],
  watch: [
    { key: "n", label: "n" },
    { key: "end", label: { vi: "điểm cuối", en: "endpoint" } },
    { key: "all", label: { vi: "tổng số đường", en: "all paths" } },
    { key: "bad", label: { vi: "đường phạm luật", en: "invalid paths" } },
    { key: "answer", label: "Cₙ" },
  ],
  practice: [
    { src: "LeetCode 96", name: "Unique Binary Search Trees", lv: "★★☆", url: "https://leetcode.com/problems/unique-binary-search-trees/" },
    { src: "CSES 2064", name: "Bracket Sequences I", lv: "★★★", url: "https://cses.fi/problemset/task/2064" },
  ],
  sceneOptions: { unit: 40 },
  legend: [
    { cls: "acc", label: { vi: "bước trên đường đi", en: "path step" } },
    { cls: "wa", label: { vi: "tiền tố tới lần vượt đầu", en: "prefix through first crossing" } },
    { cls: "ac", label: { vi: "đường hợp lệ", en: "valid path" } },
  ],
  steps: [
    {
      title: { vi: "Đếm dãy ngoặc đúng", en: "Count valid bracket sequences" }, kind: "problem",
      body: {
        vi: "Với 3 cặp ngoặc, ta cần đếm các dãy dài 6 sao cho trong mọi tiền tố, số ngoặc đóng không vượt số ngoặc mở. Nếu sinh tất cả chuỗi nhị phân dài 2n, số ứng viên là <code>2^(2n)</code>.",
        en: "With 3 pairs, count length-6 strings whose prefixes never have more closing brackets than opening ones. Generating all binary strings of length 2n gives <code>2^(2n)</code> candidates.",
      },
      lines: [2, 4], watch: { n: 3 }, verdict: "run", fit, scene: path("", 0, "", "(0, 0) → (3, 3)"),
    },
    {
      title: { vi: "Đổi ngoặc thành bước", en: "Turn brackets into steps" }, kind: "concept",
      body: {
        vi: "Gặp <code>(</code> thì đi lên, gặp <code>)</code> thì sang phải. Với <code>(()())</code>, ta đi từ (0, 0) đến (3, 3) và luôn có <code>y ≥ x</code>, đúng với điều kiện đếm ngoặc trên mỗi tiền tố.",
        en: "Move up for <code>(</code> and right for <code>)</code>. The path for <code>(()())</code> runs from (0, 0) to (3, 3) with <code>y ≥ x</code> throughout, exactly the prefix condition on the brackets.",
      },
      lines: [4], watch: { n: 3, end: "(3, 3)" }, verdict: "run", fit,
      scene: path(valid, 0, "", "( ↔ ↑      ) ↔ →", "y ≥ x"),
    },
    {
      title: { vi: "Đếm mọi đường đi", en: "Count all paths" }, kind: "step",
      body: {
        vi: "Mỗi đường tới (3, 3) có 3 bước lên và 3 bước sang phải. Chọn 3 vị trí trong 6 cho các bước lên, ta có <code>C(6, 3) = 20</code> đường, kể cả những đường xuống dưới đường chéo.",
        en: "Every path to (3, 3) has 3 up steps and 3 right steps. Choosing 3 of the 6 positions for up steps gives <code>C(6, 3) = 20</code> paths, including those that dip below the diagonal.",
      },
      lines: [5, 6, 7], watch: { n: 3, end: "(3, 3)", all: 20 }, verdict: "run", fit,
      scene: path(valid, 0, "", "6! / (3!·3!) = 20"),
    },
    {
      title: { vi: "Tìm lần vượt đầu", en: "Find the first crossing" }, kind: "step",
      body: {
        vi: "Đường của <code>())(()</code> lần đầu xuống dưới đường chéo sau 3 bước, tại (2, 1). Tiền tố <code>())</code> có nhiều hơn đúng 1 bước sang phải so với số bước lên.",
        en: "The path for <code>())(()</code> first dips below the diagonal after 3 steps, at (2, 1). Its prefix <code>())</code> has exactly one more right step than up step.",
      },
      lines: [], watch: { n: 3, end: "(3, 3)", all: 20 }, verdict: "run", fit,
      scene: path(bad, crossedAt, "is-bad", "()) → (2, 1)", "x − y = 2 − 1 = 1"),
    },
    {
      title: { vi: "Phản xạ tiền tố", en: "Reflect the prefix" }, kind: "step",
      body: {
        vi: "Hoán đổi bước lên và bước sang phải trong 3 bước đầu. Tiền tố mới đến (1, 2) và cả đường kết thúc ở (2, 4) vì các bước sau giữ nguyên. Mọi đường đến (2, 4) đều có lần đầu chạm <code>y = x + 1</code>; phản xạ tới đó khôi phục đúng một đường phạm luật.",
        en: "Swap up and right in the first 3 steps. The new prefix ends at (1, 2) and the full path ends at (2, 4) because the later steps stay the same. Every path to (2, 4) first hits <code>y = x + 1</code> somewhere. Reflecting through that hit recovers exactly one invalid path.",
      },
      lines: [], watch: { n: 3, end: "(2, 4)", all: 20 }, verdict: "run", fit,
      scene: path(reflected, crossedAt, "is-active", "(2, 1) → (1, 2)", "(3 − 1, 3 + 1) = (2, 4)"),
    },
    {
      title: { vi: "Lấy hiệu hai số", en: "Subtract the two counts" }, kind: "answer",
      body: {
        vi: "Đường phản xạ có 4 bước lên trong 6 bước, nên có <code>C(6, 4) = 15</code> đường phạm luật. Còn <code>20 − 15 = 5</code> đường hợp lệ, tương ứng 5 dãy ngoặc đúng.",
        en: "A reflected path has 4 up steps in 6 positions, so there are <code>C(6, 4) = 15</code> invalid paths. That leaves <code>20 − 15 = 5</code> valid paths, one for each valid bracket sequence.",
      },
      lines: [5, 6, 7, 14], watch: { n: 3, end: "(3, 3)", all: 20, bad: 15, answer: 5 },
      verdict: "ac", fit, scene: path(valid, 0, "", "6! / (4!·2!) = 15", "20 − 15 = 5", true),
    },
    {
      title: { vi: "Tính số Catalan", en: "Compute the Catalan number" }, kind: "recap",
      body: {
        vi: "Với n cặp, hai số đếm cho <code>Cₙ = C(2n,n) − C(2n,n+1) = C(2n,n)/(n+1)</code>. Với <code>2n &lt; MOD</code> và MOD là số nguyên tố lẻ, mẫu số <code>n!·(n+1)</code> có nghịch đảo modulo. Tính tích rồi lũy thừa nhanh tốn O(n + log MOD) thời gian và O(1) bộ nhớ.",
        en: "For n pairs, the two counts give <code>Cₙ = C(2n,n) − C(2n,n+1) = C(2n,n)/(n+1)</code>. With <code>2n &lt; MOD</code> and MOD an odd prime, the denominator <code>n!·(n+1)</code> has a modular inverse. The products and binary exponentiation take O(n + log MOD) time and O(1) space.",
      },
      lines: [5, 6, 7, 9, 10, 11, 12, 14], watch: { n: 3, all: 20, bad: 15, answer: 5 },
      verdict: "ac", fit, scene: path(valid, 0, "", "C(6, 3) / (3 + 1)", "20 / 4 = 5", true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (let x = 0; x <= 3; x++) {
    scene.add(`v-start${x}`, { x, o: 0 });
    scene.add(`v-end${x}`, { x, y: -8, o: 0 });
    scene.link(`grid-x${x}`, { from: `v-start${x}`, to: `v-end${x}`, anchor: "center", bend: 0, p: 1, o: 0.23 });
  }
  for (let y = 0; y <= 4; y++) {
    scene.add(`h-start${y}`, { y: -2 * y, o: 0 });
    scene.add(`h-end${y}`, { x: 3, y: -2 * y, o: 0 });
    scene.link(`grid-y${y}`, { from: `h-start${y}`, to: `h-end${y}`, anchor: "center", bend: 0, p: 1, o: 0.23 });
  }
  scene.link("diagonal", { from: "v-start0", to: "h-end3", anchor: "center", bend: 0, p: 1, o: 0.65 });
  scene.add("diagonal-label", { shape: shapes.pill({ text: "y = x", h: 24, pad: 7 }), x: 4, y: -6.1 });
  for (let i = 0; i < nodes.length; i++) {
    scene.add(nodes[i], { shape: shapes.block({ w: 22, h: 20, depth: 2, r: 7 }), z: -0.3, o: 0 });
    if (i > 0) scene.link(`edge${i}`, { from: nodes[i - 1], to: nodes[i], anchor: "center", bend: 0 });
  }
  scene.add("calc", { shape: shapes.pill(), x: 2, y: 1.95, o: 0 });
  scene.add("result", { shape: shapes.pill(), x: 2, y: 3.45, o: 0 });
}
