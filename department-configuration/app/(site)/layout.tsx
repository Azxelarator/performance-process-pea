import { SiteShell } from "@/components/site-shell";

// Shared chrome for /departments/* and /documents (the home page wraps itself in SiteShell).
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <SiteShell>{children}</SiteShell>;
}
