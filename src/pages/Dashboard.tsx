import { Link } from "react-router-dom";
import { storage } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardList, CheckCircle2, Clock, Cloud, Activity, PlayCircle } from "lucide-react";

export default function Dashboard() {
  const user = storage.getUser()!;
  const submissions = storage.getSubmissions();

  const actions = [
    {
      to: "/app/checklist/novo",
      title: "Fazer novo Checklist",
      desc: "Inicie um CheckList de Setup com identificação biométrica do responsável.",
      icon: PlayCircle,
      cta: "Iniciar",
      featured: true,
    },
    {
      to: "/app/historico",
      title: "Histórico Checklist",
      desc: "Consulte e filtre checklists anteriores por período, turno e linha.",
      icon: ClipboardList,
      cta: "Abrir histórico",
      featured: false,
    },
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
            Inicie um novo checklist ou consulte o histórico das execuções anteriores. Cada item é assinado biometricamente e enviado ao SharePoint.
          </p>
        </div>
      </section>

      {/* Actions */}
      <section className="grid md:grid-cols-2 gap-5">
        {actions.map((a) => (
          <Card
            key={a.to}
            className={`p-7 shadow-card border-border/60 transition-smooth hover:shadow-elegant hover:-translate-y-0.5 ${
              a.featured ? "border-accent/40 bg-gradient-to-br from-card to-accent/5" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl grid place-items-center shadow-glow ${
                a.featured ? "gradient-accent" : "gradient-hero"
              }`}>
                <a.icon className={`w-7 h-7 ${a.featured ? "text-accent-foreground" : "text-accent"}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold">{a.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5">{a.desc}</p>
                <Button
                  asChild
                  className={`mt-5 gap-2 ${a.featured ? "gradient-accent text-accent-foreground hover:opacity-90 shadow-glow" : ""}`}
                  variant={a.featured ? "default" : "outline"}
                >
                  <Link to={a.to}>
                    {a.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* Recent submissions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold">Atividade recente</h2>
          <Link to="/app/historico" className="text-xs mono text-accent hover:underline">VER TODOS</Link>
        </div>
        <Card className="divide-y shadow-card border-border/60">
          {submissions.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Nenhum checklist enviado ainda. Comece por "Fazer novo Checklist".
            </div>
          )}
          {submissions.slice(0, 4).map((s) => (
            <div key={s.id} className="p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl grid place-items-center ${s.failCount === 0 ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{s.checklistTitle}</p>
                <p className="text-xs text-muted-foreground mono truncate">
                  {new Date(s.completedAt).toLocaleString("pt-BR")} · {s.okCount} OK · {s.failCount} falhas
                  {s.line && ` · Linha ${s.line}`}{s.sku && ` · SKU ${s.sku}`}
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
