import { ExpenseDetails } from "./ExpenseDetails";
import { IncomeDetails } from "./IncomeDetails";
import { TransferDetails } from "./TransferDetails";

export type TransactionDetails =
    | ExpenseDetails
    | IncomeDetails
    | TransferDetails;