import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { RepositoryFactory } from "../data/repositories/RepositoryFactory";
import { SQLiteService } from "../data/sqlite/SQLiteService";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme/theme";
import { FactoryContext } from "./contexts/FactoryContext";
import { ScreenContainer } from "../styles/components/universal/Layout";
import RootNavigation, { BottomTabScreen } from "./navigation/RootNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SettingsScreen from "../presentation/screens/settings/SettingsScreen";
import CategoriesScreenContainer from "../presentation/screens/category/CategoriesScreenContainer";
import { ThemeType } from "../shared/types/theme";
import { ThemeContext } from "./contexts/ThemeContext";
import { ChainCurrencyService } from "../data/services/currency/ChainCurrencyService";
import { NbuCurrencyHandler } from "../data/services/currency/NbuCurrencyHandler";
import { AddUahCurrencyHandler } from "../data/services/currency/AddUahCurrencyHandler";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import AccountsStack from "./navigation/account/AccountsStack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TransactionsStack from "./navigation/transaction/TransactionsStack";

const screens: BottomTabScreen[] = [
    {
        name: "AccountsScreen",
        label: "Рахунки",
        component: AccountsStack,
        iconName: "card-outline",
    },
    {
        name: "CategoriesScreen",
        label: "Категорії",
        component: CategoriesScreenContainer,
        iconName: "grid-outline",
    },
    {
        name: "TransactionsScreen",
        label: "Транзакції",
        component: TransactionsStack,
        iconName: "receipt-outline"
    },
    {
        name: "SettingsScreen",
        label: "Опції",
        component: SettingsScreen,
        iconName: "settings-outline",
    },
]

export default function App() {

    const [theme, setTheme] = useState<ThemeType>('light');

    useEffect(() => {
        getTheme();
    }, []);

    const getTheme = async () => {
        try {
            const themeValue = await AsyncStorage.getItem('@theme') as ThemeType;
            if (themeValue)
                setTheme(themeValue);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleTheme = async () => {
        const themeValue = theme === 'dark' ? 'light' : 'dark';
        try {
            await AsyncStorage.setItem('@theme', themeValue);
            setTheme(themeValue);
        } catch (error) {
            console.error(error);
        }
    };

    const [factory, setFactory] = useState<RepositoryFactory | null>(null);
    useEffect(() => {
        const initFactory = async () => {
            const repositoryFactory = new RepositoryFactory(await SQLiteService.getInstance())
            setFactory(repositoryFactory);
        };
        initFactory();
    }, []);

    const [currencyService] = useState(() =>
        new ChainCurrencyService(new NbuCurrencyHandler(new AddUahCurrencyHandler()))
    );

    return (
        <GestureHandlerRootView>
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
                    <FactoryContext.Provider value={factory}>
                        <CurrencyProvider service={currencyService}>
                            <ScreenContainer>
                                <RootNavigation screens={screens}/>
                                <StatusBar style={theme === 'dark' ? 'light' : 'dark'}/>
                            </ScreenContainer>
                        </CurrencyProvider>
                    </FactoryContext.Provider>
                </ThemeProvider>
            </ThemeContext.Provider>
        </GestureHandlerRootView>
    );
}