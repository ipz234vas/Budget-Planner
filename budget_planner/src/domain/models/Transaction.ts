import { TransactionParams } from "../interfaces/params/TransactionParams";
import { TransactionType } from "../enums/TransactionType";

export class Transaction {
    public id?: number;
    public type?: TransactionType;
    public amount?: number;
    public currencyCode?: string;
    public date?: string;
    public time?: string;
    public description?: string;
    public rate?: number | null;
    public fromAccountId?: number | null;
    public toAccountId?: number | null;
    public categoryId?: number | null;

    constructor(params?: TransactionParams) {
        if (!params) {
            return;
        }
        this.id = params.id;
        this.type = params.type;
        this.amount = params.amount;
        this.currencyCode = params.currencyCode;
        this.date = params.date;
        this.time = params.time;
        this.description = params.description;
        this.rate = params.rate ?? null;
        this.fromAccountId = params.fromAccountId ?? null;
        this.toAccountId = params.toAccountId ?? null;
        this.categoryId = params.categoryId ?? null;
    }
}
