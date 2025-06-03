import React, { useEffect, useState } from "react";
import { Alert, TouchableOpacity, View, Text } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { CategoriesStackParamList } from "./CategoriesScreen";
import CategoryList from "../components/CategoryList";
import { Category } from "../../domain/models/Category";
import { FactoryContext } from "../../app/contexts/FactoryContext";
import { IconColorPickerModal } from "../components/IconColorPickerModal";
import { iconItemToDb, dbToIconItem } from "../services/iconParser";
import { IconRenderer } from "../components/IconRenderer";
import { useCategorySession } from "../../app/contexts/CategorySessionContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { CategoryViewService } from "../../app/sessions/CategoryViewService";
import { CategoryPersistenceService } from "../../app/sessions/CategoryPersistenceService";
import { SQLiteService } from "../../data/sqlite/SQLiteService";

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

export default function CategoryEditScreen() {
    type EditorRouteProp = RouteProp<CategoriesStackParamList, "CategoryEditor">;
    type EditorNavProp = StackNavigationProp<CategoriesStackParamList, "CategoryEditor">;

    const route = useRoute<EditorRouteProp>();
    const navigation = useNavigation<EditorNavProp>();

    const id = route.params?.id ?? null;
    const session = useCategorySession();
    const factory = React.useContext(FactoryContext);
    const repo = factory?.getRepository(Category);
    const viewService = new CategoryViewService(session, repo!);

    const [node, setNode] = useState<any>(null);
    const [children, setChildren] = useState<Category[]>([]);
    const [draft, setDraft] = useState<any>(null);
    const [showColorModal, setShowColorModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        setLoading(true);
        (async () => {
            const node = await viewService.getById(id);
            if (!active) return;
            setNode(node);
            setDraft({ ...node });
            const arr = await viewService.getChildren(id);
            if (!active) return;
            setChildren(arr);
            setLoading(false);
        })();
        return () => {
            active = false;
        };
    }, []);

    if (loading || !node) return <View><Text>Завантаження...</Text></View>;

    const saveLocal = () => {
        session.update(node.id, draft);
        setNode({ ...draft });
    };

    const addChild = () => {
        const child = session.addChild(node.id, { name: "" });
        setChildren(prev => [...prev, child]);
        navigation.push("CategoryEditor", { id: child.id });
    };

    const handleDelete = (childId?: number) => {
        if (!childId) return;
        session.remove(childId);
        setChildren(prev => prev.filter(c => c.id !== childId));
    };

    const openChild = (childId?: number) => {
        const child = children.find((c) => c.id === childId);
        session.addChild(child?.parentId || null, { ...child });
        navigation.push("CategoryEditor", { id: childId });
    };

    const commitRoot = async () => {
        try {
            saveLocal();
            const service = new CategoryPersistenceService(session, repo!, await SQLiteService.getInstance());
            await service.commit();
            navigation.goBack();
        } catch (e) {
            Alert.alert("Помилка збереження", String(e));
        }
    };

    const goBack = () => {
        saveLocal();
        navigation.goBack();
    };

    return (
        <>
            <HeaderContainer>
                <HeaderSide>
                    <HeaderButton onPress={goBack}>
                        <MaterialIcons name="arrow-back-ios-new" size={24} color="#222" />
                    </HeaderButton>
                </HeaderSide>
                <HeaderTitle>
                    {!node.parentId ? "Категорія" : "Підкатегорія"}
                </HeaderTitle>
                <HeaderSide style={{ justifyContent: "flex-end" }}>
                    {!node.parentId ? (
                        <HeaderButton onPress={commitRoot}>
                            <MaterialCommunityIcons name="content-save" size={28} color="#28a745" />
                        </HeaderButton>
                    ) : (
                        <HeaderButton onPress={goBack}>
                            <MaterialCommunityIcons name="check" size={28} color="#28a745" />
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
                    <TouchableOpacity onPress={() => setShowColorModal(true)}>
                        <EditIcon name="edit" size={16} color="black" />
                    </TouchableOpacity>
                </IconWrapper>
            </Row>

            <SubtitleRow>
                <SubTitle>Підкатегорії</SubTitle>
                <TouchableOpacity onPress={addChild}>
                    <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#28a745" />
                </TouchableOpacity>
            </SubtitleRow>

            <CategoryList
                categories={children}
                onDelete={handleDelete}
                onPress={openChild}
            />

            <IconColorPickerModal
                visible={showColorModal}
                initialColor={draft.color || "#3399ff"}
                initialIcon={dbToIconItem(draft.icon)}
                onClose={() => setShowColorModal(false)}
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