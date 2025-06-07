import { TransactionDetails } from "../../domain/interfaces/models/transactions/TransactionDetails";

export type TransactionsStackParamList = {
    Transactions: {},
    TransactionEditor: { details?: TransactionDetails };
};