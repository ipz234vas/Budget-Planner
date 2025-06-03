// contexts/CategorySessionProvider.tsx

import React, { createContext, useContext, useMemo } from "react";
import { CategoryEditSession } from "../sessions/CategoryEditSession";

const SessionContext = createContext<CategoryEditSession | null>(null);

export const CategorySessionProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const session = useMemo(
        () =>
            new CategoryEditSession(),
        []
    );

    return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};

export const useCategorySession = () => {
    const session = useContext(SessionContext);
    if (!session)
        throw new Error("useCategorySession must be used within the SessionContext");
    return session;
};
