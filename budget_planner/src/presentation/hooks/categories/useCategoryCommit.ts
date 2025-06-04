import { useCallback } from "react";
import { Alert } from "react-native";
import { CategoryPersistenceService } from "../../../data/services/CategoryPersistenceService";
import { SQLiteService } from "../../../data/sqlite/SQLiteService";

export function useCategoryCommit({ repo, hierarchyTree, removedIds, onExit, updateDraftToTree, onSave }: {
    repo: any,
    hierarchyTree: any,
    removedIds: Set<number>,
    onExit: () => void,
    updateDraftToTree: () => Promise<void>,
    onSave: () => void
}) {
    const commitAllChangesAndExit = useCallback(async () => {
        try {
            onSave();
            await updateDraftToTree();
            if (!repo)
                return;
            const persistenceService = new CategoryPersistenceService(repo, await SQLiteService.getInstance());
            await persistenceService.commit(hierarchyTree, Array.from(removedIds));
            onExit();
        } catch (e) {
            Alert.alert("Помилка збереження", String(e));
        }
    }, [repo, hierarchyTree, removedIds, onExit, updateDraftToTree, onSave]);

    const saveAndExit = useCallback(async () => {
        onSave();
        await updateDraftToTree();
        onExit();
    }, [updateDraftToTree, onExit, onSave]);

    return { commitAllChangesAndExit, saveAndExit };
}
