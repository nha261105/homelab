import type { Lesson, SceneMap } from "../../../lib/types";

const S = "abcabcbb";
const U = 62;
const FIT = ["c0", "c7", "status"];

function windowAt(l: number, r: number, text: string, duplicates: number[] = [], answer = false): SceneMap {
  const cls = answer ? "is-good" : "is-active";
  const scene: SceneMap = {
    window: { x: (l + r) / 2, w: (r - l) * U + 70, o: 1, cls: duplicates.length ? "is-bad" : cls },
    status: {
      text, o: 1, s: 1, cls: duplicates.length ? "v-gt" : answer ? "v-eq" : "",
      from: { o: 0, s: 0.7 }, delay: 560, dur: 340, ease: "back",
    },
  };
  for (let i = l; i <= r; i++) scene[`c${i}`] = { cls };
  for (const i of duplicates) {
    scene[`c${i}`] = { cls: "is-bad", fx: { type: "shake", delay: 480 } };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "sliding-window",
  slug: "longest-unique",
  title: { vi: "Chuỗi con dài nhất không lặp", en: "Longest substring without repeats" },
  added: "2026-11-27",
  summary: {
    vi: "Mở rộng cửa sổ sang phải và co đầu trái mỗi khi gặp ký tự trùng.",
    en: "Extend the window to the right and shrink it from the left whenever a character repeats.",
  },
  level: "basic",
  minutes: 8,
  time: "O(n)",
  memory: "O(1)",
  goal: {
    vi: 'Tìm độ dài chuỗi con liên tiếp dài nhất không lặp trong <b>"abcabcbb"</b>',
    en: 'Find the maximum length of a substring without repeats in <b>"abcabcbb"</b>',
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> freq[256] = {}, l = 0, best = 0;',
    '<span class="kw">for</span> (<span class="kw">int</span> r = 0, n = s.size(); r &lt; n; ++r) {',
    '  <span class="kw">unsigned char</span> c = s[r];',
    '  ++freq[c];',
    '  <span class="kw">while</span> (freq[c] &gt; 1) {',
    '    --freq[<span class="kw">static_cast</span>&lt;<span class="kw">unsigned char</span>&gt;(s[l])];',
    '    ++l;',
    '  }',
    '  best = max(best, r - l + 1);',
    '}',
    '<span class="kw">return</span> best;',
  ],
  watch: [
    { key: "l", label: "l" },
    { key: "r", label: "r" },
    { key: "freq", label: "freq[c]" },
    { key: "len", label: { vi: "độ dài khung", en: "window length" } },
    { key: "best", label: "best" },
  ],
  practice: [
    { src: "LeetCode 3", name: "Longest Substring Without Repeating Characters", lv: "★★☆", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
    { src: "CSES 1141", name: "Playlist", lv: "★★☆", url: "https://cses.fi/problemset/task/1141" },
  ],
  sceneOptions: { unit: U, view: [-60, -165, 550, 230] },
  legend: [
    { cls: "acc", label: { vi: "cửa sổ hiện tại", en: "current window" } },
    { cls: "wa", label: { vi: "ký tự trùng", en: "repeated character" } },
    { cls: "ac", label: { vi: "một cửa sổ dài nhất", en: "a longest window" } },
  ],
  entrance: [...S].map((_, i) => `c${i}`),
  steps: [
    {
      title: { vi: "Tìm chuỗi không lặp", en: "Find a unique substring" },
      kind: "problem",
      body: {
        vi: 'Trong <code>"abcabcbb"</code>, tìm độ dài lớn nhất của một đoạn liên tiếp mà mỗi ký tự chỉ xuất hiện một lần. Thử từng điểm bắt đầu rồi quét lại có thể mất O(n²).',
        en: 'In <code>"abcabcbb"</code>, find the maximum length of a contiguous substring whose characters each appear once. Starting a new scan at each index can take O(n²).',
      },
      lines: [], watch: {}, verdict: "run", fit: FIT, scene: { status: { text: "" } },
    },
    {
      title: { vi: "Mở rộng đến abc", en: "Extend to abc" },
      kind: "concept",
      body: {
        vi: 'Giữ <code>l = 0</code> và đưa <code>r</code> qua ba ký tự đầu. Số lần xuất hiện của mỗi ký tự trong <code>"abc"</code> đều là 1, nên <code>best</code> tăng lần lượt lên 1, 2 rồi 3.',
        en: 'Keep <code>l = 0</code> and move <code>r</code> through the first three characters. Each occurs once in <code>"abc"</code>, so <code>best</code> grows to 1, 2, then 3.',
      },
      lines: [1, 2, 3, 4, 9], watch: { l: 0, r: 2, freq: 1, len: 3, best: 3 }, verdict: "run", fit: FIT,
      scene: windowAt(0, 2, "r − l + 1 = 3"),
    },
    {
      title: { vi: "Gặp chữ a thứ hai", en: "Meet the second a" },
      kind: "step",
      body: {
        vi: 'Thêm <code>s[3] = a</code>, cửa sổ thành <code>"abca"</code>. Giờ <code>freq[a] = 2</code>, nên phải co cửa sổ trước khi cập nhật <code>best</code>.',
        en: 'Add <code>s[3] = a</code> to make <code>"abca"</code>. Now <code>freq[a] = 2</code>, so shrink the window before updating <code>best</code>.',
      },
      lines: [3, 4, 5], watch: { l: 0, r: 3, freq: 2, len: 4, best: 3 }, verdict: "run", fit: FIT,
      scene: windowAt(0, 3, "freq[a] = 2", [0, 3]),
    },
    {
      title: { vi: "Bỏ chữ a cũ", en: "Remove the earlier a" },
      kind: "step",
      body: {
        vi: 'Bỏ <code>s[0] = a</code> rồi tăng <code>l</code> lên 1. Cửa sổ <code>"bca"</code> có <code>freq[a] = 1</code> và dài 3, nên <code>best</code> vẫn là 3.',
        en: 'Remove <code>s[0] = a</code> and advance <code>l</code> to 1. The window <code>"bca"</code> has <code>freq[a] = 1</code> and length 3, so <code>best</code> stays at 3.',
      },
      lines: [5, 6, 7, 9], watch: { l: 1, r: 3, freq: 1, len: 3, best: 3 }, verdict: "run", fit: FIT,
      scene: windowAt(1, 3, "freq[a] = 1"),
    },
    {
      title: { vi: "Trượt qua b và c", en: "Slide past b and c" },
      kind: "step",
      body: {
        vi: 'Thêm <code>b</code> ở vị trí 4 rồi bỏ <code>b</code> ở vị trí 1, còn <code>"cab"</code>. Làm tương tự với <code>c</code> ở vị trí 5 và 2, ta có <code>"abc"</code> ở đoạn <code>[3, 5]</code>, vẫn dài 3.',
        en: 'Add <code>b</code> at index 4 and remove <code>b</code> at index 1 to get <code>"cab"</code>. Repeat with <code>c</code> at indices 5 and 2 to get <code>"abc"</code> at <code>[3, 5]</code>, still length 3.',
      },
      lines: [2, 4, 5, 6, 7, 9], watch: { l: 3, r: 5, freq: 1, len: 3, best: 3 }, verdict: "run", fit: FIT,
      scene: windowAt(3, 5, "r − l + 1 = 3"),
    },
    {
      title: { vi: "Chữ b trùng ở giữa", en: "A repeat inside" },
      kind: "step",
      body: {
        vi: 'Thêm <code>s[6] = b</code> vào <code>"abc"</code>, được <code>"abcb"</code>. Hai chữ <code>b</code> nằm ở vị trí 4 và 6, nên bỏ riêng chữ <code>a</code> ở vị trí 3 vẫn chưa đủ.',
        en: 'Adding <code>s[6] = b</code> makes <code>"abcb"</code>. The two copies of <code>b</code> are at 4 and 6, so removing just the <code>a</code> at index 3 leaves a repeat.',
      },
      lines: [3, 4, 5], watch: { l: 3, r: 6, freq: 2, len: 4, best: 3 }, verdict: "run", fit: FIT,
      scene: windowAt(3, 6, "freq[b] = 2", [4, 6]),
    },
    {
      title: { vi: "Co qua hai ô", en: "Shrink by two cells" },
      kind: "step",
      body: {
        vi: 'Bỏ lần lượt <code>s[3] = a</code> và <code>s[4] = b</code>, đưa <code>l</code> từ 3 lên 5. Cửa sổ <code>"cb"</code> có <code>freq[b] = 1</code> và dài 2.',
        en: 'Remove <code>s[3] = a</code> and then <code>s[4] = b</code>, advancing <code>l</code> from 3 to 5. The window <code>"cb"</code> has <code>freq[b] = 1</code> and length 2.',
      },
      lines: [5, 6, 7, 9], watch: { l: 5, r: 6, freq: 1, len: 2, best: 3 }, verdict: "run", fit: FIT,
      scene: windowAt(5, 6, "freq[b] = 1"),
    },
    {
      title: { vi: "Độ dài lớn nhất 3", en: "The longest length is 3" },
      kind: "answer",
      body: {
        vi: 'Thêm chữ <code>b</code> cuối rồi co từ trái hai ô, cửa sổ chỉ còn <code>s[7] = b</code>. <code>best</code> vẫn là 3, với một ví dụ là <code>"abc"</code> ở đoạn <code>[0, 2]</code>.',
        en: 'Add the final <code>b</code> and shrink by two cells, leaving only <code>s[7] = b</code>. Return <code>best = 3</code>, achieved by <code>"abc"</code> at <code>[0, 2]</code>.',
      },
      lines: [11], watch: { best: 3 }, verdict: "ac", fit: FIT,
      scene: windowAt(0, 2, "best = 3 ✓", [], true),
    },
    {
      title: { vi: "Hai đầu chỉ tiến", en: "Both ends move forward" },
      kind: "recap",
      body: {
        vi: "Với mỗi <code>r</code>, dừng co ngay khi hết trùng để giữ đoạn hợp lệ dài nhất kết thúc tại <code>r</code>. Hai đầu đều chỉ tiến, nên tổng thời gian là O(n). Bảng đếm cho 256 giá trị byte dùng O(1) bộ nhớ.",
        en: "For each <code>r</code>, stop shrinking as soon as the repeat is gone to keep the longest valid substring ending there. Both ends only move forward, so the scan takes O(n) time. The 256-entry byte count table uses O(1) space.",
      },
      lines: [2, 5, 7, 9], watch: { best: 3 }, verdict: "ac", fit: FIT,
      scene: windowAt(0, 2, "best = 3 ✓", [], true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("window", { shape: shapes.frame(), layer: "back", x: 0, w: 70, o: 0 });
  [...S].forEach((value, i) => scene.add(`c${i}`, { shape: shapes.block({ label: value, sub: i }), x: i, shadow: true }));
  scene.add("status", { shape: shapes.pill(), x: 3.5, z: 1.6, o: 0 });
}
