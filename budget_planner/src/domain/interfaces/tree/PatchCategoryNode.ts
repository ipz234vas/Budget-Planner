import { Category } from "../../models/Category";

export interface PatchCategoryNode extends Category {
    children: PatchCategoryNode[];
}