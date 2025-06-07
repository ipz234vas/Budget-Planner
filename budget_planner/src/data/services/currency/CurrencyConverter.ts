import { CurrencyRatesService } from "./CurrencyRatesService";

export class CurrencyConverter {
    private rates: CurrencyRatesService

    constructor(rates: CurrencyRatesService) {
        this.rates = rates;
    }

    async getRateUAH(code: string, dateISO: string) {
        return this.rates.getRateToUAH(code, dateISO);
    }

    async convert(
        amount: number,
        from: string,
        to: string,
        dateISO: string,
        customRate?: number
    ): Promise<number> {
        if (from === to) {
            return amount;
        }

        let rFrom;
        if (customRate) {
            rFrom = customRate;
        } else {
            rFrom = await this.rates.getRateToUAH(from, dateISO);
        }

        const rTo = await this.rates.getRateToUAH(to, dateISO);
        return amount * (rFrom / rTo);
    }
}
