import { buildCategoryInfoMap } from "./buildCategoryInfoMap";
import { buildAccountInfo } from "./buildAccountInfo";

import { Category } from "../models/Category";
import { Transaction } from "../models/Transaction";
import { TransactionType } from "../enums/TransactionType";

import { RawTransactionDetailsRow } from "../interfaces/models/transactions/RawTransactionDetailsRow";
import { TransactionDetails } from "../interfaces/models/transactions/TransactionDetails";
import { ExpenseDetails } from "../interfaces/models/transactions/ExpenseDetails";
import { IncomeDetails } from "../interfaces/models/transactions/IncomeDetails";
import { TransferDetails } from "../interfaces/models/transactions/TransferDetails";

export const createTransactionMapper = (categories: Category[]) => {
    const categoryInfoMap = buildCategoryInfoMap(categories);

    return (raw: RawTransactionDetailsRow): TransactionDetails => {
        const transaction = mapTransaction(raw);
        const fromAccount = mapFromAccount(raw);
        const toAccount = mapToAccount(raw);
        const category = mapCategory(raw, categoryInfoMap);

        return mapTransactionDetails(raw.type, {
            transaction,
            category,
            fromAccount,
            toAccount,
        });
    };
};

function mapTransaction(raw: RawTransactionDetailsRow): Transaction {
    return {
        id: raw.id,
        type: raw.type,
        amount: raw.amount,
        currencyCode: raw.currencyCode,
        rate: raw.rate ?? null,
        date: raw.date,
        time: raw.time,
        description: raw.description || undefined,
        fromAccountId: raw.fromAccountId,
        toAccountId: raw.toAccountId,
        categoryId: raw.categoryId,
    };
}

function mapFromAccount(raw: RawTransactionDetailsRow) {
    return buildAccountInfo({
        id: raw.from_id,
        name: raw.from_name,
        icon: raw.from_icon,
        color: raw.from_color,
        type: raw.from_type,
        currency: raw.from_currencyCode,
    });
}

function mapToAccount(raw: RawTransactionDetailsRow) {
    return buildAccountInfo({
        id: raw.to_id,
        name: raw.to_name,
        icon: raw.to_icon,
        color: raw.to_color,
        type: raw.to_type,
        currency: raw.to_currencyCode,
    });
}

function mapCategory(
    raw: RawTransactionDetailsRow,
    categoryInfoMap: Map<number, any>
) {
    return raw.categoryId ? categoryInfoMap.get(raw.categoryId) : undefined;
}

function mapTransactionDetails(
    type: TransactionType,
    {
        transaction,
        category,
        fromAccount,
        toAccount,
    }: {
        transaction: Transaction;
        category?: any;
        fromAccount?: any;
        toAccount?: any;
    }
): TransactionDetails {
    switch (type) {
        case TransactionType.Expense:
            return { transaction, category, fromAccount } as ExpenseDetails;
        case TransactionType.Income:
            return { transaction, category, toAccount } as IncomeDetails;
        case TransactionType.Transfer:
            return { transaction, fromAccount, toAccount } as TransferDetails;
        default:
            throw new Error("Unknown transaction type: " + type);
    }
}