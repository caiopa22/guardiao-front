import { ArrowBigRight, CircleUserRoundIcon, ShieldCheckIcon, VaultIcon } from "lucide-react";
import Header from "../components/Header";
import { Card, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { useTheme } from "next-themes";



export function FaceAuthenticationDialog({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme();

  const { verifyFace, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const dataUrl = canvas.toDataURL("image/jpeg")
    setLoading(true)

    try {
      const verified = await verifyFace(dataUrl)
      if (verified && isAuthenticated) {
        if (verified && isAuthenticated) {
          navigate("/secrets", { state: { fromFaceAuth: true } });
          toast.success("Usuário identificado!");
        }

      } else {
        toast.error("Usuário não identificado")
      }
    } catch (err) {
      console.error(err)
      toast.error("Erro ao verificar o rosto")
    } finally {
      setLoading(false)
    }
  }

  // Inicia/para a câmera
  useEffect(() => {
    let stream: MediaStream | null = null

    async function startWebcam() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error("Erro ao acessar a webcam:", err)
      }
    }

    if (open) {
      startWebcam()
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        stream = null
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={`sm:max-w-[600px] ${theme}`}>
        <DialogHeader>
          <DialogTitle className="text-foreground">Verificação facial</DialogTitle>
          <DialogDescription>
            Posicione seu rosto dentro do círculo e clique no botão para verificar.
          </DialogDescription>
        </DialogHeader>

        {/* Webcam */}
        <div className="flex justify-center items-center">
          <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-primary flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Canvas oculto só pra capturar o frame */}
        <canvas ref={canvasRef} className="hidden" />

        <DialogFooter >
          <div className="flex flex-col gap-2 w-full">
            <Button
              onClick={handleCapture}
              disabled={loading}
              className="w-full h-12 text-white"
            >
              {loading ? "Verificando..." : "Tirar foto"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function VaultPage() {

  const { user } = useUser();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, loadingAuth } = useAuth()

  useEffect(() => {
    if (loadingAuth) return;
    if (isAuthenticated === false) {
      navigate("/");
    }
  }, [isAuthenticated, loadingAuth]);

  return (
    <div className={`${theme} flex flex-col min-h-screen items-start bg-secondary`}>
      <Header />
      <section className="px-48 py-6 flex flex-col gap-12 w-full h-full">
        <div className="flex mt-8 justify-between items-center w-full">
          <div>
            <h1 className="text-2xl font-semibold  text-foreground">Olá, {user?.name}!</h1>
            <h1 className="text-xl  text-muted-foreground">Seja bem vindo ao seu cofre seguro.</h1>
          </div>
          <ShieldCheckIcon color="oklch(0.546 0.245 262.881)" size={48} />
        </div>
        <div>
          <Card className="flex flex-col items-center justify-center gap-4 w-full py-24 ">
            <VaultIcon color="gray" size={96} strokeWidth={1.5} />
            <div className="w-full flex flex-col items-center gap-2">
              <h1 className="font-bold text-3xl">Cofre digital</h1>
              <p className="font-md w-1/3 text-center">
                Guarde suas informações de maneira segura dentro do seu cofre utilizando reconhecimento facial.</p>
            </div>
            <FaceAuthenticationDialog>
              <Button className="h-12 text-lg mt-4 text-white">
                Acessar meu cofre
              </Button>
            </FaceAuthenticationDialog>

          </Card>
          <div>

          </div>
        </div>
      </section>
    </div>
  )
}