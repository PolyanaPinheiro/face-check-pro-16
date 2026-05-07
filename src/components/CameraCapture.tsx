import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, Check, X } from "lucide-react";
import { toast } from "sonner";

type Props = {
  onCapture: (dataUrl: string) => void;
  onCancel?: () => void;
};

export default function CameraCapture({ onCapture, onCancel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const start = async (mode: "user" | "environment") => {
    try {
      stop();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setReady(true);
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível acessar a câmera. Verifique as permissões.");
    }
  };

  const stop = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setReady(false);
  };

  useEffect(() => {
    start(facingMode);
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flip = async () => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    await start(next);
  };

  const snap = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPreview(dataUrl);
    stop();
  };

  const retake = async () => {
    setPreview(null);
    await start(facingMode);
  };

  const confirm = () => {
    if (preview) {
      onCapture(preview);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary border">
        {preview ? (
          <img src={preview} alt="Pré-visualização" className="w-full h-full object-cover" />
        ) : (
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-2 justify-end flex-wrap">
        {preview ? (
          <>
            <Button variant="outline" onClick={retake} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Refazer
            </Button>
            <Button onClick={confirm} className="gap-2 gradient-accent text-accent-foreground">
              <Check className="w-4 h-4" /> Usar foto
            </Button>
          </>
        ) : (
          <>
            {onCancel && (
              <Button variant="ghost" onClick={() => { stop(); onCancel(); }} className="gap-2">
                <X className="w-4 h-4" /> Cancelar
              </Button>
            )}
            <Button variant="outline" onClick={flip} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Trocar câmera
            </Button>
            <Button onClick={snap} disabled={!ready} className="gap-2">
              <Camera className="w-4 h-4" /> Capturar
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
