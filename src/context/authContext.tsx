import React, { createContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";

interface AuthContextType {
    API_BASE_URL: string;
    isAuthenticated: boolean | null;
    setIsAuthenticated: (value: boolean) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    getHeaderConfig: () => { headers: { Authorization: string | null } };
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const API_BASE_URL = "http://localhost:8000";

    const getHeaderConfig = () => {
        const token = localStorage.getItem("access");
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const { setUser } = useUser();



    const [isAuthenticated, setIsAuthenticated] = useState<boolean| null>(null);

    async function login(email: string, password: string) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/auth/login`,
                { email, password },
                { withCredentials: true }
            );
            const data = response.data;
            localStorage.setItem("access", data.token);
            setIsAuthenticated(true);
            toast.success("Login realizado com sucesso!");
            setUser(data.user)

        } catch (error: any) {
            setIsAuthenticated(false);
            const message = error.response?.data?.message || "Erro ao fazer login";
            toast.error(message);
            console.error("Login error:", error);
        }
    }

    function logout(): void {
        localStorage.removeItem("access");
        setIsAuthenticated(false);
    }

    useEffect(() => {
        const refreshAccessToken = async () => {
            try {
                const response = await axios.put(`${API_BASE_URL}/auth/refresh_token/${token}`);
                const data = response.data;
                console.log(response)
                localStorage.setItem("access", data.token);
                setUser(data.user)
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
                console.error("Erro ao renovar token:", error);
            }
        };

        const token = localStorage.getItem("access");
        refreshAccessToken();
    }, []);


    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout, API_BASE_URL, getHeaderConfig }}>
            {children}
        </AuthContext.Provider>
    )
}