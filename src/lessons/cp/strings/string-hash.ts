import type { Lesson, SceneMap } from "../../../lib/types";

const S = "banana";
const B = 31, M = 101;
const H = [0], POW = [1];
const value = (c: string) => c.charCodeAt(0) - 96;
for (const c of S) {
  H.push((H[H.length - 1] * B + value(c)) % M);
  POW.push(POW[POW.length - 1] * B % M);
}
const hash = (l: number, r: number) => ((H[r] - H[l] * POW[r - l]) % M + M) % M;
const active = { cls: "is-active" };
const good = { cls: "is-good" };
const bad = { cls: "is-bad" };

function picture(known: number, marks: SceneMap = {}, first = "", second = ""): SceneMap {
  const row = Object.fromEntries(H.map((h, i) => [`h${i}`, {
    text: i <= known ? String(h) : "?",
    o: i <= known ? 1 : 0.42,
    cls: i <= known ? "" : "is-out",
    ...marks[`h${i}`],
  }]));
  const chars = Object.fromEntries([...S].map((_, i) => [`s${i}`, marks[`s${i}`] ?? {}]));
  return {
    ...row, ...chars,
    calc: { text: first, o: first ? 1 : 0 },
    extra: { text: second, o: second ? 1 : 0 },
  };
}

function fill(k: number): SceneMap {
  const eq = (i: number) => `H[${i}] = (${H[i - 1]} × ${B} + ${value(S[i - 1])}) % ${M} = ${H[i]}`;
  return picture(k, {
    [`s${k - 2}`]: active, [`s${k - 1}`]: active, [`h${k - 2}`]: active,
    [`h${k - 1}`]: { ...good, fx: { type: "pulse", delay: 160 } },
    [`h${k}`]: { ...good, fx: { type: "pulse", delay: 440 } },
  }, eq(k - 1), eq(k));
}

function compare(l: number, r: number, both = false): SceneMap {
  const span = Object.fromEntries([...S].map((_, i) => [`s${i}`,
    ((both && i >= 1) || (i >= l && i < r)) ? good : {}]));
  const eq = (a: number, b: number) => `[${a}, ${b}): (${H[b]} − ${H[a]} × ${POW[b - a]}) mod ${M} = ${hash(a, b)}`;
  const firstRange: SceneMap = both ? { h1: bad, h4: good } : {};
  return picture(S.length, { ...span, ...firstRange, [`h${l}`]: bad, [`h${r}`]: good },
    eq(both ? 1 : l, both ? 4 : r), both ? eq(l, r) : "");
}

