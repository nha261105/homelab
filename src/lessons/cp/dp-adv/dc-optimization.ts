import type { Lesson, SceneMap } from "../../../lib/types";

const A = [2, 1, 3, 2, 4, 1, 3];
const n = A.length;
const S = [0];
A.forEach((x, i) => S.push(S[i] + x));
const previous = S.map((sum) => sum ** 2);
const cost = (i: number, j: number) => previous[i] + (S[j] - S[i]) ** 2;

const visits: { l: number; r: number; lo: number; hi: number; mid: number; best: number }[] = [];
function solve(l: number, r: number, lo: number, hi: number) {
  if (l > r) return;
  const mid = Math.floor((l + r) / 2);
  let best = lo;
  for (let i = lo + 1; i <= Math.min(hi, mid - 1); ++i) {
    if (cost(i, mid) < cost(best, mid)) best = i;
  }
  visits.push({ l, r, lo, hi, mid, best });
  solve(l, mid - 1, lo, best);
  solve(mid + 1, r, best, hi);
}
solve(2, n, 1, n - 1);

const U = 43;
const fit = ["j1", `a${n}`, "r0", "r1", "r2", "r3", "r4", "calc"];
const answer = cost(visits[5].best, n);

function picture(base: boolean, count = 0, recap = false): SceneMap {
  const visit = visits[count - 1];
  const computed = visits.slice(0, count);
  const formula = recap ? `8² + 8² = ${answer}`
    : visit ? `${previous[visit.best]} + (${S[visit.mid]} − ${S[visit.best]})² = ${cost(visit.best, visit.mid)}`
    : base ? "dp[1][j] = S[j]²" : "C(i, j) = (S[j] − S[i])²";
  const scene: SceneMap = {
    calc: { text: formula, cls: visit ? "v-eq" : "", dur: 310, from: { s: 0.88 }, ease: "back" },
    r4: { o: visit && !recap ? 1 : 0 },
  };
  for (let j = 1; j <= n; ++j) {
    const result = computed.find((v) => v.mid === j);
    const candidate = visit && !recap && j >= visit.lo && j <= Math.min(visit.hi, visit.mid - 1);
    const best = candidate && visit.best === j;
    scene[`s${j}`] = {
      cls: visit && (j === visit.mid || j === visit.best) && !recap ? "is-active" : "",
    };
    scene[`prev${j}`] = {
      text: base ? String(previous[j]) : "?", cls: best ? "is-good" : candidate ? "is-active" : base ? "" : "is-out",
    };
    scene[`curr${j}`] = {
      text: j === 1 ? "—" : result ? String(cost(result.best, j)) : "?",
      cls: j === visit?.mid ? "is-good" : result ? "" : "is-out",
      ...(j === visit?.mid && !recap ? { fx: { type: "pulse", delay: 360 } } : {}),
    };
    scene[`try${j}`] = {
      text: candidate ? String(cost(j, visit.mid)) : "",
      o: candidate ? 1 : 0,
      cls: best ? "v-eq" : "",
    };
  }
  return scene;
}

function watched(k: number) {
  const { l, r, lo, hi, mid, best } = visits[k];
  return { range: `[${l}, ${r}]`, mid, candidates: `[${lo}, ${Math.min(hi, mid - 1)}]`, best, dp: cost(best, mid) };
}

