import { ICommand } from "./ICommand";
import { CategoryHierarchyTree } from "../tree/CategoryHierarchyTree";
import { Category } from "../models/Category";

export class UpdateCategoryCommand implements ICommand {

    private tree: CategoryHierarchyTree;

    private readonly id: number;

    private readonly patch: Partial<Category>;

    private previousState!: Partial<Category>;

    public constructor(tree: CategoryHierarchyTree, id: number, patch: Partial<Category>) {
        this.id = id;
        this.patch = patch;
        this.tree = tree;
    }

    public execute(): void {
        const node = this.tree.getNodeById(this.id);
        if (node === null) {
            throw new Error(`Cannot update: id ${this.id} not found.`);
        }
        this.previousState = { ...node };
        this.tree.updateNode(this.id, this.patch);
    }

    public undo(): void {
        this.tree.updateNode(this.id, this.previousState);
    }
}
