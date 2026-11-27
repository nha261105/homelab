import type { Lesson, SceneMap } from "../../../lib/types";

const START = [9, 6, 8, 2];
const VALUES = [...START, 10];
const SIFT_UP = [9, 10, 8, 2, 6];
const PUSHED = [10, 9, 8, 2, 6];
const REPLACED = [6, 9, 8, 2];
const POSITIONS = [[0, 0], [-1.2, 2.35], [1.2, 2.35], [-1.95, 4.7], [-0.45, 4.7]];
const PARENTS = [0, 0, 1, 1];
const U = 57;

function heap(values: number[], marks: SceneMap = {}, highlightEdge = 0): SceneMap {
  const cells = VALUES.map((value) => {
    const id = `v${value}`;
    const slot = values.indexOf(value);
    if (slot < 0) return [id, { o: 0, s: 0.8, cls: "is-out", dur: 320 }];
    const [x, y] = POSITIONS[slot];
    return [id, { x, y, o: 1, ...marks[id] }];
  });
  const edges = PARENTS.map((parent, i) => {
    const child = i + 1;
    return [`edge${child}`, child < values.length
      ? {
        p: 1, ends: [`v${values[parent]}`, `v${values[child]}`],
        cls: child === highlightEdge ? "v-gt" : "",
      }
      : { p: 0 }];
  });
  return Object.fromEntries([...cells, ...edges]);
}

const active = { cls: "is-active" };
const good = { cls: "is-good" };
const moved = { ...active, arc: 0.26, land: false, dur: 540 };
const out = { out: { o: 1, cls: "v-eq" } };

