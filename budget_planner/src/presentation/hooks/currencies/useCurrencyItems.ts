import { Currency } from "../../../domain/models/Currency";
import { useMemo } from "react";
import { CurrencyItem } from "../../components/CurrencyDropdown";

export function useCurrencyItems(currencies: Currency[]): CurrencyItem[] {
    return useMemo(
        () =>
            currencies.map((cur) => ({
                label: `${cur.name} (${cur.code})`,
                value: cur.code,
            })),
        [currencies]
    );
}