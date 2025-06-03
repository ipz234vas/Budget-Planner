import { IRepository } from "../../domain/interfaces/repositories/IRepository";
import { Category } from "../../domain/models/Category";
import { CategoryEditSession, PatchCategoryNode } from "./CategoryEditSession";

export class CategoryViewService {
    constructor(
        private patchSession: CategoryEditSession,
        private repo: IRepository<Category>
    ) {
    }

    async getChildren(parentId: number | null): Promise<Category[]> {
        let dbChildren = await this.repo.query()
            .select()
            .where("parentId", { operator: "=", value: parentId })
            .executeAsync();

        dbChildren = dbChildren.filter(c => !this.patchSession.removedIds.includes(c.id!));

        let inMemoryChildren: PatchCategoryNode[] = [];
        if (parentId == null) inMemoryChildren = this.patchSession.roots;
        else {
            const parent = this.patchSession.getNode(parentId);
            if (parent) inMemoryChildren = parent.children;
        }

        const inMemoryIds = new Set(inMemoryChildren.map(c => c.id));
        return [
            ...dbChildren.filter(c => !inMemoryIds.has(c.id!)),
            ...inMemoryChildren,
        ];
    }

    async getById(id: number): Promise<Category | null> {
        let node = this.patchSession.getNode(id);
        if (node)
            return node;
        return await this.repo.getById(id);
    }
}
