import { ICommand } from "./ICommand";
import { CategoryHierarchyTree } from "../tree/CategoryHierarchyTree";
import { PatchCategoryNode } from "../interfaces/tree/PatchCategoryNode";

export class RemoveCategoryCommand implements ICommand {

    private tree: CategoryHierarchyTree;

    private readonly id: number;

    private backupNode!: PatchCategoryNode;

    private parentId!: number | null;

    private removedIds: Set<number>

    public constructor(tree: CategoryHierarchyTree, id: number, removedIds: Set<number>) {
        this.id = id;
        this.tree = tree;
        this.removedIds = removedIds;
    }

    public execute(): void {
        this.removedIds.add(this.id);
        if (this.tree.getNodeById(this.id) == null) {
            return;
        }
        const node = this.tree.detachNode(this.id);
        this.backupNode = node;
        this.parentId = node.parentId ?? null;
    }

    public undo(): void {
        this.removedIds.delete(this.id);
        if (!this.backupNode) {
            return;
        }
        this.tree.attachNode(this.parentId, this.backupNode);
    }
}
