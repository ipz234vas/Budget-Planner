import { QueryBase } from "./QueryBase";
import * as SQLite from "expo-sqlite";

export class DeleteQuery<T> extends QueryBase<number, T> {
    protected compile(): { sql: string; params: SQLite.SQLiteBindParams } {
        return {
            sql: `DELETE FROM ${this.table}` + this.buildWhere(),
            params: this.params
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