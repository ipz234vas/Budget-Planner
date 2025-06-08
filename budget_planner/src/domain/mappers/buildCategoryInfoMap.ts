import { Category } from "../models/Category";
import { CategoryInfo } from "../interfaces/models/transactions/CategoryInfo";

export function buildCategoryInfoMap(categories: Category[]): Map<number, CategoryInfo> {
    const catMap = buildCategoryMap(categories);
    const infoMap = new Map<number, CategoryInfo>();

    for (const cat of categories) {
        if (!cat.id || infoMap.has(cat.id)) continue;

        const chain = buildCategoryChain(cat, catMap);
        const rootInfo = buildRootInfo(chain.at(-1)!);

        addChainToInfoMap(chain, rootInfo, infoMap);
    }

    return infoMap;
}

function buildCategoryMap(categories: Category[]): Map<number, Category> {
    return new Map(categories.map((c) => [c.id || 0, c]));
}

function buildCategoryChain(
    start: Category,
    catMap: Map<number, Category>
): Category[] {
    const chain: Category[] = [];
    let current: Category | undefined = start;

    while (current) {
        chain.push(current);
        current = current.parentId ? catMap.get(current.parentId) : undefined;
    }

    return chain;
}

function buildRootInfo(rootCat: Category): CategoryInfo {
    return {
        id: rootCat.id,
        name: rootCat.name,
        icon: rootCat.icon ?? undefined,
        color: rootCat.color ?? undefined,
        type: rootCat.type,
    };
}

function addChainToInfoMap(
    chain: Category[],
    rootInfo: CategoryInfo,
    infoMap: Map<number, CategoryInfo>
): void {
    let child: CategoryInfo | undefined = undefined;

    for (let i = chain.length - 1; i >= 0; i--) {
        const cur = chain[i];
        if (!cur.id) continue;

        const info: CategoryInfo = {
            id: cur.id,
            name: cur.name,
            icon: cur.icon ?? undefined,
            color: cur.color ?? undefined,
            type: cur.type,
            parent: child,
            root: rootInfo,
        };

        infoMap.set(cur.id, info);
        child = info;
    }
}
