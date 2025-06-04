import { CategoryHierarchyTree } from "../tree/CategoryHierarchyTree";
import { CommandManager } from "../commands/CommandManager";

export class CategorySession {
    public hierarchyTree: CategoryHierarchyTree;
    public commandManager: CommandManager;
    public removedIds: Set<number>;

    constructor() {
        this.hierarchyTree = new CategoryHierarchyTree();
        this.commandManager = new CommandManager();
        this.removedIds = new Set<number>();
    }

    clear() {
        this.hierarchyTree.clear();
        this.commandManager.clear();
        this.removedIds.clear();
    }
}