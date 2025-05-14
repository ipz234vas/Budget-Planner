import { ISQLiteService } from "../../domain/database/ISQLiteService";

export class DatabaseInitializer {
    private readonly _sqliteService: ISQLiteService

    constructor(sqliteService: ISQLiteService) {
        this._sqliteService = sqliteService
    }

    public async init() {
        const db = this._sqliteService.getDatabase();

        await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL);
        `)
    }
}