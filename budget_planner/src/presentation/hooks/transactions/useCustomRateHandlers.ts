import { TransactionDraft } from "../../../domain/models/TransactionDraft";
import { CurrencyConverter } from "../../../data/services/currency/CurrencyConverter";

interface Props {
    draft: TransactionDraft;
    amountCurrency?: string;
    baseCurrency: string | null;
    needEquivInput: boolean;
    converter: CurrencyConverter;
    patchDraft: (patch: Partial<TransactionDraft>) => void;
}

export function useCustomRateHandlers({
                                          draft,
                                          amountCurrency,
                                          baseCurrency,
                                          needEquivInput,
                                          converter,
                                          patchDraft,
                                      }: Props) {
    const onEquivBaseChange = async (equivBase: string) => {
        patchDraft({ equivBase });
        if (
            equivBase &&
            draft.amount &&
            needEquivInput &&
            draft.useCustomRate &&
            amountCurrency &&
            baseCurrency
        ) {
            const amt = Number(draft.amount);
            const eqv = Number(equivBase);
            const dateISO = draft.dateTime.toISOString();
            const rBaseUAH = await converter.getRateUAH(baseCurrency, dateISO);
            const customRate = amt !== 0 ? (eqv / amt) * rBaseUAH : undefined;
            patchDraft({ rateCustom: customRate });
        }
    };

    const onCustomRateToggle = (useCustomRate: boolean) => {
        patchDraft({
            useCustomRate,
            rateCustom: useCustomRate ? draft.rateCustom : undefined,
        });
    };

    return {
        onEquivBaseChange,
        onCustomRateToggle,
    };
}
