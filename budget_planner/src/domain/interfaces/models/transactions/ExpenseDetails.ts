import { TransactionBase } from "./TransactionBase";
import { Transaction } from "../../../models/Transaction";
import { TransactionType } from "../../../enums/TransactionType";
import { CategoryInfo } from "./CategoryInfo";
import { AccountInfo } from "./AccountInfo";

export interface ExpenseDetails extends TransactionBase {
    transaction: Transaction & { type: TransactionType.Expense };
    category: CategoryInfo; // обов'язково
    fromAccount: AccountInfo; // обов'язково
    toAccount?: undefined;
}