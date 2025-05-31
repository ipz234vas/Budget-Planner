import { QueryBase } from "./QueryBase";
import { OffsettableSelect } from "../../domain/interfaces/builders/OffsettableSelect";
import { LimitedSelect } from "../../domain/interfaces/builders/LimitedSelect";

export class SelectQuery<T> extends QueryBase<T[], T> implements OffsettableSelect<T>, LimitedSelect<T> {
    private columns: (keyof T)[] = [];
    private orderByClause?: string;
    private limitCount?: number;
    private offsetStart?: number;

    select<K extends keyof T>(...columns: K[]): this {
        if (columns.length) this.columns = columns;
        return this;
    }

    orderBy<K extends keyof T>(column: K, direction: "ASC" | "DESC" = "ASC"): this {
        this.orderByClause = `${String(column)} ${direction}`;
        return this;
    }

    limit(n: number): LimitedSelect<T> {
        this.limitCount = n;
        return this as LimitedSelect<T>;
    }

    offset(n: number): this {
        this.offsetStart = n;
        return this;
    }

    protected compile() {
        const selectCols =
            this.columns.length > 0
                ? this.columns.map(String).join(", ")
                : "*";
        let sql = `SELECT ${selectCols} FROM ${this.table}` + this.buildWhere();
        if (this.orderByClause) sql += ` ORDER BY ${this.orderByClause}`;
        if (this.limitCount !== undefined) {
            sql += ` LIMIT ${this.limitCount}`;
            if (this.offsetStart !== undefined) {
                sql += ` OFFSET ${this.offsetStart}`;
            }
        }
        return { sql, params: this.params };
    }

    async executeAsync(): Promise<T[]> {
        const { sql, params } = this.compile();
        if (!sql)
            return [];
        return await this.db.getAllAsync(sql, params);
    }
}