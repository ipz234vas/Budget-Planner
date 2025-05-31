import { QueryBase } from "./QueryBase";
import * as SQLite from "expo-sqlite";

export class InsertQuery<T> extends QueryBase<number, T> {
    private readonly valuesObject: Partial<T>;

    constructor(db: SQLite.SQLiteDatabase, table: string, values: Partial<T>) {
        super(db, table);
        this.valuesObject = values;
    }

    protected compile(): { sql: string; params: SQLite.SQLiteBindParams } {
        if (!this.valuesObject || !Object.keys(this.valuesObject).length) {
            return { sql: "", params: [] };
        }
        const keys = Object.keys(this.valuesObject);
        const marks = keys.map(() => "?").join(", ");
        return {
            sql: `INSERT INTO ${this.table} (${keys.join(", ")}) VALUES (${marks})`,
            params: Object.values(this.valuesObject)
        };
    }

    async executeAsync(): Promise<number> {
        const { sql, params } = this.compile();
        if (!sql)
            return 0;
        const result = await this.db.runAsync(sql, params);
        return result.lastInsertRowId ?? 0;
    }
}