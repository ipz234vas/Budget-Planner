// src/domain/services/TransactionService.ts
import { createTransactionMapper } from "../mappers/TransactionMapper";
import { IRepository } from "../interfaces/repositories/IRepository";
import { Account } from "../models/Account";
import { Category } from "../models/Category";
import { TransactionDetails } from "../interfaces/models/transactions/TransactionDetails";
import { ITransactionRepository } from "../interfaces/repositories/ITransactionRepository";

export class TransactionService {
    constructor(
        private readonly txRepo: ITransactionRepository,
        private readonly accountRepo: IRepository<Account>,   // лишаються «на потім»
        private readonly categoryRepo: IRepository<Category>
    ) {
    }

    /** Один публічний метод – віддати все готовим для UI */
    async getAllDetails(): Promise<TransactionDetails[]> {
        const [rows, categories] = await Promise.all([
            this.txRepo.getDetails(),
            this.categoryRepo.getAll()
        ]);

        const mapToDetails = createTransactionMapper(categories);
        return rows.map(mapToDetails);
    }

    async deleteTransaction(id: number): Promise<void> {
        await this.txRepo.delete(id);
    }
}
