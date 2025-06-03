import { IRepository } from "../../domain/interfaces/repositories/IRepository";
import { Category } from "../../domain/models/Category";
import { CategoryEditSession, PatchCategoryNode } from "./CategoryEditSession";
import { ISQLiteService } from "../../domain/interfaces/sqlite/ISQLiteService";

export class CategoryPersistenceService {
    constructor(
        private patchSession: CategoryEditSession,
        private repo: IRepository<Category>,
        private isqLiteService: ISQLiteService,
    ) {
    }

    async commit() {
        await this.isqLiteService.getDatabase().withTransactionAsync(async () => {
            for (const id of this.patchSession.removedIds) {
                await this.repo.delete(id);
            }
            for (const node of this.patchSession.roots) {
                await this.saveRecursive(node, null);
            }
        });
        this.patchSession.roots = [];
        this.patchSession.removedIds = [];
    }

    private async saveRecursive(node: PatchCategoryNode, parentId: number | null) {
        let id = node.id;
        let toSave: Omit<Category, "id" | "children"> & { id?: number } = { ...node };
        delete (toSave as any).children;
        toSave.parentId = parentId;
        if (id == undefined || id < 0) {
            id = await this.repo.insert({ ...toSave, id: undefined });
            node.id = id;
        } else {
            await this.repo.update({ ...toSave, id });
        }
        for (const child of node.children) {
            await this.saveRecursive(child, id);
        }
    }
}
