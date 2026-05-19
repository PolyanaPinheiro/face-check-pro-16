import { storage } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { History, ScanFace } from "lucide-react";

export default function AccessHistory() {
  const accesses = storage.getAccesses();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs mono uppercase tracking-widest text-accent">REGISTRO DE ACESSO</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold flex items-center gap-3">
          <History className="w-7 h-7 text-accent" /> Histórico de Acesso
        </h1>
        <p className="text-muted-foreground">Cada login validado pela biometria é registrado abaixo.</p>
      </header>

      <Card className="divide-y shadow-card border-border/60">
        <div className="p-4 text-xs mono text-muted-foreground">{accesses.length} REGISTRO(S)</div>
        {accesses.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Ainda não há registros de acesso.
          </div>
        )}
        {accesses.map((a) => {
          const d = new Date(a.at);
          return (
            <div key={a.id} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl grid place-items-center bg-success/15 text-success">
                <ScanFace className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{a.user}</p>
                <p className="text-xs text-muted-foreground mono truncate">{a.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm mono">{d.toLocaleDateString("pt-BR")}</p>
                <p className="text-xs mono text-muted-foreground">{d.toLocaleTimeString("pt-BR")}</p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs mono text-success border border-success/30 bg-success/10 px-2 py-1 rounded-full">
                Verificado
              </span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
