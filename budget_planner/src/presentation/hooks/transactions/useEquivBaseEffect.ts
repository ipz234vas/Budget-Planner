import { useEffect } from "react";
import { TransactionDraft } from "../../../domain/models/TransactionDraft";
import { CurrencyConverter } from "../../../data/services/currency/CurrencyConverter";

interface Props {
    details?: any;
    draft: TransactionDraft;
    baseCurrency: string | null;
    amountCurrency: string | undefined;
    convert: CurrencyConverter["convert"];
    patchDraft: (patch: Partial<TransactionDraft>) => void;
}

export function useEquivBaseEffect({
                                       details,
                                       draft,
                                       baseCurrency,
                                       amountCurrency,
                                       convert,
                                       patchDraft,
                                   }: Props) {
    useEffect(() => {
        if (
            draft.amount &&
            amountCurrency &&
            baseCurrency &&
            amountCurrency !== baseCurrency &&
            (!draft.equivBase || draft.equivBase === "0")
        ) {
            (async () => {
                const eqv = await convert(
                    Number(draft.amount),
                    amountCurrency,
                    baseCurrency,
                    draft.dateTime.toISOString(),
                    draft.rateCustom ?? undefined
                );
                patchDraft({ equivBase: eqv.toFixed(2) });
            })();
        }
    }, [details, draft.amount, amountCurrency, baseCurrency]);
}
