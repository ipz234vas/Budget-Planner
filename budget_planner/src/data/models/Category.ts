import { CategoryType } from "../../domain/enums/CategoryType";
import { CategoryParams } from "../../domain/models/CategoryParams";

export class Category {
    public id?: number;
    public name: string = '';
    public type: CategoryType = CategoryType.Expense;
    public color?: string;
    public icon?: string;
    public parentId?: number | null = null;
    public isDeleted: boolean = false;

    constructor(params?: CategoryParams) {
        if (params) {
            this.id = params.id;
            this.name = params.name ?? '';
            this.type = params.type ?? CategoryType.Expense;
            this.color = params.color;
            this.icon = params.icon;
            this.parentId = params.parentId ?? null;
            this.isDeleted = params.isDeleted ?? false;
        }
    }
}