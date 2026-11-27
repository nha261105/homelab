import type { Lesson, SceneMap } from "../../../lib/types";

const PRICES = [8, 3, 5, 7, 5];
const INPUT = [0, 1, 2, 3, 4];
const ORDERED = [1, 2, 4, 3, 0];
const ONE_SOLD = [1, 2, 3, 0];
const TWO_SOLD = [1, 3, 0];
const FINAL = [1, 3];
const U = 62;

function tickets(order: number[], showEnd = true, marked = -1): SceneMap {
  const cells = PRICES.map((_, id) => {
    const index = order.indexOf(id);
    return [`c${id}`, index >= 0
      ? { x: index, o: 1, cls: id === marked ? "is-active" : "", arc: 0.28, land: false }
      : { o: 0, z: -0.25, s: 0.8, dur: 340, cls: "is-out" }];
  });
  return {
    ...Object.fromEntries(cells),
    end: { x: order.length, o: showEnd ? 1 : 0 },
  };
}

const iterator = (index: number): SceneMap => ({
  it: { x: index, o: 1, arc: 0.35, land: false, dur: 540 },
});
const output = (text = "", delay = 0): SceneMap => ({
  output: { text, o: text ? 1 : 0, delay, cls: text === "−1" ? "v-gt" : "v-eq" },
});

