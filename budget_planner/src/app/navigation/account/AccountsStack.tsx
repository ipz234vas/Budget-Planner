import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AccountsTabs from "./AccountsTabs";
import { useTheme } from "styled-components/native";
import AccountEditorScreen from "../../../presentation/screens/account/AccountEditorScreen";


export default function AccountsStack() {
    const Stack = createNativeStackNavigator();
    const theme = useTheme();
    return (
        <Stack.Navigator
            initialRouteName="Accounts"
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.colors.background }
            }}
        >
            <Stack.Screen name="Accounts" component={AccountsTabs}/>
            <Stack.Screen name="AccountEditor" component={AccountEditorScreen}/>
        </Stack.Navigator>
    );
}