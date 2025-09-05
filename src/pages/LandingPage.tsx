import { useNavigate } from "react-router"
import { Button } from "../components/ui/button"

export default function LandingPage() {
  const navigate = useNavigate() 

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        Guardião
      </h1>
      <p className="mt-4 text-muted-foreground max-w-md">
        Bem-vindo ao Guardião! Sua plataforma segura para armazenar segredos e
        acessar seu cofre digital.
      </p>

      <Button
        className="mt-8"
        size="lg"
        onClick={() => navigate("/access")}
      >
        Entrar
      </Button>
    </div>
  )
}
