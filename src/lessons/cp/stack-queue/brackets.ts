import type { Lesson, SceneMap } from "../../../lib/types";

const S = "([]{})";
const U = 52;
const STACK_X = 2.5;
const STACK_Y = 4.75;
const GAP = 0.88;
const FIT = ["s0", "s5", "stack"];
const openings = [0, 1, 3];

function picture(i: number, pending: number[], pair?: number): SceneMap {
  const scene: SceneMap = {};
  [...S].forEach((_, j) => {
    scene[`s${j}`] = j === pair || (j === i && pair !== undefined)
      ? { cls: "is-good", fx: { type: "pulse", delay: 260 } }
      : { cls: j === i ? "is-active" : j < i ? "is-out" : "" };
  });
  pending.forEach((j, depth) => {
    scene[`st${j}`] = {
      x: STACK_X, y: STACK_Y, z: depth * GAP, o: 1,
      cls: depth === pending.length - 1 ? "is-active" : "",
      ...(j === i ? { from: { x: j, y: 0, z: 0, o: 0.45 }, arc: 0.42, dur: 560 } : {}),
    };
  });
  if (pair !== undefined) {
    scene[`st${pair}`] = {
      x: STACK_X, y: STACK_Y, z: (pending.length + 0.45) * GAP, o: 0,
      from: { x: STACK_X, y: STACK_Y, z: pending.length * GAP, o: 1 },
      cls: "is-good", delay: 260, dur: 420, ease: "out",
    };
    scene.match = { ends: [`s${pair}`, `s${i}`], p: 1, from: { p: 0 }, cls: "v-eq", delay: 240, dur: 420 };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "stack-queue", slug: "brackets",
  title: { vi: "Kiểm tra ngoặc bằng stack", en: "Matching brackets with a stack" },
  added: "2026-11-27",
  summary: {
    vi: "Cất các ngoặc mở chưa ghép vào stack. Mỗi ngoặc đóng phải khớp với ngoặc trên đỉnh.",
    en: "Keep unmatched opening brackets on a stack. Each closing bracket must match the top.",
  },
  level: "basic", minutes: 7, time: "O(n)", memory: "O(n)",
  goal: { vi: "Kiểm tra <b>([]{})</b> có ghép ngoặc đúng không", en: "Check whether <b>([]{})</b> is balanced" },
  codeLang: "C++17",
  code: [
    '<span class="kw">bool</span> valid(<span class="kw">const</span> string&amp; s) {',
    '  stack&lt;<span class="kw">char</span>&gt; st;',
    '  <span class="kw">for</span> (<span class="kw">char</span> c : s) {',
    "    <span class=\"kw\">if</span> (c == '(' || c == '[' || c == '{') st.push(c);",
    '    <span class="kw">else</span> {',
    "      <span class=\"kw\">char</span> need = c == ')' ? '(' : c == ']' ? '[' : '{';",
    '      <span class="kw">if</span> (st.empty() || st.top() != need) <span class="kw">return false</span>;',
    '      st.pop();',
    '    }',
    '  }',
    '  <span class="kw">return</span> st.empty();',
    '}',
  ],
  watch: [{ key: "i", label: "i" }, { key: "c", label: "c" }, { key: "st", label: { vi: "st (đáy → đỉnh)", en: "st (bottom → top)" } }],
  practice: [
    { src: "LeetCode 20", name: "Valid Parentheses", lv: "★☆☆", url: "https://leetcode.com/problems/valid-parentheses/" },
    { src: "LeetCode 921", name: "Minimum Add to Make Parentheses Valid", lv: "★★☆", url: "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/" },
  ],
  sceneOptions: { unit: U },
  legend: [
    { cls: "acc", label: { vi: "đang đọc / đỉnh stack", en: "current / stack top" } },
    { cls: "ac", label: { vi: "cặp vừa khớp", en: "just matched" } },
    { cls: "dim", label: { vi: "đã đọc", en: "already read" } },
  ],
  entrance: [...S].map((_, i) => `s${i}`),
  steps: [
    {
      title: { vi: "Ngoặc có khớp không?", en: "Do the brackets match?" }, kind: "problem",
      body: {
        vi: "Kiểm tra chuỗi <code>([]{})</code>: các cặp ngoặc phải đúng loại và lồng nhau đúng thứ tự. Đếm số ngoặc mỗi loại không đủ vì <code>([)]</code> vẫn cân bằng về số lượng.",
        en: "Check <code>([]{})</code>: each pair must have the right type and nesting order. Counting brackets by type misses invalid strings such as <code>([)]</code>.",
      },
      lines: [], watch: {}, verdict: "run", fit: FIT, scene: picture(-1, []),
    },
    {
      title: { vi: "Đẩy ngoặc mở", en: "Push an opening bracket" }, kind: "concept",
      body: {
        vi: "Đọc <code>(</code> ở vị trí 0 và đẩy vào <code>st</code>. Stack chỉ giữ các ngoặc mở còn chờ ghép.",
        en: "Read <code>(</code> at index 0 and push it onto <code>st</code>. The stack holds any opening brackets still waiting for a match.",
      },
      lines: [2, 3, 4], watch: { i: 0, c: "(", st: "(" }, verdict: "run", fit: FIT, scene: picture(0, [0]),
    },
    {
      title: { vi: "Ngoặc mới lên đỉnh", en: "The newest goes on top" }, kind: "step",
      body: {
        vi: "Đẩy <code>[</code> ở vị trí 1 lên trên <code>(</code>. Cặp mở sau phải đóng trước, nên ngoặc đóng tiếp theo phải khớp với <code>[</code>.",
        en: "Push <code>[</code> at index 1 above <code>(</code>. The latest opening bracket must close first, so the next closing bracket must match <code>[</code>.",
      },
      lines: [3, 4], watch: { i: 1, c: "[", st: "( [" }, verdict: "run", fit: FIT, scene: picture(1, [0, 1]),
    },
    {
      title: { vi: "Khớp ngoặc vuông", en: "Match the square brackets" }, kind: "step",
      body: {
        vi: "<code>]</code> ở vị trí 2 cần <code>[</code>. Đỉnh đúng loại nên lấy <code>[</code> ra, còn <code>(</code> bên dưới.",
        en: "<code>]</code> at index 2 needs <code>[</code>. The top matches, so pop <code>[</code> and leave <code>(</code> underneath.",
      },
      lines: [6, 7, 8], watch: { i: 2, c: "]", st: "(" }, verdict: "run", fit: FIT, scene: picture(2, [0], 1),
    },
    {
      title: { vi: "Đẩy ngoặc nhọn", en: "Push the opening brace" }, kind: "step",
      body: {
        vi: "<code>{</code> ở vị trí 3 là ngoặc mở, lên đỉnh stack. Ngoặc <code>(</code> ở đáy vẫn chờ được đóng.",
        en: "<code>{</code> at index 3 is an opening brace, so push it on top. The <code>(</code> at the bottom is still waiting.",
      },
      lines: [3, 4], watch: { i: 3, c: "{", st: "( {" }, verdict: "run", fit: FIT, scene: picture(3, [0, 3]),
    },
    {
      title: { vi: "Khớp ngoặc nhọn", en: "Match the braces" }, kind: "step",
      body: {
        vi: "<code>}</code> ở vị trí 4 khớp với <code>{</code> trên đỉnh. Bỏ <code>{</code> ra để <code>(</code> trở lại đỉnh.",
        en: "<code>}</code> at index 4 matches <code>{</code> on top. Pop <code>{</code> to expose <code>(</code> again.",
      },
      lines: [6, 7, 8], watch: { i: 4, c: "}", st: "(" }, verdict: "run", fit: FIT, scene: picture(4, [0], 3),
    },
    {
      title: { vi: "Stack đã rỗng", en: "The stack is empty" }, kind: "answer",
      body: {
        vi: "<code>)</code> ở vị trí 5 đóng ngoặc <code>(</code> đầu tiên. Đã đọc hết 6 ký tự và stack rỗng, nên trả về <code>true</code>.",
        en: "<code>)</code> at index 5 closes the first <code>(</code>. All six characters are processed and the stack is empty, so return <code>true</code>.",
      },
      lines: [7, 8, 11], watch: { i: 5, c: ")", st: "∅" }, verdict: "ac", fit: FIT, scene: picture(5, [], 0),
    },
    {
      title: { vi: "Điều kiện hợp lệ", en: "When brackets are valid" }, kind: "recap",
      body: {
        vi: "Gặp ngoặc đóng thì kiểm tra đỉnh ngay: stack rỗng hoặc sai loại đều báo lỗi. Sau ký tự cuối, stack phải rỗng để mọi ngoặc mở đều đã ghép. Mỗi ngoặc mở vào và ra stack nhiều nhất một lần, nên tốn O(n) thời gian và O(n) bộ nhớ.",
        en: "A closing bracket fails if the stack is empty or its top has the wrong type. At the end, the stack must be empty so that every opening bracket has a match. Each opening bracket is pushed and popped at most once, using O(n) time and O(n) space.",
      },
      lines: [7, 11], watch: { st: "∅" }, verdict: "ac", fit: FIT,
      scene: Object.fromEntries([...S].map((_, i) => [`s${i}`, { cls: "is-good" }])),
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  scene.add("base", { shape: shapes.frame({ h: 103, top: -97 }), layer: "back", x: STACK_X, y: STACK_Y, w: 57 });
  scene.add("stack", { shape: shapes.pill({ text: "st" }), x: 1.5, y: STACK_Y });
  [...S].forEach((label, i) => scene.add(`s${i}`, { shape: shapes.block({ label, sub: i, w: 42, h: 38 }), x: i, shadow: true }));
  openings.forEach((i) => scene.add(`st${i}`, { shape: shapes.block({ label: S[i], w: 42, h: 32 }), x: i, o: 0 }));
  scene.link("match", { from: "s0", to: "s5", bend: 0.68 });
}
