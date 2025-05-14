import { Repository } from "./Repository";
import { ISQLiteService } from "../../domain/database/ISQLiteService";

export class RepositoryFactory {
    private readonly _sqliteService: ISQLiteService;

    constructor(sqliteService: ISQLiteService) {
        this._sqliteService = sqliteService;
    }

    public getRepository<T extends { id: number }>(ctor: new (...args: any[]) => T): Repository<T> | null {
        const entity = new ctor();
        //example of creating repository
/*        if (entity instanceof Transaction) {
            return new Repository<Transaction>("transactions", this._sqliteService) as unknown as Repository<T>;
        }*/
        return null;
    }
}