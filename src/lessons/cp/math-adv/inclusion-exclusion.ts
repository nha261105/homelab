import type { Lesson, SceneMap } from "../../../lib/types";

const N = 30;
const primes = [2, 3, 5];
const sets = [
  { mask: 1, x: -44, y: -12 },
  { mask: 2, x: 136, y: -12 },
  { mask: 4, x: 46, y: 121 },
  { mask: 3, x: 46, y: -36 },
  { mask: 5, x: -2, y: 47 },
  { mask: 6, x: 94, y: 47 },
  { mask: 7, x: 46, y: 26 },
];
const exact = Array<number>(8).fill(0);
for (let value = 1; value <= N; value++) {
  const mask = primes.reduce((bits, p, j) => bits | (value % p === 0 ? 1 << j : 0), 0);
  exact[mask]++;
}

const fit = ["a", "b", "c", "set-a", "set-b", "set-c", ...sets.map(({ mask }) => `r${mask}`), "calc", "total"];

function venn(
  activeSets: string[] = [], regions: number[] = [], calc = "", total = "", sign = "",
): SceneMap {
  const scene: SceneMap = {
    calc: { text: calc, o: calc ? 1 : 0, cls: sign },
    total: { text: total, o: total ? 1 : 0, cls: sign },
  };
  for (const id of ["a", "b", "c"]) {
    const active = activeSets.includes(id);
    scene[id] = { o: active ? 1 : 0.4, cls: active && sign === "v-gt" ? "is-bad" : "" };
  }
  for (const { mask } of sets) {
    const active = regions.includes(mask);
    scene[`r${mask}`] = {
      o: regions.length === 0 || active ? 1 : 0.36,
      cls: active ? sign : "",
      ...(active ? { fx: { type: "pulse", delay: 240 } } : {}),
    };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "math-adv", slug: "inclusion-exclusion",
  title: { vi: "Bao hàm – loại trừ", en: "Inclusion–exclusion" },
  added: "2026-11-27", level: "hard", minutes: 9,
  summary: {
    vi: "Cộng số phần tử từng tập, trừ các giao đôi rồi cộng lại giao ba để đếm hợp.",
    en: "Count a union by adding each set, subtracting pairwise overlaps, then restoring the triple overlap.",
  },
  time: "O(k · 2ᵏ)", memory: "O(1)",
  goal: {
    vi: "Trong đoạn <b>1 đến 30</b>, đếm các số chia hết cho ít nhất một trong ba số <b>2, 3, 5</b>",
    en: "Count integers from <b>1 to 30</b> divisible by at least one of <b>2, 3, 5</b>",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">long long</span> ans = 0;',
    '<span class="kw">for</span> (<span class="kw">int</span> mask = 1; mask &lt; (1 &lt;&lt; k); ++mask) {',
    '  <span class="kw">long long</span> cnt = n;',
    '  <span class="kw">int</span> bits = 0;',
    '  <span class="kw">for</span> (<span class="kw">int</span> j = 0; j &lt; k; ++j) {',
    '    <span class="kw">if</span> (mask &amp; (1 &lt;&lt; j)) {',
    '      cnt /= p[j];',
    '      ++bits;',
    '    }',
    '  }',
    '  ans += (bits % 2 ? cnt : -cnt);',
    '}',
    '<span class="kw">return</span> ans;',
  ],
  watch: [
    { key: "bits", label: "bits" },
    { key: "terms", label: { vi: "các số hạng", en: "terms" } },
    { key: "ans", label: "ans" },
    { key: "copies", label: { vi: "số lần tính 30", en: "copies of 30" } },
  ],
  practice: [
    { src: "CSES 2185", name: "Prime Multiples", lv: "★★☆", url: "https://cses.fi/problemset/task/2185" },
    { src: "CSES 2417", name: "Counting Coprime Pairs", lv: "★★★", url: "https://cses.fi/problemset/task/2417" },
  ],
  sceneOptions: { unit: 50 },
  legend: [
    { cls: "acc", label: { vi: "tập đang xét", en: "sets in focus" } },
    { cls: "wa", label: { vi: "giao cần trừ", en: "overlap to subtract" } },
    { cls: "ac", label: { vi: "giao được cộng lại", en: "restored overlap" } },
  ],
  steps: [
    {
      title: { vi: "Đếm hợp ba tập", en: "Count the union" }, kind: "problem",
      body: {
        vi: "Gọi A, B, C lần lượt là tập bội của 2, 3, 5 trong đoạn 1 đến 30. Mỗi nhãn trong biểu đồ Venn đếm các số thuộc đúng vùng đó, chẳng hạn 8 số chỉ thuộc A. Quét từng số để tìm hợp tốn O(nk) với k ước cho trước.",
        en: "Let A, B, and C be the multiples of 2, 3, and 5 from 1 to 30. Each Venn label counts the integers in that exact region. For example, 8 belong to A alone. Scanning every integer takes O(nk) for k given divisors.",
      },
      lines: [], watch: {}, verdict: "run", fit, scene: venn(),
    },
    {
      title: { vi: "Cộng từng tập", en: "Add the single sets" }, kind: "concept",
      body: {
        vi: "Chia 30 lần lượt cho 2, 3 và 5 rồi lấy phần nguyên, ta được 15, 10 và 6. Cộng lại được 31 lượt đếm, trong đó riêng số 30 xuất hiện cả 3 lần.",
        en: "Integer division of 30 by 2, 3, and 5 gives 15, 10, and 6. Adding them gives 31 counts, with the integer 30 appearing three times.",
      },
      lines: [2, 3, 5, 6, 7, 8, 11], watch: { bits: 1, terms: "15 + 10 + 6", ans: 31, copies: 3 },
      verdict: "run", fit, scene: venn(["a", "b", "c"], [], "⌊30/2⌋, ⌊30/3⌋, ⌊30/5⌋", "15 + 10 + 6 = 31"),
    },
    {
      title: { vi: "Tính một giao đôi", en: "Count one pairwise overlap" }, kind: "step",
      body: {
        vi: "Giao A ∩ B gồm các bội của <code>lcm(2, 3) = 6</code>. Vùng riêng của giao này có 4 số, vùng giữa có thêm 1 số, khớp với <code>⌊30/6⌋ = 5</code>.",
        en: "The overlap A ∩ B consists of multiples of <code>lcm(2, 3) = 6</code>. Four integers belong to A and B alone and one more is in the center, matching <code>⌊30/6⌋ = 5</code>.",
      },
      note: {
        vi: "Với các số nguyên tố phân biệt, BCNN bằng tích. Chia nguyên liên tiếp cho từng số để tránh phải tính tích.",
        en: "For distinct primes, the LCM is their product. Divide by each prime in turn to avoid forming that product.",
      },
      lines: [3, 5, 6, 7, 8], watch: { bits: 2, terms: "5" }, verdict: "run", fit,
      scene: venn(["a", "b"], [3, 7], "⌊30/(2×3)⌋ = 5", "4 + 1 = 5", "v-gt"),
    },
    {
      title: { vi: "Trừ cả ba giao đôi", en: "Subtract all pairwise overlaps" }, kind: "step",
      body: {
        vi: "Các giao A ∩ C và B ∩ C lần lượt có <code>⌊30/10⌋ = 3</code> và <code>⌊30/15⌋ = 2</code> số. Trừ cả ba giao còn 21 lượt đếm. Số 30 bị trừ 3 lần nên hiện được tính 0 lần.",
        en: "The overlaps A ∩ C and B ∩ C contain <code>⌊30/10⌋ = 3</code> and <code>⌊30/15⌋ = 2</code> integers. Subtracting all three leaves 21 counts. The integer 30 was subtracted three times, leaving zero copies.",
      },
      lines: [6, 7, 8, 11], watch: { bits: 2, terms: "−5 − 3 − 2", ans: 21, copies: 0 },
      verdict: "run", fit,
      scene: venn(["a", "b", "c"], [3, 5, 6, 7], "⌊30/6⌋, ⌊30/10⌋, ⌊30/15⌋", "31 − 5 − 3 − 2 = 21", "v-gt"),
    },
    {
      title: { vi: "Cộng lại giao ba", en: "Restore the triple overlap" }, kind: "answer",
      body: {
        vi: "Giao A ∩ B ∩ C có đúng một bội của <code>2 × 3 × 5 = 30</code>. Cộng vùng giữa trở lại, số 30 được tính đúng một lần và kết quả là <code>21 + 1 = 22</code>.",
        en: "The triple overlap contains exactly one multiple of <code>2 × 3 × 5 = 30</code>. Adding the center back counts the integer 30 once and yields <code>21 + 1 = 22</code>.",
      },
      lines: [7, 8, 11, 13], watch: { bits: 3, terms: "+1", ans: 22, copies: 1 },
      verdict: "ac", fit, scene: venn(["a", "b", "c"], [7], "⌊30/(2×3×5)⌋ = 1", "21 + 1 = 22", "v-eq"),
    },
    {
      title: { vi: "Vì sao dấu xen kẽ", en: "Why the signs alternate" }, kind: "recap",
      body: {
        vi: "Một số nằm trong t tập đóng góp 1 vì <code>(1 − 1)ᵗ = 0</code> với t ≥ 1, còn số nằm ngoài hợp đóng góp 0. Các tập con lẻ được cộng, các tập con chẵn khác rỗng bị trừ. Với k số nguyên tố, duyệt <code>2ᵏ − 1</code> mặt nạ và xét k bit mỗi lượt tốn O(k · 2ᵏ) thời gian, O(1) bộ nhớ phụ.",
        en: "An integer in t sets contributes 1 because <code>(1 − 1)ᵗ = 0</code> for t ≥ 1, while integers outside the union contribute 0. Add odd subsets and subtract nonempty even subsets. Checking k bits for each of <code>2ᵏ − 1</code> masks takes O(k · 2ᵏ) time and O(1) auxiliary space.",
      },
      lines: [2, 5, 11, 13], watch: { ans: 22, copies: 1 }, verdict: "ac", fit,
      scene: venn(["a", "b", "c"], [], "30: 3 − 3 + 1 = 1", "31 − 10 + 1 = 22", "v-eq"),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const [id, x, y] of [["a", 0, 0], ["b", 92, 0], ["c", 46, 78]] as const) {
    scene.add(id, { shape: shapes.frame({ h: 150, top: -75, r: 75 }), layer: "back", x: x / 50, y: y / 25, w: 150 });
  }
  for (const [id, text, x, y] of [["a", "A: 2", -52, -51], ["b", "B: 3", 144, -51], ["c", "C: 5", 102, 136]] as const) {
    scene.add(`set-${id}`, { shape: shapes.pill({ text, h: 24, pad: 6 }), x: x / 50, y: y / 25 });
  }
  for (const { mask, x, y } of sets) {
    scene.add(`r${mask}`, { shape: shapes.pill({ text: exact[mask], h: 24, pad: 8 }), x: x / 50, y: (y + 12) / 25 });
  }
  scene.add("calc", { shape: shapes.pill(), x: 46 / 50, y: 188 / 25, o: 0 });
  scene.add("total", { shape: shapes.pill(), x: 46 / 50, y: 220 / 25, o: 0 });
}
