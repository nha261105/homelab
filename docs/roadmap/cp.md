# Lộ trình CP — Competitive Programming

File này là **danh sách việc** cho mảng CP: các chương, các bài trong từng chương, thứ tự làm.
Làm lần lượt từ trên xuống, mỗi bài xong thì đánh dấu và commit.

## Cách dùng

- **Trạng thái:** ✅ xong · 🚧 đang làm · ⬜ chưa làm
- **Một bài = một commit** (`lesson(cp): <slug> — <tên bài>`), để lịch sử commit cho thấy tiến độ.
- **Đường dẫn bài:** `src/lessons/cp/{chương}/{slug}.ts` → URL `/vi/cp/{chương}/{slug}`.
  `{chương}` là cột *key* của chương, `{slug}` là cột *slug* của bài.
- Khi bắt đầu một chương mới, thêm chương và các bài của nó vào `src/lib/catalog.ts`.
  Bài chưa có file sẽ hiện "Sắp có" trong cây thư mục.
- Cột **Sơ đồ** ghi ví dụ cụ thể sẽ dựng thành animation. Cột **Luyện tập** là 2–3 bài thật, từ dễ đến khó.

## Checklist cho mỗi bài

1. Chốt **một ý tưởng** và **một ví dụ có số thật** (như `[1,3,4,6,8,11,15]`, target 14).
2. Viết các bước trên giấy: 5–9 bước, mỗi bước là một thay đổi người học cần thấy.
3. Tạo file bài, dựng scene trong `setup()`, viết `steps` (VI + EN), code C++, bảng biến, bài luyện.
4. `npm run build` không lỗi. Bấm qua lại mọi bước, đổi VI/EN, sáng/tối, thu về 400px.
5. Đánh dấu ✅ trong file này, commit, push.

## Thứ tự làm (theo đợt)

| Đợt | Nội dung | Số bài |
|---|---|---|
| 1 | Nền tảng + kỹ thuật trên mảng: chương 01, 04–07 | 13 |
| 2 | Sắp xếp, đệ quy, stack/queue, hashing: chương 02, 03, 08, 09 | 11 |
| 3 | Đồ thị và cây: chương 10–13 | 11 |
| 4 | Quy hoạch động: chương 14 | 6 |
| 5 | Truy vấn đoạn, toán, chuỗi, bitmask: chương 15–18 | 12 |
|   | **Tổng** | **53** |

---

## Phần A — Nền tảng

### 01. Độ phức tạp & Big-O · key `complexity` · Đợt 1

Mục tiêu: nhìn giới hạn `n` là biết cần thuật toán cỡ nào, trước khi code.

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `big-o` | Đếm bước, không đếm giây | Count steps, not seconds | 4 cột khối O(1), O(log n), O(n), O(n²); tăng n = 2 → 4 → 8, cột O(n²) vọt lên | CSES 1068 Weird Algorithm · CSES 1083 Missing Number | ⬜ |
| 2 | `time-limit` | Từ n ra thuật toán | From n to the algorithm | Bảng n = 10, 20, 10³, 10⁵, 10⁶, 10⁹ → thuật toán chạy kịp ~10⁸ phép/giây | CSES 1094 Increasing Array · CSES 1069 Repetitions | ⬜ |

### 02. Đệ quy & quay lui · key `recursion` · Đợt 2

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `call-tree` | Cây lời gọi đệ quy | The recursion tree | Cây gọi `fib(5)`, các nhánh trùng nhau sáng lên → lý do cần nhớ kết quả | LeetCode 509 Fibonacci Number · CSES 1622 Creating Strings | ⬜ |
| 2 | `subsets` | Sinh tập con | Generating subsets | Cây chọn / không chọn cho `{1,2,3}`, mỗi lá là một tập con | LeetCode 78 Subsets · CSES 1623 Apple Division | ⬜ |
| 3 | `n-queens` | Quay lui: đặt hậu | Backtracking: N-Queens | Bàn 4×4, đặt hậu từng hàng, gặp xung đột thì lùi lại | LeetCode 51 N-Queens · CSES 1624 Chessboard and Queens | ⬜ |

