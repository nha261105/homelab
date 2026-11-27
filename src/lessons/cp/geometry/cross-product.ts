import type { Lesson, SceneMap } from "../../../lib/types";

const points = {
  A: [1, 1], B: [5, 3], left: [2, 3], right: [4, 1], line: [3, 2],
} as const;
type Position = "left" | "right" | "line";

function picture(position: Position, formula = "", tone = "", vectors = true): SceneMap {
  const vectorClass = tone === "is-good" ? "v-eq" : tone === "is-bad" ? "v-gt" : "";
  return {
    [position]: { o: 1, cls: tone },
    ab: { ends: ["A", "B"], p: 1, o: 0.55 },
    [`ac-${position}`]: { p: vectors ? 1 : 0, cls: vectorClass, from: { p: 0 }, dur: 420 },
    calc: { text: formula, o: formula ? 1 : 0, cls: tone },
  };
}

export const lesson: Lesson = {
  track: "cp",
  topic: "geometry",
  slug: "cross-product",
  title: { vi: "Tích có hướng & hướng rẽ", en: "Cross product and orientation" },
  added: "2026-11-27",
  summary: {
    vi: "Dấu của tích có hướng cho biết điểm thứ ba ở bên trái, bên phải hay trên đường thẳng.",
    en: "The sign of a cross product locates a third point to the left, to the right, or on the line.",
  },
  level: "medium",
  minutes: 7,
  time: "O(1)",
  memory: "O(1)",
  goal: {
    vi: "Xét ba vị trí của <b>C</b> khi nhìn từ A(1,1) đến B(5,3)",
    en: "Test three positions of <b>C</b> while looking from A(1,1) to B(5,3)",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">struct</span> Point { <span class="kw">long long</span> x, y; };',
    '<span class="kw">long long</span> orient(Point a, Point b, Point c) {',
    '  <span class="kw">long long</span> ux = b.x-a.x, uy = b.y-a.y;',
    '  <span class="kw">long long</span> vx = c.x-a.x, vy = c.y-a.y;',
    '  <span class="kw">return</span> ux*vy - uy*vx;',
    '}',
    '<span class="kw">const char</span>* side(Point a, Point b, Point c) {',
    '  <span class="kw">auto</span> d = orient(a, b, c);',
    '  <span class="kw">return</span> d &gt; 0 ? "LEFT" : d &lt; 0 ? "RIGHT" : "TOUCH";',
    '}',
  ],
  watch: [
    { key: "u", label: "B − A" },
    { key: "v", label: "C − A" },
    { key: "d", label: "d" },
    { key: "side", label: { vi: "kết quả", en: "result" } },
  ],
  practice: [
    { src: "CSES 2189", name: "Point Location Test", lv: "★☆☆", url: "https://cses.fi/problemset/task/2189" },
    { src: "LeetCode 1232", name: "Check If It Is a Straight Line", lv: "★☆☆", url: "https://leetcode.com/problems/check-if-it-is-a-straight-line/" },
  ],
  sceneOptions: { unit: 69 },
  legend: [
    { cls: "ac", label: { vi: "tích có hướng dương", en: "positive cross product" } },
    { cls: "wa", label: { vi: "tích có hướng âm", en: "negative cross product" } },
    { cls: "acc", label: { vi: "tích có hướng bằng 0", en: "zero cross product" } },
  ],
  steps: [
    {
      title: { vi: "C nằm phía nào?", en: "Which side is C on?" }, kind: "problem",
      body: {
        vi: "Nhìn từ A(1,1) đến B(5,3), hãy xác định C(2,3) nằm phía nào. So sánh hệ số góc phải chia và cần xử lý riêng đường thẳng đứng. Tích có hướng chỉ dùng phép toán số nguyên.",
        en: "Looking from A(1,1) to B(5,3), which side is C(2,3) on? Comparing slopes requires division and a special case for vertical lines. A cross product uses only integer arithmetic.",
      },
      note: {
        vi: "Sơ đồ đặt y theo chiều sâu, tăng xuống dưới màn hình. Kết quả LEFT và RIGHT theo hệ tọa độ toán học có y hướng lên.",
        en: "The diagram uses depth for y, increasing down the screen. LEFT and RIGHT use the mathematical convention with y pointing up.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture("left", "", "", false),
    },
    {
      title: { vi: "Lấy chung gốc A", en: "Use a common origin" }, kind: "concept",
      body: {
        vi: "Lấy A làm gốc chung của hai vectơ. Ta có <code>u = B − A = (4,2)</code> và <code>v = C − A = (1,2)</code>.",
        en: "Use A as the common start of the vectors. This gives <code>u = B − A = (4,2)</code> and <code>v = C − A = (1,2)</code>.",
      },
      lines: [3, 4], watch: { u: "(4,2)", v: "(1,2)" }, verdict: "run", fit: "all",
      scene: picture("left", "u = (4,2)   v = (1,2)"),
    },
    {
      title: { vi: "Dấu dương: rẽ trái", en: "Positive means left" }, kind: "step",
      body: {
        vi: "Nhân chéo rồi trừ: <code>d = 4·2 − 2·1 = 6</code>. Dấu dương cho biết khi chuyển từ hướng AB sang AC, ta quay ngược chiều kim đồng hồ.",
        en: "Subtract the two crosswise products: <code>d = 4·2 − 2·1 = 6</code>. The positive sign means rotating from AB toward AC is counterclockwise.",
      },
      lines: [5, 8, 9], watch: { u: "(4,2)", v: "(1,2)", d: 6, side: "LEFT" }, verdict: "run", fit: "all",
      scene: picture("left", "4·2 − 2·1 = 6", "is-good"),
    },
    {
      title: { vi: "Dấu âm: rẽ phải", en: "Negative means right" }, kind: "step",
      body: {
        vi: "Dời C đến (4,1) thì <code>v = (3,0)</code>, còn <code>u</code> giữ nguyên. Kết quả <code>4·0 − 2·3 = −6</code> cho biết lần này C nằm bên phải AB.",
        en: "Move C to (4,1) to get <code>v = (3,0)</code>, with <code>u</code> unchanged. The result <code>4·0 − 2·3 = −6</code> now puts C to the right of AB.",
      },
      lines: [4, 5, 9], watch: { u: "(4,2)", v: "(3,0)", d: -6, side: "RIGHT" }, verdict: "run", fit: "all",
      scene: picture("right", "4·0 − 2·3 = −6", "is-bad"),
    },
    {
      title: { vi: "Bằng 0: thẳng hàng", en: "Zero means collinear" }, kind: "answer",
      body: {
        vi: "Dời C đến (3,2) thì <code>v = (2,1)</code>, bằng nửa <code>u</code>. Hai tích đều bằng 4, nên C nằm trên đường thẳng AB và hàm trả về <code>TOUCH</code>.",
        en: "Move C to (3,2) to get <code>v = (2,1)</code>, half of <code>u</code>. Both products equal 4, so C lies on the line through AB and the function returns <code>TOUCH</code>.",
      },
      lines: [4, 5, 9], watch: { u: "(4,2)", v: "(2,1)", d: 0, side: "TOUCH" }, verdict: "ac", fit: "all",
      scene: picture("line", "4·1 − 2·2 = 0", "is-active", false),
    },
    {
      title: { vi: "Chỉ cần xét dấu", en: "Read the sign" }, kind: "recap",
      body: {
        vi: "Tích có hướng bằng hai lần diện tích có dấu của tam giác ABC. Đổi chiều AB sẽ đổi dấu: với C(2,3), dấu dương của 6 trở thành dấu âm của −6. Mỗi lần kiểm tra tốn O(1) thời gian và bộ nhớ.",
        en: "The cross product is twice the signed area of triangle ABC. Reversing AB flips the sign: for C(2,3), the positive 6 becomes negative 6. Each test costs O(1) time and space.",
      },
      lines: [5, 9], watch: { u: "(-4,-2)", v: "(-3,0)", d: -6, side: "RIGHT" }, verdict: "ac", fit: "all",
      scene: {
        ...picture("left", "(−4)·0 − (−2)·(−3) = −6", "is-bad", false),
        ab: { ends: ["B", "A"], p: 1, o: 0.55 },
        baToC: { p: 1, cls: "v-gt", from: { p: 0 }, dur: 420 },
      },
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const [id, [x, y]] of Object.entries(points)) {
    const fixed = id === "A" || id === "B";
    scene.add(id, {
      shape: shapes.block({ label: fixed ? id : "C", sub: `(${x},${y})`, w: 35, h: 21, depth: 4, r: 6 }),
      x, y, o: fixed ? 1 : 0,
    });
  }
  scene.link("ab", { from: "A", to: "B", anchor: "center", arrow: true, bend: 0 });
  for (const id of ["left", "right", "line"]) {
    scene.link(`ac-${id}`, { from: "A", to: id, anchor: "center", arrow: true, bend: 0 });
  }
  scene.link("baToC", { from: "B", to: "left", anchor: "center", arrow: true, bend: 0 });
  scene.add("calc", { shape: shapes.pill(), x: 3, y: 5.1, o: 0 });
}
