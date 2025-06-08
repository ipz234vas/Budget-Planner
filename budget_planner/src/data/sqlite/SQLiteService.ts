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

    public async resetDatabase(): Promise<void> {
        if (this.db) {
            await this.db.closeAsync();
        }

        await SQLite.deleteDatabaseAsync(DATABASE_NAME);

        await this.init();
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
            goalDeadline  TEXT    NULL
        );
        
        CREATE TABLE IF NOT EXISTS snapshots (
          id INTEGER PRIMARY KEY,
          targetType TEXT NOT NULL CHECK (targetType IN ('account', 'planned_expense', 'planned_saving', 'planned_income')),
          targetId INTEGER NOT NULL,
          amount REAL NOT NULL,
          date TEXT NOT NULL,
          UNIQUE(targetType, targetId, date)
        );
        
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY,
            type TEXT NOT NULL CHECK(type IN ('expense', 'income', 'transfer')),
            amount REAL NOT NULL CHECK(amount > 0),
            currencyCode TEXT NOT NULL,
            rate REAL, 
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            description TEXT,
        
            fromAccountId INTEGER,
            toAccountId INTEGER,
            categoryId INTEGER,
        
            FOREIGN KEY (fromAccountId) REFERENCES accounts(id) ON DELETE SET NULL,
            FOREIGN KEY (toAccountId) REFERENCES accounts(id) ON DELETE SET NULL,
            FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
        );
      `);
    }
}