import type { Lang } from "./types";

/** UI strings. Content strings live with the content (catalog, lessons). */
export const UI = {
  vi: {
    tagline: "Phòng lab học tập của mình: thuật toán, kỹ thuật phần mềm, AI và paper — mỗi bài đi từng bước, có sơ đồ chuyển động.",
    tracks: "Các mảng", lessons: "bài", lesson: "bài", soon: "Sắp có", start: "Vào học", topicsOf: "Chủ đề",
    steps: "Các bước", topics: "Chủ đề", code: "Code", watch: "Biến đang theo dõi", practice: "Luyện tập",
    prev: "← Trước", next: "Tiếp →", play: "▶ Tự chạy", pause: "❚❚ Dừng",
    keys: "<kbd>←</kbd> <kbd>→</kbd> chuyển bước", copy: "Copy link bước này", copied: "Đã copy ✓",
    light: "Sáng", dark: "Tối", step: "Bước", run: "ĐANG CHẠY", ac: "ACCEPTED", time: "Thời gian", mem: "Bộ nhớ",
    minutes: "phút", home: "Trang chủ", resizeSteps: "Đổi độ rộng cột bước", resizeCode: "Đổi độ rộng cột code",
    heroTitle: "Học thuật toán bằng cách <em>xem nó chạy</em>.",
    heroLead: "HomeLab là phòng lab học tập của mình. Mỗi bài chỉ một ý tưởng, đi qua từng bước với sơ đồ chuyển động, code chạy cùng và bài luyện thật.",
    startWith: "Bắt đầu với", seeRoadmap: "Xem lộ trình", openLesson: "Mở bài →", live: "đang chạy thử",
    howTitle: "Một bài học gồm gì", how1t: "Sơ đồ chạy từng bước", how1d: "Mỗi bước là một trạng thái đầy đủ của sơ đồ. Nhảy tới bước nào cũng đúng hình, có link riêng để gửi.",
    how2t: "Code và biến đi cùng", how2d: "Dòng code đang chạy sáng lên, bảng biến đổi theo từng bước — thấy được vì sao thuật toán đúng.",
    how3t: "Luyện bằng bài thật", how3d: "Cuối mỗi bài là bài trên CSES, LeetCode, Codeforces với độ khó tăng dần.",
    latest: "Bài mới", roadmap: "Lộ trình", ready: "sẵn sàng", planned: "dự kiến", stepsN: "bước",
    trackReady: "sẵn sàng", trackPlanned: "chủ đề dự kiến", preparing: "Đang soạn — các chủ đề dưới đây sẽ có bài sớm.",
    footer: "Tự học, tự vẽ lại. Song ngữ Việt · Anh.",
    hello: "Chào", nowLearning: "Đang học", suggested: "Gợi ý bắt đầu", cont: "Học tiếp ▶", begin: "Bắt đầu ▶",
    doneLessons: "bài đã xong", topicsReady: "chủ đề có bài", studyDays: "ngày học", overview: "Tổng quan",
    recent: "Hoạt động gần đây", recentEmpty: "Chưa có hoạt động. Mở một bài để bắt đầu — tiến độ được lưu trên trình duyệt này.",
    labLog: "Nhật ký lab", logAdded: "thêm bài", evStart: "bắt đầu", evDone: "học xong", openRoadmap: "Mở lộ trình →",
    progress: "Tiến độ", localNote: "lưu trên trình duyệt này", stDone: "đã xong", stStarted: "đang học", stReady: "chưa học",
    search: "Tìm bài, chủ đề…", noResults: "Không tìm thấy", inLesson: "Trong bài này", lessonOf: "Bài", of: "trên",
    replay: "Chạy lại", pauseShort: "Dừng", playShort: "Tự chạy", copyLink: "Copy link bước", keyIdea: "Ý chính",
    nextLabel: "Tiếp", back: "Trước", toStep: "chuyển bước", chapters: "chương", overviewTitle: "Tổng quan",
    homeLead: "Kho kiến thức của mình: thuật toán thi đấu, kỹ thuật phần mềm, AI và paper. Mỗi bài là một ý, đi qua từng bước với sơ đồ chuyển động.",
    recentlyAdded: "Mới thêm", openTrack: "Mở", course: "Khoá học", lvbasic: "Cơ bản", lvmedium: "Trung bình", lvhard: "Khó",
    kproblem: "VẤN ĐỀ", kconcept: "KHÁI NIỆM", kstep: "TỪNG BƯỚC", kanswer: "ĐÁP ÁN", krecap: "TÓM LẠI",
    openMenu: "Mở mục lục", langName: "Tiếng Việt", tryIt: "Xem thử",
  },
  en: {
    tagline: "My learning lab: algorithms, software engineering, AI and papers — every lesson goes step by step with a moving diagram.",
    tracks: "Tracks", lessons: "lessons", lesson: "lesson", soon: "Coming soon", start: "Start", topicsOf: "Topics",
    steps: "Steps", topics: "Topics", code: "Code", watch: "Watched variables", practice: "Practice",
    prev: "← Back", next: "Next →", play: "▶ Play", pause: "❚❚ Pause",
    keys: "<kbd>←</kbd> <kbd>→</kbd> change step", copy: "Copy link to this step", copied: "Copied ✓",
    light: "Light", dark: "Dark", step: "Step", run: "RUNNING", ac: "ACCEPTED", time: "Time", mem: "Memory",
    minutes: "min", home: "Home", resizeSteps: "Resize steps column", resizeCode: "Resize code column",
    heroTitle: "Learn algorithms by <em>watching them run</em>.",
    heroLead: "HomeLab is my learning lab. Each lesson is one idea, walked through step by step with a moving diagram, live code and real practice problems.",
    startWith: "Start with", seeRoadmap: "See the roadmap", openLesson: "Open lesson →", live: "live preview",
    howTitle: "What a lesson gives you", how1t: "A diagram, step by step", how1d: "Every step is a complete picture. Jump to any step and it is right; each step has its own link.",
    how2t: "Code and variables alongside", how2d: "The running line lights up and the variable table changes each step — you see why it works.",
    how3t: "Practice on real problems", how3d: "Each lesson ends with CSES, LeetCode and Codeforces problems of rising difficulty.",
    latest: "Latest lessons", roadmap: "Roadmap", ready: "ready", planned: "planned", stepsN: "steps",
    trackReady: "ready", trackPlanned: "topics planned", preparing: "In progress — the topics below get lessons soon.",
    footer: "Learning by redrawing it. Vietnamese · English.",
    hello: "Hi", nowLearning: "Now learning", suggested: "Suggested start", cont: "Continue ▶", begin: "Start ▶",
    doneLessons: "lessons done", topicsReady: "topics with lessons", studyDays: "study days", overview: "Overview",
    recent: "Recent activity", recentEmpty: "No activity yet. Open a lesson to begin — progress is saved in this browser.",
    labLog: "Lab log", logAdded: "added", evStart: "started", evDone: "finished", openRoadmap: "Open roadmap →",
    progress: "Progress", localNote: "saved in this browser", stDone: "done", stStarted: "in progress", stReady: "not started",
    search: "Search lessons, topics…", noResults: "No matches", inLesson: "In this lesson", lessonOf: "Lesson", of: "of",
    replay: "Replay", pauseShort: "Pause", playShort: "Play", copyLink: "Copy step link", keyIdea: "Key idea",
    nextLabel: "Next", back: "Back", toStep: "to step", chapters: "chapters", overviewTitle: "Overview",
    homeLead: "My knowledge base: contest algorithms, software engineering, AI and papers. Each lesson is one idea, walked through step by step with a moving diagram.",
    recentlyAdded: "Recently added", openTrack: "Open", course: "Course", lvbasic: "Beginner", lvmedium: "Intermediate", lvhard: "Advanced",
    kproblem: "PROBLEM", kconcept: "CONCEPT", kstep: "STEP", kanswer: "ANSWER", krecap: "RECAP",
    openMenu: "Open contents", langName: "English", tryIt: "Try it",
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UIKey = keyof (typeof UI)["vi"];
export const otherLang = (l: Lang): Lang => (l === "vi" ? "en" : "vi");
/** Same page in the other language. */
export const swapLang = (path: string, to: Lang) => path.replace(/^\/(vi|en)(?=\/|$)/, `/${to}`);

/** "1 lesson" / "3 lessons" / "1 bài". */
export const nLessons = (n: number, lang: Lang) => `${n} ${n === 1 ? UI[lang].lesson : UI[lang].lessons}`;
