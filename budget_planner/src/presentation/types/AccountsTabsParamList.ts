import { AccountType } from "../../domain/enums/AccountType";

export type AccountsTabsParamList = {
    Account: { type: AccountType.Account };
    Saving: { type: AccountType.Saving };
};