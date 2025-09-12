import Header from "@/components/Header"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ShieldCheckIcon, LockIcon, UsersIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useUser } from "@/hooks/useUser"
import { loadingSpinner } from "./PrivateRoute"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router"

export default function Dashboard() {

    const { fetchDashboardUsers, dashboardUsers } = useUser();
    const { isAuthenticated, loadingAuth } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            setLoading(true)
            try {
                fetchDashboardUsers() // espera os dados carregarem
            } finally {
                setLoading(false)
            }
        }
        loadDashboard()
    }, [])


    useEffect(() => {
        if (loadingAuth) return;
        if (isAuthenticated === false) {
            navigate("/");
        }
    }, [isAuthenticated, loadingAuth]);



    const stats = {
        totaldashboardUsers: dashboardUsers.length,
        totalAdmins: dashboardUsers.filter(u => u.role === "admin").length,
        totalSecrets: dashboardUsers.reduce((acc, u) => acc + u.count_secrets, 0),
    };

    const roleData = [
        { name: "Admins", value: stats.totalAdmins },
        { name: "Users", value: stats.totaldashboardUsers - stats.totalAdmins },
    ];

    const secretsData = dashboardUsers.map(u => ({
        name: u.name,
        secrets: u.count_secrets,
    }));

    const COLORS = ["#8884d8", "#82ca9d"]

    return (
        <div className="w-screen bg-secondary min-h-screen overflow-x-hidden">
            <Header />
            <div className="px-48 py-6 flex mt-8 flex-col gap-8 w-full">
                <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>

                {/* Cards de métricas */}
                <div className="grid grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <span className="text-lg font-semibold">Total de Usuários</span>
                            <UsersIcon className="text-primary" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.totaldashboardUsers}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <span className="text-lg font-semibold">Admins</span>
                            <ShieldCheckIcon className="text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.totalAdmins}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <span className="text-lg font-semibold">Secrets</span>
                            <LockIcon className="text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.totalSecrets}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-2 gap-6 h-169">
                    <Card>
                        <CardHeader>
                            <span className="text-lg font-semibold">Distribuição de Roles</span>
                        </CardHeader>
                        <CardContent className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={roleData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
                                        {roleData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <span className="text-lg font-semibold">Distribuição de Roles</span>
                        </CardHeader>
                        <CardContent className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={roleData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
                                        {roleData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="col-span-2">
                        <CardHeader>
                            <span className="text-lg font-semibold">Secrets por Usuário</span>
                        </CardHeader>
                        <CardContent className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={secretsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="secrets" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

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
                                {dashboardUsers.map(user => (
                                    <TableRow key={user.email}>
                                        <TableCell>
                                            <img src={user.img} alt="avatar" className="w-10 h-10 rounded-full" />
                                        </TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className={user.role === "admin" ? "text-green-600 font-semibold" : ""}>
                                            {user.role}
                                        </TableCell>
                                        <TableCell>{user.count_secrets}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" className="text-foreground" size="sm">Alterar permissão</Button>
                                            <Button variant="destructive" size="sm" className="ml-2">Excluir</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
