import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CategoryEditScreen from "../screens/CategoryEditScreen";
import { NavigationContainer } from "@react-navigation/native";
import CategoriesScreen from "../screens/CategoriesScreen";


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
                <Stack.Screen name="Categories" component={CategoriesScreen}/>
                <Stack.Screen name="Edit" component={CategoryEditScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}