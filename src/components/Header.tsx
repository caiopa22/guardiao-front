import { CogIcon, DoorOpenIcon, MoonIcon, ServerCog, SunIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { replace, useNavigate } from "react-router";
import { useTheme } from "../context/useTheme";
import { useAuth } from "@/context/useAuth";
import { toast } from "sonner";

export default function Header() {

    const navigate = useNavigate();

    const { theme, toggleTheme } = useTheme();
    const { logout } = useAuth();

    return (
        <section className="w-screen bg-sidebar px-48 py-6 flex justify-between items-center">
            <strong
                onClick={() => navigate("/vault")}
                className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent cursor-pointer">
                Guardião
            </strong>

            <div className="flex gap-4 h-6 items-center">
                <Avatar className="rounded-full">
                    <AvatarImage
                        src="https://github.com/evilrabbit.png"
                        alt="@evilrabbit"
                    />
                    <AvatarFallback>ER</AvatarFallback>
                </Avatar>
                <Separator orientation="vertical" />
                <Button
                    onClick={() =>
                        toast("Event has been created", {
                            description: "Sunday, December 03, 2023 at 9:00 AM",
                            action: {
                                label: "Undo",
                                onClick: () => console.log("Undo"),
                            },
                        })}
                size="icon" variant="ghost">
                    <CogIcon className="size-5 text-foreground" />
                </Button>

                <Button size="icon" variant="ghost">
                    <ServerCog className="size-5 text-foreground" />
                </Button>

                <Button
                    onClick={() => toggleTheme()}
                    size="icon"
                    variant="ghost">
                    {theme === 'dark' ? <MoonIcon className="size-5 text-foreground" /> : <SunIcon className="size-5 text-foreground" />}
                </Button>

                <Button
                    onClick={() => { logout(); navigate("/") }}
                    variant="ghost" className="flex items-center gap-1 text-destructive">
                    <DoorOpenIcon className="size-5" />
                    <p className="text-sm">Sair</p>
                </Button>
            </div>
        </section>
    )
}