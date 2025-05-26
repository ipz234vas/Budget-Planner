import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { RepositoryFactory } from "./data/repositories/RepositoryFactory";
import { SQLiteService } from "./data/database/SQLiteService";
import { Container } from "./shared/styles/style";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./shared/styles/theme";
import { FactoryContext } from "./presentation/contexts/FactoryContext";
import CategoriesStack from "./presentation/navigation/CategoriesStack";

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
                    <CategoriesStack/>
                    <StatusBar style={theme === 'dark' ? 'light' : 'dark'}/>
                </Container>
            </FactoryContext.Provider>
        </ThemeProvider>
    );
}