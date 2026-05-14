import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Factory, Package, ScanFace, CheckCircle2, User } from "lucide-react";
import FaceCapture from "@/components/FaceCapture";
import { storage } from "@/lib/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function NewChecklist() {
  const navigate = useNavigate();
  const user = storage.getUser()!;
  const [line, setLine] = useState("");
  const [sku, setSku] = useState("");
  const [responsavel, setResponsavel] = useState(user.name);
  const [showFace, setShowFace] = useState(false);
  const [verifiedConfidence, setVerifiedConfidence] = useState<number | null>(null);

  const checklist = storage.getChecklists()[0];

  const canVerify = line.trim() && sku.trim() && responsavel.trim();

  const handleFaceSuccess = ({ confidence }: { confidence: number }) => {
    setVerifiedConfidence(confidence);
    setShowFace(false);
    toast.success(`Responsável verificado · ${confidence.toFixed(1)}%`);
  };

  const start = () => {
    if (!verifiedConfidence) {
      toast.error("Confirme a identidade do responsável antes de iniciar.");
      return;
    }
    storage.setContext({
      line: line.trim(),
      sku: sku.trim(),
      responsavel: responsavel.trim(),
      responsavelConfidence: verifiedConfidence,
      startedAt: new Date().toISOString(),
    });
    storage.resetChecklist(checklist.id);
    navigate(`/app/checklists/${checklist.id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => navigate("/app")} className="gap-2">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Button>

      <header className="space-y-2">
        <p className="text-xs mono uppercase tracking-widest text-accent">NOVO CHECKLIST</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">{checklist.title}</h1>
        <p className="text-muted-foreground">
          Preencha as informações de contexto. O responsável é validado por reconhecimento facial antes do início.
        </p>
      </header>

      <Card className="p-6 sm:p-8 shadow-card border-border/60 space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="line" className="flex items-center gap-1.5">
              <Factory className="w-3.5 h-3.5 text-accent" /> Linha
            </Label>
            <Input id="line" placeholder="Ex.: Linha 03" value={line} onChange={(e) => setLine(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku" className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-accent" /> SKU
            </Label>
            <Input id="sku" placeholder="Ex.: SKU-44219" value={sku} onChange={(e) => setSku(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <Label htmlFor="resp" className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-accent" /> Responsável
          </Label>
          <Input id="resp" placeholder="Nome do responsável" value={responsavel} onChange={(e) => { setResponsavel(e.target.value); setVerifiedConfidence(null); }} />
          <p className="text-xs text-muted-foreground">A identidade do responsável precisa ser confirmada com reconhecimento facial.</p>

          <div className="flex items-center justify-between mt-3 p-3 rounded-xl border border-dashed bg-secondary/30">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl grid place-items-center ${verifiedConfidence ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground"}`}>
                {verifiedConfidence ? <CheckCircle2 className="w-5 h-5" /> : <ScanFace className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {verifiedConfidence ? "Identidade confirmada" : "Reconhecimento facial pendente"}
                </p>
                <p className="text-xs mono text-muted-foreground">
                  {verifiedConfidence ? `${verifiedConfidence.toFixed(1)}% match · AWS Rekognition` : "Será comparado ao cadastro corporativo"}
                </p>
              </div>
            </div>
            <Button
              variant={verifiedConfidence ? "outline" : "default"}
              onClick={() => setShowFace(true)}
              disabled={!canVerify}
              className={!verifiedConfidence ? "gradient-accent text-accent-foreground hover:opacity-90" : ""}
            >
              {verifiedConfidence ? "Repetir" : "Verificar"}
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs mono text-muted-foreground">
            Início registrado ao iniciar · término ao enviar para o SharePoint
          </p>
          <Button onClick={start} disabled={!verifiedConfidence} className="gap-2 gradient-accent text-accent-foreground hover:opacity-90 shadow-glow">
            Iniciar checklist <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      <Dialog open={showFace} onOpenChange={setShowFace}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reconhecimento facial do responsável</DialogTitle>
          </DialogHeader>
          <FaceCapture onSuccess={handleFaceSuccess} label="Iniciar câmera" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
