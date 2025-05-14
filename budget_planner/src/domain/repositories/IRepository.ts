export interface IRepository<T> {
    getById(id: number): Promise<T | null>;
    getAll(): Promise<T[]>;
    insert(item: T): Promise<void>;
    update(item: Partial<T>): Promise<void>;
    delete(id: number): Promise<void>;
}