import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ParamListBase } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { GenericTopTabsProps } from "../../presentation/types/GenericTopTabsProps";

export function GenericTopTabs<T extends ParamListBase>({ screens }: GenericTopTabsProps<T>) {
    const Tab = createMaterialTopTabNavigator<T>();
    const theme = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                sceneStyle: {
                    backgroundColor: theme.colors.background,
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
            {screens.map((screen) => (
                <Tab.Screen
                    key={screen.name}
                    name={screen.name}
                    component={screen.component}
                    initialParams={screen.initialParams}
                    options={{ title: screen.title }}
                />
            ))}
        </Tab.Navigator>
    );
}
