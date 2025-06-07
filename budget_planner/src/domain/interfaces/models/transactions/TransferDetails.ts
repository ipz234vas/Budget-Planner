import { TransactionBase } from "./TransactionBase";
import { Transaction } from "../../../models/Transaction";
import { TransactionType } from "../../../enums/TransactionType";
import { AccountInfo } from "./AccountInfo";

export interface TransferDetails extends TransactionBase {
    transaction: Transaction & { type: TransactionType.Transfer };
    category?: undefined;
    fromAccount: AccountInfo;
    toAccount: AccountInfo;
}