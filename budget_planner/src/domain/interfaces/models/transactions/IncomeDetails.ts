import { TransactionBase } from "./TransactionBase";
import { Transaction } from "../../../models/Transaction";
import { TransactionType } from "../../../enums/TransactionType";
import { CategoryInfo } from "./CategoryInfo";
import { AccountInfo } from "./AccountInfo";

export interface IncomeDetails extends TransactionBase {
    transaction: Transaction & { type: TransactionType.Income };
    category: CategoryInfo;
    fromAccount?: undefined;
    toAccount: AccountInfo;
}