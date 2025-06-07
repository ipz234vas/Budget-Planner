import { Repository } from "./Repository";
import { Transaction } from "../../domain/models/Transaction";
import { ISQLiteService } from "../../domain/interfaces/sqlite/ISQLiteService";
import { RawTransactionDetailsRow } from "../../domain/interfaces/models/transactions/RawTransactionDetailsRow";
import { ITransactionRepository } from "../../domain/interfaces/repositories/ITransactionRepository";

export class TransactionRepository extends Repository<Transaction> implements ITransactionRepository {
    constructor(sqlite: ISQLiteService) {
        super("transactions", sqlite);
    }

    async getDetails(): Promise<RawTransactionDetailsRow[]> {
        const db = this._sqliteService.getDatabase();
        return db.getAllAsync<RawTransactionDetailsRow>(SQL_ALL_DETAILS);
    }
}

const SQL_ALL_DETAILS: string = `
        SELECT
          /* ---- transactions ---- */
          t.id, t.type, t.amount, t.currencyCode, t.rate,
          t.date, t.time, t.description,
          t.fromAccountId, t.toAccountId, t.categoryId,
        
          /* ---- category ---- */
          c.id        AS cat_id,
          c.name      AS cat_name,
          c.icon      AS cat_icon,
          c.color     AS cat_color,
          c.type      AS cat_type,
          c.parentId  AS cat_parentId,
        
          /* ---- account "from" ---- */
          af.id       AS from_id,
          af.name     AS from_name,
          af.icon     AS from_icon,
          af.color    AS from_color,
          af.type     AS from_type,
        
          /* ---- account "to" ---- */
          at.id       AS to_id,
          at.name     AS to_name,
          at.icon     AS to_icon,
          at.color    AS to_color,
          at.type     AS to_type
        
        FROM transactions t
        LEFT JOIN categories c  ON c.id  = t.categoryId
        LEFT JOIN accounts  af ON af.id = t.fromAccountId
        LEFT JOIN accounts  at ON at.id = t.toAccountId
`;