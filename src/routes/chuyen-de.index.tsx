import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/site-chrome";
import { TopicCard } from "@/components/topic-card";
import { TOPICS } from "@/data/topics";

export const Route = createFileRoute("/chuyen-de/")({
  head: () => ({
    meta: [
      { title: "Tất cả 16 chuyên đề — TOEIC ETS Part 7" },
      {
        name: "description",
        content:
          "Danh sách 16 chuyên đề TOEIC Part 7 theo lĩnh vực doanh nghiệp: bán lẻ TMĐT, bảo trì cơ sở vật chất, ESG, logistics, hợp đồng, tài chính, nhân sự, IT, marketing.",
      },
      { property: "og:title", content: "Tất cả 16 chuyên đề TOEIC ETS Part 7" },
      {
        property: "og:description",
        content:
          "Chọn một lĩnh vực doanh nghiệp và bắt đầu luyện đọc hiểu Part 7 với đầy đủ giao diện Landing Page tương tác song ngữ.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TopicsPage,
});

function TopicsPage() {
  return (
    <Page>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-4xl font-extrabold">16 Chuyên đề TOEIC Part 7</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Bao quát 16 lĩnh vực doanh nghiệp thực tế. Mỗi chuyên đề gồm 9–10 bài thực hành theo cụm câu hỏi ETS,
          kèm bảng thuật ngữ tổng hợp nạp Anki và giao diện Landing Page tương tác chuyên sâu.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t, i) => (
            <TopicCard key={t.slug} topic={t} index={i} />
          ))}
        </div>
      </section>
    </Page>
  );
}
