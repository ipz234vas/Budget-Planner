import { useEffect } from "react";
import { TransactionDraft } from "../../../domain/models/TransactionDraft";
import { CurrencyConverter } from "../../../data/services/currency/CurrencyConverter";

interface UseTransactionRatesEffectProps {
    draft: TransactionDraft;
    baseCurrency: string | null;
    amountCurrency: string | undefined;
    converter: CurrencyConverter;
    patchDraft: (patch: Partial<TransactionDraft>) => void;
    showTo: boolean;
    needEquivInput: boolean;
}

export function useTransactionRatesEffect({
                                              draft,
                                              baseCurrency,
                                              amountCurrency,
                                              converter,
                                              patchDraft,
                                              showTo,
                                              needEquivInput,
                                          }: UseTransactionRatesEffectProps) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            (async () => {
                if (!draft.amount || !amountCurrency || !baseCurrency) {
                    resetRates(patchDraft);
                    return;
                }

                const dateISO = draft.dateTime.toISOString();
                const amt = Number(draft.amount);

                const rAmountUAH = await converter.getRateUAH(amountCurrency, dateISO);
                const rBaseUAH = await converter.getRateUAH(baseCurrency, dateISO);

                updateEquivBase({
                    useCustomRate: draft.useCustomRate,
                    needEquivInput,
                    amount: amt,
                    rateFrom: rAmountUAH,
                    rateTo: rBaseUAH,
                    patchDraft,
                });

                updateToAmount({
                    draft,
                    showTo,
                    converter,
                    patchDraft,
                    dateISO,
                });
            })();
        }, 200);

        return () => clearTimeout(timeout);
    }, [
        draft.amount, draft.useCustomRate, draft.rateCustom, amountCurrency, baseCurrency, draft.fromAccount,
        draft.toAccount, draft.type, draft.dateTime, needEquivInput, converter, showTo,
    ]);
}

function resetRates(patch: (p: Partial<TransactionDraft>) => void) {
    patch({
        equivBase: "",
        toAmount: "",
        rateCustom: undefined,
    });
}

function updateEquivBase({ useCustomRate, needEquivInput, amount, rateFrom, rateTo, patchDraft, }: {
    useCustomRate: boolean;
    needEquivInput: boolean;
    amount: number;
    rateFrom: number;
    rateTo: number;
    patchDraft: (p: Partial<TransactionDraft>) => void;
}) {
    if (!useCustomRate && needEquivInput) {
        const rateToBase = rateFrom / rateTo;
        patchDraft({
            equivBase: amount ? (amount * rateToBase).toFixed(2) : "",
            rateCustom: undefined,
        });
    }
}

function updateToAmount({ draft, showTo, converter, patchDraft, dateISO, }: {
    draft: TransactionDraft;
    showTo: boolean;
    converter: CurrencyConverter;
    patchDraft: (p: Partial<TransactionDraft>) => void;
    dateISO: string;
}) {
    const from = draft.fromAccount?.currencyCode;
    const to = draft.toAccount?.currencyCode;

    if (!showTo || !from || !to || !draft.amount) return;

    if (from === to) {
        patchDraft({ toAmount: draft.amount });
        return;
    }

    (async () => {
        const fromToUAH = draft.useCustomRate && draft.rateCustom
            ? draft.rateCustom
            : await converter.getRateUAH(from, dateISO);

        const toToUAH = await converter.getRateUAH(to, dateISO);

        const toAmount = Number(draft.amount) * (fromToUAH / toToUAH);
        patchDraft({ toAmount: toAmount.toFixed(2) });
    })();
}