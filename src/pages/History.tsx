import { useMemo, useState } from "react";
import { storage, inferShift, Submission } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ClipboardList, Clock, Cloud, CheckCircle2, Filter, X } from "lucide-react";

export default function History() {
  const all = storage.getSubmissions().map((s) => ({
    ...s,
    shift: s.shift || inferShift(s.completedAt),
  }));

  const lines = useMemo(() => Array.from(new Set(all.map((s) => s.line).filter(Boolean))) as string[], [all]);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [shift, setShift] = useState<string>("all");
  const [line, setLine] = useState<string>("all");

  const filtered = all.filter((s: Submission) => {
    const d = new Date(s.completedAt).getTime();
    if (from && d < new Date(from).getTime()) return false;
    if (to && d > new Date(to).getTime() + 86400000) return false;
    if (shift !== "all" && s.shift !== shift) return false;
    if (line !== "all" && s.line !== line) return false;
    return true;
  });

  const reset = () => { setFrom(""); setTo(""); setShift("all"); setLine("all"); };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs mono uppercase tracking-widest text-accent">HISTÓRICO</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Histórico de Checklists</h1>
        <p className="text-muted-foreground">Filtre por período, turno e linha de produção.</p>
      </header>

      <Card className="p-5 shadow-card border-border/60">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-accent" />
          <h2 className="font-display font-semibold">Filtros</h2>
          <Button variant="ghost" size="sm" onClick={reset} className="ml-auto gap-1.5 text-xs">
            <X className="w-3 h-3" /> Limpar
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">De</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Até</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Turno</Label>
            <Select value={shift} onValueChange={setShift}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Manhã">Manhã</SelectItem>
                <SelectItem value="Tarde">Tarde</SelectItem>
                <SelectItem value="Noite">Noite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Linha</Label>
            <Select value={line} onValueChange={setLine}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {lines.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="divide-y shadow-card border-border/60">
        <div className="p-4 flex items-center justify-between text-xs mono text-muted-foreground">
          <span>{filtered.length} REGISTRO(S)</span>
          <span>SHAREPOINT SYNC LOG</span>
        </div>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Nenhum checklist encontrado para os filtros selecionados.
          </div>
        )}
        {filtered.map((s) => (
          <div key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className={`w-10 h-10 rounded-xl grid place-items-center ${s.failCount === 0 ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium truncate">{s.checklistTitle}</p>
                {s.shift && <span className="text-[10px] mono uppercase px-2 py-0.5 rounded-full bg-secondary">{s.shift}</span>}
                {s.line && <span className="text-[10px] mono uppercase px-2 py-0.5 rounded-full bg-accent/10 text-accent">Linha {s.line}</span>}
              </div>
              <p className="text-xs text-muted-foreground mono mt-0.5">
                {new Date(s.completedAt).toLocaleString("pt-BR")} · {s.okCount} OK · {s.failCount} falhas
                {s.sku && ` · SKU ${s.sku}`}{s.responsavel && ` · ${s.responsavel}`}
              </p>
              {s.startedAt && s.endedAt && (
                <p className="text-[11px] mono text-muted-foreground mt-0.5">
                  Início {new Date(s.startedAt).toLocaleTimeString("pt-BR")} · Fim {new Date(s.endedAt).toLocaleTimeString("pt-BR")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs mono flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />{Math.round(s.durationSec / 60)}min
              </span>
              {s.syncedToSharePoint && (
                <span className="inline-flex items-center gap-1 text-xs mono text-success border border-success/30 bg-success/10 px-2 py-1 rounded-full">
                  <Cloud className="w-3 h-3" /> SYNC
                </span>
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
