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

    public static getInstance():  ISQLiteService {
        if (!SQLiteService.instance) {
            SQLiteService.instance = new SQLiteService();
            SQLiteService.instance.init();
        }
        return SQLiteService.instance;
    }

    private init() {
        this.db = SQLite.openDatabaseSync(DATABASE_NAME);
    }
}
