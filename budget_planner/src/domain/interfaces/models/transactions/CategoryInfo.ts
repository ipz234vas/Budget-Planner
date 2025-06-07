import { CategoryType } from "../../../enums/CategoryType";

export interface CategoryInfo {
    id: number;
    name: string;
    icon?: string;
    color?: string;
    type: CategoryType;
    parent?: CategoryInfo;
}