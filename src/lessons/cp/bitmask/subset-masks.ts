import type { Lesson, SceneMap } from "../../../lib/types";

const A = [1, 2, 3];
const COUNT = 1 << A.length;
const MASKS = Array.from({ length: COUNT }, (_, mask) => mask);
const U = 63;

const bits = (mask: number) => mask.toString(2).padStart(A.length, "0");
const subset = (mask: number) => {
  const chosen = A.filter((_, i) => mask & (1 << i));
  return chosen.length ? `{${chosen.join(",")}}` : "∅";
};

function table(last = -1, focus = -1, formula = ""): SceneMap {
  const scene: SceneMap = {
    calc: { text: formula, y: last < 0 ? 1.55 : 5.4, o: formula ? 1 : 0, cls: last === COUNT - 1 ? "v-eq" : "" },
  };
  A.forEach((_, i) => {
    scene[`a${i}`] = { cls: focus >= 0 && (focus & (1 << i)) ? "is-active" : "" };
  });
  MASKS.forEach((mask) => {
    const ready = mask <= last;
    scene[`m${mask}`] = {
      o: last < 0 ? 0 : ready ? 1 : 0.52,
      text: ready ? subset(mask) : "?",
      cls: mask === focus || (ready && focus === -1) ? "is-good" : ready ? "" : "is-out",
      ...(mask === focus ? { fx: { type: "pulse", delay: 280 } } : {}),
    };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "bitmask",
  slug: "subset-masks",
  title: { vi: "Duyệt tập con bằng mask", en: "Subsets as bitmasks" },
  added: "2026-11-27",
  summary: {
    vi: "Mỗi bit lưu một quyết định chọn hay bỏ, nên đếm từ 0 đến 2ⁿ − 1 là duyệt hết mọi tập con.",
    en: "Each bit records one take-or-skip choice, so counting from 0 to 2ⁿ − 1 visits every subset.",
  },
  level: "basic",
  minutes: 7,
  time: "O(n · 2ⁿ)",
  memory: "O(n) + output",
  goal: {
    vi: "Dùng các mask từ <b>0 đến 7</b> để liệt kê tập con của {1, 2, 3}",
    en: "Use masks <b>0 through 7</b> to list the subsets of {1, 2, 3}",
  },
  codeLang: "C++17",
  code: [
    'vector&lt;vector&lt;<span class="kw">int</span>&gt;&gt; ans;',
    '<span class="kw">for</span> (unsigned mask = 0; mask &lt; (1u &lt;&lt; n); ++mask) {',
    '  vector&lt;<span class="kw">int</span>&gt; cur;',
    '  <span class="kw">for</span> (<span class="kw">int</span> i = 0; i &lt; n; ++i)',
    '    <span class="kw">if</span> (mask &amp; (1u &lt;&lt; i)) cur.push_back(a[i]);',
    '  ans.push_back(cur);',
    '}',
  ],
  watch: [
    { key: "mask", label: "mask" },
    { key: "bits", label: { vi: "nhị phân", en: "binary" } },
    { key: "cur", label: "cur" },
    { key: "count", label: "ans.size()" },
  ],
  practice: [
    { src: "LeetCode 78", name: "Subsets", lv: "★★☆", url: "https://leetcode.com/problems/subsets/" },
    { src: "CSES 1623", name: "Apple Division", lv: "★★☆", url: "https://cses.fi/problemset/task/1623" },
  ],
  sceneOptions: { unit: U, view: [-60, -130, 320, 325] },
  legend: [
    { cls: "acc", label: { vi: "phần tử được chọn", en: "selected element" } },
    { cls: "ac", label: { vi: "tập con đang xét", en: "subset in focus" } },
    { cls: "dim", label: { vi: "chưa duyệt", en: "not visited yet" } },
  ],
  entrance: A.map((_, i) => `a${i}`),
  steps: [
    {
      title: { vi: "Liệt kê tập con", en: "List the subsets" }, kind: "problem",
      body: {
        vi: "Hãy liệt kê mọi tập con của <code>a = [1, 2, 3]</code>, kể cả tập rỗng. Như ở bài Sinh tập con, mỗi phần tử mở hai nhánh chọn hoặc bỏ, nên có <code>2³ = 8</code> kết quả và không thể tránh việc liệt kê đủ cả tám.",
        en: "List every subset of <code>a = [1, 2, 3]</code>, including the empty set. As in Generating subsets, every element has a take and a skip branch, giving <code>2³ = 8</code> results that all have to be listed.",
      },
      lines: [], watch: { count: 0 }, verdict: "run", fit: "all",
      scene: table(-1, -1, "2 × 2 × 2 = 8"),
    },
    {
      title: { vi: "Mỗi bit một quyết định", en: "One choice per bit" }, kind: "concept",
      body: {
        vi: "Bit <code>i</code> bằng 1 thì chọn <code>a[i]</code>, bằng 0 thì bỏ qua. Bit 0 ở bên phải ứng với số 1, bit 2 ở bên trái ứng với số 3. Với <code>000</code>, vòng lặp không thêm phần tử nào vào <code>cur</code>.",
        en: "A 1 at bit <code>i</code> takes <code>a[i]</code>, and a 0 skips it. The rightmost bit 0 maps to 1 and the leftmost bit 2 maps to 3. With <code>000</code>, the loop adds nothing to <code>cur</code>.",
      },
      lines: [2, 3, 4, 5, 6], watch: { mask: 0, bits: bits(0), cur: subset(0), count: 1 }, verdict: "run", fit: "all",
      scene: table(0, 0, "000 → ∅"),
    },
    {
      title: { vi: "Bật bit ngoài cùng", en: "Set the rightmost bit" }, kind: "step",
      body: {
        vi: "Khi <code>mask = 1</code>, mẫu bit là <code>001</code>. Chỉ phép thử với <code>i = 0</code> khác 0, nên thêm <code>a[0] = 1</code> rồi ghi <code>{1}</code> vào <code>ans</code>.",
        en: "At <code>mask = 1</code>, the bits are <code>001</code>. Only the test at <code>i = 0</code> is nonzero, so append <code>a[0] = 1</code> and record <code>{1}</code> in <code>ans</code>.",
      },
      lines: [4, 5, 6], watch: { mask: 1, bits: bits(1), cur: subset(1), count: 2 }, verdict: "run", fit: "all",
      scene: table(1, 1, "001 → {1}"),
    },
    {
      title: { vi: "Đọc hai bit bật", en: "Read two set bits" }, kind: "step",
      body: {
        vi: "<code>010</code> chọn riêng <code>a[1] = 2</code>. Sang <code>011</code>, vòng lặp thấy cả bit 0 lẫn bit 1 và thêm 1 rồi 2, được <code>{1,2}</code>.",
        en: "<code>010</code> takes just <code>a[1] = 2</code>. At <code>011</code>, the loop sees bits 0 and 1 set and appends 1 then 2, giving <code>{1,2}</code>.",
      },
      lines: [2, 4, 5, 6], watch: { mask: 3, bits: bits(3), cur: subset(3), count: 4 }, verdict: "run", fit: "all",
      scene: table(3, 3, "010 → {2}    011 → {1,2}"),
    },
    {
      title: { vi: "Xét bit cao nhất", en: "Use the highest bit" }, kind: "step",
      body: {
        vi: "Từ <code>100</code> trở đi, bit 2 bật nên tập nào cũng có số 3. Với <code>100</code> ta lấy riêng 3, còn <code>101</code> bật thêm bit 0 nên lấy cả 1 và 3.",
        en: "From <code>100</code> onward, bit 2 is set, so 3 appears in every remaining subset. <code>100</code> selects just 3, and <code>101</code> also sets bit 0 and takes both 1 and 3.",
      },
      lines: [2, 4, 5, 6], watch: { mask: 5, bits: bits(5), cur: subset(5), count: 6 }, verdict: "run", fit: "all",
      scene: table(5, 5, "100 → {3}    101 → {1,3}"),
    },
    {
      title: { vi: "Đủ tám tập con", en: "All eight subsets" }, kind: "answer",
      body: {
        vi: "<code>110</code> chọn 2 và 3, còn <code>111</code> chọn cả ba số. Sau mask 7, giá trị kế tiếp là <code>1u &lt;&lt; 3 = 8</code>, chạm cận dừng của vòng lặp.",
        en: "<code>110</code> takes 2 and 3, while <code>111</code> takes all three elements. After mask 7, the next value is <code>1u &lt;&lt; 3 = 8</code>, so the loop stops.",
      },
      lines: [2, 5, 6], watch: { mask: 7, bits: bits(7), cur: subset(7), count: 8 }, verdict: "ac", fit: "all",
      scene: table(7, 7, "110 → {2,3}    111 → {1,2,3}"),
    },
    {
      title: { vi: "Mỗi tập một mask", en: "One mask per subset" }, kind: "recap",
      body: {
        vi: "Mỗi chuỗi quyết định chọn hoặc bỏ trong cây đệ quy tương ứng đúng một mask, nên duyệt đủ mask sẽ không sót hay lặp. Quét <code>n</code> bit cho mỗi mask tốn O(n · 2ⁿ) thời gian; ngoài các tập đã ghi, <code>cur</code> dùng O(n) bộ nhớ. Khi dùng <code>1u &lt;&lt; n</code>, cần <code>n</code> nhỏ hơn số bit của kiểu <code>unsigned</code>.",
        en: "Each take-or-skip path in the recursion tree maps to exactly one mask, so scanning every mask covers each subset once. Testing <code>n</code> bits per mask takes O(n · 2ⁿ) time, with O(n) for <code>cur</code> beyond the output. With <code>1u &lt;&lt; n</code>, <code>n</code> must be smaller than the width of <code>unsigned</code>.",
      },
      lines: [2, 4, 5, 6], watch: { count: 8 }, verdict: "ac", fit: "all",
      scene: table(7, -1, "0 … 7 → 8"),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  A.forEach((value, i) => {
    scene.add(`a${i}`, {
      shape: shapes.block({ label: value, sub: `a[${i}]`, w: 49, h: 36, depth: 4 }),
      x: 2.5 - i,
    });
  });
  MASKS.forEach((mask) => {
    scene.add(`m${mask}`, {
      shape: shapes.block({ sub: `${mask} · ${bits(mask)}`, w: mask === 7 ? 84 : 61, h: 33, depth: 4, r: 6 }),
      x: [0, 1.1, 2.2, 3.5][mask % 4],
      y: mask < 4 ? 1.9 : 3.75,
      o: 0,
    });
  });
  scene.add("calc", { shape: shapes.pill(), x: 1.8, y: 5.4, o: 0 });
}