### 03. Sắp xếp · key `sorting` · Đợt 2

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `merge-sort` | Merge sort | Merge sort | Mảng 8 phần tử chia đôi xuống tận 1, rồi trộn lên từng tầng | LeetCode 912 Sort an Array · CSES 1621 Distinct Numbers | ⬜ |
| 2 | `custom-order` | Sắp theo tiêu chí riêng | Sorting by your own rule | Các đoạn `[bắt đầu, kết thúc]` sắp theo điểm kết thúc → tham lam chọn phim | CSES 1629 Movie Festival · LeetCode 179 Largest Number | ⬜ |
| 3 | `sweep-events` | Quét sự kiện | Sweeping events | Khách vào/ra thành các điểm +1/−1 trên trục thời gian, đếm số người đồng thời | CSES 1619 Restaurant Customers · CSES 1074 Stick Lengths | ⬜ |

## Phần B — Kỹ thuật trên mảng

### 04. Prefix Sum · key `prefix-sum` · Đợt 1

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `range-sum` | Tổng đoạn trong O(1) | Range sums in O(1) | Mảng `a` và hàng `pre` bên dưới; tổng `[l, r] = pre[r+1] − pre[l]` | CSES 1646 Static Range Sum Queries · LeetCode 303 | ⬜ |
| 2 | `prefix-2d` | Prefix sum 2 chiều | 2D prefix sums | Lưới 4×4, hình chữ nhật = lớn − trên − trái + góc | CSES 1652 Forest Queries · LeetCode 304 | ⬜ |
| 3 | `difference-array` | Mảng hiệu | Difference arrays | Cộng `+x` cho cả đoạn chỉ bằng 2 ô, rồi cộng dồn ra kết quả | LeetCode 1094 Car Pooling · CSES 1651 Range Update Queries | ⬜ |

### 05. Two Pointers · key `two-pointers` · Đợt 1

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `pair-sum` | Tìm cặp có tổng bằng target | Pair with a target sum | `[1,3,4,6,8,11,15]`, target 14, hai con trỏ tiến về nhau | CSES 1640 · LeetCode 167 · CF 279B | ✅ |
| 2 | `remove-dupes` | Xoá phần tử trùng tại chỗ | Remove duplicates in place | Con trỏ đọc `i` chạy trước, con trỏ ghi `k` chỉ tiến khi gặp số mới | LeetCode 26 · CSES 1090 Ferris Wheel | ⬜ |
| 3 | `three-sum` | Ba số có tổng bằng 0 | Three numbers summing to zero | Cố định `i`, chạy Two Pointers trên phần còn lại | LeetCode 15 3Sum · CSES 1641 Sum of Three Values | ⬜ |

### 06. Sliding Window · key `sliding-window` · Đợt 1

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `fixed-window` | Cửa sổ độ dài k | Fixed-size window | Khung dài k trượt sang phải: +phần tử vào, −phần tử ra | LeetCode 643 Maximum Average Subarray I · CSES 1643 Maximum Subarray Sum | ⬜ |
| 2 | `longest-unique` | Chuỗi con dài nhất không lặp | Longest substring without repeats | `"abcabcbb"`: mở rộng phải, gặp ký tự trùng thì co trái | LeetCode 3 · CSES 1141 Playlist | ⬜ |
| 3 | `min-window-sum` | Đoạn ngắn nhất có tổng ≥ S | Shortest window with sum ≥ S | Khung co giãn, ghi lại độ dài nhỏ nhất mỗi lần tổng đủ | LeetCode 209 · CSES 1660 Subarray Sums I | ⬜ |

### 07. Binary Search · key `binary-search` · Đợt 1

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `lower-bound` | lower_bound từng bước | lower_bound step by step | Khung `[lo, hi)` co một nửa mỗi bước, đến vị trí đầu tiên ≥ x | LeetCode 704 · LeetCode 35 | ⬜ |
| 2 | `answer-search` | Chặt nhị phân đáp án | Binary search on the answer | Trục thời gian t; hàm "làm kịp không?" sai…sai đúng…đúng, tìm điểm đổi | CSES 1620 Factory Machines · LeetCode 875 · CSES 1085 Array Division | ⬜ |

### 08. Stack & Queue · key `stack-queue` · Đợt 2

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `brackets` | Kiểm tra ngoặc bằng stack | Matching brackets with a stack | `"([]{})"`: mở thì đẩy vào chồng, đóng thì so với đỉnh | LeetCode 20 Valid Parentheses | ⬜ |
| 2 | `monotonic-stack` | Stack đơn điệu | Monotonic stack | Tìm phần tử lớn hơn kế tiếp: số mới đẩy bật các số nhỏ hơn ra | LeetCode 739 Daily Temperatures · LeetCode 84 | ⬜ |
| 3 | `monotonic-deque` | Max trong cửa sổ trượt | Sliding window maximum | Deque giữ chỉ số giảm dần; đầu deque là max của khung | LeetCode 239 | ⬜ |

