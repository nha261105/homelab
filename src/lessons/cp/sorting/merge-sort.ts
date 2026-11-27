import type { Lesson, SceneMap } from "../../../lib/types";

const A = [8, 3, 5, 1, 7, 2, 6, 4];
const U = 38;
const LEVELS = 4;
const ROW = 2.55;
const TREE = Array.from({ length: LEVELS }, (_, depth) => {
  const size = A.length / 2 ** depth;
  return Array.from({ length: 2 ** depth }, (_, index) => {
    const values = A.slice(index * size, (index + 1) * size);
    return {
      depth,
      index,
      id: `d${depth}n${index}`,
      x: index * size + (size - 1) / 2,
      values,
      sorted: [...values].sort((a, b) => a - b),
    };
  });
}).flat();

function tree(visibleDepth: number, sortedFrom: number, focus: number, rootPrefix?: string): SceneMap {
  const scene: SceneMap = {};
  for (const { id, depth, index, values, sorted } of TREE) {
    const visible = depth <= visibleDepth;
    const ready = depth >= sortedFrom;
    const prefix = depth === 0 ? rootPrefix : undefined;
    scene[id] = {
      o: visible ? 1 : 0,
      text: prefix ?? (ready ? sorted : values).join(" "),
      cls: prefix ? "is-active" : ready ? "is-good" : depth === focus ? "is-active" : "",
      ...(visible && depth === focus && ready ? { fx: { type: "pulse", delay: index * 55 } } : {}),
    };
    if (depth > 0 && visible) {
      scene[`edge-${id}`] = depth === focus && !ready
        ? { p: 1, from: { p: 0 }, delay: 140 + index * 40, dur: 320 }
        : { p: 1 };
    }
  }
  return scene;
}

const fitTree = (depth: number) => TREE.filter((node) => node.depth <= depth).map((node) => node.id);
const FULL_TREE = fitTree(3);

