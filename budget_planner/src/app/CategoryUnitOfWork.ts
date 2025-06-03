import { IRepository } from "../domain/interfaces/repositories/IRepository";
import { Category } from "../domain/models/Category";
import { CategoryHierarchyTree } from "../domain/tree/CategoryHierarchyTree";
import { ISQLiteService } from "../domain/interfaces/sqlite/ISQLiteService";
import { PatchCategoryNode } from "../domain/interfaces/tree/PatchCategoryNode";

export class CategoryUnitOfWork {

    private readonly categoryRepository: IRepository<Category>;

    private readonly sqliteService: ISQLiteService;

    public constructor(categoryRepository: IRepository<Category>, sqliteService: ISQLiteService) {
        this.categoryRepository = categoryRepository;
        this.sqliteService = sqliteService;
    }

    public async commit(hierarchyTree: CategoryHierarchyTree, removedIds: number[]): Promise<void> {
        await this.sqliteService.getDatabase().withTransactionAsync(async () => {

            for (const id of removedIds) {
                await this.categoryRepository.delete(id);
            }

            const rootNodes: PatchCategoryNode[] = hierarchyTree.getChildrenOf(null);

            for (const rootNode of rootNodes) {
                await this.saveRecursive(rootNode, null);
            }
        });
    }

    private async saveRecursive(node: PatchCategoryNode, parentId: number | null): Promise<void> {
        const { children, ...data } = node;

        data.parentId = parentId;

        if (node.id !== undefined && node.id >= 0) {
            await this.categoryRepository.update(data as Category);
        } else {
            node.id = await this.categoryRepository.insert({ ...(data as Category), id: undefined });
        }

        for (const child of children) {
            await this.saveRecursive(child, node.id!);
        }
    }
}