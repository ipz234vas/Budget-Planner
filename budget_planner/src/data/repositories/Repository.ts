import { ISQLiteService } from "../../domain/interfaces/sqlite/ISQLiteService";
import { IRepository } from "../../domain/interfaces/repositories/IRepository";

import { Query } from "../builders/Query";

export class Repository<T extends { id?: number | string }> implements IRepository<T> {
    private readonly _sqliteService: ISQLiteService;
    private readonly _tableName: string;

    constructor(tableName: string, sqliteService: ISQLiteService) {
        this._sqliteService = sqliteService;
        this._tableName = tableName;
    }

    query() {
        const db = this._sqliteService.getDatabase();
        const query = new Query(db);
        return query.table<T>(this._tableName);
    }

    async getById(id: number | string): Promise<T | null> {
        const rows = await this.query()
            .select()
            .where("id", { operator: "=", value: id })
            .limit(1)
            .executeAsync();
        return rows.length > 0 ? rows[0] : null;
    }

    async getAll(): Promise<T[]> {
        return await this.query().select().executeAsync();
    }

    async insert(item: T): Promise<void> {
        const toInsert = { ...item };
        delete (toInsert as any).id;
        await this.query().insert(toInsert).executeAsync();
    }

    async update(item: Partial<T>): Promise<void> {
        if (!item.id)
            throw new Error("Cannot update entity without `id` field");
        const toUpdate = { ...item };
        const id = toUpdate.id;
        delete toUpdate.id;
        await this.query().update(toUpdate).where("id", { operator: "=", value: id }).executeAsync();
    }

    async delete(id: number | string): Promise<void> {
        await this.query().delete().where("id", { operator: "=", value: id }).executeAsync();
    }
}