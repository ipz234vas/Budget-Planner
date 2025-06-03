import { IRepository } from "../domain/interfaces/repositories/IRepository";
import { Category } from "../domain/models/Category";
import { CategoryHierarchyTree } from "../domain/tree/CategoryHierarchyTree";

export class CategoryViewService {

    private readonly hierarchyTree: CategoryHierarchyTree;

    private readonly categoryRepository: IRepository<Category>;

    private readonly removedIds: Set<number>;

    public constructor(
        hierarchyTree: CategoryHierarchyTree,
        removedIds: Set<number>,
        categoryRepository: IRepository<Category>,
    ) {
        this.hierarchyTree = hierarchyTree;
        this.removedIds = removedIds;
        this.categoryRepository = categoryRepository;
    }

    public async getChildren(parentId: number | null): Promise<Category[]> {
        let dbChildren: Category[] = await this.categoryRepository
            .query()
            .select()
            .where("parentId", { operator: parentId === null ? "IS NULL" : "=", value: parentId })
            .executeAsync();

        dbChildren = dbChildren.filter((c: Category): boolean => !this.removedIds.has(c.id!));

        const inMemoryNodes = this.hierarchyTree.getChildrenOf(parentId);
        const inMemoryIds = new Set<number>(inMemoryNodes.map((n) => n.id!));

        const merged: Category[] = [
            ...dbChildren.filter((c) => !inMemoryIds.has(c.id!)),
            ...inMemoryNodes,
        ];

        return merged;
    }

    public async getById(id: number): Promise<Category | null> {
        if (id === undefined || id === null) {
            return null;
        }
        const inMemory = this.hierarchyTree.getNodeById(id);
        if (inMemory != null) {
            return inMemory;
        }
        return await this.categoryRepository.getById(id);
    }
}
