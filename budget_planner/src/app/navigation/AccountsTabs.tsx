import React from "react";
import { GenericTopTabs } from "./GenericTopTabs";
import { AccountsTabsParamList } from "../../presentation/types/AccountsTabsParamList";
import AccountsScreen from "../../presentation/screens/AccountsScreen";
import { AccountType } from "../../domain/enums/AccountType";

export default function AccountsTabs() {
    return (
        <GenericTopTabs<AccountsTabsParamList>
            tabParamList={{} as AccountsTabsParamList}
            screens={[
                {
                    name: "Account",
                    title: "Рахунки",
                    component: AccountsScreen,
                    initialParams: { type: AccountType.Account },
                },
                {
                    name: "Saving",
                    title: "Банки",
                    component: AccountsScreen,
                    initialParams: { type: AccountType.Saving },
                },
            ]}
        />
    );
}
