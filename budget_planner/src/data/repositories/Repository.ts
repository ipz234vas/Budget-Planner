import { IRepository } from "../../domain/repositories/IRepository";
import { ISQLiteService } from "../../domain/database/ISQLiteService";

export class Repository<T extends { id: number | string }> implements IRepository<T> {
    private readonly _sqliteService: ISQLiteService;
    private readonly _tableName: string

    constructor(tableName: string, sqliteService: ISQLiteService) {
        this._sqliteService = sqliteService;
        this._tableName = tableName;
    }

    async getById(id: number): Promise<T | null> {
        const db = this._sqliteService.getDatabase();
        const row = await db.getFirstAsync<T>(
            `SELECT * FROM ${this._tableName} WHERE id = ?`,
            [id]
        );
        return row ?? null;
    }

    async getAll(): Promise<T[]> {
        const db = this._sqliteService.getDatabase();
        return await db.getAllAsync<T>(
            `SELECT * FROM ${this._tableName}`
        );
    }

    async insert(item: T): Promise<void> {
        const db = this._sqliteService.getDatabase();
        const keys = Object.keys(item).filter(k => k !== "id");
        const cols = keys.join(", ");
        const placeholders = keys.map(_ => "?").join(", ");
        const values = keys.map(k => (item as any)[k]);
        await db.runAsync(
            `INSERT INTO ${this._tableName} (${cols}) VALUES (${placeholders})`,
            values
        );
    }

    async update(item: Partial<T>): Promise<void> {
        if (item.id == null) {
            throw new Error("Cannot update entity without `id` field");
        }

        const db = this._sqliteService.getDatabase();

        const keys = Object.keys(item).filter(k => k !== "id");
        const assignments = keys.map(k => `${k} = ?`).join(", ");
        const values = keys.map(k => (item as any)[k]);
        values.push(item.id);

        await db.runAsync(
            `UPDATE ${this._tableName} SET ${assignments} WHERE id = ?`,
            values
        );
    }


    async delete(id: number): Promise<void> {
        const db = this._sqliteService.getDatabase();
        await db.runAsync(
            `DELETE FROM ${this._tableName} WHERE id = ?`,
            [id]
        );
    }
}