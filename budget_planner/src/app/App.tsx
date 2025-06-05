import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { RepositoryFactory } from "../data/repositories/RepositoryFactory";
import { SQLiteService } from "../data/sqlite/SQLiteService";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme/theme";
import { FactoryContext } from "./contexts/FactoryContext";
import CategoriesStack from "./navigation/CategoriesStack";
import { CategorySessionProvider } from "../presentation/contexts/CategorySessionContext";
import { ScreenContainer } from "../styles/components/Layout";
import RootNavigation, { BottomTabScreen } from "./navigation/RootNavigation";

const CategoriesContainer = () => {
    return (
        <CategorySessionProvider>
            <CategoriesStack/>
        </CategorySessionProvider>)
}

const screens: BottomTabScreen[] = [
    {
        name: "CategoriesScreen",
        label: "Категорії",
        component: CategoriesContainer,
        iconName: "list-outline",
    },
]

export default function App() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const toggleTheme = async () => {
        const themeValue = theme === 'dark' ? 'light' : 'dark';
        setTheme(themeValue);
    };

    const [factory, setFactory] = useState<RepositoryFactory | null>(null);
    useEffect(() => {
        const initFactory = async () => {
            const repositoryFactory = new RepositoryFactory(await SQLiteService.getInstance())
            setFactory(repositoryFactory);
        };
        initFactory();
    }, []);

    return (
        <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
            <FactoryContext.Provider value={factory}>
                <ScreenContainer>
                    <RootNavigation screens={screens}/>
                    <StatusBar style={theme === 'dark' ? 'light' : 'dark'}/>
                </ScreenContainer>
            </FactoryContext.Provider>
        </ThemeProvider>
    );
}