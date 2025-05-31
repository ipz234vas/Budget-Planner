import * as SQLite from "expo-sqlite";
import { OffsettableSelect } from "../../domain/interfaces/builders/OffsettableSelect";
import { SelectQuery } from "./SelectQuery";
import { InsertQuery } from "./InsertQuery";
import { UpdateQuery } from "./UpdateQuery";
import { DeleteQuery } from "./DeleteQuery";

export class TableQuery<T> {
    private readonly db: SQLite.SQLiteDatabase;
    private readonly table: string;

    constructor(db: SQLite.SQLiteDatabase, table: string) {
        this.db = db;
        this.table = table;
    }

    select<K extends keyof T>(...columns: K[]): OffsettableSelect<Pick<T, K>> {
        return new SelectQuery<Pick<T, K>>(this.db, this.table).select(...columns);
    }

    insert(values: Partial<T>): InsertQuery<T> {
        return new InsertQuery<T>(this.db, this.table, values);
    }

    update(values: Partial<T>): UpdateQuery<T> {
        return new UpdateQuery<T>(this.db, this.table, values);
    }

    delete(): DeleteQuery<T> {
        return new DeleteQuery<T>(this.db, this.table);
    }
}