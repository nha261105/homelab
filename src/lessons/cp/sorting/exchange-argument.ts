import type { Lesson, SceneMap } from "../../../lib/types";

const U = 62;
const GAP = 1.55;
const TASKS = {
  A: { duration: 6, deadline: 10 },
  B: { duration: 8, deadline: 15 },
  C: { duration: 5, deadline: 12 },
};
type Task = keyof typeof TASKS;

function schedule(
  order: Task[],
  text = "",
  { compared = [], moved, answer = false }: { compared?: Task[]; moved?: Task; answer?: boolean } = {},
): SceneMap {
  let finish = 0;
  const scene: SceneMap = {
    reward: { text, o: text ? 1 : 0, cls: answer ? "v-eq" : "", delay: moved ? 620 : 0, dur: 280 },
  };
  order.forEach((id, i) => {
    const x = i * GAP;
    finish += TASKS[id].duration;
    scene[id] = {
      x,
      cls: answer ? "is-good" : compared.includes(id) ? "is-active" : "",
      arc: id === moved ? 1.15 : 0,
      dur: 560,
    };
    scene[`f${i}`] = { text: `f = ${finish}`, cls: answer ? "v-eq" : "", delay: moved ? 540 : 0 };
  });
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "sorting",
  slug: "exchange-argument",
  title: { vi: "Chứng minh tham lam bằng hoán đổi", en: "Exchange arguments" },
  added: "2026-11-27",
  summary: {
    vi: "Đổi chỗ hai việc kề nhau để chứng minh vì sao nên làm việc ngắn trước.",
    en: "Swap adjacent tasks to prove why shorter tasks should go first.",
  },
  level: "medium",
  minutes: 8,
  time: "O(n log n)",
  memory: "O(n)",
  goal: {
    vi: "Xếp ba việc để tối đa hóa <b>tổng điểm thưởng</b>",
    en: "Order three tasks to maximize the <b>total reward</b>",
  },
  codeLang: "C++17",
  code: [
    'sort(tasks.begin(), tasks.end()); <span class="cm">// (a, d)</span>',
    '<span class="kw">long long</span> f = <span class="nm">0</span>, reward = <span class="nm">0</span>;',
    '<span class="kw">for</span> (<span class="kw">auto</span> [a, d] : tasks) {',
    '  f += a;',
    '  reward += d - f;',
    '}',
    'cout &lt;&lt; reward;',
  ],
  watch: [
    { key: "order", label: { vi: "thứ tự", en: "order" } },
    { key: "finish", label: "Σ f" },
    { key: "reward", label: { vi: "tổng điểm", en: "total reward" } },
  ],
  practice: [
    { src: "CSES 1630", name: "Tasks and Deadlines", lv: "★☆☆", url: "https://cses.fi/problemset/task/1630" },
    { src: "CSES 1073", name: "Towers", lv: "★★☆", url: "https://cses.fi/problemset/task/1073" },
  ],
  sceneOptions: { unit: U, view: [-80, -150, 355, 270] },
  legend: [
    { cls: "acc", label: { vi: "cặp đang xét", en: "pair under comparison" } },
    { cls: "ac", label: { vi: "thứ tự tối ưu", en: "optimal order" } },
  ],
  entrance: ["A", "B", "C"],
  steps: [
    {
      title: { vi: "Xếp lịch ba việc", en: "Schedule three tasks" }, kind: "problem",
      body: {
        vi: "Mỗi ô ghi thời lượng <code>a</code> và hạn <code>d</code>. Làm hết các việc, mỗi lần một việc, để tối đa tổng điểm <code>d − f</code> với <code>f</code> là lúc hoàn thành. Thử hết có 3! = 6 lịch cho ba việc và tới n! lịch cho n việc.",
        en: "Each block shows the duration <code>a</code> and deadline <code>d</code>. Finish every task, one at a time, maximizing the sum of <code>d − f</code>, where <code>f</code> is its finish time. Brute force checks 3! = 6 schedules here and n! for n tasks.",
      },
      lines: [], watch: { order: "A B C" }, verdict: "run", fit: "all",
      scene: schedule(["A", "B", "C"]),
    },
    {
      title: { vi: "Tính điểm lịch ban đầu", en: "Score the initial order" }, kind: "concept",
      body: {
        vi: "Theo thứ tự A, B, C, ba việc xong lúc 6, 14, 19. Tổng hạn luôn là <code>10 + 15 + 12 = 37</code>, nên điểm của lịch này là <code>37 − (6 + 14 + 19) = −2</code>.",
        en: "In order A, B, C, the tasks finish at 6, 14, and 19. The deadlines always sum to <code>10 + 15 + 12 = 37</code>, so this schedule scores <code>37 − (6 + 14 + 19) = −2</code>.",
      },
      lines: [2, 3, 4, 5], watch: { order: "A B C", finish: 39, reward: -2 }, verdict: "run", fit: "all",
      scene: schedule(["A", "B", "C"], "37 − 39 = −2"),
    },
    {
      title: { vi: "Tìm cặp bị ngược", en: "Find an adjacent inversion" }, kind: "step",
      body: {
        vi: "B mất 8, còn C chỉ mất 5. Khi B đứng trước C, cặp bắt đầu lúc 6 và hoàn thành lần lượt lúc 14 và 19.",
        en: "B takes 8 units and C takes 5. With B first, the pair starts at 6 and finishes at 14 and 19.",
      },
      lines: [4, 5], watch: { order: "A B C", finish: 39, reward: -2 }, verdict: "run", fit: "all",
      scene: schedule(["A", "B", "C"], "14 + 19 = 33", { compared: ["B", "C"] }),
    },
    {
      title: { vi: "Đổi chỗ B và C", en: "Swap B and C" }, kind: "step",
      body: {
        vi: "Đưa C lên trước thì việc đầu trong cặp xong lúc <code>6 + 5 = 11</code>, sớm hơn 3 đơn vị. Cả cặp vẫn xong lúc 19, nên tổng <code>f</code> giảm từ 39 xuống 36 và điểm tăng từ −2 lên 1.",
        en: "With C first, the first task in the pair finishes at <code>6 + 5 = 11</code>, three units earlier. The pair still ends at 19, so the sum of <code>f</code> drops from 39 to 36 and reward rises from −2 to 1.",
      },
      note: {
        vi: "Hai việc vẫn chiếm 8 + 5 đơn vị thời gian, nên mọi việc nằm sau cặp giữ nguyên giờ hoàn thành.",
        en: "The pair still takes 8 + 5 time units, so every task after the pair keeps its finish time.",
      },
      lines: [4, 5], watch: { order: "A C B", finish: 36, reward: 1 }, verdict: "run", fit: "all",
      scene: schedule(["A", "C", "B"], "37 − 36 = 1", { moved: "C", compared: ["C", "B"] }),
    },
    {
      title: { vi: "Đưa C lên đầu", en: "Move C to the front" }, kind: "answer",
      body: {
        vi: "A mất 6 nên đổi tiếp A với C, việc chỉ mất 5. Lịch C, A, B có các mốc hoàn thành 5, 11, 19 và đạt <code>37 − (5 + 11 + 19) = 2</code> điểm.",
        en: "A takes 6 units, so swap it with C, which takes 5. Order C, A, B finishes at 5, 11, and 19 and earns <code>37 − (5 + 11 + 19) = 2</code>.",
      },
      lines: [1, 4, 5, 7], watch: { order: "C A B", finish: 35, reward: 2 }, verdict: "ac", fit: "all",
      scene: schedule(["C", "A", "B"], "37 − 35 = 2", { moved: "C", answer: true }),
    },
    {
      title: { vi: "Vì sao sắp xếp đúng", en: "Why sorting works" }, kind: "recap",
      body: {
        vi: "Trong bất kỳ lịch nào, đổi chỗ một cặp kề nhau có thời lượng <code>x &gt; y</code> sẽ giảm tổng <code>f</code> của cặp đi <code>x − y</code> và giữ nguyên các việc khác. Vậy lịch tối ưu có thời lượng tăng dần, và các việc cùng thời lượng đổi chỗ vẫn cho cùng điểm. Lưu các cặp <code>(a, d)</code> tốn O(n) bộ nhớ, sắp xếp rồi tính điểm tốn tổng cộng O(n log n).",
        en: "In any schedule, swapping an adjacent pair of durations <code>x &gt; y</code> reduces their total <code>f</code> by <code>x − y</code> and leaves other tasks unaffected. An optimal schedule therefore has nondecreasing durations, and equal durations can trade places at no cost. Storing the <code>(a, d)</code> pairs takes O(n) space, and sorting and scoring take O(n log n) time.",
      },
      lines: [1, 3, 4, 5], watch: { order: "C A B", finish: 35, reward: 2 }, verdict: "ac", fit: "all",
      scene: schedule(["C", "A", "B"], "37 − 35 = 2", { answer: true }),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  (Object.keys(TASKS) as Task[]).forEach((id, i) => {
    const { duration, deadline } = TASKS[id];
    scene.add(id, {
      shape: shapes.block({ label: duration, sub: `${id} · d=${deadline}`, w: 76, h: 46 }),
      x: i * GAP, shadow: true,
    });
    scene.add(`f${i}`, { shape: shapes.pill(), x: i * GAP, z: -0.95 });
  });
  scene.add("reward", { shape: shapes.pill(), x: GAP, z: -1.65, o: 0 });
}
