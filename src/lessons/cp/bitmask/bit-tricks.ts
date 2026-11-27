import type { Lesson, SceneMap } from "../../../lib/types";

const START = 0b01010010;
const SET_MASK = 1 << 2;
const TEST_MASK = 1 << 4;
const ON = START | SET_MASK;
const OFF = ON & ~TEST_MASK;
const PAIR_A = 12, PAIR_B = 5, SINGLE = 9;
const U = 38;

function picture(x: number, mask: number | null, result: number | null, operator = "", formula = "", focus = 0): SceneMap {
  const scene: SceneMap = {
    lhs: { text: operator === "^" ? "a" : "x" },
    rhs: { text: operator, o: mask === null ? 0 : 1 },
    eq: { o: result === null ? 0 : 1 },
    calc: { text: formula, y: mask === null ? 2.55 : 6.55, o: formula ? 1 : 0, cls: result === SINGLE ? "v-eq" : "" },
  };

  for (const [row, value] of [x, mask, result].entries()) {
    for (let i = 0; i < 8; i++) {
      const bit = 1 << i;
      scene[`b${row}${i}`] = {
        text: value === null ? "" : String(Number(Boolean(value & bit))),
        o: value === null ? 0 : 1,
        cls: focus & bit ? (row === 2 ? "is-good" : "is-active") : "",
        ...(row === 2 && value !== null && (focus & bit) ? { fx: { type: "pulse", delay: 320 } } : {}),
      };
    }
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "bitmask",
  slug: "bit-tricks",
  title: { vi: "Thao tác bit cơ bản", en: "Bit tricks" },
  added: "2026-11-27",
  summary: {
    vi: "Bật, kiểm tra và tắt từng bit bằng mask, rồi dùng XOR để khử các cặp số bằng nhau.",
    en: "Set, test, and clear individual bits with masks, then use XOR to cancel equal pairs.",
  },
  level: "basic",
  minutes: 8,
  time: "O(1) / bit op · O(n) XOR",
  memory: "O(1)",
  goal: {
    vi: "Thao tác trên <b>8 bit</b> và tìm số xuất hiện một lần",
    en: "Manipulate <b>8 bits</b> and find the value that appears once",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">unsigned</span> x = 0b01010010u;',
    'x |= 1u &lt;&lt; 2;',
    '<span class="kw">bool</span> wasSet = (x &amp; (1u &lt;&lt; 4)) != 0;',
    'x &amp;= ~(1u &lt;&lt; 4);',
    '<span class="kw">bool</span> stillSet = (x &amp; (1u &lt;&lt; 4)) != 0;',
    '',
    '<span class="kw">int</span> singleNumber(<span class="kw">const</span> vector&lt;<span class="kw">int</span>&gt;&amp; a) {',
    '  <span class="kw">int</span> acc = 0;',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : a) acc ^= v;',
    '  <span class="kw">return</span> acc;',
    '}',
  ],
  watch: [
    { key: "x", label: "x" },
    { key: "i", label: "i" },
    { key: "test", label: { vi: "kết quả kiểm tra", en: "bit test" } },
    { key: "acc", label: "acc" },
  ],
  practice: [
    { src: "LeetCode 191", name: "Number of 1 Bits", lv: "★☆☆", url: "https://leetcode.com/problems/number-of-1-bits/" },
    { src: "LeetCode 136", name: "Single Number", lv: "★☆☆", url: "https://leetcode.com/problems/single-number/" },
  ],
  sceneOptions: { unit: U, view: [-80, -120, 390, 300] },
  legend: [
    { cls: "acc", label: { vi: "bit đang xét", en: "bits in focus" } },
    { cls: "ac", label: { vi: "bit kết quả", en: "result bits" } },
  ],
  steps: [
    {
      title: { vi: "Đọc hàng bit", en: "Read the bits" }, kind: "problem",
      body: {
        vi: "Cho <code>x = 82</code>, hãy bật bit 2, kiểm tra rồi tắt bit 4. Bit 0 nằm ngoài cùng bên phải; thay vì đổi số thành chuỗi rồi sửa từng ký tự, ta có thể dùng phép toán bit trực tiếp.",
        en: "Start with <code>x = 82</code>, set bit 2, then test and clear bit 4. Bit 0 is on the far right. Bitwise operations let us work directly on the number and skip converting it to a string.",
      },
      lines: [1], watch: { x: START }, verdict: "run", fit: "all",
      scene: picture(START, null, null, "", "64 + 16 + 2 = 82", START),
    },
    {
      title: { vi: "Bật bit số 2", en: "Set bit 2" }, kind: "step",
      body: {
        vi: "<code>1u &lt;&lt; 2</code> tạo mask 4, chỉ có bit 2 bằng 1. OR với 0 giữ nguyên bit, còn <code>0 | 1 = 1</code> ở cột 2 đưa <code>x</code> từ 82 lên 86.",
        en: "<code>1u &lt;&lt; 2</code> makes the mask 4, with a 1 only at bit 2. OR with 0 preserves each other bit, while <code>0 | 1 = 1</code> in column 2 raises <code>x</code> from 82 to 86.",
      },
      lines: [2], watch: { x: ON, i: 2 }, verdict: "run", fit: "all",
      scene: picture(START, SET_MASK, ON, "|", "82 | 4 = 86", SET_MASK),
    },
    {
      title: { vi: "Kiểm tra bit 4", en: "Test bit 4" }, kind: "step",
      body: {
        vi: "AND với mask 16 chỉ giữ lại bit 4 của <code>x</code>. <code>86 &amp; 16 = 16</code> khác 0, vậy bit này đang bật. Phép kiểm tra giữ nguyên <code>x = 86</code>.",
        en: "AND with the mask 16 keeps only bit 4 of <code>x</code>. <code>86 &amp; 16 = 16</code> is nonzero, so the bit is set. The test leaves <code>x</code> at 86.",
      },
      lines: [3], watch: { x: ON, i: 4, test: "true" }, verdict: "run", fit: "all",
      scene: picture(ON, TEST_MASK, ON & TEST_MASK, "&", "86 & 16 = 16", TEST_MASK),
    },
    {
      title: { vi: "Tắt bit số 4", en: "Clear bit 4" }, kind: "step",
      body: {
        vi: "<code>~(1u &lt;&lt; 4)</code> đảo mask 16. Trong 8 bit thấp, chỉ cột 4 có 0. AND với mask đã đảo giữ nguyên các cột khác và đưa <code>x</code> từ 86 xuống 70.",
        en: "<code>~(1u &lt;&lt; 4)</code> flips the mask 16. Of the low eight bits, only column 4 has a 0. AND with this flipped mask keeps the other columns and takes <code>x</code> from 86 down to 70.",
      },
      lines: [4], watch: { x: OFF, i: 4 }, verdict: "run", fit: "all",
      scene: picture(ON, ~TEST_MASK, OFF, "&", "86 & ~16 = 70", TEST_MASK),
    },
    {
      title: { vi: "Thử lại sau khi tắt", en: "Test after clearing" }, kind: "step",
      body: {
        vi: "Dùng lại đúng mask 16. Giờ <code>70 &amp; 16 = 0</code> vì cả cột 4 lẫn mọi cột còn lại đều cho 0, nên <code>stillSet</code> là <code>false</code>.",
        en: "Use the same mask 16 again. Now <code>70 &amp; 16 = 0</code> because column 4 and all other columns give 0, so <code>stillSet</code> is <code>false</code>.",
      },
      lines: [5], watch: { x: OFF, i: 4, test: "false" }, verdict: "run", fit: "all",
      scene: picture(OFF, TEST_MASK, OFF & TEST_MASK, "&", "70 & 16 = 0", TEST_MASK),
    },
    {
      title: { vi: "XOR khử cặp 12", en: "XOR cancels two 12s" }, kind: "concept",
      body: {
        vi: "Trong <code>[12, 5, 12, 9, 5]</code>, tìm số xuất hiện đúng một lần. XOR cho 1 ở cột có hai bit khác nhau, nên hai số 12 cùng mẫu bit sẽ cho <code>12 ^ 12 = 0</code>.",
        en: "Find the value that occurs once in <code>[12, 5, 12, 9, 5]</code>. XOR gives 1 where two bits differ, so two 12s with identical bit patterns give <code>12 ^ 12 = 0</code>.",
      },
      lines: [7, 8, 9], watch: {}, verdict: "run", fit: "all",
      scene: picture(PAIR_A, PAIR_A, PAIR_A ^ PAIR_A, "^", "12 ^ 12 = 0", PAIR_A),
    },
    {
      title: { vi: "XOR khử cặp 5", en: "XOR cancels two 5s" }, kind: "step",
      body: {
        vi: "XOR có tính giao hoán và kết hợp, nên khi giải thích ta có thể gom hai cặp: <code>(12 ^ 12) ^ (5 ^ 5) ^ 9</code>. Cặp 5 cũng cho 0, dù hai số 5 ở cách xa nhau trong mảng.",
        en: "XOR is commutative and associative, so we can group the pairs as <code>(12 ^ 12) ^ (5 ^ 5) ^ 9</code>. The two 5s also give 0, even though they are apart in the array.",
      },
      lines: [9], watch: {}, verdict: "run", fit: "all",
      scene: picture(PAIR_B, PAIR_B, PAIR_B ^ PAIR_B, "^", "5 ^ 5 = 0", PAIR_B),
    },
    {
      title: { vi: "Còn lại số 9", en: "Only 9 remains" }, kind: "answer",
      body: {
        vi: "Sau khi khử cặp, <code>0 ^ 0 ^ 9 = 9</code> vì XOR với 0 giữ nguyên từng bit. Vòng lặp XOR theo thứ tự ban đầu, nên cuối cùng <code>acc = 9</code>.",
        en: "After the pairs cancel, <code>0 ^ 0 ^ 9 = 9</code> because XOR with 0 preserves each bit. The loop XORs in input order and ends with <code>acc = 9</code>.",
      },
      lines: [9, 10], watch: { acc: SINGLE }, verdict: "ac", fit: "all",
      scene: picture(0, SINGLE, SINGLE, "^", "0 ^ 9 = 9", SINGLE),
    },
    {
      title: { vi: "Một lượt là đủ", en: "One pass is enough" }, kind: "recap",
      body: {
        vi: "Trên số nguyên có độ rộng cố định, bật, tắt hay kiểm tra một bit đều tốn O(1). Để tìm số không có cặp, mỗi phần tử đi qua đúng một phép XOR, nên mất O(n) thời gian và O(1) bộ nhớ.",
        en: "On fixed-width integers, setting, clearing, or testing a bit takes O(1). Finding the unpaired value uses one XOR per element, taking O(n) time and O(1) space.",
      },
      lines: [2, 3, 4, 9, 10], watch: { acc: SINGLE }, verdict: "ac", fit: "all",
      scene: picture(0, SINGLE, SINGLE, "^", "0 ^ 9 = 9", SINGLE),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i < 8; i++) {
      scene.add(`b${row}${i}`, {
        shape: shapes.block({ w: 30, h: 27, depth: 4, r: 5, sub: row === 0 ? i : null }),
        x: 7 - i,
        y: [0, 2.9, 4.8][row],
        o: row === 0 ? 1 : 0,
      });
    }
  }
  scene.add("lhs", { shape: shapes.pill({ text: "x", pad: 7 }), x: -0.95 });
  scene.add("rhs", { shape: shapes.pill({ pad: 7 }), x: -0.95, y: 2.9, o: 0 });
  scene.add("eq", { shape: shapes.pill({ text: "=", pad: 7 }), x: -0.95, y: 4.8, o: 0 });
  scene.add("calc", { shape: shapes.pill(), x: 3.5, y: 6.55, o: 0 });
}