### 09. Hashing · key `hashing` · Đợt 2

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `seen-before` | Đã gặp chưa? (set / map) | Seen it before? (set / map) | Two Sum không cần sắp xếp: mỗi số hỏi "phần bù đã có chưa" | LeetCode 1 Two Sum · CSES 1621 | ⬜ |
| 2 | `subarray-sum-k` | Đếm đoạn con có tổng k | Counting subarrays with sum k | Prefix sum + map đếm số lần gặp `pre − k` | LeetCode 560 · CSES 1661 Subarray Sums II | ⬜ |

## Phần C — Đồ thị & cây

### 10. Đồ thị: BFS / DFS · key `graphs` · Đợt 3

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `graph-basics` | Biểu diễn đồ thị | Representing a graph | Cùng một đồ thị 5 đỉnh vẽ ra danh sách kề và ma trận kề | CSES 1666 Building Roads | ⬜ |
| 2 | `bfs-grid` | BFS trên lưới | BFS on a grid | Lưới có tường, sóng BFS lan theo từng lớp khoảng cách | CSES 1193 Labyrinth · LeetCode 994 Rotting Oranges | ⬜ |
| 3 | `dfs-components` | Đếm thành phần liên thông | Counting components | DFS tô màu từng vùng đảo | CSES 1192 Counting Rooms · LeetCode 200 Number of Islands | ⬜ |
| 4 | `topo-sort` | Sắp xếp tô-pô | Topological sort | Đồ thị môn học: lấy dần các đỉnh bậc vào = 0 (Kahn) | CSES 1679 Course Schedule · LeetCode 207 | ⬜ |

### 11. Đường đi ngắn nhất · key `shortest-path` · Đợt 3

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `bfs-shortest` | Đường ngắn nhất không trọng số | Unweighted shortest paths | BFS kèm mảng `parent`, lần ngược ra đường đi | CSES 1667 Message Route | ⬜ |
| 2 | `dijkstra` | Dijkstra | Dijkstra | Hàng đợi ưu tiên; mỗi bước chốt đỉnh gần nhất rồi nới lỏng các cạnh | CSES 1671 Shortest Routes I · LeetCode 743 | ⬜ |

### 12. DSU & cây khung nhỏ nhất · key `dsu-mst` · Đợt 3

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `union-find` | Disjoint Set Union | Union-Find | Các rừng nhỏ hợp lại; nén đường đi làm cây phẳng ra | CSES 1676 Road Construction · LeetCode 547 | ⬜ |
| 2 | `kruskal` | Kruskal | Kruskal's MST | Sắp cạnh theo trọng số, lấy cạnh nếu không tạo chu trình | CSES 1675 Road Reparation · LeetCode 1584 | ⬜ |

### 13. Cây · key `trees` · Đợt 3

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `subtree-size` | DFS trên cây: kích thước cây con | Tree DFS: subtree sizes | Giá trị dồn từ lá lên gốc | CSES 1674 Subordinates | ⬜ |
| 2 | `diameter` | Đường kính cây | Tree diameter | Hai lần BFS/DFS: từ đỉnh bất kỳ ra đỉnh xa nhất, rồi từ đó đi tiếp | CSES 1131 Tree Diameter · LeetCode 543 | ⬜ |
| 3 | `lca` | Tổ tiên chung gần nhất | Lowest common ancestor | Binary lifting: nhảy 2^k bước để hai đỉnh gặp nhau | CSES 1688 Company Queries II · LeetCode 236 | ⬜ |

## Phần D — Quy hoạch động

