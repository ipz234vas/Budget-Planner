import { Section } from "../components/GenericSectionList";
import { TransactionDetails } from "../../domain/interfaces/models/transactions/TransactionDetails";

export type TransactionSection = Section<TransactionDetails, {
    date: string;
    total: number;
    currency: string;
}>;