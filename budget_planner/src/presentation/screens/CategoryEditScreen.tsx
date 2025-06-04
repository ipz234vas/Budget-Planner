import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, TouchableOpacity, View, Text } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { RouteProp, useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { CategoriesStackParamList } from "./CategoriesScreen";
import CategoryList from "../components/CategoryList";
import { Category } from "../../domain/models/Category";
import { FactoryContext } from "../../app/contexts/FactoryContext";
import { IconColorPickerModal } from "../components/IconColorPickerModal";
import { iconItemToDb, dbToIconItem } from "../services/iconParser";
import { IconRenderer } from "../components/IconRenderer";
import { useCategorySession } from "../../app/contexts/CategorySessionContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { SQLiteService } from "../../data/sqlite/SQLiteService";
import { CategoryUnitOfWork } from "../../app/CategoryUnitOfWork";
import { IRepository } from "../../domain/interfaces/repositories/IRepository";
import { CategoryViewService } from "../../app/CategoryViewService";
import { UpdateCategoryCommand } from "../../domain/commands/UpdateCategoryCommand";
import { AddCategoryCommand } from "../../domain/commands/AddCategoryCommand";
import { RemoveCategoryCommand } from "../../domain/commands/RemoveCategoryCommand";

const HeaderContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    height: 56px;
    border-bottom-width: 1px;
    border-color: #eee;
`;

const HeaderSide = styled.View`
    flex-direction: row;
    align-items: center;
    min-width: 56px;
    justify-content: flex-start;
`;

const HeaderTitle = styled.Text`
    font-size: 20px;
    font-weight: 600;
    color: #222;
    text-align: center;
    flex: 1;
`;

const HeaderButton = styled.TouchableOpacity`
    padding: 8px;
    border-radius: 16px;
    justify-content: center;
    align-items: center;
`;

const Row = styled.View`
    flex-direction: row;
    align-items: center;
    padding: 16px;
`;

const CategoryInput = styled.TextInput`
    flex: 1;
    font-size: 18px;
    border-bottom-width: 1px;
    border-color: #ccc;
    padding-vertical: 8px;
`;

const IconWrapper = styled.View`
    margin-left: 12px;
    position: relative;
`;

const ColorCircle = styled.View`
    width: 48px;
    height: 48px;
    border-radius: 24px;
    background-color: ${({ color }: { color?: string }) => color || "#ccc"};
    justify-content: center;
    align-items: center;
`;

const EditIcon = styled(MaterialIcons)`
    position: absolute;
    bottom: -4px;
    right: -4px;
    background-color: white;
    border-radius: 12px;
    padding: 2px;
`;

const SubtitleRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    margin-top: 12px;
`;

const SubTitle = styled.Text`
    font-size: 16px;
    font-weight: 600;
`;

type EditorRoute = RouteProp<CategoriesStackParamList, "CategoryEditor">;
type EditorNav = StackNavigationProp<CategoriesStackParamList, "CategoryEditor">;

export default function CategoryEditScreen() {

    const session = useCategorySession();
    const { hierarchyTree, commandManager, removedIds } = session;
    const scopeRef = useRef(commandManager.openScope());

    const factoryCtx = React.useContext(FactoryContext);
    const repo = factoryCtx?.getRepository(Category) as IRepository<Category> | undefined;
    if (!repo) {
        return <View><Text>Repo not ready</Text></View>;
    }

    const viewService = React.useMemo(
        () => new CategoryViewService(hierarchyTree, removedIds, repo),
        [hierarchyTree, removedIds, repo],
    );

    const route = useRoute<EditorRoute>();
    const navigation = useNavigation<EditorNav>();
    let categoryId = route.params.id;
    const parentId = route.params.parentId;
    const type = route.params.type;

    const [node, setNode] = useState<Category | null>(null);
    const [children, setChildren] = useState<Category[]>([]);
    const [draft, setDraft] = useState<Partial<Category>>({});
    const [showPicker, setShowPicker] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (hasUnsavedChanges) {
                commandManager.cancelScope(scopeRef.current);
            }

            if (parentId == null) {
                session.clear();
            }
        })
        return unsubscribe;
    }, [hasUnsavedChanges]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            let node: Category | null = null;

            if (categoryId) {
                node = await viewService.getById(categoryId);
            }
            if (cancelled) {
                return;
            }

            categoryId = categoryId ?? hierarchyTree.reserveTemporaryId();
            if (!node) {
                commandManager.run(
                    new AddCategoryCommand(hierarchyTree, parentId ?? null, { id: categoryId, type: type })
                );
                node = hierarchyTree.getNodeById(categoryId);
            } else if (node && !hierarchyTree.getNodeById(categoryId)) {
                commandManager.run(
                    new AddCategoryCommand(hierarchyTree, parentId ?? null, node)
                );
                node = hierarchyTree.getNodeById(categoryId);
            }
            setNode(node);
            setDraft({ ...node });
            setLoading(false);

            const children = await viewService.getChildren(categoryId);
            if (cancelled) {
                return;
            }
            setChildren(children);
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            let active = true;

            (async () => {
                if (!categoryId) {
                    return;
                }
                const items = await viewService.getChildren(categoryId);
                if (!active) {
                    return;
                }
                setChildren(items);
            })();

            return () => {
                active = false;
            };

        }, [hierarchyTree, categoryId]),
    );

    if (loading || node === null) {
        return <View><Text>Loading…</Text></View>;
    }

    const saveLocal = async () => {
        commandManager.run(new UpdateCategoryCommand(hierarchyTree, node.id!, draft));
        setNode({ ...(await viewService.getById(node.id!) as Category) });
    };

    const handleAddChild = () => {
        navigation.push("CategoryEditor", {
            id: hierarchyTree.reserveTemporaryId(),
            parentId: draft.id || null,
            type: type
        });
    };

    const handleDeleteChild = async (childId?: number) => {
        if (childId === undefined) {
            return;
        }
        commandManager.run(new RemoveCategoryCommand(hierarchyTree, childId, removedIds));
        setChildren(await viewService.getChildren(node.id!));
    };

    const handleOpenChild = async (childId?: number) => {
        if (childId == undefined) {
            return;
        }
        navigation.push("CategoryEditor", { id: childId, parentId: draft.id || null, type: type });
    };

    const cancelAndBack = (): void => {
        navigation.goBack();
    };

    const rootCommitAndBack = async (): Promise<void> => {
        try {
            setHasUnsavedChanges(false);
            await saveLocal();
            const uow = new CategoryUnitOfWork(repo, await SQLiteService.getInstance());
            await uow.commit(hierarchyTree, Array.from(removedIds));

            navigation.goBack();
        } catch (e) {
            Alert.alert("Помилка збереження", String(e));
        }
    };

    const saveAndBack = async () => {
        setHasUnsavedChanges(false);
        await saveLocal();
        navigation.goBack();
    };

    return (
        <>
            <HeaderContainer>
                <HeaderSide>
                    <HeaderButton onPress={cancelAndBack}>
                        <MaterialIcons name="arrow-back-ios-new" size={24} color="#222"/>
                    </HeaderButton>
                </HeaderSide>
                <HeaderTitle>
                    {!node.parentId ? "Категорія" : "Підкатегорія"}
                </HeaderTitle>
                <HeaderSide style={{ justifyContent: "flex-end" }}>
                    {!node.parentId ? (
                        <HeaderButton onPress={rootCommitAndBack}>
                            <MaterialCommunityIcons name="content-save" size={28} color="#28a745"/>
                        </HeaderButton>
                    ) : (
                        <HeaderButton onPress={saveAndBack}>
                            <MaterialCommunityIcons name="check" size={28} color="#28a745"/>
                        </HeaderButton>
                    )}
                </HeaderSide>
            </HeaderContainer>

            <Row>
                <CategoryInput
                    value={draft.name}
                    onChangeText={(text: string) => {
                        setDraft((prev: any) => ({ ...prev, name: text }));
                    }}
                    placeholder="Назва категорії"
                />
                <IconWrapper>
                    <ColorCircle color={draft.color}>
                        <IconRenderer
                            icon={dbToIconItem(draft.icon)}
                            size={24}
                            color="white"
                        />
                    </ColorCircle>
                    <TouchableOpacity onPress={() => setShowPicker(true)}>
                        <EditIcon name="edit" size={16} color="black"/>
                    </TouchableOpacity>
                </IconWrapper>
            </Row>

            <SubtitleRow>
                <SubTitle>Підкатегорії</SubTitle>
                <TouchableOpacity onPress={handleAddChild}>
                    <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#28a745"/>
                </TouchableOpacity>
            </SubtitleRow>

            <CategoryList
                categories={children}
                onDelete={handleDeleteChild}
                onPress={handleOpenChild}
            />

            <IconColorPickerModal
                visible={showPicker}
                initialColor={draft.color || "#3399ff"}
                initialIcon={dbToIconItem(draft.icon)}
                onClose={() => setShowPicker(false)}
                onSave={(color, icon) => {
                    setDraft((prev: any) => ({
                        ...prev,
                        color,
                        icon: iconItemToDb(icon) || prev.icon,
                    }));
                }}
            />
        </>
    );
}