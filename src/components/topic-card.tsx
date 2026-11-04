import { Link } from "@tanstack/react-router";
import type { TopicMeta } from "@/data/topics";

export function TopicCard({ topic, index }: { topic: TopicMeta; index: number }) {
  const s = topic.stats;
  const landingUrl = topic.landingUrl || `/landing/${topic.slug}.html`;

  return (
    <div className="group flex flex-col justify-between rounded-lg border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-lg">
      <Link
        to="/chuyen-de/$slug"
        params={{ slug: topic.slug }}
        className="block flex-1"
      >
        <span className="font-display text-3xl font-extrabold text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-2 font-display text-xl font-extrabold text-card-foreground group-hover:text-primary transition-colors">
          {topic.name}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{topic.enSub}</p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{topic.desc}</p>
      </Link>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3 text-xs">
        <div className="flex flex-wrap gap-1.5 font-medium">
          <span className="rounded bg-secondary px-2 py-1 text-secondary-foreground">{s.lessons} bài</span>
          {s.questions ? (
            <span className="rounded bg-secondary px-2 py-1 text-secondary-foreground">{s.questions} câu ETS</span>
          ) : null}
          <span className="rounded bg-secondary px-2 py-1 text-secondary-foreground">
            {s.pairs} {s.pairsLabel}
          </span>
        </div>

        <a
          href={landingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
          title="Mở giao diện Landing Page gốc toàn màn hình"
        >
          <span>Landing Page</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6" />
            <path d="M10 14 21 3" />
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
