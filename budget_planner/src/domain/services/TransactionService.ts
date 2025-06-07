import { IRepository } from "../interfaces/repositories/IRepository";
import { Transaction } from "../models/Transaction";
import { Account } from "../models/Account";
import { Category } from "../models/Category";
import { TransactionDetails } from "../interfaces/models/transactions/TransactionDetails";
import { AccountInfo } from "../interfaces/models/transactions/AccountInfo";
import { CategoryInfo } from "../interfaces/models/transactions/CategoryInfo";
import { TransactionType } from "../enums/TransactionType";
import { TransferDetails } from "../interfaces/models/transactions/TransferDetails";
import { IncomeDetails } from "../interfaces/models/transactions/IncomeDetails";
import { ExpenseDetails } from "../interfaces/models/transactions/ExpenseDetails";

export class TransactionService {
    constructor(
        private transactionRepo: IRepository<Transaction>,
        private accountRepo: IRepository<Account>,
        private categoryRepo: IRepository<Category>
    ) {
    }

    async getAllDetails(): Promise<TransactionDetails[]> {
        const [transactions, accounts, categories] = await Promise.all([
            this.transactionRepo.getAll(),
            this.accountRepo.getAll(),
            this.categoryRepo.getAll(),
        ]);

        const accountsMap = new Map<number, AccountInfo>(
            accounts.map(a => [a.id!, {
                id: a.id!,
                name: a.name,
                icon: a.icon,
                color: a.color,
                type: a.type
            }])
        );

        const categoriesMap = new Map<number, CategoryInfo>();
        categories.forEach(cat => {
            categoriesMap.set(cat.id!, {
                id: cat.id!,
                name: cat.name,
                icon: cat.icon,
                color: cat.color,
                type: cat.type,
                parent: undefined
            });
        });

        categoriesMap.forEach((cat, id) => {
            const original = categories.find(c => c.id === id);
            if (original && original.parentId) {
                cat.parent = categoriesMap.get(original.parentId) || undefined;
            }
        });

        return transactions.map(tr => {
            if (tr.type === TransactionType.Expense) {
                return {
                    transaction: tr,
                    category: tr.categoryId ? categoriesMap.get(tr.categoryId) : undefined,
                    fromAccount: tr.fromAccountId ? accountsMap.get(tr.fromAccountId) : undefined,
                    toAccount: undefined,
                } as ExpenseDetails;
            }
            if (tr.type === TransactionType.Income) {
                return {
                    transaction: tr,
                    category: tr.categoryId ? categoriesMap.get(tr.categoryId) : undefined,
                    fromAccount: undefined,
                    toAccount: tr.toAccountId ? accountsMap.get(tr.toAccountId) : undefined,
                } as IncomeDetails;
            }

            return {
                transaction: tr,
                category: undefined,
                fromAccount: tr.fromAccountId ? accountsMap.get(tr.fromAccountId) : undefined,
                toAccount: tr.toAccountId ? accountsMap.get(tr.toAccountId) : undefined,
            } as TransferDetails;
        });
    }

    async deleteTransaction(id: number): Promise<void> {
        await this.transactionRepo.delete(id);
    }
}
