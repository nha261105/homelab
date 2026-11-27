import type { Lesson, SceneMap } from "../../../lib/types";

const MOD = 17;
const EXPONENT = 13;
const bits = EXPONENT.toString(2).split("").reverse().map(Number);
const powers: number[] = [3];
const products: number[] = [1];
for (const [i, bit] of bits.entries()) {
  const a = powers[i];
  const r = products[i];
  powers.push(a * a % MOD);
  products.push(bit ? r * a % MOD : r);
}

// The columns read as 1101₂. The loop fills them from right to left.
function table(processed: number, product = "", square = "", done = false): SceneMap {
  const scene: SceneMap = {
    product: { o: product ? 1 : 0, text: product, cls: done ? "v-eq" : "" },
    square: { o: square ? 1 : 0, text: square },
  };
  for (const [i, bit] of bits.entries()) {
    const current = i === processed - 1;
    scene[`bit${i}`] = { cls: done && bit ? "is-good" : current ? "is-active" : "" };
    scene[`a${i}`] = {
      text: processed >= 0 && i <= processed ? String(powers[i]) : "?",
      cls: current ? "is-active" : processed >= 0 && i <= processed ? "" : "is-out",
    };
    scene[`r${i}`] = {
      text: i < processed ? String(products[i + 1]) : "?",
      cls: current ? bit ? "is-good" : "is-active" : i < processed ? "" : "is-out",
    };
  }
  return scene;
}

const FIT = ["labelBit", "labelA", "labelR", "bit0", "r0", "product", "square"];

