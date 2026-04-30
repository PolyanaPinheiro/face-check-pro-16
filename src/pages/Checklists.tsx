import { Link } from "react-router-dom";
import { storage } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, ListChecks, MapPin, Camera } from "lucide-react";

export default function Checklists() {
  const checklists = storage.getChecklists();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs mono uppercase tracking-widest text-accent">CATÁLOGO</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Checklists disponíveis</h1>
        <p className="text-muted-foreground max-w-2xl">
          Cada checklist está vinculado a uma lista do SharePoint. Itens críticos exigem foto e validação biométrica.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-5">
        {checklists.map((c) => {
          const photos = c.items.filter((i) => i.requiresPhoto).length;
          const required = c.items.filter((i) => i.required).length;
          return (
            <Card key={c.id} className="p-6 shadow-card border-border/60 transition-smooth hover:shadow-elegant hover:-translate-y-0.5 group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl gradient-hero grid place-items-center shadow-glow">
                    <ListChecks className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs mono uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {c.area}
                    </p>
                    <h3 className="font-display font-bold text-lg leading-tight mt-0.5">{c.title}</h3>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-4 line-clamp-2">{c.description}</p>

              <div className="flex items-center gap-4 mt-4 text-xs mono text-muted-foreground">
                <span className="flex items-center gap-1.5"><ListChecks className="w-3.5 h-3.5" /> {c.items.length} itens</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {c.estimatedMinutes}min</span>
                {photos > 0 && <span className="flex items-center gap-1.5"><Camera className="w-3.5 h-3.5" /> {photos} fotos</span>}
                <span className="text-accent">{required} obrig.</span>
              </div>

              <div className="mt-5 pt-5 border-t flex items-center justify-between">
                <code className="text-[11px] mono text-muted-foreground truncate max-w-[60%]">
                  {c.sharepointListId}
                </code>
                <Button asChild size="sm" className="gap-2 group-hover:gradient-accent group-hover:text-accent-foreground transition-smooth">
                  <Link to={`/app/checklists/${c.id}`}>
                    Executar <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
