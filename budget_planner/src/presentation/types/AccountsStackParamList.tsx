import { AccountType } from "../../domain/enums/AccountType";

export type AccountsStackParamList = {
    Accounts: {},
    AccountEditor: { id?: number | undefined, type: AccountType };
};