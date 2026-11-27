import type { Lesson, SceneMap } from "../../../lib/types";

const A = [1_000_000_000, 20, 700, 20, 45];
const sorted = [...A].sort((a, b) => a - b);
const keys = [...new Set(sorted)];
const ranks = A.map((v) => keys.indexOf(v));
const counts = keys.map((_, r) => ranks.filter((k) => k === r).length);
const range = [21, 800];
const left = keys.filter((v) => v < range[0]).length;
const right = keys.filter((v) => v <= range[1]).length;
const answer = counts.slice(left, right).reduce((sum, n) => sum + n, 0);
const sums = [counts[0] + counts[1], counts[2] + counts[3]];
const display = (v: number) => v === 1_000_000_000 ? "10⁹" : String(v);
const x = (i: number) => 1.25 * i;
const treeEdges = [
  ["root", "left"], ["root", "right"], ["left", "f0"], ["left", "f1"], ["right", "f2"], ["right", "f3"],
];

function row(values: number[], id: string, cls = ""): SceneMap {
  return Object.fromEntries(values.map((v, i) => [`${id}${i}`, { o: 1, cls, text: display(v) }]));
}

function picture(stage: number, formula = ""): SceneMap {
  const output = stage === 6 || stage === 7;
  const scene: SceneMap = {
    ...Object.fromEntries(sorted.map((_, i) => [`k${i}`, { o: 0, text: "" }])),
    ...(stage < 7 ? row(A, "a") : Object.fromEntries(A.map((_, i) => [`a${i}`, { o: 0, text: display(A[i]) }]))),
    ...(stage >= 1 && stage < 7 ? row(stage === 1 ? sorted : keys, "k") : {}),
    ...(stage >= 4 ? row(counts, "f") : {}),
    calc: { o: formula ? 1 : 0, text: formula, delay: 350, cls: output ? "v-eq" : "" },
  };
  if (stage === 3) {
    for (const i of [1, 3]) {
      scene[`a${i}`] = { ...scene[`a${i}`], cls: "is-active" };
      scene[`map${i}`] = { p: 1, cls: "v-eq", from: { p: 0 }, delay: 160 };
    }
    scene.k0 = { ...scene.k0, cls: "is-good" };
  }
  if (stage === 4) scene.f0 = { ...scene.f0, cls: "is-good" };
  if (stage === 5 || stage === 6) {
    for (let i = 0; i < keys.length; ++i) {
      const inside = i >= left && i < right;
      scene[`k${i}`] = { ...scene[`k${i}`], cls: inside ? "is-active" : "is-out" };
      scene[`f${i}`] = { ...scene[`f${i}`], cls: inside ? (output ? "is-good" : "is-active") : "is-out" };
    }
  }
  if (stage === 7) {
    for (const node of ["root", "left", "right"]) scene[node] = { o: 1 };
    treeEdges.forEach((_, i) => { scene[`e${i}`] = { p: 1, from: { p: 0 }, delay: 160 }; });
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "segtree-adv", slug: "coordinate-compress",
  title: { vi: "Nén toạ độ", en: "Coordinate compression" },
  added: "2026-11-27", level: "hard", minutes: 9,
  summary: {
    vi: "Ánh xạ giá trị lớn về các chỉ số liên tiếp để segment tree chỉ cần một lá cho mỗi giá trị phân biệt.",
    en: "Map large values to consecutive indices so a segment tree needs just one leaf per distinct value.",
  },
  time: "O(N log N + q log m)", memory: "O(N)",
  goal: { vi: "Đếm lương trong đoạn <b>[21, 800]</b>", en: "Count salaries in <b>[21, 800]</b>" },
  codeLang: "C++17",
  code: [
    'vector&lt;int&gt; keys = a;',
    'keys.insert(keys.end(), future.begin(), future.end());',
    'sort(keys.begin(), keys.end());',
    'keys.erase(unique(keys.begin(), keys.end()), keys.end());',
    '<span class="kw">auto</span> rank = [&amp;](<span class="kw">int</span> v) {',
    '  <span class="kw">return</span> lower_bound(keys.begin(), keys.end(), v) - keys.begin();',
    '};',
    'SegTree tree(keys.size());',
    '<span class="kw">for</span> (<span class="kw">int</span> v : a) tree.add(rank(v), 1);',
    '<span class="kw">auto</span> count = [&amp;](<span class="kw">int</span> lo, <span class="kw">int</span> hi) {',
    '  <span class="kw">int</span> l = rank(lo);',
    '  <span class="kw">int</span> r = upper_bound(keys.begin(), keys.end(), hi) - keys.begin();',
    '  <span class="kw">return</span> tree.sum(l, r);',
    '};',
  ],
  watch: [
    { key: "m", label: { vi: "số giá trị khác nhau", en: "distinct values" } },
    { key: "rank", label: "rank(20)" },
    { key: "span", label: "[l, r)" },
    { key: "count", label: { vi: "số người", en: "employees" } },
  ],
  practice: [
    { src: "LeetCode 1331", name: "Rank Transform of an Array", lv: "★☆☆", url: "https://leetcode.com/problems/rank-transform-of-an-array/" },
    { src: "CSES 1144", name: "Salary Queries", lv: "★★☆", url: "https://cses.fi/problemset/task/1144" },
  ],
  sceneOptions: { unit: 59 },
  legend: [
    { cls: "acc", label: { vi: "giá trị đang xét", en: "values in focus" } },
    { cls: "ac", label: { vi: "kết quả", en: "result" } },
    { cls: "dim", label: { vi: "ngoài đoạn hỏi", en: "outside the query" } },
  ],
  entrance: A.map((_, i) => `a${i}`),
  steps: [
    {
      title: { vi: "Lương rất thưa", en: "Sparse salary values" }, kind: "problem",
      body: {
        vi: "Năm nhân viên nhận lương từ 20 đến 10⁹. Ta muốn đếm số người có lương trong <code>[21, 800]</code>: quét từng người tốn O(n), còn dựng cây có lá cho từng mức lương từ 1 đến 10⁹ thì quá tốn bộ nhớ.",
        en: "Five employees have salaries ranging from 20 to 10⁹. To count salaries in <code>[21, 800]</code>, scanning employees takes O(n) per query, while a tree with a leaf for every salary from 1 to 10⁹ uses too much memory.",
      },
      lines: [1], watch: {}, verdict: "run", fit: "all", scene: picture(0),
    },
    {
      title: { vi: "Sắp xếp giá trị", en: "Sort the values" }, kind: "step",
      body: {
        vi: "Sao chép danh sách lương rồi sắp xếp thành <code>[20, 20, 45, 700, 10⁹]</code>. Nếu đọc trước được truy vấn cập nhật, thêm các mức lương sẽ xuất hiện vào <code>future</code> trước khi sắp xếp. Ví dụ này dùng <code>future</code> rỗng.",
        en: "Copy and sort the salaries to get <code>[20, 20, 45, 700, 10⁹]</code>. When updates can be read ahead of time, put their new salaries in <code>future</code> before sorting. Here <code>future</code> is empty.",
      },
      lines: [1, 2, 3], watch: {}, verdict: "run", fit: "all", scene: picture(1),
    },
    {
      title: { vi: "Xoá các bản trùng", en: "Remove duplicates" }, kind: "step",
      body: {
        vi: "Hai số 20 đứng cạnh nhau nên giữ lại một ô trong <code>keys</code>. Bốn giá trị còn lại nhận bốn chỉ số từ 0 đến 3 theo thứ tự tăng dần.",
        en: "The two 20s are adjacent, so keep one entry in <code>keys</code>. The four remaining values get indices 0 through 3 in increasing order.",
      },
      lines: [4], watch: { m: keys.length }, verdict: "run", fit: "all", scene: picture(2),
    },
    {
      title: { vi: "Tra chỉ số nén", en: "Look up ranks" }, kind: "concept",
      body: {
        vi: "<code>lower_bound</code> tìm ô đầu tiên có giá trị ít nhất bằng <code>v</code>. Với <code>v = 20</code>, cả hai nhân viên đều ánh xạ vào ô 0. Dãy chỉ số theo thứ tự nhân viên là <code>[3, 0, 2, 0, 1]</code>.",
        en: "<code>lower_bound</code> finds the first entry at least <code>v</code>. Both employees with <code>v = 20</code> map to index 0. The ranks in employee order are <code>[3, 0, 2, 0, 1]</code>.",
      },
      lines: [5, 6, 7], watch: { m: keys.length, rank: ranks[1] }, verdict: "run", fit: "all",
      scene: picture(3, "20 → 0"),
    },
    {
      title: { vi: "Đếm vào từng lá", en: "Fill the frequency leaves" }, kind: "step",
      body: {
        vi: "Mỗi người tăng một đơn vị ở lá theo chỉ số nén. Hai người nhận 20 cùng tăng lá 0, nên các lá của cây tổng lưu <code>[2, 1, 1, 1]</code>.",
        en: "Each employee adds one to the leaf for their rank. The two employees earning 20 both increment leaf 0, so the sum tree’s leaves hold <code>[2, 1, 1, 1]</code>.",
      },
      lines: [8, 9], watch: { m: keys.length, rank: ranks[1] }, verdict: "run", fit: "all",
      scene: picture(4, "f[0] = 1 + 1 = 2"),
    },
    {
      title: { vi: "Đổi hai cận", en: "Translate both bounds" }, kind: "step",
      body: {
        vi: "Lương đầu tiên ≥ 21 là 45, ở chỉ số 1. Lương đầu tiên &gt; 800 là 10⁹, ở chỉ số 3. Vì vậy đoạn lương đóng <code>[21, 800]</code> trở thành đoạn chỉ số nửa mở <code>[1, 3)</code> dù hai cận không có trong <code>keys</code>.",
        en: "The first salary ≥ 21 is 45 at index 1. The first salary &gt; 800 is 10⁹ at index 3. Thus the inclusive salary range <code>[21, 800]</code> becomes the half-open index range <code>[1, 3)</code> even though neither bound is in <code>keys</code>.",
      },
      lines: [10, 11, 12], watch: { m: keys.length, span: `[${left}, ${right})` }, verdict: "run", fit: "all",
      scene: picture(5, "[21, 800] → [1, 3)"),
    },
    {
      title: { vi: "Cộng hai tần suất", en: "Add the two frequencies" }, kind: "answer",
      body: {
        vi: "Hỏi tổng <code>tree.sum(1, 3)</code> trên đoạn nửa mở: lá 1 và lá 2 góp <code>1 + 1 = 2</code>. Đó là hai người nhận lương 45 và 700.",
        en: "Query the half-open sum <code>tree.sum(1, 3)</code>: leaves 1 and 2 contribute <code>1 + 1 = 2</code>. Those are the employees earning 45 and 700.",
      },
      lines: [13], watch: { span: `[${left}, ${right})`, count: answer }, verdict: "ac", fit: "all",
      scene: picture(6, `f[1] + f[2] = ${answer}`),
    },
    {
      title: { vi: "Cây chỉ cần bốn lá", en: "Four leaves are enough" }, kind: "recap",
      body: {
        vi: "Nén giữ thứ tự, nên một đoạn giá trị luôn ứng với một đoạn chỉ số liên tiếp. Đổi lương thì giảm lá cũ và tăng lá mới. Với N giá trị thu thập trước, m giá trị phân biệt và q thao tác, chuẩn bị tốn O(N log N), mỗi thao tác tốn O(log m).",
        en: "Compression preserves order, so a value interval stays contiguous in rank space. To change a salary, decrement the old leaf and increment the new one. For N collected values, m distinct values, and q operations, preparation takes O(N log N) and each operation O(log m).",
      },
      lines: [3, 4, 8, 9, 13], watch: { m: keys.length, span: `[${left}, ${right})`, count: answer }, verdict: "ac",
      fit: "all", scene: picture(7, `(${counts[0]} + ${counts[1]}) + (${counts[2]} + ${counts[3]}) = ${A.length}`),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  const block = (label: number | string, sub: string | null = null) => shapes.block({ label, sub, w: 52, h: 30 });
  A.forEach((v, i) => scene.add(`a${i}`, { shape: block(display(v), `a[${i}]`), x: x(i) }));
  sorted.forEach((v, i) => scene.add(`k${i}`, { shape: block(display(v), `keys[${i}]`), x: x(i), y: 2.85, o: 0 }));
  counts.forEach((v, i) => scene.add(`f${i}`, { shape: block(v, `f[${i}]`), x: x(i), y: 5.7, o: 0 }));
  scene.add("root", { shape: block(sums[0] + sums[1]), x: x(1.5), o: 0 });
  scene.add("left", { shape: block(sums[0]), x: x(0.5), y: 2.85, o: 0 });
  scene.add("right", { shape: block(sums[1]), x: x(2.5), y: 2.85, o: 0 });
  for (const i of [1, 3]) scene.link(`map${i}`, { from: `a${i}`, to: "k0", anchor: "center", arrow: true, bend: 0 });
  treeEdges.forEach(([from, to], i) => scene.link(`e${i}`, { from, to, anchor: "center", bend: 0 }));
  scene.add("calc", { shape: shapes.pill(), x: x(1.75), y: 7.75, o: 0 });
}
