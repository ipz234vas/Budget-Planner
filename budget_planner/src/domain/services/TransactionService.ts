import { IRepository } from "../interfaces/repositories/IRepository";
import { Account } from "../models/Account";
import { Category } from "../models/Category";
import { TransactionDetails } from "../interfaces/models/transactions/TransactionDetails";
import { ITransactionRepository } from "../interfaces/repositories/ITransactionRepository";
import { Snapshot } from "../models/Snapshot";
import { TransactionType } from "../enums/TransactionType";
import { SnapshotTargetType } from "../enums/SnapshotTargetType";
import { Transaction } from "../models/Transaction";
import { CurrencyConverter } from "../../data/services/currency/CurrencyConverter";
import { createTransactionMapper } from "../mappers/createTransactionMapper";
import { getTimestamp } from "../helpers/getTimestamp";
import { calculateBalanceFromTransactions } from "../helpers/calculateBalanceFromTransactions";

export class TransactionService {
    constructor(
        private readonly txRepo: ITransactionRepository,
        private readonly accountRepo: IRepository<Account>,
        private readonly categoryRepo: IRepository<Category>,
        private readonly snapshotRepo: IRepository<Snapshot>,
        private readonly currencyConverter: CurrencyConverter,
    ) {
    }

    async getAllDetails(): Promise<TransactionDetails[]> {
        const [rows, categories] = await Promise.all([
            this.txRepo.getDetails(),
            this.categoryRepo.getAll(),
        ]);
        return rows.map(createTransactionMapper(categories));
    }

    async deleteTransaction(id: number, updateBalance: boolean): Promise<void> {
        const tx = await this.getTransactionByIdOrThrow(id);
        await this.applyTransactionEffect(tx, -1, updateBalance);
        await this.txRepo.delete(id);
    }

    async createTransaction(tx: Omit<Transaction, "id">): Promise<number> {
        const id = await this.txRepo.insert(tx);
        await this.applyTransactionEffect(tx, 1, true);
        return id;
    }

    async updateTransaction(id: number, newTx: Omit<Transaction, "id">): Promise<void> {
        const oldTx = await this.getTransactionByIdOrThrow(id);
        await this.applyTransactionEffect(oldTx, -1, true);
        await this.txRepo.update({ id, ...newTx });
        await this.applyTransactionEffect(newTx, 1, true);
    }

    async updateAccountBalanceSnapshots(
        accountId: number,
        delta: number,
        txDate: string | undefined,
        txTime: string | undefined,
        updateBalance: boolean
    ) {
        const txTimestamp = getTimestamp(txDate, txTime);

        if (updateBalance) {
            await this.incrementSnapshotsAndAccount(accountId, delta, txTimestamp);
        } else {
            const balance = await this.recalculateSnapshotBalance(accountId, txTimestamp);
            await this.insertSnapshot(accountId, txDate, txTime, balance);
        }
    }

    private async applyTransactionEffect(
        tx: Pick<Transaction, "type" | "amount" | "fromAccountId" | "toAccountId" | "date" | "time" | "currencyCode" | "rate">,
        sign: 1 | -1,
        updateBalance: boolean
    ) {
        const delta = Number(tx.amount);

        if (tx.type === TransactionType.Expense && tx.fromAccountId) {
            await this.updateAccountBalanceSnapshots(tx.fromAccountId, -sign * delta, tx.date, tx.time, updateBalance);
            return;
        }

        if (tx.type === TransactionType.Income && tx.toAccountId) {
            await this.updateAccountBalanceSnapshots(tx.toAccountId, sign * delta, tx.date, tx.time, updateBalance);
            return;
        }

        if (tx.type === TransactionType.Transfer && tx.fromAccountId && tx.toAccountId) {
            await this.handleTransfer(tx, delta, sign, updateBalance);
        }
    }

    private async handleTransfer(
        tx: Pick<Transaction, "amount" | "fromAccountId" | "toAccountId" | "date" | "time" | "currencyCode" | "rate">,
        delta: number,
        sign: 1 | -1,
        updateBalance: boolean
    ) {
        const { fromAccountId, toAccountId, date, time, currencyCode, rate } = tx;

        if (fromAccountId != null)
            await this.updateAccountBalanceSnapshots(fromAccountId, -sign * delta, date, time, updateBalance);

        if (toAccountId == null)
            return;

        const [accFrom, accTo] = await this.getAccounts(fromAccountId || 0, toAccountId);

        let convertedAmount = delta;
        if (accFrom?.currencyCode && accTo?.currencyCode && accFrom.currencyCode !== accTo.currencyCode) {
            convertedAmount = await this.currencyConverter.convert(
                delta,
                accFrom.currencyCode,
                accTo.currencyCode,
                date || "",
                rate || 1
            );
        }

        await this.updateAccountBalanceSnapshots(toAccountId, sign * convertedAmount, date, time, updateBalance);
    }

    private async getAccounts(...accountIds: (number)[]): Promise<(Account | null)[]> {
        return Promise.all(accountIds.map(id => this.accountRepo.getById(id)));
    }

    private async incrementSnapshotsAndAccount(accountId: number, delta: number, fromTime: number) {
        const snapshots = await this.snapshotRepo.query()
            .select()
            .where("targetId", { operator: "=", value: accountId })
            .where("targetType", { operator: "=", value: SnapshotTargetType.Account })
            .orderBy("date", "ASC")
            .executeAsync();

        for (const snap of snapshots) {
            const snapTime = new Date(snap.date).getTime();
            if (snapTime >= fromTime) {
                snap.amount += delta;
                await this.snapshotRepo.update(snap);
            }
        }

        const acc = await this.accountRepo.getById(accountId);
        if (acc) {
            acc.currentAmount += delta;
            await this.accountRepo.update(acc);
        }
    }

    private async recalculateSnapshotBalance(accountId: number, toTime: number): Promise<number> {
        const snapshots = await this.snapshotRepo.query()
            .select()
            .where("targetId", { operator: "=", value: accountId })
            .where("targetType", { operator: "=", value: SnapshotTargetType.Account })
            .orderBy("date", "ASC")
            .executeAsync();

        const lastSnapBefore = snapshots
            .reverse()
            .find(snap => new Date(snap.date).getTime() <= toTime);

        const baseBalance = lastSnapBefore?.amount ?? 0;
        const lastSnapTime = lastSnapBefore ? new Date(lastSnapBefore.date).getTime() : 0;

        const transactions = await this.txRepo.query()
            .select()
            .whereOrGroup([
                { column: "toAccountId", condition: { operator: "=", value: accountId } },
                { column: "fromAccountId", condition: { operator: "=", value: accountId } },
            ])
            .executeAsync();

        const delta = calculateBalanceFromTransactions(transactions, accountId, lastSnapTime, toTime);
        return baseBalance + delta;
    }

    private async insertSnapshot(accountId: number, date: string | undefined, time: string | undefined, amount: number) {
        await this.snapshotRepo.insert({
            targetId: accountId,
            targetType: SnapshotTargetType.Account,
            date: `${date}T${time ?? "00:00:00"}`,
            amount
        });
    }

    private async getTransactionByIdOrThrow(id: number): Promise<Transaction> {
        const tx = await this.txRepo.getById(id);
        if (!tx) throw new Error("Транзакція не знайдена");
        return tx;
    }
}