import Header from "@/components/Header"
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Sector } from "recharts"
import { ShieldCheckIcon, LockIcon, UsersIcon, User } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"
import { useUser } from "@/hooks/useUser"
import { loadingSpinner } from "./PrivateRoute"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"
import { Separator } from "@radix-ui/react-separator"
import { useTheme } from "next-themes"
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
import type { DashboardUser } from "@/types/user"

function confirmDeleteUserDialog({ children, user }: { children: ReactNode, user: DashboardUser }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        A conta associada a <strong>{user.name}</strong> e <strong>{user.email}</strong> será deletada permanentemente.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="text-foreground">Cancelar</AlertDialogCancel>

                    <AlertDialogAction asChild>
                        <Button className="bg-destructive/80 text-white hover:bg-destructive">
                            Deletar conta
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default function Dashboard() {

    const { fetchDashboardUsers, dashboardUsers, user } = useUser();
    const { isAuthenticated, loadingAuth } = useAuth();
    const { theme } = useTheme();
    const dateTime = new Date();

    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
    };

    useEffect(() => {
        fetchDashboardUsers()
    }, [])


    useEffect(() => {
        if (loadingAuth) return;
        if (isAuthenticated === false || (user?.role !== "admin" && user?.role !== "owner")) {
            window.history.back();
        }
    }, [isAuthenticated, loadingAuth]);

    const stats = {
        totaldashboardUsers: dashboardUsers.length,
        totalUsers: dashboardUsers.filter(u => u.role === "user").length,
        totalAdmins: dashboardUsers.filter(u => u.role === "admin").length,
        totalOwners: dashboardUsers.filter(u => u.role === "owner").length,
        totalSecrets: dashboardUsers.reduce((acc, u) => acc + u.count_secrets, 0),
    };

    const roleData = [
        { name: "owner", value: stats.totalOwners, fill: "var(--chart-3)" },
        { name: "admin", value: stats.totalAdmins, fill: "var(--chart-1)" },
        { name: "user", value: stats.totalUsers, fill: "var(--chart-2)" },
    ];

    const secretsData = dashboardUsers.map(u => ({
        name: u.name,
        secrets: u.count_secrets,
    }));

    const RolesConfig = {
        admin: {
            label: "Admins",
            color: "var(--chart-1)",
        },
        user: {
            label: "Usuário",
            color: "var(--chart-2)",
        },
        owner: {
            label: "Dono",
            color: "var(--chart-3)",
        },
        other: {
            label: "Other",
            color: "var(--chart-4)",
        },
    } satisfies ChartConfig

    const SecretsConfig = {
        secrets: {
            label: "Admins",
        },
        user: {
            label: "Usuário",
        },
        owner: {
            label: "Dono",
        },
        other: {
            label: "Other",
        },
    } satisfies ChartConfig

    const COLORS = ["var(--chart-5)", "var(--chart-4)", "var(--chart-3)", "var(--chart-2)", "var(--chart-1)"]

    return (
        <div className="w-screen bg-secondary min-h-screen overflow-x-hidden">
            <Header />
            <div className="px-48 py-6 flex mt-8 flex-col gap-8 w-full">
                <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>

                {/* Tabela de Usuários */}
                <Card>
                    <CardHeader>
                        <span className="text-lg font-semibold">Usuários</span>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Avatar</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Secrets</TableHead>
                                    <TableHead>Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dashboardUsers.map(Dashuser => (
                                    <TableRow key={Dashuser.email}>
                                        <TableCell>
                                            <img src={Dashuser.img} alt="avatar" className="w-10 h-10 rounded-full" />
                                        </TableCell>
                                        <TableCell>{Dashuser.name}</TableCell>
                                        <TableCell>{Dashuser.email}</TableCell>
                                        <TableCell
                                            className={
                                                Dashuser.role === "admin"
                                                    ? "text-green-600 font-semibold"
                                                    : Dashuser.role === "owner"
                                                        ? "text-red-600 font-semibold"
                                                        : ""
                                            }
                                        >
                                            {Dashuser.role}
                                        </TableCell>
                                        <TableCell>{Dashuser.count_secrets}</TableCell>
                                        <TableCell className={`flex gap-4 items-center ${theme}`}>
                                            {Dashuser?.role !== "owner" && (
                                                <Select value={Dashuser.role} onValueChange={(val) => console.log(val)}>
                                                    <SelectTrigger className="w-[180px] !h-8 bg-card">
                                                        <SelectValue placeholder="Selecione uma role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Roles</SelectLabel>
                                                            <SelectItem value="user">Usuário</SelectItem>
                                                            <SelectItem value="admin">Administrador</SelectItem>
                                                            {user?.role === "owner" && (
                                                                <SelectItem value="owner">Dono</SelectItem>
                                                            )}
                                                        </SelectGroup>

                                                    </SelectContent>
                                                </Select>
                                            )}
                                            {Dashuser.email !== user?.email && user?.role === "owner" && (
                                                confirmDeleteUserDialog({
                                                    children: <Button variant="destructive" size="sm" className="ml-2 h-8 flex items-center">Deletar conta</Button>,
                                                    user: Dashuser
                                                })
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Cards de métricas */}
                <div className="grid grid-cols-4 gap-6">
                    <Card className="gap-0.5 justify-between">
                        <CardHeader>
                            <CardTitle>
                                Total de Usuários
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.totaldashboardUsers}</p>
                        </CardContent>
                    </Card>

                    <Card className="gap-0.5 justify-between">
                        <CardHeader>
                            <CardTitle>
                                Total de administradores
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.totalAdmins}</p>
                        </CardContent>
                    </Card>

                    <Card className="gap-0.5 justify-between">
                        <CardHeader>
                            <CardTitle>
                                Total de owners
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.totalOwners}</p>
                        </CardContent>
                    </Card>

                    <Card className="gap-0.5 justify-between">
                        <CardHeader>
                            <CardTitle>
                                Total de segredos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.totalSecrets}</p>
                        </CardContent>
                    </Card>

                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-3 gap-6">
                    {[0, 1, 2].map(() => (
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribuição de Roles</CardTitle>
                                <CardDescription>{dateTime.toLocaleDateString("pt-BR", options)}</CardDescription>
                                <Separator orientation="horizontal" className="border-b mt-2" />
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={RolesConfig}
                                    className="mx-auto aspect-square max-h-[250px]"
                                >
                                    <PieChart>
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent hideLabel />}
                                        />
                                        <Pie
                                            data={roleData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={60}
                                            strokeWidth={5}
                                            activeIndex={0}
                                            activeShape={({
                                                outerRadius = 0,
                                                ...props
                                            }: PieSectorDataItem) => (
                                                <Sector {...props} outerRadius={outerRadius + 10} />
                                            )}
                                        />
                                    </PieChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    ))}
                    <Card className="col-span-3">
                        <CardHeader>
                            <span className="text-lg font-semibold">Secrets por Usuário</span>
                        </CardHeader>
                        <CardContent className="h-full">
                            <ChartContainer
                                config={SecretsConfig}
                                className="mx-auto w-full max-h-[250px]"
                            >
                                <BarChart data={secretsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="secrets">
                                        {secretsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>



            </div>
        </div>
    )
}
