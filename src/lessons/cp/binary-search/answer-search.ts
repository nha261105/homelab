import type { Lesson, SceneMap } from "../../../lib/types";

const SECONDS = [2, 3, 4];
const NEED = 4;
const MAX_TIME = Math.min(...SECONDS) * NEED;
const TIMES = Array.from({ length: MAX_TIME + 1 }, (_, t) => t);
const U = 53;
const FIT = ["t0", `t${MAX_TIME}`, "lo", "hi", "calc"];

function timeline(failsThrough: number, worksFrom: number): SceneMap {
  return Object.fromEntries(TIMES.map((t) => {
    const fails = t <= failsThrough;
    const works = t >= worksFrom;
    return [`ok${t}`, {
      text: fails ? "×" : works ? "✓" : "?",
      cls: fails ? "v-gt" : works ? "v-eq" : "",
      o: fails || works ? 1 : 0.6,
    }];
  }));
}

function searchWindow(lo: number, hi: number): SceneMap {
  return {
    lo: { x: lo, o: lo < hi ? 1 : 0, dur: 560 },
    hi: { x: hi, o: lo < hi ? 1 : 0, dur: 560 },
    win: { x: (lo + hi) / 2, w: (hi - lo) * U + 52, o: 1, cls: lo === hi ? "is-good" : "", dur: 560 },
  };
}

function trial(lo: number, hi: number, t: number): SceneMap {
  const parts = SECONDS.map((k) => Math.floor(t / k));
  const total = parts.reduce((sum, count) => sum + count, 0);
  const enough = total >= NEED;
  return {
    ...timeline(lo - 1, hi),
    ...searchWindow(lo, hi),
    [`t${t}`]: { cls: "is-active", fx: { type: "pulse", delay: 280 } },
    calc: {
      text: `${parts.join(" + ")} = ${total} ${enough ? "≥" : "<"} ${NEED}`,
      cls: enough ? "v-eq" : "v-gt", o: 1, from: { o: 0 }, delay: 410, dur: 340,
    },
  };
}