### 14. Quy hoạch động · key `dp` · Đợt 4

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `stairs` | Leo cầu thang | Climbing stairs | Từ cây đệ quy (chương 02) sang bảng `dp` một chiều điền từ trái qua | LeetCode 70 · CSES 1633 Dice Combinations | ⬜ |
| 2 | `coin-change` | Đổi tiền ít đồng nhất | Fewest coins | Bảng `dp[x]`, mỗi ô thử từng loại đồng | LeetCode 322 · CSES 1634 Minimizing Coins | ⬜ |
| 3 | `grid-paths` | Đếm đường đi trên lưới | Counting grid paths | Mỗi ô = trên + trái, ô có vật cản thì bằng 0 | LeetCode 62 · CSES 1638 Grid Paths | ⬜ |
| 4 | `knapsack` | Cái túi 0/1 | 0/1 knapsack | Bảng vật × sức chứa; chọn hoặc bỏ từng vật | CSES 1158 Book Shop · LeetCode 416 | ⬜ |
| 5 | `lis` | Dãy con tăng dài nhất | Longest increasing subsequence | O(n²) trước, rồi O(n log n) với mảng "đuôi" + lower_bound | LeetCode 300 · CSES 1145 Increasing Subsequence | ⬜ |
| 6 | `edit-distance` | Khoảng cách chỉnh sửa | Edit distance | Bảng 2 chiều giữa hai chuỗi: thêm, xoá, thay | LeetCode 72 · CSES 1639 Edit Distance · LeetCode 1143 | ⬜ |

## Phần E — Nâng cao

### 15. Truy vấn trên đoạn · key `range-queries` · Đợt 5

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `sparse-table` | Sparse table | Sparse table | Các tầng đoạn dài 1, 2, 4, 8; min đoạn = hai khối chồng lên nhau | CSES 1647 Static Range Minimum Queries | ⬜ |
| 2 | `fenwick` | Cây Fenwick (BIT) | Fenwick tree | Mỗi ô phụ trách một đoạn theo bit thấp nhất; cập nhật và hỏi theo `i & −i` | CSES 1648 Dynamic Range Sum Queries · LeetCode 307 | ⬜ |
| 3 | `segment-tree` | Segment tree | Segment tree | Cây nhị phân trên mảng 8 ô; truy vấn chỉ đi qua O(log n) nút | CSES 1649 Dynamic Range Minimum Queries | ⬜ |

### 16. Toán · key `math` · Đợt 5

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `gcd` | Thuật toán Euclid | Euclid's GCD | Hình chữ nhật 48×18 cắt dần thành các hình vuông | CSES 1081 Common Divisors | ⬜ |
| 2 | `sieve` | Sàng nguyên tố | Sieve of Eratosthenes | Lưới 1..50, gạch bội của 2, 3, 5, 7 | LeetCode 204 Count Primes · CSES 1713 Counting Divisors | ⬜ |
| 3 | `mod-pow` | Luỹ thừa nhanh & modulo | Fast power and modulo | `3^13` theo các bit của 13 = 1101₂ | CSES 1095 Exponentiation · CSES 1617 Bit Strings · LeetCode 50 | ⬜ |
| 4 | `binomial` | Tổ hợp C(n, k) mod p | Binomials mod p | Giai thừa và nghịch đảo modulo tính sẵn | CSES 1079 Binomial Coefficients | ⬜ |

### 17. Chuỗi · key `strings` · Đợt 5

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `kmp` | KMP: tìm chuỗi con | KMP string matching | Bảng prefix-function; khi lệch thì nhảy, không lùi con trỏ văn bản | CSES 1753 String Matching · LeetCode 28 | ⬜ |
| 2 | `string-hash` | Hash chuỗi | Polynomial string hashing | Hash tiền tố; so hai đoạn bằng một phép trừ | CSES 1753 (làm lại bằng hash) | ⬜ |

### 18. Bitmask · key `bitmask` · Đợt 5

| # | slug | Tên bài (VI) | Name (EN) | Sơ đồ | Luyện tập | |
|---|---|---|---|---|---|---|
| 1 | `bit-tricks` | Thao tác bit cơ bản | Bit tricks | Hàng 8 bit: bật, tắt, kiểm tra bit; XOR triệt tiêu cặp | LeetCode 136 Single Number | ⬜ |
| 2 | `subset-masks` | Duyệt tập con bằng mask | Subsets as bitmasks | 0..2ⁿ−1, mỗi số là một tập con; nối lại chương 02 | CSES 1623 Apple Division · LeetCode 78 | ⬜ |
| 3 | `bitmask-dp` | DP trên bitmask | Bitmask DP | `dp[mask]` cho bài phân công: mỗi mask là tập việc đã giao | LeetCode 1879 Minimum XOR Sum of Two Arrays | ⬜ |

---

## Ghi chú

- Thứ tự chương trong cây thư mục của site theo đúng số chương ở đây (01–18).
  Hiện `catalog.ts` mới có 7 chương. Các chương mới được thêm khi bắt đầu làm chúng.
- Muốn đổi thứ tự, thêm hoặc bỏ bài thì sửa file này trước, rồi mới sửa code.