export const lesson: Lesson = {
  track: "cp",
  topic: "hashing",
  slug: "priority-queue",
  title: { vi: "Hàng đợi ưu tiên", en: "Priority queues" },
  added: "2026-11-27",
  summary: {
    vi: "Theo dõi một max-heap khi phần tử mới nổi lên và phần tử thay gốc chìm xuống.",
    en: "Follow a max-heap as an inserted value sifts up and a replacement root sifts down.",
  },
  level: "basic",
  minutes: 8,
  time: "O(log n) push/pop · O(1) top",
  memory: "O(n)",
  goal: {
    vi: "Thêm <b>10</b>, lấy phần tử lớn nhất rồi khôi phục max-heap",
    en: "Push <b>10</b>, extract the maximum, and restore the max-heap",
  },
  codeLang: "C++17",
  code: [
    'std::priority_queue&lt;<span class="kw">int</span>&gt; pq;',
    '<span class="kw">for</span> (<span class="kw">int</span> x : {9, 6, 8, 2}) pq.push(x);',
    'pq.push(<span class="nm">10</span>);',
    '',
    '<span class="kw">if</span> (!pq.empty()) {',
    '  <span class="kw">int</span> out = pq.top();',
    '  pq.pop();',
    '}',
  ],
  watch: [
    { key: "n", label: { vi: "số phần tử", en: "size" } },
    { key: "cmp", label: { vi: "so sánh", en: "comparison" } },
    { key: "top", label: "pq.top()" },
    { key: "out", label: "out" },
  ],
  practice: [
    { src: "LeetCode 215", name: "Kth Largest Element in an Array", lv: "★★☆", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
    { src: "CSES 1076", name: "Sliding Window Median", lv: "★★★", url: "https://cses.fi/problemset/task/1076" },
  ],
  sceneOptions: { unit: U, view: [-150, -125, 320, 305] },
  legend: [
    { cls: "acc", label: { vi: "nút đang xét", en: "node in play" } },
    { cls: "wa", label: { vi: "cạnh sai đang xét", en: "current heap violation" } },
    { cls: "ac", label: { vi: "giá trị vừa lấy hoặc đỉnh hợp lệ", en: "extracted value or valid root" } },
  ],
  steps: [
    {
      title: { vi: "Lấy số lớn nhất", en: "Extract the maximum" }, kind: "problem",
      body: {
        vi: "Đang có 9, 6, 8, 2. Sau khi thêm 10, ta cần lấy số lớn nhất ra và tiếp tục xử lý các số còn lại. Nếu dùng mảng không sắp xếp, mỗi lần tìm số lớn nhất phải quét O(n) phần tử.",
        en: "Start with 9, 6, 8, and 2. After adding 10, we need to remove the largest number and keep working with the rest. In an unsorted array, finding the maximum takes an O(n) scan each time.",
      },
      lines: [], watch: { n: 4 }, verdict: "run", fit: "all",
      scene: heap(START),
    },
    {
      title: { vi: "Đỉnh giữ số lớn nhất", en: "The root holds the maximum" }, kind: "concept",
      body: {
        vi: "<code>priority_queue&lt;int&gt;</code> mặc định lấy số lớn nhất trước. Trong max-heap, mỗi nút cha lớn hơn hoặc bằng các con, như 9 ≥ 6 và 9 ≥ 8, nên số lớn nhất luôn ở gốc.",
        en: "A <code>priority_queue&lt;int&gt;</code> gives largest values priority by default. In a max-heap, every parent is at least as large as its children, as in 9 ≥ 6 and 9 ≥ 8, so the maximum is always at the root.",
      },
      lines: [1, 2], watch: { n: 4, top: 9 }, verdict: "run", fit: "all",
      scene: heap(START, { v9: good }),
    },
    {
      title: { vi: "Thêm vào ô trống", en: "Insert in the next slot" }, kind: "step",
      body: {
        vi: "Đặt 10 vào ô trống kế tiếp ở tầng cuối, bên phải 2. Nút cha của 10 là 6, nhỏ hơn nút con mới, nên cần đổi chỗ hai nút.",
        en: "Put 10 in the next open slot on the bottom level, to the right of 2. Its parent is 6, which is smaller than its new child, so the two must swap.",
      },
      lines: [3], watch: { n: 5, cmp: "10 > 6" }, verdict: "run", fit: "all",
      scene: heap(VALUES, {
        v6: active, v10: { ...active, from: { z: 0.55, o: 0 }, ease: "drop", land: true, dur: 500 },
      }, 4),
    },
    {
      title: { vi: "Nổi qua nút cha", en: "Sift past the parent" }, kind: "step",
      body: {
        vi: "Đổi chỗ 10 với 6. Giờ cha của 10 là 9. Vì 10 vẫn lớn hơn cha, ta cần đổi chỗ thêm một lần.",
        en: "Swap 10 with 6. The parent of 10 is now 9. Since 10 is still larger than its parent, we need one more swap.",
      },
      lines: [3], watch: { n: 5, cmp: "10 > 9" }, verdict: "run", fit: "all",
      scene: heap(SIFT_UP, { v6: { arc: 0.14, land: false, delay: 60 }, v10: moved, v9: active }, 1),
    },
    {
      title: { vi: "Số 10 lên đỉnh", en: "10 reaches the root" }, kind: "step",
      body: {
        vi: "Đổi chỗ 10 với 9 để đưa 10 lên gốc. Cạnh vừa sai đã đúng trở lại và <code>pq.top()</code> trả về 10.",
        en: "Swap 10 and 9 to bring 10 to the root. The heap order is restored, and <code>pq.top()</code> returns 10.",
      },
      lines: [3, 6], watch: { n: 5, top: 10 }, verdict: "run", fit: "all",
      scene: heap(PUSHED, { v10: { ...moved, ...good }, v9: { arc: 0.14, land: false, delay: 60 } }),
    },
    {
      title: { vi: "Đưa lá cuối lên", en: "Move up the last leaf" }, kind: "step",
      body: {
        vi: "Đọc 10 bằng <code>pq.top()</code> rồi gọi <code>pq.pop()</code> để xoá. Heap đưa lá cuối là 6 lên gốc để lấp chỗ trống. Cả hai con 9 và 8 đều lớn hơn 6, nên chọn con lớn hơn là 9 để đổi chỗ.",
        en: "Read 10 with <code>pq.top()</code>, then remove it with <code>pq.pop()</code>. The heap moves the last leaf, 6, to the root to fill the gap. Both children, 9 and 8, are larger than 6, so choose the larger child, 9, for the swap.",
      },
      lines: [5, 6, 7], watch: { n: 4, cmp: "9 > 8", out: 10 }, verdict: "run", fit: "all",
      scene: { ...heap(REPLACED, { v6: moved, v9: active, v8: active }, 1), ...out },
    },
    {
      title: { vi: "Chìm qua con lớn", en: "Sift past the larger child" }, kind: "answer",
      body: {
        vi: "Đổi chỗ 6 với 9. Ở vị trí mới, 6 chỉ còn một con là 2 và 6 ≥ 2, nên dừng. Đã lấy ra 10 và đỉnh mới là 9.",
        en: "Swap 6 and 9. At its new position, 6 has only one child, 2, and 6 ≥ 2, so it stops. We extracted 10, and the new maximum is 9.",
      },
      lines: [7], watch: { n: 4, cmp: "6 ≥ 2", top: 9, out: 10 }, verdict: "ac", fit: "all",
      scene: { ...heap(START, { v9: { ...moved, ...good }, v6: { ...moved, delay: 60 } }), ...out },
    },
    {
      title: { vi: "Chỉ đi một nhánh", en: "Follow a single branch" }, kind: "recap",
      body: {
        vi: "Khi thêm, so với cha. Khi xoá đỉnh, so với con lớn hơn để nút đưa lên vẫn lớn hơn hoặc bằng cả hai con. Mỗi lần chỉ đi theo một nhánh dài O(log n), còn đọc đỉnh tốn O(1).",
        en: "On insertion, compare with the parent. On removal, compare with the larger child so the promoted node is at least as large as both children. Either operation follows one branch of height O(log n), and reading the root takes O(1).",
      },
      lines: [3, 6, 7], watch: { n: 4, top: 9, out: 10 }, verdict: "ac", fit: "all",
      scene: { ...heap(START, { v9: good }), ...out },
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  VALUES.forEach((value, slot) => {
    const [x, y] = POSITIONS[slot];
    scene.add(`v${value}`, { shape: shapes.block({ label: value, w: 46, h: 38 }), x, y, o: slot < START.length ? 1 : 0 });
  });
  PARENTS.forEach((parent, i) => {
    const child = i + 1;
    scene.link(`edge${child}`, {
      from: `v${VALUES[parent]}`, to: `v${VALUES[child]}`, bend: -0.35,
    });
  });
  scene.add("out", { shape: shapes.pill({ text: "out = 10" }), x: 1.6, z: 0.35, o: 0 });
}
