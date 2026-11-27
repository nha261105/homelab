# Lộ trình CP — Competitive Programming

File này là **danh sách việc** cho mảng CP: các cấp, các chương, các bài trong từng chương, theo thứ tự làm.
Làm lần lượt từ trên xuống. Bài nào xong thì đánh dấu ✅ và commit.

Lộ trình có 3 cấp, từ mới học tới mức thi VNOI / ICPC / Codeforces Div 1:

| Cấp | Mục tiêu | Chương | Số bài |
|---|---|---|---|
| **1. Nền tảng** | Đọc đề ra độ phức tạp; thành thạo các kỹ thuật trên mảng và thư viện STL | 01–09 | 27 |
| **2. Trung cấp** | Đồ thị, cây, DP kinh điển, truy vấn đoạn, toán và chuỗi cơ bản | 10–18 | 43 |
| **3. Nâng cao** | Segment tree nâng cao, offline, đồ thị và cây nâng cao, luồng, DP tối ưu, chuỗi, hình học | 19–28 | 49 |
|   | **Tổng** | **28 chương** | **119** |

## Cách dùng

- **Trạng thái:** ✅ xong · 🚧 đang làm · ⬜ chưa làm
- **Một bài = một commit** (`lesson(cp): <slug> — <tên bài>`), để lịch sử commit cho thấy tiến độ.
- **Tiêu đề chương** có dạng `### NN. Tên tiếng Việt · English name · key \`key\` · Đợt N`.
  Site đọc thẳng file này để dựng cây thư mục CP, nên **giữ đúng định dạng tiêu đề và bảng**.
- **Đường dẫn bài:** `src/lessons/cp/{key chương}/{slug}.ts` → URL `/vi/cp/{key chương}/{slug}`.
  Key chương không đổi kể cả khi đánh số lại chương, nên URL cũ vẫn giữ được.
- Mọi bài trong file này tự hiện trong cây thư mục; bài chưa có file `.ts` hiện "Sắp có".
- Cột **Sơ đồ** ghi ví dụ cụ thể sẽ dựng thành animation. Cột **Luyện tập** là 2–3 bài thật, xếp từ dễ đến khó.
- Có thể làm xen kẽ giữa các chương cùng cấp, nhưng **đừng nhảy cấp**: bài ở cấp sau dùng kiến thức của cấp trước.

## Checklist cho mỗi bài

1. Chốt **một ý tưởng** và **một ví dụ có số thật** (như `[1,3,4,6,8,11,15]`, target 14).
2. Viết các bước trên giấy: 5–9 bước, mỗi bước là một thay đổi người học cần thấy.
3. Tạo file bài, dựng scene trong `setup()`, viết `steps` (VI + EN), code C++, bảng biến, bài luyện.
4. `npm run build` không lỗi. Bấm qua lại mọi bước, đổi VI/EN, sáng/tối, thu về 400px.
5. Đánh dấu ✅ trong file này, commit, push.

## Thứ tự làm (theo đợt)

| Đợt | Nội dung | Chương |
|---|---|---|
| 1 | Độ phức tạp + kỹ thuật trên mảng | 01, 04, 05, 06, 07 |
| 2 | Phần còn lại của Cấp 1 | 02, 03, 08, 09 |
| 3 | Đồ thị và cây | 10, 11, 12, 13 |
| 4 | DP, truy vấn đoạn, toán, chuỗi, bitmask | 14–18 |
| 5 | Cấu trúc dữ liệu nâng cao | 19, 20, 28 |
| 6 | Đồ thị, luồng, cây nâng cao | 21, 22, 23 |
| 7 | DP, toán, chuỗi nâng cao, hình học | 24–27 |

---

# Cấp 1 — Nền tảng

### 01. Độ phức tạp & Big-O · Complexity & Big-O · key `complexity` · Đợt 1

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `big-o` | Đếm bước, không đếm giây | Count steps, not seconds | 4 cột khối O(1), O(log n), O(n), O(n²); tăng n = 2 → 4 → 8, cột O(n²) vọt lên | CSES 1068 Weird Algorithm · CSES 1083 Missing Number | ✅ |
| 2 | `time-limit` | Từ n ra thuật toán | From n to the algorithm | Bảng n = 10, 20, 10³, 10⁵, 10⁶, 10⁹ → thuật toán chạy kịp khoảng 10⁸ phép/giây | CSES 1094 Increasing Array · CSES 1069 Repetitions | ✅ |

