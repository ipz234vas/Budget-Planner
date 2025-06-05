import { BaseCurrencyHandler } from "./BaseCurrencyHandler";
import { Currency } from "../../../domain/models/Currency";
import { NbuCurrencyDto } from "../../../domain/dtos/NbuCurrencyDto";
import { NBU_API_BASE_URL } from "../../../shared/constants/nbu";

export class NbuCurrencyHandler extends BaseCurrencyHandler {
    async handle(currencies: Currency[], date?: string): Promise<Currency[]> {
        let url = NBU_API_BASE_URL;
        if (date) {
            url += `&date=${date}`;
        }
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("NBU API error");
        }

        const data: NbuCurrencyDto[] = await res.json();

        const nbuCurrencies: Currency[] = data.map(
            item => new Currency({ code: item.cc, name: item.txt, rateToUAH: Number(item.rate) })
        );

        currencies.push(...nbuCurrencies);

        return await super.handle(currencies, date);
    }
}