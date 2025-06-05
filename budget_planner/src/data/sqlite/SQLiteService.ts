import * as SQLite from 'expo-sqlite';
import { ISQLiteService } from "../../domain/interfaces/sqlite/ISQLiteService";
import { DATABASE_NAME } from "../../shared/constants/db";

export class SQLiteService implements ISQLiteService {
    private static instance: SQLiteService;
    private db!: SQLite.SQLiteDatabase;

    private constructor() {
        if (new.target !== SQLiteService) {
            throw new Error("SQLiteService is sealed and cannot be extended.");
        }
    }

    public getDatabase(): SQLite.SQLiteDatabase {
        return this.db;
    }

    public static async getInstance(): Promise<ISQLiteService> {
        if (!SQLiteService.instance) {
            SQLiteService.instance = new SQLiteService();
            await SQLiteService.instance.init();
        }
        return SQLiteService.instance;
    }

    private async init() {
        this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);

        await this.db.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;
    
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            color TEXT,
            icon TEXT,
            type TEXT CHECK(type IN ('expense', 'income')),
            parentId INTEGER,
            FOREIGN KEY (parentId) REFERENCES categories(id) ON DELETE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS accounts (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            name          TEXT    NOT NULL,
            type          TEXT    CHECK (type IN ('account', 'saving') ),
            currentAmount REAL    DEFAULT 0     NOT NULL,
            currencyCode  TEXT    NOT NULL,
            color         TEXT    NULL,
            icon          TEXT    NULL,
            creditLimit   REAL    NULL,
            goalAmount    REAL    NULL,
            goalDeadline  TEXT    NULL,
        );
      `);
    }
}