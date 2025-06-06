import { TransactionType } from "../../enums/TransactionType";

export interface TransactionParams {
    id?: number;
    type?: TransactionType;
    amount?: number;
    currencyCode?: string;
    rate?: number | null;
    date?: string;
    time?: string;
    description?: string;
    fromAccountId?: number | null;
    toAccountId?: number | null;
    categoryId?: number | null;
}
