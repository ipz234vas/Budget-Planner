import { TransactionDetails } from "../../domain/interfaces/models/transactions/TransactionDetails";
import { TransactionSection } from "../types/TransactionSection";

export function groupByDate(
    transactions: TransactionDetails[]
): Record<string, TransactionDetails[]> {
    return transactions.reduce((acc, tr) => {
        const date = tr.transaction.date || "";
        if (!acc[date]) acc[date] = [];
        acc[date].push(tr);
        return acc;
    }, {} as Record<string, TransactionDetails[]>);
}

export async function buildSections(
    grouped: Record<string, TransactionDetails[]>,
    getTotalForSection: (items: TransactionDetails[]) => Promise<number>,
    currency: string
): Promise<TransactionSection[]> {
    const sorted = Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));

    return Promise.all(
        sorted.map(async ([date, items]) => {
            const total = await getTotalForSection(items);
            return {
                data: items,
                date,
                total,
                currency,
            };
        })
    );
}