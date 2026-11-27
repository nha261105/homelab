import type { Lesson, SceneMap } from "../../../lib/types";

const S = "cabab";
const T = S + S;
const N = S.length;
const rotation = (i: number) => T.slice(i, i + N);

function picture(i: number, j: number, k: number, removed: number[], formula = "", winner = -1): SceneMap {
  const comparing = j < N && j >= 0;
  const scene: SceneMap = {
    left: { text: winner >= 0 ? "min" : "i", o: comparing || winner >= 0 ? 1 : 0 },
    right: { o: comparing ? 1 : 0 },
    calc: { text: formula, o: formula ? 1 : 0, cls: winner >= 0 ? "v-eq" : "is-active" },
  };
  [...S].forEach((_, col) => {
    scene[`start${col}`] = {
      cls: col === winner ? "is-good" : removed.includes(col) ? "is-out" : comparing && (col === i || col === j) ? "is-active" : "",
    };
    for (const [row, start] of [["a", i], ["b", j]] as const) {
      const answer = row === "a" && winner >= 0;
      scene[`${row}${col}`] = {
        text: answer ? rotation(winner)[col] : comparing ? T[start + col] : "",
        o: comparing || answer ? 1 : 0,
        cls: answer || col < k ? "is-good" : col === k ? "is-active" : "",
      };
    }
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "strings-adv", slug: "min-rotation",
  title: { vi: "Xoay vòng nhỏ nhất", en: "Minimal rotation" },
  added: "2026-11-27", level: "hard", minutes: 9, time: "O(n)", memory: "O(n)",
  summary: {
    vi: "So hai vị trí bắt đầu và bỏ qua cả một đoạn khi tìm được ký tự đầu tiên khác nhau.",
    en: "Compare two starting positions and skip a whole block at the first differing character.",
  },
  goal: { vi: "Tìm phép xoay nhỏ nhất theo thứ tự từ điển của <b>cabab</b>", en: "Find the lexicographically smallest rotation of <b>cabab</b>" },
  codeLang: "C++17",
  code: [
    'int n = s.size(), i = 0, j = 1, k = 0;',
    'string t = s + s;',
    'while (i &lt; n &amp;&amp; j &lt; n &amp;&amp; k &lt; n) {',
    '  char a = t[i + k], b = t[j + k];',
    '  if (a == b) { ++k; continue; }',
    '  if (a &gt; b) i += k + 1;',
    '  else j += k + 1;',
    '  if (i == j) ++j;',
    '  k = 0;',
    '}',
    'return t.substr(min(i, j), n);',
  ],
  watch: [
    { key: "i", label: "i" }, { key: "j", label: "j" }, { key: "k", label: "k" },
    { key: "skip", label: { vi: "vị trí bị loại", en: "discarded starts" } },
  ],
  practice: [
    { src: "CSES 1110", name: "Minimal Rotation", lv: "★★★", url: "https://cses.fi/problemset/task/1110" },
    { src: "LeetCode 899", name: "Orderly Queue", lv: "★★★", url: "https://leetcode.com/problems/orderly-queue/" },
  ],
  sceneOptions: { unit: 49 },
  legend: [
    { cls: "acc", label: { vi: "ứng viên hoặc cặp đang so", en: "candidate or current comparison" } },
    { cls: "ac", label: { vi: "đã khớp hoặc đáp án", en: "matched prefix or answer" } },
    { cls: "dim", label: { vi: "vị trí đã loại", en: "discarded start" } },
  ],
  steps: [
    {
      title: { vi: "So các phép xoay", en: "Compare the rotations" }, kind: "problem",
      body: {
        vi: "<code>cabab</code> có 5 vị trí có thể bắt đầu phép xoay. Cần tìm xâu nhỏ nhất theo thứ tự từ điển. So từng phép xoay với đáp án tạm thời có thể tốn O(n²) ký tự.",
        en: "<code>cabab</code> has 5 possible rotation starts. Find the lexicographically smallest string. Comparing every rotation with the current best can take O(n²) character comparisons.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(0, -1, 0, []),
    },
    {
      title: { vi: "Nối xâu với chính nó", en: "Double the string" }, kind: "concept",
      body: {
        vi: "Trong <code>t = cababcabab</code>, mỗi phép xoay là một đoạn 5 chữ bắt đầu ở vị trí từ 0 đến 4. Hai hàng <code>i</code> và <code>j</code> hiện phép xoay bắt đầu ở 0 và 1, sẵn sàng so tại <code>k = 0</code>.",
        en: "In <code>t = cababcabab</code>, each rotation is a length-5 window starting at a position from 0 to 4. Rows <code>i</code> and <code>j</code> show the windows at 0 and 1, ready to compare at <code>k = 0</code>.",
      },
      lines: [1, 2, 3, 4], watch: { i: 0, j: 1, k: 0 }, verdict: "run", fit: "all",
      scene: picture(0, 1, 0, [], "t[0..4]  ·  t[1..5]"),
    },
    {
      title: { vi: "Loại đầu tiên", en: "Drop the first start" }, kind: "step",
      body: {
        vi: "<code>c &gt; a</code> ngay ở chữ đầu, nên loại vị trí 0. Sau <code>i += 0 + 1</code>, cả hai con trỏ cùng ở 1. Tăng <code>j</code> đến 2 để vẫn xét hai ứng viên khác nhau.",
        en: "<code>c &gt; a</code> at the first letter, so discard start 0. After <code>i += 0 + 1</code>, both pointers are at 1. Advance <code>j</code> to 2 to keep two distinct candidates.",
      },
      lines: [4, 6, 8, 9], watch: { i: 1, j: 2, k: 0, skip: "0" }, verdict: "run", fit: "all",
      scene: picture(1, 2, 0, [0], "c > a   ·   i = 0 + 1, j = 2"),
    },
    {
      title: { vi: "Tìm chỗ khác nhau", en: "Find the first difference" }, kind: "step",
      body: {
        vi: "Vị trí 2 bắt đầu bằng <code>b</code>, thua ngay vị trí 1 bắt đầu bằng <code>a</code>, nên đưa <code>j</code> đến 3. Hai phép xoay tại 1 và 3 cùng bắt đầu bằng <code>ab</code>. Tại độ lệch <code>k = 2</code>, hàng <code>i</code> có <code>a</code>, còn hàng <code>j</code> có <code>c</code>.",
        en: "Start 2 begins with <code>b</code> and loses immediately to start 1, which begins with <code>a</code>, so move <code>j</code> to 3. The rotations at 1 and 3 share the prefix <code>ab</code>. At offset <code>k = 2</code>, row <code>i</code> has <code>a</code> and row <code>j</code> has <code>c</code>.",
      },
      lines: [4, 5, 7], watch: { i: 1, j: 3, k: 2, skip: "2" }, verdict: "run", fit: "all",
      scene: picture(1, 3, 2, [0, 2], "k = 2   ·   t[3] = a < c = t[5]"),
    },
    {
      title: { vi: "Loại cả một đoạn", en: "Discard the whole block" }, kind: "step",
      body: {
        vi: "Vì <code>ababc &lt; abcab</code>, vị trí 3 bị loại. Bỏ chữ <code>a</code> đầu ở cả hai hàng thì phép xoay tại 2 vẫn thắng tại 4, vì chữ khác nhau tiếp theo vẫn là <code>a &lt; c</code>. Do đó mọi vị trí hợp lệ trong <code>[j, j + k] = [3, 5]</code> đều thua, và <code>j</code> nhảy đến 6.",
        en: "Since <code>ababc &lt; abcab</code>, start 3 is eliminated. Shift both windows once to drop the first <code>a</code>, and start 2 still beats start 4 at <code>a &lt; c</code>. Every valid start in <code>[j, j + k] = [3, 5]</code> loses, so <code>j</code> jumps to 6.",
      },
      lines: [4, 7, 9], watch: { i: 1, j: 6, k: 0, skip: "3, 4" }, verdict: "run", fit: "all",
      scene: picture(1, 3, 2, [0, 2, 3, 4], "j = 3 + (2 + 1) = 6"),
    },
    {
      title: { vi: "Lấy phép xoay còn lại", en: "Read the remaining rotation" }, kind: "answer",
      body: {
        vi: "<code>j = 6</code> đã ra ngoài 5 vị trí bắt đầu. Vị trí 1 còn lại cho <code>t.substr(1, 5) = ababc</code>.",
        en: "<code>j = 6</code> has passed all 5 possible starts. The remaining start, 1, yields <code>t.substr(1, 5) = ababc</code>.",
      },
      lines: [3, 11], watch: { i: 1, j: 6, k: 0 }, verdict: "ac", fit: "all",
      scene: picture(1, 6, 0, [0, 2, 3, 4], "t.substr(1, 5) = ababc", 1),
    },
    {
      title: { vi: "Mỗi lần so đều tiến", en: "Each comparison makes progress" }, kind: "recap",
      body: {
        vi: "Sau <code>k</code> chữ bằng nhau, dời cả hai điểm bắt đầu cùng một lượng từ 0 đến <code>k</code> vẫn giữ nguyên cặp chữ quyết định. Mỗi lần so làm tăng <code>i + j + k</code>, tổng này bị chặn bởi O(n), nên thuật toán chạy trong O(n) và dùng O(n) bộ nhớ cho <code>t</code>. Nếu <code>k = n</code>, hai ứng viên cho cùng một phép xoay và ta lấy vị trí nhỏ hơn.",
        en: "After matching <code>k</code> letters, shifting both starts by any amount from 0 to <code>k</code> keeps the same deciding pair. Each comparison increases <code>i + j + k</code>, which stays O(n), giving O(n) time and O(n) space for <code>t</code>. If <code>k = n</code>, the candidates give the same rotation and we use the smaller start.",
      },
      lines: [3, 5, 6, 7, 8, 9], watch: { i: 1, j: 6, k: 0 }, verdict: "ac", fit: "all",
      scene: picture(1, 6, 0, [0, 2, 3, 4], "min(1, 6) = 1", 1),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("starts", { shape: shapes.pill({ text: "pos" }), y: 0 });
  scene.add("input", { shape: shapes.pill({ text: "s" }), y: 1.44 });
  scene.add("left", { shape: shapes.pill({ text: "i" }), y: 3.28 });
  scene.add("right", { shape: shapes.pill({ text: "j" }), y: 4.72 });
  [...S].forEach((letter, col) => {
    const x = col + 1.06;
    scene.add(`start${col}`, { shape: shapes.block({ label: col, w: 38, h: 27, depth: 3 }), x, y: 0 });
    scene.add(`s${col}`, { shape: shapes.block({ label: letter, w: 38, h: 27, depth: 3 }), x, y: 1.44 });
    scene.add(`a${col}`, { shape: shapes.block({ w: 38, h: 27, depth: 3 }), x, y: 3.28 });
    scene.add(`b${col}`, { shape: shapes.block({ w: 38, h: 27, depth: 3 }), x, y: 4.72 });
  });
  scene.add("calc", { shape: shapes.pill(), x: 2.6, y: 6.37, o: 0 });
}
