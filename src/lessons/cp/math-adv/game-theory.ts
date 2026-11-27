import type { Lesson, SceneMap } from "../../../lib/types";

const HEAPS = [1, 2, 4];
const MOVES = [1, 2];
const grundy = [0];
for (let x = 1; x <= 4; x++) {
  const seen = new Set(MOVES.filter((d) => d <= x).map((d) => grundy[x - d]));
  let g = 0;
  while (seen.has(g)) g++;
  grundy.push(g);
}

function picture(heaps: number[], stage: number, formula: string | [string, string] = "", changed = -1): SceneMap {
  const [first, second = ""] = typeof formula === "string" ? [formula] : formula;
  const showValues = stage > 4;
  const table = stage >= 0 && stage <= 4;
  const available = table ? Math.min(stage, 4) : 4;
  const scene: SceneMap = {
    formula: { text: first, o: first ? 1 : 0, cls: changed >= 0 ? "v-eq" : "" },
    detail: { text: second, o: second ? 1 : 0 },
    value: { o: table || showValues ? 1 : 0 },
  };
  heaps.forEach((x, i) => {
    const cls = i === changed ? "is-good" : "";
    scene[`heap${i}`] = {
      text: String(x), o: table ? 0 : 1, cls,
      ...(i === changed ? { fx: { type: "pulse", delay: 200 } } : {}),
    };
    scene[`value${i}`] = { text: String(grundy[x]), o: showValues ? 1 : 0, cls };
  });
  grundy.forEach((g, x) => {
    const earlier = MOVES.some((d) => stage - d === x);
    const cls = x > available ? "is-out" : x === stage ? "is-good" : earlier ? "is-active" : "";
    scene[`size${x}`] = { o: table ? 1 : 0 };
    scene[`g${x}`] = {
      text: x <= available ? String(g) : "?", cls, o: table ? 1 : 0,
      ...(x === stage ? { fx: { type: "pulse", delay: 200 } } : {}),
    };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "math-adv", slug: "game-theory",
  title: { vi: "Lý thuyết trò chơi: Nim & Grundy", en: "Game theory: Nim and Grundy" },
  added: "2026-11-27",
  summary: {
    vi: "Tính số Grundy của từng đống rồi dùng XOR để tìm thế thắng.",
    en: "Compute each heap's Grundy number and use XOR to identify winning positions.",
  },
  level: "hard", minutes: 11, time: "O(HK + n)", memory: "O(H + K)",
  goal: { vi: "Tìm nước đi thắng với ba đống <b>[1, 2, 4]</b> dưới hai luật bốc", en: "Find a winning move for three heaps <b>[1, 2, 4]</b> under two removal rules" },
  codeLang: "C++17",
  code: [
    '<span class="kw">int</span> s = 0, take = 0;',
    '<span class="kw">for</span> (<span class="kw">int</span> x : heaps) s ^= x; <span class="cm">// Nim</span>',
    '<span class="kw">for</span> (<span class="kw">int</span> x : heaps)',
    '  <span class="kw">if</span> ((x ^ s) &lt; x) { take = x - (x ^ s); <span class="kw">break</span>; }',
    'vector&lt;<span class="kw">int</span>&gt; g(H + 1); <span class="cm">// subtraction game</span>',
    '<span class="kw">const int</span> K = moves.size();',
    '<span class="kw">for</span> (<span class="kw">int</span> x = 1; x &lt;= H; ++x) {',
    '  vector&lt;<span class="kw">bool</span>&gt; seen(K + 1);',
    '  <span class="kw">for</span> (<span class="kw">int</span> d : moves) <span class="kw">if</span> (d &lt;= x) seen[g[x - d]] = true;',
    '  <span class="kw">while</span> (seen[g[x]]) ++g[x];',
    '}',
    's = 0;',
    '<span class="kw">for</span> (<span class="kw">int</span> x : heaps) s ^= g[x];',
    '<span class="kw">bool</span> win = s != 0;',
  ],
  watch: [{ key: "xor", label: "s" }, { key: "size", label: "x" }, { key: "grundy", label: "g[x]" }],
  practice: [
    { src: "CSES 1730", name: "Nim Game I", lv: "★☆☆", url: "https://cses.fi/problemset/task/1730" },
    { src: "CSES 1729", name: "Stick Game", lv: "★★☆", url: "https://cses.fi/problemset/task/1729" },
  ],
  sceneOptions: { unit: 54 },
  legend: [
    { cls: "acc", label: { vi: "giá trị đã có để tính mex", en: "known value used in mex" } },
    { cls: "ac", label: { vi: "giá trị vừa tính hoặc nước đi chọn", en: "new value or chosen move" } },
  ],
  steps: [
    {
      title: { vi: "Ai có thể thắng?", en: "Who can win?" }, kind: "problem",
      body: {
        vi: "Hai người luân phiên bốc que từ đúng một đống. Ai hết nước đi thì thua. Với các đống 1, 2, 4, ta sẽ tìm nước thắng cho hai luật bốc mà không phải duyệt cây nước đi, nơi cùng một trạng thái có thể xuất hiện theo nhiều thứ tự.",
        en: "Players alternate removing sticks from one heap. The player with no legal move loses. For heaps of 1, 2, and 4, we will find a winning move under two rules without searching a game tree that can revisit the same position in many orders.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture(HEAPS, -1),
    },
    {
      title: { vi: "XOR các đống Nim", en: "XOR the Nim heaps" }, kind: "concept",
      body: {
        vi: "Trong Nim, ta được bốc bao nhiêu que tùy ý từ một đống, miễn là bốc ít nhất một que. Tính <code>s = 1 ⊕ 2 ⊕ 4 = 7</code>. Khi <code>s ≠ 0</code>, chọn một đống <code>x</code> có bit 1 tại bit cao nhất của <code>s</code> để <code>x ^ s</code> nhỏ hơn <code>x</code>.",
        en: "In Nim, a move removes any positive number of sticks from one heap. Compute <code>s = 1 ⊕ 2 ⊕ 4 = 7</code>. When <code>s ≠ 0</code>, choose a heap <code>x</code> that has a 1 at the highest set bit of <code>s</code>, so <code>x ^ s</code> is smaller than <code>x</code>.",
      },
      lines: [1, 2, 3, 4], watch: { xor: 7 }, verdict: "run", fit: "all", scene: picture(HEAPS, -1, "1 ⊕ 2 ⊕ 4 = 7"),
    },
    {
      title: { vi: "Đưa XOR về 0", en: "Make the XOR zero" }, kind: "answer",
      body: {
        vi: "Giảm đống 4 xuống <code>4 ⊕ 7 = 3</code>. Đối thủ nhận thế thua vì <code>1 ⊕ 2 ⊕ 3 = 0</code>. Mỗi nước đi chỉ đổi một kích thước đống, nên thế XOR bằng 0 luôn chuyển thành thế XOR khác 0 nếu còn nước đi.",
        en: "Reduce the heap of 4 to <code>4 ⊕ 7 = 3</code>. The opponent gets a losing position because <code>1 ⊕ 2 ⊕ 3 = 0</code>. A move changes exactly one heap size, so every move from a zero-XOR position makes its XOR nonzero.",
      },
      lines: [3, 4], watch: { size: 4, xor: 0 }, verdict: "ac", fit: "all", scene: picture([1, 2, 3], -1, "1 ⊕ 2 ⊕ (4 ⊕ 7) = 0", 2),
    },
    {
      title: { vi: "Đổi luật bốc que", en: "Restrict the legal moves" }, kind: "concept",
      body: {
        vi: "Giờ mỗi lượt chỉ được bốc 1 hoặc 2 que. Với một đống <code>x</code>, số Grundy <code>g[x]</code> là mex của các số Grundy đến được trong một lượt. Mex là số nguyên không âm nhỏ nhất chưa xuất hiện, nên <code>g[0] = mex(∅) = 0</code>.",
        en: "Now a turn removes exactly 1 or 2 sticks. For a heap of size <code>x</code>, its Grundy number <code>g[x]</code> is the mex of the Grundy numbers reachable in one move. Mex is the smallest missing nonnegative integer, so <code>g[0] = mex(∅) = 0</code>.",
      },
      lines: [5, 6], watch: { size: 0, grundy: 0 }, verdict: "run", fit: "all", scene: picture(HEAPS, 0, "mex(∅) = 0"),
    },
    {
      title: { vi: "Tính mex từng ô", en: "Compute each mex" }, kind: "step",
      body: {
        vi: "Đống 1 chỉ về được 0, nên <code>g[1] = mex({0}) = 1</code>. Đống 2 về được 0 hoặc 1, nên <code>g[2] = mex({0, 1}) = 2</code>.",
        en: "A heap of 1 can only reach 0, so <code>g[1] = mex({0}) = 1</code>. A heap of 2 can reach 0 or 1, so <code>g[2] = mex({0, 1}) = 2</code>.",
      },
      lines: [7, 8, 9, 10], watch: { size: 2, grundy: 2 }, verdict: "run", fit: "all", scene: picture(HEAPS, 2, ["mex({0}) = 1", "mex({0, 1}) = 2"]),
    },
    {
      title: { vi: "Gặp lại thế thua", en: "Reach another losing position" }, kind: "step",
      body: {
        vi: "Từ 3 đi được tới 1 hoặc 2, có Grundy 1 và 2, nên <code>g[3] = 0</code> và đống 3 đứng riêng là thế thua. Từ 4 đi được tới 2 hoặc 3, có Grundy 2 và 0, nên <code>g[4] = 1</code>.",
        en: "From 3 we reach 1 or 2, with Grundy numbers 1 and 2, so <code>g[3] = 0</code> and a lone heap of 3 is losing. From 4 we reach 2 or 3, with Grundy numbers 2 and 0, so <code>g[4] = 1</code>.",
      },
      lines: [7, 8, 9, 10], watch: { size: 4, grundy: 1 }, verdict: "run", fit: "all", scene: picture(HEAPS, 4, ["mex({1, 2}) = 0", "mex({0, 2}) = 1"]),
    },
    {
      title: { vi: "XOR các số Grundy", en: "XOR the Grundy numbers" }, kind: "step",
      body: {
        vi: "Thay mỗi kích thước đống bằng số Grundy đã tính. Ba đống <code>[1, 2, 4]</code> cho <code>[1, 2, 1]</code> và <code>s = 2</code>, nên người đi trước có nước thắng.",
        en: "Replace each heap size with its computed Grundy number. The heaps <code>[1, 2, 4]</code> give <code>[1, 2, 1]</code> and <code>s = 2</code>, so the first player has a winning move.",
      },
      lines: [12, 13, 14], watch: { xor: 2 }, verdict: "run", fit: "all", scene: picture(HEAPS, 5, "1 ⊕ 2 ⊕ 1 = 2"),
    },
    {
      title: { vi: "Bốc hết đống giữa", en: "Empty the middle heap" }, kind: "answer",
      body: {
        vi: "Muốn triệt tiêu <code>s = 2</code>, đổi Grundy của đống giữa từ 2 thành <code>2 ⊕ 2 = 0</code>. Bốc cả 2 que để đống này về 0, khi đó <code>1 ⊕ 0 ⊕ 1 = 0</code>.",
        en: "To cancel <code>s = 2</code>, change the middle heap's Grundy number from 2 to <code>2 ⊕ 2 = 0</code>. Remove both sticks to empty that heap, giving <code>1 ⊕ 0 ⊕ 1 = 0</code>.",
      },
      lines: [9, 10, 12, 13, 14], watch: { size: 0, grundy: 0, xor: 0 }, verdict: "ac", fit: "all", scene: picture([1, 0, 4], 5, "1 ⊕ (2 ⊕ 2) ⊕ 1 = 0", 1),
    },
    {
      title: { vi: "Vì sao mex đủ", en: "Why mex works" }, kind: "recap",
      body: {
        vi: "Mex bảo đảm đống Grundy <code>g</code> đi được đến mọi Grundy nhỏ hơn và không đi được đến chính <code>g</code>. Vì vậy lập luận XOR của Nim vẫn đúng cho các đống độc lập. Với kích thước lớn nhất H, K cách bốc và n đống, ta tốn O(HK + n) thời gian và O(H + K) bộ nhớ phụ.",
        en: "Mex guarantees a heap with Grundy number <code>g</code> can reach every smaller Grundy number and cannot reach <code>g</code> itself. The Nim XOR argument therefore still works for independent heaps. With maximum size H, K removal options, and n heaps, this takes O(HK + n) time and O(H + K) extra space.",
      },
      lines: [9, 10, 13, 14], watch: { xor: 0 }, verdict: "ac", fit: "all", scene: picture([1, 0, 4], 5, "1 ⊕ 0 ⊕ 1 = 0", 1),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  scene.add("size", { shape: shapes.pill({ text: "x" }), x: -0.35 });
  scene.add("value", { shape: shapes.pill({ text: "g[x]" }), x: -0.35, y: 1.6, o: 0 });
  for (let i = 0; i < HEAPS.length; i++) {
    const x = 1.3 + i * 1.25;
    scene.add(`heap${i}`, { shape: shapes.block({ label: HEAPS[i], w: 46, h: 31 }), x, y: 0 });
    scene.add(`value${i}`, { shape: shapes.block({ w: 46, h: 31 }), x, y: 1.6, o: 0 });
  }
  grundy.forEach((_, i) => {
    const x = 0.65 + i * 0.92;
    scene.add(`size${i}`, { shape: shapes.pill({ text: i }), x, y: 0, o: 0 });
    scene.add(`g${i}`, { shape: shapes.block({ w: 41, h: 32 }), x, y: 1.6, o: 0 });
  });
  scene.add("formula", { shape: shapes.pill(), x: 2.1, y: 2.95, o: 0 });
  scene.add("detail", { shape: shapes.pill(), x: 2.1, y: 3.95, o: 0 });
}
