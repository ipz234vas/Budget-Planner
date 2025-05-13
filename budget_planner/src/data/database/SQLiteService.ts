import * as SQLite from 'expo-sqlite';
import { ISQLiteService } from "../../domain/database/ISQLiteService";
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

    public static async getInstance(): Promise<SQLiteService> {
        if (!SQLiteService.instance) {
            SQLiteService.instance = new SQLiteService();
            await SQLiteService.instance.init();
        }
        return SQLiteService.instance;
    }

    private async init() {
        this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    }
}
