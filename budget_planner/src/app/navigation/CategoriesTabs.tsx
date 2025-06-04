import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CategoriesScreen from "../../presentation/screens/CategoriesScreen";
import { CategoryType } from "../../domain/enums/CategoryType";
import { CategoriesTabsParamList } from "../../presentation/types/CategoriesTabsParamList";
import { useTheme } from "styled-components/native";

const Tab = createMaterialTopTabNavigator<CategoriesTabsParamList>();

export default function CategoriesTabs() {
    const theme = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                sceneStyle: {
                    backgroundColor: theme.colors.background
                },
                tabBarStyle: {
                    backgroundColor: theme.colors.secondaryBackground,
                    elevation: 0,
                },
                tabBarIndicatorStyle: {
                    backgroundColor: theme.colors.primary,
                    height: 3,
                    borderRadius: 2,
                },
                tabBarLabelStyle: {
                    fontSize: theme.fontSizes.m,
                },
                tabBarActiveTintColor: theme.colors.textPrimary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
            }}
        >
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
