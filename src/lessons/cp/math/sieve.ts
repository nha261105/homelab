import type { Lesson, SceneMap } from "../../../lib/types";

const N = 50;
const COLUMNS = 8;
const NUMBERS = Array.from({ length: N }, (_, i) => i + 1);
const PIVOTS = [2, 3, 5, 7];

function grid(passes: number, text: string, done = false): SceneMap {
  const pivot = PIVOTS[passes - 1];
  const cells: SceneMap = Object.fromEntries(NUMBERS.map((k) => {
    const firstFactor = PIVOTS.slice(0, passes).find((p) => k >= p * p && k % p === 0);
    const cls = passes < 0 ? "" : k === 1 ? "is-out"
      : firstFactor ? firstFactor === pivot && !done ? "is-bad" : "is-out"
      : done ? "is-good" : k === pivot ? "is-active" : "";
    return [`n${k}`, { cls, delay: cls === "is-bad" ? 200 : 0 }];
  }));
  cells.calc = { text, cls: done ? "v-eq" : "" };
  return cells;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "math",
  slug: "sieve",
  title: { vi: "Sàng nguyên tố", en: "Sieve of Eratosthenes" },
  added: "2026-11-27",
  summary: {
    vi: "Gạch các bội theo từng lượt để tìm mọi số nguyên tố đến 50.",
    en: "Cross out multiples in passes to find every prime through 50.",
  },
  level: "basic",
  minutes: 7,
  time: "O(n log log n)",
  memory: "O(n)",
  goal: { vi: "Tìm mọi số nguyên tố trong đoạn <b>1..50</b>", en: "Find all primes in <b>1..50</b>" },
  codeLang: "C++17",
  code: [
    'std::vector&lt;<span class="kw">bool</span>&gt; prime(n + 1, <span class="kw">true</span>);',
    'prime[0] = <span class="kw">false</span>;',
    '<span class="kw">if</span> (n &gt;= 1) prime[1] = <span class="kw">false</span>;',
    '<span class="kw">for</span> (<span class="kw">long long</span> p = 2; p * p &lt;= n; ++p) {',
    '  <span class="kw">if</span> (!prime[p]) <span class="kw">continue</span>;',
    '  <span class="kw">for</span> (<span class="kw">long long</span> j = p * p; j &lt;= n; j += p)',
    '    prime[j] = <span class="kw">false</span>;',
    '}',
  ],
  watch: [
    { key: "p", label: "p" },
    { key: "start", label: "p²" },
    { key: "left", label: { vi: "ô còn lại", en: "entries left" } },
  ],
  practice: [
    { src: "LeetCode 204", name: "Count Primes", lv: "★★☆", url: "https://leetcode.com/problems/count-primes/" },
    { src: "CSES 1713", name: "Counting Divisors", lv: "★★☆", url: "https://cses.fi/problemset/task/1713" },
  ],
  sceneOptions: { unit: 42, view: [-55, -100, 400, 355] },
  legend: [
    { cls: "acc", label: { vi: "số nguyên tố dùng để sàng", en: "prime used for this pass" } },
    { cls: "wa", label: { vi: "bội vừa bị gạch", en: "multiples just crossed out" } },
    { cls: "dim", label: { vi: "đã loại", en: "ruled out" } },
    { cls: "ac", label: { vi: "số nguyên tố", en: "primes" } },
  ],
  steps: [
    {
      title: { vi: "Tìm các số nguyên tố", en: "Find the primes" }, kind: "problem",
      body: {
        vi: "Ta cần tìm mọi số nguyên tố từ 1 đến 50. Nếu kiểm tra từng số riêng, ta phải thử nhiều phép chia cho cùng một ước, chẳng hạn 2 với 4, 6, 8 và các số chẵn tiếp theo.",
        en: "We want all primes from 1 through 50. Testing candidates separately repeats trial division by the same factor, such as 2 for 4, 6, 8, and the even numbers that follow.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: grid(-1, "1 ≤ k ≤ 50"),
    },
    {
      title: { vi: "Loại số 1", en: "Rule out 1" }, kind: "concept",
      body: {
        vi: "Số nguyên tố có đúng hai ước dương, còn 1 chỉ có một ước. Mảng <code>prime</code> cũng loại 0, ô nằm ngoài lưới đang vẽ. Từ 2 đến 50 còn 49 ứng viên.",
        en: "A prime has exactly two positive divisors, whereas 1 has only one. The <code>prime</code> array also excludes 0, which lies outside this grid. That leaves 49 candidates from 2 through 50.",
      },
      lines: [1, 2, 3], watch: { left: 49 }, verdict: "run", fit: "all", scene: grid(0, "prime[0] = prime[1] = false"),
    },
    {
      title: { vi: "Gạch bội của 2", en: "Cross out multiples of 2" }, kind: "step",
      body: {
        vi: "Giữ 2 vì nó là số nguyên tố. Bắt đầu ở <code>2² = 4</code>, mỗi lần cộng 2 để gạch 4, 6, 8 và các bội tiếp theo đến 50.",
        en: "Keep 2 because it is prime. Start at <code>2² = 4</code> and add 2 each time to cross out 4, 6, 8, and every successive multiple through 50.",
      },
      lines: [4, 5, 6, 7], watch: { p: 2, start: 4, left: 25 }, verdict: "run", fit: "all",
      scene: grid(1, "j = 2², 2² + 2, …, 50"),
    },
    {
      title: { vi: "Gạch bội của 3", en: "Cross out multiples of 3" }, kind: "step",
      body: {
        vi: "Số 3 chưa bị gạch, nên bắt đầu từ <code>3² = 9</code>. Bội 6 đã bị lượt 2 xử lý, và trong lượt này chỉ 9, 15, 21, 27, 33, 39, 45 đổi trạng thái.",
        en: "3 is still a candidate, so start at <code>3² = 9</code>. The pass for 2 already crossed out 6, and only 9, 15, 21, 27, 33, 39, and 45 change state in this pass.",
      },
      note: {
        vi: "Bội lớn hơn p nhưng nhỏ hơn p² có dạng p·k với 2 ≤ k < p, nên đã bị gạch theo một thừa số nguyên tố của k.",
        en: "A multiple strictly between p and p² has the form p·k with 2 ≤ k < p, so a prime factor of k already crossed it out.",
      },
      lines: [4, 5, 6, 7], watch: { p: 3, start: 9, left: 18 }, verdict: "run", fit: "all",
      scene: grid(2, "j = 3², 3² + 3, …, 48"),
    },
    {
      title: { vi: "Gạch bội của 5", en: "Cross out multiples of 5" }, kind: "step",
      body: {
        vi: "Bỏ qua 4 vì đã bị gạch. Các ô từ <code>5² = 25</code> trở đi, cách nhau 5, đều là hợp số. Chỉ 25 và 35 còn cần gạch.",
        en: "Skip 4 because it was already crossed out. Start at <code>5² = 25</code> and advance by 5 to visit composites. Only 25 and 35 still need to be crossed out.",
      },
      lines: [5, 6, 7], watch: { p: 5, start: 25, left: 16 }, verdict: "run", fit: "all",
      scene: grid(3, "j = 5², 5² + 5, …, 50"),
    },
    {
      title: { vi: "Gạch bội của 7", en: "Cross out multiples of 7" }, kind: "step",
      body: {
        vi: "Số 6 đã bị gạch ở lượt 2. Đến 7, bắt đầu tại <code>7² = 49</code>. Cộng thêm 7 ra 56, vượt 50, vậy lượt này chỉ gạch 49.",
        en: "The pass for 2 already crossed out 6. For 7, start at <code>7² = 49</code>. Adding 7 gives 56, beyond 50, so this pass crosses out just 49.",
      },
      lines: [5, 6, 7], watch: { p: 7, start: 49, left: 15 }, verdict: "run", fit: "all",
      scene: grid(4, "j = 7² = 49"),
    },
    {
      title: { vi: "Đọc các ô còn lại", en: "Read the remaining entries" }, kind: "answer",
      body: {
        vi: "Vòng lặp dừng vì <code>8² = 64</code> đã vượt 50. Còn đúng 15 ô nguyên tố, từ 2 đến 47.",
        en: "The loop stops because <code>8² = 64</code> exceeds 50. Exactly 15 prime cells remain, from 2 through 47.",
      },
      lines: [4], watch: { p: 8, start: 64, left: 15 }, verdict: "ac", fit: "all",
      scene: grid(4, "8² = 64 > 50", true),
    },
    {
      title: { vi: "Dừng ở căn bậc hai", en: "Stop at the square root" }, kind: "recap",
      body: {
        vi: "Mỗi hợp số có một thừa số nguyên tố không vượt quá căn bậc hai của nó, nên các lượt đến 7 đã đủ cho mốc 50. Tổng số lần đánh dấu được chặn bởi tổng n/p theo các số nguyên tố p, cho O(n log log n) thời gian và O(n) bộ nhớ.",
        en: "Every composite has a prime factor at most its square root, so the passes through 7 suffice for 50. The sum of n/p over primes p bounds the marking work, giving O(n log log n) time and O(n) space.",
      },
      lines: [4, 5, 6, 7], watch: { left: 15 }, verdict: "ac", fit: "all",
      scene: grid(4, "p ≤ √50 < 8", true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const k of NUMBERS) {
    scene.add(`n${k}`, {
      shape: shapes.block({ label: k, w: 36, h: 22, r: 4, depth: 3 }),
      x: (k - 1) % COLUMNS, y: Math.floor((k - 1) / COLUMNS) * 1.34,
    });
  }
  scene.add("calc", { shape: shapes.pill({ h: 26 }), x: (COLUMNS - 1) / 2, y: 9.65 });
}
