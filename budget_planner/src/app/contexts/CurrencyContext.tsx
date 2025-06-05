import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Currency } from "../../domain/models/Currency";
import { ChainCurrencyService } from "../../data/services/currency/ChainCurrencyService";

// Створи інтерфейс контексту
interface CurrencyContextProps {
    currencyCode: string | null;
    setCurrencyCode: (code: string) => void;
    currencies: Currency[];
    loading: boolean;
    refreshCurrencies: () => void;
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

export const useCurrencyContext = () => {
    const ctx = useContext(CurrencyContext);
    if (!ctx)
        throw new Error("CurrencyContext not found");
    return ctx;
};

const STORAGE_KEY = "currencyCode";

export const CurrencyProvider: React.FC<{ service: ChainCurrencyService; children: ReactNode }> = ({
                                                                                                       service,
                                                                                                       children,
                                                                                                   }) => {
    const [currencyCode, setCurrencyCodeState] = useState<string>("UAH");
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((val) => {
            if (val)
                setCurrencyCodeState(val);
        });
    }, []);

    const refreshCurrencies = () => {
        setLoading(true);
        service
            .getCurrencies()
            .then((list) => {
                return list.sort((a, b) => a.name.localeCompare(b.name));
            })
            .then(setCurrencies)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        refreshCurrencies();
    }, []);

    const setCurrencyCode = (code: string) => {
        setCurrencyCodeState(code);
        AsyncStorage.setItem(STORAGE_KEY, code);
    };

    return (
        <CurrencyContext.Provider
            value={{
                currencyCode,
                setCurrencyCode,
                currencies,
                loading,
                refreshCurrencies,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
};