export const lesson: Lesson = {
  track: "cp",
  topic: "binary-search",
  slug: "answer-search",
  title: { vi: "Chặt nhị phân đáp án", en: "Binary search on the answer" },
  added: "2026-11-27",
  summary: {
    vi: "Tìm thời gian ngắn nhất bằng cách kiểm tra ở mỗi mốc xem các máy đã làm đủ sản phẩm chưa.",
    en: "Find the shortest time by checking whether the machines can make enough products by each trial time.",
  },
  level: "medium",
  minutes: 8,
  time: "O(n log(U + 1))",
  memory: "O(1)",
  goal: { vi: "tìm ít giây nhất để làm <b>4 sản phẩm</b>", en: "find the fewest seconds to make <b>4 products</b>" },
  codeLang: "C++17",
  code: [
    '<span class="kw">auto</span> enough = [&amp;](<span class="kw">long long</span> t) {',
    '  <span class="kw">long long</span> made = <span class="nm">0</span>;',
    '  <span class="kw">for</span> (<span class="kw">auto</span> seconds : k) {',
    '    made += t / seconds;',
    '    <span class="kw">if</span> (made &gt;= need) <span class="kw">return true</span>;',
    "  }",
    '  <span class="kw">return false</span>;',
    "};",
    '<span class="kw">long long</span> lo = <span class="nm">1</span>, hi = <span class="nm">1LL</span> * *min_element(k.begin(), k.end()) * need;',
    '<span class="kw">while</span> (lo &lt; hi) {',
    '  <span class="kw">long long</span> t = lo + (hi - lo) / <span class="nm">2</span>;',
    '  <span class="kw">if</span> (enough(t)) hi = t; <span class="kw">else</span> lo = t + <span class="nm">1</span>;',
    "}",
    '<span class="kw">return</span> lo;',
  ],
  watch: [
    { key: "lo", label: "lo" },
    { key: "hi", label: "hi" },
    { key: "t", label: "t (s)" },
    { key: "made", label: { vi: "số sản phẩm", en: "products made" } },
  ],
  practice: [
    { src: "CSES 1620", name: "Factory Machines", lv: "★★☆", url: "https://cses.fi/problemset/task/1620" },
    { src: "LeetCode 875", name: "Koko Eating Bananas", lv: "★★☆", url: "https://leetcode.com/problems/koko-eating-bananas/" },
    { src: "CSES 1085", name: "Array Division", lv: "★★☆", url: "https://cses.fi/problemset/task/1085" },
  ],
  sceneOptions: { unit: U, view: [-49, -185, 522, 275] },
  legend: [
    { cls: "acc", label: { vi: "mốc đang thử", en: "trial time" } },
    { cls: "wa", label: { vi: "chưa đủ (×)", en: "too soon (×)" } },
    { cls: "ac", label: { vi: "đủ (✓)", en: "enough (✓)" } },
  ],
  entrance: TIMES.map((t) => `t${t}`),
  steps: [
    {
      title: { vi: "Cần bao nhiêu giây?", en: "How many seconds?" }, kind: "problem",
      body: {
        vi: "Ba máy chạy song song, lần lượt mất 2, 3 và 4 giây cho một sản phẩm. Cần ít nhất bao nhiêu giây để làm đủ 4 sản phẩm? Với mục tiêu lớn, thử từng giây có thể mất tới O(U) lượt, với U là cận trên của thời gian.",
        en: "Three machines work in parallel and take 2, 3, and 4 seconds per product. What is the earliest time they can make 4 products? Checking each second can take O(U) tests, where U is an upper bound on the time.",
      },
      lines: [], watch: {}, verdict: "run", fit: FIT,
      scene: { ...timeline(-1, MAX_TIME + 1), calc: { text: "" } },
    },
    {
      title: { vi: "Khoanh vùng thời gian", en: "Bound the time" }, kind: "concept",
      body: {
        vi: "Ở giây <code>t</code>, mỗi máy làm được <code>t / seconds</code> sản phẩm, lấy phần nguyên. Mốc 0 chắc chắn chưa đủ, còn ở mốc <code>U = 2 · 4 = 8</code> thì chỉ riêng máy nhanh nhất đã làm đủ, nên tìm trong <code>[1, 8]</code>.",
        en: "By second <code>t</code>, each machine makes <code>t / seconds</code> products using integer division. Time 0 is too soon, while at <code>U = 2 · 4 = 8</code> the fastest machine alone can make enough, so search <code>[1, 8]</code>.",
      },
      note: { vi: "Đã đủ ở mốc nào thì mọi mốc sau cũng đủ.", en: "Once a time is feasible, every later time is feasible too." },
      lines: [1, 4, 9], watch: { lo: 1, hi: 8 }, verdict: "run", fit: FIT,
      scene: { ...timeline(0, 8), ...searchWindow(1, 8), calc: { text: "U = 2 × 4 = 8", o: 1 } },
    },
    {
      title: { vi: "Bốn giây đã đủ", en: "Four seconds suffice" }, kind: "step",
      body: {
        vi: "Ở giữa <code>[1, 8]</code> là <code>t = 4</code>. Ba máy làm được <code>2 + 1 + 1 = 4</code> sản phẩm, nên từ giây 4 trở đi đều đủ. Đặt <code>hi = 4</code> để tìm xem có thể xong sớm hơn không.",
        en: "The midpoint of <code>[1, 8]</code> is <code>t = 4</code>. The machines make <code>2 + 1 + 1 = 4</code> products, so every time from 4 onward works. Set <code>hi = 4</code> to look for an earlier finish.",
      },
      lines: [4, 5, 11, 12], watch: { lo: 1, hi: 4, t: 4, made: 4 }, verdict: "run", fit: FIT,
      scene: trial(1, 4, 4),
    },
    {
      title: { vi: "Hai giây quá sớm", en: "Two seconds fall short" }, kind: "step",
      body: {
        vi: "Trong <code>[1, 4]</code> ta thử <code>t = 2</code>. Ba máy chỉ làm được <code>1 + 0 + 0 = 1</code> sản phẩm, nên cả giây 1 và 2 đều chưa đủ. Đặt <code>lo = 3</code>.",
        en: "In <code>[1, 4]</code>, try <code>t = 2</code>. The machines make only <code>1 + 0 + 0 = 1</code> product, so both seconds 1 and 2 are too soon. Set <code>lo = 3</code>.",
      },
      lines: [4, 7, 11, 12], watch: { lo: 3, hi: 4, t: 2, made: 1 }, verdict: "run", fit: FIT,
      scene: trial(3, 4, 2),
    },
    {
      title: { vi: "Ba giây vẫn thiếu", en: "Three seconds fall short" }, kind: "answer",
      body: {
        vi: "Trong <code>[3, 4]</code>, mốc <code>t = 3</code> chỉ cho <code>1 + 1 + 0 = 2</code> sản phẩm. Đặt <code>lo = 4</code>, trùng với <code>hi</code>, nên thời gian ngắn nhất là 4 giây.",
        en: "In <code>[3, 4]</code>, <code>t = 3</code> gives only <code>1 + 1 + 0 = 2</code> products. Setting <code>lo = 4</code> makes it meet <code>hi</code>, so the minimum time is 4 seconds.",
      },
      lines: [4, 7, 11, 12, 14], watch: { lo: 4, hi: 4, t: 3, made: 2 }, verdict: "ac", fit: FIT,
      scene: { ...trial(4, 4, 3), t4: { cls: "is-good", bob: 0.05, fx: { type: "hop", delay: 520 } } },
    },
    {
      title: { vi: "Tìm điểm đổi", en: "Find the transition" }, kind: "recap",
      body: {
        vi: "Trên trục thời gian, các dấu × đứng trước các dấu ✓, và mốc 4 là dấu ✓ đầu tiên. Mỗi lần thử thu hẹp ít nhất một nửa số mốc (làm tròn xuống), tốn O(n) để đếm sản phẩm của n máy, nên cả bài tốn O(n log(U + 1)) thời gian và O(1) bộ nhớ phụ.",
        en: "On the timeline, the × marks come before the ✓ marks, with the first ✓ at 4. Each test discards at least half the times rounded down and costs O(n) for n machines, giving O(n log(U + 1)) time and O(1) extra space.",
      },
      lines: [10, 11, 12, 14], watch: { lo: 4, hi: 4 }, verdict: "ac", fit: FIT,
      scene: {
        ...timeline(3, 4),
        ...searchWindow(4, 4),
        t4: { cls: "is-good", bob: 0.05 },
        calc: { text: "lo = hi = 4", o: 1, cls: "v-eq" },
      },
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setup(scene: any, shapes: any) {
  scene.add("win", { shape: shapes.frame({ h: 92, top: -61 }), layer: "back", x: 4, w: 0, o: 0 });
  TIMES.forEach((t) => {
    scene.add(`t${t}`, { shape: shapes.block({ label: t, w: 44, h: 46 }), x: t, shadow: true });
    scene.add(`ok${t}`, { shape: shapes.pill({ h: 19, pad: 7 }), x: t, y: 1, o: 0 });
  });
  scene.add("lo", { shape: shapes.pointer({ text: "lo" }), x: 1, z: -0.7, o: 0 });
  scene.add("hi", { shape: shapes.pointer({ text: "hi" }), x: MAX_TIME, z: -0.7, o: 0 });
  scene.add("calc", { shape: shapes.pill(), x: 4, z: 1.35, o: 0 });
}
