import { Currency } from "../../models/Currency";

export interface ICurrencyHandler {
    handle(currencies: Currency[], date?: string): Promise<Currency[]>;
}