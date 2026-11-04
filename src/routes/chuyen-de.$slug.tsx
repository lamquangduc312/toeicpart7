import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Page } from "@/components/site-chrome";
import { getTopicMeta, hasTopic, loadTopic } from "@/data/topics";
import { parseTopic, type Lesson } from "@/lib/topic-parser";

export const Route = createFileRoute("/chuyen-de/$slug")({
  loader: async ({ params }) => {
    if (!hasTopic(params.slug)) throw notFound();
    return loadTopic(params.slug);
  },
  head: ({ params }) => {
    const m = getTopicMeta(params.slug);
    const t = m ? `${m.name} — TOEIC ETS Part 7` : "Chuyên đề — TOEIC ETS Part 7";
    const d = m?.desc ?? "Chuyên đề TOEIC Part 7.";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: TopicPage,
  errorComponent: ({ error }) => (
    <Page>
      <p className="p-8">{error instanceof Error ? error.message : String(error)}</p>
    </Page>
  ),
  notFoundComponent: () => (
    <Page>
      <div className="p-8">
        Không tìm thấy chuyên đề.{" "}
        <Link to="/chuyen-de" className="underline">
          Xem danh sách
        </Link>
      </div>
    </Page>
  ),
});

function TopicPage() {
  const { slug } = Route.useParams();
  const data = Route.useLoaderData();
  const meta = getTopicMeta(slug);
  const topic = useMemo(() => parseTopic(data), [data]);
  const [activeTab, setActiveTab] = useState<"landing" | "react">("landing");
  const [isFullWidth, setIsFullWidth] = useState(true);
  const [i, setI] = useState(0);
  const L = topic.lessons[i];
  const landingUrl = meta?.landingUrl || `/landing/${slug}.html`;

  return (
    <Page>
      <section
        className={`w-full transition-all duration-200 ${
          isFullWidth ? "px-2 sm:px-4 lg:px-6 py-4" : "mx-auto max-w-7xl px-4 py-6"
        }`}
      >
        {/* Header điều hướng & Công cụ Autofit */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Link to="/chuyen-de" className="hover:text-primary transition-colors">
                Chuyên đề
              </Link>
              <span>/</span>
              <span className="text-foreground">{meta?.name}</span>
            </div>
            <h1 className="mt-1 font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              {meta?.title ?? data.title}
            </h1>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{meta?.enSub}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Chuyển đổi giao diện */}
            <div className="flex rounded-lg border border-border bg-secondary/50 p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("landing")}
                className={`rounded-md px-3 py-1.5 font-medium transition ${
                  activeTab === "landing"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Giao diện Landing Page
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("react")}
                className={`rounded-md px-3 py-1.5 font-medium transition ${
                  activeTab === "react"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Chế độ Tóm tắt React
              </button>
            </div>

            {/* Nút bật/tắt Autofit Tràn viền trên máy tính */}
            <button
              type="button"
              onClick={() => setIsFullWidth(!isFullWidth)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition hover:bg-secondary/80"
              title="Bật/tắt chế độ tự động vừa màn hình (Autofit) loại bỏ khoảng trắng 2 bên"
            >
              <span>{isFullWidth ? "📐 Khung chuẩn" : "🖥️ Tràn viền Autofit"}</span>
            </button>

            {/* Mở tab mới */}
            <a
              href={landingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
              title="Mở toàn màn hình trong tab mới độc lập"
            >
              <span>Toàn màn hình</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
            </a>
          </div>
        </div>

        {/* Nội dung chính: Iframe Autofit */}
        {activeTab === "landing" ? (
          <div className="mt-3 w-full overflow-hidden rounded-xl border border-border/80 bg-background shadow-sm">
            <iframe
              src={landingUrl}
              title={meta?.title ?? "Landing Page"}
              className="h-[88vh] min-h-[850px] w-full border-0 bg-background block"
              allow="fullscreen"
            />
          </div>
        ) : (
          <div className="mt-6 max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {topic.lessons.map((l, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  className={`rounded-md border px-3 py-2 text-sm ${
                    k === i
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  {String(l.n).padStart(2, "0")} · {l.label}
                </button>
              ))}
            </div>
            {L ? <LessonView key={i} lesson={L} /> : null}
          </div>
        )}
      </section>
    </Page>
  );
}

function Lines({ items }: { items: unknown[] }) {
  return (
    <div className="space-y-2">
      {items.map((x, k) =>
        typeof x === "string" ? (
          <p key={k} className="text-sm leading-relaxed">
            {x}
          </p>
        ) : (
          <div key={k} className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <tbody>
                {(x as { rows: string[][][] }).rows.map((r, a) => (
                  <tr key={a}>
                    {r.map((c, b) => (
                      <td key={b} className="border border-border p-2 align-top">
                        {c.map((s, z) => (
                          <div key={z}>{s}</div>
                        ))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

function LessonView({ lesson }: { lesson: Lesson }) {
  const [picked, setPicked] = useState<Record<string, string>>({});
  return (
    <article className="mt-8">
      <h2 className="font-display text-2xl font-extrabold">{lesson.vi}</h2>
      <p className="text-sm text-muted-foreground">{lesson.src}</p>
      {lesson.questions.length ? (
        <div className="mt-6 rounded-lg border border-border bg-card p-5">
          <h3 className="font-display text-xl font-extrabold">Luyện đề</h3>
          {lesson.questions.map((q) => {
            const ans = lesson.answers.find((a) => a.no === q.no);
            const p = picked[q.no];
            return (
              <div key={q.no} className="mt-5">
                <p className="font-semibold">
                  {q.no}. {q.stem}
                </p>
                <div className="mt-2 grid gap-2">
                  {q.options.map((o) => {
                    const state = p
                      ? o.k === ans?.k
                        ? "border-success bg-success/10"
                        : o.k === p
                        ? "border-destructive bg-destructive/10"
                        : "border-border"
                      : "border-border hover:bg-secondary";
                    return (
                      <button
                        key={o.k}
                        disabled={!!p}
                        onClick={() => setPicked({ ...picked, [q.no]: o.k })}
                        className={`rounded-md border px-3 py-2 text-left text-sm ${state}`}
                      >
                        ({o.k}) {o.t}
                      </button>
                    );
                  })}
                </div>
                {p && ans ? (
                  <div className="mt-3 space-y-1 rounded-md bg-muted p-3 text-sm">
                    <p>
                      <b>Đáp án: ({ans.k})</b>
                    </p>
                    {ans.trace ? (
                      <p>
                        <b>Dấu vết:</b> {ans.trace}
                      </p>
                    ) : null}
                    {ans.para.length ? (
                      <p>
                        <b>Paraphrase:</b> {ans.para.join(" • ")}
                      </p>
                    ) : null}
                    {ans.expl ? (
                      <p>
                        <b>Giải thích:</b> {ans.expl}
                      </p>
                    ) : null}
                    {ans.wrong.map((w) => (
                      <p key={w.k}>
                        <b>({w.k})</b> {w.why} {w.trap ? <i>— {w.trap}</i> : null}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
      {lesson.parts.map((pt, k) => (
        <details key={k} className="mt-4 rounded-lg border border-border bg-card p-4" open={k === 0}>
          <summary className="cursor-pointer font-display text-lg font-extrabold">
            {pt.n ? `Phần ${pt.n}: ` : ""}
            {pt.title}
          </summary>
          <div className="mt-3">
            <Lines items={pt.items} />
          </div>
          {pt.subs.map((s) => (
            <div key={s.id} className="mt-4">
              <h4 className="font-semibold">
                {s.id}. {s.title}
              </h4>
              <div className="mt-2">
                <Lines items={s.items} />
              </div>
            </div>
          ))}
        </details>
      ))}
    </article>
  );
}