### 02. Đệ quy & quay lui · Recursion & Backtracking · key `recursion` · Đợt 2

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `call-tree` | Cây lời gọi đệ quy | The recursion tree | Cây gọi `fib(5)`, các nhánh trùng nhau sáng lên → lý do cần nhớ kết quả | LeetCode 509 · CSES 1622 Creating Strings | ✅ |
| 2 | `subsets` | Sinh tập con | Generating subsets | Cây chọn / không chọn cho `{1,2,3}`, mỗi lá là một tập con | LeetCode 78 · CSES 1623 Apple Division | ✅ |
| 3 | `n-queens` | Quay lui: đặt hậu | Backtracking: N-Queens | Bàn 4×4, đặt hậu từng hàng, xung đột thì lùi lại | LeetCode 51 · CSES 1624 Chessboard and Queens | ✅ |

### 03. Sắp xếp & tham lam · Sorting & Greedy · key `sorting` · Đợt 2

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `merge-sort` | Merge sort | Merge sort | Mảng 8 phần tử chia đôi xuống tận 1, rồi trộn lên từng tầng | LeetCode 912 · CSES 1621 Distinct Numbers | ✅ |
| 2 | `custom-order` | Sắp theo tiêu chí riêng | Sorting by your own rule | Các đoạn phim sắp theo giờ kết thúc → tham lam chọn được nhiều phim nhất | CSES 1629 Movie Festival · LeetCode 179 | ✅ |
| 3 | `sweep-events` | Quét sự kiện | Sweeping events | Khách vào/ra thành các điểm +1/−1 trên trục thời gian | CSES 1619 Restaurant Customers · CSES 1074 Stick Lengths | ✅ |
| 4 | `exchange-argument` | Chứng minh tham lam bằng hoán đổi | Exchange arguments | Hai việc kề nhau: đổi chỗ không làm tệ hơn → thứ tự tối ưu | CSES 1630 Tasks and Deadlines · CSES 1073 Towers | ✅ |

### 04. Prefix Sum · Prefix Sums · key `prefix-sum` · Đợt 1

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `range-sum` | Tổng đoạn trong O(1) | Range sums in O(1) | Mảng `a` và hàng `pre` bên dưới; tổng `[l, r] = pre[r+1] − pre[l]` | CSES 1646 Static Range Sum Queries · LeetCode 303 | ✅ |
| 2 | `prefix-2d` | Prefix sum 2 chiều | 2D prefix sums | Lưới 4×4, hình chữ nhật = lớn − trên − trái + góc | CSES 1652 Forest Queries · LeetCode 304 | ✅ |
| 3 | `difference-array` | Mảng hiệu | Difference arrays | Cộng `+x` cho cả đoạn chỉ bằng 2 ô, rồi cộng dồn ra kết quả | LeetCode 1094 Car Pooling · CSES 1651 Range Update Queries | ✅ |

### 05. Two Pointers · Two Pointers · key `two-pointers` · Đợt 1

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `pair-sum` | Tìm cặp có tổng bằng target | Pair with a target sum | `[1,3,4,6,8,11,15]`, target 14, hai con trỏ tiến về nhau | CSES 1640 · LeetCode 167 · CF 279B | ✅ |
| 2 | `remove-dupes` | Xoá phần tử trùng tại chỗ | Remove duplicates in place | Con trỏ đọc `i` chạy trước, con trỏ ghi `k` chỉ tiến khi gặp số mới | LeetCode 26 · CSES 1090 Ferris Wheel | ✅ |
| 3 | `three-sum` | Ba số có tổng cho trước | Three numbers with a given sum | Cố định `i`, chạy Two Pointers trên phần còn lại | LeetCode 15 · CSES 1641 Sum of Three Values · CSES 1642 | ✅ |

### 06. Sliding Window · Sliding Window · key `sliding-window` · Đợt 1

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `fixed-window` | Cửa sổ độ dài k | Fixed-size window | Khung dài k trượt sang phải: +phần tử vào, −phần tử ra | LeetCode 643 · CSES 1643 Maximum Subarray Sum | ✅ |
| 2 | `longest-unique` | Chuỗi con dài nhất không lặp | Longest substring without repeats | `"abcabcbb"`: mở rộng bên phải, gặp ký tự trùng thì co bên trái | LeetCode 3 · CSES 1141 Playlist | ✅ |
| 3 | `min-window-sum` | Đoạn ngắn nhất có tổng ≥ S | Shortest window with sum ≥ S | Khung co giãn, ghi lại độ dài nhỏ nhất mỗi lần tổng đủ | LeetCode 209 · CSES 1660 Subarray Sums I | ✅ |

