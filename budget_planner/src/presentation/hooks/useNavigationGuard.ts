import { useEffect } from "react";

export function useNavigationGuard({ navigation, hasUnsavedChanges, commandManager, scopeRef, parentId, session, }: {
    navigation: any,
    hasUnsavedChanges: boolean,
    commandManager: any,
    scopeRef: any,
    parentId: number | null,
    session: any,
}) {
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            if (hasUnsavedChanges) {
                commandManager.cancelScope(scopeRef.current);
            }
            if (parentId == null)
                session.clear();
        });
        return unsubscribe;
    }, [navigation, hasUnsavedChanges, commandManager, scopeRef, parentId, session]);
}
