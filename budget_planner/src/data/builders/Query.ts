import * as SQLite from "expo-sqlite";
import { TableQuery } from "./TableQuery";

export class Query {
    private readonly db: SQLite.SQLiteDatabase;

    constructor(db: SQLite.SQLiteDatabase) {
        this.db = db;
    }

    table<T>(tableName: string) {
        return new TableQuery<T>(this.db, tableName);
    }
}