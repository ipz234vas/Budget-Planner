import { Executable } from "./Executable";
import { SqlCondition } from "../../../shared/types/SqlCondition";

export interface Selectable<T> extends Executable<T[]> {
    where<K extends keyof T>(column: K, condition: SqlCondition): this;

    orderBy<K extends keyof T>(column: K, direction?: "ASC" | "DESC"): this;

    select<K extends keyof T>(...columns: K[]): this;
}