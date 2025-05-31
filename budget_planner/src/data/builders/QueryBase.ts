import { Executable } from "../../domain/interfaces/builders/Executable";
import * as SQLite from "expo-sqlite";
import { SqlCondition } from "../../shared/types/SqlCondition";

export abstract class QueryBase<R, T> implements Executable<R> {
    protected readonly db: SQLite.SQLiteDatabase;
    protected readonly table: string;
    protected readonly wheres: string[] = [];
    protected readonly params: SQLite.SQLiteBindValue[] = [];

    constructor(db: SQLite.SQLiteDatabase, table: string) {
        this.db = db;
        this.table = table;
    }

    where<K extends keyof T>(column: K, condition: SqlCondition): this {
        switch (condition.operator) {
            case "IN":
            case "NOT IN": {
                if (condition.values.length) {
                    const marks = condition.values.map(() => "?").join(", ");
                    this.wheres.push(`${String(column)} ${condition.operator} (${marks})`);
                    this.params.push(...condition.values);
                }
                break;
            }
            case "BETWEEN":
            case "NOT BETWEEN": {
                this.wheres.push(`${String(column)} ${condition.operator} ? AND ?`);
                this.params.push(condition.from, condition.to);
                break;
            }
            case "IS NULL":
            case "IS NOT NULL": {
                this.wheres.push(`${String(column)} ${condition.operator}`);
                break;
            }
            default: {
                this.wheres.push(`${String(column)} ${condition.operator} ?`);
                this.params.push((condition as any).value);
            }
        }
        return this;
    }

    protected buildWhere(): string {
        return this.wheres.length ? ` WHERE ${this.wheres.join(" AND ")}` : "";
    }

    protected abstract compile(): { sql: string; params: SQLite.SQLiteBindParams };

    public abstract executeAsync(): Promise<R>;
}