import { useContext, useEffect, useState } from "react";
import { FactoryContext } from "../../../app/contexts/FactoryContext";
import { Account } from "../../../domain/models/Account";
import { TransactionService } from "../../../domain/services/TransactionService";
import { Transaction } from "../../../domain/models/Transaction";
import { Category } from "../../../domain/models/Category";

export function useTransactionDetailsService() {
    const factory = useContext(FactoryContext);
    const [service, setService] = useState<TransactionService | null>(null);

    useEffect(() => {
        if (!factory) {
            return;
        }
        const transactionRepo = factory.getRepository(Transaction);
        const accountRepo = factory.getRepository(Account);
        const categoryRepo = factory.getRepository(Category);

        if (!transactionRepo || !accountRepo || !categoryRepo)
            return;

        setService(new TransactionService(transactionRepo, accountRepo, categoryRepo));
    }, [factory]);

    return service;
}
