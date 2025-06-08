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
        const { where, params } = this.buildWherePart(String(column), condition);
        if (where) {
            this.wheres.push(where);
            this.params.push(...params);
        }
        return this;
    }

    whereOrGroup<K extends keyof T>(conditions: Array<{ column: K, condition: SqlCondition }>): this {
        const parts = conditions.map(({ column, condition }) => this.buildWherePart(String(column), condition));
        const where = "(" + parts.map(p => p.where).join(" OR ") + ")";
        const params = parts.flatMap(p => p.params);

        if (parts.length) {
            this.wheres.push(where);
            this.params.push(...params);
        }
        return this;
    }

    protected buildWherePart<K extends string>(
        column: K,
        condition: SqlCondition
    ): { where: string; params: SQLite.SQLiteBindValue[] } {
        switch (condition.operator) {
            case "IN":
            case "NOT IN": {
                if (!condition.values.length) return { where: "", params: [] };
                const marks = condition.values.map(() => "?").join(", ");
                return {
                    where: `${column} ${condition.operator} (${marks})`,
                    params: condition.values,
                };
            }
            case "BETWEEN":
            case "NOT BETWEEN": {
                return {
                    where: `${column} ${condition.operator} ? AND ?`,
                    params: [condition.from, condition.to],
                };
            }
            case "IS NULL":
            case "IS NOT NULL": {
                return {
                    where: `${column} ${condition.operator}`,
                    params: [],
                };
            }
            default: {
                return {
                    where: `${column} ${condition.operator} ?`,
                    params: [(condition as any).value],
                };
            }
        }
    }

    protected buildWhere(): string {
        return this.wheres.length ? ` WHERE ${this.wheres.join(" AND ")}` : "";
    }

    protected abstract compile(): { sql: string; params: SQLite.SQLiteBindParams };

    public abstract executeAsync(): Promise<R>;
}