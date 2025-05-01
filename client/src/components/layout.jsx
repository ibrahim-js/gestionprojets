import { TopBar } from "@/components/top-bar";

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <TopBar />
      <main className="pt-4">{children}</main>
    </div>
  );
}
