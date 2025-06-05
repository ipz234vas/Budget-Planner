import { ICurrencyHandler } from "../../../domain/interfaces/services/ICurrencyHandler";
import { Currency } from "../../../domain/models/Currency";

export class ChainCurrencyService {
    private handler: ICurrencyHandler;

    constructor(handler: ICurrencyHandler) {
        this.handler = handler;
    }

    async getCurrencies(date?: string): Promise<Currency[]> {
        return this.handler.handle([], date);
    }
}