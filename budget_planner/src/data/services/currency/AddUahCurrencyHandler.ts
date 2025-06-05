import { BaseCurrencyHandler } from "./BaseCurrencyHandler";
import { Currency } from "../../../domain/models/Currency";

export class AddUahCurrencyHandler extends BaseCurrencyHandler {
    async handle(currencies: Currency[], date?: string): Promise<Currency[]> {
        const hasUAH = currencies.some(c => c.code === "UAH");
        if (!hasUAH) {
            currencies.unshift({ code: "UAH", name: "Українська гривня", rateToUAH: 1 });
        }
        return await super.handle(currencies, date);
    }
}