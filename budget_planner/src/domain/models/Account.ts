import { AccountParams } from "../interfaces/params/AccountParams";
import { AccountType } from "../enums/AccountType";

export class Account {
    public id?: number;
    public name: string = '';
    public type: AccountType = AccountType.Account;
    public currentAmount: number = 0;
    public currencyCode: string = '';
    public color?: string;
    public icon?: string;
    public creditLimit?: number | null = null;
    public goalAmount?: number | null = null;
    public goalDeadline?: string | null = null;

    constructor(params?: AccountParams) {
        if (!params)
            return;
        this.id = params.id;
        this.name = params.name ?? '';
        this.type = params.type;
        this.currentAmount = params.currentAmount ?? 0;
        this.currencyCode = params.currencyCode ?? '';
        this.color = params.color;
        this.icon = params.icon;
        this.creditLimit = params.creditLimit ?? null;
        this.goalAmount = params.goalAmount ?? null;
        this.goalDeadline = params.goalDeadline ?? null;
    }
}
