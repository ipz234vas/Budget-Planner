import { ViewModel } from "./types";
import { getTransactionLabel } from "./getTransactionLabel";
import { getTransactionAccountInfo } from "./getTransactionAccountInfo";
import { getTransactionAmountInfo } from "./getTransactionAmountInfo";
import { TransactionDetails } from "../../../domain/interfaces/models/transactions/TransactionDetails";
import { TransactionType } from "../../../domain/enums/TransactionType";
import { getTransferTransactionLabel } from "./getTransferTransactionLabel";

export function getTransactionItemViewModel(details: TransactionDetails, theme: any): ViewModel {
    const acct = getTransactionAccountInfo(details);
    const { prefix, color } = getTransactionAmountInfo(details, theme);

    const base: ViewModel = {
        accountName: acct?.name,
        accountColor: acct?.color,
        accountIcon: acct?.icon,
        amountPrefix: prefix,
        amountColor: color,
        label: "",
        mainIcon: {},
    };

    switch (details.transaction.type) {
        case TransactionType.Expense:
        case TransactionType.Income: {
            const { main, child, label } = getTransactionLabel(details);
            return {
                ...base, mainIcon: main, childIcon: child, label,
            };
        }

        case TransactionType.Transfer: {
            const { main, child, label } = getTransferTransactionLabel(details);
            return {
                ...base, mainIcon: main, childIcon: child, label,
            };
        }

        default:
            return base;
    }
}

