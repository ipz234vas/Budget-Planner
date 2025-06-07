import { ISQLiteService } from "../../domain/interfaces/sqlite/ISQLiteService";
import { IRepository } from "../../domain/interfaces/repositories/IRepository";
import { Query } from "../builders/Query";

export class Repository<T extends Record<string, any>> implements IRepository<T> {
    protected readonly _sqliteService: ISQLiteService;
    protected readonly _tableName: string;
    protected readonly _primaryKey: keyof T;
    protected readonly _autoGeneratePrimaryKey: boolean;

    constructor(
        tableName: string,
        sqliteService: ISQLiteService,
        primaryKey: keyof T = "id" as keyof T,
        autoGeneratePrimaryKey: boolean = true
    ) {
        this._sqliteService = sqliteService;
        this._tableName = tableName;
        this._primaryKey = primaryKey;
        this._autoGeneratePrimaryKey = autoGeneratePrimaryKey
    }

    query() {
        const db = this._sqliteService.getDatabase();
        return new Query(db).table<T>(this._tableName);
    }

    async getById(id: T[keyof T]): Promise<T | null> {
        const rows = await this.query()
            .select()
            .where(this._primaryKey as string, { operator: "=", value: id })
            .limit(1)
            .executeAsync();

        return rows.length > 0 ? rows[0] : null;
    }

    async getAll(): Promise<T[]> {
        return await this.query().select().executeAsync();
    }

    async insert(item: T): Promise<number> {
        const toInsert = { ...item };

        if (this._autoGeneratePrimaryKey) {
            delete toInsert[this._primaryKey];
        }

        return await this.query().insert(toInsert).executeAsync();
    }

    async update(item: Partial<T>): Promise<void> {
        const keyValue = item[this._primaryKey];

        if (!keyValue) {
            throw new Error(`Cannot update entity without \`${String(this._primaryKey)}\` field`);
        }

        const toUpdate = { ...item };
        delete toUpdate[this._primaryKey];

        await this.query()
            .update(toUpdate)
            .where(this._primaryKey as string, { operator: "=", value: keyValue })
            .executeAsync();
    }

    async delete(id: T[keyof T]): Promise<void> {
        await this.query()
            .delete()
            .where(this._primaryKey as string, { operator: "=", value: id })
            .executeAsync();
    }
}