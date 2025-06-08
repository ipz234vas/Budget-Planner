import { IRepository } from "../../../domain/interfaces/repositories/IRepository";
import { Account } from "../../../domain/models/Account";
import { Snapshot } from "../../../domain/models/Snapshot";
import { SnapshotTargetType } from "../../../domain/enums/SnapshotTargetType";

export class AccountService {
    private accountRepository: IRepository<Account>;
    private snapshotRepository: IRepository<Snapshot>;

    constructor(accountRepository: IRepository<Account>, snapshotRepository: IRepository<Snapshot>) {
        this.accountRepository = accountRepository;
        this.snapshotRepository = snapshotRepository;
    }

    async getById(id: number): Promise<Account | null> {
        return this.accountRepository.getById(id);
    }

    async getByType(type: string, excludeId?: number | null): Promise<Account[]> {
        let query = this.accountRepository
            .query()
            .select()
            .where("type", { operator: "=", value: type });

        if (excludeId != null) {
            query = query.where("id", { operator: "!=", value: excludeId });
        }

        return query.executeAsync();
    }

    async save(account: Account, originalAmount?: number | null): Promise<number | undefined> {
        let accountId = account.id;

        if (accountId) {
            await this.updateAccount(account);
        } else {
            accountId = await this.createAccount(account);
        }

        if (this.shouldCreateSnapshot(account, originalAmount)) {
            await this.createSnapshot(accountId!, account.currentAmount);
        }

        return accountId;
    }

    private async updateAccount(account: Account): Promise<void> {
        await this.accountRepository.update(account);
    }

    private async createAccount(account: Account): Promise<number> {
        return this.accountRepository.insert(account);
    }

    private shouldCreateSnapshot(account: Account, originalAmount?: number | null): boolean {
        return !account.id || originalAmount !== account.currentAmount;
    }

    private async createSnapshot(accountId: number, amount: number): Promise<void> {
        const snapshot = new Snapshot({
            targetType: SnapshotTargetType.Account,
            targetId: accountId,
            amount,
            date: new Date().toISOString(),
        });
        await this.snapshotRepository.insert(snapshot);
    }

    async delete(id: number) {
        await this.accountRepository.delete(id);

        await this.snapshotRepository
            .query()
            .delete()
            .where("targetId", {
                operator: "=",
                value: id
            })
            .where("targetType", {
                operator: "=",
                value: SnapshotTargetType.Account
            })
            .executeAsync();
    }
}