### 07. Binary Search · Binary Search · key `binary-search` · Đợt 1

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `lower-bound` | lower_bound từng bước | lower_bound step by step | Khung `[lo, hi)` co một nửa mỗi bước, tới vị trí đầu tiên ≥ x | LeetCode 704 · LeetCode 35 | ✅ |
| 2 | `answer-search` | Chặt nhị phân đáp án | Binary search on the answer | Trục thời gian t; hàm "làm kịp không?" sai…sai đúng…đúng, tìm điểm đổi | CSES 1620 Factory Machines · LeetCode 875 · CSES 1085 Array Division | ✅ |

### 08. Stack, Queue & Deque · Stack, Queue & Deque · key `stack-queue` · Đợt 2

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `brackets` | Kiểm tra ngoặc bằng stack | Matching brackets with a stack | `"([]{})"`: mở thì đẩy vào chồng, đóng thì so với đỉnh | LeetCode 20 | ✅ |
| 2 | `monotonic-stack` | Stack đơn điệu | Monotonic stack | Phần tử nhỏ hơn gần nhất bên trái: số mới đẩy bật các số lớn hơn ra | CSES 1645 Nearest Smaller Values · LeetCode 739 · LeetCode 84 | ✅ |
| 3 | `monotonic-deque` | Max trong cửa sổ trượt | Sliding window maximum | Deque giữ chỉ số giảm dần; đầu deque là max của khung | LeetCode 239 · CSES 1644 Maximum Subarray Sum II | ✅ |

### 09. Hashing & STL · Hashing & STL · key `hashing` · Đợt 2

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `seen-before` | Đã gặp chưa? (set / map) | Seen it before? (set / map) | Two Sum không cần sắp xếp: mỗi số hỏi "phần bù đã có chưa" | LeetCode 1 · CSES 1621 Distinct Numbers | ✅ |
| 2 | `subarray-sum-k` | Đếm đoạn con có tổng k | Counting subarrays with sum k | Prefix sum + map đếm số lần gặp `pre − k` | LeetCode 560 · CSES 1661 Subarray Sums II | ✅ |
| 3 | `multiset` | multiset: lấy và xoá phần tử gần nhất | multiset: take the closest | Vé giá ≤ x: `upper_bound` rồi lùi một bước, xoá vé đã bán | CSES 1091 Concert Tickets · CSES 1164 Room Allocation | ✅ |
| 4 | `priority-queue` | Hàng đợi ưu tiên | Priority queues | Heap nhị phân: thêm thì nổi lên, lấy đỉnh thì chìm xuống | LeetCode 215 · CSES 1076 Sliding Median | ✅ |

# Cấp 2 — Trung cấp

### 10. Đồ thị: BFS / DFS · Graphs: BFS / DFS · key `graphs` · Đợt 3

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `graph-basics` | Biểu diễn đồ thị | Representing a graph | Cùng đồ thị 5 đỉnh vẽ ra danh sách kề và ma trận kề | CSES 1666 Building Roads | ✅ |
| 2 | `bfs-grid` | BFS trên lưới | BFS on a grid | Lưới có tường, sóng BFS lan theo từng lớp khoảng cách | CSES 1193 Labyrinth · LeetCode 994 | ✅ |
| 3 | `dfs-components` | Đếm thành phần liên thông | Counting components | DFS tô màu từng vùng | CSES 1192 Counting Rooms · LeetCode 200 | ✅ |
| 4 | `bipartite` | Đồ thị hai phía | Bipartite check | Tô xen kẽ hai màu; cạnh nối hai đỉnh cùng màu thì thất bại | CSES 1668 Building Teams · LeetCode 785 | ✅ |
| 5 | `cycle-detect` | Tìm chu trình | Finding a cycle | DFS ba màu trắng/xám/đen; gặp đỉnh xám là có chu trình | CSES 1669 Round Trip · CSES 1678 Round Trip II | ✅ |
| 6 | `topo-sort` | Sắp xếp tô-pô | Topological sort | Đồ thị môn học: lấy dần các đỉnh có bậc vào = 0 (Kahn) | CSES 1679 Course Schedule · LeetCode 207 | ✅ |

