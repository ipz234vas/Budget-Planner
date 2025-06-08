import { TransactionDetails } from "../../../../domain/interfaces/models/transactions/TransactionDetails";
import { TransactionType } from "../../../../domain/enums/TransactionType";

export function getTransactionAccountInfo(details: TransactionDetails) {
    switch (details.transaction.type) {
        case TransactionType.Expense:
            return details.fromAccount;
        case TransactionType.Income:
            return details.toAccount;
        default:
            return undefined;
    }
}
