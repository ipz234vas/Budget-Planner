import { AccountType } from "../../../enums/AccountType";

export interface AccountInfo {
    id: number;
    name: string;
    icon?: string;
    color?: string;
    type: AccountType;
    currencyCode: string;
}