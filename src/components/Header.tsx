import { CogIcon, DoorOpenIcon, ServerCog } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

export default function Header() {
    return (
        <section className="w-screen bg-sidebar px-48 py-6 flex justify-between items-center">
            <strong className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
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
                <Button size="icon" variant="ghost">
                    <CogIcon className="size-5 text-foreground" />
                </Button>

                <Button size="icon" variant="ghost">
                    <ServerCog className="size-5 text-foreground" />
                </Button>

                <Button variant="ghost" className="flex items-center gap-1 text-destructive">
                    <DoorOpenIcon className="size-5" />
                    <p className="text-sm">Sair</p>
                </Button>
            </div>
        </section>
    )
}