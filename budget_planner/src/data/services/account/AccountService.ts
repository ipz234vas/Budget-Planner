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

    async getByType(type: string): Promise<Account[]> {
        return this.accountRepository
            .query()
            .select()
            .where("type", { operator: "=", value: type })
            .executeAsync();
    }

    //зарефакторити
    async save(account: Account, originalAmount?: number | null): Promise<number | undefined> {
        let accountId = account.id;
        if (accountId) {
            await this.accountRepository.update(account);
        } else {
            accountId = await this.accountRepository.insert(account);
        }
        const amountChanged = !account.id || originalAmount !== account.currentAmount;
        if (amountChanged && accountId) {
            const snapshot = new Snapshot({
                targetType: SnapshotTargetType.Account,
                targetId: accountId,
                amount: account.currentAmount,
                date: new Date().toISOString(),
            });
            await this.snapshotRepository.insert(snapshot);
        }
        return accountId;
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
