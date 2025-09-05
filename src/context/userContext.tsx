import React, { createContext, useState, type ReactNode } from "react";
import axios from "axios";
import { toast } from "sonner";
import type { User } from "@/types/user";

interface UserContextType {
    user: User | undefined;
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    createSecret: (title: string, secret: string) => Promise<boolean>;
    alterSecret: (_id: string, title: string, secret: string) => Promise<boolean>;
    deleteSecret: (_id: string) => Promise<boolean>;

}

export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

export const UserProvider = ({ children }: { children: ReactNode }) => {

    // Se tiver com vontade, arrumar a ordem dos context e mudar a lógica de autenticação (não vou fazer kkkkkkk)
    const API_BASE_URL = "http://localhost:8000";
    const getHeaderConfig = () => {
        const token = localStorage.getItem("access");
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const [user, setUser] = useState<User | undefined>(undefined);

    async function createSecret(title: string, secret: string): Promise<boolean> {
        try {
            const header = getHeaderConfig();
            const response = await axios.post(
                `${API_BASE_URL}/secrets`,
                { title, secret },
                header
            );

            if (response.status === 200) {
                setUser((prevUser: any) => ({
                    ...prevUser,
                    secrets: [...(prevUser?.secrets || []), { title, secret }],
                }));
                toast.success("Segredo criado com sucesso!");
                return true;
            }

            return false;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Erro ao criar segredo";
            toast.error(message);
            return false;
        }
    }

    async function alterSecret(_id: string, title: string, secret: string): Promise<boolean> {
        try {
            const header = getHeaderConfig();

            const response = await axios.put(
                `${API_BASE_URL}/secrets/${_id}`,
                { title, secret },
                header
            );

            if (response.status === 200) {
                setUser((prevUser: any) => ({
                    ...prevUser,
                    secrets: prevUser.secrets.map((s: any) =>
                        s._id === _id ? { ...s, title, secret } : s
                    ),
                }));
                toast.success("Segredo alterado com sucesso!");
                return true;
            }

            return false;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Erro ao editar segredo";
            toast.error(message);
            return false;
        }
    }

    async function deleteSecret(_id: string) {
        try {
            const header = getHeaderConfig();
            const response = await axios.delete(
                `${API_BASE_URL}/secrets/${_id}`,
                header
            );

            if (response.status === 200) {
                setUser((prevUser: any) => ({
                    ...prevUser,
                    secrets: prevUser.secrets.filter((s: any) => s._id !== _id),
                }));
                toast.success("Segredo apagado com sucesso!");
                return true;
            }

            return false;
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Erro ao apagar segredo";
            toast.error(message);
            return false;
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser, createSecret, alterSecret, deleteSecret }}>
            {children}
        </UserContext.Provider>
    );
};
