import { TransactionType } from "../../domain/enums/TransactionType";

export const fmtDate = (d: Date): string =>
    d.toLocaleDateString("uk-UA");

export const fmtTime = (d: Date): string =>
    d.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });

export const typeItems = [
    { label: "Витрата", value: TransactionType.Expense },
    { label: "Дохід", value: TransactionType.Income },
    { label: "Переказ", value: TransactionType.Transfer },
];
