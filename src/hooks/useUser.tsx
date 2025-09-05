import { UserContext } from "@/context/userContext";
import React from "react";

export const useUser = () => {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within an UserProvider");
    }
    return context;
}
