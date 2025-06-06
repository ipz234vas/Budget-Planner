import { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FactoryContext } from "../../../app/contexts/FactoryContext";
import { CategoryService } from "../../../domain/services/CategoryService";
import { Category } from "../../../domain/models/Category";
import { CategoryType } from "../../../domain/enums/CategoryType";

export function useCategories(type: CategoryType) {
    const factory = useContext(FactoryContext);
    const [categories, setCategories] = useState<Category[]>([]);
    const [service, setService] = useState<CategoryService | null>(null);

    useEffect(() => {
        if (factory) {
            const repo = factory.getRepository(Category);
            setService(new CategoryService(repo));
        }
    }, [factory]);

    const updateCategories = useCallback(async () => {
        if (service) {
            const result = await service.getRootCategories(type);
            setCategories(result);
        }
    }, [service, type]);

    useFocusEffect(
        useCallback(() => {
            updateCategories();
        }, [updateCategories])
    );

    const deleteCategory = useCallback(async (id?: number) => {
        if (id && service) {
            await service.deleteCategory(id);
            await updateCategories();
        }
    }, [service, updateCategories]);

    return { categories, deleteCategory };
}
