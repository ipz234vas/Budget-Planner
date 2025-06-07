import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { RepositoryFactory } from "../data/repositories/RepositoryFactory";
import { SQLiteService } from "../data/sqlite/SQLiteService";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme/theme";
import { FactoryContext } from "./contexts/FactoryContext";
import { ScreenContainer } from "../styles/components/Layout";
import RootNavigation, { BottomTabScreen } from "./navigation/RootNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SettingsScreen from "../presentation/screens/SettingsScreen";
import CategoriesScreenContainer from "../presentation/screens/CategoriesScreenContainer";
import { ThemeType } from "../shared/types/theme";
import { ThemeContext } from "./contexts/ThemeContext";
import { ChainCurrencyService } from "../data/services/currency/ChainCurrencyService";
import { NbuCurrencyHandler } from "../data/services/currency/NbuCurrencyHandler";
import { AddUahCurrencyHandler } from "../data/services/currency/AddUahCurrencyHandler";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import AccountsStack from "./navigation/AccountsStack";
import { TransactionService } from "../domain/services/TransactionService";
import { Transaction } from "../domain/models/Transaction";
import { Account } from "../domain/models/Account";
import { Category } from "../domain/models/Category";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TransactionsScreen from "../presentation/screens/TransactionsScreen";
import { TransactionType } from "../domain/enums/TransactionType";

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
        iconName: "list-outline",
    },
    {
        name: "TransactionsScreen",
        label: "Транзакції",
        component: TransactionsScreen,
        iconName: "list-outline",
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

            console.log(await repositoryFactory.getRepository(Category)?.getAll())
            console.log(await repositoryFactory.getRepository(Account)?.getAll())

            const repo = repositoryFactory.getRepository(Transaction)!
            try {


                await repo.insert(new Transaction({
                    amount: 20, type: TransactionType.Income, currencyCode: "UAH",
                    date: new Date().toISOString().slice(0, 10), categoryId: 18, fromAccountId: 2, toAccountId: 4, time: new Date().toTimeString().slice(0, 8)
                }));
            } catch (error) {
                console.error(error);
            }
            const service = new TransactionService(
                repositoryFactory.getRepository(Transaction)!,
                repositoryFactory.getRepository(Account)!,
                repositoryFactory.getRepository(Category)!
            )

            console.log(await service.getAllDetails());
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