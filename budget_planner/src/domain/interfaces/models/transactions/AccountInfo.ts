import { AccountType } from "../../../enums/AccountType";
import { Account } from "../../../models/Account";

export interface AccountInfo {
    id: number;
    name: string;
    icon?: string;
    color?: string;
    type: AccountType;
    currencyCode: string;
}

export function getAccountInfo(account: Account): AccountInfo {
    return { ...account } as AccountInfo;
}