export const lesson: Lesson = {
  track: "cp",
  topic: "math",
  slug: "mod-pow",
  title: { vi: "Luỹ thừa nhanh & modulo", en: "Fast power and modulo" },
  added: "2026-11-27",
  summary: {
    vi: "Đọc số mũ theo từng bit, bình phương cơ số rồi lấy dư sau mỗi phép nhân.",
    en: "Read the exponent bit by bit, square the base, and reduce after each multiplication.",
  },
  level: "basic",
  minutes: 7,
  time: "O(log(e + 1))",
  memory: "O(1)",
  goal: { vi: "Tính <b>3¹³ mod 17</b> từ các bit của <b>13 = 1101₂</b>", en: "Compute <b>3¹³ mod 17</b> from the bits of <b>13 = 1101₂</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">long long</span> mod_pow(<span class="kw">long long</span> a, <span class="kw">long long</span> e, <span class="kw">int</span> m) {',
    '  a %= m;',
    '  <span class="kw">long long</span> r = 1 % m;',
    '  <span class="kw">while</span> (e &gt; 0) {',
    '    <span class="kw">if</span> (e &amp; 1) r = r * a % m;',
    '    a = a * a % m;',
    '    e &gt;&gt;= 1;',
    '  }',
    '  <span class="kw">return</span> r;',
    '}',
  ],
  watch: [
    { key: "e", label: "e" },
    { key: "bit", label: "e & 1" },
    { key: "a", label: "a" },
    { key: "r", label: { vi: "r sau khi xét bit", en: "r after the bit" } },
  ],
  practice: [
    { src: "CSES 1617", name: "Bit Strings", lv: "★☆☆", url: "https://cses.fi/problemset/task/1617" },
    { src: "CSES 1095", name: "Exponentiation", lv: "★★☆", url: "https://cses.fi/problemset/task/1095" },
  ],
  sceneOptions: { unit: 54, view: [-50, -100, 340, 330] },
  legend: [
    { cls: "acc", label: { vi: "bit hoặc giá trị đang xét", en: "current bit or value" } },
    { cls: "ac", label: { vi: "kết quả mới hoặc bit được chọn", en: "new result or selected bit" } },
    { cls: "dim", label: { vi: "chưa tính", en: "not computed yet" } },
  ],
  steps: [
    {
      title: { vi: "Tính lũy thừa theo modulo", en: "Compute a modular power" }, kind: "problem",
      body: {
        vi: "Ta cần tính <code>3¹³ mod 17</code>. Nhân lần lượt cần 13 phép nhân nếu bắt đầu từ 1, và nếu đợi đến cuối mới lấy dư thì lũy thừa có thể vượt giới hạn kiểu số.",
        en: "We want <code>3¹³ mod 17</code>. Multiplying one factor at a time takes 13 multiplications from 1, and waiting until the end to reduce can overflow the integer type.",
      },
      lines: [], watch: { e: 13 }, verdict: "run", fit: FIT,
      scene: table(-1, "13 = 8 + 4 + 1"),
    },
    {
      title: { vi: "Đọc bit từ phải", en: "Read from the right" }, kind: "concept",
      body: {
        vi: "Các cột ứng với trọng số 8, 4, 2, 1 của <code>1101₂</code>. Bắt đầu ở cột 1 với <code>a = 3</code> và <code>r = 1</code>. Hàng <code>a</code> chứa cơ số của từng lượt, hàng <code>r</code> ghi kết quả sau khi xử lý bit đó.",
        en: "The columns correspond to weights 8, 4, 2, and 1 in <code>1101₂</code>. Start at weight 1 with <code>a = 3</code> and <code>r = 1</code>. The <code>a</code> row holds each iteration's base, and the <code>r</code> row records the result after processing its bit.",
      },
      lines: [2, 3, 4], watch: { e: 13, a: 3, r: 1 }, verdict: "run", fit: FIT,
      scene: table(0, "r = 1 % 17 = 1", "a = 3 % 17 = 3"),
    },
    {
      title: { vi: "Lấy thừa số đầu", en: "Take the first factor" }, kind: "step",
      body: {
        vi: "Bit thấp nhất của 13 là 1, nên nhân <code>r</code> với 3 và lấy dư, được 3. Bình phương <code>a</code> ra 9 rồi dịch <code>e</code> sang phải, còn 6.",
        en: "The lowest bit of 13 is 1, so multiply <code>r</code> by 3 and reduce to get 3. Squaring <code>a</code> gives 9, and shifting <code>e</code> right leaves 6.",
      },
      lines: [5, 6, 7], watch: { e: 13, bit: 1, a: 3, r: 3 }, verdict: "run", fit: FIT,
      scene: table(1, "r = 1·3 % 17 = 3", "a = 3² % 17 = 9"),
    },
    {
      title: { vi: "Bỏ qua bit 0", en: "Skip the zero bit" }, kind: "step",
      body: {
        vi: "Với <code>e = 6</code>, bit thấp nhất là 0, nên giữ <code>r = 3</code>. Vẫn bình phương <code>a</code> và lấy dư, được <code>81 mod 17 = 13</code>, rồi dịch 6 thành 3.",
        en: "With <code>e = 6</code>, the lowest bit is 0, so <code>r</code> stays 3. Still square and reduce <code>a</code> to get <code>81 mod 17 = 13</code>, then shift 6 to 3.",
      },
      lines: [5, 6, 7], watch: { e: 6, bit: 0, a: 9, r: 3 }, verdict: "run", fit: FIT,
      scene: table(2, "r = 3", "a = 9² % 17 = 13"),
    },
    {
      title: { vi: "Nhân ở cột 4", en: "Multiply at weight 4" }, kind: "step",
      body: {
        vi: "Bit thấp nhất của <code>e = 3</code> là 1 và ứng với trọng số 4 của số mũ ban đầu. Tích <code>3·13 = 39</code> cho dư 5. Bình phương 13 cho dư 16, rồi dịch 3 thành 1.",
        en: "The lowest bit of <code>e = 3</code> is 1 and corresponds to weight 4 in the original exponent. The product <code>3·13 = 39</code> reduces to 5. Square 13 to get residue 16, then shift 3 to 1.",
      },
      lines: [5, 6, 7], watch: { e: 3, bit: 1, a: 13, r: 5 }, verdict: "run", fit: FIT,
      scene: table(3, "r = 3·13 % 17 = 5", "a = 13² % 17 = 16"),
    },
    {
      title: { vi: "Nhân và trả về", en: "Multiply and return" }, kind: "answer",
      body: {
        vi: "Bit cuối ứng với trọng số 8. Nhân 5 với 16 được 80, lấy dư 17 còn 12. Sau lần dịch cuối <code>e = 0</code>, nên hàm trả về 12.",
        en: "The last bit has weight 8. Multiplying 5 by 16 gives 80, which reduces to 12 modulo 17. The final shift leaves <code>e = 0</code>, so the function returns 12.",
      },
      lines: [5, 6, 7, 9], watch: { e: 1, bit: 1, a: 16, r: 12 }, verdict: "ac", fit: FIT,
      scene: table(4, "r = 5·16 % 17 = 12", "a = 16² % 17 = 1", true),
    },
    {
      title: { vi: "Mỗi bit một lượt", en: "One pass per bit" }, kind: "recap",
      body: {
        vi: "Ba bit 1 chọn <code>3⁸·3⁴·3¹ = 3¹³</code>. Lấy dư sau từng phép nhân vẫn cho cùng phần dư, nên mỗi lượt chỉ giữ cơ số và kết quả đang tính. Với số mũ dương, số lượt bằng số bit của <code>e</code> và bộ nhớ thêm là O(1).",
        en: "The three 1 bits select <code>3⁸·3⁴·3¹ = 3¹³</code>. Reducing after each multiplication preserves the final remainder, so each pass only keeps the current base and result. For a positive exponent, there is one pass per bit of <code>e</code> and O(1) extra space.",
      },
      note: {
        vi: "Hàm dùng a, e không âm và m là int dương, nên tích hai phần dư vừa kiểu long long.",
        en: "The function takes nonnegative a and e and a positive int m, so the product of two residues fits in long long.",
      },
      lines: [4, 5, 6, 7, 9], watch: { e: 0, r: 12 }, verdict: "ac", fit: FIT,
      scene: table(4, "3⁸·3⁴·3¹ ≡ 12 (mod 17)", "", true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const [i, bit] of bits.entries()) {
    const x = bits.length - i;
    scene.add(`bit${i}`, { shape: shapes.block({ label: bit, sub: 2 ** i, w: 42, h: 32 }), x, y: 0 });
    scene.add(`a${i}`, { shape: shapes.block({ label: "?", w: 42, h: 32 }), x, y: 2.54 });
    scene.add(`r${i}`, { shape: shapes.block({ label: "?", w: 42, h: 32 }), x, y: 4.24 });
  }
  scene.add("labelBit", { shape: shapes.pill({ text: "bit" }), x: 0, y: -0.2 });
  scene.add("labelA", { shape: shapes.pill({ text: "a" }), x: 0, y: 2.34 });
  scene.add("labelR", { shape: shapes.pill({ text: "r" }), x: 0, y: 4.04 });
  scene.add("product", { shape: shapes.pill(), x: 2, y: 5.72, o: 0 });
  scene.add("square", { shape: shapes.pill(), x: 2, y: 6.92, o: 0 });
}
