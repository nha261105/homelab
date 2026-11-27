import type { Lesson, SceneMap } from "../../../lib/types";

const S = "banana";
const indices = [...S].map((_, i) => i);
const alphabet = [...new Set(S)].sort();
const ranks = [[...S].map((c) => alphabet.indexOf(c))];

function pairs(k: number, r: number[]) {
  return indices.map((i) => [r[i], r[i + k] ?? -1]);
}

for (let k = 1; k <= 2; k *= 2) {
  const keys = pairs(k, ranks.at(-1)!);
  const order = indices.toSorted((a, b) => keys[a][0] - keys[b][0] || keys[a][1] - keys[b][1]);
  const next = indices.map(() => 0);
  order.forEach((i, slot) => {
    if (slot === 0) return;
    const prev = order[slot - 1];
    next[i] = next[prev] + Number(keys[prev].some((rank, side) => rank !== keys[i][side]));
  });
  ranks.push(next);
}

const sa = indices.toSorted((a, b) => ranks[2][a] - ranks[2][b]);
const lcp = sa.map((start, slot) => {
  if (!slot) return 0;
  const prev = sa[slot - 1];
  let len = 0;
  while (S[start + len] !== undefined && S[start + len] === S[prev + len]) len++;
  return len;
});

function doubling(round: number, focus: number[], formula = ""): SceneMap {
  const scene: SceneMap = {
    pos: { text: "i" }, suffix: { text: "s[i:]" },
    first: { text: "r", o: round >= 0 ? 1 : 0 },
    key: { text: "pair", o: round > 0 ? 1 : 0 },
    last: { text: "r′", o: round > 0 ? 1 : 0 },
    calc: { text: formula, o: formula ? 1 : 0, cls: "is-active" },
  };
  const previous = ranks[Math.max(0, round - 1)];
  const k = round === 2 ? 2 : 1;
  const keys = pairs(k, previous);
  indices.forEach((i) => {
    const active = focus.includes(i);
    scene[`i${i}`] = { text: String(i), cls: active ? "is-active" : "" };
    scene[`s${i}`] = { text: S.slice(i), cls: active ? "is-active" : "" };
    scene[`a${i}`] = { text: String(previous[i]), o: round >= 0 ? 1 : 0, cls: active ? "is-active" : "" };
    scene[`p${i}`] = { text: `(${keys[i].join(",")})`, o: round > 0 ? 1 : 0, cls: active ? "is-active" : "" };
    scene[`b${i}`] = { text: String(ranks[round]?.[i] ?? ""), o: round > 0 ? 1 : 0, cls: active ? "is-good" : "" };
  });
  return scene;
}

