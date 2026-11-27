import type { Lesson, SceneMap } from "../../../lib/types";

const BOUND = "23";
const U = 56;
const NONE = 10;
const counts = [[Array<number>(11).fill(0), Array<number>(11).fill(0)]];
counts[0][1][NONE] = 1;
for (const digit of BOUND) {
  const cap = Number(digit);
  const next = [Array<number>(11).fill(0), Array<number>(11).fill(0)];
  counts[counts.length - 1].forEach((row, tight) => row.forEach((ways, prev) => {
    for (let d = 0; d <= (tight ? cap : 9); ++d) {
      if (d !== prev) next[Number(tight === 1 && d === cap)][prev === NONE && d === 0 ? NONE : d] += ways;
    }
  }));
  counts.push(next);
}
const totals = counts.map((row) => row.map((states) => states.reduce((sum, ways) => sum + ways, 0)));

function picture(last: number, ready: number, formula = "", answer = false, partial = false): SceneMap {
  const scene: SceneMap = {
    calc: { text: formula, o: formula ? 1 : 0, cls: answer ? "v-eq" : "is-active" },
    pos: { o: last >= 0 ? 1 : 0 },
    head0: { o: last >= 0 ? 1 : 0 },
    head1: { o: last >= 0 ? 1 : 0 },
  };
  totals.forEach((row, i) => {
    scene[`pos${i}`] = { o: i <= last ? 1 : 0 };
    row.forEach((value, tight) => {
      const subtotal = partial && i === 2 && tight === 0;
      const known = subtotal || 2 * i + tight <= ready;
      scene[`count${i}-${tight}`] = {
        text: known ? String(subtotal ? 19 : value) : "?",
        o: i <= last ? 1 : 0,
        cls: !known ? "is-out" : i === last ? "is-good" : i === last - 1 ? "is-active" : "",
        ...(known && i === last && !answer ? { fx: { type: "pulse", amp: 0.06, delay: 220 } } : {}),
      };
    });
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "dp-adv", slug: "digit-dp",
  title: { vi: "DP chữ số", en: "Digit DP" },
  added: "2026-11-27",
  summary: {
    vi: "Đếm số theo từng chữ số bằng cách ghi lại tiền tố còn bằng cận trên hay đã nhỏ hơn.",
    en: "Count numbers one digit at a time by tracking whether the prefix still matches the bound.",
  },
  level: "hard", minutes: 11, time: "O(L · 10²)", memory: "O(L · 10)",
  goal: {
    vi: "Đếm các số từ <b>0 đến 23</b> không có hai chữ số kề nhau giống nhau",
    en: "Count numbers from <b>0 through 23</b> with no equal adjacent digits",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">long long</span> F(<span class="kw">long long</span> n) {',
    '  <span class="kw">if</span> (n &lt; 0) <span class="kw">return</span> 0;',
    '  string s = to_string(n); <span class="kw">int</span> L = s.size();',
    '  <span class="kw">long long</span> dp[20][2][11]{}; dp[0][1][10] = 1;',
    '  <span class="kw">for</span> (<span class="kw">int</span> i = 0; i &lt; L; ++i)',
    '    <span class="kw">for</span> (<span class="kw">int</span> t = 0; t &lt; 2; ++t)',
    '      <span class="kw">for</span> (<span class="kw">int</span> p = 0; p &lt;= 10; ++p)',
    '        <span class="kw">for</span> (<span class="kw">int</span> d = 0; d &lt;= (t ? s[i] - \'0\' : 9); ++d) {',
    '          <span class="kw">if</span> (d == p) <span class="kw">continue</span>;',
    '          <span class="kw">int</span> nt = t &amp;&amp; d == s[i] - \'0\', np = p == 10 &amp;&amp; d == 0 ? 10 : d;',
    '          dp[i + 1][nt][np] += dp[i][t][p];',
    '        }',
    '  <span class="kw">return</span> accumulate(dp[L][0], dp[L][0] + 11, 0LL)',
    '       + accumulate(dp[L][1], dp[L][1] + 11, 0LL);',
    '}',
  ],
  watch: [
    { key: "i", label: "i" }, { key: "p", label: "p" }, { key: "t", label: "t" },
    { key: "count", label: { vi: "số cách", en: "ways" } },
  ],
  practice: [
    { src: "CSES 2220", name: "Counting Numbers", lv: "★★☆", url: "https://cses.fi/problemset/task/2220/" },
    { src: "LeetCode 2376", name: "Count Special Integers", lv: "★★★", url: "https://leetcode.com/problems/count-special-integers/" },
  ],
  sceneOptions: { unit: U },
  legend: [
    { cls: "acc", label: { vi: "hàng nguồn", en: "input row" } },
    { cls: "ac", label: { vi: "vừa đếm", en: "new count" } },
    { cls: "dim", label: { vi: "chưa tính", en: "pending" } },
  ],
  steps: [
    {
      title: { vi: "Đếm đến 23", en: "Count through 23" }, kind: "problem",
      body: {
        vi: "Trong đoạn [0,23], 11 và 22 bị loại vì có hai chữ số giống nhau đứng cạnh nhau. Duyệt từng số còn làm được với 23, nhưng với cận lớn ta phải kiểm tra đến <code>n + 1</code> số.",
        en: "In [0,23], 11 and 22 are invalid because their adjacent digits match. Testing numbers one by one works for 23, but a large bound makes us inspect <code>n + 1</code> numbers.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(-1, -1),
    },
    {
      title: { vi: "Bắt đầu với tiền tố rỗng", en: "Start with an empty prefix" }, kind: "concept",
      body: {
        vi: "<code>dp[i][t][p]</code> đếm các tiền tố dài <code>i</code> có chữ số thật cuối là <code>p</code>, với <code>p = 10</code> khi chưa gặp chữ số khác 0. <code>t = 1</code> nếu tiền tố còn bằng cận, <code>t = 0</code> nếu đã nhỏ hơn. Tiền tố rỗng cho <code>dp[0][1][10] = 1</code>, và sơ đồ cộng các trạng thái theo <code>p</code> trong mỗi ô.",
        en: "<code>dp[i][t][p]</code> counts length-<code>i</code> prefixes with previous significant digit <code>p</code>, with <code>p = 10</code> before the first nonzero digit. <code>t = 1</code> means the prefix matches the bound and <code>t = 0</code> means it is smaller. The empty prefix gives <code>dp[0][1][10] = 1</code>, and each diagram cell sums over <code>p</code>.",
      },
      lines: [3, 4], watch: { i: 0, p: 10, t: 1, count: 1 }, verdict: "run",
      fit: "all", scene: picture(0, 1, "dp[0][1][10] = 1"),
    },
    {
      title: { vi: "Tách hai loại tiền tố", en: "Split the prefixes" }, kind: "step",
      body: {
        vi: "Chữ số đầu của cận là 2 nên ta chỉ thử 0, 1 và 2. Chọn 0 hoặc 1 thì đã nhỏ hơn cận, còn chọn 2 thì vẫn bám sát. Số 0 đầu chỉ để đủ hai vị trí, nên nhánh 0 giữ <code>p = 10</code>.",
        en: "The first bound digit is 2, so we try only 0, 1, and 2. Choosing 0 or 1 makes the prefix smaller, while choosing 2 keeps it tight. The leading zero is padding to reach two positions, so that branch keeps <code>p = 10</code>.",
      },
      lines: [5, 6, 7, 8, 9, 10, 11], watch: { i: 1, count: 3 }, verdict: "run",
      fit: "all", scene: picture(1, 3, "1 + 1 = 2   │   1"),
    },
    {
      title: { vi: "Mở rộng nhánh nhỏ hơn", en: "Extend the loose prefixes" }, kind: "step",
      body: {
        vi: "Với <code>t = 0</code>, ta được thử mọi chữ số 0–9. Nhánh 0 cho 10 số từ 00 đến 09, kể cả số 0. Nhánh 1 cho 9 số vì phải bỏ 11, nên hai nhánh đóng góp <code>10 + 9 = 19</code> số.",
        en: "With <code>t = 0</code>, we can try any digit from 0 to 9. Prefix 0 gives ten numbers from 00 to 09, including zero. Prefix 1 gives nine because 11 is skipped, so the two branches contribute <code>10 + 9 = 19</code> numbers.",
      },
      lines: [7, 8, 9, 10, 11], watch: { i: 1, t: 0, count: 19 }, verdict: "run",
      fit: "all", scene: picture(2, 3, "0_: 10   ·   1_: 9   →   19", false, true),
    },
    {
      title: { vi: "Mở rộng nhánh bám cận", en: "Extend the tight prefix" }, kind: "step",
      body: {
        vi: "Từ tiền tố 2, chữ số cuối chỉ được từ 0 đến 3. Hai số 20, 21 chuyển sang <code>t = 0</code>, 22 bị bỏ qua, còn 23 giữ <code>t = 1</code>. Hàng cuối có 21 số nhỏ hơn cận và 1 số bằng cận.",
        en: "From prefix 2, the last digit can only be 0 through 3. The numbers 20 and 21 move to <code>t = 0</code>, 22 is skipped, and 23 keeps <code>t = 1</code>. The final row has 21 numbers below the bound and one equal to it.",
      },
      lines: [8, 9, 10, 11], watch: { i: 1, p: 2, t: 1, count: 3 }, verdict: "run",
      fit: "all", scene: picture(2, 5, "19 + 2 = 21   │   1"),
    },
    {
      title: { vi: "Cộng hai nhóm", en: "Add both groups" }, kind: "answer",
      body: {
        vi: "Sau hai vị trí, ta cộng cả hai cột để được <code>21 + 1 = 22</code> số hợp lệ. Để đếm trên đoạn [a,b], lấy <code>F(b) − F(a − 1)</code>. Khi <code>a = 0</code>, hàm trả về <code>F(−1) = 0</code>.",
        en: "After both positions, add both columns for <code>21 + 1 = 22</code> valid numbers. For an interval [a,b], use <code>F(b) − F(a − 1)</code>. When <code>a = 0</code>, the function gives <code>F(−1) = 0</code>.",
      },
      lines: [1, 2, 13, 14], watch: { i: 2, count: 22 }, verdict: "ac",
      fit: "all", scene: picture(2, 5, "F(23) = 21 + 1 = 22", true),
    },
    {
      title: { vi: "Gộp tiền tố cùng trạng thái", en: "Merge equivalent prefixes" }, kind: "recap",
      body: {
        vi: "Với cùng vị trí, cờ bám cận và chữ số trước, các tiền tố có chung tập chữ số được phép đi tiếp nên ta gộp số cách. Với <code>L</code> vị trí, 2 cờ và 11 giá trị <code>p</code>, mỗi trạng thái thử tối đa 10 chữ số: O(L · 10²) thời gian và O(L · 10) bộ nhớ.",
        en: "Prefixes at the same position with the same tight flag and previous digit allow the same next digits, so their counts can be combined. With <code>L</code> positions, two flags, and 11 values of <code>p</code>, each state tries at most ten digits: O(L · 10²) time and O(L · 10) space.",
      },
      lines: [5, 6, 7, 8, 10, 11], watch: { i: 2, count: 22 }, verdict: "ac",
      fit: "all", scene: picture(2, 5, "F(23) = 21 + 1 = 22", true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("bound", { shape: shapes.pill({ text: `n = ${BOUND}` }), x: 2.3 });
  scene.add("pos", { shape: shapes.pill({ text: "i" }), x: 0, y: 1.2, o: 0 });
  [0, 1].forEach((tight) => {
    const x = 1.55 + 1.55 * tight;
    scene.add(`head${tight}`, { shape: shapes.pill({ text: `t = ${tight}` }), x, y: 1.2, o: 0 });
    totals.forEach((_, i) => {
      scene.add(`count${i}-${tight}`, {
        shape: shapes.block({ label: "?", w: 62, h: 25, depth: 4, r: 6 }),
        x, y: 2.5 + i * 1.27, o: 0,
      });
    });
  });
  totals.forEach((_, i) => {
    scene.add(`pos${i}`, { shape: shapes.pill({ text: i }), x: 0, y: 2.44 + i * 1.27, o: 0 });
  });
  scene.add("calc", { shape: shapes.pill(), x: 1.55, y: 6.32, o: 0 });
}
