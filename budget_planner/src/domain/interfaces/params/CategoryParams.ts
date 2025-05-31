import { CategoryType } from "../../enums/CategoryType";

export interface CategoryParams {
    id?: number;
    name: string;
    type: CategoryType;
    color?: string;
    icon?: string;
    parentId?: number | null;
}