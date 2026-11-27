import type { Lesson, SceneMap } from "../../../lib/types";

const M = [[1, 1], [1, 0]];
const I = [[1, 0], [0, 1]];
const state = [[1], [0]];
const slots = [0, 1, 2];
const panelX = (slot: number) => (slot - 1) * 2.6;
const rows = [0, 1];

function multiply(a: number[][], b: number[][]) {
  return a.map((row) => b[0].map((_, j) => row[0] * b[0][j] + row[1] * b[1][j]));
}

const first = multiply(M, state);
const square = multiply(M, M);
const fourth = multiply(square, square);
const fifth = multiply(M, fourth);

interface Panel {
  name: string;
  values: number[][];
}

function picture(a: Panel, b?: Panel, product?: Panel, focus = -1, footer = "", answer = false): SceneMap {
  const scene: SceneMap = {
    times: { o: b ? 1 : 0 },
    equals: { o: product ? 1 : 0 },
    footer: { text: footer, o: footer ? 1 : 0, cls: answer ? "v-eq" : "" },
  };
  [a, b, product].forEach((panel, slot) => {
    const x = b ? panelX(slot) : 0;
    const vector = panel?.values[0].length === 1;
    scene[`head${slot}`] = { text: panel?.name ?? "", o: panel ? 1 : 0, x };
    for (const i of rows) {
      for (const j of rows) {
        const value = panel?.values[i][j];
        const inRow = i === (focus >> 1);
        const inColumn = j === (focus & 1);
        const input = focus >= 0 && (slot === 0 ? inRow : slot === 1 && inColumn);
        const output = focus >= 0 && slot === 2 && inRow && inColumn;
        scene[`mat${slot}-${i}-${j}`] = {
          text: value === undefined ? "" : String(value),
          o: value === undefined ? 0 : 1,
          x: x + (vector ? 0 : (j - 0.5) * 0.85),
          cls: output ? "is-good" : input ? "is-active" : "",
          ...(output ? { fx: { type: "pulse", delay: 340 } } : {}),
        };
      }
    }
  });
  for (const i of rows) {
    for (const j of rows) {
      const value = product?.values[i][j];
      const text = b && value !== undefined
        ? `${a.values[i][0]}×${b.values[0][j]} + ${a.values[i][1]}×${b.values[1][j]} = ${value}`
        : "";
      scene[`f${i}-${j}`] = {
        text, o: text ? 1 : 0, cls: i * 2 + j === focus ? "v-eq" : "",
        x: product?.values[0].length === 1 ? 0 : (j - 0.5) * 3.4,
      };
    }
  }
  return scene;
}

const base = { name: "M", values: M };
const identity = { name: "I", values: I };
const m2 = { name: "M²", values: square };
const m4 = { name: "M⁴", values: fourth };
const m5 = { name: "M⁵", values: fifth };

