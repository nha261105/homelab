import type { Lesson, SceneMap } from "../../../lib/types";

function picture(first = "", second = "", result = "", incompatible = false): SceneMap {
  return {
    a: { cls: first ? "is-active" : "" },
    b: { text: incompatible ? "x ≡ 4 (mod 8)" : "x ≡ 3 (mod 8)", cls: incompatible ? "is-bad" : first ? "is-active" : "" },
    first: { text: first, o: first ? 1 : 0 },
    second: { text: second, o: second ? 1 : 0 },
    result: {
      text: result, o: result ? 1 : 0, cls: incompatible ? "v-gt" : "v-eq",
      ...(result ? { from: { o: 0, s: 0.9 }, delay: 280, dur: 320, ease: "back" } : {}),
    },
  };
}

export const lesson: Lesson = {
  track: "cp", topic: "math-adv", slug: "crt",
  title: { vi: "Định lý số dư Trung Hoa", en: "Chinese remainder theorem" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng Euclid mở rộng để gộp hai đồng dư, kể cả khi hai môđun có ước chung.",
    en: "Use extended Euclid to merge two congruences even when their moduli share a factor.",
  },
  level: "hard", minutes: 10, time: "O(log min(m, n))", memory: "O(log min(m, n))",
  goal: { vi: "Gộp <b>x ≡ 5 (mod 6)</b> và <b>x ≡ 3 (mod 8)</b>", en: "Merge <b>x ≡ 5 (mod 6)</b> and <b>x ≡ 3 (mod 8)</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">using</span> I = __int128_t;',
    'array&lt;I, 3&gt; egcd(I m, I n) {',
    '  <span class="kw">if</span> (n == 0) <span class="kw">return</span> {m, 1, 0};',
    '  <span class="kw">auto</span> [g, p, q] = egcd(n, m % n);',
    '  <span class="kw">return</span> {g, q, p - (m / n) * q};',
    '}',
    'I norm(I x, I m) { <span class="kw">return</span> (x % m + m) % m; }',
    'optional&lt;pair&lt;I, I&gt;&gt; merge_crt(I a, I m, I b, I n) {',
    '  <span class="kw">auto</span> [g, u, v] = egcd(m, n);',
    '  I delta = b - a;',
    '  <span class="kw">if</span> (delta % g != 0) <span class="kw">return</span> nullopt;',
    '  I t = norm((delta / g) * u, n / g);',
    '  I L = m * (n / g);',
    '  <span class="kw">return</span> pair{norm(a + m * t, L), L};',
    '}',
  ],
  watch: [{ key: "delta", label: "b − a" }, { key: "g", label: "g" }, { key: "u", label: "u" }, { key: "t", label: "t" }, { key: "x", label: "x₀" }, { key: "L", label: "L" }],
  practice: [
    { src: "Codeforces 687B", name: "Remainders Game", lv: "★★☆", url: "https://codeforces.com/problemset/problem/687/B" },
    { src: "Kattis generalchineseremainder", name: "Chinese Remainder Theorem (non-relatively prime moduli)", lv: "★★☆", url: "https://open.kattis.com/problems/generalchineseremainder" },
  ],
  sceneOptions: { unit: 60 },
  legend: [
    { cls: "acc", label: { vi: "đồng dư đang xét", en: "congruence in use" } },
    { cls: "ac", label: { vi: "kết quả", en: "result" } },
    { cls: "wa", label: { vi: "mâu thuẫn", en: "incompatible" } },
  ],
  steps: [
    {
      title: { vi: "Tìm số dư chung", en: "Find a common solution" }, kind: "problem",
      body: {
        vi: "Tìm mọi số x chia 6 dư 5 và chia 8 dư 3. Có thể thử 5, 11, 17, … để lọc theo đồng dư thứ hai, nhưng với môđun lớn, cách này có thể phải thử rất nhiều số.",
        en: "Find every x that leaves remainder 5 modulo 6 and 3 modulo 8. We could test 5, 11, 17, … against the second congruence, but large moduli can make that search long.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(),
    },
    {
      title: { vi: "Thế vào đồng dư", en: "Substitute into the congruence" }, kind: "concept",
      body: {
        vi: "Đồng dư đầu cho <code>x = 5 + 6t</code> với t nguyên. Thế vào đồng dư sau, ta cần <code>6t ≡ 3 − 5 ≡ −2 (mod 8)</code>.",
        en: "The first congruence gives <code>x = 5 + 6t</code> for an integer t. Substitute into the second congruence to get <code>6t ≡ 3 − 5 ≡ −2 (mod 8)</code>.",
      },
      lines: [8, 10], watch: { delta: -2 }, verdict: "run", fit: "all", scene: picture("x = 5 + 6t", "6t ≡ 3 − 5 (mod 8)"),
    },
    {
      title: { vi: "Tìm hệ số Bézout", en: "Find Bézout coefficients" }, kind: "step",
      body: {
        vi: "Euclid cho <code>8 = 6 + 2</code> và <code>6 = 3·2</code>, nên <code>g = 2</code>. Thế ngược được <code>6·(−1) + 8·1 = 2</code>, tức là <code>u = −1</code>, <code>v = 1</code>.",
        en: "Euclid gives <code>8 = 6 + 2</code> and <code>6 = 3·2</code>, so <code>g = 2</code>. Back-substitution gives <code>6·(−1) + 8·1 = 2</code>, hence <code>u = −1</code> and <code>v = 1</code>.",
      },
      lines: [2, 3, 4, 5, 9], watch: { delta: -2, g: 2, u: -1 }, verdict: "run", fit: "all", scene: picture("8 = 6 + 2  ·  6 = 3·2", "6·(−1) + 8·1 = 2"),
    },
    {
      title: { vi: "Chia cùng cho gcd", en: "Divide by the gcd" }, kind: "step",
      body: {
        vi: "Hiệu −2 chia hết cho <code>g = 2</code>, nên chia cả hai vế và môđun cho 2 để được <code>3t ≡ −1 (mod 4)</code>. Chia đẳng thức Bézout cho 2 cũng cho <code>3·(−1) + 4·1 = 1</code>, nên −1 là nghịch đảo của 3 theo môđun 4.",
        en: "The difference −2 is divisible by <code>g = 2</code>, so divide both sides and the modulus by 2 to get <code>3t ≡ −1 (mod 4)</code>. Dividing Bézout's identity by 2 gives <code>3·(−1) + 4·1 = 1</code>, so −1 is the inverse of 3 modulo 4.",
      },
      lines: [9, 10, 11, 12], watch: { delta: -2, g: 2, u: -1 }, verdict: "run", fit: "all", scene: picture("6t ≡ −2 (mod 8)", "3t ≡ −1 (mod 4)", "3·(−1) ≡ 1 (mod 4)"),
    },
    {
      title: { vi: "Giải đồng dư theo t", en: "Solve the congruence for t" }, kind: "step",
      body: {
        vi: "Nhân hai vế với nghịch đảo −1 được <code>t ≡ (−1)(−1) ≡ 1 (mod 4)</code>. Ta lấy đại diện không âm nhỏ nhất là 1. Các giá trị t khác cách nhau bội của 4.",
        en: "Multiply both sides by the inverse −1 to get <code>t ≡ (−1)(−1) ≡ 1 (mod 4)</code>. Take 1 as the least nonnegative representative. The other values of t differ from it by multiples of 4.",
      },
      lines: [7, 12], watch: { g: 2, u: -1, t: 1 }, verdict: "run", fit: "all", scene: picture("3t ≡ −1 (mod 4)", "t ≡ (−1)(−1) (mod 4)", "t ≡ 1 (mod 4)"),
    },
    {
      title: { vi: "Đọc nghiệm đã gộp", en: "Read the merged solution" }, kind: "answer",
      body: {
        vi: "Thay <code>t = 1</code> vào <code>x = 5 + 6t</code> được 11, chia 6 dư 5 và chia 8 dư 3. Khi t tăng 4 thì x tăng <code>6·4 = 24</code>, nên mọi nghiệm có dạng <code>x ≡ 11 (mod 24)</code>.",
        en: "Putting <code>t = 1</code> into <code>x = 5 + 6t</code> gives 11, which leaves remainder 5 modulo 6 and 3 modulo 8. Increasing t by 4 adds <code>6·4 = 24</code> to x, so all solutions satisfy <code>x ≡ 11 (mod 24)</code>.",
      },
      lines: [12, 13, 14], watch: { t: 1, x: 11, L: 24 }, verdict: "ac", fit: "all", scene: picture("x₀ = 5 + 6·1 = 11", "L = 6·(8/2) = 24", "x ≡ 11 (mod 24)"),
    },
    {
      title: { vi: "Thử một hệ vô nghiệm", en: "Try an incompatible system" }, kind: "step",
      body: {
        vi: "Nếu đổi số dư thứ hai từ 3 thành 4 thì hiệu là <code>4 − 5 = −1</code>, không chia hết cho 2. Hệ mới vô nghiệm: chia 6 dư 5 buộc x lẻ, còn chia 8 dư 4 buộc x chẵn.",
        en: "If we change the second remainder from 3 to 4, the difference is <code>4 − 5 = −1</code>, which is indivisible by 2. The new system is inconsistent: remainder 5 modulo 6 makes x odd, while remainder 4 modulo 8 makes it even.",
      },
      lines: [9, 10, 11], watch: { delta: -1, g: 2 }, verdict: "ac", fit: "all", scene: picture("6t ≡ −1 (mod 8)", "g = gcd(6, 8) = 2", "2 ∤ −1", true),
    },
    {
      title: { vi: "Một lớp nghiệm duy nhất", en: "One class of solutions" }, kind: "recap",
      body: {
        vi: "Hệ tương thích khi hiệu hai số dư chia hết cho g. Khi đó nghiệm tạo thành đúng một lớp theo môđun <code>L = lcm(m, n)</code>, ở đây là 24. Mỗi lần gộp dùng O(log min(m, n)) thời gian và ngăn xếp cho Euclid mở rộng.",
        en: "The system is compatible when g divides the difference of the remainders. Its solutions then form one class modulo <code>L = lcm(m, n)</code>, here 24. A merge uses O(log min(m, n)) time and stack space for extended Euclid.",
      },
      note: { vi: "Mã dùng số trung gian 128 bit cho đầu vào 64 bit có dấu với môđun dương.", en: "The code uses 128-bit intermediates for signed 64-bit inputs with positive moduli." },
      lines: [9, 11, 12, 13, 14], watch: { g: 2, x: 11, L: 24 }, verdict: "ac", fit: "all", scene: picture("2 ∣ (3 − 5)", "L = lcm(6, 8) = 24", "x ≡ 11 (mod 24)"),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("a", { shape: shapes.pill({ text: "x ≡ 5 (mod 6)" }), x: -1.4 });
  scene.add("b", { shape: shapes.pill({ text: "x ≡ 3 (mod 8)" }), x: 1.4 });
  for (const [id, y] of [["first", 1.2], ["second", 2.4], ["result", 3.6]] as const) {
    scene.add(id, { shape: shapes.pill(), x: 0, y, o: 0 });
  }
}
