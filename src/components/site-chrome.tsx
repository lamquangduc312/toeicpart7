import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
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
          <Link to="/" className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>
            Phương pháp
          </Link>
          <Link to="/chuyen-de" className="rounded-md bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90">
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
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
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
