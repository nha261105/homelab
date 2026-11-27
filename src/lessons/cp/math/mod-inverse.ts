import type { Lesson, SceneMap } from "../../../lib/types";

const P = 11;
const A = 3;
const X = 7;
const rows = ["e", "b", "r"] as const;
const trace = [{ e: P - 2, b: A, r: 1 }];
while (trace[trace.length - 1].e > 0) {
  const { e, b, r } = trace[trace.length - 1];
  trace.push({ e: Math.floor(e / 2), b: b * b % P, r: e % 2 === 1 ? r * b % P : r });
}

const inverse = trace[trace.length - 1].r;
const quotient = X * inverse % P;
const U = 56;
const cell = (row: string, i: number) => `${row}${i}`;

function picture(last: number, formulas: string[], answer = false): SceneMap {
  const scene: SceneMap = {};
  trace.forEach((state, i) => {
    rows.forEach((row) => {
      const ready = i <= last;
      scene[cell(row, i)] = {
        text: ready ? String(state[row]) : "?",
        o: ready ? 1 : 0.38,
        cls: !ready ? "is-out" : answer && row === "r" && i === last ? "is-good"
          : !answer && (i === last || i === last - 1) ? "is-active" : "",
        ...(i === last && last > 0 && !answer
          ? { from: { o: 0, z: 0.32 }, dur: 400, delay: 260, ease: "drop", land: true }
          : {}),
      };
    });
  });
  for (let i = 0; i < rows.length; ++i) {
    const formula = formulas[i] ?? "";
    scene[`formula${i}`] = { text: formula, o: formula ? 1 : 0, cls: answer ? "v-eq" : "", delay: 0, dur: 300 };
  }
  return scene;
}

function iteration(i: number): SceneMap {
  const { e, b, r } = trace[i - 1];
  const next = trace[i];
  return picture(i, [
    e % 2 ? `r: (${r} × ${b}) mod 11 = ${next.r}` : `r: ${r} → ${next.r}`,
    `b: ${b}² mod 11 = ${next.b}`,
    `e: ⌊${e}/2⌋ = ${next.e}`,
  ]);
}

const fit = [
  "label-e", "label-b", "label-r", "e4", "r4", "formula0", "formula2",
];
const result = [
  `(3 × ${inverse}) mod 11 = 1`,
  `(7 × ${inverse}) mod 11 = ${quotient}`,
  `(3 × ${quotient}) mod 11 = 7`,
];

