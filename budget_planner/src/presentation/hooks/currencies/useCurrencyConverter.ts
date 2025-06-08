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

    const getRateToBase = useCallback(
        async (code: string, dateISO: string): Promise<number> => {
            if (!baseCurrency || code === baseCurrency) return 1;

            const [rCodeUAH, rBaseUAH] = await Promise.all([
                converterRef.current.getRateUAH(code, dateISO),
                converterRef.current.getRateUAH(baseCurrency, dateISO),
            ]);

            return rCodeUAH / rBaseUAH;
        },
        [baseCurrency]
    );

    return { convert, getRateToBase, baseCurrency, converter: converterRef.current };
}