### 11. Đường đi ngắn nhất · Shortest Paths · key `shortest-path` · Đợt 3

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `bfs-shortest` | Đường ngắn nhất không trọng số | Unweighted shortest paths | BFS kèm mảng `parent`, lần ngược ra đường đi | CSES 1667 Message Route | ✅ |
| 2 | `dijkstra` | Dijkstra | Dijkstra | Hàng đợi ưu tiên; mỗi bước chốt đỉnh gần nhất rồi nới lỏng cạnh | CSES 1671 Shortest Routes I · LeetCode 743 | ✅ |
| 3 | `zero-one-bfs` | BFS 0-1 | 0-1 BFS | Cạnh nặng 0 đẩy vào đầu deque, cạnh nặng 1 đẩy vào cuối | CF 1063B Labyrinth | ✅ |
| 4 | `bellman-ford` | Bellman-Ford & chu trình âm | Bellman-Ford and negative cycles | n−1 lượt nới lỏng; lượt thứ n còn giảm được là có chu trình âm | CSES 1673 High Score · CSES 1197 Cycle Finding | ✅ |
| 5 | `floyd` | Floyd–Warshall | Floyd–Warshall | Ma trận khoảng cách, lần lượt cho đi qua từng đỉnh trung gian k | CSES 1672 Shortest Routes II | ✅ |
| 6 | `state-graph` | Đồ thị trạng thái | Graphs of states | Đỉnh = (thành phố, đã dùng phiếu giảm giá chưa) | CSES 1195 Flight Discount | ✅ |

### 12. DSU & cây khung nhỏ nhất · DSU & Minimum Spanning Trees · key `dsu-mst` · Đợt 3

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `union-find` | Disjoint Set Union | Union-Find | Các rừng nhỏ hợp lại; nén đường đi làm cây phẳng ra | CSES 1676 Road Construction · LeetCode 547 | ✅ |
| 2 | `kruskal` | Kruskal | Kruskal's MST | Sắp cạnh theo trọng số, lấy cạnh nếu không tạo chu trình | CSES 1675 Road Reparation · LeetCode 1584 | ✅ |
| 3 | `prim` | Prim | Prim's MST | Cây lớn dần từ một đỉnh, luôn lấy cạnh rẻ nhất đi ra ngoài | CSES 1675 (làm lại bằng Prim) | ✅ |

### 13. Cây · Trees · key `trees` · Đợt 3

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `subtree-size` | DFS trên cây: kích thước cây con | Tree DFS: subtree sizes | Giá trị dồn từ lá lên gốc | CSES 1674 Subordinates | ✅ |
| 2 | `diameter` | Đường kính cây | Tree diameter | Hai lần DFS: từ đỉnh bất kỳ ra đỉnh xa nhất, rồi đi tiếp từ đó | CSES 1131 Tree Diameter · LeetCode 543 | ✅ |
| 3 | `binary-lifting` | Nhảy nhị phân | Binary lifting | Bảng `up[k][v]` = tổ tiên thứ 2^k; nhảy theo các bit của k | CSES 1687 Company Queries I | ✅ |
| 4 | `lca` | Tổ tiên chung gần nhất | Lowest common ancestor | Đưa hai đỉnh về cùng độ sâu rồi nhảy cùng nhau | CSES 1688 Company Queries II · CSES 1135 Distance Queries | ✅ |
| 5 | `euler-tour` | Euler tour: cây thành mảng | Euler tour: a tree as an array | Thời điểm vào/ra của DFS; cây con thành một đoạn liên tục | CSES 1137 Subtree Queries · CSES 1138 Path Queries | ✅ |

### 14. Quy hoạch động · Dynamic Programming · key `dp` · Đợt 4

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `stairs` | Leo cầu thang | Climbing stairs | Từ cây đệ quy (chương 02) sang bảng `dp` một chiều | LeetCode 70 · CSES 1633 Dice Combinations | ✅ |
| 2 | `coin-change` | Đổi tiền | Coin change | Bảng `dp[x]`: ít đồng nhất, rồi đếm số cách | CSES 1634 Minimizing Coins · CSES 1635 · CSES 1636 | ✅ |
| 3 | `grid-paths` | Đếm đường đi trên lưới | Counting grid paths | Mỗi ô = trên + trái, ô có vật cản bằng 0 | LeetCode 62 · CSES 1638 Grid Paths | ✅ |
| 4 | `knapsack` | Cái túi 0/1 | 0/1 knapsack | Bảng vật × sức chứa; chọn hoặc bỏ từng vật | CSES 1158 Book Shop · LeetCode 416 · CSES 1745 Money Sums | ✅ |
| 5 | `lis` | Dãy con tăng dài nhất | Longest increasing subsequence | O(n²) trước, rồi O(n log n) với mảng "đuôi" + lower_bound | LeetCode 300 · CSES 1145 Increasing Subsequence | ✅ |
| 6 | `edit-distance` | LCS & khoảng cách chỉnh sửa | LCS and edit distance | Bảng 2 chiều giữa hai chuỗi: thêm, xoá, thay | LeetCode 1143 · LeetCode 72 · CSES 1639 Edit Distance | ✅ |
| 7 | `dag-dp` | DP trên DAG | DP on a DAG | Thứ tự tô-pô; đường dài nhất / số đường đi | CSES 1680 Longest Flight Route · CSES 1681 Game Routes | ✅ |

