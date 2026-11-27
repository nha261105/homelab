import type { Lesson, SceneMap } from "../../../lib/types";

const values = [1, 2, 3];
interface Choice {
  id: string;
  parent?: string;
  depth: number;
  label: string;
  width: number;
  x: number;
}
const choices: Choice[] = [];
let leafEdge = 0;
function placeChoice(subset: number[], id: string, depth = 0, parent?: string): number {
  const label = subset.length ? `{${subset.join(",")}}` : "∅";
  const width = Math.max(28, label.length * 12 + 6);
  const choice = { id, parent, depth, label, width, x: 0 };
  choices.push(choice);
  if (depth === values.length) {
    choice.x = leafEdge + width / 2;
    leafEdge += width + 6;
  } else {
    const skip = placeChoice(subset, `${id}0`, depth + 1, id);
    const take = placeChoice([...subset, values[depth]], `${id}1`, depth + 1, id);
    choice.x = (skip + take) / 2;
  }
  return choice.x;
}
placeChoice([], "s");

const all = choices.map(({ id }) => id);
function tree(visible: (choice: Choice) => boolean, active: string[] = [], leavesDone = false): SceneMap {
  const scene: SceneMap = {};
  for (const choice of choices.filter(visible)) {
    const { id, parent, depth } = choice;
    const cls = active.includes(id) ? "is-active" : leavesDone && depth === values.length ? "is-good" : "";
    scene[id] = { o: 1, cls };
    if (parent) scene[`edge-${id}`] = { p: 1, from: { p: 0 }, delay: depth * 100, dur: 350 };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "recursion",
  slug: "subsets",
  title: { vi: "Sinh tập con", en: "Generating subsets" },
  added: "2026-11-27",
  summary: {
    vi: "Với mỗi phần tử, rẽ hai nhánh: bỏ qua hoặc chọn. Mỗi lá cho một tập con.",
    en: "For each element, branch on skipping or taking it. Every leaf gives one subset.",
  },
  level: "basic",
  minutes: 8,
  time: "O(n · 2ⁿ)",
  memory: "O(n) + output",
  goal: { vi: "Liệt kê mọi tập con của <b>{1, 2, 3}</b>", en: "List every subset of <b>{1, 2, 3}</b>" },
  codeLang: "C++17",
  code: [
    'vector&lt;<span class="kw">int</span>&gt; cur;',
    'vector&lt;vector&lt;<span class="kw">int</span>&gt;&gt; ans;',
    '<span class="kw">auto</span> dfs = [&amp;](<span class="kw">auto</span>&amp;&amp; self, <span class="kw">int</span> i) -&gt; <span class="kw">void</span> {',
    '  <span class="kw">if</span> (i == a.size()) {',
    '    ans.push_back(cur);',
    '    <span class="kw">return</span>;',
    '  }',
    '  self(self, i + 1);',
    '  cur.push_back(a[i]);',
    '  self(self, i + 1);',
    '  cur.pop_back();',
    '};',
    'dfs(dfs, 0);',
  ],
  watch: [
    { key: "i", label: "i" },
    { key: "cur", label: "cur" },
    { key: "count", label: "ans.size()" },
  ],
  practice: [
    { src: "LeetCode 78", name: "Subsets", lv: "★★☆", url: "https://leetcode.com/problems/subsets/" },
    { src: "CSES 1623", name: "Apple Division", lv: "★★☆", url: "https://cses.fi/problemset/task/1623" },
  ],
  entrance: ["s"],
  sceneOptions: { unit: 52, view: [-30, -130, 530, 345] },
  legend: [
    { cls: "acc", label: { vi: "đang xét", en: "in focus" } },
    { cls: "ac", label: { vi: "tập con đã ghi", en: "subset recorded" } },
  ],
  steps: [
    {
      title: { vi: "Liệt kê tập con", en: "List the subsets" }, kind: "problem",
      body: {
        vi: "Với <code>a = [1, 2, 3]</code>, hãy liệt kê mọi tập con, kể cả tập rỗng. Số kết quả tăng gấp đôi với mỗi phần tử mới, nên ta cần một cách liệt kê có thứ tự để tránh sót hay lặp.",
        en: "Given <code>a = [1, 2, 3]</code>, list every subset, including the empty set. The output doubles with each new element, so a fixed order helps us avoid omissions and duplicates.",
      },
      lines: [1, 2, 13], watch: { i: 0, cur: "∅", count: 0 }, verdict: "run", fit: all,
      scene: tree(({ depth }) => depth === 0, ["s"]),
    },
    {
      title: { vi: "Bỏ hoặc chọn 1", en: "Skip or take 1" }, kind: "concept",
      body: {
        vi: "Mỗi khối ghi những gì đã chọn trong <code>cur</code>. Với <code>a[0] = 1</code>, nhánh trái giữ <code>∅</code>, còn nhánh phải thêm 1 thành <code>{1}</code>.",
        en: "Each block shows the elements already chosen in <code>cur</code>. For <code>a[0] = 1</code>, the left branch keeps <code>∅</code> and the right branch adds 1 to make <code>{1}</code>.",
      },
      lines: [8, 9, 10], watch: { i: 0, cur: "∅" }, verdict: "run", fit: all,
      scene: tree(({ depth }) => depth <= 1, ["s0", "s1"]),
    },
    {
      title: { vi: "Xét tiếp số 2", en: "Decide about 2" }, kind: "step",
      body: {
        vi: "Cả hai nhánh đều xét tiếp <code>a[1] = 2</code>. Từ <code>∅</code> ta có <code>∅</code> và <code>{2}</code>, còn từ <code>{1}</code> ta có <code>{1}</code> và <code>{1,2}</code>.",
        en: "Both branches next consider <code>a[1] = 2</code>. From <code>∅</code> we get <code>∅</code> and <code>{2}</code>, and from <code>{1}</code> we get <code>{1}</code> and <code>{1,2}</code>.",
      },
      lines: [8, 9, 10], watch: { i: 1 }, verdict: "run", fit: all,
      scene: tree(({ depth }) => depth <= 2, ["s00", "s01", "s10", "s11"]),
    },
    {
      title: { vi: "Ghi hai lá đầu", en: "Record the first leaves" }, kind: "step",
      body: {
        vi: "Sau khi bỏ qua 1 và 2, thử bỏ rồi chọn <code>a[2] = 3</code>. Cả hai đường đều đến <code>i = 3</code>, nên ta sao chép <code>∅</code> và <code>{3}</code> vào <code>ans</code>.",
        en: "After skipping 1 and 2, try skipping and then taking <code>a[2] = 3</code>. Both paths reach <code>i = 3</code>, so copy <code>∅</code> and <code>{3}</code> into <code>ans</code>.",
      },
      lines: [4, 5, 6], watch: { i: 3, cur: "{3}", count: 2 }, verdict: "run", fit: all,
      scene: tree(({ depth, id }) => depth <= 2 || id.startsWith("s00"), [], true),
    },
    {
      title: { vi: "Lùi lại để đổi nhánh", en: "Undo before switching branches" }, kind: "step",
      body: {
        vi: "Sau khi ghi <code>{3}</code>, <code>cur.pop_back()</code> bỏ 3 để trở lại <code>∅</code>. Quay lên quyết định về 2, thêm 2 rồi xét 3 lần nữa để ghi <code>{2}</code> và <code>{2,3}</code>.",
        en: "After recording <code>{3}</code>, <code>cur.pop_back()</code> removes 3 to restore <code>∅</code>. Return to the decision about 2, take it, then consider 3 again to record <code>{2}</code> and <code>{2,3}</code>.",
      },
      lines: [9, 10, 11], watch: { i: 3, cur: "{2,3}", count: 4 }, verdict: "run", fit: all,
      scene: tree(({ depth, id }) => depth <= 2 || id.startsWith("s0"), ["s01"], true),
    },
    {
      title: { vi: "Đủ tám tập con", en: "All eight subsets" }, kind: "answer",
      body: {
        vi: "Nhánh chọn 1 cho thêm <code>{1}, {1,3}, {1,2}, {1,2,3}</code>. Cùng bốn tập bên trái, ta có đủ <code>2³ = 8</code> tập con.",
        en: "Taking 1 adds <code>{1}, {1,3}, {1,2}, {1,2,3}</code>. Together with the four sets on the left, that gives all <code>2³ = 8</code> subsets.",
      },
      lines: [4, 5, 10], watch: { i: 3, cur: "{1,2,3}", count: 8 }, verdict: "ac", fit: all,
      scene: tree(() => true, [], true),
    },
    {
      title: { vi: "Mỗi tập một đường", en: "One path per subset" }, kind: "recap",
      body: {
        vi: "Mỗi tập con xác định đúng một chuỗi chọn hoặc bỏ, nên xuất hiện ở đúng một lá. Cây có O(2ⁿ) nút, nhưng sao chép các tập vào <code>ans</code> tốn O(n · 2ⁿ) thời gian và bộ nhớ đầu ra. Ngoài đầu ra, ngăn xếp và <code>cur</code> dùng O(n) bộ nhớ.",
        en: "Each subset fixes one sequence of take-or-skip choices, so it appears at exactly one leaf. The tree has O(2ⁿ) nodes, but copying subsets into <code>ans</code> takes O(n · 2ⁿ) time and output space. The stack and <code>cur</code> use O(n) extra space.",
      },
      lines: [5, 8, 10, 11], watch: { cur: "∅", count: 8 }, verdict: "ac", fit: all,
      scene: tree(() => true, [], true),
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  for (const { id, x, depth, label, width } of choices) {
    scene.add(id, { shape: shapes.block({ label, w: width, h: 30, depth: 4, r: 7 }), x: x / 52, y: depth * 2.85, o: 0 });
  }
  for (const { id, parent } of choices) {
    if (parent) scene.link(`edge-${id}`, { from: parent, to: id, bend: -0.7 });
  }
}
