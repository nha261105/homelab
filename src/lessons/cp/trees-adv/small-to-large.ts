import type { Lesson, SceneMap } from "../../../lib/types";

const POSITIONS = [[2.4, 0], [1, 2.1], [3.8, 2.1], [0.65, 4.25], [2.5, 4.25], [4.8, 4.25], [4.8, 6.4]];
const PARENT = [0, 1, 1, 2, 3, 3, 6];
const COLOR = [2, 2, 2, 1, 2, 4, 5];

function picture(
  focus: number[],
  sets: [string, string, string] = ["", "", ""],
  edge = 0,
  source?: "left" | "right",
): SceneMap {
  const [left, right, result] = sets;
  const scene: SceneMap = {
    left: { text: left, o: left ? 1 : 0 },
    right: { text: right, o: right ? 1 : 0 },
    result: {
      text: result, o: result ? 1 : 0, cls: "v-eq",
      ...(source ? { from: { o: 0, s: 0.84 }, delay: 430, dur: 340, ease: "back" } : {}),
    },
  };
  if (source) {
    Object.assign(scene[source], { cls: "is-active", fx: { type: "pulse", amp: 0.08, delay: 125, dur: 350 } });
  }
  POSITIONS.forEach((_, i) => {
    const u = i + 1;
    scene[`v${u}`] = { cls: focus[0] === u && edge ? "is-good" : focus.includes(u) ? "is-active" : "" };
    if (i > 0) {
      scene[`e${u}`] = u === edge
        ? { cls: "v-eq", p: 1, from: { p: 0 }, dur: 355 }
        : { cls: "", p: 1 };
    }
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "trees-adv", slug: "small-to-large",
  title: { vi: "Gộp nhỏ vào lớn", en: "Small-to-large merging" },
  added: "2026-11-27",
  summary: {
    vi: "Đếm màu trong từng cây con bằng cách chỉ duyệt tập nhỏ hơn ở mỗi lần gộp.",
    en: "Count colors in every subtree by iterating only the smaller set at each merge.",
  },
  level: "hard", minutes: 11, time: "O(n log² n)", memory: "O(n)",
  goal: {
    vi: "Đếm <b>số màu khác nhau</b> trong cây con của từng đỉnh",
    en: "Count <b>distinct colors</b> in each vertex's subtree",
  },
  codeLang: "C++17",
  code: [
    'set&lt;<span class="kw">int</span>&gt; dfs(<span class="kw">int</span> u, <span class="kw">int</span> p) {',
    '  set&lt;<span class="kw">int</span>&gt; s{color[u]};',
    '  <span class="kw">for</span> (<span class="kw">int</span> v : adj[u]) <span class="kw">if</span> (v != p) {',
    '    <span class="kw">auto</span> child = dfs(v, u);',
    '    <span class="kw">if</span> (s.size() &lt; child.size()) s.swap(child);',
    '    s.insert(child.begin(), child.end());',
    '  }',
    '  ans[u] = s.size();',
    '  <span class="kw">return</span> s;',
    '}',
    'dfs(1, 0);',
  ],
  watch: [
    { key: "u", label: "u" }, { key: "v", label: "v" },
    { key: "count", label: { vi: "số màu trong s", en: "colors in s" } },
  ],
  practice: [
    { src: "CSES 1139", name: "Distinct Colors", lv: "★★☆", url: "https://cses.fi/problemset/task/1139" },
    { src: "Codeforces 600E", name: "Lomsat gelral", lv: "★★★", url: "https://codeforces.com/problemset/problem/600/E" },
  ],
  sceneOptions: { unit: 44, view: [-53, -65, 334, 315] },
  legend: [
    { cls: "acc", label: { vi: "nhánh đang xét hoặc tập cần duyệt", en: "current branch or source set" } },
    { cls: "ac", label: { vi: "đỉnh nhận và tập sau khi gộp", en: "receiving vertex and merged set" } },
  ],
  steps: [
    {
      title: { vi: "Đếm màu trong nhánh", en: "Count colors in subtrees" }, kind: "problem",
      body: {
        vi: "Mỗi ô ghi <code>đỉnh:màu</code>. Chẳng hạn đỉnh 7 có màu 5. Quét lại toàn bộ cây con cho mỗi đỉnh có thể cần O(n²) lượt thăm trên cây dạng đường thẳng.",
        en: "Each block shows <code>vertex:color</code>. For example, vertex 7 has color 5. Scanning each subtree separately can visit O(n²) vertices in total on a path.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture([]),
    },
    {
      title: { vi: "Tạo tập một màu", en: "Start with one color" }, kind: "concept",
      body: {
        vi: "Mỗi lời gọi bắt đầu với <code>s = {color[u]}</code>. Lá không có cây con nào để gộp, nên 4, 5 và 7 trả về lần lượt <code>{1}</code>, <code>{2}</code> và <code>{5}</code>.",
        en: "Each call starts with <code>s = {color[u]}</code>. Leaves have no child sets to merge, so 4, 5, and 7 return <code>{1}</code>, <code>{2}</code>, and <code>{5}</code> respectively.",
      },
      lines: [1, 2, 8, 9], watch: { u: "4, 5, 7", count: 1 }, verdict: "run", fit: "all",
      scene: picture([4, 5, 7], ["", "", "s(7) = {5}"]),
    },
    {
      title: { vi: "Gộp hai tập đơn", en: "Merge two singleton sets" }, kind: "step",
      body: {
        vi: "Đỉnh 2 gộp <code>{2}</code> với tập <code>{1}</code> của 4, được <code>{1,2}</code>. Tương tự ở đỉnh 6, hai tập cùng cỡ 1 nên cứ giữ <code>s = {4}</code> rồi chèn màu 5 từ đỉnh 7.",
        en: "Vertex 2 merges <code>{2}</code> with 4's <code>{1}</code> to get <code>{1,2}</code>. At vertex 6 the sets are also both size 1, so keep <code>s = {4}</code> and insert vertex 7's color 5.",
      },
      lines: [3, 4, 5, 6, 8], watch: { u: 6, v: 7, count: 2 }, verdict: "run", fit: "all",
      scene: picture([6, 7], ["s = {4}", "child = {5}", "s = {4,5}"], 7, "right"),
    },
    {
      title: { vi: "Gộp cả màu trùng", en: "Merge a duplicate color" }, kind: "step",
      body: {
        vi: "Đỉnh 3 bắt đầu với <code>{2}</code>. Con 5 cũng trả về <code>{2}</code>, nên sau khi chèn màu 2, kích thước tập vẫn bằng 1. Mỗi màu chỉ xuất hiện một lần trong <code>set</code>.",
        en: "Vertex 3 starts with <code>{2}</code>. Child 5 also returns <code>{2}</code>, so inserting color 2 leaves the size at 1. A <code>set</code> holds each color only once.",
      },
      lines: [2, 4, 5, 6], watch: { u: 3, v: 5, count: 1 }, verdict: "run", fit: "all",
      scene: picture([3, 5], ["s = {2}", "child = {2}", "s = {2}"], 5, "right"),
    },
    {
      title: { vi: "Đổi tập để giữ lớn", en: "Swap to keep larger" }, kind: "step",
      body: {
        vi: "Con 6 trả về <code>{4,5}</code> có 2 màu, còn <code>s = {2}</code> chỉ có 1. Gọi <code>s.swap(child)</code> để giữ tập lớn trong <code>s</code>, rồi chỉ chèn màu 2. Đỉnh 3 trả về <code>{2,4,5}</code>.",
        en: "Child 6 returns <code>{4,5}</code> with 2 colors, while <code>s = {2}</code> has just 1. Call <code>s.swap(child)</code> to keep the larger set in <code>s</code>, then insert only color 2. Vertex 3 returns <code>{2,4,5}</code>.",
      },
      lines: [4, 5, 6, 8, 9], watch: { u: 3, v: 6, count: 3 }, verdict: "run", fit: "all",
      scene: picture([3, 6], ["s = {2}", "child = {4,5}", "s = {2,4,5}"], 6, "left"),
    },
    {
      title: { vi: "Gộp nhánh 2 vào gốc", en: "Merge branch 2 at root" }, kind: "step",
      body: {
        vi: "Tại gốc 1, gộp <code>{2}</code> với <code>{1,2}</code> do con 2 trả về. Sau khi đổi hai tập, chỉ cần thử chèn màu 2 đã có sẵn. Tập tạm thời của gốc là <code>{1,2}</code>.",
        en: "At root 1, merge <code>{2}</code> with child 2's <code>{1,2}</code>. After swapping sets, the only attempted insertion is color 2, which is already present. The root's current set is <code>{1,2}</code>.",
      },
      lines: [4, 5, 6], watch: { u: 1, v: 2, count: 2 }, verdict: "run", fit: "all",
      scene: picture([1, 2], ["s = {2}", "child = {1,2}", "s = {1,2}"], 2, "left"),
    },
    {
      title: { vi: "Chốt bốn màu ở gốc", en: "Count four root colors" }, kind: "answer",
      body: {
        vi: "Con 3 có tập <code>{2,4,5}</code> lớn hơn tập <code>{1,2}</code> của gốc. Đổi hai tập rồi chèn 1 và 2, trong đó chỉ màu 1 làm tập lớn thêm. Lưu kích thước 4 vào <code>ans[1]</code>.",
        en: "Child 3's <code>{2,4,5}</code> is larger than the root's <code>{1,2}</code>. Swap the sets, then insert 1 and 2, of which only color 1 grows the set. Save the size 4 in <code>ans[1]</code>.",
      },
      lines: [4, 5, 6, 8], watch: { u: 1, v: 3, count: 4 }, verdict: "ac", fit: "all",
      scene: picture([1, 3], ["s = {1,2}", "child = {2,4,5}", "s = {1,2,4,5}"], 3, "left"),
    },
    {
      title: { vi: "Tính chi phí gộp", en: "Bound the merge cost" }, kind: "recap",
      body: {
        vi: "Lưu <code>ans[u]</code> trước khi trả tập cho cha. Số lần chèn thử không vượt quá số đỉnh thuộc nhóm nhỏ hơn, vì mỗi tập màu có nhiều nhất một phần tử cho mỗi đỉnh trong nhóm của nó. Tính chi phí cho các đỉnh ở nhóm nhỏ hơn, mỗi đỉnh chỉ chịu chi phí O(log n) lần vì nhóm của nó ít nhất tăng gấp đôi sau lần gộp ấy, nên với <code>set</code> ta dùng O(n log² n) thời gian và O(n) bộ nhớ.",
        en: "Save <code>ans[u]</code> before returning the set to the parent. The number of insertion attempts is at most the number of vertices in the smaller group, since each color set has at most one entry per vertex of its group. Charge the smaller group's vertices, each at most O(log n) times since its group at least doubles in those merges, giving O(n log² n) time with <code>set</code> and O(n) space.",
      },
      lines: [5, 6, 8, 9], watch: {}, verdict: "ac", fit: "all",
      scene: picture([], ["", "", "ans = [4,2,3,1,1,2,1]"]),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  POSITIONS.forEach(([x, y], i) => {
    scene.add(`v${i + 1}`, {
      shape: shapes.block({ label: `${i + 1}:${COLOR[i]}`, w: 48, h: 28, depth: 4 }), x, y,
    });
  });
  PARENT.slice(1).forEach((p, i) => {
    const u = i + 2;
    scene.link(`e${u}`, { from: `v${p}`, to: `v${u}`, anchor: "center", bend: 0, p: 1 });
  });
  scene.add("left", { shape: shapes.pill({ h: 23, pad: 6 }), x: 0.6, y: 7.85, o: 0 });
  scene.add("right", { shape: shapes.pill({ h: 23, pad: 6 }), x: 4.15, y: 7.85, o: 0 });
  scene.add("result", { shape: shapes.pill({ h: 23, pad: 6 }), x: 2.43, y: 9.18, o: 0 });
}
