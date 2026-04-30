import { Link } from "react-router-dom";
import { storage } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ListChecks, ScanFace, CheckCircle2, Clock, Cloud, Activity } from "lucide-react";

export default function Dashboard() {
  const user = storage.getUser()!;
  const checklists = storage.getChecklists();
  const submissions = storage.getSubmissions();

  const completedToday = submissions.filter(
    (s) => new Date(s.completedAt).toDateString() === new Date().toDateString()
  ).length;
  const synced = submissions.filter((s) => s.syncedToSharePoint).length;

  const stats = [
    { label: "Checklists ativos", value: checklists.length, icon: ListChecks, accent: "text-accent" },
    { label: "Concluídos hoje", value: completedToday, icon: CheckCircle2, accent: "text-success" },
    { label: "Sincronizados SharePoint", value: synced, icon: Cloud, accent: "text-primary" },
    { label: "Última biometria", value: `${user.confidence.toFixed(1)}%`, icon: ScanFace, accent: "text-accent" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl gradient-hero text-primary-foreground p-8 sm:p-10 shadow-elegant">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full gradient-accent blur-3xl opacity-30" />
        <div className="relative space-y-4 max-w-2xl">
          <p className="text-xs mono uppercase tracking-widest text-accent flex items-center gap-2">
            <Activity className="w-3 h-3" /> SESSÃO VERIFICADA · {new Date(user.faceVerifiedAt).toLocaleTimeString("pt-BR")}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">
            Bem-vinda, {user.name.split(" ")[0]}.
          </h1>
          <p className="text-primary-foreground/75 max-w-lg">
            Você tem <span className="font-semibold text-accent">{checklists.length} checklists</span> disponíveis hoje.
            Cada item executado é assinado com sua biometria e enviado ao SharePoint.
          </p>
          <Button asChild size="lg" className="gradient-accent text-accent-foreground hover:opacity-90 gap-2 shadow-glow mt-2">
            <Link to="/app/checklists">
              Ver checklists <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 shadow-card border-border/60 transition-smooth hover:shadow-elegant hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <s.icon className={`w-5 h-5 ${s.accent}`} />
              <span className="text-[10px] mono text-muted-foreground uppercase">live</span>
            </div>
            <p className="font-display text-3xl font-bold mt-3">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </Card>
        ))}
      </section>

      {/* Recent submissions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold">Atividade recente</h2>
          <span className="text-xs mono text-muted-foreground">SHAREPOINT SYNC LOG</span>
        </div>
        <Card className="divide-y shadow-card border-border/60">
          {submissions.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Nenhum checklist enviado ainda. Comece pelo painel de checklists.
            </div>
          )}
          {submissions.slice(0, 6).map((s) => (
            <div key={s.id} className="p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl grid place-items-center ${s.failCount === 0 ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{s.checklistTitle}</p>
                <p className="text-xs text-muted-foreground mono">
                  {new Date(s.completedAt).toLocaleString("pt-BR")} · {s.okCount} OK · {s.failCount} falhas
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs mono">
                <Clock className="w-3 h-3 text-muted-foreground" />
                {Math.round(s.durationSec / 60)}min
              </div>
              {s.syncedToSharePoint && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs mono text-success border border-success/30 bg-success/10 px-2 py-1 rounded-full">
                  <Cloud className="w-3 h-3" /> SYNC
                </span>
              )}
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}
