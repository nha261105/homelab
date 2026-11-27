import type { Lesson, SceneMap } from "../../../lib/types";

const COEFF = [["1", "1", "0", "0"], ["1", "2", "0", "0"]];
const ROOTS = ["1", "i", "−1", "−i"];
const A = ["2", "1+i", "0", "1−i"];
const B = ["3", "1+2i", "−1", "1−2i"];
const C = ["6", "−1+3i", "0", "−1−3i"];
const PRODUCT = ["1", "3", "2", "0"];
const ROWS = ["axis", "a", "b", "c", "coef"] as const;

function picture(stage: number, first = "", second = "", focus = -1): SceneMap {
  const pointMode = stage >= 2;
  const rows = [
    { label: pointMode ? "zⱼ" : "k", values: pointMode ? ROOTS : ["0", "1", "2", "3"], y: 0, visible: true },
    { label: pointMode ? "A(zⱼ)" : "aₖ", values: pointMode ? A : COEFF[0], y: 1.45, visible: stage < 5 },
    { label: pointMode ? "B(zⱼ)" : "bₖ", values: pointMode ? B : COEFF[1], y: 2.9, visible: stage < 5 && stage !== 2 },
    { label: "C(zⱼ)", values: C, y: stage < 5 ? 4.35 : 1.45, visible: stage >= 4 },
    { label: "cₖ", values: stage === 5 ? ["1", "3", "?", "?"] : PRODUCT, y: 2.9, visible: stage >= 5 },
  ];
  const formulaY = stage === 2 ? 2.75 : stage === 4 ? 5.65 : 4.2;
  const scene: SceneMap = {
    formula: { text: first, y: formulaY, o: first ? 1 : 0 },
    detail: { text: second, y: formulaY + 0.9, o: second ? 1 : 0 },
  };
  rows.forEach(({ label, values, y, visible }, i) => {
    const row = ROWS[i];
    scene[row] = { text: label, y, o: visible ? 1 : 0 };
    values.forEach((value, j) => {
      const paired = stage === 2 && j === 3;
      const active = (j === focus || paired) && stage >= 2 && stage <= 4;
      const coef = row === "coef" && value !== "?";
      scene[`${row}${j}`] = {
        text: value, y, o: visible && (stage !== 0 || j < 2) ? 1 : 0,
        cls: coef || (row === "c" && active) ? "is-good" : active ? "is-active" : value === "?" ? "is-out" : "",
      };
    });
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "math-adv", slug: "fft",
  title: { vi: "FFT: nhân đa thức", en: "FFT polynomial multiplication" },
  added: "2026-11-27",
  summary: {
    vi: "Đổi hệ số thành giá trị tại các căn đơn vị, nhân từng điểm rồi lấy lại hệ số.",
    en: "Convert coefficients to values at roots of unity, multiply pointwise, then recover the coefficients.",
  },
  level: "hard", minutes: 12, time: "O(N log N)", memory: "O(N)",
  goal: { vi: "Tính <b>(1 + x)(1 + 2x)</b> bằng FFT tại 4 căn đơn vị", en: "Compute <b>(1 + x)(1 + 2x)</b> using FFT at 4 roots of unity" },
  codeLang: "C++17",
  code: [
    '<span class="kw">using</span> Z = complex&lt;<span class="kw">double</span>&gt;;',
    '<span class="kw">void</span> fft(vector&lt;Z&gt;&amp; a, <span class="kw">bool</span> inv) {',
    '  <span class="kw">int</span> n = a.size(), h = n / 2; <span class="kw">if</span> (n == 1) <span class="kw">return</span>;',
    '  vector&lt;Z&gt; e(h), o(h);',
    '  <span class="kw">for</span> (<span class="kw">int</span> j = 0; j &lt; h; ++j) { e[j] = a[2*j]; o[j] = a[2*j+1]; }',
    '  fft(e, inv); fft(o, inv);',
    '  Z w = 1, root = polar(1., (inv ? -2 : 2) * acos(-1.) / n);',
    '  <span class="kw">for</span> (<span class="kw">int</span> j = 0; j &lt; h; ++j, w *= root) {',
    '    a[j] = e[j] + w * o[j]; a[j+h] = e[j] - w * o[j];',
    '    <span class="kw">if</span> (inv) { a[j] /= 2; a[j+h] /= 2; }',
    '  }',
    '}',
    '<span class="kw">int</span> len = a.size() + b.size() - 1, N = 1; <span class="cm">// vectors of Z</span>',
    '<span class="kw">while</span> (N &lt; len) N *= 2;',
    'a.resize(N); b.resize(N); fft(a, false); fft(b, false);',
    '<span class="kw">for</span> (<span class="kw">int</span> j = 0; j &lt; N; ++j) a[j] *= b[j];',
    'fft(a, true);',
    '<span class="kw">for</span> (<span class="kw">int</span> k = 0; k &lt; len; ++k) ans.push_back(llround(a[k].real()));',
  ],
  watch: [{ key: "N", label: "N" }, { key: "root", label: "zⱼ" }, { key: "A", label: "A(zⱼ)" }, { key: "B", label: "B(zⱼ)" }, { key: "C", label: "C(zⱼ)" }, { key: "coefs", label: "cₖ" }],
  practice: [
    { src: "SPOJ POLYMUL", name: "Polynomial Multiplication", lv: "★★☆", url: "https://www.spoj.com/problems/POLYMUL/" },
    { src: "CSES 2111", name: "Apples and Bananas", lv: "★★★", url: "https://cses.fi/problemset/task/2111" },
  ],
  sceneOptions: { unit: 55 },
  legend: [
    { cls: "acc", label: { vi: "cột đang tính", en: "column in use" } },
    { cls: "ac", label: { vi: "giá trị tích hoặc hệ số đã tìm", en: "product value or recovered coefficient" } },
  ],
  steps: [
    {
      title: { vi: "Nhân hai đa thức", en: "Multiply two polynomials" }, kind: "problem",
      body: {
        vi: "Cho <code>A(x) = 1 + x</code> và <code>B(x) = 1 + 2x</code>. Nhân từng cặp hệ số cần 4 phép nhân ở ví dụ này, và O(nm) với hai dãy dài n và m. FFT đổi cách biểu diễn để bước nhân trở thành phép nhân từng điểm.",
        en: "Let <code>A(x) = 1 + x</code> and <code>B(x) = 1 + 2x</code>. Multiplying all coefficient pairs takes 4 multiplications here and O(nm) with sequences of lengths n and m. FFT changes the representation so multiplication becomes pointwise.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(0),
    },
    {
      title: { vi: "Đệm đến độ dài 4", en: "Pad to length four" }, kind: "concept",
      body: {
        vi: "Tích có bậc tối đa 2, nên cần ít nhất 3 ô hệ số. FFT chia đôi liên tiếp, vì vậy ta chọn lũy thừa của 2 nhỏ nhất đủ chỗ là <code>N = 4</code>. Hai số 0 ở cuối mỗi hàng là phần đệm.",
        en: "The product has degree at most 2, so it needs at least 3 coefficient slots. FFT repeatedly halves the length, so choose the smallest sufficient power of two, <code>N = 4</code>. Each row ends with two padding zeros.",
      },
      lines: [13, 14, 15], watch: { N: 4 }, verdict: "run", fit: "all", scene: picture(1, "len = 2 + 2 − 1 = 3", "N = 4 ≥ len"),
    },
    {
      title: { vi: "Tách chẵn và lẻ", en: "Split even and odd" }, kind: "step",
      body: {
        vi: "Ta dùng bốn điểm <code>1, i, −1, −i</code>, đều thỏa <code>z⁴ = 1</code>. Tách <code>A(z) = E(z²) + z·O(z²)</code> theo chỉ số hệ số chẵn và lẻ. Với A, hai nửa đều có hệ số <code>[1, 0]</code>, nên tại cặp <code>i, −i</code> ta dùng lại <code>E(−1) = O(−1) = 1</code>, chỉ đổi dấu số hạng lẻ.",
        en: "Use the four points <code>1, i, −1, −i</code>, all satisfying <code>z⁴ = 1</code>. Split <code>A(z) = E(z²) + z·O(z²)</code> by even and odd coefficient indices. Both halves of A have coefficients <code>[1, 0]</code>, so at <code>i, −i</code> we reuse <code>E(−1) = O(−1) = 1</code> and flip the odd term's sign.",
      },
      lines: [3, 4, 5, 6, 7, 8, 9], watch: { N: 4, root: "i", A: "1+i" }, verdict: "run", fit: "all",
      scene: picture(2, "A(i) = 1 + i·1 = 1+i", "A(−i) = 1 − i·1 = 1−i", 1),
    },
    {
      title: { vi: "Đọc hai hàng giá trị", en: "Read both value rows" }, kind: "step",
      body: {
        vi: "Với B, phần chẵn bằng 1 và phần lẻ bằng 2. Cùng công thức cho <code>B(i) = 1 + 2i</code> và <code>B(−i) = 1 − 2i</code>; thay <code>z = ±1</code> cho các cột còn lại của hai hàng.",
        en: "For B, the even part is 1 and the odd part is 2. The same formula gives <code>B(i) = 1 + 2i</code> and <code>B(−i) = 1 − 2i</code>; substituting <code>z = ±1</code> gives the remaining columns of both rows.",
      },
      lines: [7, 8, 9, 15], watch: { N: 4, root: "−1", A: 0, B: -1 }, verdict: "run", fit: "all",
      scene: picture(3, "A(±1) = 1 ± 1", "B(±1) = 1 ± 2", 2),
    },
    {
      title: { vi: "Nhân theo từng cột", en: "Multiply each column" }, kind: "step",
      body: {
        vi: "Hai giá trị cùng cột cho <code>C(z) = A(z)·B(z)</code>. Chẳng hạn tại i, <code>(1+i)(1+2i) = 1+3i+2i² = −1+3i</code>. Tại −i ta được số phức liên hợp <code>−1−3i</code>.",
        en: "The two values in a column give <code>C(z) = A(z)·B(z)</code>. At i, for example, <code>(1+i)(1+2i) = 1+3i+2i² = −1+3i</code>. At −i we get its complex conjugate, <code>−1−3i</code>.",
      },
      lines: [16], watch: { N: 4, root: "i", A: "1+i", B: "1+2i", C: "−1+3i" }, verdict: "run", fit: "all",
      scene: picture(4, "(1+i)(1+2i) = −1+3i", "2·3 = 6   ·   0·(−1) = 0", 1),
    },
    {
      title: { vi: "Đảo FFT để lấy hệ số", en: "Invert to recover coefficients" }, kind: "step",
      body: {
        vi: "Hệ số <code>cₖ = Σⱼ C(zⱼ)·zⱼ⁻ᵏ / 4</code>. Với k = 0, cộng thẳng bốn giá trị rồi chia 4. Với k = 1, nhân lần lượt với <code>1, −i, −1, i</code>; hai số hạng phức có tổng <code>(3+i) + (3−i) = 6</code>.",
        en: "The coefficient is <code>cₖ = Σⱼ C(zⱼ)·zⱼ⁻ᵏ / 4</code>. For k = 0, add the four values and divide by 4. For k = 1, multiply them by <code>1, −i, −1, i</code>; the two complex terms sum to <code>(3+i) + (3−i) = 6</code>.",
      },
      lines: [7, 9, 10, 17], watch: { N: 4, coefs: "1, 3" }, verdict: "run", fit: "all",
      scene: picture(5, "c₀ = (6 − 1 + 0 − 1)/4 = 1", "c₁ = (6 + 3 + 0 + 3)/4 = 3"),
    },
    {
      title: { vi: "Đọc đa thức tích", en: "Read the product" }, kind: "answer",
      body: {
        vi: "Với k = 2, hai cột phức đổi dấu và góp tổng 2. Với k = 3, chúng góp tổng −6. FFT ngược trả <code>[1, 3, 2, 0]</code>, bỏ ô đệm cuối được <code>C(x) = 1 + 3x + 2x²</code>.",
        en: "For k = 2, the complex columns change sign and contribute 2 in total. For k = 3, they contribute −6. The inverse gives <code>[1, 3, 2, 0]</code>; drop the final padding slot to get <code>C(x) = 1 + 3x + 2x²</code>.",
      },
      lines: [7, 9, 10, 17, 18], watch: { N: 4, coefs: "1, 3, 2, 0" }, verdict: "ac", fit: "all",
      scene: picture(6, "c₂ = (6 + 1 + 0 + 1)/4 = 2", "c₃ = (6 − 3 + 0 − 3)/4 = 0"),
    },
    {
      title: { vi: "Vì sao phép đảo đúng", en: "Why the inverse works" }, kind: "recap",
      body: {
        vi: "Trong tổng lấy <code>cₖ</code>, các lũy thừa của căn đơn vị triệt tiêu mọi bậc khác k, còn bậc k góp <code>N·cₖ</code>. Mỗi tầng FFT làm O(N) việc và có log₂N tầng, nên ba lượt FFT và bước nhân dùng O(N log N) thời gian, O(N) bộ nhớ. Với hệ số nguyên, chỉ làm tròn khi sai số đủ nhỏ.",
        en: "In the sum for <code>cₖ</code>, powers of the roots cancel every degree other than k, while degree k contributes <code>N·cₖ</code>. Each FFT layer does O(N) work across log₂N layers, so three transforms and the multiplication use O(N log N) time and O(N) memory. Round integer coefficients only when the numerical error is small enough.",
      },
      lines: [5, 6, 9, 10, 15, 16, 17, 18], watch: { N: 4, coefs: "1, 3, 2, 0" }, verdict: "ac", fit: "all",
      scene: picture(7, "C(x) = 1 + 3x + 2x²"),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  ROWS.forEach((row) => {
    scene.add(row, { shape: shapes.pill({ h: 24, pad: 6 }), x: -0.72 });
    for (let j = 0; j < ROOTS.length; j++) {
      scene.add(`${row}${j}`, { shape: shapes.block({ w: 57, h: 31, depth: 4 }), x: 0.4 + j * 1.18 });
    }
  });
  scene.add("formula", { shape: shapes.pill(), x: 1.5, o: 0 });
  scene.add("detail", { shape: shapes.pill(), x: 1.5, o: 0 });
}
