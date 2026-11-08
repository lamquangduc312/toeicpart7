import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useMemo, useState, useRef, useEffect } from "react";
import { Page, SiteHeader } from "@/components/site-chrome";
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
  const [i, setI] = useState(0);
  const L = topic.lessons[i];
  const landingUrl = meta?.landingUrl || `/landing/${slug}.html`;

  // Tự động cuộn và ẩn 2 dòng đầu khi đọc bài, chỉ giữ lại thanh bài học
  const headerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(108);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== "landing") return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    let lastScrollY = 0;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          try {
            const win = iframe.contentWindow;
            if (!win) return;
            const currentScrollY = win.scrollY;
            const deltaY = currentScrollY - lastScrollY;

            // Kéo xuống quá 40px và đang cuộn xuống: Ẩn 2 dòng đầu
            if (currentScrollY > 40 && deltaY > 5) {
              setIsHeaderHidden(true);
            }
            // Kéo ngược lên hoặc về gần đầu trang: Hiện lại 2 dòng đầu
            else if (deltaY < -15 || currentScrollY <= 20) {
              setIsHeaderHidden(false);
            }

            lastScrollY = currentScrollY;
          } catch (e) {
            // bỏ qua nếu có chính sách bảo mật
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const attach = () => {
      try {
        const win = iframe.contentWindow;
        if (win) {
          win.removeEventListener("scroll", onScroll);
          win.addEventListener("scroll", onScroll, { passive: true });
        }
      } catch (e) {}
    };

    attach();
    iframe.addEventListener("load", attach);

    // Lắng nghe sự kiện postMessage từ landing page HTML
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "landing-scroll") {
        const { scrollY, deltaY } = e.data;
        if (scrollY > 40 && deltaY > 5) {
          setIsHeaderHidden(true);
        } else if (deltaY < -15 || scrollY <= 20) {
          setIsHeaderHidden(false);
        }
      }
    };
    window.addEventListener("message", handleMessage);

    return () => {
      try {
        iframe.contentWindow?.removeEventListener("scroll", onScroll);
      } catch (e) {}
      iframe.removeEventListener("load", attach);
      window.removeEventListener("message", handleMessage);
    };
  }, [activeTab, landingUrl]);

  if (activeTab === "landing") {
    return (
      <div className="relative flex h-screen h-[100dvh] w-full flex-col overflow-hidden bg-background font-sans text-foreground">
        {/* Nút nổi tinh tế mở lại 2 dòng đầu khi đang bị ẩn */}
        {isHeaderHidden && (
          <button
            type="button"
            onClick={() => setIsHeaderHidden(false)}
            className="fixed top-2 right-4 z-50 flex items-center gap-1.5 rounded-full border border-border/80 bg-background/95 px-3 py-1 text-xs font-semibold text-foreground shadow-md backdrop-blur transition hover:bg-secondary hover:scale-105"
            title="Bấm để hiện lại thanh điều hướng chuyên đề"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
            <span>Hiện menu</span>
          </button>
        )}

        {/* Khối 2 dòng đầu: SiteHeader + Thanh chuyên đề (Cuộn mượt mà ẩn đi khi kéo bài đọc lên) */}
        <div
          ref={headerRef}
          style={{ marginTop: isHeaderHidden ? `-${headerHeight}px` : "0px" }}
          className={`shrink-0 z-20 transition-all duration-300 ease-in-out ${
            isHeaderHidden ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Dòng 1: Header điều hướng chính */}
          <SiteHeader />

          {/* Dòng 2: Thanh điều khiển chuyên đề tinh gọn */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border bg-card/90 px-3 py-1.5 backdrop-blur sm:px-6">
            <div className="flex min-w-0 items-center gap-2 text-xs">
              <Link
                to="/chuyen-de"
                className="font-semibold text-muted-foreground transition-colors hover:text-primary whitespace-nowrap"
              >
                ← Chuyên đề
              </Link>
              <span className="text-border">/</span>
              <span className="truncate font-bold text-foreground text-sm">
                {meta?.name ?? topic.title}
              </span>
              {meta?.enSub && (
                <span className="hidden md:inline text-[11px] uppercase tracking-wider text-muted-foreground truncate">
                  · {meta.enSub}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Nút thủ công thu gọn 2 dòng đầu */}
              <button
                type="button"
                onClick={() => setIsHeaderHidden(true)}
                className="hidden sm:inline-flex items-center gap-1 rounded-md border border-border bg-secondary/60 px-2 py-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                title="Ẩn 2 dòng đầu để tối đa hóa không gian đọc bài học"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m18 15-6-6-6 6" />
                </svg>
                <span>Ẩn thanh trên</span>
              </button>

              {/* Chuyển đổi giao diện */}
              <div className="flex rounded-md border border-border bg-secondary/60 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("landing")}
                  className="rounded px-2.5 py-1 font-semibold bg-primary text-primary-foreground shadow-sm transition"
                >
                  Landing Page tương tác
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("react")}
                  className="rounded px-2.5 py-1 font-medium text-muted-foreground transition hover:text-foreground"
                >
                  Tóm tắt React
                </button>
              </div>

              {/* Mở toàn màn hình */}
              <a
                href={landingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                title="Mở toàn màn hình trong tab mới độc lập"
              >
                <span>Toàn màn hình</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
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
        </div>

        {/* Iframe tràn viền: Khi 2 dòng đầu ẩn, tự động chiếm 100% màn hình, chỉ giữ lại thanh bài học ở top */}
        <main className="flex-1 w-full min-h-0 overflow-hidden bg-background">
          <iframe
            ref={iframeRef}
            src={landingUrl}
            title={meta?.title ?? "Landing Page"}
            className="h-full w-full border-0 block bg-background"
            allow="fullscreen"
          />
        </main>
      </div>
    );
  }

  return (
    <Page>
      <section className="mx-auto max-w-7xl px-4 py-6">
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
            <div className="flex rounded-lg border border-border bg-secondary/50 p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("landing")}
                className="rounded-md px-3 py-1.5 font-medium text-muted-foreground hover:text-foreground transition"
              >
                Giao diện Landing Page
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("react")}
                className="rounded-md px-3 py-1.5 font-medium bg-primary text-primary-foreground shadow-sm transition"
              >
                Chế độ Tóm tắt React
              </button>
            </div>

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