### 15. Truy vấn trên đoạn · Range Queries · key `range-queries` · Đợt 4

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `sparse-table` | Sparse table | Sparse table | Các tầng đoạn dài 1, 2, 4, 8; min đoạn = hai khối chồng lên nhau | CSES 1647 Static Range Minimum Queries | ✅ |
| 2 | `fenwick` | Cây Fenwick (BIT) | Fenwick tree | Mỗi ô phụ trách một đoạn theo bit thấp nhất; cập nhật và hỏi theo `i & −i` | CSES 1648 Dynamic Range Sum Queries · LeetCode 307 | ✅ |
| 3 | `segment-tree` | Segment tree | Segment tree | Cây nhị phân trên mảng 8 ô; truy vấn chỉ đi qua O(log n) nút | CSES 1649 Dynamic Range Minimum Queries · CSES 1650 Range Xor Queries | ✅ |
| 4 | `fenwick-2d` | Fenwick 2 chiều | 2D Fenwick tree | Lưới Fenwick: cập nhật một ô, hỏi tổng hình chữ nhật | CSES 1739 Forest Queries II | ✅ |

### 16. Toán · Math · key `math` · Đợt 4

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `gcd` | Euclid & Euclid mở rộng | Euclid and extended Euclid | Hình chữ nhật 48×18 cắt dần thành hình vuông; truy ngược ra `ax + by = g` | CSES 1081 Common Divisors | ✅ |
| 2 | `sieve` | Sàng nguyên tố | Sieve of Eratosthenes | Lưới 1..50, gạch bội của 2, 3, 5, 7 | LeetCode 204 · CSES 1713 Counting Divisors | ✅ |
| 3 | `mod-pow` | Luỹ thừa nhanh & modulo | Fast power and modulo | `3^13` theo các bit của 13 = 1101₂ | CSES 1095 Exponentiation · CSES 1617 Bit Strings | ✅ |
| 4 | `mod-inverse` | Nghịch đảo modulo | Modular inverse | Fermat: `a^(p−2) mod p`; chia trong modulo | CSES 1712 Exponentiation II | ✅ |
| 5 | `binomial` | Tổ hợp C(n, k) mod p | Binomials mod p | Giai thừa và nghịch đảo tính sẵn | CSES 1079 Binomial Coefficients · CSES 1715 Creating Strings II | ✅ |

### 17. Chuỗi · Strings · key `strings` · Đợt 4

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `string-hash` | Hash chuỗi | Polynomial string hashing | Hash tiền tố; so hai đoạn bằng một phép trừ | CSES 1753 String Matching | ✅ |
| 2 | `kmp` | KMP | KMP string matching | Bảng prefix-function; khi lệch thì nhảy, không lùi con trỏ văn bản | CSES 1753 · CSES 1732 Finding Borders · LeetCode 28 | ✅ |
| 3 | `z-function` | Z-function | Z-function | Hộp `[l, r]` tái dùng kết quả đã tính | CSES 1733 Finding Periods | ✅ |
| 4 | `trie` | Trie | Trie | Cây chữ cái cho một tập từ; đi theo từng ký tự | CSES 1731 Word Combinations · LeetCode 208 | ✅ |

### 18. Bitmask · Bitmasks · key `bitmask` · Đợt 4

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `bit-tricks` | Thao tác bit cơ bản | Bit tricks | Hàng 8 bit: bật, tắt, kiểm tra bit; XOR triệt tiêu từng cặp | LeetCode 136 · LeetCode 191 | ✅ |
| 2 | `subset-masks` | Duyệt tập con bằng mask | Subsets as bitmasks | 0..2ⁿ−1, mỗi số là một tập con (nối lại chương 02) | CSES 1623 Apple Division · LeetCode 78 | ✅ |
| 3 | `meet-in-middle` | Meet in the middle | Meet in the middle | Chia đôi tập, liệt kê 2^(n/2) tổng mỗi bên rồi ghép bằng sắp xếp | CSES 1628 Meet in the Middle | ✅ |