export const lesson: Lesson = {
  track: "cp", topic: "strings", slug: "string-hash",
  title: { vi: "Hash chuỗi", en: "Polynomial string hashing" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng hash tiền tố để lấy hash của một đoạn con bằng một phép trừ đã căn theo độ dài.",
    en: "Use prefix hashes to extract a substring hash with a length-adjusted subtraction.",
  },
  level: "medium", minutes: 8, time: "O(n) + O(1) / query", memory: "O(n)",
  goal: { vi: "So sánh <b>s[1..4)</b> và <b>s[3..6)</b> trong banana", en: "Compare <b>s[1..4)</b> and <b>s[3..6)</b> in banana" },
  codeLang: "C++17",
  code: [
    '<span class="kw">const long long</span> B = 31, M = 101;',
    'vector&lt;<span class="kw">long long</span>&gt; H(s.size() + 1), pw(s.size() + 1, 1);',
    '<span class="kw">for</span> (size_t i = 0; i &lt; s.size(); ++i) {',
    "  H[i+1] = (H[i] * B + (s[i] - 'a' + 1)) % M;",
    '  pw[i+1] = pw[i] * B % M;',
    '}',
    '<span class="kw">auto</span> hash = [&amp;](<span class="kw">int</span> l, <span class="kw">int</span> r) {',
    '  <span class="kw">return</span> (H[r] - H[l] * pw[r-l] % M + M) % M;',
    '};',
  ],
  watch: [
    { key: "i", label: "i" },
    { key: "h", label: "H[i]" },
    { key: "range", label: "[l, r)" },
    { key: "sub", label: "hash(l, r)" },
  ],
  practice: [
    { src: "CSES 1753", name: "String Matching", lv: "★★☆", url: "https://cses.fi/problemset/task/1753" },
    { src: "LeetCode 1044", name: "Longest Duplicate Substring", lv: "★★★", url: "https://leetcode.com/problems/longest-duplicate-substring/" },
  ],
  sceneOptions: { unit: 54 },
  legend: [
    { cls: "acc", label: { vi: "dữ liệu đang dùng", en: "inputs in use" } },
    { cls: "ac", label: { vi: "ô vừa tính hoặc đoạn được so", en: "new hash or compared substring" } },
    { cls: "wa", label: { vi: "tiền tố bị trừ", en: "prefix subtracted" } },
  ],
  entrance: [...S].map((_, i) => `s${i}`),
  steps: [
    {
      title: { vi: "So hai đoạn con", en: "Compare two substrings" }, kind: "problem",
      body: {
        vi: "Hai đoạn dài 3 của <code>banana</code> bắt đầu ở vị trí 1 và 3. Chỉ số phải trong <code>[l, r)</code> nằm ngoài đoạn. So từng ký tự có thể tốn O(r − l) cho mỗi truy vấn.",
        en: "Two length-3 substrings of <code>banana</code> start at indices 1 and 3. The right index in <code>[l, r)</code> is excluded. Comparing character by character can cost O(r − l) per query.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all",
      scene: picture(-1, { s1: active, s2: active, s3: active, s4: active, s5: active }),
    },
    {
      title: { vi: "Đặt hash tiền tố", en: "Define the prefix hash" }, kind: "concept",
      body: {
        vi: "<code>H[i]</code> là hash của i ký tự đầu, với <code>H[0] = 0</code> cho chuỗi rỗng. Mỗi khi thêm ký tự, nhân hash cũ với 31, cộng mã chữ (a = 1, b = 2, n = 14) rồi lấy dư cho 101.",
        en: "<code>H[i]</code> hashes the first i characters, with <code>H[0] = 0</code> for the empty string. To append a letter, multiply the old hash by 31, add its code (a = 1, b = 2, n = 14), and take the remainder modulo 101.",
      },
      lines: [1, 2, 4], watch: { i: 0, h: H[0] }, verdict: "run", fit: "all",
      scene: picture(0, { h0: good }, "H[0] = 0"),
    },
    {
      title: { vi: "Thêm b rồi a", en: "Append b then a" }, kind: "step",
      body: {
        vi: "Từ 0, thêm <code>b</code> được <code>H[1] = 2</code>. Thêm tiếp <code>a</code> để tạo <code>ba</code>, ta có <code>H[2] = 63</code>.",
        en: "Append <code>b</code> to the empty prefix to get <code>H[1] = 2</code>. With <code>a</code> appended, the same rule gives <code>H[2] = 63</code> for <code>ba</code>.",
      },
      lines: [3, 4], watch: { i: 2, h: H[2] }, verdict: "run", fit: "all", scene: fill(2),
    },
    {
      title: { vi: "Lấy dư ở mỗi ô", en: "Reduce each entry" }, kind: "step",
      body: {
        vi: "Thêm <code>n</code> vào <code>ba</code> cho <code>H[3] = 48</code>. Lấy 48 làm đầu vào ở bước tiếp theo, ta được <code>H[4] = 75</code> cho <code>bana</code>.",
        en: "Append <code>n</code> to <code>ba</code> to get <code>H[3] = 48</code>. Using 48 as the next input yields <code>H[4] = 75</code> for <code>bana</code>.",
      },
      lines: [3, 4], watch: { i: 4, h: H[4] }, verdict: "run", fit: "all", scene: fill(4),
    },
    {
      title: { vi: "Điền hai ô cuối", en: "Fill the final entries" }, kind: "step",
      body: {
        vi: "Hai ký tự còn lại cho <code>H[5] = 16</code> và <code>H[6] = 93</code>. Cùng lượt quét, tính cả lũy thừa <code>pw</code> bằng cách nhân tiếp với 31 mỗi lần.",
        en: "The last two letters give <code>H[5] = 16</code> and <code>H[6] = 93</code>. In the same pass, build powers <code>pw</code> by multiplying by 31 at each step.",
      },
      lines: [3, 4, 5], watch: { i: 6, h: H[6] }, verdict: "run", fit: "all", scene: fill(6),
    },
    {
      title: { vi: "Trừ tiền tố đã dịch", en: "Subtract the shifted prefix" }, kind: "step",
      body: {
        vi: "Trong <code>H[4]</code>, ba ký tự sau <code>b</code> đã đẩy hệ số của <code>b</code> lên <code>31³</code>. Căn <code>H[1] = 2</code> theo độ dài bằng <code>31³ mod 101 = 97</code> rồi trừ, ta được hash 83 cho <code>[1, 4)</code>.",
        en: "In <code>H[4]</code>, the three characters after <code>b</code> have shifted its coefficient by <code>31³</code>. Scale <code>H[1] = 2</code> by <code>31³ mod 101 = 97</code> and subtract to get hash 83 for <code>[1, 4)</code>.",
      },
      lines: [5, 7, 8], watch: { range: "[1, 4)", sub: hash(1, 4) }, verdict: "run", fit: "all", scene: compare(1, 4),
    },
    {
      title: { vi: "Hai hash cùng bằng 83", en: "Both hashes equal 83" }, kind: "answer",
      body: {
        vi: "Với <code>[3, 6)</code>, lấy 93 trừ <code>48 × 97</code> theo modulo 101 cũng được 83. Nhìn lại các ký tự, cả hai đoạn đều là <code>ana</code>.",
        en: "For <code>[3, 6)</code>, subtract <code>48 × 97</code> from 93 modulo 101 to get 83 again. The characters confirm that both substrings are <code>ana</code>.",
      },
      lines: [7, 8], watch: { range: "[3, 6)", sub: hash(3, 6) }, verdict: "ac", fit: "all", scene: compare(3, 6, true),
    },
    {
      title: { vi: "So sánh trong O(1)", en: "Compare in O(1)" }, kind: "recap",
      body: {
        vi: "Sau O(n) thời gian và bộ nhớ để lập <code>H</code> và <code>pw</code>, mỗi hash đoạn chỉ cần O(1). Với hai đoạn cùng độ dài, hash khác nhau chứng tỏ chúng khác nhau, còn hash bằng nhau có thể do va chạm. Modulo 101 dùng để minh họa, và có thể kiểm tra ký tự khi cần kết quả chắc chắn.",
        en: "Building <code>H</code> and <code>pw</code> takes O(n) time and space, then each substring hash takes O(1). For equal-length substrings, different hashes prove a difference, while equal hashes can be a collision. Modulo 101 is for illustration, and character checks can confirm equality when needed.",
      },
      lines: [2, 5, 8], watch: { sub: hash(3, 6) }, verdict: "ac", fit: "all", scene: compare(3, 6, true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("s", { shape: shapes.pill({ text: "s" }), x: 0 });
  scene.add("h", { shape: shapes.pill({ text: "H" }), x: -0.95, y: 2.65 });
  [...S].forEach((c, i) => scene.add(`s${i}`, {
    shape: shapes.block({ label: c, sub: i, w: 44, h: 36 }), x: i + 1,
  }));
  H.forEach((_, i) => scene.add(`h${i}`, {
    shape: shapes.block({ label: "?", sub: i, w: 44, h: 36 }), x: i, y: 2.65, o: 0.42,
  }));
  scene.add("calc", { shape: shapes.pill(), x: 2.85, y: 4.75, o: 0 });
  scene.add("extra", { shape: shapes.pill(), x: 2.85, y: 5.85, o: 0 });
}
