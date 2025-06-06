import { AccountType } from "../../enums/AccountType";

export interface AccountParams {
    id?: number;
    name: string;
    type: AccountType;
    currentAmount: number;
    currencyCode: string;
    color?: string;
    icon?: string;
    creditLimit?: number | null;
    goalAmount?: number | null;
    goalDeadline?: string | null;
}