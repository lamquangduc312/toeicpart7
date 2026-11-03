import { Link } from "@tanstack/react-router";
import type { TopicMeta } from "@/data/topics";

export function TopicCard({ topic, index }: { topic: TopicMeta; index: number }) {
  const s = topic.stats;
  return (
    <Link
      to="/chuyen-de/$slug"
      params={{ slug: topic.slug }}
      className="group flex flex-col rounded-lg border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
    >
      <span className="font-display text-3xl font-extrabold text-accent">{String(index + 1).padStart(2, "0")}</span>
      <h3 className="mt-2 font-display text-xl font-extrabold text-card-foreground group-hover:text-primary">{topic.name}</h3>
      <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{topic.enSub}</p>
      <p className="mt-3 flex-1 text-sm text-muted-foreground">{topic.desc}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
        <span className="rounded bg-secondary px-2 py-1 text-secondary-foreground">{s.lessons} bài</span>
        {s.questions ? <span className="rounded bg-secondary px-2 py-1 text-secondary-foreground">{s.questions} câu ETS</span> : null}
        <span className="rounded bg-secondary px-2 py-1 text-secondary-foreground">{s.pairs} {s.pairsLabel}</span>
      </div>
    </Link>
  );
}