export const lesson: Lesson = {
  track: "cp", topic: "math-adv", slug: "matrix-power",
  title: { vi: "Luỹ thừa ma trận", en: "Matrix exponentiation" },
  added: "2026-11-27", level: "hard", minutes: 10,
  summary: {
    vi: "Viết bước chuyển Fibonacci thành ma trận 2 × 2 rồi dùng lũy thừa nhị phân để nhảy nhiều bước.",
    en: "Write the Fibonacci transition as a 2 × 2 matrix and use binary exponentiation to jump ahead.",
  },
  time: "O(log n)", memory: "O(1)",
  goal: {
    vi: "Tính <b>F₅</b> với <b>F₀ = 0, F₁ = 1</b>",
    en: "Compute <b>F₅</b> given <b>F₀ = 0, F₁ = 1</b>",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">using</span> Mat = array&lt;array&lt;<span class="kw">long long</span>, 2&gt;, 2&gt;;',
    '<span class="kw">constexpr long long</span> MOD = 1000000007;',
    'Mat mul(Mat a, Mat b) {',
    '  Mat c{};',
    '  <span class="kw">for</span> (<span class="kw">int</span> i=0; i&lt;2; ++i) <span class="kw">for</span> (<span class="kw">int</span> j=0; j&lt;2; ++j)',
    '    c[i][j] = (a[i][0]*b[0][j] + a[i][1]*b[1][j]) % MOD;',
    '  <span class="kw">return</span> c;',
    '}',
    '<span class="kw">long long</span> fib(<span class="kw">long long</span> n) {',
    '  Mat r{{{1,0},{0,1}}}, m{{{1,1},{1,0}}};',
    '  <span class="kw">while</span> (n) {',
    '    <span class="kw">if</span> (n &amp; 1) r = mul(r,m);',
    '    n &gt;&gt;= 1;',
    '    <span class="kw">if</span> (n) m = mul(m,m);',
    '  }',
    '  <span class="kw">return</span> r[0][1];',
    '}',
  ],
  watch: [
    { key: "n", label: "n" },
    { key: "bit", label: { vi: "bit vừa xét", en: "bit processed" } },
    { key: "r", label: "r" },
    { key: "m", label: "m" },
    { key: "answer", label: "F₅" },
  ],
  practice: [
    { src: "CSES 1722", name: "Fibonacci Numbers", lv: "★★☆", url: "https://cses.fi/problemset/task/1722" },
    { src: "CSES 1096", name: "Throwing Dice", lv: "★★★", url: "https://cses.fi/problemset/task/1096" },
  ],
  sceneOptions: { unit: 42 },
  legend: [
    { cls: "acc", label: { vi: "hàng và cột đang nhân", en: "row and column in use" } },
    { cls: "ac", label: { vi: "ô tích đang đọc", en: "product entry in focus" } },
  ],
  steps: [
    {
      title: { vi: "Tìm số Fibonacci", en: "Find a Fibonacci number" }, kind: "problem",
      body: {
        vi: "Từ <code>F₀ = 0, F₁ = 1</code>, ta muốn tính <code>F₅</code> theo quy luật <code>Fₙ₊₁ = Fₙ + Fₙ₋₁</code>. Dùng vòng lặp phải tính lần lượt tới n, tốn O(n) thời gian.",
        en: "Starting from <code>F₀ = 0, F₁ = 1</code>, compute <code>F₅</code> using <code>Fₙ₊₁ = Fₙ + Fₙ₋₁</code>. Iterating through the sequence takes O(n) time.",
      },
      lines: [], watch: { n: 5 }, verdict: "run", fit: "all",
      scene: picture({ name: "v₀", values: state }, undefined, undefined, -1, "v₀ = [F₁, F₀]ᵀ"),
    },
    {
      title: { vi: "Gói một bước chuyển", en: "Encode one transition" }, kind: "concept",
      body: {
        vi: "Đặt <code>vᵢ = [Fᵢ₊₁, Fᵢ]ᵀ</code>. Hàng đầu của M cộng hai số, hàng dưới chép lại số đầu, nên <code>Mvᵢ = vᵢ₊₁</code>. Nhân với v₀ cho <code>v₁ = [1, 1]ᵀ</code>; nhân 5 lần sẽ cho <code>v₅</code>, với F₅ ở dưới.",
        en: "Define <code>vᵢ = [Fᵢ₊₁, Fᵢ]ᵀ</code>. The top row of M adds the two entries and the bottom row copies the first, so <code>Mvᵢ = vᵢ₊₁</code>. Applying M to v₀ gives <code>v₁ = [1, 1]ᵀ</code>. Five applications give <code>v₅</code>, with F₅ on the bottom.",
      },
      lines: [5, 6, 10], watch: { n: 5, m: "M" }, verdict: "run", fit: "all",
      scene: picture(base, { name: "v₀", values: state }, { name: "v₁", values: first }, 0, "Mv₀ = v₁"),
    },
    {
      title: { vi: "Lấy bit thấp nhất", en: "Use the lowest bit" }, kind: "step",
      body: {
        vi: "Khởi tạo <code>r = I</code> và <code>m = M</code>. Số mũ <code>5 = 101₂</code> có bit cuối bằng 1, nên nhân <code>r = I × M = M</code>. Ô trên trái của tích bằng <code>1×1 + 0×1 = 1</code>.",
        en: "Start with <code>r = I</code> and <code>m = M</code>. The low bit of <code>5 = 101₂</code> is 1, so multiply <code>r = I × M = M</code>. The top-left entry is <code>1×1 + 0×1 = 1</code>.",
      },
      lines: [5, 6, 10, 11, 12], watch: { n: 5, bit: 1, r: "M", m: "M" }, verdict: "run", fit: "all",
      scene: picture(identity, base, base, 0, "101₂ & 1 = 1"),
    },
    {
      title: { vi: "Bình phương ma trận", en: "Square the matrix" }, kind: "step",
      body: {
        vi: "Dịch <code>n</code> từ 5 xuống 2 và bình phương <code>m</code> để sang trọng số bit tiếp theo. Hàng đầu và cột đầu của M đều là (1, 1), nên ô trên trái của <code>M²</code> bằng <code>1×1 + 1×1 = 2</code>.",
        en: "Shift <code>n</code> from 5 to 2 and square <code>m</code> to match the next bit's weight. The first row and first column of M are both (1, 1), so the top-left entry of <code>M²</code> is <code>1×1 + 1×1 = 2</code>.",
      },
      lines: [5, 6, 13, 14], watch: { n: 2, r: "M", m: "M²" }, verdict: "run", fit: "all",
      scene: picture(base, base, m2, 0, "101₂ ≫ 1 = 10₂"),
    },
    {
      title: { vi: "Bỏ qua bit 0", en: "Skip the zero bit" }, kind: "step",
      body: {
        vi: "Bit cuối của <code>10₂</code> bằng 0 nên <code>r</code> vẫn là M. Dịch <code>n</code> từ 2 xuống 1 rồi bình phương <code>M²</code> thành <code>M⁴</code>. Ô trên trái tăng thành <code>2×2 + 1×1 = 5</code>.",
        en: "The low bit of <code>10₂</code> is 0, so <code>r</code> stays M. Shift <code>n</code> from 2 to 1 and square <code>M²</code> to obtain <code>M⁴</code>. Its top-left entry becomes <code>2×2 + 1×1 = 5</code>.",
      },
      lines: [5, 6, 12, 13, 14], watch: { n: 1, bit: 0, r: "M", m: "M⁴" }, verdict: "run", fit: "all",
      scene: picture(m2, m2, m4, 0, "10₂ ≫ 1 = 1₂"),
    },
    {
      title: { vi: "Đọc ô Fibonacci", en: "Read the Fibonacci entry" }, kind: "answer",
      body: {
        vi: "Bit cuối còn lại là 1, nên <code>r = M × M⁴ = M⁵</code>. Cột đầu của <code>r</code> là <code>v₅</code> vì <code>v₀ = [1, 0]ᵀ</code>. Do <code>r</code> đối xứng, <code>r[0][1] = r[1][0] = F₅ = 5</code>.",
        en: "The last bit is 1, so <code>r = M × M⁴ = M⁵</code>. The first column of <code>r</code> is <code>v₅</code> because <code>v₀ = [1, 0]ᵀ</code>. Since <code>r</code> is symmetric, <code>r[0][1] = r[1][0] = F₅ = 5</code>.",
      },
      lines: [5, 6, 12, 13, 16], watch: { n: 0, bit: 1, r: "M⁵", answer: 5 }, verdict: "ac", fit: "all",
      scene: picture(base, m4, m5, 1, "F₅ = r[0][1] = 5", true),
    },
    {
      title: { vi: "Ghép các lũy thừa", en: "Combine the powers" }, kind: "recap",
      body: {
        vi: "Đầu mỗi vòng, <code>r × mⁿ</code> vẫn bằng lũy thừa cần tìm: nếu n lẻ, đưa một thừa số m sang r, rồi dùng <code>m²</code> với số mũ đã chia đôi. Với <code>5 = 1 + 4</code>, r nhận đúng <code>M</code> và <code>M⁴</code>. Mỗi bit tốn một số phép nhân ma trận 2 × 2 cố định, cho O(log n) thời gian và O(1) bộ nhớ.",
        en: "At the start of each loop, <code>r × mⁿ</code> is still the target power. For odd n, move one factor of m into r, then use <code>m²</code> with the halved exponent. For <code>5 = 1 + 4</code>, r picks up <code>M</code> and <code>M⁴</code>. Each bit takes a constant number of 2 × 2 matrix products, giving O(log n) time and O(1) space.",
      },
      lines: [11, 12, 13, 14, 16], watch: { n: 0, r: "M⁵", answer: 5 }, verdict: "ac", fit: "all",
      scene: picture(base, m4, m5, 1, "M¹ × M⁴ = M⁵", true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const slot of slots) {
    const x = panelX(slot);
    scene.add(`head${slot}`, { shape: shapes.pill({ h: 23, pad: 8 }), x, o: 0 });
    for (const i of rows) {
      for (const j of rows) {
        scene.add(`mat${slot}-${i}-${j}`, {
          shape: shapes.block({ w: 32, h: 28, r: 6, depth: 3 }),
          x: x + (j - 0.5) * 0.85, y: 1.85 + 1.65 * i, o: 0,
        });
      }
    }
  }
  scene.add("times", { shape: shapes.pill({ text: "×", h: 20, pad: 5 }), x: -1.3, y: 2.1, o: 0 });
  scene.add("equals", { shape: shapes.pill({ text: "=", h: 20, pad: 5 }), x: 1.3, y: 2.1, o: 0 });
  for (const i of rows) {
    for (const j of rows) {
      scene.add(`f${i}-${j}`, {
        shape: shapes.pill({ h: 25, pad: 7 }),
        y: 5.15 + 1.45 * i, o: 0,
      });
    }
  }
  scene.add("footer", { shape: shapes.pill(), y: 8.1, o: 0 });
}
