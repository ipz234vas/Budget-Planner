import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CategoryEditorScreen from "../../presentation/screens/CategoryEditorScreen";
import { NavigationContainer } from "@react-navigation/native";
import TopTabsNavigator from "./CategoriesTabs";
import { useTheme } from "styled-components/native";


export default function CategoriesStack() {
    const Stack = createNativeStackNavigator();
    const theme = useTheme();
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Categories"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: theme.colors.background }
                }}
            >
                <Stack.Screen name="Categories" component={TopTabsNavigator}/>
                <Stack.Screen name="CategoryEditor" component={CategoryEditorScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}