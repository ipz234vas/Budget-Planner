import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { RepositoryFactory } from "../data/repositories/RepositoryFactory";
import { SQLiteService } from "../data/sqlite/SQLiteService";
import { Container } from "./theme/style";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme/theme";
import { FactoryContext } from "./contexts/FactoryContext";
import CategoriesStack from "./navigation/CategoriesStack";
import { CategorySessionProvider } from "./contexts/CategorySessionContext";
import { ISQLiteService } from "../domain/interfaces/sqlite/ISQLiteService";

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
                    <CategorySessionProvider>
                        <CategoriesStack/>
                    </CategorySessionProvider>)
                    <StatusBar style={theme === 'dark' ? 'light' : 'dark'}/>
                </Container>
            </FactoryContext.Provider>
        </ThemeProvider>
    );
}