export const lesson: Lesson = {
  track: "cp",
  topic: "hashing",
  slug: "multiset",
  title: { vi: "multiset: lấy và xoá phần tử gần nhất", en: "multiset: take the closest" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng multiset để tìm vé đắt nhất khách mua được và xoá đúng một vé mỗi lần bán.",
    en: "Use a multiset to find the most expensive affordable ticket and remove one copy per sale.",
  },
  level: "basic",
  minutes: 8,
  time: "O((n + q) log(n + 1))",
  memory: "O(n)",
  goal: {
    vi: "Bán vé theo thứ tự ngân sách <b>6, 5, 2, 9</b>",
    en: "Sell tickets for budgets <b>6, 5, 2, 9</b> in order",
  },
  codeLang: "C++17",
  code: [
    'std::multiset&lt;<span class="kw">int</span>&gt; tickets(prices.begin(), prices.end());',
    '<span class="kw">for</span> (<span class="kw">int</span> x : budgets) {',
    '  <span class="kw">auto</span> it = tickets.upper_bound(x);',
    '  <span class="kw">if</span> (it == tickets.begin()) {',
    "    std::cout &lt;&lt; -1 &lt;&lt; '\\n';",
    '    <span class="kw">continue</span>;',
    '  }',
    '  --it;',
    "  std::cout &lt;&lt; *it &lt;&lt; '\\n';",
    '  tickets.erase(it);',
    '}',
  ],
  watch: [
    { key: "x", label: { vi: "ngân sách x", en: "budget x" } },
    { key: "it", label: "it" },
    { key: "out", label: { vi: "kết quả", en: "output" } },
  ],
  practice: [
    { src: "CSES 1091", name: "Concert Tickets", lv: "★☆☆", url: "https://cses.fi/problemset/task/1091" },
    { src: "CSES 1164", name: "Room Allocation", lv: "★★☆", url: "https://cses.fi/problemset/task/1164" },
  ],
  sceneOptions: { unit: U, view: [-55, -150, 420, 280] },
  legend: [
    { cls: "acc", label: { vi: "vé tại it", en: "ticket at it" } },
    { cls: "ac", label: { vi: "giá vé đã bán", en: "sold ticket price" } },
    { cls: "wa", label: { vi: "không có vé phù hợp", en: "no affordable ticket" } },
  ],
  entrance: INPUT.map((id) => `c${id}`),
  steps: [
    {
      title: { vi: "Chọn vé vừa túi", en: "Find an affordable ticket" }, kind: "problem",
      body: {
        vi: "Có năm vé giá 8, 3, 5, 7, 5. Mỗi khách có ngân sách <code>x</code> và mua vé còn lại đắt nhất có giá ≤ <code>x</code>. Quét hết vé cho từng khách có thể tốn O(nq).",
        en: "Five tickets cost 8, 3, 5, 7, and 5. Each customer has a budget <code>x</code> and buys the priciest remaining ticket at or below it. Scanning for every customer can take O(nq).",
      },
      lines: [], watch: {}, verdict: "run", fit: "all",
      scene: { ...tickets(INPUT, false), ...output() },
    },
    {
      title: { vi: "Giữ giá theo thứ tự", en: "Keep prices ordered" }, kind: "concept",
      body: {
        vi: "<code>multiset</code> giữ vé theo thứ tự 3, 5, 5, 7, 8. Hai vé giá 5 vẫn là hai phần tử riêng, và <code>end()</code> nằm ngay sau vé cuối.",
        en: "The <code>multiset</code> keeps tickets in order: 3, 5, 5, 7, 8. Both tickets priced 5 have their own entries, and <code>end()</code> sits just past the last ticket.",
      },
      lines: [1], watch: {}, verdict: "run", fit: "all",
      scene: {
        ...tickets(ORDERED), ...output(),
        c2: { x: 1, arc: 0.32, land: false, delay: 160 },
        c4: { x: 2, arc: 0.32, land: false, delay: 230 },
      },
    },
    {
      title: { vi: "Tìm giá vượt ngân sách", en: "Find the upper bound" }, kind: "step",
      body: {
        vi: "Khách đầu có <code>x = 6</code>. <code>upper_bound(6)</code> trỏ tới 7, vé đầu tiên đắt hơn 6.",
        en: "The first customer has <code>x = 6</code>. <code>upper_bound(6)</code> points to 7, the first ticket priced above 6.",
      },
      lines: [2, 3], watch: { x: 6, it: 7 }, verdict: "run", fit: "all",
      scene: { ...tickets(ORDERED, true, 3), ...iterator(3), ...output() },
    },
    {
      title: { vi: "Lùi đúng một bước", en: "Step back once" }, kind: "step",
      body: {
        vi: "Lùi <code>it</code> từ 7 về vé 5 ngay bên trái. Đây là giá cao nhất không vượt quá 6.",
        en: "Step <code>it</code> back from 7 to the 5 immediately to its left. That is the largest price at or below 6.",
      },
      lines: [4, 8], watch: { x: 6, it: 5 }, verdict: "run", fit: "all",
      scene: { ...tickets(ORDERED, true, 4), ...iterator(2), ...output() },
    },
    {
      title: { vi: "Xoá đúng một vé", en: "Remove one ticket" }, kind: "answer",
      body: {
        vi: "In 5 rồi gọi <code>tickets.erase(it)</code> để xoá đúng vé vừa chọn. Vé 5 còn lại vẫn có thể bán cho khách sau.",
        en: "Print 5, then call <code>tickets.erase(it)</code> to remove the chosen ticket. The other ticket priced 5 is still available.",
      },
      note: {
        vi: "erase(5) sẽ xoá tất cả vé giá 5.",
        en: "erase(5) would remove every ticket priced 5.",
      },
      lines: [9, 10], watch: { x: 6, out: 5 }, verdict: "ac", fit: "all",
      scene: { ...tickets(ONE_SOLD), ...output("5", 360) },
    },
    {
      title: { vi: "Bán vé bằng ngân sách", en: "Sell at the budget" }, kind: "step",
      body: {
        vi: "Với <code>x = 5</code>, <code>upper_bound(5)</code> vẫn trỏ tới 7. Lùi lại gặp vé 5 còn lại, bán vé đó rồi xoá khỏi multiset.",
        en: "With <code>x = 5</code>, <code>upper_bound(5)</code> still points to 7. Stepping back finds the other 5, which is sold and removed.",
      },
      lines: [3, 8, 9, 10], watch: { x: 5, out: 5 }, verdict: "ac", fit: "all",
      scene: { ...tickets(TWO_SOLD), ...output("5", 360) },
    },
    {
      title: { vi: "Không có vé vừa túi", en: "No affordable ticket" }, kind: "step",
      body: {
        vi: "Với <code>x = 2</code>, ngay vé rẻ nhất cũng có giá 3. Khi <code>it == tickets.begin()</code>, in −1 và giữ nguyên vé.",
        en: "With <code>x = 2</code>, even the cheapest ticket costs 3. If <code>it == tickets.begin()</code>, print −1 and leave the tickets alone.",
      },
      note: {
        vi: "Khi hết vé, begin() cũng chính là end(), nên vẫn in −1.",
        en: "If no tickets remain, begin() equals end() and the same check prints −1.",
      },
      lines: [3, 4, 5, 6], watch: { x: 2, it: 3, out: -1 }, verdict: "ac", fit: "all",
      scene: { ...tickets(TWO_SOLD, true, 1), ...iterator(0), ...output("−1", 360) },
    },
    {
      title: { vi: "Lùi từ cuối dãy", en: "Step back from end" }, kind: "step",
      body: {
        vi: "Với <code>x = 9</code>, không vé nào đắt hơn 9 nên <code>upper_bound(9)</code> trả về <code>end()</code>. Vì vẫn còn vé, có thể lùi từ đó về vé giá 8 để bán.",
        en: "With <code>x = 9</code>, no ticket costs more than 9, so <code>upper_bound(9)</code> returns <code>end()</code>. Since tickets remain, we can step back to the ticket priced 8 and sell it.",
      },
      lines: [3, 4, 8], watch: { x: 9, it: "end()" }, verdict: "ac", fit: "all",
      scene: { ...tickets(TWO_SOLD), ...iterator(3), ...output() },
    },
    {
      title: { vi: "Mỗi khách một lần tìm", en: "One lookup per customer" }, kind: "recap",
      body: {
        vi: "Sau khi bán vé 8, còn lại 3 và 7. Vé ngay trước <code>upper_bound(x)</code>, nếu có, là vé đắt nhất vừa túi. Mỗi khách tốn O(log(n + 1)) nhờ phép tìm, còn <code>erase(it)</code> tốn O(1) bù trừ.",
        en: "After selling the 8, only 3 and 7 remain. The ticket just before <code>upper_bound(x)</code>, if any, is the priciest affordable one. Each customer costs O(log(n + 1)) for the lookup, while <code>erase(it)</code> is amortized O(1).",
      },
      lines: [3, 8, 9, 10], watch: { x: 9, out: 8 }, verdict: "ac", fit: "all",
      scene: { ...tickets(FINAL), ...output("8", 360) },
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  PRICES.forEach((price, id) => {
    scene.add(`c${id}`, { shape: shapes.block({ label: price }), x: id, shadow: true });
  });
  scene.add("end", { shape: shapes.pill({ text: "end()" }), x: PRICES.length, z: 0.25, o: 0 });
  scene.add("it", { shape: shapes.pointer({ text: "it" }), z: -0.08, o: 0 });
  scene.add("output", { shape: shapes.pill(), x: 1, z: 1.16, o: 0 });
}
