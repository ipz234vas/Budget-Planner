import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CategoriesScreen from "../../presentation/screens/CategoriesScreen";
import { CategoryType } from "../../domain/enums/CategoryType";
import { CategoriesTabsParamList } from "../../presentation/types/CategoriesTabsParamList";

const Tab = createMaterialTopTabNavigator<CategoriesTabsParamList>();

export default function CategoriesTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Expenses"
                component={CategoriesScreen}
                initialParams={{ type: CategoryType.Expense }}
                options={{ title: "Витрати" }}
            />
            <Tab.Screen
                name="Income"
                component={CategoriesScreen}
                initialParams={{ type: CategoryType.Income }}
                options={{ title: "Надходження" }}
            />
        </Tab.Navigator>
    );
}
