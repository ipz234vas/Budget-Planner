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

    async getChildrenByParent(
        type: CategoryType,
        parentId?: number | null
    ): Promise<Category[]> {
        let query = this.repository?.query()
            .select()
            .where("type", { operator: "=", value: type });

        if (parentId == null) {
            query = query?.where("parentId", { operator: "IS NULL" });
        } else {
            query = query?.where("parentId", { operator: "=", value: parentId });
        }

        return query?.executeAsync() || [];
    }

    async deleteCategory(id: number): Promise<void> {
        await this.repository?.delete(id);
    }
}