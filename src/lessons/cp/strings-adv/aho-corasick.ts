import type { Lesson, SceneMap } from "../../../lib/types";

const TEXT = "shershe";
const NODES = [
  { id: "root", parent: "", fail: "", x: 3, y: 2.25 },
  { id: "h", parent: "root", fail: "root", x: 1.2, y: 3.86 },
  { id: "s", parent: "root", fail: "root", x: 4.8, y: 3.86 },
  { id: "he", parent: "h", fail: "root", x: 1.2, y: 5.48 },
  { id: "sh", parent: "s", fail: "h", x: 4.8, y: 5.48 },
  { id: "her", parent: "he", fail: "root", x: 1.2, y: 7.1 },
  { id: "she", parent: "sh", fail: "he", x: 4.8, y: 7.1 },
  { id: "hers", parent: "her", fail: "s", x: 1.2, y: 8.72 },
];
const PATTERNS = ["he", "she", "hers"];

function picture({
  read = -1, active = [], next = [], fail = [], formula = "", result = false, tree = true,
}: {
  read?: number; active?: string[]; next?: string[]; fail?: string[];
  formula?: string; result?: boolean; tree?: boolean;
} = {}): SceneMap {
  const scene: SceneMap = {
    calc: { text: formula, o: formula ? 1 : 0, cls: result ? "v-eq" : "is-active" },
  };
  [...TEXT].forEach((_, i) => {
    scene[`t${i}`] = {
      cls: i === read ? "is-active" : i < read ? "is-good" : "",
      ...(i === read ? { fx: { type: "pulse", delay: 220 } } : {}),
    };
  });
  for (const { id, parent } of NODES) {
    const terminal = PATTERNS.includes(id);
    scene[id] = { o: tree ? 1 : 0, cls: active.includes(id) ? "is-active" : terminal ? "is-good" : "" };
    if (parent) {
      const follow = next.includes(id);
      const fallback = fail.includes(id);
      scene[`next-${id}`] = {
        p: tree ? 1 : 0, cls: follow ? "v-eq" : "",
        ...(follow ? { from: { p: 0 }, delay: 350, dur: 400 } : {}),
      };
      scene[`fail-${id}`] = {
        p: fallback ? 1 : 0, cls: "v-gt",
        ...(fallback ? { from: { p: 0 }, delay: 150, dur: 430 } : {}),
      };
    }
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp", topic: "strings-adv", slug: "aho-corasick",
  title: { vi: "Aho-Corasick", en: "Aho-Corasick" },
  added: "2026-11-27", level: "hard", minutes: 13, time: "O(σV + n)", memory: "O(σV)",
  summary: {
    vi: "Gắn liên kết thất bại cho trie để đọc văn bản một lần và đếm lượt khớp của mọi mẫu.",
    en: "Add failure links to a trie to scan the text once and count matches for every pattern.",
  },
  goal: {
    vi: "Đếm số lần <b>he, she, hers</b> xuất hiện trong <b>shershe</b>",
    en: "Count occurrences of <b>he, she, hers</b> in <b>shershe</b>",
  },
  codeLang: "C++17",
  code: [
    '<span class="cm">// go: trie edges, absent = 0; end[id]: pattern node</span>',
    'vector&lt;int&gt; fail(go.size()), bfs{0};',
    'for (int c = 0; c &lt; 26; ++c) if (go[0][c]) bfs.push_back(go[0][c]);',
    'for (int i = 1; i &lt; (int)bfs.size(); ++i) {',
    '  int v = bfs[i];',
    '  for (int c = 0; c &lt; 26; ++c) {',
    '    int u = go[v][c], f = go[fail[v]][c];',
    '    if (u) { fail[u] = f; bfs.push_back(u); }',
    '    else go[v][c] = f;',
    '  }',
    '}',
    'vector&lt;int&gt; cnt(go.size()); int v = 0;',
    "for (char c : text) ++cnt[v = go[v][c - 'a']];",
    'for (int i = (int)bfs.size()-1; i &gt; 0; --i)',
    '  cnt[fail[bfs[i]]] += cnt[bfs[i]];',
    '<span class="cm">// For each pattern id, answer = cnt[end[id]].</span>',
  ],
  watch: [
    { key: "i", label: "i" }, { key: "v", label: { vi: "trạng thái", en: "state" } },
    { key: "cnt", label: "cnt[v]" },
    { key: "matches", label: { vi: "mẫu khớp", en: "matching patterns" } },
  ],
  practice: [
    { src: "CSES 2102", name: "Finding Patterns", lv: "★★★", url: "https://cses.fi/problemset/task/2102" },
    { src: "CSES 2103", name: "Counting Patterns", lv: "★★★", url: "https://cses.fi/problemset/task/2103" },
  ],
  sceneOptions: { unit: 48 },
  legend: [
    { cls: "acc", label: { vi: "đang xét", en: "in focus" } },
    { cls: "ac", label: { vi: "nút kết thúc mẫu hoặc chữ đã đọc", en: "pattern ending or scanned letter" } },
    { cls: "wa", label: { vi: "liên kết thất bại", en: "failure link" } },
  ],
  steps: [
    {
      title: { vi: "Đếm nhiều mẫu", en: "Count multiple patterns" }, kind: "problem",
      body: {
        vi: "Trong <code>shershe</code>, đếm số lần từng mẫu <code>he</code>, <code>she</code> và <code>hers</code> xuất hiện, kể cả khi chúng chồng lên nhau. Chạy KMP riêng cho từng mẫu sẽ duyệt văn bản lại một lần cho mỗi mẫu.",
        en: "In <code>shershe</code>, count occurrences of <code>he</code>, <code>she</code>, and <code>hers</code>, including overlapping matches. Running KMP separately for each pattern scans the text again for every pattern.",
      },
      lines: [], watch: {}, verdict: "run", fit: "all", scene: picture({ tree: false }),
    },
    {
      title: { vi: "Đưa mẫu vào trie", en: "Put patterns in a trie" }, kind: "concept",
      body: {
        vi: "Nút mang nhãn là tiền tố đọc từ gốc <code>ε</code> đến nút đó. <code>he</code> và <code>hers</code> dùng chung nhánh <code>h → he</code>. Đánh dấu ba nút kết thúc mẫu để biết cần đọc đáp án ở đâu.",
        en: "Each node is labeled with the prefix spelled by the path from root <code>ε</code>. <code>he</code> and <code>hers</code> share the branch <code>h → he</code>. Mark the three pattern endings so we know where to read the counts.",
      },
      lines: [1], watch: { v: "ε" }, verdict: "run", fit: "all",
      scene: picture({ next: ["h", "he", "her", "hers"] }),
    },
    {
      title: { vi: "Nối theo hậu tố", en: "Link to suffixes" }, kind: "concept",
      body: {
        vi: "<code>fail[v]</code> trỏ tới hậu tố thực sự dài nhất của <code>v</code> có trong trie. BFS dựng các liên kết theo độ sâu: trước hết <code>fail(sh) = h</code> vì <code>fail(s) = ε</code> và gốc có cạnh <code>h</code>. Sau đó <code>fail(she) = he</code> vì từ <code>fail(sh) = h</code> có cạnh <code>e</code>.",
        en: "<code>fail[v]</code> points to the longest proper suffix of <code>v</code> in the trie. BFS builds links by depth: first <code>fail(sh) = h</code>, since <code>fail(s) = ε</code> and the root has an <code>h</code> edge. Then <code>fail(she) = he</code>, since <code>fail(sh) = h</code> has an <code>e</code> edge.",
      },
      lines: [2, 3, 4, 7, 8, 9], watch: { v: "she" }, verdict: "run", fit: "all",
      scene: picture({ active: ["sh", "h", "she", "he"], fail: ["sh", "she"], formula: "fail(she) = go[h][e] = he" }),
    },
    {
      title: { vi: "Khớp hai mẫu cùng lúc", en: "Match two patterns together" }, kind: "step",
      body: {
        vi: "Ba chữ đầu đưa ta qua <code>s</code>, <code>sh</code> rồi <code>she</code>. Tại chỉ số 2, <code>she</code> kết thúc, còn <code>he</code> trên liên kết thất bại cũng kết thúc ở đó. Khi quét, chỉ tăng <code>cnt[she]</code> từ 0 lên 1 rồi cộng dồn cho <code>he</code> sau.",
        en: "The first three letters take us through <code>s</code>, <code>sh</code>, and <code>she</code>. At index 2, <code>she</code> ends, and so does <code>he</code> along its failure link. During the scan, increment only <code>cnt[she]</code> from 0 to 1 and pass that count to <code>he</code> later.",
      },
      lines: [12, 13], watch: { i: 2, v: "she", cnt: 1, matches: "she, he" }, verdict: "run", fit: "all",
      scene: picture({ read: 2, active: ["she", "he"], next: ["s", "sh", "she"], fail: ["she"], formula: "cnt[she] = 0 + 1 = 1" }),
    },
    {
      title: { vi: "Lùi khi thiếu cạnh", en: "Fall back on a missing edge" }, kind: "step",
      body: {
        vi: "Đọc <code>r</code> ở chỉ số 3: <code>she</code> thiếu cạnh này, nhưng <code>he</code> có cạnh dẫn đến <code>her</code>. Bước dựng <code>go</code> đã gộp cả hai việc vào một lần tra <code>go[she][r]</code>.",
        en: "Read <code>r</code> at index 3: <code>she</code> lacks that edge, but <code>he</code> has one to <code>her</code>. The construction of <code>go</code> combines both moves into one lookup at <code>go[she][r]</code>.",
      },
      lines: [7, 9, 13], watch: { i: 3, v: "her", cnt: 1 }, verdict: "run", fit: "all",
      scene: picture({ read: 3, active: ["she", "he", "her"], next: ["her"], fail: ["she"], formula: "go[she][r] = go[he][r] = her" }),
    },
    {
      title: { vi: "Khớp mẫu hers", en: "Match the pattern hers" }, kind: "step",
      body: {
        vi: "Chữ <code>s</code> ở chỉ số 4 theo cạnh từ <code>her</code> đến <code>hers</code>. Đây là nút kết thúc mẫu, nên đã có một lượt <code>hers</code> kết thúc tại 4.",
        en: "The <code>s</code> at index 4 follows the edge from <code>her</code> to <code>hers</code>. This is a pattern ending, giving one occurrence of <code>hers</code> ending at 4.",
      },
      lines: [13], watch: { i: 4, v: "hers", cnt: 1, matches: "hers" }, verdict: "run", fit: "all",
      scene: picture({ read: 4, active: ["her", "hers"], next: ["hers"], formula: "go[her][s] = hers   ·   cnt[hers] = 1" }),
    },
    {
      title: { vi: "Đọc nốt hai chữ", en: "Read the last two letters" }, kind: "step",
      body: {
        vi: "Ở chỉ số 5, <code>hers</code> thiếu cạnh <code>h</code>, nên lùi về hậu tố <code>s</code> rồi đi đến <code>sh</code>. Chữ <code>e</code> ở chỉ số 6 đưa ta trở lại <code>she</code>, nâng <code>cnt[she]</code> lên 2.",
        en: "At index 5, <code>hers</code> lacks an <code>h</code> edge, so fall back to suffix <code>s</code> and move to <code>sh</code>. The <code>e</code> at index 6 returns us to <code>she</code>, raising <code>cnt[she]</code> to 2.",
      },
      lines: [7, 9, 13], watch: { i: 6, v: "she", cnt: 2, matches: "she, he" }, verdict: "run", fit: "all",
      scene: picture({ read: 6, active: ["hers", "s", "sh", "she"], next: ["sh", "she"], fail: ["hers"], formula: "cnt[she] = 1 + 1 = 2" }),
    },
    {
      title: { vi: "Cộng dồn số lượt khớp", en: "Accumulate the match counts" }, kind: "answer",
      body: {
        vi: "Duyệt ngược BFS để cộng <code>cnt[v]</code> vào <code>cnt[fail[v]]</code>. Hai lượt ở <code>she</code> đều đến <code>he</code>, nên <code>cnt[he] = 0 + 2 = 2</code>. Kết quả theo thứ tự mẫu <code>he, she, hers</code> là <code>2, 2, 1</code>.",
        en: "Process nodes in reverse BFS order, adding <code>cnt[v]</code> to <code>cnt[fail[v]]</code>. Both visits to <code>she</code> pass to <code>he</code>, so <code>cnt[he] = 0 + 2 = 2</code>. The counts for <code>he, she, hers</code> are <code>2, 2, 1</code>.",
      },
      lines: [14, 15, 16], watch: { v: "he", cnt: 2 }, verdict: "ac", fit: "all",
      scene: picture({ read: 7, fail: ["she"], formula: "cnt[he] = 0 + cnt[she] = 2", result: true }),
    },
    {
      title: { vi: "Một lượt qua văn bản", en: "One pass through the text" }, kind: "recap",
      body: {
        vi: "Sau mỗi chữ, trạng thái là hậu tố dài nhất đã đọc còn nằm trong trie. Lần theo các liên kết thất bại sẽ tới mọi mẫu cùng kết thúc ở đó, nên cộng dồn ngược BFS đếm đủ cả các lượt chồng nhau. Với <code>V</code> nút và bảng chữ cái cỡ <code>σ</code>, mã xử lý trong O(σV + n) thời gian và O(σV) bộ nhớ, chưa tính nhập danh sách mẫu và xuất đáp án.",
        en: "After each letter, the state is the longest suffix read so far that occurs in the trie. Its failure chain reaches all patterns ending there, so reverse BFS counts every overlapping match. With <code>V</code> nodes and alphabet size <code>σ</code>, the code uses O(σV + n) time and O(σV) space, excluding pattern input and answer output.",
      },
      lines: [4, 6, 13, 14, 15, 16], watch: {}, verdict: "ac", fit: "all",
      scene: picture({ read: 7, formula: "he: 2   ·   she: 2   ·   hers: 1", result: true }),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  [...TEXT].forEach((letter, i) => {
    scene.add(`t${i}`, { shape: shapes.block({ label: letter, sub: i, w: 37, h: 26, depth: 4 }), x: i });
  });
  for (const { id, x, y } of NODES) {
    scene.add(id, { shape: shapes.block({ label: id === "root" ? "ε" : id, w: 52, h: 28, depth: 4 }), x, y });
  }
  for (const { id, parent, fail } of NODES) {
    if (!parent) continue;
    scene.link(`next-${id}`, { from: parent, to: id, anchor: "center", arrow: true, bend: 0 });
    scene.link(`fail-${id}`, { from: id, to: fail, anchor: "center", arrow: true, bend: id === "hers" ? 0.28 : -0.16 });
  }
  scene.add("calc", { shape: shapes.pill(), x: 3, y: 10.2, o: 0 });
}
