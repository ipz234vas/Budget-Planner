import { ChainCurrencyService } from "./ChainCurrencyService";

type CacheKey = `${string}|${string}`;

export class CurrencyRatesService {
    private cache = new Map<CacheKey, number>();
    private chain: ChainCurrencyService

    constructor(chain: ChainCurrencyService) {
        this.chain = chain;
    }

    async getRateToUAH(code: string, dateISO: string): Promise<number> {
        if (code === "UAH") {
            return 1;
        }

        const day = dateISO.slice(0, 10).replace(/-/g, "");
        const key: CacheKey = `${day}|${code}`;
        const cached = this.cache.get(key);
        if (cached) {
            return cached;
        }
        const list = await this.chain.getCurrencies(day);
        list.forEach(c => this.cache.set(`${day}|${c.code}`, c.rateToUAH));

        const rate = this.cache.get(key);
        if (!rate) {
            throw new Error(`Rate ${code} not found for ${day}`);
        }
        return rate;
    }
}
