import { ICurrencyHandler } from "../../../domain/interfaces/services/ICurrencyHandler";
import { Currency } from "../../../domain/models/Currency";

export abstract class BaseCurrencyHandler implements ICurrencyHandler {
    protected next?: ICurrencyHandler;

    constructor(next?: ICurrencyHandler) {
        this.next = next;
    }

    async handle(currencies: Currency[], date?: string): Promise<Currency[]> {
        if (this.next) {
            return await this.next.handle(currencies, date);
        }
        return currencies;
    };
}