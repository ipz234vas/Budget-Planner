import { useMemo } from "react";
import { TransactionDraft } from "../../../domain/models/TransactionDraft";
import { TransactionType } from "../../../domain/enums/TransactionType";

export function useTransactionComputedFields(draft: TransactionDraft, baseCurrency: string | null) {
    const showCat = draft.type !== TransactionType.Transfer;
    const showFrom = draft.type !== TransactionType.Income;
    const showTo = draft.type !== TransactionType.Expense;

    const amountCurrency = useMemo(() => {
        return draft.type === TransactionType.Income
            ? draft.toAccount?.currencyCode
            : draft.fromAccount?.currencyCode;
    }, [draft.type, draft.fromAccount, draft.toAccount]);

    const needEquivInput = !!amountCurrency && !!baseCurrency && amountCurrency !== baseCurrency;

    return {
        showCat,
        showFrom,
        showTo,
        amountCurrency,
        needEquivInput,
    };
}
