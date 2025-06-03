import { ICommand } from "./ICommand";
import { CategoryHierarchyTree } from "../tree/CategoryHierarchyTree";
import { Category } from "../models/Category";

export class AddCategoryCommand implements ICommand {

    private readonly tree: CategoryHierarchyTree;

    private readonly parentId: number | null;

    private readonly draft: Partial<Category>;

    public newNodeId!: number;

    public constructor(
        tree: CategoryHierarchyTree,
        parentId: number | null,
        draft: Partial<Category>,
    ) {
        this.tree = tree;
        this.parentId = parentId;
        this.draft = draft;
    }

    public execute(): void {
        this.newNodeId = this.tree.addChildNode(this.parentId, this.draft).id!;
    }

    public undo(): void {
        this.tree.detachNode(this.newNodeId);
    }
}
