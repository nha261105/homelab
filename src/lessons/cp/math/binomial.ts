import type { Lesson, SceneMap } from "../../../lib/types";

const P = 11;
const N = 6;
const K = 2;
const indices = Array.from({ length: N + 1 }, (_, i) => i);
const fact = [1];
for (let i = 1; i <= N; ++i) fact[i] = fact[i - 1] * i % P;

const invFact = new Array<number>(N + 1);
invFact[N] = Number(BigInt(fact[N]) ** BigInt(P - 2) % BigInt(P));
for (let i = N; i > 0; --i) invFact[i - 1] = invFact[i] * i % P;

const answer = fact[N] * invFact[K] % P * invFact[N - K] % P;
const U = 48;
const fit = ["mod", "index6", "lab-fact", "lab-inv", "inv6", "formula0", "formula1"];
const query = { fact6: { cls: "is-active" }, inv2: { cls: "is-active" }, inv4: { cls: "is-active" } };
const result = ["C(6, 2) = 6! · (2!)⁻¹ · (4!)⁻¹", `(5 × 6 × 6) mod 11 = ${answer}`];

interface Picture {
  forward?: number;
  backward?: number;
  marks?: SceneMap;
  formulas: string[];
  pass?: "fact" | "inv";
  solved?: boolean;
}