export const lesson: Lesson = {
  track: "cp",
  topic: "math",
  slug: "mod-inverse",
  title: { vi: "Nghịch đảo modulo", en: "Modular inverse" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng định lý Fermat nhỏ và lũy thừa nhanh để chia theo modulo nguyên tố.",
    en: "Use Fermat’s little theorem and fast exponentiation to divide modulo a prime.",
  },
  level: "medium",
  minutes: 8,
  time: "O(log p)",
  memory: "O(1)",
  goal: { vi: "Tìm <b>7 ÷ 3</b> theo modulo 11", en: "Find <b>7 ÷ 3</b> modulo 11" },
  codeLang: "C++17",
  code: [
    '<span class="kw">long long</span> modPow(<span class="kw">long long</span> b, <span class="kw">int</span> e, <span class="kw">int</span> p) {',
    '  <span class="kw">long long</span> r = 1;',
    '  <span class="kw">while</span> (e &gt; 0) {',
    '    <span class="kw">if</span> (e % 2 == 1) r = r * b % p;',
    '    b = b * b % p;',
    '    e /= 2;',
    '  }',
    '  <span class="kw">return</span> r;',
    '}',
    '<span class="kw">long long</span> divide(<span class="kw">long long</span> x, <span class="kw">long long</span> a, <span class="kw">int</span> p) {',
    '  <span class="kw">long long</span> inv = modPow(a, p - 2, p);',
    '  <span class="kw">return</span> x * inv % p;',
    '}',
  ],
  watch: [
    { key: "e", label: "e" }, { key: "b", label: "b" }, { key: "r", label: "r" },
    { key: "inv", label: "inv" }, { key: "q", label: { vi: "thương", en: "quotient" } },
  ],
  practice: [
    { src: "CSES 1712", name: "Exponentiation II", lv: "★★☆", url: "https://cses.fi/problemset/task/1712" },
    { src: "CSES 2182", name: "Divisor Analysis", lv: "★★★", url: "https://cses.fi/problemset/task/2182" },
  ],
  sceneOptions: { unit: U },
  legend: [
    { cls: "acc", label: { vi: "lượt đang tính", en: "current iteration" } },
    { cls: "ac", label: { vi: "nghịch đảo tìm được", en: "computed inverse" } },
  ],
  steps: [
    {
      title: { vi: "Chia theo modulo", en: "Divide modulo a prime" }, kind: "problem",
      body: {
        vi: "Tính <code>7 ÷ 3</code> theo modulo 11 nghĩa là tìm số dư <code>q</code> sao cho <code>3 · q ≡ 7 (mod 11)</code>. Thử từ 0 đến 10 thì được, nhưng với modulo <code>p</code> lớn, cách này có thể tốn O(p) lượt.",
        en: "To divide <code>7 ÷ 3</code> modulo 11, find the residue <code>q</code> with <code>3 · q ≡ 7 (mod 11)</code>. We could try 0 through 10, but for a large modulus <code>p</code> this can take O(p) trials.",
      },
      lines: [], watch: {}, verdict: "run", fit,
      scene: picture(-1, ["3 × ? ≡ 7 (mod 11)"]),
    },
    {
      title: { vi: "Dùng định lý Fermat", en: "Apply Fermat’s theorem" }, kind: "concept",
      body: {
        vi: "Vì 11 là số nguyên tố và 3 không chia hết cho 11, định lý Fermat nhỏ cho <code>3¹⁰ ≡ 1 (mod 11)</code>. Tách <code>3¹⁰ = 3 · 3⁹</code> cho thấy nghịch đảo của 3 là <code>3⁹ mod 11</code>.",
        en: "Since 11 is prime and 3 is nonzero modulo 11, Fermat’s little theorem gives <code>3¹⁰ ≡ 1 (mod 11)</code>. Factoring <code>3¹⁰ = 3 · 3⁹</code> shows that <code>3⁹ mod 11</code> is the inverse of 3.",
      },
      lines: [1, 2, 11], watch: trace[0], verdict: "run", fit,
      scene: picture(0, ["e = 11 − 2 = 9", "b = 3", "r = 1"]),
    },
    {
      title: { vi: "Nhân khi mũ lẻ", en: "Multiply on odd exponents" }, kind: "step",
      body: {
        vi: "<code>e = 9</code> lẻ, nên nhân <code>r</code> với <code>b = 3</code> để được 3. Bình phương <code>b</code> theo modulo 11 rồi chia đôi mũ, bỏ phần lẻ, ta được <code>b = 9</code> và <code>e = 4</code>.",
        en: "<code>e = 9</code> is odd, so multiply <code>r</code> by <code>b = 3</code> to get 3. Square <code>b</code> modulo 11 and halve the exponent, rounding down, to get <code>b = 9</code> and <code>e = 4</code>.",
      },
      lines: [3, 4, 5, 6], watch: trace[1], verdict: "run", fit, scene: iteration(1),
    },
    {
      title: { vi: "Giữ tích khi mũ chẵn", en: "Keep the running product" }, kind: "step",
      body: {
        vi: "Với <code>e = 4</code> chẵn, giữ <code>r = 3</code>. Bình phương 9 cho số dư 4, còn mũ giảm từ 4 xuống 2.",
        en: "With the even exponent <code>e = 4</code>, keep <code>r = 3</code>. Squaring 9 gives a remainder of 4, and the exponent falls from 4 to 2.",
      },
      lines: [3, 4, 5, 6], watch: trace[2], verdict: "run", fit, scene: iteration(2),
    },
    {
      title: { vi: "Đưa mũ về một", en: "Reduce the exponent to one" }, kind: "step",
      body: {
        vi: "<code>e = 2</code> vẫn chẵn, nên <code>r</code> vẫn là 3. Tính <code>4² mod 11 = 5</code> rồi giảm mũ xuống 1.",
        en: "<code>e = 2</code> is still even, so <code>r</code> stays at 3. Compute <code>4² mod 11 = 5</code> and reduce the exponent to 1.",
      },
      lines: [3, 4, 5, 6], watch: trace[3], verdict: "run", fit, scene: iteration(3),
    },
    {
      title: { vi: "Lấy nghịch đảo", en: "Read the inverse" }, kind: "step",
      body: {
        vi: "Lượt cuối có <code>e = 1</code> lẻ, nên <code>r = 3 · 5 mod 11 = 4</code>. Vòng lặp dừng ở <code>e = 0</code> và trả về 4.",
        en: "The final exponent <code>e = 1</code> is odd, so <code>r = 3 · 5 mod 11 = 4</code>. The loop stops at <code>e = 0</code> and returns 4.",
      },
      lines: [3, 4, 5, 6, 8], watch: { ...trace[4], inv: inverse }, verdict: "run", fit, scene: iteration(4),
    },
    {
      title: { vi: "Nhân với nghịch đảo", en: "Multiply by the inverse" }, kind: "answer",
      body: {
        vi: "<code>3 · 4 ≡ 1 (mod 11)</code>, nên chia cho 3 là nhân với 4. Ta được <code>7 · 4 mod 11 = 6</code>, và kiểm tra lại <code>3 · 6 mod 11 = 7</code>.",
        en: "<code>3 · 4 ≡ 1 (mod 11)</code>, so division by 3 is multiplication by 4. This gives <code>7 · 4 mod 11 = 6</code>, and <code>3 · 6 mod 11 = 7</code> verifies it.",
      },
      lines: [11, 12], watch: { inv: inverse, q: quotient }, verdict: "ac", fit,
      scene: picture(4, result, true),
    },
    {
      title: { vi: "Điều kiện áp dụng", en: "When Fermat applies" }, kind: "recap",
      body: {
        vi: "Với số nguyên tố <code>p</code> và các số dư <code>0 ≤ x &lt; p</code>, <code>0 &lt; a &lt; p</code>, phép chia dùng <code>x · a^(p−2) mod p</code>. Số dư 0 không có nghịch đảo. Mỗi lượt chia đôi <code>e</code>, nên cần O(log p) thời gian và O(1) bộ nhớ.",
        en: "For prime <code>p</code> and residues <code>0 ≤ x &lt; p</code>, <code>0 &lt; a &lt; p</code>, division uses <code>x · a^(p−2) mod p</code>. The zero residue has no inverse. Halving <code>e</code> each iteration costs O(log p) time and O(1) space.",
      },
      lines: [6, 11, 12], watch: { inv: inverse, q: quotient }, verdict: "ac", fit,
      scene: picture(4, result, true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  rows.forEach((row, j) => {
    const y = j * 1.65;
    scene.add(`label-${row}`, { shape: shapes.pill({ text: row }), x: 0, y: y - 0.08 });
    trace.forEach((_, i) => {
      scene.add(cell(row, i), {
        shape: shapes.block({ label: "?", w: 44, h: 34, depth: 4 }),
        x: i + 0.85, y, o: 0.38,
      });
    });
  });
  rows.forEach((_, i) => {
    scene.add(`formula${i}`, { shape: shapes.pill(), x: 2.48, y: 4.65 + 1.04 * i, o: 0 });
  });
}
