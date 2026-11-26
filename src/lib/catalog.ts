import type { L10n, Lesson, LessonModule, TrackKey } from "./types";

/** Whose lab this is. */
export const OWNER = { name: "Hoàng Anh", handle: "nha261105" };

/**
 * Site map: Track → Topic (a "chapter" folder in the sidebar) → Lesson (a "file").
 * A lesson only becomes a page once src/lessons/{track}/{topic}/{slug}.ts exists;
 * listed-but-missing lessons show as "coming soon" in the tree.
 */
export interface LessonRef { slug: string; title: L10n; added?: string }
export interface Topic { key: string; title: L10n; desc: L10n; lessons: LessonRef[] }
export interface Track { key: TrackKey; name: string; short: string; icon: string; blurb: L10n; topics: Topic[] }

const L = (slug: string, vi: string, en: string, added?: string): LessonRef => ({ slug, title: { vi, en }, added });
const T = (key: string, vi: string, en: string, dvi: string, den: string, lessons: LessonRef[] = []): Topic =>
  ({ key, title: { vi, en }, desc: { vi: dvi, en: den }, lessons });

export const TRACKS: Track[] = [
  {
    key: "cp", name: "Competitive Programming", short: "CP", icon: "code",
    blurb: {
      vi: "Cấu trúc dữ liệu & giải thuật cho thi đấu: mỗi kỹ thuật một ví dụ nhỏ, chạy từng bước, kèm code C++ và bài luyện.",
      en: "Data structures & algorithms for contests: one small example per technique, step by step, with C++ code and practice problems.",
    },
    topics: [
      T("complexity", "Độ phức tạp & Big-O", "Complexity & Big-O",
        "Ước lượng thuật toán có kịp time limit không trước khi code.", "Tell whether an algorithm fits the time limit before you code it.",
        [L("big-o", "Đếm bước, không đếm giây", "Count steps, not seconds")]),
      T("prefix-sum", "Prefix Sum", "Prefix Sum",
        "Tính trước tổng tiền tố để trả lời tổng đoạn trong O(1).", "Precompute running sums to answer range sums in O(1).",
        [L("range-sum", "Tổng đoạn trong O(1)", "Range sums in O(1)"), L("prefix-2d", "Prefix sum 2 chiều", "2D prefix sums")]),
      T("two-pointers", "Two Pointers", "Two Pointers",
        "Hai con trỏ đi về phía nhau trên mảng đã sắp xếp, mỗi bước loại một phần tử.", "Two indices walk toward each other on a sorted array, dropping one element per step.",
        [L("pair-sum", "Tìm cặp có tổng bằng target", "Pair with a target sum", "2026-11-26"), L("remove-dupes", "Xoá phần tử trùng tại chỗ", "Remove duplicates in place")]),
      T("sliding-window", "Sliding Window", "Sliding Window",
        "Giữ một cửa sổ liên tục, thêm bên phải, bớt bên trái.", "Keep a contiguous window: grow on the right, shrink on the left.",
        [L("fixed-window", "Cửa sổ độ dài k", "Fixed-size window"), L("longest-unique", "Chuỗi con dài nhất không lặp", "Longest substring without repeats")]),
      T("binary-search", "Binary Search", "Binary Search",
        "Chia đôi khoảng tìm kiếm, kể cả tìm kiếm trên đáp án.", "Halve the search range — including binary search on the answer.",
        [L("lower-bound", "lower_bound từng bước", "lower_bound step by step"), L("answer-search", "Chặt nhị phân đáp án", "Binary search on the answer")]),
      T("graphs", "Đồ thị: BFS / DFS", "Graphs: BFS / DFS",
        "Duyệt đồ thị theo lớp và theo chiều sâu, đường đi ngắn nhất không trọng số.", "Traverse by layers and by depth; unweighted shortest paths.",
        [L("bfs-grid", "BFS trên lưới", "BFS on a grid"), L("dfs-components", "Đếm thành phần liên thông", "Counting components")]),
      T("dp", "Quy hoạch động", "Dynamic Programming",
        "Chia bài toán thành trạng thái nhỏ và lưu lại kết quả.", "Break a problem into small states and remember their answers.",
        [L("stairs", "Leo cầu thang", "Climbing stairs"), L("knapsack", "Cái túi 0/1", "0/1 knapsack")]),
    ],
  },
  {
    key: "swe", name: "Software Engineering", short: "SWE", icon: "server",
    blurb: {
      vi: "Hệ thống chạy thế nào: request đi qua đâu, cache, queue, database, rate limit — vẽ thành luồng chuyển động.",
      en: "How systems run: where a request goes, caches, queues, databases, rate limits — drawn as moving flows.",
    },
    topics: [
      T("request-path", "Đường đi của một request", "The life of a request",
        "Từ trình duyệt qua DNS, proxy, app tới database rồi quay về.", "From the browser through DNS, proxy and app to the database and back.",
        [L("one-request", "Theo chân một request", "Follow one request")]),
      T("caching", "Cache", "Caching", "Cache-aside, TTL, và khi nào cache làm sai dữ liệu.", "Cache-aside, TTLs, and when a cache serves wrong data.",
        [L("cache-aside", "Cache-aside", "Cache-aside")]),
      T("rate-limit", "Rate limit", "Rate limiting", "Token bucket, sliding window và chuyện nhiều người chung một IP.", "Token bucket, sliding window, and many users behind one IP.",
        [L("token-bucket", "Token bucket", "Token bucket")]),
      T("queues", "Message queue", "Message queues", "Tách việc chậm ra khỏi request, retry và xử lý trùng.", "Move slow work out of the request; retries and duplicates.",
        [L("work-queue", "Hàng đợi công việc", "Work queues")]),
    ],
  },
  {
    key: "ai", name: "AI", short: "AI", icon: "sparkles",
    blurb: {
      vi: "Từ embedding tới attention và RAG: theo dõi shape tensor và dữ liệu qua từng bước.",
      en: "From embeddings to attention and RAG: follow tensor shapes and data through every step.",
    },
    topics: [
      T("embeddings", "Embedding", "Embeddings", "Biến chữ thành vector và đo độ giống nhau.", "Turn text into vectors and measure similarity.",
        [L("cosine", "Độ giống cosine", "Cosine similarity")]),
      T("attention", "Attention", "Attention", "Q, K, V và ma trận trọng số, theo từng shape.", "Q, K, V and the weight matrix, shape by shape.",
        [L("self-attention", "Self-attention từng bước", "Self-attention step by step")]),
      T("rag", "RAG", "RAG", "Cắt tài liệu, tìm đoạn liên quan, ghép vào prompt.", "Chunk documents, retrieve relevant pieces, put them in the prompt.",
        [L("rag-pipeline", "Một pipeline RAG", "A RAG pipeline")]),
    ],
  },
  {
    key: "paper", name: "Papers", short: "Papers", icon: "book",
    blurb: {
      vi: "Đọc paper theo khung cố định: Vấn đề → Ý tưởng chính → Phương pháp → Kết quả → Nhận xét của mình.",
      en: "Papers in a fixed frame: Problem → Key idea → Method → Results → My take.",
    },
    topics: [
      T("transformer", "Attention Is All You Need", "Attention Is All You Need",
        "Vaswani et al., 2017 — kiến trúc Transformer.", "Vaswani et al., 2017 — the Transformer architecture.",
        [L("transformer-2017", "Đọc: Transformer (2017)", "Read: Transformer (2017)")]),
      T("rag-paper", "Retrieval-Augmented Generation", "Retrieval-Augmented Generation",
        "Lewis et al., 2020 — ghép truy hồi vào mô hình sinh.", "Lewis et al., 2020 — retrieval inside a generative model.",
        [L("rag-2020", "Đọc: RAG (2020)", "Read: RAG (2020)")]),
    ],
  },
];

