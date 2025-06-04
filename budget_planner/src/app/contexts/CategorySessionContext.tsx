import React, { createContext, useContext, useMemo } from "react";
import { CategorySession } from "./CategorySession";

const SessionContext = createContext<CategorySession | null>(null);


export const CategorySessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const session = useMemo(() => new CategorySession(), []);
    return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};

export function useCategorySession(): CategorySession {
    const session = useContext(SessionContext);
    if (session === null) {
        throw new Error("useCategorySession must be used within CategorySessionProvider.");
    }
    return session;
}