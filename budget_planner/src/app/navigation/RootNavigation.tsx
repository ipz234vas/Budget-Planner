import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

export interface BottomTabScreen {
    name: string;
    label?: string;
    component: React.ComponentType<any>;
    iconName: keyof typeof Ionicons.glyphMap;
}

export interface BottomNavigationProps {
    screens: BottomTabScreen[];
}

export default function RootNavigation({ screens }: BottomNavigationProps) {
    const theme = useTheme();
    const Tab = createBottomTabNavigator();

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: true,
                    tabBarStyle: {
                        backgroundColor: theme.colors.secondaryBackground,
                        borderTopWidth: 0,
                        elevation: 0,
                        height: 56,
                    },
                    tabBarItemStyle: {
                        justifyContent: "center",
                    },
                    tabBarLabelStyle: {
                        fontSize: theme.fontSizes.xs,
                    },
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: theme.colors.textSecondary,
                    sceneStyle: {
                        backgroundColor: theme.colors.background,
                    },
                }}
            >
                {screens.map((screen, index) => (
                    <Tab.Screen
                        key={index}
                        name={screen.name}
                        component={screen.component}
                        options={{
                            title: screen.label ?? screen.name,
                            tabBarIcon: ({ color }: { color: string }) => (
                                <Ionicons name={screen.iconName} size={24} color={color}/>
                            ),
                        }}
                    />
                ))}
            </Tab.Navigator>
        </NavigationContainer>
    );
}
