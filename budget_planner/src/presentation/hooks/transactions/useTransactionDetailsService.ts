import { useContext, useEffect, useState } from "react";
import { FactoryContext } from "../../../app/contexts/FactoryContext";
import { Account } from "../../../domain/models/Account";
import { TransactionService } from "../../../domain/services/TransactionService";
import { Transaction } from "../../../domain/models/Transaction";
import { Category } from "../../../domain/models/Category";
import { ITransactionRepository } from "../../../domain/interfaces/repositories/ITransactionRepository";
import { Snapshot } from "../../../domain/models/Snapshot";
import { useCurrencyConverter } from "../currencies/useCurrencyConverter";

export function useTransactionDetailsService() {
    const factory = useContext(FactoryContext);
    const [service, setService] = useState<TransactionService | null>(null);
    const { converter: currencyConverter } = useCurrencyConverter();

    useEffect(() => {
        if (!factory) {
            return;
        }

        const transactionRepo = factory.getRepository(Transaction) as ITransactionRepository;
        const accountRepo = factory.getRepository(Account);
        const categoryRepo = factory.getRepository(Category);
        const snapshotRepo = factory.getRepository(Snapshot);

        if (!transactionRepo || !accountRepo || !categoryRepo || !snapshotRepo || !currencyConverter)
            return;

        setService(new TransactionService(transactionRepo, accountRepo, categoryRepo, snapshotRepo, currencyConverter));
    }, [factory]);

    return service;
}
