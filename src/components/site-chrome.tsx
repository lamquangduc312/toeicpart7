import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1720px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary font-display text-lg font-extrabold text-primary-foreground">
            P7
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-extrabold text-foreground">TOEIC ETS Part 7</span>
            <span className="block text-xs text-muted-foreground">Thực học theo chuyên đề</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-foreground font-semibold" }}
          >
            Phương pháp
          </Link>
          <Link to="/chuyen-de" className="rounded-md bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90 transition shadow-sm">
            Chuyên đề
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto w-full max-w-[1720px] px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
        TOEIC ETS Part 7 theo chuyên đề — học đọc hiểu qua tình huống doanh nghiệp thật.
      </div>
    </footer>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
