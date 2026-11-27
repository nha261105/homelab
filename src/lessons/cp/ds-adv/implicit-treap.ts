import type { Lesson, SceneMap } from "../../../lib/types";

const nodes = [
  { value: 4, p: 50 }, { value: 8, p: 90 }, { value: 2, p: 30 },
  { value: 7, p: 70 }, { value: 5, p: 40 },
];

type Placement = [x: number, y: number, size: number, parent?: number];
type Forest = Record<number, Placement>;

const original: Forest = {
  4: [-3.15, 2.65, 1, 8], 8: [-1.6, 0, 5], 2: [0, 5.3, 1, 7],
  7: [1.55, 2.65, 3, 8], 5: [3.1, 5.3, 1, 7],
};
const prefixSplit: Forest = { ...original, 4: [-3.15, 0, 1], 8: [-1.6, 0, 4] };
const isolated: Forest = {
  ...prefixSplit, 8: [-1.25, 0, 3], 7: [0.35, 2.65, 2, 8],
  2: [-1.2, 5.3, 1, 7], 5: [3.1, 0, 1],
};
const pushed: Forest = {
  ...isolated, 8: [1.55, 0, 3], 7: [-0.05, 2.65, 2, 8], 2: [-1.6, 5.3, 1, 7],
};
const joined: Forest = {
  4: [-3.15, 5.3, 1, 7], 8: [1.55, 0, 5], 2: [0, 5.3, 1, 7],
  7: [-1.55, 2.65, 3, 8], 5: [3.1, 2.65, 1, 8],
};
const leftJoined: Forest = { ...joined, 8: [1.55, 0, 4], 5: [3.1, 0, 1] };
const fit = [...nodes.map(({ value }) => `v${value}`), "calc"];

function picture(forest: Forest, formula: string, focus: number[] = [], pending?: number, done = false): SceneMap {
  const scene: SceneMap = {
    calc: { text: formula, o: 1, cls: done ? "v-eq" : "" },
  };
  for (const { value } of nodes) {
    const [x, y, size, parent] = forest[value];
    const tagged = value === pending;
    scene[`v${value}`] = {
      x, y, text: `${value}/${size}${tagged ? " ↺" : ""}`,
      cls: tagged ? "is-bad" : focus.includes(value) ? (done ? "is-good" : "is-active") : "",
    };
    scene[`e${value}`] = {
      ends: [`v${parent ?? (value === 8 ? 7 : 8)}`, `v${value}`],
      p: parent === undefined ? 0 : 1,
    };
  }
  return scene;
}

