import { CurrencyParams } from "../interfaces/params/CurrencyParams";

export class Currency {
    public code: string;
    public name: string;
    public rateToUAH: number;

    constructor(params: CurrencyParams) {
        this.code = params.code;
        this.name = params.name;
        this.rateToUAH = params.rateToUAH;
    }
}