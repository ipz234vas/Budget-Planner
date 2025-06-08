import { CurrencyRatesService } from "./CurrencyRatesService";

export class CurrencyConverter {
    private rates: CurrencyRatesService

    constructor(rates: CurrencyRatesService) {
        this.rates = rates;
    }

    async getRateUAH(code: string, dateISO: string) {
        return this.rates.getRateToUAH(code, this.getSafeDateISO(dateISO));
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

        const safeDateISO = this.getSafeDateISO(dateISO)

        let rFrom;
        if (customRate) {
            rFrom = customRate;
        } else {
            rFrom = await this.rates.getRateToUAH(from, safeDateISO);
        }

        const rTo = await this.rates.getRateToUAH(to, safeDateISO);
        return amount * (rFrom / rTo);
    }

    private getSafeDateISO(dateISO: string): string {
        const today = new Date();
        const inputDate = new Date(dateISO);

        let safeDateISO = dateISO;
        if (inputDate > today) {
            safeDateISO = today.toISOString().slice(0, 10);
        }

        return safeDateISO
    }
}
