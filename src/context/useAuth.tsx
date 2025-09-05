import React, { createContext, useState, type ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface AuthContextType {
    API_BASE_URL: string;
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const API_BASE_URL = "http://localhost:8000";

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
            console.log(data);

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


    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout, API_BASE_URL }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
