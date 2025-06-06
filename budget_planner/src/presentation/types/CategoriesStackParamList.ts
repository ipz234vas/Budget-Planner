import { CategoryType } from "../../domain/enums/CategoryType";

export type CategoriesStackParamList = {
    Categories: {};
    CategoryEditor: { id?: number | undefined, parentId: number | null, type: CategoryType };
};