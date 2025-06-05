import { Repository } from "./Repository";
import { ISQLiteService } from "../../domain/interfaces/sqlite/ISQLiteService";
import { Category } from "../../domain/models/Category";
import { IRepository } from "../../domain/interfaces/repositories/IRepository";
import { Account } from "../../domain/models/Account";

export class RepositoryFactory {
    private readonly _sqliteService: ISQLiteService;
    private _repos: Map<string, IRepository<any>> = new Map();

    constructor(sqliteService: ISQLiteService) {
        this._sqliteService = sqliteService;
    }

    public getRepository<T extends { id?: number }>(ctor: new (...args: any[]) => T): IRepository<T> | null {
        const key = ctor.name;
        if (this._repos.has(key)) {
            return this._repos.get(key) as IRepository<T>;
        }

        let repo: IRepository<T> | null = null;
        if (key === Category.name) {
            repo = new Repository<Category>("categories", this._sqliteService) as unknown as IRepository<T>;
        } else if (key === Account.name) {
            repo = new Repository<Account>("accounts", this._sqliteService) as unknown as IRepository<T>;
        }

        if (repo) {
            this._repos.set(key, repo);
        }

        return repo;
    }
}
