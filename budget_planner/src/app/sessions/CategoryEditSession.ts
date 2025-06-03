import { Category } from "../../domain/models/Category";
import { CategoryType } from "../../domain/enums/CategoryType";

export interface PatchCategoryNode extends Category {
    children: PatchCategoryNode[];
}

export class CategoryEditSession {
    roots: PatchCategoryNode[] = [];
    removedIds: number[] = [];
    private nextTempId = -1;

    private findNode(id: number, nodes: PatchCategoryNode[] = this.roots): PatchCategoryNode | null {
        for (const node of nodes) {
            if (node.id === id)
                return node;
            const found = this.findNode(id, node.children);
            if (found)
                return found;
        }
        return null;
    }

    getNode(id: number): PatchCategoryNode | null {
        return this.findNode(id);
    }

    addChild(parentId: number | null, draft: Partial<Category>): PatchCategoryNode {
        const id = draft.id || this.nextTempId--;
        const newNode: PatchCategoryNode = {
            ...draft,
            id,
            parentId,
            name: draft.name || "",
            type: draft.type || CategoryType.Expense,
            children: [],
        };
        if (parentId == null) {
            this.roots.push(newNode);
        } else {
            const parent = this.findNode(parentId);
            if (!parent) throw new Error("Parent not found");
            parent.children.push(newNode);
        }
        return newNode;
    }

    update(id: number, patch: Partial<Category>) {
        const node = this.findNode(id);
        if (node)
            Object.assign(node, patch);
    }

    remove(id: number) {
        let found = false;
        const removeRec = (nodes: PatchCategoryNode[]): boolean => {
            for (let i = 0; i < nodes.length; ++i) {
                if (nodes[i].id === id) {
                    nodes.splice(i, 1);
                    found = true;
                    return true;
                } else if (removeRec(nodes[i].children)) {
                    return true;
                }
            }
            return false;
        };
        removeRec(this.roots);
        if (!found && id > 0 && !this.removedIds.includes(id)) {
            this.removedIds.push(id);
        }
    }
}
