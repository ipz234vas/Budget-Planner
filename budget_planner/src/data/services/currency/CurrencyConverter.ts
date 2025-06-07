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
        if (from === to)
            return amount;
        if (customRate)
            return customRate;

        const [rFrom, rTo] = await Promise.all([
            this.rates.getRateToUAH(from, dateISO),
            this.rates.getRateToUAH(to, dateISO),
        ]);
        return amount * (rFrom / rTo);
    }
}
