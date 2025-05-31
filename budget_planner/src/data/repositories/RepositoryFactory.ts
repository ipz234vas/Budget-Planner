import { Repository } from "./Repository";
import { ISQLiteService } from "../../domain/interfaces/sqlite/ISQLiteService";
import { Category } from "../../domain/models/Category";
import { IRepository } from "../../domain/interfaces/repositories/IRepository";

export class RepositoryFactory {
    private readonly _sqliteService: ISQLiteService;

    constructor(sqliteService: ISQLiteService) {
        this._sqliteService = sqliteService;
    }

    public getRepository<T extends { id?: number }>(ctor: new (...args: any[]) => T): IRepository<T> | null {
        const entity = new ctor();
        if (entity instanceof Category) {
            return new Repository<Category>("categories", this._sqliteService) as unknown as Repository<T>;
        }
        return null;
    }
}