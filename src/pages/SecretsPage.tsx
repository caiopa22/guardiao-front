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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/hooks/useUser";


export function OpenSecretDialog({ children, secret, title, id }: { children: React.ReactNode; secret: string, title: string, id: string }) {
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState<{ title: string, secret: string }>({ title: title, secret: secret });

    const { alterSecret } = useUser();

    useEffect(() => {
        if (open) {
            setValues({ title, secret })
        }
    }, [open, title, secret]);

    const { theme } = useTheme();

    const handleAlterData = async () => {
        if (!values.secret || !values.title) return;

        const ok: boolean = await alterSecret(id, values.title, values.secret);
        if (ok) {
            setOpen(false);
            setValues({ title: "", secret: "" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className={`sm:max-w-[600px] flex flex-col gap-8 ${theme}`}>
                <DialogHeader>
                    <DialogTitle className="text-foreground">Segredo</DialogTitle>
                    <DialogDescription>
                        {title}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-2 justify-center">
                    <Label>Título</Label>
                    <Input
                        autoFocus={false}
                        className=" shadow-none font-semibold focus:border-none focus:outline-0 text-foreground"
                        value={values.title}
                        onChange={(e) => setValues({ ...values, title: e.target.value })}
                    />
                </div>
                <div className="flex flex-col gap-2 justify-center">
                    <Label>Segredo</Label>
                    <Input
                        autoFocus={false}
                        className=" shadow-none font-semibold focus:border-none focus:outline-0 text-foreground"
                        value={values.secret}
                        onChange={(e) => setValues({ ...values, secret: e.target.value })}
                    />
                </div>

                <DialogFooter>
                    <Button
                        size="lg"
                        variant={values.secret !== secret || values.title !== title ? "success" : "disabled"}
                        disabled={values.secret === secret && values.title === title}
                        onClick={handleAlterData}
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
    const [values, setValues] = useState<{ title: string, secret: string }>({ title: '', secret: '' });
    const { theme } = useTheme();
    const { createSecret } = useUser();

    const handleCreate = async () => {
        if (!values.secret || !values.title) return;

        const ok: boolean = await createSecret(values.title, values.secret);
        if (ok) {
            setOpen(false);   // Fecha apenas se deu certo
            setValues({ title: "", secret: "" }); // limpa inputs
        }
    };


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
                        <Input id="secretTitle" placeholder="Título"
                            value={values.title}
                            onChange={(e) => setValues({ ...values, title: e.target.value })}
                        />
                    </div>
                    <div className="grid w-full items-center gap-2">
                        <Label className="ml-2 text-foreground">Segredo</Label>
                        <Input type="password" id="secret" placeholder="Segredo"
                            value={values.secret}
                            onChange={(e) => setValues({ ...values, secret: e.target.value })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        size="lg"
                        variant={values.secret && values.title ? 'success' : 'disabled'}
                        onClick={handleCreate}
                    >
                        Criar segredo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function ConfirmDeleteSecret({ children, title, id }: { children: React.ReactNode; title: string, id: string }) {

    const { deleteSecret } = useUser();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Seu segredo será apagado permanentemente.
                    </AlertDialogDescription>
                    <AlertDialogDescription>
                        {title}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="text-foreground">Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive hover:bg-destructive" onClick={() => deleteSecret(id)}>Apagar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default function SecretsPage() {

    const { user } = useUser();

    const secretCard = (title: string) => {
        return (
            <Card className="cursor-pointer hover:bg-accent transition w-full">
                <CardContent className="flex justify-between items-center ">
                    <div>
                        <h1 className="font-semibold text-lg">{title}</h1>
                        <p className="text-sm text-muted-foreground">Criado dia 2 de março, 15h23</p>
                    </div>
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
                    {user?.secrets.map((secret) => (
                        <div className="flex items-center gap-4 w-full">
                            <OpenSecretDialog key={secret._id} id={secret._id} title={secret.title} secret={secret.secret}>
                                {secretCard(secret.title)}
                            </OpenSecretDialog>
                            <ConfirmDeleteSecret id={secret._id} title={secret.title} key={secret._id}>
                                <Button size='icon' variant="destructive">
                                    <TrashIcon />
                                </Button>
                            </ConfirmDeleteSecret>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}