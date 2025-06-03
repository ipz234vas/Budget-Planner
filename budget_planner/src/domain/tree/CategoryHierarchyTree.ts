import { CategoryType } from "../enums/CategoryType";
import { Category } from "../models/Category";
import { PatchCategoryNode } from "../interfaces/tree/PatchCategoryNode";

export class CategoryHierarchyTree {

    private readonly rootNodes: PatchCategoryNode[] = [];

    private readonly indexById: Map<number, PatchCategoryNode> = new Map<number, PatchCategoryNode>();

    private nextTemporaryId: number = -1;

    public addChildNode(parentId: number | null, draft: Partial<Category>): PatchCategoryNode {
        const id: number = draft.id ?? this.nextTemporaryId--;
        const node = this.getNodeById(id);
        if (node) {
            return node;
        }
        const newNode: PatchCategoryNode = {
            ...draft,
            id,
            parentId,
            name: draft.name ?? "",
            type: draft.type ?? CategoryType.Expense,
            children: [],
        };

        if (parentId === null) {
            this.rootNodes.push(newNode);
        } else {
            const parentNode: PatchCategoryNode = this.requireNodeById(parentId);
            parentNode.children.push(newNode);
        }

        this.indexById.set(id, newNode);

        return newNode;
    }

    public updateNode(id: number, partialPatch: Partial<Category>): void {
        const nodeToUpdate: PatchCategoryNode = this.requireNodeById(id);

        Object.assign(nodeToUpdate, partialPatch);
    }

    public detachNode(id: number): PatchCategoryNode {
        const nodeToDetach: PatchCategoryNode = this.requireNodeById(id);

        const parentArray: PatchCategoryNode[] = this.getChildrenOf(nodeToDetach.parentId);
        parentArray.splice(parentArray.indexOf(nodeToDetach), 1);

        this.walk(nodeToDetach, (n): void => {
            this.indexById.delete(n.id!);
        });

        return nodeToDetach;
    }


    public attachNode(parentId: number | null, node: PatchCategoryNode): void {
        node.parentId = parentId;

        if (parentId === null) {
            this.rootNodes.push(node);
        } else {
            const parentNode: PatchCategoryNode = this.requireNodeById(parentId);
            parentNode.children.push(node);
        }

        this.walk(node, (n: PatchCategoryNode): void => {
            this.indexById.set(n.id!, n);
        });
    }

    public getNodeById(id: number): PatchCategoryNode | null {
        return this.indexById.get(id) ?? null;
    }

    public getChildrenOf(parentId?: number | null): PatchCategoryNode[] {
        return parentId == null
            ? this.rootNodes
            : this.requireNodeById(parentId).children;
    }

    private requireNodeById(id: number): PatchCategoryNode {
        const foundNode: PatchCategoryNode | undefined = this.indexById.get(id);

        if (foundNode === undefined) {
            throw new Error(`Category node with id ${id} not found in the hierarchy tree.`);
        }

        return foundNode;
    }

    private walk(node: PatchCategoryNode, visitor: (n: PatchCategoryNode) => void): void {
        visitor(node);
        node.children.forEach((child: PatchCategoryNode): void => {
            this.walk(child, visitor);
        });
    }

    public reserveTemporaryId(): number {
        return this.nextTemporaryId--;
    }
}
