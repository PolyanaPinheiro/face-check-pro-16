import { useNavigate } from "react-router-dom";
import FaceCapture from "@/components/FaceCapture";
import { storage } from "@/lib/storage";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Verify() {
  const navigate = useNavigate();
  const pending = JSON.parse(sessionStorage.getItem("flow_pending_user") || "null");

  if (!pending) {
    navigate("/");
    return null;
  }

  const handleSuccess = ({ confidence }: { confidence: number }) => {
    const now = new Date().toISOString();
    storage.setUser({
      ...pending,
      confidence,
      faceVerifiedAt: now,
    });
    storage.addAccess({
      id: `acc-${Date.now()}`,
      user: pending.name,
      email: pending.email,
      at: now,
      confidence,
    });
    sessionStorage.removeItem("flow_pending_user");
    navigate("/app");
  };

  return (
    <div className="min-h-screen gradient-hero text-primary-foreground p-6 sm:p-12 grid place-items-center">
      <div className="w-full max-w-2xl space-y-8 animate-fade-up">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-primary-foreground hover:bg-primary-foreground/10 gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>

        <div className="text-center space-y-2">
          <p className="text-xs mono uppercase tracking-widest text-accent">Etapa 2 de 2 · Biometria</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">
            Olá, {pending.name.split(" ")[0]}.
          </h1>
          <p className="text-primary-foreground/70 max-w-md mx-auto">
            Vamos confirmar sua identidade comparando sua foto ao vivo com o cadastro corporativo.
          </p>
        </div>

        <FaceCapture onSuccess={handleSuccess} label="Iniciar câmera" />

        <div className="text-center text-xs mono text-primary-foreground/50">
          POWERED BY AWS REKOGNITION · COMPAREFACES API
        </div>
      </div>
    </div>
  );
}
