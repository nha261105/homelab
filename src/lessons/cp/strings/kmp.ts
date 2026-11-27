import type { Lesson, SceneEntry, SceneMap } from "../../../lib/types";

const P = "abab", T = "abaabab";
const PI = Array<number>(P.length).fill(0);
for (let i = 1; i < P.length; i++) {
  let j = PI[i - 1];
  while (j > 0 && P[i] !== P[j]) j = PI[j - 1];
  PI[i] = j + Number(P[i] === P[j]);
}

const active = { cls: "is-active" };
const good = { cls: "is-good" };
const bad = { cls: "is-bad" };

function picture(known: number, marks: SceneMap = {}, first = "", second = ""): SceneMap {
  const row = (id: string, values: string[], entry: (i: number) => SceneEntry) =>
    Object.fromEntries(values.map((_, i) => [`${id}${i}`, { ...entry(i), ...marks[`${id}${i}`] }]));
  return {
    ...row("t", [...T], () => ({})),
    ...row("p", [...P], () => ({})),
    ...row("pi", PI.map(String), (i) => ({
      text: i <= known ? String(PI[i]) : "?",
      o: i <= known ? 1 : 0.42,
      cls: i <= known ? "" : "is-out",
    })),
    calc: { text: first, o: first ? 1 : 0 },
    extra: { text: second, o: second ? 1 : 0 },
  };
}

const answer = picture(3, {
  t3: good, t4: good, t5: good, t6: good, p0: good, p1: good, p2: good, p3: good,
}, "6 − 4 + 1 = 3");

