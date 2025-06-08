import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { Transaction } from "../../../domain/models/Transaction";
import { TransactionDraft } from "../../../domain/models/TransactionDraft";
import { TransactionDetails } from "../../../domain/interfaces/models/transactions/TransactionDetails";
import { useTransactionDetailsService } from "./useTransactionDetailsService";
import { CurrencyConverter } from "../../../data/services/currency/CurrencyConverter";

interface Props {
    draft: TransactionDraft;
    details?: TransactionDetails;
    amountCurrency?: string;
    baseCurrency: string | null;
    converter: CurrencyConverter;
}

export function useTransactionSaver({
                                        draft,
                                        details,
                                        amountCurrency,
                                        baseCurrency,
                                        converter,
                                    }: Props) {
    const nav = useNavigation();
    const transService = useTransactionDetailsService();

    const onSave = useCallback(async () => {
        try {
            const rate = await getEffectiveRate(draft, amountCurrency, converter);

            const trans = buildTransaction(draft, rate, amountCurrency, details);

            if (!trans.id)
                await transService?.createTransaction(trans);
            else
                await transService?.updateTransaction(trans.id, trans);

            nav.goBack();
        } catch (err) {
            console.error(err);
        }
    }, [draft, details, amountCurrency, converter, nav, transService]);

    return { onSave };
}

async function getEffectiveRate(draft: TransactionDraft, currency: string | undefined, converter: CurrencyConverter): Promise<number> {
    if (draft.rateCustom) {
        return draft.rateCustom;
    }
    if (!currency) {
        return 1;
    }
    return await converter.getRateUAH(currency, draft.dateTime.toISOString());
}

function buildTransaction(
    draft: TransactionDraft,
    rate: number,
    currency: string | undefined,
    details?: TransactionDetails
): Transaction {
    const { dateTime } = draft;

    return new Transaction({
        id: details?.transaction.id,
        type: draft.type,
        amount: Number(draft.amount),
        currencyCode: currency,
        rate,
        categoryId: draft.category?.id,
        fromAccountId: draft.fromAccount?.id,
        toAccountId: draft.toAccount?.id,
        date: formatDate(dateTime),
        time: formatTime(dateTime),
        description: draft.description,
    });
}

function formatDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatTime(d: Date): string {
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}