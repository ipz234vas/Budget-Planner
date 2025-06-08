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
            this.categoryRepo.getAll()
        ]);

        const mapToDetails = createTransactionMapper(categories);
        return rows.map(mapToDetails);
    }

    async deleteTransaction(id: number, updateBalance: boolean): Promise<void> {
        const tx = await this.txRepo.getById(id);
        if (!tx)
            throw new Error("Транзакція не знайдена");

        await this.applyTransactionEffect(tx, -1, updateBalance);

        await this.txRepo.delete(id);
    }

    async createTransaction(tx: Omit<Transaction, "id">): Promise<number> {
        const id = await this.txRepo.insert(tx);

        await this.applyTransactionEffect(tx, 1, true);

        return id;
    }

    async updateTransaction(id: number, newTx: Omit<Transaction, "id">): Promise<void> {
        const oldTx = await this.txRepo.getById(id);
        if (!oldTx)
            throw new Error("Транзакція не знайдена");

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
        const txDateTime = `${txDate}T${txTime || "00:00:00"}`;
        const txTimeValue = new Date(txDateTime).getTime();

        const snapshots = await this.snapshotRepo.query().select()
            .where("targetId", { operator: "=", value: accountId })
            .where("targetType", { operator: "=", value: SnapshotTargetType.Account })
            .orderBy("date", "ASC")
            .executeAsync();

        if (updateBalance) {
            for (const snap of snapshots) {
                const snapTime = new Date(snap.date).getTime();
                if (snapTime >= txTimeValue) {
                    snap.amount += delta;
                    await this.snapshotRepo.update(snap);
                }
            }
            const acc = await this.accountRepo.getById(accountId);
            if (acc) {
                acc.currentAmount += delta;
                await this.accountRepo.update(acc);
            }
        } else {
            let lastSnapshotBeforeTx = null;
            for (const snap of snapshots) {
                const snapTime = new Date(snap.date).getTime();
                if (snapTime <= txTimeValue) lastSnapshotBeforeTx = snap;
                else break;
            }

            let baseBalance = lastSnapshotBeforeTx ? lastSnapshotBeforeTx.amount : 0;

            const transactions = await this.txRepo.query()
                .select()
                .whereOrGroup([
                    { column: "toAccountId", condition: { operator: "=", value: accountId } },
                    { column: "fromAccountId", condition: { operator: "=", value: accountId } }
                ])
                .executeAsync();

            function getTxDatetime(tx: { date: string, time?: string }): string {
                return `${tx.date}T${tx.time ?? "00:00:00"}`;
            }

            const lastSnapTime = lastSnapshotBeforeTx
                ? new Date(lastSnapshotBeforeTx.date).getTime()
                : 0;
            const endTime = txTimeValue;

            const filtered = transactions.filter(tx => {
                const time = new Date(getTxDatetime(tx)).getTime();
                return time > lastSnapTime && time <= endTime;
            });

            for (const tx of filtered) {
                if (tx.type === TransactionType.Expense && tx.fromAccountId === accountId)
                    baseBalance -= Number(tx.amount);
                else if (tx.type === TransactionType.Income && tx.toAccountId === accountId)
                    baseBalance += Number(tx.amount);
                else if (tx.type === TransactionType.Transfer) {
                    if (tx.fromAccountId === accountId)
                        baseBalance -= Number(tx.amount);
                    else if (tx.toAccountId === accountId)
                        baseBalance += Number(tx.amount);
                }
            }

            await this.snapshotRepo.insert({
                targetId: accountId,
                targetType: SnapshotTargetType.Account,
                date: txDateTime,
                amount: baseBalance,
            });
        }
    }

    private async applyTransactionEffect(
        tx: Pick<Transaction, "type" | "amount" | "fromAccountId" | "toAccountId" | "date" | "time" | "currencyCode" | "rate">,
        sign: 1 | -1,
        updateBalance: boolean
    ) {
        const { amount, fromAccountId, toAccountId, type, date, time, currencyCode, rate } = tx;
        const delta = Number(amount);

        if (type === TransactionType.Expense && fromAccountId) {
            await this.updateAccountBalanceSnapshots(fromAccountId, -sign * delta, date, time, updateBalance);
        } else if (type === TransactionType.Income && toAccountId) {
            await this.updateAccountBalanceSnapshots(toAccountId, sign * delta, date, time, updateBalance);
        } else if (type === TransactionType.Transfer && fromAccountId && toAccountId) {
            await this.updateAccountBalanceSnapshots(fromAccountId, -sign * delta, date, time, updateBalance);

            const accFrom = await this.accountRepo.getById(fromAccountId);
            const accTo = await this.accountRepo.getById(toAccountId);
            let toAmount = delta;
            if (accFrom?.currencyCode && accTo?.currencyCode && accFrom.currencyCode !== accTo.currencyCode) {
                toAmount = await this.currencyConverter.convert(
                    delta,
                    accFrom.currencyCode,
                    accTo.currencyCode,
                    date,
                    rate
                );
            }
            await this.updateAccountBalanceSnapshots(toAccountId, sign * toAmount, date, time, updateBalance);
        }
    }
}