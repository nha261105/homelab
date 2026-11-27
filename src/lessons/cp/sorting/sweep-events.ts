import type { Lesson, SceneMap } from "../../../lib/types";

const U = 56;
const CUSTOMERS = [
  { name: "A", start: 2, end: 4 },
  { name: "B", start: 3, end: 7 },
  { name: "C", start: 4, end: 6 },
];
const EVENTS = CUSTOMERS.flatMap(({ name, start, end }) => [
  { id: name + "In", name, time: start, delta: 1 },
  { id: name + "Out", name, time: end, delta: -1 },
]);
const HIDE_VISITS: SceneMap = Object.fromEntries(CUSTOMERS.map(({ name }) => [name, { o: 0 }]));
const SORTED = [...EVENTS].sort((a, b) => a.time - b.time || a.delta - b.delta);

function sweep(current = -1, text = "", answer = false): SceneMap {
  const events: SceneMap = Object.fromEntries(SORTED.map(({ id }, i) => [
    id,
    {
      x: i,
      o: i < current ? 0.6 : 1,
      cls: i < current ? "is-out" : i === current ? "is-active" : "",
      dur: 560,
    },
  ]));
  return {
    ...HIDE_VISITS,
    ...events,
    cursor: { x: Math.max(0, current), o: current < 0 ? 0 : 1, arc: 0.35, dur: 560 },
    count: { text, o: text ? 1 : 0, cls: answer ? "v-eq" : "", delay: 560, dur: 280 },
  };
}

