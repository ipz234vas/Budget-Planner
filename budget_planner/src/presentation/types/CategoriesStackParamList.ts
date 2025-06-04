import { CategoryType } from "../../domain/enums/CategoryType";

export type CategoriesStackParamList = {
    CategoryEditor: { id?: number | undefined, parentId: number | null, type: CategoryType };
};