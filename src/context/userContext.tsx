import React, { createContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { toast } from "sonner";
import type { User } from "@/types/user";

interface UserContextType {
    user: User | undefined;
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    createSecret: (title: string, secret: string) => Promise<boolean>;
    alterSecret: (_id: string, title: string, secret: string) => Promise<boolean>;
    deleteSecret: (_id: string) => Promise<boolean>;
    alterProfileData: (id: string, name: string, img: string) => Promise<boolean>;
    fetchUserData: () => void;
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
                fetchUserData();
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
                fetchUserData();
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
                fetchUserData();
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

    async function alterProfileData(_id: string, name: string, img: string): Promise<boolean> {
        if (!name && !img) { toast.error("Dados inválidos"); return false }

        const data = {
            name: name || '',
            img: img || ''
        }

        const header = getHeaderConfig();
        const response = await axios.put(`${API_BASE_URL}/user/${_id}`, data, header);
        if (response.status === 200) {
            setUser(response.data)
            toast.success("Dados atualizados com sucesso")
            return true
        }
        console.log(response)
        toast.error("Ocorreu um erro ao editar o perfil.")
        return false
    }

    async function fetchUserData() {
        try {
            const header = getHeaderConfig();
            const response = await axios.get(
                `${API_BASE_URL}/user`,
                header
            );
            if (response.status === 200) {
                console.log(response.data);
                setUser(response.data)
            }
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Erro ao buscar informações do usuario";
            toast.error(message);
        }
    }

    useEffect(() => {
        console.log(user);
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, createSecret, alterSecret, deleteSecret, alterProfileData, fetchUserData }}>
            {children}
        </UserContext.Provider>
    );
};
