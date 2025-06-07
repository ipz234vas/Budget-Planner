import { Category } from "../models/Category";
import { CategoryInfo } from "../interfaces/models/transactions/CategoryInfo";
import { Transaction } from "../models/Transaction";
import { TransactionType } from "../enums/TransactionType";
import {
    TransactionDetails,
} from "../interfaces/models/transactions/TransactionDetails";
import { AccountInfo } from "../interfaces/models/transactions/AccountInfo";
import { RawTransactionDetailsRow } from "../interfaces/models/transactions/RawTransactionDetailsRow";
import { ExpenseDetails } from "../interfaces/models/transactions/ExpenseDetails";
import { IncomeDetails } from "../interfaces/models/transactions/IncomeDetails";
import { TransferDetails } from "../interfaces/models/transactions/TransferDetails";

export const createTransactionMapper = (categories: Category[]) => {

    const catMap = new Map(categories.map((c) => [c.id, c]));

    const categoryInfoMap = new Map<number, CategoryInfo>();

    const toInfo = (c: Category): CategoryInfo => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        color: c.color,
        type: c.type,
    });

    for (const cat of categories) {
        if (!cat.id || categoryInfoMap.has(cat.id))
            continue;

        const chain: Category[] = [];
        let node: Category | undefined = cat;

        while (node) {
            chain.push(node);
            node = node.parentId ? catMap.get(node.parentId) : undefined;
        }
        const rootInfo = toInfo(chain.at(-1)!); // останній елемент = root

        let childInfo: CategoryInfo | undefined;
        for (let i = chain.length - 1; i >= 0; i--) {
            const current = chain[i];
            if (!current.id)
                continue;
            const info: CategoryInfo = {
                ...toInfo(current),
                parent: childInfo,
                root: rootInfo,
            };
            categoryInfoMap.set(current.id, info);
            childInfo = info;
        }
    }

    const pickTx = (r: RawTransactionDetailsRow): Transaction => ({
        id: r.id,
        type: r.type,
        amount: r.amount,
        currencyCode: r.currencyCode,
        rate: r.rate,
        date: r.date,
        time: r.time,
        description: r.description || undefined,
        fromAccountId: r.fromAccountId,
        toAccountId: r.toAccountId,
        categoryId: r.categoryId,
    });

    const pickAccount = (
        id: number | null,
        name: string | null,
        icon: string | null,
        color: string | null,
        type: any | null
    ): AccountInfo | undefined =>
        id
            ? { id, name: name!, icon: icon!, color: color!, type: type! }
            : undefined;

    return function mapToDetails(r: RawTransactionDetailsRow): TransactionDetails {
        switch (r.type) {
            case TransactionType.Expense:
                return {
                    transaction: pickTx(r),
                    category: r.categoryId ? categoryInfoMap.get(r.categoryId)! : undefined,
                    fromAccount: pickAccount(r.from_id, r.from_name, r.from_icon, r.from_color, r.from_type),
                } as ExpenseDetails;

            case TransactionType.Income:
                return {
                    transaction: pickTx(r),
                    category: r.categoryId ? categoryInfoMap.get(r.categoryId)! : undefined,
                    toAccount: pickAccount(r.to_id, r.to_name, r.to_icon, r.to_color, r.to_type),
                } as IncomeDetails;

            case TransactionType.Transfer:
                return {
                    transaction: pickTx(r),
                    fromAccount: pickAccount(r.from_id, r.from_name, r.from_icon, r.from_color, r.from_type),
                    toAccount: pickAccount(r.to_id, r.to_name, r.to_icon, r.to_color, r.to_type),
                } as TransferDetails;

            default:
                throw new Error("Unreachable");
        }
    };
};
