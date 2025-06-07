import { useCallback, useEffect, useState } from "react";
import { TransactionDetails } from "../../../domain/interfaces/models/transactions/TransactionDetails";
import { useTransactionDetailsService } from "./useTransactionDetailsService";

export function useTransactionsDetails() {
    const [transactions, setTransactions] = useState<TransactionDetails[]>([]);
    const [loading, setLoading] = useState(true);

    const service = useTransactionDetailsService();

    const loadTransactions = useCallback(async () => {
        if (!service) {
            return;
        }
        setLoading(true);
        const details = await service.getAllDetails();
        setTransactions(details);
        setLoading(false);
    }, [service]);

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);


    const deleteTransaction = useCallback(async (id: number) => {
        if (!service) {
            return;
        }
        await service.deleteTransaction(id);
        setTransactions(prevState => prevState.filter(value => value.transaction.id !== id));
    }, [service, loadTransactions]);

    return {
        transactions,
        loading,
        deleteTransaction,
    };
}
