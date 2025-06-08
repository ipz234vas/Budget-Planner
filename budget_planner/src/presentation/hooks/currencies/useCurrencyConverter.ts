import { useCallback, useRef } from "react";
import { CurrencyConverter } from "../../../data/services/currency/CurrencyConverter";
import { CurrencyRatesService } from "../../../data/services/currency/CurrencyRatesService";
import { ChainCurrencyService } from "../../../data/services/currency/ChainCurrencyService";
import { NbuCurrencyHandler } from "../../../data/services/currency/NbuCurrencyHandler";
import { useCurrencyContext } from "../../../app/contexts/CurrencyContext";

type ConvertFn = (
    amount: number,
    from: string,
    to: string,
    dateISO: string,
    customRate?: number
) => Promise<number>;

export function useCurrencyConverter() {
    const { currencyCode: baseCurrency } = useCurrencyContext();

    const converterRef = useRef(
        new CurrencyConverter(
            new CurrencyRatesService(
                new ChainCurrencyService(new NbuCurrencyHandler())
            )
        )
    );

    const convert: ConvertFn = useCallback(
        (amount, from, to, dateISO, customRate) =>
            converterRef.current.convert(amount, from, to, dateISO, customRate),
        []
    );

    return { convert, baseCurrency, converter: converterRef.current };
}
