import { TransactionDetails } from "../../../domain/interfaces/models/transactions/TransactionDetails";
import { TransactionType } from "../../../domain/enums/TransactionType";


export function getTransactionAmountInfo(details: TransactionDetails, theme: any) {
    switch (details.transaction.type) {
        case TransactionType.Expense:
            return { prefix: "-", color: theme.colors.negative };
        case TransactionType.Income:
            return { prefix: "+", color: theme.colors.positive };
        case TransactionType.Transfer:
            return {
                prefix: "",
                color: details.toAccount?.type === "saving"
                    ? theme.colors.primary
                    : theme.colors.textPrimary,
            };
        default:
            return { prefix: "", color: theme.colors.textPrimary };
    }
}
