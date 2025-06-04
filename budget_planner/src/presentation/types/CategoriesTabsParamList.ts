import { CategoryType } from "../../domain/enums/CategoryType";

export type CategoriesTabsParamList = {
    Income: { type: CategoryType.Income };
    Expenses: { type: CategoryType.Expense };
};