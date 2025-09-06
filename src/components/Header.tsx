import { CogIcon, DoorOpenIcon, Edit, MoonIcon, ServerCog, SunIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { replace, useNavigate } from "react-router";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import type React from "react";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";


const UserMenu = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { theme } = useTheme();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent className={`${theme}`}>
                <DropdownMenuLabel>Meu perfil</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <EditProfileDialog>
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()} // evita que o menu feche
                    >
                        Editar perfil
                    </DropdownMenuItem>
                </EditProfileDialog>
                <DropdownMenuItem
                    className="text-destructive hover:text-destructive"
                    onClick={() => { logout(); navigate("/") }}
                >Sair</DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const EditProfileDialog = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const { user, createSecret } = useUser();
    const [values, setValues] = useState<{ name: string, img: string, email: string }>({ name: user!.name, img: '', email: user!.email });
    const { theme } = useTheme();


    const handleCreate = async () => {
        if (!values.secret || !values.title) return;

        const ok: boolean = await createSecret(values.title, values.secret);
        if (ok) {
            setOpen(false);
            setValues({ title: "", secret: "" });
        }
    };


    return (
        <Dialog>
            <DialogTrigger className="w-full">{children}</DialogTrigger>
            <DialogContent className={`${theme}`}>
                <DialogHeader>
                    <DialogTitle className="text-foreground">Editar perfil</DialogTitle>
                    <DialogDescription>
                        Aqui você pode editar seu perfil.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-6">
                    <div className="flex w-full justify-between items-center">
                        <Label className="ml-2 text-foreground">Imagem de perfil</Label>
                        <Avatar className="cursor-pointer size-12">
                            <AvatarImage
                                src="https://github.com/evilrabbit.png"
                                alt="@evilrabbit"
                            />
                            <AvatarFallback>ER</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="grid w-full items-center gap-2">
                        <Label className="ml-2 text-foreground">Nome</Label>
                        <Input id="name" placeholder="Nome de usuário"
                            value={values.name}
                            onChange={(e) => setValues({ ...values, name: e.target.value })}
                        />
                    </div>
                    <Separator />
                    <div className="grid w-full items-center gap-4">
                        <Label className="ml-2 text-foreground">Email</Label>
                        <Label className="ml-2 text-muted-foreground font-normal">{user?.email && user.email}</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant={values.name !== user!.name ? 'success' : 'disabled'}
                        disabled={values.name === user!.name}
                    >
                        Salvar alterações
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Header() {

    const navigate = useNavigate();

    const { theme, toggleTheme } = useTheme();
    const { user } = useUser();

    function capitalize(str: string): string {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }



    return (
        <section className="w-screen bg-sidebar px-48 py-6 flex justify-between items-center">
            <strong
                onClick={() => navigate("/vault")}
                className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent cursor-pointer">
                Guardião
            </strong>

            <div className="flex gap-4 h-6 items-center">
                <UserMenu>
                    <div className="flex items-center justify-center gap-2 hover:bg-input p-2 rounded-lg cursor-pointer transition">
                        <Avatar className="cursor-pointer">
                            <AvatarImage
                                src="https://github.com/evilrabbit.png"
                                alt="@evilrabbit"
                            />
                            <AvatarFallback>ER</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start justify-start">
                            <h1
                                className="font-semibold text-sm text-foreground"
                            >{user?.name}</h1>
                            <p className="text-muted-foreground -mt-1 text-sm">{user?.role && capitalize(user!.role)}</p>
                        </div>
                    </div>
                </UserMenu>

                <Separator orientation="vertical" />

                <Button size="icon" variant="ghost">
                    <ServerCog className="size-5 text-foreground" />
                </Button>

                <Button
                    onClick={() => toggleTheme()}
                    size="icon"
                    variant="ghost">
                    {theme === 'dark' ? <MoonIcon className="size-5 text-foreground" /> : <SunIcon className="size-5 text-foreground" />}
                </Button>

            </div>
        </section>
    )
}