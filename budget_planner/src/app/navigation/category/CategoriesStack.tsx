import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CategoryEditorScreen from "../../../presentation/screens/category/CategoryEditorScreen";
import CategoriesTabs from "./CategoriesTabs";
import { useTheme } from "styled-components/native";


export default function CategoriesStack() {
    const Stack = createNativeStackNavigator();
    const theme = useTheme();
    return (
        <Stack.Navigator
            initialRouteName="Categories"
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.colors.background }
            }}
        >
            <Stack.Screen name="Categories" component={CategoriesTabs}/>
            <Stack.Screen name="CategoryEditor" component={CategoryEditorScreen}/>
        </Stack.Navigator>
    );
}