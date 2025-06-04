import { useState, useCallback } from "react";
import { Category } from "../../../domain/models/Category";
import { UpdateCategoryCommand } from "../../../domain/commands/UpdateCategoryCommand";

export function useCategoryDraft(
    initial: Category | null,
    hierarchyTree: any,
    commandManager: any,
    viewService: any
) {
    const [categoryDraft, setCategoryDraft] = useState<Partial<Category>>({ ...initial });
    const [category, setCategory] = useState<Category | null>(initial);

    const updateDraftToTree = useCallback(async () => {
        if (!categoryDraft || !category?.id)
            return;
        commandManager.run(new UpdateCategoryCommand(hierarchyTree, category.id, categoryDraft));
        const updated = await viewService?.getById(category.id);
        setCategory(updated ?? null);
    }, [categoryDraft, category, commandManager, hierarchyTree, viewService]);

    const setCategoryAndDraft = useCallback((category: Category | null) => {
        setCategory(category);
        setCategoryDraft({ ...category });
    }, []);

    return {
        category,
        categoryDraft,
        setCategoryDraft,
        setCategoryAndDraft,
        updateDraftToTree,
    };
}