export const lesson: Lesson = {
  track: "cp",
  topic: "ds-adv",
  slug: "implicit-treap",
  title: { vi: "Treap ẩn: đảo đoạn", en: "Implicit treap: reversing ranges" },
  added: "2026-11-27",
  summary: {
    vi: "Dùng kích thước cây con để tách theo vị trí, rồi đánh dấu đảo cả đoạn bằng một cờ lazy.",
    en: "Use subtree sizes to split by position, then mark a whole interval for reversal with a lazy flag.",
  },
  level: "hard",
  minutes: 10,
  time: "O(log n) expected per reversal",
  memory: "O(n)",
  goal: { vi: "Đảo các vị trí <b>[1, 3]</b>, đánh số từ 0", en: "Reverse positions <b>[1, 3]</b>, indexed from 0" },
  codeLang: "C++17",
  code: [
    '<span class="kw">struct</span> Node { int val, sz = 1; uint64_t p; bool rev = false; Node *l = nullptr, *r = nullptr; };',
    'int sz(Node* t) { <span class="kw">return</span> t ? t-&gt;sz : 0; }',
    'void pull(Node* t) { t-&gt;sz = 1 + sz(t-&gt;l) + sz(t-&gt;r); }',
    'void push(Node* t) {',
    '  <span class="kw">if</span> (!t-&gt;rev) <span class="kw">return</span>; swap(t-&gt;l, t-&gt;r);',
    '  <span class="kw">for</span> (Node* c : {t-&gt;l, t-&gt;r}) <span class="kw">if</span> (c) c-&gt;rev ^= 1;',
    '  t-&gt;rev = false;',
    '}',
    'pair&lt;Node*, Node*&gt; split(Node* t, int k) {',
    '  <span class="kw">if</span> (!t) <span class="kw">return</span> {nullptr, nullptr}; push(t);',
    '  int s = sz(t-&gt;l);',
    '  <span class="kw">if</span> (k &lt;= s) { <span class="kw">auto</span> [a,b] = split(t-&gt;l,k); t-&gt;l=b; pull(t); <span class="kw">return</span> {a,t}; }',
    '  <span class="kw">auto</span> [a,b] = split(t-&gt;r,k-s-1); t-&gt;r=a; pull(t); <span class="kw">return</span> {t,b};',
    '}',
    'Node* merge(Node* a, Node* b) {',
    '  <span class="kw">if</span> (!a || !b) <span class="kw">return</span> a ? a : b;',
    '  <span class="kw">if</span> (a-&gt;p &gt; b-&gt;p) { push(a); a-&gt;r=merge(a-&gt;r,b); pull(a); <span class="kw">return</span> a; }',
    '  push(b); b-&gt;l=merge(a,b-&gt;l); pull(b); <span class="kw">return</span> b;',
    '}',
    '<span class="kw">auto</span> [a, bc] = split(root, l);',
    '<span class="kw">auto</span> [b, c] = split(bc, r-l+1);',
    'b-&gt;rev ^= 1;',
    'root = merge(merge(a,b),c);',
  ],
  watch: [
    { key: "k", label: "k" },
    { key: "size", label: { vi: "kích thước vừa tính", en: "size just computed" } },
    { key: "pending", label: { vi: "nút có cờ đảo", en: "node with reversal flag" } },
    { key: "seq", label: { vi: "dãy kết quả", en: "result sequence" } },
  ],
  practice: [
    { src: "CSES 2073", name: "Substring Reversals", lv: "★★★", url: "https://cses.fi/problemset/task/2073" },
    { src: "CSES 2074", name: "Reversals and Sums", lv: "★★★", url: "https://cses.fi/problemset/task/2074" },
  ],
  sceneOptions: { unit: 47, view: [-210, -95, 420, 315] },
  legend: [
    { cls: "acc", label: { vi: "nút đang xét", en: "node in focus" } },
    { cls: "wa", label: { vi: "↺ còn nợ một lần đảo", en: "↺ one reversal pending" } },
    { cls: "ac", label: { vi: "nút trong đoạn đã đảo", en: "node in the reversed range" } },
  ],
  steps: [
    {
      title: { vi: "Đảo theo vị trí", en: "Reverse by position" }, kind: "problem",
      body: {
        vi: "Cho dãy 4, 8, 2, 7, 5. Ta cần đảo đoạn từ vị trí 1 đến 3, tức các số 8, 2, 7. Đổi chỗ từng cặp trên mảng có thể tốn O(n) cho mỗi đoạn dài.",
        en: "Start with 4, 8, 2, 7, 5. Reverse positions 1 through 3, which hold 8, 2, and 7. Swapping pairs in an array can take O(n) for each long interval.",
      },
      lines: [], watch: {}, verdict: "run", fit,
      scene: picture(original, "[4, (8, 2, 7), 5]", [8, 2, 7]),
    },
    {
      title: { vi: "Vị trí nằm trong cây", en: "Position comes from the tree" }, kind: "concept",
      body: {
        vi: "Đọc cây trái–gốc–phải để ra dãy. Mỗi ô ghi <code>giá trị/kích thước</code>, còn <code>p</code> ở dưới là độ ưu tiên ngẫu nhiên. Ở gốc 8, con trái có 1 nút nên 8 đứng ở vị trí 1 và cả cây có <code>1 + 1 + 3 = 5</code> nút.",
        en: "Read the tree in inorder to get the sequence. Each block shows <code>value/size</code>, with random priority <code>p</code> below. Root 8 has one node on its left, so its index is 1 and its subtree holds <code>1 + 1 + 3 = 5</code> nodes.",
      },
      lines: [1, 2, 3, 11], watch: { size: 5 }, verdict: "run", fit,
      scene: picture(original, "sz(8) = 1 + 1 + 3 = 5", [8, 4, 7]),
    },
    {
      title: { vi: "Tách một phần tử đầu", en: "Split off the first element" }, kind: "step",
      body: {
        vi: "Gọi <code>split(root, 1)</code> để lấy đúng một phần tử đầu. Gốc 8 có <code>s = 1</code>, nên <code>k ≤ s</code> đưa ta xuống trái để lấy 4. Kết quả là <code>a = [4]</code> và <code>bc = [8, 2, 7, 5]</code>.",
        en: "Call <code>split(root, 1)</code> to take exactly one element from the front. At root 8, <code>s = 1</code>, so <code>k ≤ s</code> sends us left to take 4. This gives <code>a = [4]</code> and <code>bc = [8, 2, 7, 5]</code>.",
      },
      lines: [9, 10, 11, 12, 13, 20], watch: { k: 1, size: 4 }, verdict: "run", fit,
      scene: picture(prefixSplit, "sz(8) = 1 + 0 + 3 = 4", [4, 8]),
    },
    {
      title: { vi: "Cô lập đoạn cần đảo", en: "Isolate the reversal range" }, kind: "step",
      body: {
        vi: "Tách <code>bc</code> sau <code>3 − 1 + 1 = 3</code> phần tử. Gốc 8 có nhánh trái rỗng nên cần <code>3 − 0 − 1 = 2</code> nút từ nhánh phải. Nút 7 mất con phải 5 nên còn <code>1 + 1 + 0 = 2</code> nút, tạo ra <code>b = [8, 2, 7]</code> và <code>c = [5]</code>.",
        en: "Split <code>bc</code> after <code>3 − 1 + 1 = 3</code> elements. Root 8 has an empty left subtree, so take <code>3 − 0 − 1 = 2</code> nodes from its right subtree. Node 7 loses its right child 5 and has <code>1 + 1 + 0 = 2</code> nodes left, giving <code>b = [8, 2, 7]</code> and <code>c = [5]</code>.",
      },
      lines: [11, 12, 13, 21], watch: { k: 3, size: 3 }, verdict: "run", fit,
      scene: picture(isolated, "sz(8) = 1 + 0 + 2 = 3", [8, 2, 7]),
    },
    {
      title: { vi: "Bật cờ ở gốc", en: "Toggle the root flag" }, kind: "step",
      body: {
        vi: "Bật <code>rev</code> ở gốc 8 của <code>b</code>. Các cạnh chưa đổi, nhưng dãy mà cây này đại diện đã là 7, 2, 8. Dùng XOR vì đảo cùng một đoạn hai lần sẽ triệt tiêu.",
        en: "Toggle <code>rev</code> at root 8 of <code>b</code>. The edges stay in place while the represented order becomes 7, 2, 8. XOR lets two reversals of the same subtree cancel.",
      },
      lines: [22], watch: { pending: 8 }, verdict: "run", fit,
      scene: picture(isolated, "rev(8): 0 ⊕ 1 = 1", [], 8),
    },
    {
      title: { vi: "Đẩy cờ xuống con", en: "Push the flag to children" }, kind: "step",
      body: {
        vi: "Khi <code>merge(a, b)</code> chọn 8 vì <code>90 &gt; 50</code>, nó gọi <code>push(8)</code>. Đổi hai con của 8 để cây gốc 7 sang trái, bật cờ ở 7, rồi xoá cờ ở 8. Chỉ hoán đổi hai nhánh và đổi cờ ở các con.",
        en: "When <code>merge(a, b)</code> picks 8 because <code>90 &gt; 50</code>, it calls <code>push(8)</code>. Swap 8's children to move the subtree at 7 to the left, toggle 7's flag, and clear 8's. Only the child pointers and flags change.",
      },
      lines: [4, 5, 6, 7, 18], watch: { pending: 7 }, verdict: "run", fit,
      scene: picture(pushed, "rev(8) = 0 · rev(7) = 1", [8], 7),
    },
    {
      title: { vi: "Gộp với phần đầu", en: "Attach the prefix" }, kind: "step",
      body: {
        vi: "Gộp <code>a</code> với <code>b</code> còn đi qua 7. <code>push(7)</code> đưa 2 sang phải và bật cờ ở 2. Nối 4 vào trái của 7, rồi cập nhật kích thước của 7 thành 3 và của 8 thành <code>1 + 3 + 0 = 4</code>.",
        en: "Merging <code>a</code> with <code>b</code> also visits 7. <code>push(7)</code> moves 2 to the right and toggles its flag. Attach 4 left of 7, then update the sizes to 3 at 7 and <code>1 + 3 + 0 = 4</code> at 8.",
      },
      lines: [3, 5, 6, 7, 16, 18, 23], watch: { size: 4, pending: 2 }, verdict: "run", fit,
      scene: picture(leftJoined, "sz(7) = 1 + 1 + 1 = 3", [4, 7], 2),
    },
    {
      title: { vi: "Gộp đủ ba phần", en: "Join all three parts" }, kind: "answer",
      body: {
        vi: "Gộp thêm <code>c</code>: ưu tiên 90 lớn hơn 40 nên giữ 8 làm gốc và nối 5 vào nhánh phải đang rỗng. Gốc có <code>1 + 3 + 1 = 5</code> nút. Dãy kết quả là 4, 7, 2, 8, 5.",
        en: "Merge in <code>c</code>: priority 90 beats 40, so keep 8 as root and attach 5 to its empty right branch. The root has <code>1 + 3 + 1 = 5</code> nodes. The resulting sequence is 4, 7, 2, 8, 5.",
      },
      lines: [3, 16, 17, 23], watch: { size: 5, pending: 2, seq: "[4, 7, 2, 8, 5]" }, verdict: "ac", fit,
      scene: picture(joined, "[4] + [7, 2, 8] + [5]", [7, 8], 2, true),
    },
    {
      title: { vi: "Chỉ thăm các đường biên", en: "Visit only the boundaries" }, kind: "recap",
      body: {
        vi: "Khi đọc kết quả, <code>push(2)</code> xoá cờ ở lá 2 và thứ tự vẫn là 4, 7, 2, 8, 5. Hai lần tách, hai lần gộp chỉ đi qua các đường biên, còn đánh dấu đảo tốn O(1). Mỗi lần đảo tốn O(log n) kỳ vọng với ưu tiên ngẫu nhiên, có thể tới O(n) khi cây lệch.",
        en: "While reading the result, <code>push(2)</code> clears the flag on leaf 2 and the order stays 4, 7, 2, 8, 5. Two splits and two merges visit boundary paths, and marking the reversal costs O(1). A reversal takes expected O(log n) with random priorities and can take O(n) on a skewed tree.",
      },
      lines: [5, 6, 7, 20, 21, 22, 23], watch: { seq: "[4, 7, 2, 8, 5]" }, verdict: "ac", fit,
      scene: picture(joined, "[4, 7, 2, 8, 5]", [7, 2, 8], undefined, true),
    },
  ],
};

export function setup(scene: any, shapes: any) {
  for (const { value, p } of nodes) {
    const [x, y, size] = original[value];
    scene.add(`v${value}`, {
      shape: shapes.block({ label: `${value}/${size}`, sub: `p=${p}`, w: 64, h: 33, depth: 4 }),
      x, y,
    });
  }
  for (const { value } of nodes) {
    scene.link(`e${value}`, { from: `v${value === 8 ? 7 : 8}`, to: `v${value}`, anchor: "center", bend: 0 });
  }
  scene.add("calc", { shape: shapes.pill(), x: 0, y: 8.15 });
}
