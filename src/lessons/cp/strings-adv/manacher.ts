import type { Lesson, SceneMap } from "../../../lib/types";

const S = "aaa";
const T = `#${[...S].join("#")}#`;
const U = 47;
const P = Array<number>(T.length).fill(0);
const boxes: { c: number; r: number }[] = [];
let c = 0;
let r = 0;
for (let i = 0; i < T.length; i++) {
  P[i] = i < r ? Math.min(r - i, P[2 * c - i]) : 0;
  while (i - P[i] - 1 >= 0 && i + P[i] + 1 < T.length &&
    T[i - P[i] - 1] === T[i + P[i] + 1]) P[i]++;
  if (i + P[i] > r) [c, r] = [i, i + P[i]];
  boxes.push({ c, r });
}

function picture(last: number, boxAt = last, mirror = -1, formula = "", answer = false): SceneMap {
  const box = boxes[boxAt];
  const scene: SceneMap = {
    original: { o: last < 0 || answer ? 1 : 0 },
    input: { o: last < 0 || answer ? 1 : 0, cls: answer ? "is-good" : "" },
    radii: { o: last >= 0 ? 1 : 0 },
    calc: { text: formula, o: formula ? 1 : 0, cls: answer ? "v-eq" : "is-active" },
  };
  if (box) {
    scene.box = { x: 1 + box.c, w: 2 * (box.r - box.c) * U + 42, o: 1, cls: answer ? "is-good" : "" };
  }
  if (mirror >= 0) {
    scene.mirror = { ends: [`t${mirror}`, `t${last}`], p: 1, from: { p: 0 }, delay: 200, dur: 450, cls: "v-eq" };
  }
  [...T].forEach((_, i) => {
    const focus = i === last || i === mirror;
    scene[`t${i}`] = { o: last >= -1 ? 1 : 0, cls: focus ? "is-active" : "" };
    scene[`p${i}`] = {
      text: i <= last ? String(P[i]) : "·", o: last >= 0 ? 1 : 0,
      cls: answer && i === 3 ? "is-good" : focus ? "is-active" : i > last ? "is-out" : "",
      ...(i === last && !answer ? { fx: { type: "pulse", delay: 480 } } : {}),
    };
  });
  scene.transformed = { o: last >= -1 ? 1 : 0 };
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "strings-adv", slug: "manacher",
  title: { vi: "Manacher: xâu đối xứng", en: "Manacher's palindromes" },
  added: "2026-11-27", level: "hard", minutes: 10, time: "O(n)", memory: "O(n)",
  summary: {
    vi: "Chèn ký tự đệm rồi dùng bán kính của tâm đối chiếu để bỏ qua các cặp đã biết.",
    en: "Insert separators, then use the mirrored center's radius to skip comparisons we already know.",
  },
  goal: { vi: "Tìm xâu con đối xứng dài nhất của <b>aaa</b>", en: "Find the longest palindromic substring of <b>aaa</b>" },
  codeLang: "C++17",
  code: [
    'string t = "#";',
    'for (char a : s) { t += a; t += "#"; }',
    'int m = t.size(), c = 0, r = 0, best = 0;',
    'vector&lt;int&gt; p(m);',
    'for (int i = 0; i &lt; m; ++i) {',
    '  if (i &lt; r) p[i] = min(r - i, p[2*c - i]);',
    '  int&amp; k = p[i];',
    '  while (i-k-1 &gt;= 0 &amp;&amp; i+k+1 &lt; m',
    '         &amp;&amp; t[i-k-1] == t[i+k+1]) ++k;',
    '  if (i+k &gt; r) { c = i; r = i+k; }',
    '  if (k &gt; p[best]) best = i;',
    '}',
    'return s.substr((best - p[best]) / 2, p[best]);',
  ],
  watch: [
    { key: "i", label: "i" }, { key: "mirror", label: "2c − i" },
    { key: "box", label: "[2c − r, r]" }, { key: "radius", label: "p[i]" },
  ],
  practice: [
    { src: "LeetCode 5", name: "Longest Palindromic Substring", lv: "★★☆", url: "https://leetcode.com/problems/longest-palindromic-substring/" },
    { src: "CSES 1111", name: "Longest Palindrome", lv: "★★★", url: "https://cses.fi/problemset/task/1111" },
  ],
  sceneOptions: { unit: U },
  legend: [
    { cls: "acc", label: { vi: "tâm đang xét hoặc tâm đối chiếu", en: "current or mirrored center" } },
    { cls: "ac", label: { vi: "đáp án", en: "answer" } },
  ],
  steps: [
    {
      title: { vi: "Tìm xâu đối xứng", en: "Find the longest palindrome" }, kind: "problem",
      body: {
        vi: "Trong <code>aaa</code>, hãy tìm xâu con đọc xuôi ngược như nhau và dài nhất. Thử bung từ từng tâm có thể tốn O(n²) lần so sánh, ví dụ khi mọi chữ đều là <code>a</code>.",
        en: "Find the longest substring of <code>aaa</code> that reads the same in both directions. Expanding from every center can take O(n²) comparisons, for example when every letter is <code>a</code>.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(-2),
    },
    {
      title: { vi: "Chèn ký tự đệm", en: "Insert separators" }, kind: "concept",
      body: {
        vi: "Chèn <code>#</code> vào hai đầu và giữa các chữ. Tâm trên chữ cho xâu đối xứng lẻ, tâm trên <code>#</code> cho xâu đối xứng chẵn. Trong xâu mới, bán kính <code>p[i]</code> tính bằng số ô bung sang mỗi bên, và cũng bằng độ dài xâu đối xứng tương ứng trong xâu gốc.",
        en: "Insert <code>#</code> at both ends and between letters. A letter is the center of an odd palindrome, and a <code>#</code> is the center of an even one. The radius <code>p[i]</code> counts how many cells we can expand on each side in the new string, and equals the corresponding palindrome's length in the original.",
      },
      lines: [1, 2, 3, 4], watch: {}, verdict: "run", fit: "all", scene: picture(-1, -1, -1, "aaa → #a#a#a#"),
    },
    {
      title: { vi: "Bung từ tâm đầu", en: "Expand from early centers" }, kind: "step",
      body: {
        vi: "Tâm 0 chạm mép ngay. Tâm 1 ghép được hai dấu <code>#</code>, rồi tâm 2 ghép được hai chữ <code>a</code> và thêm hai dấu <code>#</code>. Hộp có biên phải xa nhất lúc này là <code>[0, 4]</code>, tâm <code>c = 2</code>.",
        en: "Center 0 is already at the edge. Center 1 pairs two <code>#</code> symbols, then center 2 pairs two <code>a</code> letters and two <code>#</code> symbols. The palindrome reaching farthest right is now <code>[0, 4]</code>, centered at <code>c = 2</code>.",
      },
      lines: [5, 7, 8, 9, 10], watch: { i: 2, box: "[0, 4]", radius: 2 }, verdict: "run", fit: "all",
      scene: picture(2, 2, -1, "p[0..2] = 0, 1, 2   ·   r = 2 + 2 = 4"),
    },
    {
      title: { vi: "Mượn bán kính đối chiếu", en: "Reuse the mirrored radius" }, kind: "step",
      body: {
        vi: "Với <code>i = 3</code>, tâm đối chiếu qua <code>c = 2</code> là 1 và có bán kính 1. Chỉ mượn phần nằm trong hộp <code>[0, 4]</code>, tức <code>min(p[1], 4 − 3) = 1</code>. Từ mức này, hai cặp mới ở khoảng cách 2 và 3 đều khớp, đưa <code>p[3]</code> lên 3.",
        en: "For <code>i = 3</code>, its mirror across <code>c = 2</code> is 1 with radius 1. Reuse only the part inside <code>[0, 4]</code>, giving <code>min(p[1], 4 − 3) = 1</code>. The next pairs at distances 2 and 3 both match, bringing <code>p[3]</code> to 3.",
      },
      lines: [6, 7, 8, 9], watch: { i: 3, mirror: 1, box: "[0, 4]", radius: 3 }, verdict: "run", fit: "all",
      scene: picture(3, 2, 1, "min(1, 4 − 3) + 2 = 3"),
    },
    {
      title: { vi: "Giữ hộp xa nhất", en: "Keep the farthest box" }, kind: "step",
      body: {
        vi: "Tâm 3 đẩy biên phải đến <code>3 + 3 = 6</code>. Trong hộp mới, tâm 4 mượn <code>p[2] = 2</code>, tâm 5 mượn <code>p[1] = 1</code>, và cả hai chạm mép phải. Tâm 6 nằm ngay mép nên bán kính là 0.",
        en: "Center 3 pushes the right edge to <code>3 + 3 = 6</code>. In the new box, center 4 reuses <code>p[2] = 2</code> and center 5 reuses <code>p[1] = 1</code>, both reaching the right edge. Center 6 is at the edge and has radius 0.",
      },
      lines: [5, 6, 8, 10], watch: { i: 4, mirror: 2, box: "[0, 6]", radius: 2 }, verdict: "run", fit: "all",
      scene: {
        ...picture(6, 3, -1, "min(2, 6 − 4) = 2   ·   min(1, 6 − 5) = 1"),
        p6: { text: "0", o: 1 }, t6: { o: 1 }, t2: { cls: "is-active" }, t4: { cls: "is-active" }, p4: { text: "2", cls: "is-active" }, p5: { text: "1", cls: "is-active" },
        mirror: { ends: ["t2", "t4"], p: 1, from: { p: 0 }, delay: 200, dur: 450, cls: "v-eq" },
      },
    },
    {
      title: { vi: "Đổi về chỉ số gốc", en: "Recover the original indices" }, kind: "answer",
      body: {
        vi: "Bán kính lớn nhất là <code>p[3] = 3</code>. Biên trái trong xâu đã chèn là 0, nên lấy <code>3</code> chữ từ vị trí <code>(3 − 3) / 2 = 0</code> của xâu gốc. Đáp án là <code>aaa</code>.",
        en: "The largest radius is <code>p[3] = 3</code>. Its left edge in the padded string is 0, so take <code>3</code> letters from position <code>(3 − 3) / 2 = 0</code> in the original. The answer is <code>aaa</code>.",
      },
      lines: [11, 13], watch: { i: 3, box: "[0, 6]", radius: 3 }, verdict: "ac", fit: "all",
      scene: picture(6, 3, -1, "s.substr((3 − 3) / 2, 3) = aaa", true),
    },
    {
      title: { vi: "Biên phải chỉ tiến", en: "The right edge advances" }, kind: "recap",
      body: {
        vi: "Nếu bán kính mượn chưa chạm biên hộp thì cặp kế tiếp đã biết là lệch nhờ đối xứng. Các lần bung thành công còn lại đều vượt biên phải cũ. Biên chỉ tiến, nên tổng thời gian và bộ nhớ đều là O(n).",
        en: "If the reused radius stops inside the box, symmetry already tells us the next pair differs. Every other successful expansion passes the old right edge. That edge only advances, so time and space are both O(n).",
      },
      lines: [5, 6, 8, 9, 10], watch: { i: 3, box: "[0, 6]", radius: 3 }, verdict: "ac", fit: "all",
      scene: picture(6, 3, -1, "p[3] = 3  →  aaa", true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("original", { shape: shapes.pill({ text: "s" }), y: 0 });
  scene.add("input", { shape: shapes.block({ label: S, w: 64, h: 28, depth: 4 }), x: 4, y: 0 });
  scene.add("transformed", { shape: shapes.pill({ text: "t" }), y: 2.3 });
  scene.add("radii", { shape: shapes.pill({ text: "p" }), y: 4.6 });
  scene.add("box", { shape: shapes.frame({ h: 56, top: -34, r: 8 }), y: 2.3, layer: "back", o: 0 });
  [...T].forEach((value, i) => {
    scene.add(`t${i}`, { shape: shapes.block({ label: value, sub: i, w: 35, h: 27, depth: 4 }), x: i + 1, y: 2.3 });
    scene.add(`p${i}`, { shape: shapes.block({ label: "·", w: 35, h: 27, depth: 4 }), x: i + 1, y: 4.6 });
  });
  scene.link("mirror", { from: "t1", to: "t3", bend: 0.55 });
  scene.add("calc", { shape: shapes.pill(), x: 3.7, y: 6.15, o: 0 });
}