export const lesson: Lesson = {
  track: "cp",
  topic: "sorting",
  slug: "merge-sort",
  title: { vi: "Merge sort", en: "Merge sort" },
  added: "2026-11-27",
  summary: {
    vi: "Chia mảng làm đôi cho đến khi còn từng phần tử, rồi trộn ngược lên thành mảng đã sắp xếp.",
    en: "Split the array into single elements, then merge back up to build a sorted array.",
  },
  level: "basic",
  minutes: 9,
  time: "O(n log n)",
  memory: "O(n)",
  goal: {
    vi: "Sắp tăng dần <b>[8, 3, 5, 1, 7, 2, 6, 4]</b> bằng cách chia đôi rồi trộn",
    en: "Sort <b>[8, 3, 5, 1, 7, 2, 6, 4]</b> by splitting and merging",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">void</span> merge_sort(vector&lt;int&gt;&amp; a, vector&lt;int&gt;&amp; tmp, int l, int r) {',
    '  <span class="kw">if</span> (r - l &lt;= 1) <span class="kw">return</span>;',
    '  <span class="kw">int</span> m = l + (r - l) / 2;',
    '  merge_sort(a, tmp, l, m);',
    '  merge_sort(a, tmp, m, r);',
    '  <span class="kw">int</span> i = l, j = m, k = l;',
    '  <span class="kw">while</span> (i &lt; m &amp;&amp; j &lt; r)',
    '    tmp[k++] = a[i] &lt;= a[j] ? a[i++] : a[j++];',
    '  <span class="kw">while</span> (i &lt; m) tmp[k++] = a[i++];',
    '  <span class="kw">while</span> (j &lt; r) tmp[k++] = a[j++];',
    '  copy(tmp.begin() + l, tmp.begin() + r, a.begin() + l);',
    '}',
    'vector&lt;int&gt; tmp(a.size());',
    'merge_sort(a, tmp, 0, a.size());',
  ],
  watch: [
    { key: "range", label: "[l, r)" },
    { key: "mid", label: "m" },
    { key: "heads", label: "a[i], a[j]" },
    { key: "out", label: { vi: "đã trộn", en: "merged" } },
  ],
  practice: [
    { src: "CSES 1621", name: "Distinct Numbers", lv: "★☆☆", url: "https://cses.fi/problemset/task/1621" },
    { src: "LeetCode 912", name: "Sort an Array", lv: "★★☆", url: "https://leetcode.com/problems/sort-an-array/" },
  ],
  sceneOptions: { unit: U, view: [-48, -106, 362, 295] },
  legend: [
    { cls: "acc", label: { vi: "đang xét", en: "in progress" } },
    { cls: "ac", label: { vi: "đã sắp xếp", en: "sorted" } },
  ],
  entrance: ["d0n0"],
  steps: [
    {
      title: { vi: "Sắp xếp tám số", en: "Sort eight numbers" }, kind: "problem",
      body: {
        vi: "Sắp dãy 8, 3, 5, 1, 7, 2, 6, 4 theo thứ tự tăng dần. Mỗi lần quét phần còn lại để tìm số nhỏ nhất sẽ mất tổng cộng O(n²).",
        en: "Sort the eight numbers 8, 3, 5, 1, 7, 2, 6, 4 in ascending order. Scanning the remaining values for the minimum each time takes O(n²) in total.",
      },
      lines: [13, 14], watch: { range: "[0, 8)" }, verdict: "run", fit: fitTree(0),
      scene: tree(0, 4, 0),
    },
    {
      title: { vi: "Chia thành hai nửa", en: "Split into halves" }, kind: "concept",
      body: {
        vi: "Đoạn <code>[0, 8)</code> có <code>m = 4</code>. Hai lời gọi đệ quy xử lý <code>[0, 4)</code> chứa 8, 3, 5, 1 và <code>[4, 8)</code> chứa 7, 2, 6, 4.",
        en: "For <code>[0, 8)</code>, the midpoint is <code>m = 4</code>. The recursive calls handle <code>[0, 4)</code> with 8, 3, 5, 1 and <code>[4, 8)</code> with 7, 2, 6, 4.",
      },
      lines: [3, 4, 5], watch: { range: "[0, 8)", mid: 4 }, verdict: "run", fit: fitTree(1),
      scene: tree(1, 4, 1),
    },
    {
      title: { vi: "Chia từng nửa", en: "Split each half" }, kind: "step",
      body: {
        vi: "Tiếp tục chia ở <code>m = 2</code> và <code>m = 6</code>. Ta có bốn cặp: 8 và 3, 5 và 1, 7 và 2, 6 và 4.",
        en: "Split again at <code>m = 2</code> and <code>m = 6</code>. This gives four pairs: 8 and 3, 5 and 1, 7 and 2, 6 and 4.",
      },
      lines: [3, 4, 5], watch: { range: "[0, 4), [4, 8)", mid: "2, 6" }, verdict: "run", fit: fitTree(2),
      scene: tree(2, 4, 2),
    },
    {
      title: { vi: "Dừng ở một số", en: "Stop at one value" }, kind: "step",
      body: {
        vi: "Chia 8 và 3 thành hai đoạn riêng, rồi làm tương tự với ba cặp còn lại. Khi <code>r - l = 1</code>, đoạn đã có thứ tự nên lời gọi trả về ngay.",
        en: "Split 8 and 3 into separate ranges and do the same for the other three pairs. When <code>r - l = 1</code>, the range is already sorted and the call returns immediately.",
      },
      lines: [2, 4, 5], watch: { range: "[0, 1), [1, 2)" }, verdict: "run", fit: FULL_TREE,
      scene: tree(3, 3, 3),
    },
    {
      title: { vi: "Trộn thành từng cặp", en: "Merge into pairs" }, kind: "step",
      body: {
        vi: "So 8 và 3, ghi 3 vào <code>tmp</code> trước rồi chép nốt 8. Sau khi chép kết quả về <code>a</code>, bốn cặp lần lượt là [3, 8], [1, 5], [2, 7], [4, 6].",
        en: "Compare 8 and 3, write 3 to <code>tmp</code>, then copy the remaining 8. After copying back to <code>a</code>, the four pairs are [3, 8], [1, 5], [2, 7], [4, 6].",
      },
      lines: [6, 7, 8, 9, 10, 11], watch: { range: "[0, 2)", mid: 1, heads: "8, 3", out: "3, 8" },
      verdict: "run", fit: FULL_TREE, scene: tree(3, 2, 2),
    },
    {
      title: { vi: "Trộn từng nửa", en: "Merge each half" }, kind: "step",
      body: {
        vi: "Trộn [3, 8] với [1, 5]: lấy 1 trước, rồi lần lượt lấy 3, 5 và 8. Trộn hai cặp bên phải theo cùng quy tắc được [2, 4, 6, 7].",
        en: "Merge [3, 8] with [1, 5]: take 1 first, then 3, 5, and 8. Applying the same rule on the right gives [2, 4, 6, 7].",
      },
      lines: [6, 7, 8, 9, 10, 11], watch: { range: "[0, 4)", mid: 2, heads: "3, 1", out: "1, 3, 5, 8" },
      verdict: "run", fit: FULL_TREE, scene: tree(3, 1, 1),
    },
    {
      title: { vi: "So hai số đầu", en: "Compare the two heads" }, kind: "step",
      body: {
        vi: "Ở lần trộn cuối, <code>a[i] = 1</code> nhỏ hơn <code>a[j] = 2</code>, nên ghi 1 trước và tăng <code>i</code>. Đầu bên trái giờ là 3, nên lượt tiếp theo sẽ lấy 2 từ bên phải.",
        en: "In the final merge, <code>a[i] = 1</code> is smaller than <code>a[j] = 2</code>, so write 1 first and advance <code>i</code>. The left head is now 3, so the next pick is 2 from the right.",
      },
      lines: [6, 7, 8], watch: { range: "[0, 8)", mid: 4, heads: "3, 2", out: "1" },
      verdict: "run", fit: FULL_TREE, scene: tree(3, 1, 0, "1 · …"),
    },
    {
      title: { vi: "Xong lần trộn cuối", en: "Finish the final merge" }, kind: "answer",
      body: {
        vi: "Sau 1 và 2, lần lượt lấy 3, 4, 5, 6, 7. Nửa phải đã hết nên chép nốt 8 từ nửa trái, rồi đưa cả dãy [1, 2, 3, 4, 5, 6, 7, 8] về <code>a</code>.",
        en: "After 1 and 2, take 3, 4, 5, 6, and 7. The right half is exhausted, so append 8 from the left and copy [1, 2, 3, 4, 5, 6, 7, 8] back to <code>a</code>.",
      },
      lines: [7, 8, 9, 11], watch: { range: "[0, 8)", mid: 4, out: "1, 2, 3, 4, 5, 6, 7, 8" },
      verdict: "ac", fit: FULL_TREE, scene: tree(3, 0, 0),
    },
    {
      title: { vi: "Tính theo từng tầng", en: "Count work by level" }, kind: "recap",
      body: {
        vi: "Hai nửa đã có thứ tự nên số nhỏ nhất còn lại luôn ở một trong hai đầu. Mỗi tầng trộn xử lý đúng 8 phần tử, tổng cộng 3 tầng trong ví dụ này, hay O(n log n) thời gian nói chung. Dùng chung <code>tmp</code> dài n cho mọi lần trộn, nên bộ nhớ thêm là O(n).",
        en: "With both halves sorted, the smallest remaining value is always one of the two heads. Every merge level handles all eight elements, with three such levels here and O(n log n) time in general. Reusing one length-n <code>tmp</code> array keeps extra space at O(n).",
      },
      lines: [3, 7, 8, 13], watch: { out: "1, 2, 3, 4, 5, 6, 7, 8" },
      verdict: "ac", fit: FULL_TREE, scene: tree(3, 0, -1),
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  for (const { id, index, depth, x, values } of TREE) {
    scene.add(id, {
      shape: shapes.block({ label: values.join(" "), w: values.length * U - 8, h: 30, depth: 4, r: 7 }),
      x, y: depth * ROW, o: depth === 0 ? 1 : 0,
    });
    // Links attach to the top of a shape. Anchor the outgoing link at the block's bottom.
    if (depth < LEVELS - 1) {
      scene.add(`split-${id}`, { shape: shapes.pill({ h: 0 }), x, y: depth * ROW + 0.25, o: 0 });
    }
    if (depth > 0) {
      scene.link(`edge-${id}`, {
        from: `split-d${depth - 1}n${Math.floor(index / 2)}`, to: id, bend: -0.12,
      });
    }
  }
}
