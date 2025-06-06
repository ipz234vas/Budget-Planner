import React from "react";
import CategoriesScreen from "../../presentation/screens/CategoriesScreen";
import { CategoryType } from "../../domain/enums/CategoryType";
import { CategoriesTabsParamList } from "../../presentation/types/CategoriesTabsParamList";
import { GenericTopTabs } from "./GenericTopTabs";

export default function CategoriesTabs() {
    return (
        <GenericTopTabs<CategoriesTabsParamList>
            tabParamList={{} as CategoriesTabsParamList} // не обов’язково
            screens={[
                {
                    name: "Expenses",
                    title: "Витрати",
                    component: CategoriesScreen,
                    initialParams: { type: CategoryType.Expense },
                },
                {
                    name: "Income",
                    title: "Надходження",
                    component: CategoriesScreen,
                    initialParams: { type: CategoryType.Income },
                },
            ]}
        />
    );
}
