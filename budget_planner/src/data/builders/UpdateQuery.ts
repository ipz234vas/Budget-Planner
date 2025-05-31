import { QueryBase } from "./QueryBase";
import * as SQLite from "expo-sqlite";

export class UpdateQuery<T> extends QueryBase<number, T> {
    private readonly setObject: Partial<T>;

    constructor(db: SQLite.SQLiteDatabase, table: string, values: Partial<T>) {
        super(db, table);
        this.setObject = values;
    }

    protected compile(): { sql: string; params: SQLite.SQLiteBindParams } {
        const setEntries = Object.entries(this.setObject)
            .filter(([, value]) => value !== undefined);

        if (!setEntries.length) {
            return { sql: "", params: [] };
        }

        const pairs = setEntries.map(([key]) => `${key} = ?`).join(", ");
        const values = setEntries.map(([, value]) => value);

        return {
            sql: `UPDATE ${this.table} SET ${pairs}` + this.buildWhere(),
            params: [...values, ...this.params] as SQLite.SQLiteBindParams,
        };
    }

    async executeAsync(): Promise<number> {
        const { sql, params } = this.compile();
        if (!sql)
            return 0;
        const result = await this.db.runAsync(sql, params);
        return result.changes ?? 0;
    }
}