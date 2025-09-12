import React, { createContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import type { RegisterData } from "@/types/auth";

interface AuthContextType {
    API_BASE_URL: string;
    loadingAuth: boolean;
    isAuthenticated: boolean | null;
    setIsAuthenticated: (value: boolean) => void;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<boolean>;
    logout: () => void;
    verifyFace: (img: string) => Promise<boolean>;
    getHeaderConfig: () => { headers: { Authorization: string | null } };
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const API_BASE_URL = "http://localhost:8000";
    const [loadingAuth, setloadingAuth] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const getHeaderConfig = () => {
        const token = localStorage.getItem("access");
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const { setUser, fetchUserData } = useUser();


    async function register(data: RegisterData): Promise<boolean> {
        if (!data) { toast.error("Preencha os campos obrigatórios"); return false }
        const header = getHeaderConfig();
        const response = await axios.post(`${API_BASE_URL}/user`, data, header);
        if (response.status === 200) {
            localStorage.setItem("access", response.data.token)
            setIsAuthenticated(true);
            fetchUserData()
            return true
        }
        return false
    }

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

    async function verifyFace(img: string): Promise<boolean> {
        const config = getHeaderConfig();
        const response = await axios.post(`${API_BASE_URL}/auth/verify`, { unknownB64: img }, config);
        return response.data
    }

    useEffect(() => {
        const refreshAccessToken = async () => {
            setloadingAuth(true)
            try {
                const response = await axios.put(`${API_BASE_URL}/auth/refresh_token/${token}`);
                const data = response.data;
                localStorage.setItem("access", data.token);
                setUser(data.user)
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
                console.error("Erro ao renovar token:", error);
            } finally {
                setloadingAuth(false)
            }
        };

        const token = localStorage.getItem("access");
        refreshAccessToken();
    }, []);


    useEffect(() => {
        console.log(isAuthenticated);
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated, setIsAuthenticated, login, register, logout,
            API_BASE_URL, getHeaderConfig, loadingAuth, verifyFace
        }}>
            {children}
        </AuthContext.Provider>
    )
}