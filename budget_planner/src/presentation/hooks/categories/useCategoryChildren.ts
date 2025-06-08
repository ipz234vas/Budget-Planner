import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Category } from "../../../domain/models/Category";
import { CategoryViewService } from "../../services/CategoryViewService";

export function useCategoryChildren(categoryId?: number, viewService?: CategoryViewService) {
    const [childCategories, setChildCategories] = useState<Category[]>([]);

    useFocusEffect(
        useCallback(() => {
            let active = true;
            if (!viewService || !categoryId)
                return;
            (async () => {
                const items = await viewService.getChildren(categoryId);
                if (!active) return;
                setChildCategories(items);
            })();
            return () => {
                active = false;
            };
        }, [categoryId, viewService]),
    );

    const refreshChildren = useCallback(async () => {
        if (!viewService || !categoryId)
            return;
        setChildCategories(await viewService.getChildren(categoryId));
    }, [viewService, categoryId]);

    return { childCategories, setChildCategories, refreshChildren };
}
