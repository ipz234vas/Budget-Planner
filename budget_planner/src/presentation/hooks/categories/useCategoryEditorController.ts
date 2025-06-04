import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Category } from "../../../domain/models/Category";
import { useCategorySession } from "../../contexts/CategorySessionContext";
import { CategoryViewService } from "../../services/CategoryViewService";
import { AddCategoryCommand } from "../../../domain/commands/AddCategoryCommand";
import { RemoveCategoryCommand } from "../../../domain/commands/RemoveCategoryCommand";
import { IRepository } from "../../../domain/interfaces/repositories/IRepository";
import { FactoryContext } from "../../../app/contexts/FactoryContext";
import { CategoriesStackParamList } from "../../types/CategoriesStackParamList";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCategoryChildren } from "./useCategoryChildren";
import { useCategoryDraft } from "./useCategoryDraft";
import { useNavigationGuard } from "../useNavigationGuard";
import { useCategoryCommit } from "./useCategoryCommit";

type EditorRoute = RouteProp<CategoriesStackParamList, "CategoryEditor">;
type EditorNav = StackNavigationProp<CategoriesStackParamList, "CategoryEditor">;

export function useCategoryEditorController() {
    const session = useCategorySession();
    const { hierarchyTree, commandManager, removedIds } = session;
    const scopeRef = useRef(commandManager.openScope());
    const navigation = useNavigation<EditorNav>();
    const route = useRoute<EditorRoute>();

    const factoryCtx = useContext(FactoryContext);
    const repo = factoryCtx?.getRepository(Category) as IRepository<Category> | undefined;
    const viewService = useMemo(() => {
        if (!repo) return undefined;
        return new CategoryViewService(hierarchyTree, removedIds, repo);
    }, [repo, hierarchyTree, removedIds]);

    const [categoryId, setCategoryId] = useState<number | undefined>(route.params.id);
    const parentId = route.params.parentId;
    const type = route.params.type;

    const {
        category,
        categoryDraft,
        setCategoryDraft,
        setCategoryAndDraft,
        updateDraftToTree,
    } = useCategoryDraft(null, hierarchyTree, commandManager, viewService);

    const { childCategories, setChildCategories, refreshChildren } = useCategoryChildren(categoryId, viewService);

    const [loading, setLoading] = useState(true);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);

    const fetchCategoryNode = async (id: number | undefined) => {
        return id ? await viewService?.getById(id) : null;
    };

    const ensureCategoryInTree = (id: number, parentId: number | null, node: Category | null | undefined) => {
        if (!node) {
            commandManager.run(
                new AddCategoryCommand(hierarchyTree, parentId, { id, type })
            );
            return hierarchyTree.getNodeById(id);
        } else if (!hierarchyTree.getNodeById(id)) {
            commandManager.run(
                new AddCategoryCommand(hierarchyTree, parentId, node)
            );
            return hierarchyTree.getNodeById(id);
        }
        return node;
    };

    const fetchChildren = async (id: number) => {
        return await viewService?.getChildren(id) ?? [];
    };

    const initCategory = async (idParam: number | undefined) => {
        let id = idParam;
        let node: Category | null | undefined = await fetchCategoryNode(id);
        if (!id) {
            id = hierarchyTree.reserveTemporaryId();
        }
        node = ensureCategoryInTree(id!, parentId, node);
        setCategoryId(id!);
        setCategoryAndDraft(node);
        const children = await fetchChildren(id!);
        setLoading(false);
        setChildCategories(children);
    };

    useEffect(() => {
        if (!repo || !viewService)
            return;
        let cancelled = false;
        (async () => {
            if (cancelled) return;
            await initCategory(categoryId);
        })();
        return () => {
            cancelled = true;
        };
    }, [repo, viewService, hierarchyTree]);

    useNavigationGuard({
        navigation, hasUnsavedChanges, commandManager, scopeRef, parentId, session,
    });

    const { commitAllChangesAndExit, saveAndExit } = useCategoryCommit({
        repo, hierarchyTree, removedIds, updateDraftToTree,
        onSave: () => {
            setHasUnsavedChanges(false);
        },
        onExit: () => {
            navigation.goBack()
        },
    });

    const handleAddChild = () => {
        navigation.push("CategoryEditor", {
            id: hierarchyTree.reserveTemporaryId(),
            parentId: categoryDraft.id || null,
            type: type
        });
    };

    const handleDeleteChild = async (childId?: number) => {
        if (childId === undefined)
            return;
        commandManager.run(new RemoveCategoryCommand(hierarchyTree, childId, removedIds));
        await refreshChildren();
    };

    const handleOpenChild = (childId?: number) => {
        if (childId === undefined) return;
        navigation.push("CategoryEditor", {
            id: childId,
            parentId: categoryDraft.id || null,
            type: type
        });
    };

    return {
        loading,
        category,
        categoryDraft,
        setCategoryDraft,
        childCategories,
        handleAddChild,
        handleDeleteChild,
        handleOpenChild,
        commitAllChangesAndExit,
        saveAndExit,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        navigation,
    };
}