/** Every lesson file, loaded eagerly at build time (server side only). */
const modules = import.meta.glob<LessonModule>("../lessons/*/*/*.ts", { eager: true });

export function getLesson(track: string, topic: string, slug: string): LessonModule | undefined {
  return modules[`../lessons/${track}/${topic}/${slug}.ts`];
}
export const lessonKey = (track: string, topic: string, slug: string) => `${track}/${topic}/${slug}`;
export const lessonHref = (lang: string, track: string, topic: string, slug: string) => `/${lang}/${track}/${topic}/${slug}`;

export interface ReadyLesson { key: string; track: Track; topic: Topic; topicNo: number; slug: string; title: L10n; added: string; lesson: Lesson; href: (lang: string) => string }

/** Lessons that actually exist, in catalog order. */
export function allLessons(): ReadyLesson[] {
  return TRACKS.flatMap((t) =>
    t.topics.flatMap((tp, k) =>
      tp.lessons.flatMap((l) => {
        const mod = getLesson(t.key, tp.key, l.slug);
        return mod ? [{ key: lessonKey(t.key, tp.key, l.slug), track: t, topic: tp, topicNo: k + 1, slug: l.slug, title: l.title, added: l.added ?? "", lesson: mod.lesson, href: (lang: string) => lessonHref(lang, t.key, tp.key, l.slug) }] : [];
      }),
    ),
  );
}
export const readyIn = (t: Track) => allLessons().filter((l) => l.track.key === t.key);
export const readyInTopic = (t: Track, tp: Topic) => allLessons().filter((l) => l.track.key === t.key && l.topic.key === tp.key);
export const findTrack = (key: string) => TRACKS.find((t) => t.key === key);
export const isReady = (t: Track, tp: Topic, slug: string) => !!getLesson(t.key, tp.key, slug);
