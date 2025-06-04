import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CategoryEditScreen from "../../presentation/screens/CategoryEditScreen";
import { NavigationContainer } from "@react-navigation/native";
import TopTabsNavigator from "./CategoriesTabs";


export default function CategoriesStack() {
    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Categories"
                screenOptions={{
                    headerShadowVisible: false,
                    headerTintColor: 'white',
                    headerShown: false
                }}
            >
                <Stack.Screen name="Categories" component={TopTabsNavigator}/>
                <Stack.Screen name="CategoryEditor" component={CategoryEditScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}