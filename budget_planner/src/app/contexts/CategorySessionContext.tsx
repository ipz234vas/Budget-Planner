import React, { createContext, useContext, useMemo } from "react";
import { CategoryHierarchyTree } from "../../domain/tree/CategoryHierarchyTree";
import { CommandManager } from "../../domain/commands/CommandManager";

interface CategorySession {
    hierarchyTree: CategoryHierarchyTree;
    commandManager: CommandManager;
    removedIds: Set<number>;
}

const SessionContext = createContext<CategorySession | null>(null);

export const CategorySessionProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                                     children,
                                                                                 }) => {
    const session = useMemo<CategorySession>(() => {
        return {
            hierarchyTree: new CategoryHierarchyTree(),
            commandManager: new CommandManager(),
            removedIds: new Set<number>(),
        };
    }, []);

    return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};

export function useCategorySession(): CategorySession {
    const session = useContext(SessionContext);
    if (session === null) {
        throw new Error("useCategorySession must be used within CategorySessionProvider.");
    }
    return session;
}