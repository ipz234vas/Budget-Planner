import { useCallback, useState } from "react";
import { TransactionDetails } from "../../../domain/interfaces/models/transactions/TransactionDetails";
import { useTransactionDetailsService } from "./useTransactionDetailsService";
import { useFocusEffect } from "@react-navigation/native";

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

    useFocusEffect(
        useCallback(() => {
            loadTransactions();
        }, [loadTransactions])
    );

    const deleteTransaction = useCallback(async (id: number, updateBalance: boolean = true) => {
        if (!service) {
            return;
        }
        await service.deleteTransaction(id, updateBalance);
        setTransactions(prevState => prevState.filter(value => value.transaction.id !== id));
    }, [service, loadTransactions]);

    return {
        transactions,
        loading,
        deleteTransaction,
    };
}
