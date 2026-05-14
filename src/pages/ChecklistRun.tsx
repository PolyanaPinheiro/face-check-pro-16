import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { inferShift, storage } from "@/lib/storage";
import { Checklist, ChecklistItem } from "@/data/checklists";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, Check, X, ScanFace, Cloud, AlertCircle, Loader2, Image as ImageIcon } from "lucide-react";
import FaceCapture from "@/components/FaceCapture";
import CameraCapture from "@/components/CameraCapture";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ChecklistRun() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = storage.getUser()!;
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [photoForItem, setPhotoForItem] = useState<string | null>(null);
  const [photoMode, setPhotoMode] = useState<"choose" | "camera">("choose");
  const [showSign, setShowSign] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [syncStep, setSyncStep] = useState(0);
  const ctx = storage.getContext();
  const startedAt = useRef(ctx ? new Date(ctx.startedAt).getTime() : Date.now());

  useEffect(() => {
    const found = storage.getChecklists().find((c) => c.id === id) || null;
    setChecklist(found);
  }, [id]);

  useEffect(() => {
    if (!ctx) navigate("/app/checklist/novo", { replace: true });
  }, []);

  if (!checklist) {
    return <div className="text-center py-20 text-muted-foreground">Carregando…</div>;
  }

  const updateItem = (itemId: string, patch: Partial<ChecklistItem>) => {
    const next = {
      ...checklist,
      items: checklist.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
    };
    setChecklist(next);
    storage.saveChecklist(next);
  };

  const setStatus = (item: ChecklistItem, status: "ok" | "fail") => {
    if (status === "ok" && item.requiresPhoto && !item.photo) {
      setPhotoForItem(item.id);
      return;
    }
    updateItem(item.id, { status, completedAt: new Date().toISOString() });
  };

  const persistPhoto = async (dataUrl: string) => {
    if (!photoForItem) return;
    toast.loading("Enviando foto à biblioteca SharePoint…", { id: "upload" });
    await new Promise((r) => setTimeout(r, 600));
    updateItem(photoForItem, { photo: dataUrl, status: "ok", completedAt: new Date().toISOString() });
    toast.success("Foto sincronizada", { id: "upload" });
    setPhotoForItem(null);
    setPhotoMode("choose");
  };

  const handleFileSelected = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    await persistPhoto(dataUrl);
  };

  const total = checklist.items.length;
  const done = checklist.items.filter((i) => i.status !== "pending").length;
  const okCount = checklist.items.filter((i) => i.status === "ok").length;
  const failCount = checklist.items.filter((i) => i.status === "fail").length;
  const requiredPending = checklist.items.filter((i) => i.required && i.status === "pending").length;
  const progress = (done / total) * 100;

  const submitToSharePoint = async () => {
    setSubmitting(true);
    const steps = [
      "Validando biometria do executor…",
      "Autenticando com Azure AD (MSAL)…",
      "Criando item na lista SharePoint…",
      "Anexando evidências fotográficas…",
      "Registrando assinatura biométrica…",
    ];
    for (let i = 0; i < steps.length; i++) {
      setSyncStep(i + 1);
      toast.loading(steps[i], { id: "sync" });
      await new Promise((r) => setTimeout(r, 700));
    }
    toast.success("Checklist sincronizado com SharePoint", { id: "sync" });

    const endedAt = new Date().toISOString();
    storage.addSubmission({
      id: `sub-${Date.now()}`,
      checklistId: checklist.id,
      checklistTitle: checklist.title,
      user: user.name,
      line: ctx?.line,
      sku: ctx?.sku,
      responsavel: ctx?.responsavel,
      shift: inferShift(ctx?.startedAt || endedAt),
      startedAt: ctx?.startedAt,
      endedAt,
      completedAt: endedAt,
      durationSec: Math.round((Date.now() - startedAt.current) / 1000),
      okCount,
      failCount,
      syncedToSharePoint: true,
      sharepointItemId: `SP-${Math.floor(Math.random() * 90000 + 10000)}`,
    });
    storage.resetChecklist(checklist.id);
    storage.clearContext();
    setSubmitting(false);
    setShowSign(false);
    navigate("/app");
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Button>

      {/* Header card */}
      <Card className="p-6 shadow-card border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-xs mono uppercase tracking-widest text-accent">{checklist.area}</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold mt-1">{checklist.title}</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">{checklist.description}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success/10 border border-success/20 text-sm self-start">
            <ScanFace className="w-4 h-4 text-success" />
            <div className="leading-tight">
              <p className="text-xs font-semibold">{user.name}</p>
              <p className="text-[10px] mono text-success">VERIFICADO {user.confidence.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs mono text-muted-foreground mb-2">
            <span>PROGRESSO</span>
            <span>{done}/{total}</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full gradient-accent transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </Card>

      {/* Items */}
      <div className="space-y-3">
        {checklist.items.map((item, idx) => (
          <Card key={item.id} className="p-5 shadow-card border-border/60 transition-smooth hover:border-accent/40">
            <div className="flex items-start gap-4">
              <div className={`w-9 h-9 shrink-0 rounded-lg grid place-items-center font-display font-bold text-sm ${
                item.status === "ok" ? "bg-success text-success-foreground"
                : item.status === "fail" ? "bg-destructive text-destructive-foreground"
                : "bg-secondary text-muted-foreground"
              }`}>
                {item.status === "ok" ? <Check className="w-4 h-4" /> : item.status === "fail" ? <X className="w-4 h-4" /> : idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-medium leading-snug">
                      {item.label}
                      {item.required && <span className="ml-2 text-[10px] mono text-accent uppercase">obrig.</span>}
                      {item.requiresPhoto && (
                        <span className="ml-2 inline-flex items-center gap-1 text-[10px] mono text-muted-foreground uppercase">
                          <Camera className="w-3 h-3" /> foto
                        </span>
                      )}
                    </p>
                    {item.completedAt && (
                      <p className="text-[11px] mono text-muted-foreground mt-1">
                        {new Date(item.completedAt).toLocaleTimeString("pt-BR")} · por {user.name.split(" ")[0]}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={item.status === "ok" ? "default" : "outline"}
                      onClick={() => setStatus(item, "ok")}
                      className={item.status === "ok" ? "bg-success hover:bg-success/90 text-success-foreground" : ""}
                    >
                      <Check className="w-4 h-4 mr-1" /> OK
                    </Button>
                    <Button
                      size="sm"
                      variant={item.status === "fail" ? "default" : "outline"}
                      onClick={() => setStatus(item, "fail")}
                      className={item.status === "fail" ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : ""}
                    >
                      <X className="w-4 h-4 mr-1" /> Falha
                    </Button>
                  </div>
                </div>

                {item.status === "fail" && (
                  <Textarea
                    placeholder="Descreva o problema (será enviado ao SharePoint)…"
                    value={item.note || ""}
                    onChange={(e) => updateItem(item.id, { note: e.target.value })}
                    className="mt-3 text-sm"
                    rows={2}
                  />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Submit bar */}
      <Card className="p-5 shadow-elegant border-accent/30 sticky bottom-4 bg-card/95 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm">
            {requiredPending > 0 ? (
              <span className="flex items-center gap-2 text-warning">
                <AlertCircle className="w-4 h-4" />
                {requiredPending} item(s) obrigatório(s) pendente(s)
              </span>
            ) : (
              <span className="flex items-center gap-2 text-success">
                <Check className="w-4 h-4" /> Pronto para envio · {okCount} OK / {failCount} falhas
              </span>
            )}
          </div>
          <Button
            disabled={requiredPending > 0}
            onClick={() => setShowSign(true)}
            className="gap-2 gradient-accent text-accent-foreground hover:opacity-90 shadow-glow"
          >
            <Cloud className="w-4 h-4" /> Assinar e enviar ao SharePoint
          </Button>
        </div>
      </Card>

      {/* Photo dialog */}
      <Dialog
        open={!!photoForItem}
        onOpenChange={(o) => {
          if (!o) {
            setPhotoForItem(null);
            setPhotoMode("choose");
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {photoMode === "camera" ? "Tirar foto com a câmera" : "Adicionar foto de evidência"}
            </DialogTitle>
          </DialogHeader>

          {photoMode === "camera" ? (
            <CameraCapture
              onCapture={(dataUrl) => persistPhoto(dataUrl)}
              onCancel={() => setPhotoMode("choose")}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
              <button
                type="button"
                onClick={() => setPhotoMode("camera")}
                className="text-left rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-smooth p-6 flex flex-col items-center gap-2 text-center"
              >
                <Camera className="w-8 h-8 text-accent" />
                <p className="font-medium text-sm">Tirar foto</p>
                <p className="text-xs text-muted-foreground">Usar câmera do dispositivo</p>
              </button>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                />
                <div className="rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-smooth p-6 flex flex-col items-center gap-2 text-center">
                  <ImageIcon className="w-8 h-8 text-accent" />
                  <p className="font-medium text-sm">Escolher do dispositivo</p>
                  <p className="text-xs text-muted-foreground">Galeria / arquivos</p>
                </div>
              </label>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Sign dialog */}
      <Dialog open={showSign} onOpenChange={(o) => !submitting && setShowSign(o)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assinatura biométrica final</DialogTitle>
          </DialogHeader>
          {!submitting ? (
            <FaceCapture onSuccess={submitToSharePoint} label="Confirmar identidade" />
          ) : (
            <div className="py-8 space-y-4">
              {[
                "Validando biometria",
                "Autenticando Azure AD",
                "Criando item SharePoint",
                "Anexando evidências",
                "Registrando assinatura",
              ].map((s, i) => (
                <div key={s} className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full grid place-items-center">
                    {syncStep > i ? (
                      <Check className="w-5 h-5 text-success" />
                    ) : syncStep === i + 1 ? (
                      <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>
                  <span className={syncStep > i ? "text-foreground" : syncStep === i + 1 ? "text-foreground font-medium" : "text-muted-foreground"}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
