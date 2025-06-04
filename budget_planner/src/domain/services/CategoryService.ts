import { IRepository } from "../interfaces/repositories/IRepository";
import { Category } from "../models/Category";
import { CategoryType } from "../enums/CategoryType";

export class CategoryService {
    private repository: IRepository<Category> | null;
    constructor(repository: IRepository<Category> | null) {
        this.repository = repository;
    }

    async getRootCategories(type: CategoryType): Promise<Category[]> {
        return await this.repository?.query()
            .select()
            .where("parentId", { operator: "IS NULL" })
            .where("type", { operator: "=", value: type })
            .executeAsync() || [];
    }

    async deleteCategory(id: number): Promise<void> {
        await this.repository?.delete(id);
    }
}