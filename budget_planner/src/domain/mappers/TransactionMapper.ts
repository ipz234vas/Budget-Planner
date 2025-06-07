import { Category } from "../models/Category";
import { Transaction } from "../models/Transaction";
import { AccountType } from "../enums/AccountType";
import { TransactionType } from "../enums/TransactionType";

import { CategoryInfo } from "../interfaces/models/transactions/CategoryInfo";
import { TransactionDetails } from "../interfaces/models/transactions/TransactionDetails";
import { AccountInfo } from "../interfaces/models/transactions/AccountInfo";
import { RawTransactionDetailsRow } from "../interfaces/models/transactions/RawTransactionDetailsRow";
import { IncomeDetails } from "../interfaces/models/transactions/IncomeDetails";
import { ExpenseDetails } from "../interfaces/models/transactions/ExpenseDetails";
import { TransferDetails } from "../interfaces/models/transactions/TransferDetails";

function buildCategoryInfoMap(categories: Category[]): Map<number, CategoryInfo> {
    const catMap = new Map(categories.map((c) => [c.id, c]));
    const infoMap = new Map<number, CategoryInfo>();

    for (const cat of categories) {
        if (!cat.id || infoMap.has(cat.id)) continue;

        const chain: Category[] = [];
        let node: Category | undefined = cat;
        while (node) {
            chain.push(node);
            node = node.parentId ? catMap.get(node.parentId) : undefined;
        }

        const rootInfo: CategoryInfo = {
            id: chain.at(-1)!.id,
            name: chain.at(-1)!.name,
            icon: chain.at(-1)!.icon ?? undefined,
            color: chain.at(-1)!.color ?? undefined,
            type: chain.at(-1)!.type,
        };

        let child: CategoryInfo | undefined;
        for (let i = chain.length - 1; i >= 0; i--) {
            const cur = chain[i];
            if (!cur.id) continue;

            const info: CategoryInfo = {
                id: cur.id,
                name: cur.name,
                icon: cur.icon ?? undefined,
                color: cur.color ?? undefined,
                type: cur.type,
                parent: child,
                root: rootInfo,
            };
            infoMap.set(cur.id, info);
            child = info;
        }
    }
    return infoMap;
}

function toAccountInfo(raw?: {
    id: number | null;
    name: string | null;
    icon: string | null;
    color: string | null;
    type: AccountType | null;
    currency: string | null;
}): AccountInfo | undefined {
    if (!raw?.id) return undefined;
    return {
        id: raw.id,
        name: raw.name ?? "",
        icon: raw.icon ?? undefined,
        color: raw.color ?? undefined,
        type: raw.type ?? AccountType.Account,
        currencyCode: raw.currency ?? "",
    };
}

export const createTransactionMapper = (categories: Category[]) => {
    const categoryInfoMap = buildCategoryInfoMap(categories);

    return (r: RawTransactionDetailsRow): TransactionDetails => {
        const transaction: Transaction = {
            id: r.id,
            type: r.type,
            amount: r.amount,
            currencyCode: r.currencyCode,
            rate: r.rate ?? null,
            date: r.date,
            time: r.time,
            description: r.description || undefined,
            fromAccountId: r.fromAccountId,
            toAccountId: r.toAccountId,
            categoryId: r.categoryId,
        };

        const fromAccount = toAccountInfo({
            id: r.from_id,
            name: r.from_name,
            icon: r.from_icon,
            color: r.from_color,
            type: r.from_type,
            currency: r.from_currencyCode,
        });

        const toAccount = toAccountInfo({
            id: r.to_id,
            name: r.to_name,
            icon: r.to_icon,
            color: r.to_color,
            type: r.to_type,
            currency: r.to_currencyCode,
        });

        switch (r.type) {
            case TransactionType.Expense:
                return {
                    transaction,
                    category: r.categoryId ? categoryInfoMap.get(r.categoryId) : undefined,
                    fromAccount,
                } as ExpenseDetails;

            case TransactionType.Income:
                return {
                    transaction,
                    category: r.categoryId ? categoryInfoMap.get(r.categoryId) : undefined,
                    toAccount,
                } as IncomeDetails;

            case TransactionType.Transfer:
                return {
                    transaction,
                    fromAccount,
                    toAccount,
                } as TransferDetails;

            default:
                throw new Error("Unknown transaction type: " + r.type);
        }
    };
};