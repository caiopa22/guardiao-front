import { useAuth } from "@/hooks/useAuth";
import { LoaderCircleIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Navigate } from "react-router";


export const loadingSpinner = () => {
    return (
        <main className="w-screen h-screen flex justify-center items-center bg-secondary">
            <LoaderCircleIcon color="oklch(0.546 0.245 262.881)" className="animate-spin" size={56}/>
        </main>
    )
}

export default function PrivateRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, loadingAuth } = useAuth();
    if (loadingAuth) return loadingSpinner();
    if (!isAuthenticated) return <Navigate to="/"/>
    return children
}
