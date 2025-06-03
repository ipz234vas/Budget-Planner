import { TableQuery } from "../../../data/builders/TableQuery";

export interface IRepository<T> {
    getById(id: number): Promise<T | null>;

    getAll(): Promise<T[]>;

    insert(item: T): Promise<number>;

    update(item: Partial<T>): Promise<void>;

    delete(id: number): Promise<void>;

    query(): TableQuery<T>
}