# Cấp 3 — Nâng cao

### 19. Segment tree nâng cao · Advanced Segment Trees · key `segtree-adv` · Đợt 5

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `lazy-propagation` | Lazy propagation | Lazy propagation | Cập nhật cả đoạn: gắn "nợ" ở nút, chỉ đẩy xuống khi cần đi qua | CSES 1735 Range Updates and Sums · CSES 1736 Polynomial Queries | ✅ |
| 2 | `segtree-merge` | Nút lưu nhiều thông tin | Nodes that store more | Nút giữ (tổng, max tiền tố, max hậu tố, max đoạn con) và cách gộp hai nút | CSES 1190 Subarray Sum Queries · CSES 2166 Prefix Sum Queries | ✅ |
| 3 | `segtree-descend` | Đi xuống trên segment tree | Walking down the tree | Tìm vị trí đầu tiên ≥ x bằng cách rẽ trái/phải tại mỗi nút | CSES 1143 Hotel Queries | ✅ |
| 4 | `coordinate-compress` | Nén toạ độ | Coordinate compression | Giá trị đến 10⁹ ánh xạ về chỉ số 0..n−1 để dựng cây | CSES 1144 Salary Queries | ✅ |
| 5 | `persistent-segtree` | Segment tree bền vững | Persistent segment tree | Mỗi lần cập nhật chỉ tạo mới O(log n) nút, các phiên bản dùng chung phần còn lại | CSES 1737 Range Queries and Copies · SPOJ MKTHNUM | ✅ |

### 20. Chia căn & xử lý offline · Square Root & Offline Tricks · key `offline` · Đợt 5

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `sqrt-decomposition` | Chia căn | Square-root decomposition | Mảng chia thành √n khối, mỗi khối giữ sẵn tổng của nó | CF 13E Holes | ✅ |
| 2 | `offline-queries` | Sắp truy vấn để trả lời offline | Answering queries offline | Sắp truy vấn theo đầu phải, quét mảng một lần với Fenwick | CSES 1734 Distinct Values Queries | ✅ |
| 3 | `mo-algorithm` | Thuật toán Mo | Mo's algorithm | Truy vấn sắp theo (khối của l, r); hai con trỏ trượt qua lại | SPOJ DQUERY · CSES 1734 | ✅ |

### 21. Đồ thị nâng cao · Advanced Graphs · key `graphs-adv` · Đợt 6

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `scc` | Thành phần liên thông mạnh | Strongly connected components | Kosaraju: DFS lấy thứ tự thoát, rồi DFS trên đồ thị đảo | CSES 1682 Flight Routes Check · CSES 1683 Planets and Kingdoms | ✅ |
| 2 | `condensation` | Đồ thị nén + DP | Condensation graph + DP | Mỗi SCC thành một đỉnh của DAG, rồi DP trên DAG | CSES 1686 Coin Collector | ✅ |
| 3 | `two-sat` | 2-SAT | 2-SAT | Mỗi mệnh đề a ∨ b thành hai cạnh suy ra; x và ¬x cùng SCC là vô nghiệm | CSES 1684 Giant Pizza | ✅ |
| 4 | `bridges` | Cầu & khớp | Bridges and articulation points | `tin` / `low` trong DFS; cạnh có `low[con] > tin[cha]` là cầu | CSES 2076 Necessary Roads · CSES 2077 Necessary Cities | ✅ |
| 5 | `euler-path` | Đường đi Euler | Eulerian paths | Thuật toán Hierholzer: đi hết cạnh, gặp ngõ cụt thì ghi vào đáp án | CSES 1691 Mail Delivery · CSES 1693 Teleporters Path | ✅ |
| 6 | `functional-graph` | Đồ thị hàm | Functional graphs | Mỗi đỉnh đúng một cạnh ra: đuôi dẫn vào chu trình; nhảy nhị phân k bước | CSES 1750 Planets Queries I · CSES 1751 Planets Cycles | ✅ |

### 22. Luồng & ghép cặp · Flows & Matching · key `flows` · Đợt 6

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `max-flow` | Luồng cực đại (Dinic) | Maximum flow (Dinic) | Đồ thị phân tầng bằng BFS, đẩy luồng chặn bằng DFS, cạnh ngược để hoàn tác | CSES 1694 Download Speed | ✅ |
| 2 | `min-cut` | Lát cắt nhỏ nhất | Minimum cut | Sau khi hết luồng: các đỉnh còn tới được từ nguồn tạo thành một phía của lát cắt | CSES 1695 Police Chase | ✅ |
| 3 | `bipartite-matching` | Ghép cặp hai phía | Bipartite matching | Đường tăng luồng xen kẽ; hoặc dựng luồng với nguồn và đích | CSES 1696 School Dance · CSES 1711 Distinct Routes | ✅ |

