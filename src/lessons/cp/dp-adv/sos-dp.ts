import type { Lesson, SceneMap } from "../../../lib/types";

const values = [2, 1, 4, 3, 5, 0, 2, 1];
const bits = 3;
const binary = (mask: number) => mask.toString(2).padStart(bits, "0");
const rows = [values];
for (let bit = 0; bit < bits; bit++) {
  const prev = rows[bit];
  const flag = 1 << bit;
  rows.push(prev.map((value, mask) => value + (mask & flag ? prev[mask ^ flag] : 0)));
}

function picture(phase: number, focus = -1, formula = ""): SceneMap {
  const scene: SceneMap = {
    formula: { text: formula, o: formula ? 1 : 0, from: { o: 0 }, delay: 280, dur: 320 },
    stage: { text: phase > 0 ? `b = ${phase - 1}` : "a[m]", cls: "is-active" },
  };
  const previous = rows[Math.max(phase - 1, 0)];
  const output = rows[Math.max(phase, 0)];
  const flag = phase > 0 ? 1 << (phase - 1) : 0;
  values.forEach((_, mask) => {
    const adds = (mask & flag) !== 0;
    const source = focus >= 0 && (mask === focus || ((focus & flag) !== 0 && mask === (focus ^ flag)));
    scene[`src${mask}`] = { text: String(previous[mask]), cls: source ? "is-active" : "" };
    scene[`dst${mask}`] = {
      text: phase > 0 ? String(output[mask]) : "·",
      ...(mask === focus ? { fx: { type: "pulse", amp: 0.06, delay: 300 } } : {}),
      cls: phase <= 0 ? "is-out" : mask === focus ? "is-good" : adds ? "is-active" : "",
    };
    scene[`calc${mask}`] = {
      text: phase > 0 ? adds ? `${previous[mask]}+${previous[mask ^ flag]}` : String(previous[mask]) : "",
      o: phase > 0 ? 1 : 0,
      cls: mask === focus ? "is-active" : "",
    };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "dp-adv",
  slug: "sos-dp",
  title: { vi: "Tổng trên tập con (SOS)", en: "Sum over subsets" },
  added: "2026-11-27",
  summary: {
    vi: "Tính tổng trên mọi submask bằng cách mở từng bit, từ bit 0 đến bit cao nhất.",
    en: "Sum over all submasks by allowing one bit to vary at a time, from the lowest bit up.",
  },
  level: "hard",
  minutes: 9,
  time: "O(B · 2ᴮ)",
  memory: "O(2ᴮ)",
  goal: { vi: "Tính tổng trọng số các submask cho cả <b>8 mask</b> có 3 bit", en: "Compute the submask weight sum for all <b>8 masks</b> of 3 bits" },
  codeLang: "C++17",
  code: [
    'vector&lt;<span class="kw">long long</span>&gt; f = a;',
    '<span class="kw">for</span> (<span class="kw">int</span> b = 0; b &lt; B; ++b) {',
    '  <span class="kw">int</span> bit = 1 &lt;&lt; b;',
    '  <span class="kw">for</span> (<span class="kw">int</span> m = 0; m &lt; (1 &lt;&lt; B); ++m)',
    '    <span class="kw">if</span> (m &amp; bit) f[m] += f[m ^ bit];',
    '}',
  ],
  watch: [
    { key: "b", label: "b" },
    { key: "m", label: "m" },
    { key: "source", label: "m ^ bit" },
    { key: "f", label: "f[m]" },
  ],
  practice: [
    { src: "CSES 1654", name: "SOS Bit Problem", lv: "★★★", url: "https://cses.fi/problemset/task/1654" },
    { src: "Codeforces 165E", name: "Compatible Numbers", lv: "★★★", url: "https://codeforces.com/problemset/problem/165/E" },
  ],
  sceneOptions: { unit: 46 },
  legend: [
    { cls: "acc", label: { vi: "nguồn đang xét hoặc ô có phép cộng", en: "source in focus or cell with an addition" } },
    { cls: "ac", label: { vi: "kết quả đang xét", en: "result in focus" } },
  ],
  steps: [
    {
      title: { vi: "Cộng các submask", en: "Sum the submasks" }, kind: "problem",
      body: {
        vi: "Mỗi mask 3 bit có một trọng số. Với mỗi <code>m</code>, cộng trọng số các mask chỉ bật những bit mà <code>m</code> bật, kể cả <code>000</code> và chính <code>m</code>. Duyệt riêng cho mọi <code>m</code> tốn O(3ᴮ) với <code>B</code> bit.",
        en: "Each 3-bit mask has a weight. For each <code>m</code>, add the weights of masks whose set bits also appear in <code>m</code>, including <code>000</code> and <code>m</code> itself. Listing them separately for every <code>m</code> costs O(3ᴮ) for <code>B</code> bits.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(0),
    },
    {
      title: { vi: "Chép trọng số gốc", en: "Copy the input weights" }, kind: "concept",
      body: {
        vi: "Đặt <code>f = a</code>. Khi chưa xử lý bit nào, chỉ chính <code>m</code> được tính, nên <code>f[111₂] = a[111₂] = 1</code>. Sau mỗi lượt, các bit đã xử lý được phép tắt khi lấy submask.",
        en: "Set <code>f = a</code>. With no bits processed, only <code>m</code> itself contributes, so <code>f[111₂] = a[111₂] = 1</code>. Each pass allows another bit to be cleared when choosing submasks.",
      },
      lines: [1], watch: { m: "111", f: 1 }, verdict: "run", fit: "all",
      scene: picture(0, 7, "f[111₂] = 1"),
    },
    {
      title: { vi: "Mở bit thấp nhất", en: "Process the lowest bit" }, kind: "step",
      body: {
        vi: "Ở <code>b = 0</code>, mask <code>111</code> lấy thêm từ <code>110</code>, được <code>1 + 2 = 3</code>. Mỗi ô công thức bên dưới ghi phép tính từ hàng trên sang hàng dưới. Mask có bit 0 bằng 0 giữ nguyên.",
        en: "At <code>b = 0</code>, mask <code>111</code> adds the value at <code>110</code>, giving <code>1 + 2 = 3</code>. Each formula pill shows how the upper row becomes the lower row. Masks with bit 0 clear keep their values.",
      },
      lines: [2, 3, 4, 5], watch: { b: 0, m: "111", source: "110", f: 3 }, verdict: "run", fit: "all",
      scene: picture(1, 7, "f[111₂] = 1 + 2 = 3"),
    },
    {
      title: { vi: "Mở thêm bit giữa", en: "Process the middle bit" }, kind: "step",
      body: {
        vi: "Ở <code>b = 1</code>, <code>111</code> lấy thêm từ <code>101</code>. Giá trị 5 ở <code>101</code> đã gộp <code>101</code> và <code>100</code> từ lượt trước, nên ô <code>111</code> thành <code>3 + 5 = 8</code>.",
        en: "At <code>b = 1</code>, <code>111</code> adds the value at <code>101</code>. Its value 5 already includes <code>101</code> and <code>100</code> from the previous pass, so <code>111</code> becomes <code>3 + 5 = 8</code>.",
      },
      lines: [2, 3, 4, 5], watch: { b: 1, m: "111", source: "101", f: 8 }, verdict: "run", fit: "all",
      scene: picture(2, 7, "f[111₂] = 3 + 5 = 8"),
    },
    {
      title: { vi: "Đủ cả ba bit", en: "Finish all three bits" }, kind: "answer",
      body: {
        vi: "Ở <code>b = 2</code>, <code>111</code> nhận 10 từ <code>011</code>, thành <code>8 + 10 = 18</code>, đúng bằng tổng của cả 8 trọng số. Giờ có thể đọc đáp án cho từng mask ở hàng dưới.",
        en: "At <code>b = 2</code>, <code>111</code> receives 10 from <code>011</code>, giving <code>8 + 10 = 18</code>, the sum of all 8 weights. The bottom row now gives the answer for each mask.",
      },
      lines: [2, 3, 4, 5], watch: { b: 2, m: "111", source: "011", f: 18 }, verdict: "ac", fit: "all",
      scene: picture(3, 7, "f[111₂] = 8 + 10 = 18"),
    },
    {
      title: { vi: "Cập nhật tại chỗ", en: "Update in place" }, kind: "recap",
      body: {
        vi: "Khi <code>m</code> bật bit <code>b</code>, hai số hạng lần lượt gom các submask giữ và tắt bit đó, nên không đếm trùng. Nguồn <code>m ^ bit</code> không đổi trong lượt này vì nó tắt bit <code>b</code>. Với <code>B</code> lượt quét <code>2ᴮ</code> mask, ta dùng O(B · 2ᴮ) thời gian và O(2ᴮ) bộ nhớ.",
        en: "When <code>m</code> has bit <code>b</code> set, the two terms cover disjoint submasks with that bit set and clear. The source <code>m ^ bit</code> stays unchanged during this pass because bit <code>b</code> is clear there. The <code>B</code> passes over <code>2ᴮ</code> masks take O(B · 2ᴮ) time and O(2ᴮ) space.",
      },
      lines: [2, 4, 5], watch: { b: 2, m: "111", source: "011", f: 18 }, verdict: "ac", fit: "all",
      scene: picture(3, 7, "f[111₂] = 8 + 10 = 18"),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("stage", { shape: shapes.pill(), x: 3.5, y: 0 });
  values.forEach((_, mask) => {
    scene.add(`mask${mask}`, { shape: shapes.pill({ text: binary(mask), h: 22, pad: 5 }), x: mask, y: 1.45 });
    scene.add(`src${mask}`, { shape: shapes.block({ w: 40, h: 27, depth: 4 }), x: mask, y: 2.93 });
    scene.add(`dst${mask}`, { shape: shapes.block({ w: 40, h: 27, depth: 4 }), x: mask, y: 4.41 });
    scene.add(`calc${mask}`, { shape: shapes.pill({ h: 20, pad: 4 }), x: mask, y: 5.64, o: 0 });
  });
  scene.add("formula", { shape: shapes.pill(), x: 3.5, y: 7.13, o: 0 });
}