export const lesson: Lesson = {
  track: "cp", topic: "strings", slug: "kmp",
  title: { vi: "KMP", en: "KMP string matching" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng prefix-function để tìm mẫu trong văn bản và giữ lại phần đã khớp khi gặp ký tự lệch.",
    en: "Use the prefix function to find a pattern in text and keep a usable match after a mismatch.",
  },
  level: "medium", minutes: 9, time: "O(n + m)", memory: "O(m)",
  goal: { vi: "Tìm <b>abab</b> trong <b>abaabab</b>", en: "Find <b>abab</b> in <b>abaabab</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> m = p.size(), n = t.size();  <span class="cm">// m &gt; 0</span>',
    'vector&lt;<span class="kw">int</span>&gt; pi(m), matches;',
    '<span class="kw">for</span> (<span class="kw">int</span> i = 1; i &lt; m; ++i) {',
    '  <span class="kw">int</span> j = pi[i-1];',
    '  <span class="kw">while</span> (j &gt; 0 &amp;&amp; p[i] != p[j]) j = pi[j-1];',
    '  pi[i] = j + (p[i] == p[j]);',
    '}',
    '<span class="kw">for</span> (<span class="kw">int</span> i = 0, j = 0; i &lt; n; ++i) {',
    '  <span class="kw">while</span> (j &gt; 0 &amp;&amp; t[i] != p[j]) j = pi[j-1];',
    '  <span class="kw">if</span> (t[i] == p[j]) ++j;',
    '  <span class="kw">if</span> (j == m) {',
    '    matches.push_back(i - m + 1);',
    '    j = pi[j-1];',
    '  }',
    '}',
  ],
  watch: [
    { key: "i", label: "i" },
    { key: "j", label: "j" },
    { key: "match", label: { vi: "vị trí tìm được", en: "match position" } },
  ],
  practice: [
    { src: "LeetCode 28", name: "Find the Index of the First Occurrence in a String", lv: "★☆☆", url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/" },
    { src: "CSES 1753", name: "String Matching", lv: "★★☆", url: "https://cses.fi/problemset/task/1753" },
    { src: "CSES 1732", name: "Finding Borders", lv: "★★☆", url: "https://cses.fi/problemset/task/1732" },
  ],
  sceneOptions: { unit: 51 },
  legend: [
    { cls: "acc", label: { vi: "đang xét hoặc dùng để nhảy", en: "current input or fallback" } },
    { cls: "wa", label: { vi: "ký tự lệch", en: "mismatch" } },
    { cls: "ac", label: { vi: "đã khớp hoặc vừa tính", en: "matched or computed" } },
  ],
  entrance: [...T].map((_, i) => `t${i}`),
  steps: [
    {
      title: { vi: "Tìm mẫu trong văn bản", en: "Find the pattern" }, kind: "problem",
      body: {
        vi: "Tìm mọi vị trí bắt đầu của mẫu <code>p = abab</code> trong <code>t = abaabab</code>. Nếu thử lại từ đầu mẫu ở mỗi vị trí, trường hợp xấu nhất tốn O(nm) với n là độ dài văn bản và m là độ dài mẫu.",
        en: "Find every starting position of <code>p = abab</code> in <code>t = abaabab</code>. Restarting the pattern at each position can take O(nm) for text length n and pattern length m.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(-1),
    },
    {
      title: { vi: "Tìm tiền tố trùng hậu tố", en: "Define the prefix function" }, kind: "concept",
      body: {
        vi: "<code>pi[i]</code> là độ dài lớn nhất của một tiền tố đồng thời là hậu tố của <code>p[0..i]</code>, với điều kiện tiền tố ngắn hơn cả đoạn. <code>a</code> cho 0. Với <code>ab</code>, thử kéo dài từ <code>pi[0] = 0</code> nhưng <code>b ≠ a</code>, nên vẫn là 0.",
        en: "<code>pi[i]</code> is the length of the longest proper prefix of <code>p[0..i]</code> that is also its suffix. <code>a</code> gives 0. For <code>ab</code>, try extending from <code>pi[0] = 0</code>, and <code>b ≠ a</code> leaves the value at 0.",
      },
      lines: [2, 4, 6], watch: { i: 1, j: 0 }, verdict: "run", fit: "all",
      scene: picture(1, { p0: active, p1: bad, pi0: active, pi1: good }, "pi[0] = 0", "pi[1] = 0 + (b = a) = 0"),
    },
    {
      title: { vi: "Kéo dài phần trùng", en: "Extend the border" }, kind: "step",
      body: {
        vi: "Với <code>aba</code>, bắt đầu từ <code>pi[1] = 0</code> và thêm <code>a</code> để được 1. Với <code>abab</code>, bắt đầu từ <code>pi[2] = 1</code> và thêm <code>b</code>, cho tiền tố kiêm hậu tố <code>ab</code> dài 2.",
        en: "For <code>aba</code>, start at <code>pi[1] = 0</code> and extend with <code>a</code> to get 1. For <code>abab</code>, start at <code>pi[2] = 1</code> and extend with <code>b</code> to get the length-2 border <code>ab</code>.",
      },
      lines: [3, 4, 6], watch: { i: 3, j: 1 }, verdict: "run", fit: "all",
      scene: picture(3, { pi1: active, pi2: good, pi3: good }, "pi[2] = 0 + (a = a) = 1", "pi[3] = 1 + (b = b) = 2"),
    },
    {
      title: { vi: "Khớp ba ký tự đầu", en: "Match three characters" }, kind: "step",
      body: {
        vi: "Quét văn bản từ trái sang phải. Qua <code>t[0..2] = aba</code>, độ dài đã khớp <code>j</code> tăng từ 0 lên 3, nên ký tự tiếp theo cần so với <code>p[3] = b</code>.",
        en: "Scan the text left to right. Across <code>t[0..2] = aba</code>, the matched length <code>j</code> grows from 0 to 3, so the next character is compared with <code>p[3] = b</code>.",
      },
      lines: [8, 10], watch: { i: 2, j: 3 }, verdict: "run", fit: "all",
      scene: picture(3, { t0: good, t1: good, t2: good, p0: good, p1: good, p2: good, p3: active }, "j: 0 → 1 → 2 → 3"),
    },
    {
      title: { vi: "Giữ lại hậu tố a", en: "Keep the suffix a" }, kind: "step",
      body: {
        vi: "<code>t[3] = a</code> lệch với <code>p[3] = b</code>. Phần <code>aba</code> vừa khớp có hậu tố <code>a</code> cũng là tiền tố của mẫu, nên lấy <code>j = pi[2] = 1</code> và vẫn xét <code>t[3]</code>.",
        en: "<code>t[3] = a</code> mismatches <code>p[3] = b</code>. The matched <code>aba</code> ends in <code>a</code>, which is also a pattern prefix, so set <code>j = pi[2] = 1</code> and keep examining <code>t[3]</code>.",
      },
      lines: [9], watch: { i: 3, j: 1 }, verdict: "run", fit: "all",
      scene: picture(3, { t2: good, t3: bad, p0: good, p1: active, p3: bad, pi2: active }, "j = pi[3 − 1] = 1", "i = 3"),
    },
    {
      title: { vi: "Thử lại tại i = 3", en: "Retry at i = 3" }, kind: "step",
      body: {
        vi: "<code>p[1] = b</code> vẫn lệch với <code>t[3] = a</code>, nên <code>j = pi[0] = 0</code>. Giờ <code>p[0] = a</code> khớp tại chính vị trí 3, đưa <code>j</code> lên 1.",
        en: "<code>p[1] = b</code> still mismatches <code>t[3] = a</code>, so <code>j = pi[0] = 0</code>. Now <code>p[0] = a</code> matches at the same index 3, raising <code>j</code> to 1.",
      },
      lines: [9, 10], watch: { i: 3, j: 1 }, verdict: "run", fit: "all",
      scene: picture(3, { t3: good, p0: good, p1: bad, pi0: active }, "j = pi[1 − 1] = 0", "j = 0 + (a = a) = 1"),
    },
    {
      title: { vi: "Ghi nhận vị trí 3", en: "Report position 3" }, kind: "answer",
      body: {
        vi: "Ba ký tự <code>bab</code> tiếp theo đưa <code>j</code> từ 1 lên 4 khi <code>i = 6</code>. Khớp cả mẫu, nên ghi vị trí bắt đầu <code>6 − 4 + 1 = 3</code>.",
        en: "The next three letters, <code>bab</code>, take <code>j</code> from 1 to 4 at <code>i = 6</code>. The full pattern matches, so record its start at <code>6 − 4 + 1 = 3</code>.",
      },
      lines: [10, 11, 12], watch: { i: 6, j: 4, match: 3 }, verdict: "ac", fit: "all", scene: answer,
    },
    {
      title: { vi: "Chỉ tiến trong văn bản", en: "Scan the text forward" }, kind: "recap",
      body: {
        vi: "Các lần nhảy lần lượt thử những hậu tố có thể nối tiếp mẫu, nên giữ nguyên <code>i</code> vẫn tìm đủ kết quả. Sau khi khớp, đặt <code>j = pi[3] = 2</code> để giữ <code>ab</code> cho kết quả chồng lấn. Mỗi lần nhảy giảm <code>j</code>, còn mỗi bước tiến tăng tối đa 1, nên tổng thời gian là O(n + m) và bộ nhớ phụ là O(m), ngoài danh sách kết quả.",
        en: "Fallbacks try the possible suffixes that can extend the pattern, so keeping <code>i</code> fixed preserves all matches. After a full match, set <code>j = pi[3] = 2</code> to keep <code>ab</code> for overlaps. Each fallback reduces <code>j</code> and each advance adds at most 1, giving O(n + m) time and O(m) extra space apart from the result list.",
      },
      lines: [5, 6, 9, 10, 13], watch: { i: 6, j: 2, match: 3 }, verdict: "ac", fit: "all",
      scene: { ...answer, pi3: { text: String(PI[3]), ...active }, extra: { text: "j = pi[3] = 2", o: 1 } },
    },
  ],
};

export function setup(scene: any, shapes: any) {
  const rows = [
    { id: "t", values: [...T], y: 0, sub: true },
    { id: "p", values: [...P], y: 2.7, sub: true },
    { id: "pi", values: PI.map(() => "?"), y: 5.4, sub: false },
  ];
  rows.forEach(({ id, values, y, sub }) => {
    scene.add(id, { shape: shapes.pill({ text: id }), x: -0.94, y });
    values.forEach((c, i) => scene.add(`${id}${i}`, {
      shape: shapes.block({ label: c, sub: sub ? i : undefined, w: 42, h: 32 }), x: i, y,
    }));
  });
  scene.add("calc", { shape: shapes.pill(), x: 2.6, y: 7.05, o: 0 });
  scene.add("extra", { shape: shapes.pill(), x: 2.6, y: 8.2, o: 0 });
}