### 23. Cây nâng cao · Advanced Trees · key `trees-adv` · Đợt 6

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `tree-dp` | DP trên cây | Tree DP | Mỗi đỉnh hai trạng thái: lấy / không lấy cạnh tới con | CSES 1130 Tree Matching · CSES 1132 Tree Distances I | ✅ |
| 2 | `rerooting` | Đổi gốc | Rerooting | Tính cho một gốc, rồi dời gốc sang con và sửa đáp án trong O(1) | CSES 1133 Tree Distances II | ✅ |
| 3 | `small-to-large` | Gộp nhỏ vào lớn | Small-to-large merging | Mỗi đỉnh giữ một set; luôn đổ set nhỏ vào set lớn | CSES 1139 Distinct Colors | ⬜ |
| 4 | `hld` | Heavy-light decomposition | Heavy-light decomposition | Cây tách thành các chuỗi nặng; đường đi qua O(log n) chuỗi | CSES 2134 Path Queries II | ⬜ |
| 5 | `centroid` | Phân rã trọng tâm | Centroid decomposition | Tìm trọng tâm, cắt ra, đệ quy; mỗi đường đi qua trọng tâm của một tầng | CSES 2079 Finding a Centroid · CSES 2080 Fixed-Length Paths I | ⬜ |

### 24. Quy hoạch động nâng cao · Advanced DP · key `dp-adv` · Đợt 7

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `interval-dp` | DP khoảng | Interval DP | `dp[l][r]` điền theo độ dài đoạn tăng dần | CSES 1097 Removal Game · CSES 1744 Rectangle Cutting | ⬜ |
| 2 | `digit-dp` | DP chữ số | Digit DP | Đi từng chữ số với cờ "còn bám sát cận trên" | CSES 2220 Counting Numbers | ⬜ |
| 3 | `bitmask-dp` | DP trên bitmask | Bitmask DP | `dp[mask]` = cách tốt nhất cho tập người đã lên thang máy | CSES 1653 Elevator Rides | ⬜ |
| 4 | `profile-dp` | DP theo profile (lát gạch) | Broken-profile DP | Lấp lưới từng cột; mask là hình dạng mép cột hiện tại | CSES 2181 Counting Tilings | ⬜ |
| 5 | `sos-dp` | Tổng trên tập con (SOS) | Sum over subsets | Với mỗi bit, cộng giá trị từ mask không có bit đó | CSES 1654 Bit Problem | ⬜ |
| 6 | `expected-value` | Xác suất & kỳ vọng | Probability and expectation | Phân phối tổng sau từng lần tung xúc xắc | CSES 1725 Dice Probability · CSES 1727 Candy Lottery | ⬜ |
| 7 | `convex-hull-trick` | Convex hull trick | Convex hull trick | Mỗi trạng thái là một đường thẳng; giữ bao lồi dưới để hỏi min | CSES 2084 Monster Game I | ⬜ |
| 8 | `dc-optimization` | Tối ưu chia để trị | Divide & conquer optimization | Điểm chia tối ưu đơn điệu → giải tầng DP bằng chia để trị | CSES 2086 Subarray Squares | ⬜ |

### 25. Toán nâng cao · Advanced Math · key `math-adv` · Đợt 7

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `inclusion-exclusion` | Bao hàm – loại trừ | Inclusion–exclusion | Biểu đồ Venn 3 tập: cộng đơn, trừ đôi, cộng ba | CSES 2185 Prime Multiples · CSES 2417 Counting Coprime Pairs | ⬜ |
| 2 | `catalan` | Số Catalan | Catalan numbers | Dãy ngoặc đúng ↔ đường đi không vượt đường chéo | CSES 2064 Bracket Sequences I | ⬜ |
| 3 | `matrix-power` | Luỹ thừa ma trận | Matrix exponentiation | Fibonacci thành nhân ma trận 2×2, luỹ thừa nhanh như số | CSES 1722 Fibonacci Numbers · CSES 1096 Throwing Dice | ⬜ |
| 4 | `game-theory` | Lý thuyết trò chơi: Nim & Grundy | Game theory: Nim and Grundy | Trạng thái thắng/thua; XOR các đống; số Grundy là mex | CSES 1730 Nim Game I · CSES 1729 Stick Game | ⬜ |
| 5 | `crt` | Định lý số dư Trung Hoa | Chinese remainder theorem | Gộp hai phương trình đồng dư bằng Euclid mở rộng | Kattis generalchineseremainder | ⬜ |
| 6 | `fft` | FFT: nhân đa thức | FFT polynomial multiplication | Hệ số ↔ giá trị tại căn đơn vị; nhân từng điểm rồi biến đổi ngược | SPOJ POLYMUL | ⬜ |

