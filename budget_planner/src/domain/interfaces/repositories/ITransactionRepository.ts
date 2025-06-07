import { IRepository } from "./IRepository";
import { Transaction } from "../../models/Transaction";
import { RawTransactionDetailsRow } from "../models/transactions/RawTransactionDetailsRow";

export interface ITransactionRepository extends IRepository<Transaction> {
    getDetails(): Promise<RawTransactionDetailsRow[]>;
}