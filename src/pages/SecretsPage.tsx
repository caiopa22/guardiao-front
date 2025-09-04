import { PencilIcon, PlusIcon, Trash, TrashIcon, } from "lucide-react";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
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
import { useState } from "react";
import { useTheme } from "../context/useTheme";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";


export function OpenSecretDialog({ children, secret }: { children: React.ReactNode; secret: string }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string>(secret);
    const { theme } = useTheme();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className={`sm:max-w-[600px] flex flex-col gap-8 ${theme}`}>
                <DialogHeader>
                    <DialogTitle className="text-foreground">Segredo</DialogTitle>
                    <DialogDescription>
                        Senha para destruir o universo
                    </DialogDescription>
                </DialogHeader>
                <div className=" flex items-center justify-center p-6 rounded-md shadow border">
                    <Input
                        autoFocus={false}
                        className=" border-0 shadow-none font-semibold focus:border-none focus:outline-0 text-foreground"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>

                <DialogFooter>
                    <Button
                        size="lg"
                        className={value !== secret ? '' : 'text-foreground'}
                        variant={value !== secret ? 'success' : 'disabled'}
                        disabled={value === secret}
                    >
                        Salvar alterações
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function OpenCreateSecretDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string>('');
    const { theme } = useTheme();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className={`sm:max-w-[600px] flex flex-col gap-8 ${theme}`}>
                <DialogHeader>
                    <DialogTitle className="text-foreground">Criar segredo</DialogTitle>
                    <DialogDescription>
                        Senha para destruir o universo
                    </DialogDescription>
                </DialogHeader>
                <div className=" flex flex-col gap-4 'items-center justify-center ">
                    <div className="grid w-full items-center gap-2">
                        <Label className="ml-2 text-foreground">Título do segredo</Label>
                        <Input id="secretTitle" placeholder="Título" />
                    </div>
                    <div className="grid w-full items-center gap-2">
                        <Label className="ml-2 text-foreground">Segredo</Label>
                        <Input type="password" id="secret" placeholder="Segredo" />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        size="lg"
                        variant="success"
                    >
                        Criar segredo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function SecretsPage() {


    const secretCard = () => {
        return (
            <Card className="cursor-pointer hover:bg-accent transition">
                <CardContent className="flex justify-between items-center ">
                    <div>
                        <h1 className="font-semibold text-lg">Senha para destruir o universo</h1>
                        <p className="text-sm text-muted-foreground">Criado dia 2 de março, 15h23</p>
                    </div>
                    <Button className="z-50" onClick={() => console.log("Olá")} size='icon' variant="destructive">
                        <TrashIcon />
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="w-screen bg-secondary min-h-screen">
            <Header />
            <section className="px-48 flex flex-col gap-12">
                <div className="flex mt-12 justify-between items-center">
                    <h1 className="  scroll-m-20 text-2xl font-semibold tracking-tight font-poppins text-balance text-foreground">Seus segredos</h1>
                    <OpenCreateSecretDialog>
                        <Button size="lg" className="text-white">
                            Criar novo segredo
                            <PlusIcon />
                        </Button>
                    </OpenCreateSecretDialog>
                </div>
                <div className="flex flex-col gap-2">
                    {[1, 2, 3, 4, 5].map(() => (
                        <OpenSecretDialog secret="J283J2MC2892312231">
                            {secretCard()}
                        </OpenSecretDialog>
                    ))}
                </div>
            </section>
        </div>
    )
}