import { Link, NavLink, useLocation } from "react-router-dom";
import { ShieldCheck, ListChecks, LayoutDashboard, Network, LogOut, ScanFace } from "lucide-react";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const user = storage.getUser();
  const location = useLocation();
  const isAuthRoute = location.pathname === "/" || location.pathname === "/verify";

  if (isAuthRoute) return <>{children}</>;

  const nav = [
    { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/app/checklists", label: "Checklists", icon: ListChecks },
    { to: "/app/architecture", label: "Arquitetura", icon: Network },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/app" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-hero grid place-items-center shadow-glow">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-base">FaceCheck</span>
              <span className="text-[10px] text-muted-foreground mono uppercase tracking-wider">SharePoint sync</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-smooth flex items-center gap-2 ${
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`
                }
              >
                <n.icon className="w-4 h-4" />
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                <ScanFace className="w-4 h-4 text-success" />
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-semibold">{user.name.split(" ")[0]}</span>
                  <span className="text-[10px] mono text-success">{user.confidence.toFixed(1)}% match</span>
                </div>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={() => { storage.clearUser(); window.location.href = "/"; }}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <nav className="md:hidden border-t flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex-1 py-2.5 text-xs font-medium flex flex-col items-center gap-1 ${
                  isActive ? "text-accent" : "text-muted-foreground"
                }`
              }
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">{children}</main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground mono">
        Protótipo web · Plano de referência para app mobile (Flutter / React Native)
      </footer>
    </div>
  );
}
