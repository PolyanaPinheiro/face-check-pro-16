import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, ScanFace, Menu, History, BookOpen, LayoutDashboard, ListChecks, ClipboardList } from "lucide-react";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const user = storage.getUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isAuthRoute = location.pathname === "/" || location.pathname === "/verify";

  if (isAuthRoute) return <>{children}</>;

  const sidebar = [
    { to: "/app", label: "Dashboard", icon: LayoutDashboard },
    { to: "/app/historico", label: "Histórico de Checklist", icon: ClipboardList },
    { to: "/app/acessos", label: "Histórico de Acesso", icon: History },
    { to: "/app/tutorial", label: "Como usar a plataforma", icon: BookOpen },
  ];

  const go = (to: string) => { setOpen(false); navigate(to); };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/app" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-hero grid place-items-center shadow-glow">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-base">CheckList's</span>
              <span className="text-[10px] text-muted-foreground mono uppercase tracking-wider">SharePoint sync</span>
            </div>
          </Link>

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
            <Button variant="ghost" size="icon" onClick={() => { storage.clearUser(); window.location.href = "/"; }} title="Sair">
              <LogOut className="w-4 h-4" />
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="font-display flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-accent" /> Menu
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1">
                  {sidebar.map((s) => (
                    <button
                      key={s.to}
                      onClick={() => go(s.to)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth text-left ${
                        location.pathname === s.to
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary text-foreground"
                      }`}
                    >
                      <s.icon className="w-4 h-4" />
                      {s.label}
                    </button>
                  ))}
                </nav>
                {user && (
                  <div className="mt-8 p-4 rounded-xl bg-secondary/50 border border-border/50">
                    <p className="text-xs mono uppercase text-muted-foreground">Sessão</p>
                    <p className="font-semibold mt-1">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-[11px] mono text-success mt-2">
                      Verificado · {user.confidence.toFixed(1)}%
                    </p>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">{children}</main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground mono">
        Protótipo web · Plano de referência para app mobile (Flutter / React Native)
      </footer>
    </div>
  );
}