### 26. Chuỗi nâng cao · Advanced Strings · key `strings-adv` · Đợt 7

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `manacher` | Manacher: xâu đối xứng | Manacher's palindromes | Chèn ký tự đệm; tái dùng bán kính trong hộp đối xứng | CSES 1111 Longest Palindrome · LeetCode 5 | ⬜ |
| 2 | `aho-corasick` | Aho-Corasick | Aho-Corasick | Trie + liên kết thất bại; đọc văn bản một lượt khớp mọi mẫu | CSES 2102 Finding Patterns · CSES 2103 Counting Patterns | ⬜ |
| 3 | `suffix-array` | Mảng hậu tố | Suffix array | Sắp các hậu tố bằng cách nhân đôi độ dài; mảng LCP | CSES 2105 Distinct Substrings · CSES 2106 Repeating Substring | ⬜ |
| 4 | `min-rotation` | Xoay vòng nhỏ nhất | Minimal rotation | So hai ứng viên, loại cả khối khi một bên thua | CSES 1110 Minimal Rotation | ⬜ |

### 27. Hình học · Geometry · key `geometry` · Đợt 7

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `cross-product` | Tích có hướng & hướng rẽ | Cross product and orientation | Ba điểm: rẽ trái, rẽ phải hay thẳng hàng theo dấu tích có hướng | CSES 2189 Point Location Test | ⬜ |
| 2 | `segment-intersection` | Hai đoạn thẳng có cắt nhau? | Do two segments intersect? | Hai phép kiểm tra hướng, cộng trường hợp thẳng hàng | CSES 2190 Line Segment Intersection | ⬜ |
| 3 | `polygon-area` | Diện tích đa giác & điểm trong đa giác | Polygon area and point in polygon | Công thức shoelace; tia bắn ra đếm số lần cắt cạnh | CSES 2191 Polygon Area · CSES 2192 Point in Polygon · CSES 2193 | ⬜ |
| 4 | `convex-hull` | Bao lồi | Convex hull | Monotone chain: quét điểm đã sắp, bỏ điểm làm rẽ sai chiều | CSES 2195 Convex Hull | ⬜ |
| 5 | `closest-pair` | Cặp điểm gần nhất | Closest pair of points | Quét theo x, giữ dải rộng d quanh đường quét | CSES 2194 Minimum Euclidean Distance | ⬜ |

### 28. Cấu trúc dữ liệu nâng cao · Advanced Data Structures · key `ds-adv` · Đợt 5

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `ordered-set` | Ordered set (PBDS) | Order-statistics tree | Hỏi "phần tử thứ k" và "có bao nhiêu số < x" trong O(log n) | CSES 1076 Sliding Median · CSES 1144 Salary Queries | ✅ |
| 2 | `dsu-rollback` | DSU có hoàn tác | DSU with rollback | Bỏ nén đường đi, lưu thay đổi vào stack để quay lui | CSES 2133 Dynamic Connectivity | ✅ |
| 3 | `treap` | Treap | Treap | Cây vừa là BST theo khoá vừa là heap theo độ ưu tiên ngẫu nhiên; tách và gộp | CSES 2072 Cut and Paste | ✅ |
| 4 | `implicit-treap` | Treap ẩn: đảo đoạn | Implicit treap: reversing ranges | Khoá là vị trí; cờ lazy "đảo" đẩy xuống khi đi qua | CSES 2073 Substring Reversals · CSES 2074 Reversals and Sums | ✅ |

---

## Ghi chú

- Cây thư mục CP trên site được dựng từ chính file này (`src/lib/roadmap.ts`), đánh số chương 01–28 như ở đây.
- Muốn đổi thứ tự, thêm hoặc bỏ bài thì sửa file này trước, rồi mới sửa code.
- Ngoài lộ trình này, sau này có thể thêm chương **Kỹ năng thi đấu**: debug, stress test, đọc đề, quản lý thời gian.