function sorted(through: number, focus: number[], formula: string, answer = false): SceneMap {
  const scene: SceneMap = {
    pos: { text: "SA" }, suffix: { text: "s[SA:]" },
    first: { text: "LCP", o: through >= 0 ? 1 : 0 },
    key: { text: "", o: 0 }, last: { text: "", o: 0 },
    calc: { text: formula, o: 1, cls: answer ? "v-eq" : "is-active" },
  };
  sa.forEach((start, slot) => {
    const active = focus.includes(slot);
    scene[`i${slot}`] = { text: String(start), cls: active ? "is-active" : "" };
    scene[`s${slot}`] = { text: S.slice(start), cls: active ? "is-active" : "" };
    scene[`a${slot}`] = {
      text: slot === 0 || start <= through ? String(lcp[slot]) : "·",
      o: through >= 0 ? 1 : 0, cls: active ? "is-good" : "",
    };
    scene[`p${slot}`] = { text: "", o: 0 };
    scene[`b${slot}`] = { text: "", o: 0 };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "strings-adv", slug: "suffix-array",
  title: { vi: "Mảng hậu tố", en: "Suffix array" },
  added: "2026-11-27", level: "hard", minutes: 13, time: "O(n log² n)", memory: "O(n)",
  summary: {
    vi: "Sắp hậu tố bằng cách ghép các hạng, rồi đo tiền tố chung của từng cặp đứng cạnh nhau.",
    en: "Sort suffixes by combining ranks, then measure the common prefix of each neighboring pair.",
  },
  goal: {
    vi: "Dựng mảng hậu tố và mảng LCP của <b>banana</b>",
    en: "Build the suffix array and LCP array for <b>banana</b>",
  },
  codeLang: "C++17",
  code: [
    'int n = s.size();',
    'vector&lt;int&gt; sa(n), r(s.begin(), s.end()), nr(n), lcp(n);',
    'iota(sa.begin(), sa.end(), 0);',
    'for (int k = 1; k &lt; n; k *= 2) {',
    '  auto key = [&amp;](int i) { return pair{r[i], i+k &lt; n ? r[i+k] : -1}; };',
    '  sort(sa.begin(), sa.end(), [&amp;](int a, int b) { return key(a) &lt; key(b); });',
    '  nr[sa[0]] = 0;',
    '  for (int j = 1; j &lt; n; ++j)',
    '    nr[sa[j]] = nr[sa[j-1]] + (key(sa[j-1]) != key(sa[j]));',
    '  r.swap(nr);',
    '  if (r[sa.back()] == n-1) break;',
    '}',
    'for (int j = 0; j &lt; n; ++j) r[sa[j]] = j;',
    'for (int i = 0, h = 0; i &lt; n; ++i) {',
    '  int j = r[i];',
    '  if (j == 0) { h = 0; continue; }',
    '  int p = sa[j-1];',
    '  while (i+h &lt; n &amp;&amp; p+h &lt; n &amp;&amp; s[i+h] == s[p+h]) ++h;',
    '  lcp[j] = h; h = max(0, h-1);',
    '}',
  ],
  watch: [
    { key: "k", label: "k" }, { key: "i", label: "i" }, { key: "h", label: "h" },
    { key: "j", label: { vi: "hạng j", en: "rank j" } },
  ],
  practice: [
    { src: "CSES 2106", name: "Repeating Substring", lv: "★★★", url: "https://cses.fi/problemset/task/2106" },
    { src: "CSES 2105", name: "Distinct Substrings", lv: "★★★", url: "https://cses.fi/problemset/task/2105" },
  ],
  sceneOptions: { unit: 61 },
  legend: [
    { cls: "acc", label: { vi: "hậu tố đang xét", en: "suffixes in focus" } },
    { cls: "ac", label: { vi: "hạng mới hoặc LCP", en: "new rank or LCP" } },
  ],
  steps: [
    {
      title: { vi: "Sắp thứ tự hậu tố", en: "Sort the suffixes" }, kind: "problem",
      body: {
        vi: "<code>banana</code> có 6 hậu tố. Ta cần lưu vị trí bắt đầu của chúng theo thứ tự từ điển. Nếu so trực tiếp từng cặp trong lúc sắp xếp, một lần so có thể phải đọc O(n) chữ.",
        en: "<code>banana</code> has 6 suffixes. Store their starting positions in lexicographic order. When sorting by comparing suffixes directly, one comparison can read O(n) characters.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: doubling(-1, []),
    },
    {
      title: { vi: "Xếp hạng một chữ", en: "Rank one character" }, kind: "concept",
      body: {
        vi: "Đầu tiên chỉ nhìn chữ đầu. Với <code>a &lt; b &lt; n</code>, hình đánh hạng lần lượt 0, 1, 2. Code dùng mã ký tự chữ thường ở lượt đầu, cho cùng thứ tự và cùng các nhóm bằng nhau.",
        en: "Start by comparing only the first letter. With <code>a &lt; b &lt; n</code>, the diagram uses ranks 0, 1, 2. The code uses lowercase character codes for this first pass, giving the same order and ties.",
      },
      lines: [2, 3, 4], watch: { k: 1 }, verdict: "run", fit: "all",
      scene: doubling(0, [1, 3, 5], "a < b < n   ·   r = 0, 1, 2"),
    },
    {
      title: { vi: "Ghép hai hạng", en: "Combine two ranks" }, kind: "step",
      body: {
        vi: "Với <code>k = 1</code>, ghép <code>(r[i], r[i+1])</code>. Hậu tố ở 1 và 3 cùng bắt đầu bằng <code>an</code>, nên cặp <code>(0, 2)</code> nhận cùng hạng mới 1. Ở 5, nửa sau đã hết xâu, nên dùng −1, nhỏ hơn mọi hạng hợp lệ.",
        en: "With <code>k = 1</code>, combine <code>(r[i], r[i+1])</code>. Suffixes 1 and 3 both start with <code>an</code>, so their shared pair <code>(0, 2)</code> gets new rank 1. At 5, the second half is beyond the end, so use −1, below every valid rank.",
      },
      lines: [4, 5, 6, 7, 8, 9, 10], watch: { k: 1, i: 1 }, verdict: "run", fit: "all",
      scene: doubling(1, [1, 3, 5], "(0,−1) < (0,2)   ·   r′[1] = r′[3] = 1"),
    },
    {
      title: { vi: "Gỡ hạng bằng nhau", en: "Break the rank ties" }, kind: "step",
      body: {
        vi: "Lượt <code>k = 2</code> lấy hạng của hai nửa dài tối đa 2. Ở 1, <code>an</code> nối với <code>an</code> cho cặp <code>(1, 1)</code>. Ở 3, <code>an</code> nối với <code>a</code> cho <code>(1, 0)</code>, nên 3 đứng trước 1. Sáu hạng giờ đều khác nhau.",
        en: "With <code>k = 2</code>, use the ranks of two halves of up to 2 letters. At 1, <code>an</code> followed by <code>an</code> gives <code>(1, 1)</code>. At 3, <code>an</code> followed by <code>a</code> gives <code>(1, 0)</code>, so 3 comes before 1. All six ranks are now distinct.",
      },
      lines: [4, 5, 6, 9, 10, 11], watch: { k: 2, i: 3 }, verdict: "run", fit: "all",
      scene: doubling(2, [1, 3], "(1,0) < (1,1)   ·   r′[3] < r′[1]"),
    },
    {
      title: { vi: "Đọc mảng hậu tố", en: "Read the suffix array" }, kind: "step",
      body: {
        vi: "Khi mọi hạng đều khác nhau, các khối đầu đã đủ để phân thứ tự toàn bộ hậu tố. Đọc vị trí theo hạng tăng dần được <code>sa = [5, 3, 1, 0, 4, 2]</code>.",
        en: "Once the ranks are distinct, the starting blocks already decide the order of every whole suffix. Read the starts in rank order to obtain <code>sa = [5, 3, 1, 0, 4, 2]</code>.",
      },
      lines: [6, 10, 11, 13], watch: { k: 2 }, verdict: "run", fit: "all",
      scene: sorted(-1, [], "sa = [5, 3, 1, 0, 4, 2]"),
    },
    {
      title: { vi: "Đo tiền tố chung", en: "Measure the common prefix" }, kind: "step",
      body: {
        vi: "Kasai duyệt hậu tố theo vị trí gốc <code>i</code>, rồi ghi kết quả vào hạng <code>j = r[i]</code>. Ở <code>i = 1</code>, <code>anana</code> đứng ngay sau <code>ana</code> trong <code>sa</code>. Ba chữ đầu trùng nhau, nên <code>lcp[2] = 3</code>.",
        en: "Kasai visits suffixes by original start <code>i</code> and writes the result at rank <code>j = r[i]</code>. At <code>i = 1</code>, <code>anana</code> immediately follows <code>ana</code> in <code>sa</code>. Their first three letters match, so <code>lcp[2] = 3</code>.",
      },
      lines: [13, 14, 15, 17, 18, 19], watch: { i: 1, j: 2, h: 3 }, verdict: "run", fit: "all",
      scene: sorted(1, [1, 2], "LCP(ana, anana) = 3"),
    },
    {
      title: { vi: "Giữ lại hai chữ", en: "Keep two matching letters" }, kind: "step",
      body: {
        vi: "Bỏ chữ đầu ở 1 và 3 cho <code>nana</code> và <code>na</code>, còn ít nhất <code>3 − 1 = 2</code> chữ chung. Lần này <code>na</code> đúng là hậu tố đứng ngay trước <code>nana</code>, nên Kasai bắt đầu ở 2, chạm cuối <code>na</code> và ghi <code>lcp[5] = 2</code>.",
        en: "Drop the first letter at 1 and 3 to get <code>nana</code> and <code>na</code>, keeping at least <code>3 − 1 = 2</code> common letters. Here <code>na</code> is indeed immediately before <code>nana</code>, so Kasai starts at 2, reaches the end of <code>na</code>, and writes <code>lcp[5] = 2</code>.",
      },
      lines: [14, 15, 17, 18, 19], watch: { i: 2, j: 5, h: 2 }, verdict: "run", fit: "all",
      scene: sorted(2, [4, 5], "h = 3 − 1 = 2   ·   lcp[5] = 2"),
    },
    {
      title: { vi: "Đọc mảng LCP", en: "Read the LCP array" }, kind: "answer",
      body: {
        vi: "Ở 3, <code>ana</code> và <code>a</code> chung 1 chữ. Ở 4, <code>na</code> và <code>banana</code> chung 0 chữ. Ô đầu quy ước bằng 0, nên cả mảng là <code>[0, 1, 3, 0, 0, 2]</code> với giá trị lớn nhất là 3, ứng với xâu lặp <code>ana</code>.",
        en: "At start 3, <code>ana</code> and <code>a</code> share 1 letter. At start 4, <code>na</code> and <code>banana</code> share 0. Set the first entry to 0 by convention, so the array is <code>[0, 1, 3, 0, 0, 2]</code>, with maximum 3 for the repeated substring <code>ana</code>.",
      },
      lines: [14, 16, 18, 19], watch: { h: 3, j: 2 }, verdict: "ac", fit: "all",
      scene: sorted(5, [1, 2], "max(0,1,3,0,0,2) = 3"),
    },
    {
      title: { vi: "Tái dùng phần đã biết", en: "Reuse known prefixes" }, kind: "recap",
      body: {
        vi: "Nhân đôi cần O(log n) lượt sắp xếp, tổng O(n log² n) thời gian và O(n) bộ nhớ. Bỏ chữ đầu giữ ít nhất <code>h − 1</code> chữ chung: nếu hậu tố đứng ngay trước thay đổi, nó vẫn nằm giữa hai hậu tố có chung tiền tố ấy. Vì vậy <code>h</code> giảm tối đa 1 mỗi lượt (trừ lúc gặp hạng 0 một lần), nên Kasai tốn O(n) thời gian.",
        en: "Doubling takes O(log n) sorting passes, for O(n log² n) time and O(n) space. Dropping the first letter keeps at least <code>h − 1</code> common letters: if the immediate predecessor changes, it still lies between the two suffixes sharing that prefix. Thus <code>h</code> decreases by at most 1 per iteration aside from the single rank-zero reset, so Kasai takes O(n) time.",
      },
      lines: [4, 5, 6, 16, 18, 19], watch: { h: 3, j: 2 }, verdict: "ac", fit: "all",
      scene: sorted(5, [1, 2], "21 − (0+1+3+0+0+2) = 15"),
      note: {
        vi: "Mảng LCP cũng cho 15 xâu con phân biệt: từ 21 tiền tố của các hậu tố, trừ các tiền tố đã có ở hậu tố đứng ngay trước.",
        en: "The LCP array also gives 15 distinct substrings: of 21 suffix prefixes, subtract those already found in the previous suffix.",
      },
    },
  ],
};

export function setup(scene: any, shapes: any) {
  const rows = [
    ["pos", "i", 0], ["suffix", "s[i:]", 1.3], ["first", "r", 2.6],
    ["key", "pair", 3.9], ["last", "r′", 5.2],
  ] as const;
  rows.forEach(([id, label, y]) => scene.add(id, {
    shape: shapes.pill({ text: label, pad: 6, h: 24 }), y,
  }));
  indices.forEach((i) => {
    const x = 1.18 + i;
    (["i", "s", "a", "p", "b"] as const).forEach((row, j) => {
      const isTextRow = row === "s" || row === "p";
      scene.add(`${row}${i}`, {
        shape: isTextRow ? shapes.pill({ pad: 4, h: 30 }) : shapes.block({ w: 54, h: 28, depth: 4, r: 6 }),
        s: isTextRow ? 0.86 : 1, x, y: rows[j][2],
      });
    });
  });
  scene.add("calc", { shape: shapes.pill(), x: 3.02, y: 6.5, o: 0 });
}
