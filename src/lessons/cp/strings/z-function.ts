import type { Lesson, SceneMap } from "../../../lib/types";

const S = "aabaaaab";
const U = 48;
const Z = Array<number>(S.length).fill(0);
let l = 0, r = 0;
for (let i = 1; i < S.length; i++) {
  if (i <= r) Z[i] = Math.min(r - i + 1, Z[i - l]);
  while (i + Z[i] < S.length && S[Z[i]] === S[i + Z[i]]) Z[i]++;
  if (i + Z[i] - 1 > r) [l, r] = [i, i + Z[i] - 1];
}

const active = { cls: "is-active" };
const good = { cls: "is-good" };
const bad = { cls: "is-bad" };

function picture(known: number, box: [number, number] | null, marks: SceneMap, first = "", second = ""): SceneMap {
  const scene: SceneMap = {
    calc: { text: first, o: first ? 1 : 0 },
    extra: { text: second, o: second ? 1 : 0 },
  };
  if (box) {
    const [left, right] = box;
    scene.box = { x: (left + right) / 2, w: (right - left) * U + 49, o: 1 };
  }
  Z.forEach((value, i) => {
    scene[`s${i}`] = marks[`s${i}`] ?? {};
    scene[`z${i}`] = {
      text: i <= known ? String(value) : "?",
      cls: i <= known ? "" : "is-out",
      o: i <= known ? 1 : 0.42,
      ...marks[`z${i}`],
    };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "strings", slug: "z-function",
  title: { vi: "Z-function", en: "Z-function" },
  added: "2026-11-27",
  summary: {
    vi: "Tính độ dài khớp với tiền tố ở từng vị trí bằng cách tái dùng hộp [l, r].",
    en: "Compute the prefix-match length at each position by reusing the [l, r] box.",
  },
  level: "medium", minutes: 9, time: "O(n)", memory: "O(n)",
  goal: { vi: "Lập bảng <b>z</b> cho aabaaaab", en: "Build the <b>z</b> array for aabaaaab" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> n = s.size(), l = 0, r = 0;',
    'vector&lt;<span class="kw">int</span>&gt; z(n);',
    '<span class="kw">for</span> (<span class="kw">int</span> i = 1; i &lt; n; ++i) {',
    '  <span class="kw">if</span> (i &lt;= r) z[i] = min(r - i + 1, z[i - l]);',
    '  <span class="kw">while</span> (i + z[i] &lt; n &amp;&amp; s[z[i]] == s[i + z[i]])',
    '    ++z[i];',
    '  <span class="kw">if</span> (i + z[i] - 1 &gt; r) {',
    '    l = i;',
    '    r = i + z[i] - 1;',
    '  }',
    '}',
  ],
  watch: [
    { key: "i", label: "i" },
    { key: "z", label: "z[i]" },
    { key: "box", label: "[l, r]" },
  ],
  practice: [
    { src: "CSES 1733", name: "Finding Periods", lv: "★★☆", url: "https://cses.fi/problemset/task/1733" },
    { src: "CSES 1732", name: "Finding Borders", lv: "★★☆", url: "https://cses.fi/problemset/task/1732" },
  ],
  sceneOptions: { unit: U },
  legend: [
    { cls: "acc", label: { vi: "đoạn hoặc ô đang dùng", en: "current range or source entry" } },
    { cls: "wa", label: { vi: "ký tự lệch", en: "mismatch" } },
    { cls: "ac", label: { vi: "phần khớp hoặc ô vừa tính", en: "matched range or new entry" } },
  ],
  entrance: [...S].map((_, i) => `s${i}`),
  steps: [
    {
      title: { vi: "Khớp với đầu chuỗi", en: "Match the string prefix" }, kind: "problem",
      body: {
        vi: "Với <code>s = aabaaaab</code>, <code>z[i]</code> đếm số ký tự liên tiếp từ vị trí <code>i</code> trùng với đầu chuỗi. So lại từ đầu tại mỗi vị trí có thể tốn O(n²). Ta quy ước <code>z[0] = 0</code>.",
        en: "For <code>s = aabaaaab</code>, <code>z[i]</code> counts consecutive characters from index <code>i</code> that match the prefix. Restarting every comparison can cost O(n²). We define <code>z[0] = 0</code> by convention.",
      },
      lines: [1, 2], watch: { i: 0, z: Z[0] }, verdict: "run", fit: "all",
      scene: picture(0, null, { z0: good }, "z[0] = 0"),
    },
    {
      title: { vi: "Mở hộp đầu tiên", en: "Open the first box" }, kind: "concept",
      body: {
        vi: "Từ vị trí 1, khớp một chữ <code>a</code> rồi gặp <code>b ≠ a</code>, nên <code>z[1] = 1</code> và có hộp <code>[1, 1]</code>. Hộp là đoạn khớp tiền tố có đầu phải xa nhất đã gặp. Vị trí 2 ở ngoài hộp và bắt đầu bằng <code>b</code>, nên <code>z[2] = 0</code>.",
        en: "At index 1, one <code>a</code> matches before <code>b ≠ a</code>, giving <code>z[1] = 1</code> and box <code>[1, 1]</code>. The box is the prefix match that reaches furthest right so far. Index 2 is outside it and starts with <code>b</code>, so <code>z[2] = 0</code>.",
      },
      lines: [3, 5, 6, 7, 8, 9], watch: { i: 2, z: Z[2], box: "[1, 1]" }, verdict: "run", fit: "all",
      scene: picture(2, [1, 1], { s0: active, s1: good, s2: bad, z1: good, z2: good }, "z[1] = 1 (a)", "z[2] = 0 (b ≠ a)"),
    },
    {
      title: { vi: "So từ ngoài hộp", en: "Start outside the box" }, kind: "step",
      body: {
        vi: "Vị trí 3 nằm ngoài hộp <code>[1, 1]</code>, nên bắt đầu so với đầu chuỗi từ độ dài 0. Hai chữ <code>aa</code> khớp, <code>s[5] = a</code> khác <code>s[2] = b</code>, nên <code>z[3] = 2</code> và hộp mới là <code>[3, 4]</code>.",
        en: "Index 3 is outside box <code>[1, 1]</code>, so compare against the prefix starting from length 0. Both letters of <code>aa</code> match before <code>s[5] = a</code> differs from <code>s[2] = b</code>, giving <code>z[3] = 2</code> and box <code>[3, 4]</code>.",
      },
      lines: [4, 5, 6, 7, 8, 9], watch: { i: 3, z: Z[3], box: "[3, 4]" }, verdict: "run", fit: "all",
      scene: picture(3, [3, 4], { s0: active, s1: active, s3: good, s4: good, s5: bad, z3: good }, "z[3] = 2 (aa)", "r = 3 + 2 − 1 = 4"),
    },
    {
      title: { vi: "Tái dùng một ký tự", en: "Reuse one character" }, kind: "step",
      body: {
        vi: "Vị trí 4 nằm trong <code>[3, 4]</code> và tương ứng với vị trí <code>4 − 3 = 1</code> ở đầu chuỗi. <code>z[1] = 1</code> vừa đủ phần còn lại trong hộp. So tiếp ngoài hộp, <code>s[5]</code> khớp còn <code>s[6]</code> lệch, nên <code>z[4] = 2</code> và hộp dời sang <code>[4, 5]</code>.",
        en: "Index 4 lies in <code>[3, 4]</code> and mirrors index <code>4 − 3 = 1</code> in the prefix. <code>z[1] = 1</code> covers the rest of the box. Beyond it, <code>s[5]</code> matches and <code>s[6]</code> differs, so <code>z[4] = 2</code> and the box moves to <code>[4, 5]</code>.",
      },
      lines: [4, 5, 6, 7, 8, 9], watch: { i: 4, z: Z[4], box: "[4, 5]" }, verdict: "run", fit: "all",
      scene: picture(4, [4, 5], { s4: active, s5: good, s6: bad, z1: active, z4: good }, "min(4 − 4 + 1, z[1]) = 1", "z[4] = 1 + 1 = 2"),
    },
    {
      title: { vi: "Kéo hộp tới cuối", en: "Extend to the end" }, kind: "step",
      body: {
        vi: "Từ hộp <code>[4, 5]</code>, vị trí 5 lại dùng <code>z[1] = 1</code> để bỏ qua chữ <code>a</code> đầu. Hai chữ <code>ab</code> còn lại khớp, nên <code>z[5] = 3</code> và hộp <code>[5, 7]</code> chạm cuối chuỗi.",
        en: "From box <code>[4, 5]</code>, index 5 again uses <code>z[1] = 1</code> to skip its first <code>a</code>. The remaining <code>ab</code> matches, making <code>z[5] = 3</code> and box <code>[5, 7]</code> reach the end.",
      },
      lines: [4, 5, 6, 7, 8, 9], watch: { i: 5, z: Z[5], box: "[5, 7]" }, verdict: "run", fit: "all",
      scene: picture(5, [5, 7], { s5: active, s6: good, s7: good, z1: active, z5: good }, "min(5 − 5 + 1, z[1]) = 1", "z[5] = 1 + 2 = 3"),
    },
    {
      title: { vi: "Điền nốt trong hộp", en: "Finish inside the box" }, kind: "answer",
      body: {
        vi: "Vị trí 6 và 7 tương ứng với vị trí 1 và 2 trong tiền tố. Cả <code>z[1] = 1</code> lẫn <code>z[2] = 0</code> đều ngắn hơn phần còn lại của hộp, nên ký tự lệch cũng nằm trong hộp và hai giá trị được sao chép nguyên.",
        en: "Indices 6 and 7 mirror prefix indices 1 and 2. Both <code>z[1] = 1</code> and <code>z[2] = 0</code> are shorter than the remaining box, so their mismatches are also inside it and both values copy unchanged.",
      },
      lines: [4, 5], watch: { i: 7, z: Z[7], box: "[5, 7]" }, verdict: "ac", fit: "all",
      scene: picture(7, [5, 7], { z1: active, z2: active, z6: good, z7: good }, "z[6] = min(2, z[1]) = 1", "z[7] = min(1, z[2]) = 0"),
    },
    {
      title: { vi: "Đầu phải chỉ tiến", en: "The right edge advances" }, kind: "recap",
      body: {
        vi: "Mỗi lần khớp thêm sau khi tái dùng hộp đều đẩy đầu phải ra xa hơn, và mỗi vị trí có tối đa một phép so lệch. Vì thế tổng thời gian là O(n), với O(n) bộ nhớ cho bảng. Chẳng hạn <code>5 + z[5] = 8</code> xác nhận tiền tố lặp có độ dài 5.",
        en: "Each successful comparison after reusing the box extends the rightmost reach, and each position has at most one failing comparison. That gives O(n) time and O(n) space for the table. For example, <code>5 + z[5] = 8</code> confirms that 5 is a period.",
      },
      lines: [4, 5, 6, 7, 9], watch: { box: "[5, 7]" }, verdict: "ac", fit: "all",
      scene: picture(7, [5, 7], { s5: good, s6: good, s7: good, z5: good }, "5 + z[5] = 8"),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("box", { shape: shapes.frame({ top: -43, h: 53 }), layer: "back", o: 0 });
  scene.add("s", { shape: shapes.pill({ text: "s" }), x: -0.93 });
  scene.add("z", { shape: shapes.pill({ text: "z" }), x: -0.93, y: 2.8 });
  [...S].forEach((c, i) => {
    scene.add(`s${i}`, { shape: shapes.block({ label: c, sub: i, w: 39, h: 30 }), x: i });
    scene.add(`z${i}`, { shape: shapes.block({ label: "?", w: 39, h: 30 }), x: i, y: 2.8 });
  });
  scene.add("calc", { shape: shapes.pill(), x: 3.1, y: 4.6, o: 0 });
  scene.add("extra", { shape: shapes.pill(), x: 3.1, y: 5.85, o: 0 });
}