function table({ forward = -1, backward = N + 1, marks = {}, formulas, pass, solved }: Picture): SceneMap {
  const scene: SceneMap = {};
  for (const i of indices) {
    const entries = [
      { id: `fact${i}`, value: fact[i], ready: i <= forward, fresh: pass === "fact" && i > 0, delay: i * 85 },
      { id: `inv${i}`, value: invFact[i], ready: i >= backward, fresh: pass === "inv" && i < N, delay: (N - i) * 85 },
    ];
    for (const { id, value, ready, fresh, delay } of entries) {
      scene[id] = {
        text: ready ? String(value) : "?",
        o: ready ? 1 : 0.38,
        cls: ready ? "" : "is-out",
        ...(fresh ? { delay, dur: 360, from: { o: 0, z: 0.24 }, ease: "drop", land: true } : {}),
        ...marks[id],
      };
    }
  }
  if (pass) {
    for (let i = 1; i <= N; ++i) {
      const delay = (pass === "fact" ? i : N - i + 1) * 85;
      scene[`${pass}-link${i}`] = { p: 1, cls: "v-gt", from: { p: 0 }, delay, dur: 300 };
    }
  }
  for (let i = 0; i < 2; ++i) {
    const formula = formulas[i] ?? "";
    scene[`formula${i}`] = { text: formula, o: formula ? 1 : 0, cls: solved && i === 1 ? "v-eq" : "", dur: 300 };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "math",
  slug: "binomial",
  title: { vi: "Tổ hợp C(n, k) mod p", en: "Binomials mod p" },
  added: "2026-11-27",
  summary: {
    vi: "Tính trước giai thừa và nghịch đảo giai thừa để trả lời mỗi truy vấn tổ hợp trong O(1).",
    en: "Precompute factorials and inverse factorials to answer each binomial query in O(1).",
  },
  level: "medium",
  minutes: 8,
  time: "O(N + log p + q)",
  memory: "O(N)",
  goal: { vi: "Tính <b>C(6, 2)</b> theo modulo 11", en: "Compute <b>C(6, 2)</b> modulo 11" },
  codeLang: "C++17",
  code: [
    '<span class="kw">auto</span> powMod = [&amp;](<span class="kw">long long</span> b, <span class="kw">int</span> e) {',
    '  <span class="kw">long long</span> r = 1;',
    '  <span class="kw">for</span> (; e &gt; 0; e /= 2, b = b * b % p)',
    '    <span class="kw">if</span> (e % 2) r = r * b % p;',
    '  <span class="kw">return</span> r;',
    '};',
    '<span class="kw">vector</span>&lt;<span class="kw">long long</span>&gt; fact(N + 1), invFact(N + 1);',
    'fact[0] = 1;',
    '<span class="kw">for</span> (<span class="kw">int</span> i = 1; i &lt;= N; ++i) fact[i] = fact[i - 1] * i % p;',
    'invFact[N] = powMod(fact[N], p - 2);',
    '<span class="kw">for</span> (<span class="kw">int</span> i = N; i &gt; 0; --i) invFact[i - 1] = invFact[i] * i % p;',
    '<span class="kw">auto</span> choose = [&amp;](<span class="kw">int</span> n, <span class="kw">int</span> k) {',
    '  <span class="kw">return</span> fact[n] * invFact[k] % p * invFact[n - k] % p;',
    '};',
  ],
  watch: [
    { key: "i", label: "i" },
    { key: "f", label: "fact[i]" },
    { key: "inv", label: "invFact[i]" },
    { key: "nk", label: "(n, k)" },
    { key: "answer", label: "C(n, k) mod p" },
  ],
  practice: [
    { src: "CSES 1079", name: "Binomial Coefficients", lv: "★★☆", url: "https://cses.fi/problemset/task/1079" },
    { src: "CSES 1715", name: "Creating Strings II", lv: "★★☆", url: "https://cses.fi/problemset/task/1715" },
  ],
  sceneOptions: { unit: U },
  legend: [
    { cls: "acc", label: { vi: "ô được dùng", en: "entry in use" } },
    { cls: "ac", label: { vi: "giá trị vừa tính", en: "computed value" } },
  ],
  steps: [
    {
      title: { vi: "Đếm cách chọn", en: "Count the choices" }, kind: "problem",
      body: {
        vi: "Chọn 2 phần tử trong 6 phần tử, không tính thứ tự. Với nhiều truy vấn như <code>C(6, 2)</code>, tính lại cả ba giai thừa cho mỗi câu có thể tốn O(n) phép nhân.",
        en: "Choose 2 of 6 items without regard to order. For many queries like <code>C(6, 2)</code>, rebuilding all three factorials can take O(n) multiplications per query.",
      },
      lines: [], watch: { nk: "(6, 2)" }, verdict: "run", fit,
      scene: table({ formulas: ["C(6, 2) = 6! / (2! · 4!)"] }),
    },
    {
      title: { vi: "Bắt đầu từ 0!", en: "Start at 0!" }, kind: "concept",
      body: {
        vi: "Lấy 6 làm <code>N</code>, giá trị <code>n</code> lớn nhất cần trả lời. Hàng <code>fact</code> lưu giai thừa theo modulo 11, bắt đầu với <code>0! = 1</code>. Hàng <code>invFact</code> sẽ lưu nghịch đảo để thay phép chia bằng phép nhân.",
        en: "Use 6 as <code>N</code>, the largest <code>n</code> among the queries. The <code>fact</code> row stores factorials modulo 11, starting at <code>0! = 1</code>. The <code>invFact</code> row will store inverses so we can divide by multiplying.",
      },
      lines: [7, 8], watch: { i: 0, f: fact[0] }, verdict: "run", fit,
      scene: table({ forward: 0, marks: { fact0: { cls: "is-good" } }, formulas: ["fact[0] = 1"] }),
    },
    {
      title: { vi: "Nhân từ trái sang", en: "Multiply left to right" }, kind: "step",
      body: {
        vi: "Đi từ trái sang phải, lấy ô trước nhân với chỉ số <code>i</code> rồi lấy số dư theo 11. Chẳng hạn <code>fact[5] = 2 · 5 mod 11 = 10</code>, nên <code>fact[6] = 10 · 6 mod 11 = 5</code>.",
        en: "Go left to right, multiplying the previous entry by the index <code>i</code> and reducing modulo 11. For example, <code>fact[5] = 2 · 5 mod 11 = 10</code>, so <code>fact[6] = 10 · 6 mod 11 = 5</code>.",
      },
      lines: [9], watch: { i: 6, f: fact[6] }, verdict: "run", fit,
      scene: table({
        forward: N, pass: "fact", marks: { fact5: { cls: "is-active" }, fact6: { cls: "is-good" } },
        formulas: ["fact[i] = fact[i−1] · i mod 11", "fact[6] = (10 × 6) mod 11 = 5"],
      }),
    },
    {
      title: { vi: "Nghịch đảo ô cuối", en: "Invert the last factorial" }, kind: "step",
      body: {
        vi: "Vì <code>N = 6 &lt; p = 11</code>, không thừa số nào trong 6! bằng 0 theo modulo 11. Theo định lý Fermat nhỏ, nghịch đảo của <code>fact[6] = 5</code> là <code>5⁹ mod 11 = 9</code>.",
        en: "Since <code>N = 6 &lt; p = 11</code>, none of the factors of 6! are zero modulo 11. Fermat’s little theorem gives the inverse of <code>fact[6] = 5</code> as <code>5⁹ mod 11 = 9</code>.",
      },
      lines: [1, 2, 3, 4, 5, 10], watch: { i: 6, f: fact[6], inv: invFact[6] }, verdict: "run", fit,
      scene: table({
        forward: N, backward: N, marks: { fact6: { cls: "is-active" }, inv6: { cls: "is-good" } },
        formulas: ["invFact[6] = 5⁹ mod 11 = 9", "(5 × 9) mod 11 = 1"],
      }),
    },
    {
      title: { vi: "Nhân từ phải sang", en: "Multiply right to left" }, kind: "step",
      body: {
        vi: "Vì <code>i! = i · (i−1)!</code>, lấy nghịch đảo của <code>i!</code> rồi nhân <code>i</code> sẽ ra nghịch đảo của <code>(i−1)!</code>. Từ 9 ở cột 6, tính <code>invFact[5] = 9 · 6 mod 11 = 10</code>, rồi tiếp tục về cột 0.",
        en: "Because <code>i! = i · (i−1)!</code>, multiplying the inverse of <code>i!</code> by <code>i</code> gives the inverse of <code>(i−1)!</code>. From 9 in column 6, find <code>invFact[5] = 9 · 6 mod 11 = 10</code>, then continue down to column 0.",
      },
      lines: [11], watch: { i: 5, inv: invFact[5] }, verdict: "run", fit,
      scene: table({
        forward: N, backward: 0, pass: "inv", marks: { inv6: { cls: "is-active" }, inv5: { cls: "is-good" } },
        formulas: ["invFact[i−1] = invFact[i] · i mod 11", "invFact[5] = (9 × 6) mod 11 = 10"],
      }),
    },
    {
      title: { vi: "Tra ba ô", en: "Look up three entries" }, kind: "answer",
      body: {
        vi: "Đọc <code>fact[6] = 5</code>, <code>invFact[2] = 6</code> và <code>invFact[4] = 6</code>. Nhân ba giá trị rồi lấy số dư được <code>5 · 6 · 6 mod 11 = 4</code>, đúng bằng <code>15 mod 11</code>.",
        en: "Read <code>fact[6] = 5</code>, <code>invFact[2] = 6</code>, and <code>invFact[4] = 6</code>. Multiply and reduce to get <code>5 · 6 · 6 mod 11 = 4</code>, the same as <code>15 mod 11</code>.",
      },
      lines: [12, 13], watch: { nk: "(6, 2)", answer }, verdict: "ac", fit,
      scene: table({ forward: N, backward: 0, marks: query, formulas: result, solved: true }),
    },
    {
      title: { vi: "Tính trước một lần", en: "Precompute once" }, kind: "recap",
      body: {
        vi: "Với <code>p</code> nguyên tố và <code>0 ≤ k ≤ n ≤ N &lt; p</code>, mọi nghịch đảo cần dùng đều tồn tại. Hai lượt điền bảng và một phép lũy thừa tốn O(N + log p) thời gian và O(N) bộ nhớ. Sau đó, mỗi truy vấn tốn O(1).",
        en: "For prime <code>p</code> and <code>0 ≤ k ≤ n ≤ N &lt; p</code>, every inverse we need exists. Two passes and one exponentiation take O(N + log p) time and O(N) space. Each query then takes O(1).",
      },
      lines: [9, 10, 11, 13], watch: { nk: "(6, 2)", answer }, verdict: "ac", fit,
      scene: table({ forward: N, backward: 0, marks: query, formulas: result, solved: true }),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  const first = 1.55;
  scene.add("mod", { shape: shapes.pill({ text: "mod 11", pad: 7 }), x: 0.18 });
  scene.add("lab-fact", { shape: shapes.pill({ text: "fact", pad: 7 }), x: 0.18, y: 2.15 });
  scene.add("lab-inv", { shape: shapes.pill({ text: "invFact", pad: 7 }), x: 0.18, y: 4.25 });
  for (const i of indices) {
    const x = first + i * 0.94;
    scene.add(`index${i}`, { shape: shapes.pill({ text: i, pad: 7 }), x });
    scene.add(`fact${i}`, { shape: shapes.block({ label: "?", w: 35, h: 28, depth: 4 }), x, y: 2.25, o: 0.38 });
    scene.add(`inv${i}`, { shape: shapes.block({ label: "?", w: 35, h: 28, depth: 4 }), x, y: 4.35, o: 0.38 });
  }
  for (let i = 1; i <= N; ++i) {
    scene.link(`fact-link${i}`, { from: `fact${i - 1}`, to: `fact${i}`, bend: 0.46 });
    scene.link(`inv-link${i}`, { from: `inv${i}`, to: `inv${i - 1}`, bend: 0.46 });
  }
  for (let i = 0; i < 2; ++i) {
    scene.add(`formula${i}`, { shape: shapes.pill(), x: 3.56, y: 5.75 + i * 1.18, o: 0 });
  }
}
