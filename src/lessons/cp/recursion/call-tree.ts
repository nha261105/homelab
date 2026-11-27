import type { Lesson, SceneMap } from "../../../lib/types";

interface Call {
  id: string;
  n: number;
  x: number;
  depth: number;
  parent?: string;
}

const calls: Call[] = [];
let nextLeaf = 0;
function placeCall(n: number, id: string, depth = 0, parent?: string): number {
  const call = { id, n, depth, parent, x: 0 };
  calls.push(call);
  if (n < 2) {
    call.x = nextLeaf++;
  } else {
    const left = placeCall(n - 1, `${id}l`, depth + 1, id);
    const right = placeCall(n - 2, `${id}r`, depth + 1, id);
    call.x = (left + right) / 2;
  }
  return call.x;
}
placeCall(5, "root");

const all = calls.map(({ id }) => id);
const firstLevel = ["root", "rootl", "rootr"];
const leftSpine = [...firstLevel, "rootll", "rootlr", "rootlll", "rootllr", "rootllll", "rootlllr"];
const repeated = ["rootll", "rootr"];

function tree(visible: string[], active: string[] = [], good: string[] = [], skipped: string[] = []): SceneMap {
  const scene: SceneMap = {};
  for (const { id, parent, depth } of calls) {
    if (!visible.includes(id)) continue;
    const marked = active.includes(id);
    const dim = skipped.includes(id);
    scene[id] = { o: dim ? 0.32 : 1, cls: dim ? "is-out" : marked ? "is-active" : good.includes(id) ? "is-good" : "" };
    if (parent) {
      scene[`edge-${id}`] = { p: 1, o: dim ? 0.27 : 1, from: { p: 0 }, delay: depth * 85, dur: 360 };
    }
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "recursion",
  slug: "call-tree",
  title: { vi: "Cây lời gọi đệ quy", en: "The recursion tree" },
  added: "2026-11-27",
  summary: {
    vi: "Vẽ cây lời gọi của fib(5) để thấy cùng một bài toán con bị tính lại ra sao.",
    en: "Draw the call tree for fib(5) to see where the same subproblem gets recomputed.",
  },
  level: "basic",
  minutes: 7,
  time: "O(φⁿ)",
  memory: "O(n)",
  goal: { vi: "Tính <b>fib(5)</b> và tìm các lời gọi bị lặp", en: "Compute <b>fib(5)</b> and find the repeated calls" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> fib(<span class="kw">int</span> n) {',
    '  <span class="kw">if</span> (n &lt; 2) <span class="kw">return</span> n;',
    '  <span class="kw">int</span> left = fib(n - 1);',
    '  <span class="kw">int</span> right = fib(n - 2);',
    '  <span class="kw">return</span> left + right;',
    '}',
  ],
  watch: [
    { key: "call", label: { vi: "lời gọi", en: "call" } },
    { key: "value", label: { vi: "trả về", en: "returns" } },
    { key: "calls", label: { vi: "số lời gọi", en: "call count" } },
  ],
  practice: [
    { src: "LeetCode 509", name: "Fibonacci Number", lv: "★☆☆", url: "https://leetcode.com/problems/fibonacci-number/" },
    { src: "CSES 1622", name: "Creating Strings", lv: "★★☆", url: "https://cses.fi/problemset/task/1622" },
  ],
  sceneOptions: { unit: 50, view: [-55, -130, 460, 410] },
  legend: [
    { cls: "acc", label: { vi: "lời gọi đang xét", en: "calls in focus" } },
    { cls: "ac", label: { vi: "đã có kết quả", en: "value known" } },
    { cls: "dim", label: { vi: "bỏ qua khi đã lưu", en: "skipped on a cache hit" } },
  ],
  entrance: ["root"],
  steps: [
    {
      title: { vi: "Tính số Fibonacci", en: "Find a Fibonacci number" }, kind: "problem",
      body: {
        vi: "Ta cần tính <code>fib(5)</code> từ <code>fib(0) = 0</code> và <code>fib(1) = 1</code>. Cứ tách mỗi lời gọi thành hai lời gọi nhỏ hơn thì nhiều kết quả sẽ bị tính lại.",
        en: "We want <code>fib(5)</code>, starting with <code>fib(0) = 0</code> and <code>fib(1) = 1</code>. Splitting each call into two smaller calls recomputes many results.",
      },
      lines: [1, 2], watch: { call: "fib(5)" }, verdict: "run", fit: all, scene: tree(["root"], ["root"]),
    },
    {
      title: { vi: "Tách thành hai nhánh", en: "Split into two calls" }, kind: "concept",
      body: {
        vi: "Mỗi khối <code>f(k)</code> là một lần gọi <code>fib(k)</code>. Gốc gọi <code>fib(4)</code> ở nhánh trái, rồi gọi <code>fib(3)</code> ở nhánh phải sau khi nhánh trái chạy xong.",
        en: "Each <code>f(k)</code> block stands for a call to <code>fib(k)</code>. The root calls <code>fib(4)</code> on the left, then calls <code>fib(3)</code> on the right once the left branch finishes.",
      },
      lines: [3, 4], watch: { call: "fib(5)" }, verdict: "run", fit: all,
      scene: tree(firstLevel, ["rootl", "rootr"]),
    },
    {
      title: { vi: "Chạm điều kiện dừng", en: "Reach the base cases" }, kind: "step",
      body: {
        vi: "Đi theo nhánh trái từ 5, ta lần lượt gặp 4, 3, 2 rồi 1. Khi <code>fib(2)</code> đã nhận được 1 từ con trái, nó lấy thêm 0 từ con phải và trả về <code>1 + 0 = 1</code>.",
        en: "Following the left branch from 5 takes us through 4, 3, 2, then 1. After <code>fib(2)</code> gets 1 from its left child, it gets 0 from its right child and returns <code>1 + 0 = 1</code>.",
      },
      lines: [2, 3, 4, 5], watch: { call: "fib(2)", value: 1 }, verdict: "run", fit: all,
      scene: tree(leftSpine, ["rootlll"], ["rootllll", "rootlllr"]),
    },
    {
      title: { vi: "Nhận ra nhánh lặp", en: "Spot the repeated branch" }, kind: "step",
      body: {
        vi: "Hai khối <code>f(3)</code> sáng lên đều gọi <code>fib(2)</code> và <code>fib(1)</code> bên dưới. Cây đầy đủ có 15 lời gọi, dù chỉ có 6 đối số khác nhau từ 0 đến 5.",
        en: "Both highlighted <code>f(3)</code> blocks call <code>fib(2)</code> and <code>fib(1)</code> underneath. The full tree has 15 calls, with just 6 distinct arguments from 0 to 5.",
      },
      lines: [3, 4], watch: { call: "fib(3)", calls: 15 }, verdict: "run", fit: all,
      scene: tree(all, repeated),
    },
    {
      title: { vi: "Cộng kết quả ở gốc", en: "Add the root's results" }, kind: "answer",
      body: {
        vi: "Kết quả đi ngược từ lá lên gốc. <code>fib(4)</code> trả về 3, <code>fib(3)</code> trả về 2, nên <code>fib(5) = 3 + 2 = 5</code>.",
        en: "Return values travel from the leaves back to the root. <code>fib(4)</code> returns 3 and <code>fib(3)</code> returns 2, so <code>fib(5) = 3 + 2 = 5</code>.",
      },
      lines: [5], watch: { call: "fib(5)", value: 5, calls: 15 }, verdict: "ac", fit: all,
      scene: tree(all, [], firstLevel),
    },
    {
      title: { vi: "Lưu kết quả đã tính", en: "Cache computed results" }, kind: "recap",
      body: {
        vi: "Mã trên tốn O(φⁿ) thời gian với φ ≈ 1,618 và O(n) bộ nhớ ngăn xếp. Nếu lưu kết quả theo <code>n</code>, lần gặp <code>fib(3)</code> bên phải lấy ngay 2, bỏ qua nhánh mờ. Mỗi đối số chỉ cần tính một lần, nên tổng thời gian còn O(n), bộ nhớ vẫn O(n).",
        en: "The code above takes O(φⁿ) time with φ ≈ 1.618 and O(n) stack space. Cache by <code>n</code>, and the right-hand <code>fib(3)</code> immediately gets 2, skipping the faded branch. Each argument is computed once, giving O(n) time and O(n) space.",
      },
      lines: [3, 4], watch: { call: "fib(3)", value: 2 }, verdict: "ac", fit: all,
      scene: tree(all, ["rootr"], ["rootll"], all.filter((id) => id.startsWith("rootr") && id !== "rootr")),
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  for (const { id, n, x, depth } of calls) {
    scene.add(id, { shape: shapes.block({ label: `f(${n})`, w: 47, h: 29, depth: 4, r: 7 }), x, y: depth * 2.65, o: 0 });
  }
  for (const { id, parent } of calls) {
    if (parent) scene.link(`edge-${id}`, { from: parent, to: id, bend: -0.7 });
  }
}
