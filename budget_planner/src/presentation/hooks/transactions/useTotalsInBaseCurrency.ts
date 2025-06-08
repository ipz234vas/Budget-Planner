import { useCallback } from "react";
import { useCurrencyContext } from "../../../app/contexts/CurrencyContext";
import { useCurrencyConverter } from "../currencies/useCurrencyConverter";
import { TransactionDetails } from "../../../domain/interfaces/models/transactions/TransactionDetails";
import { TransactionType } from "../../../domain/enums/TransactionType";

export function useTotalsInBaseCurrency() {
    const { currencyCode: baseCurrency } = useCurrencyContext();
    const { converter } = useCurrencyConverter();

    const getTotalForSection = useCallback(
        async (transactions: TransactionDetails[]) => {
            let total = 0;

            for (const tr of transactions) {
                const tx = tr.transaction;
                let sum = Number(tx.amount) || 0;

                if (tx.currencyCode && baseCurrency && tx.date && tx.rate && tx.currencyCode !== baseCurrency) {
                    sum = await converter.convert(
                        sum,
                        tx.currencyCode,
                        baseCurrency,
                        tx.date,
                        tx.rate
                    );
                }

                if (tx.type === TransactionType.Expense) {
                    total -= sum;
                }
                if (tx.type === TransactionType.Income) {
                    total += sum;
                }
            }
            return total;
        },
        [baseCurrency, converter]
    );

    return { getTotalForSection, baseCurrency };
}
