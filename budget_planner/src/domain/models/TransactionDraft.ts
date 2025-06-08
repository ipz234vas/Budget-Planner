import { TransactionType } from "../enums/TransactionType";
import { CategoryInfo } from "../interfaces/models/transactions/CategoryInfo";
import { AccountInfo } from "../interfaces/models/transactions/AccountInfo";
import { TransactionDetails } from "../interfaces/models/transactions/TransactionDetails";

export class TransactionDraft {
    type: TransactionType = TransactionType.Expense;
    amount: string = "";
    category: CategoryInfo | null = null;
    fromAccount: AccountInfo | null = null;
    toAccount: AccountInfo | null = null;
    dateTime: Date = new Date();
    description: string = "";
    useCustomRate: boolean = false;
    equivBase: string = "";
    rateCustom: number | null = null;
    toAmount: string = "";

    constructor(details?: TransactionDetails) {
        if (!details) {
            return;
        }
        const t = details.transaction;
        this.type = t.type;
        this.rateCustom = t.rate ?? null
        this.amount = t.amount?.toString() ?? "";
        this.category = details.category ?? null;
        this.fromAccount = details.fromAccount ?? null;
        this.toAccount = details.toAccount ?? null;
        this.dateTime = t.date && t.time ? new Date(`${t.date}T${t.time}`) : new Date();
        this.description = t.description ?? "";
        this.useCustomRate = !!t.rate;
    }
}