export const lesson: Lesson = {
  track: "cp",
  topic: "sorting",
  slug: "sweep-events",
  title: { vi: "Quét sự kiện", en: "Sweeping events" },
  added: "2026-11-27",
  summary: {
    vi: "Sắp xếp các lượt khách vào và ra theo thời gian để tìm lúc quán đông nhất.",
    en: "Sort arrivals and departures by time to find the restaurant's peak occupancy.",
  },
  level: "basic",
  minutes: 8,
  time: "O(n log n)",
  memory: "O(n)",
  goal: {
    vi: "Tìm số khách <b>cùng có mặt</b> lớn nhất trong quán",
    en: "Find the most customers <b>present at once</b>",
  },
  codeLang: "C++17",
  code: [
    '<span class="kw">vector</span>&lt;pair&lt;<span class="kw">int</span>, <span class="kw">int</span>&gt;&gt; events;',
    '<span class="kw">for</span> (<span class="kw">auto</span> [a, b] : visits) {',
    '  events.emplace_back(a, <span class="nm">+1</span>);',
    '  events.emplace_back(b, <span class="nm">-1</span>);',
    '}',
    'sort(events.begin(), events.end());',
    '<span class="kw">int</span> cur = <span class="nm">0</span>, best = <span class="nm">0</span>;',
    '<span class="kw">for</span> (<span class="kw">auto</span> [t, delta] : events) {',
    '  cur += delta;',
    '  best = max(best, cur);',
    '}',
    'cout &lt;&lt; best;',
  ],
  watch: [
    { key: "t", label: { vi: "thời điểm", en: "time" } },
    { key: "cur", label: { vi: "đang có (cur)", en: "present (cur)" } },
    { key: "best", label: { vi: "kỷ lục (best)", en: "peak (best)" } },
  ],
  practice: [
    { src: "CSES 1619", name: "Restaurant Customers", lv: "★☆☆", url: "https://cses.fi/problemset/task/1619" },
    { src: "CSES 1074", name: "Stick Lengths", lv: "★★☆", url: "https://cses.fi/problemset/task/1074" },
  ],
  sceneOptions: { unit: U, view: [-55, -130, 390, 270] },
  legend: [
    { cls: "acc", label: { vi: "sự kiện đang xét", en: "current event" } },
    { cls: "dim", label: { vi: "đã xử lý", en: "processed" } },
    { cls: "ac", label: { vi: "kết quả", en: "answer" } },
  ],
  entrance: CUSTOMERS.map(({ name }) => name),
  steps: [
    {
      title: { vi: "Quán đông nhất lúc nào?", en: "How crowded can it get?" }, kind: "problem",
      body: {
        vi: "A ở trong quán từ 2 đến trước 4, B từ 3 đến trước 7, C từ 4 đến trước 6. Nếu đếm lại khách ở từng mốc nguyên thì phải quét cả những khoảng trống, dù mốc cuối có thể lên tới 10⁹.",
        en: "A is inside from 2 up to 4, B from 3 up to 7, and C from 4 up to 6, all excluding their departure times. Recounting at every integer time scans even empty stretches, with times as large as 10⁹.",
      },
      lines: [], watch: {}, verdict: "run", fit: ["A", "B", "C"], scene: { count: { text: "" } },
    },
    {
      title: { vi: "Tách lượt vào và ra", en: "Split each visit" }, kind: "concept",
      body: {
        vi: "Một lượt khách tạo hai sự kiện, với <code>delta = +1</code> lúc vào và <code>delta = −1</code> lúc ra. Chẳng hạn A tạo +1 tại 2 và −1 tại 4.",
        en: "Each visit yields two events, with <code>delta = +1</code> on arrival and <code>delta = −1</code> on departure. A contributes +1 at 2 and −1 at 4.",
      },
      lines: [1, 2, 3, 4], watch: {}, verdict: "run", fit: EVENTS.map(({ id }) => id),
      scene: {
        ...HIDE_VISITS,
        ...Object.fromEntries(EVENTS.map(({ id }, i) => [id, { o: 1, delay: i * 80, dur: 320 }])),
        count: { text: "" },
      },
    },
    {
      title: { vi: "Xếp theo thời gian", en: "Sort by time" }, kind: "concept",
      body: {
        vi: "Sắp xếp cặp <code>(t, delta)</code> cho thứ tự 2, 3, 4, 4, 6, 7. Ở mốc 4, lượt ra của A đứng trước lượt vào của C vì −1 nhỏ hơn +1.",
        en: "Sorting <code>(t, delta)</code> gives the order 2, 3, 4, 4, 6, 7. At time 4, A's departure comes before C's arrival because −1 sorts before +1.",
      },
      lines: [6, 7], watch: { cur: 0, best: 0 }, verdict: "run", fit: "all",
      scene: {
        ...sweep(),
        BIn: { x: 1, o: 1, arc: 1.15, dur: 560 },
        BOut: { x: 5, o: 1, arc: 1.15, dur: 560, delay: 100 },
        CIn: { x: 3, o: 1, dur: 560, delay: 100 },
        COut: { x: 4, o: 1, dur: 560, delay: 100 },
      },
    },
    {
      title: { vi: "Tính lượt A vào", en: "Count A's arrival" }, kind: "step",
      body: {
        vi: "Quán ban đầu chưa có ai. A vào lúc 2, nên <code>cur</code> và <code>best</code> cùng tăng từ 0 lên 1.",
        en: "The restaurant starts empty. A arrives at 2, so <code>cur</code> and <code>best</code> both rise from 0 to 1.",
      },
      lines: [8, 9, 10], watch: { t: 2, cur: 1, best: 1 }, verdict: "run", fit: "all",
      scene: sweep(0, "cur = 0 + 1 = 1"),
    },
    {
      title: { vi: "Khách thứ hai vào", en: "The second customer arrives" }, kind: "step",
      body: {
        vi: "B vào lúc 3 khi A vẫn còn trong quán. <code>cur</code> tăng lên 2, nên <code>best</code> cũng lên 2.",
        en: "B arrives at 3 while A is still inside. <code>cur</code> rises to 2, so <code>best</code> becomes 2 as well.",
      },
      lines: [8, 9, 10], watch: { t: 3, cur: 2, best: 2 }, verdict: "run", fit: "all",
      scene: sweep(1, "cur = 1 + 1 = 2"),
    },
    {
      title: { vi: "Cho A ra trước", en: "Process A's departure first" }, kind: "step",
      body: {
        vi: "Ở mốc 4, A ra trước khi tính lượt vào của C. <code>cur</code> giảm từ 2 xuống 1, còn <code>best</code> vẫn là 2.",
        en: "At time 4, process A's departure before counting C's arrival. <code>cur</code> falls from 2 to 1, while <code>best</code> stays at 2.",
      },
      note: {
        vi: "Nếu tính C vào trước, bộ đếm sẽ chạm 3 dù A và C không có mặt cùng lúc.",
        en: "Counting C first would briefly give 3 even though A and C are never present together.",
      },
      lines: [8, 9, 10], watch: { t: 4, cur: 1, best: 2 }, verdict: "run", fit: "all",
      scene: sweep(2, "cur = 2 − 1 = 1"),
    },
    {
      title: { vi: "Tính lượt C vào", en: "Count C's arrival" }, kind: "step",
      body: {
        vi: "Vẫn ở mốc 4, C vào và <code>cur</code> trở lại 2. Hai khách trong quán lúc này là B và C.",
        en: "Still at time 4, C arrives and <code>cur</code> returns to 2. The two customers now inside are B and C.",
      },
      lines: [8, 9, 10], watch: { t: 4, cur: 2, best: 2 }, verdict: "run", fit: "all",
      scene: sweep(3, "cur = 1 + 1 = 2"),
    },
    {
      title: { vi: "Chốt số khách tối đa", en: "Read the peak" }, kind: "answer",
      body: {
        vi: "C ra lúc 6, rồi B ra lúc 7, nên <code>cur</code> lần lượt về 1 và 0. Số khách đông nhất vẫn là <code>best = 2</code>.",
        en: "C leaves at 6 and B at 7, so <code>cur</code> drops to 1 and then 0. The peak remains <code>best = 2</code>.",
      },
      lines: [8, 9, 10, 12], watch: { t: 7, cur: 0, best: 2 }, verdict: "ac", fit: "all",
      scene: sweep(5, "best = 2", true),
    },
    {
      title: { vi: "Chỉ quét các sự kiện", en: "Sweep only the events" }, kind: "recap",
      body: {
        vi: "Sau khi xử lý hết sự kiện cùng mốc <code>t</code>, <code>cur</code> đếm đúng số khách đang có mặt, và số đó giữ nguyên đến mốc kế tiếp. Lượt ra đi trước nên các giá trị trung gian ở cùng mốc không thể tạo kỷ lục giả. Sắp xếp 2n sự kiện tốn O(n log n), lượt quét tốn O(n) và danh sách dùng O(n) bộ nhớ.",
        en: "After all events at time <code>t</code>, <code>cur</code> counts exactly who's inside and stays constant until the next event time. Departures go first, so intermediate counts at the same time cannot create a false peak. Sorting the 2n events takes O(n log n), the sweep takes O(n), and the list uses O(n) space.",
      },
      lines: [6, 8, 9, 10], watch: { t: 7, cur: 0, best: 2 }, verdict: "ac", fit: "all",
      scene: sweep(5, "best = 2", true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  CUSTOMERS.forEach(({ name, start, end }, i) => {
    scene.add(name, { shape: shapes.block({ label: `[${start}, ${end})`, sub: name, w: 86, h: 44 }), x: 0.65 + i * 1.85, shadow: true });
  });
  EVENTS.forEach(({ id, name, time, delta }, i) => {
    scene.add(id, {
      shape: shapes.block({ label: delta === 1 ? "+1" : "−1", sub: `${name} · ${time}`, w: 47, h: 44 }),
      x: i, o: 0, shadow: true,
    });
  });
  scene.add("cursor", { shape: shapes.pointer({ text: "t" }), z: -0.45, o: 0 });
  scene.add("count", { shape: shapes.pill(), x: 2.5, z: -1.55, o: 0 });
}