export const lesson: Lesson = {
  track: "cp", topic: "dp-adv", slug: "dc-optimization",
  title: { vi: "Tối ưu chia để trị", en: "Divide & conquer optimization" },
  added: "2026-11-27",
  level: "hard", minutes: 12, time: "O(kn log n)", memory: "O(n)",
  summary: {
    vi: "Tính ô giữa trước để thu hẹp khoảng tìm điểm chia tối ưu cho hai nửa của hàng DP.",
    en: "Solve the middle cell first to narrow the search for optimal splits on both halves of the DP row.",
  },
  goal: {
    vi: "Chia <b>[2, 1, 3, 2, 4, 1, 3]</b> thành <b>2 đoạn</b> để tổng bình phương nhỏ nhất",
    en: "Split <b>[2, 1, 3, 2, 4, 1, 3]</b> into <b>2 segments</b> to minimize the sum of squares",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">using</span> ll = long long;',
    'vector&lt;ll&gt; prev(n+1), cur(n+1);',
    '<span class="kw">for</span> (<span class="kw">int</span> j=1; j&lt;=n; ++j) prev[j] = S[j]*S[j];',
    '<span class="kw">auto</span> cost = [&amp;](<span class="kw">int</span> i, <span class="kw">int</span> j) { ll d = S[j]-S[i]; <span class="kw">return</span> prev[i]+d*d; };',
    '<span class="kw">auto</span> solve = [&amp;](<span class="kw">auto</span>&amp;&amp; self, <span class="kw">int</span> l, <span class="kw">int</span> r, <span class="kw">int</span> lo, <span class="kw">int</span> hi) -&gt; void {',
    '  <span class="kw">if</span> (l &gt; r) <span class="kw">return</span>;',
    '  <span class="kw">int</span> mid = (l+r)/2, best = lo;',
    '  <span class="kw">for</span> (<span class="kw">int</span> i=lo+1; i&lt;=min(hi,mid-1); ++i)',
    '    <span class="kw">if</span> (cost(i,mid) &lt; cost(best,mid)) best = i;',
    '  cur[mid] = cost(best,mid);',
    '  self(self, l, mid-1, lo, best);',
    '  self(self, mid+1, r, best, hi);',
    '};',
    '<span class="kw">for</span> (<span class="kw">int</span> g=2; g&lt;=k; ++g) { solve(solve,g,n,g-1,n-1); swap(prev,cur); }',
    '<span class="kw">return</span> prev[n];',
  ],
  watch: [
    { key: "range", label: { vi: "cột cần tính", en: "columns to fill" } },
    { key: "mid", label: "mid" },
    { key: "candidates", label: { vi: "điểm chia thử", en: "split candidates" } },
    { key: "best", label: "best" },
    { key: "dp", label: "dp[2][mid]" },
  ],
  practice: [
    { src: "CSES 2086", name: "Subarray Squares", lv: "★★☆", url: "https://cses.fi/problemset/task/2086" },
    { src: "CSES 2087", name: "Houses and Schools", lv: "★★★", url: "https://cses.fi/problemset/task/2087" },
  ],
  sceneOptions: { unit: U },
  legend: [
    { cls: "acc", label: { vi: "dữ liệu đang xét", en: "inputs in use" } },
    { cls: "ac", label: { vi: "giá trị được chọn", en: "selected value" } },
    { cls: "dim", label: { vi: "chưa tính hoặc không hợp lệ", en: "pending or invalid" } },
  ],
  steps: [
    {
      title: { vi: "Chia mảng thành đoạn", en: "Split the array" }, kind: "problem",
      body: {
        vi: "Chia 7 phần tử thành 2 đoạn liên tiếp không rỗng; chi phí mỗi đoạn là bình phương tổng của đoạn. Với <code>k</code> đoạn, thử mọi điểm chia cho mỗi ô trong <code>k</code> hàng và <code>n</code> cột tốn O(kn²).",
        en: "Split 7 elements into 2 nonempty contiguous segments; each segment costs the square of its sum. For <code>k</code> segments, trying every split in each of <code>k</code> rows and <code>n</code> columns takes O(kn²).",
      },
      lines: [], watch: {}, verdict: "run", fit, scene: picture(false),
    },
    {
      title: { vi: "Tính hàng một đoạn", en: "Fill the one-segment row" }, kind: "concept",
      body: {
        vi: "<code>dp[g][j]</code> là chi phí nhỏ nhất khi chia <code>j</code> phần tử đầu thành <code>g</code> đoạn. Đặt <code>S[0] = 0</code>; với một đoạn ta có <code>dp[1][j] = S[j]²</code>, chẳng hạn <code>dp[1][4] = 8² = 64</code>. Nếu đoạn cuối bắt đầu sau <code>i</code>, tổng chi phí là <code>prev[i] + (S[j] − S[i])²</code>.",
        en: "<code>dp[g][j]</code> is the minimum cost for splitting the first <code>j</code> elements into <code>g</code> segments. Set <code>S[0] = 0</code>; with one segment, <code>dp[1][j] = S[j]²</code>, for example <code>dp[1][4] = 8² = 64</code>. If the final segment starts after <code>i</code>, the total is <code>prev[i] + (S[j] − S[i])²</code>.",
      },
      lines: [2, 3, 4], watch: {}, verdict: "run", fit, scene: picture(true),
    },
    {
      title: { vi: "Tính cột giữa trước", en: "Solve the middle column" }, kind: "step",
      body: {
        vi: "Hàng 2 cần tính các cột 2 đến 7, nên bắt đầu ở <code>mid = 4</code>. Thử điểm chia 1, 2, 3 được 40, 34, 40; nhỏ nhất tại <code>best = 2</code>. Hàng <code>cost</code> đặt mỗi phương án ngay dưới cột ứng với điểm chia <code>i</code>.",
        en: "Row 2 needs columns 2 through 7, so start at <code>mid = 4</code>. Splits 1, 2, and 3 cost 40, 34, and 40; the minimum is at <code>best = 2</code>. The <code>cost</code> row puts each candidate under its split column <code>i</code>.",
      },
      note: {
        vi: "Với chi phí bình phương tổng của mảng số dương, điểm chia tối ưu nhỏ nhất không giảm khi cột <code>j</code> tăng.",
        en: "With squared segment sums over positive values, the leftmost optimal split never decreases as column <code>j</code> increases.",
      },
      lines: [7, 8, 9, 10, 14], watch: watched(0), verdict: "run", fit, scene: picture(true, 1),
    },
    {
      title: { vi: "Chặn trên nửa trái", en: "Bound the left half" }, kind: "step",
      body: {
        vi: "Vì cột 4 chọn điểm chia 2, các cột 2 và 3 chỉ cần tìm từ 1 đến 2. Cột giữa của nửa trái là 2; điều kiện <code>i &lt; mid</code> chỉ để lại <code>i = 1</code>, cho <code>4 + (3 − 2)² = 5</code>.",
        en: "Because column 4 chose split 2, columns 2 and 3 only search splits 1 through 2. The left half has midpoint 2; requiring <code>i &lt; mid</code> leaves only <code>i = 1</code>, giving <code>4 + (3 − 2)² = 5</code>.",
      },
      lines: [7, 8, 10, 11], watch: watched(1), verdict: "run", fit, scene: picture(true, 2),
    },
    {
      title: { vi: "Điền xong nửa trái", en: "Finish the left half" }, kind: "step",
      body: {
        vi: "Cột 3 nằm bên phải cột 2 và bên trái cột 4, nên chỉ thử <code>i</code> từ 1 đến 2. Hai chi phí là 20 và 18, vì vậy chọn <code>i = 2</code>.",
        en: "Column 3 lies to the right of column 2 and left of column 4, so it tries only splits 1 and 2. The costs are 20 and 18, so choose <code>i = 2</code>.",
      },
      lines: [8, 9, 10, 12], watch: watched(2), verdict: "run", fit, scene: picture(true, 3),
    },
    {
      title: { vi: "Chặn dưới nửa phải", en: "Bound the right half" }, kind: "step",
      body: {
        vi: "Quay lại nhánh phải của cột 4: các cột 5 đến 7 có điểm chia tối ưu ít nhất là 2. Ở cột giữa 6, ta thử <code>i = 2…5</code>, được 109, 85, 89, 145. Thấp nhất là 85 tại <code>i = 3</code>.",
        en: "Return to column 4’s right branch: columns 5 through 7 have optimal splits of at least 2. At midpoint 6, splits <code>i = 2…5</code> cost 109, 85, 89, and 145. The minimum is 85 at <code>i = 3</code>.",
      },
      lines: [7, 8, 9, 10, 12], watch: watched(3), verdict: "run", fit, scene: picture(true, 4),
    },
    {
      title: { vi: "Kẹp điểm chia cột 5", en: "Bracket column 5’s split" }, kind: "step",
      body: {
        vi: "Cột 5 nằm giữa hai cột đã biết: cột 4 chọn 2, cột 6 chọn 3. Chỉ còn hai phương án, và <code>36 + (12 − 6)² = 72</code> thắng 90.",
        en: "Column 5 lies between two solved columns: column 4 chose 2 and column 6 chose 3. Only two candidates remain, and <code>36 + (12 − 6)² = 72</code> beats 90.",
      },
      lines: [8, 9, 10, 11], watch: watched(4), verdict: "run", fit, scene: picture(true, 5),
    },
    {
      title: { vi: "Đọc kết quả cuối", en: "Read the final result" }, kind: "answer",
      body: {
        vi: "Cột 7 nằm bên phải cột 6, nên chỉ thử 3 đến 6; các chi phí lần lượt là 136, 128, 160, 178. Chọn <code>i = 4</code> cho hai đoạn có tổng đều bằng 8 và chi phí <code>dp[2][7] = 128</code>.",
        en: "Column 7 is to the right of column 6, so it tries only splits 3 through 6, costing 136, 128, 160, and 178. Split at <code>i = 4</code> to get two sums of 8 and cost <code>dp[2][7] = 128</code>.",
      },
      lines: [8, 9, 10, 12, 15], watch: watched(5), verdict: "ac", fit, scene: picture(true, 6),
    },
    {
      title: { vi: "Vì sao điểm chia tăng?", en: "Why are splits monotone?" }, kind: "recap",
      body: {
        vi: "Với <code>a &lt; b &lt; c &lt; d</code>, chênh lệch <code>C(a,d) + C(b,c) − C(a,c) − C(b,d)</code> bằng <code>2(S[b] − S[a])(S[d] − S[c]) &gt; 0</code>. Chi phí hàng trước triệt tiêu khi so hai cặp, nên nếu <code>b</code> thắng <code>a</code> ở <code>c</code>, nó vẫn thắng ở <code>d</code>. Mỗi tầng đệ quy thử O(n) điểm chia vì các khoảng chỉ có thể chung biên; có O(log n) tầng mỗi hàng và chỉ cần giữ hai hàng.",
        en: "For <code>a &lt; b &lt; c &lt; d</code>, the difference <code>C(a,d) + C(b,c) − C(a,c) − C(b,d)</code> is <code>2(S[b] − S[a])(S[d] − S[c]) &gt; 0</code>. Previous-row costs cancel in this comparison, so if <code>b</code> beats <code>a</code> at <code>c</code>, it still wins at <code>d</code>. Each recursion depth scans O(n) candidates since ranges can only share boundaries; there are O(log n) depths per row, and we keep two rows.",
      },
      lines: [9, 11, 12, 14], watch: { best: visits[5].best, dp: answer }, verdict: "ac", fit, scene: picture(true, 6, true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  const labels = ["a[j]", "S[j]", "dp[1]", "dp[2]", "cost"];
  labels.forEach((text, row) => {
    scene.add(`r${row}`, { shape: shapes.pill({ text, h: 22, pad: 5 }), x: 0, y: 1.55 * row });
  });
  A.forEach((x, index) => {
    const j = index + 1;
    const col = j + 0.17;
    const block = (label: string | number) => shapes.block({ label, w: 38, h: 25, depth: 4, r: 6 });
    scene.add(`a${j}`, { shape: block(x), x: col });
    scene.add(`s${j}`, { shape: block(S[j]), x: col, y: 1.55 });
    scene.add(`prev${j}`, { shape: block("?"), x: col, y: 3.1 });
    scene.add(`curr${j}`, { shape: block("?"), x: col, y: 4.65 });
    scene.add(`try${j}`, { shape: shapes.pill({ h: 22, pad: 4 }), x: col, y: 6.2, o: 0 });
    scene.add(`j${j}`, { shape: shapes.pill({ text: j, h: 19, pad: 5 }), x: col, y: -1.6 });
  });
  scene.add("calc", { shape: shapes.pill(), x: 3.85, y: 7.7 });
}
