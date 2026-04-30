import { useEffect, useRef, useState } from "react";
import { Camera, ScanFace, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Phase = "idle" | "starting" | "scanning" | "analyzing" | "success" | "error";

export default function FaceCapture({
  onSuccess,
  label = "Validar identidade",
}: {
  onSuccess: (snapshot: { confidence: number; image: string }) => void;
  label?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState(0);

  useEffect(() => () => stop(), []);

  const start = async () => {
    setError("");
    setPhase("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPhase("scanning");
    } catch (e) {
      setError("Não foi possível acessar a câmera. Verifique as permissões.");
      setPhase("error");
    }
  };

  const stop = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const capture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setPhase("analyzing");
    setProgress(0);

    // Snapshot
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d")?.drawImage(v, 0, 0, c.width, c.height);
    const image = c.toDataURL("image/jpeg", 0.85);

    // Simulate AWS Rekognition CompareFaces call (4 stages)
    const stages = [25, 55, 80, 100];
    for (const p of stages) {
      await new Promise((r) => setTimeout(r, 450));
      setProgress(p);
    }

    const confidence = 96 + Math.random() * 3.5;
    setPhase("success");
    setTimeout(() => {
      stop();
      onSuccess({ confidence, image });
    }, 800);
  };

  return (
    <div className="w-full">
      <div className="relative aspect-[4/5] sm:aspect-square w-full max-w-md mx-auto rounded-3xl overflow-hidden gradient-hero shadow-elegant border border-border/50">
        {/* Video */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            phase === "scanning" || phase === "analyzing" || phase === "success" ? "opacity-100" : "opacity-0"
          }`}
          style={{ transform: "scaleX(-1)" }}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Idle overlay */}
        {phase === "idle" && (
          <div className="absolute inset-0 grid place-items-center text-center p-8">
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full gradient-accent grid place-items-center pulse-ring">
                <ScanFace className="w-10 h-10 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-primary-foreground">Reconhecimento facial</h3>
                <p className="text-sm text-primary-foreground/70 mt-1 max-w-xs">
                  Compararemos sua imagem com o cadastro corporativo via AWS Rekognition.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scan frame */}
        {(phase === "scanning" || phase === "analyzing") && (
          <>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-8 sm:inset-12 border-2 border-accent/70 rounded-full" />
              {/* Corner brackets */}
              {[
                "top-4 left-4 border-t-2 border-l-2",
                "top-4 right-4 border-t-2 border-r-2",
                "bottom-4 left-4 border-b-2 border-l-2",
                "bottom-4 right-4 border-b-2 border-r-2",
              ].map((c, i) => (
                <div key={i} className={`absolute w-8 h-8 border-accent rounded-md ${c}`} />
              ))}
              {/* Scan line */}
              <div className="absolute inset-x-12 top-0 bottom-0 overflow-hidden">
                <div className="scan-line h-12 w-full" />
              </div>
            </div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/20 backdrop-blur-md text-xs mono text-primary-foreground border border-primary-foreground/20">
              {phase === "scanning" ? "POSICIONE O ROSTO" : `ANALISANDO ${progress}%`}
            </div>
          </>
        )}

        {phase === "analyzing" && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-background/20">
            <div className="h-full gradient-accent transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        )}

        {phase === "success" && (
          <div className="absolute inset-0 grid place-items-center bg-success/30 backdrop-blur-sm animate-fade-up">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 mx-auto rounded-full bg-success grid place-items-center">
                <CheckCircle2 className="w-12 h-12 text-success-foreground" />
              </div>
              <p className="font-display text-xl font-bold text-primary-foreground">Identidade confirmada</p>
            </div>
          </div>
        )}

        {phase === "error" && (
          <div className="absolute inset-0 grid place-items-center p-8 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-destructive grid place-items-center">
                <X className="w-8 h-8 text-destructive-foreground" />
              </div>
              <p className="text-sm text-primary-foreground/90 max-w-xs">{error}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        {phase === "idle" || phase === "error" ? (
          <Button size="lg" onClick={start} className="gap-2 gradient-accent text-accent-foreground hover:opacity-90 shadow-glow">
            <Camera className="w-4 h-4" />
            {label}
          </Button>
        ) : phase === "scanning" ? (
          <Button size="lg" onClick={capture} className="gap-2 gradient-accent text-accent-foreground hover:opacity-90 shadow-glow">
            <ScanFace className="w-4 h-4" />
            Capturar e validar
          </Button>
        ) : (
          <Button size="lg" disabled className="gap-2">
            Processando…
          </Button>
        )}
      </div>
    </div>
  );
}
