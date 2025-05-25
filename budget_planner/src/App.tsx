import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { RepositoryFactory } from "./data/repositories/RepositoryFactory";
import { SQLiteService } from "./data/database/SQLiteService";
import { Category } from "./data/models/Category";
import { CategoryType } from "./domain/enums/CategoryType";
import { Container } from "./shared/styles/style";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./shared/styles/theme";
import CategoriesScreen from "./presentation/screens/CategoriesScreen";
import { FactoryContext } from "./presentation/contexts/FactoryContext";

const category = new Category({
    name: "test category",
    type: CategoryType.Expense
});

export default function App() {
    const [theme, setTheme] = useState('light');
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
                <Container>
                    <CategoriesScreen/>
                    <StatusBar style={theme === 'dark' ? 'light' : 'dark'}/>
                </Container>
            </FactoryContext.Provider>
        </ThemeProvider>
    );
}