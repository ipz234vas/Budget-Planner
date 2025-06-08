import { Section } from "../components/universal/GenericSectionList";
import { TransactionDetails } from "../../domain/interfaces/models/transactions/TransactionDetails";

export type TransactionSection = Section<TransactionDetails, {
    date: string;
    total: number;
    currency: string;
}>;