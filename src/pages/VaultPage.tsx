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



export function DialogDemo({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [open, setOpen] = useState(false)

  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();

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
      // se fechar, para a câmera
      if (stream) {
        stream.getTrack().forEach((track) => track.stop())
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

  useEffect(() => {
      if (isAuthenticated !== null && !isAuthenticated){
        navigate("/")
      }
  }, [isAuthenticated])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Verificação facial</DialogTitle>
          <DialogDescription>
            Posicione seu rosto dentro do círculo e aguarde a verificação.
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

        <DialogFooter>
          <Button
            onClick={() => navigate("/secrets")}
            className="w-full h-12 text-white">Tirar foto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function VaultPage() {

  const { user } = useUser();

  return (
    <div className="flex flex-col min-h-screen items-start  bg-secondary">
      <Header />
      <section className="px-48 py-6 flex flex-col gap-12 w-full h-full">
        <div className="flex mt-12 justify-between items-center w-full">
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
            <DialogDemo>
              <Button className="h-12 text-lg mt-4 text-white">
                Acessar meu cofre
              </Button>
            </DialogDemo>

          </Card>
          <div>

          </div>
        </div>
      </section>
    </div>
  )
}