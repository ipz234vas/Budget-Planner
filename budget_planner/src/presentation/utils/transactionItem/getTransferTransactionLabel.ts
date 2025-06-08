import { TransactionDetails } from "../../../domain/interfaces/models/transactions/TransactionDetails";

export function getTransferTransactionLabel(details: TransactionDetails) {
    const main = details.fromAccount ? {
        icon: details.fromAccount.icon,
        color: details.fromAccount.color
    } : {};

    const child = details.toAccount ? {
        icon: details.toAccount.icon,
        color: details.toAccount.color
    } : undefined;

    return {
        main,
        child,
        label: `${details.fromAccount?.name || ""} → ${details.toAccount?.name || ""}`,
    };
}