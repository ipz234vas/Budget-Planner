import { Transaction } from "../models/Transaction";
import { TransactionType } from "../enums/TransactionType";
import { getTimestamp } from "./getTimestamp";

export function calculateBalanceFromTransactions(
    transactions: Transaction[],
    accountId: number,
    fromTime: number,
    toTime: number
): number {
    return transactions.reduce((acc, tx) => {
        const time = getTimestamp(tx.date, tx.time ?? "00:00:00");
        if (time <= fromTime || time > toTime) return acc;

        const amount = Number(tx.amount);
        switch (tx.type) {
            case TransactionType.Expense:
                return tx.fromAccountId === accountId ? acc - amount : acc;
            case TransactionType.Income:
                return tx.toAccountId === accountId ? acc + amount : acc;
            case TransactionType.Transfer:
                if (tx.fromAccountId === accountId) return acc - amount;
                if (tx.toAccountId === accountId) return acc + amount;
                return acc;
            default:
                return acc;
        }
    }, 0);
}
