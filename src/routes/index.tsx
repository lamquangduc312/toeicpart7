import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/site-chrome";
import { TopicCard } from "@/components/topic-card";
import { TOPICS } from "@/data/topics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TOEIC ETS Part 7 theo chuyên đề — Thực học tình huống doanh nghiệp" },
      {
        name: "description",
        content:
          "Phương pháp thực học TOEIC Part 7 theo 16 chuyên đề: đề ETS gốc, dịch song ngữ, dấu vết đáp án, bẫy ETS và từ vựng doanh nghiệp.",
      },
      { property: "og:title", content: "TOEIC ETS Part 7 theo chuyên đề" },
      {
        property: "og:description",
        content:
          "Học đọc hiểu Part 7 qua các tình huống doanh nghiệp thật — bán lẻ TMĐT, bảo trì cơ sở vật chất, ESG, hợp đồng, logistics, tài chính, nhân sự.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STEPS = [
  { t: "Đọc đề ETS gốc", d: "Bài đọc đơn, kép, ba văn bản đúng chuẩn đề thi — e-mail, hợp đồng, hóa đơn, thông cáo." },
  { t: "Làm bài & nhận phản hồi ngay", d: "Chọn đáp án, xem dấu vết trong bài đọc, cách diễn đạt tương đương và lý do mỗi phương án sai." },
  { t: "Hiểu như người trong nghề", d: "Dịch song ngữ từng câu, sơ đồ quy trình nghiệp vụ và tóm tắt Feynman giúp hiểu bản chất tình huống." },
  { t: "Ghi nhớ chủ động", d: "Bảng truy xuất 5 giây và bộ thuật ngữ — paraphrase sẵn sàng nạp vào Anki để ôn lặp lại." },
];

const WHY = [
  ["Theo chuyên đề, không theo đề", "Gom các bài cùng một lĩnh vực để từ vựng và mô-típ câu hỏi lặp lại, nhớ sâu và nhanh hơn."],
  ["Tình huống doanh nghiệp thật", "Hoàn tiền trừ đúp, phạt SLA, container bị giữ, đối soát công nợ — gặp trong đề và cả trong công việc."],
  ["Học bẫy, không học mẹo", "Mỗi phương án sai được gọi tên bẫy ETS để bạn nhận ra nó ở bất kỳ đề nào."],
];

function Index() {
  const totalLessons = TOPICS.reduce((n, t) => n + t.stats.lessons, 0);
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 md:pt-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-foreground">
          <span className="rounded bg-accent px-2 py-1">Phương pháp thực học mới</span>
        </p>
        <h1 className="mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[1.05] md:text-6xl">
          Đọc TOEIC Part 7 như đọc hồ sơ công việc của chính bạn.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Mỗi chuyên đề là một lĩnh vực doanh nghiệp. Bạn giải đề ETS gốc, truy vết đáp án ngay trong bài đọc,
          gọi tên từng bẫy — và mang theo cách xử lý tình huống ra cả phòng họp.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#chuyen-de-section"
            className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-sm"
          >
            Bắt đầu học ngay
          </a>
          <a href="#cach-hoc" className="rounded-md border border-border px-5 py-3 font-semibold hover:bg-secondary transition">
            Cách học hoạt động
          </a>
        </div>
        <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-border pt-6">
          {[
            [TOPICS.length, "chuyên đề"],
            [totalLessons, "bài thực hành"],
            [totalLessons * 5, "câu hỏi ETS"],
          ].map(([n, l]) => (
            <div key={String(l)}>
              <dt className="font-display text-3xl font-extrabold">{n}</dt>
              <dd className="text-sm text-muted-foreground">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="cach-hoc" className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">4 bước trong mỗi bài học</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.t} className="border-t-2 border-accent pt-4">
                <span className="font-display text-2xl font-extrabold text-accent">0{i + 1}</span>
                <h3 className="mt-2 font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm opacity-80">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
        {WHY.map(([t, d]) => (
          <div key={t}>
            <h3 className="font-display text-xl font-extrabold">{t}</h3>
            <p className="mt-2 text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      <section id="chuyen-de-section" className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold md:text-4xl">16 Chuyên đề TOEIC Part 7</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Bao quát toàn bộ các tình huống nghiệp vụ: TMĐT, bảo trì, ESG, hợp đồng, IT, logistics, tài chính, nhân sự.
            </p>
          </div>
          <Link to="/chuyen-de" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
            Xem danh sách đầy đủ ({TOPICS.length})
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t, i) => (
            <TopicCard key={t.slug} topic={t} index={i} />
          ))}
        </div>
      </section>
    </Page>
  );
}
