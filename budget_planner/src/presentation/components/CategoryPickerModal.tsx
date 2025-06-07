import React, { useContext, useEffect, useState } from "react";
import {
    FlatList,
    Modal,
    useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FactoryContext } from "../../app/contexts/FactoryContext";
import { Category } from "../../domain/models/Category";
import { CategoryType } from "../../domain/enums/CategoryType";
import { dbToIconItem } from "../utils/iconDbMapper";
import { IconRenderer } from "./IconRenderer";

interface Props {
    type: CategoryType;
    visible: boolean;
    baseCategory?: Category | null;

    onSelect(cat: Category): void;

    onClose(): void;
}

export default function CategoryPickerModal({
                                                type,
                                                visible,
                                                baseCategory = null,
                                                onSelect,
                                                onClose,
                                            }: Props) {
    const factory = useContext(FactoryContext);
    const repo = factory?.getRepository(Category);

    const [path, setPath] = useState<Category[]>(baseCategory ? [baseCategory] : []);
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(baseCategory ?? null);

    useEffect(() => {
        if (visible) {
            setPath(baseCategory ? [baseCategory] : []);
            setSelectedCategory(baseCategory ?? null);
        }
    }, [visible, baseCategory]);

    // Load children
    useEffect(() => {
        if (!visible) return;
        let active = true;
        (async () => {
            setLoading(true);
            const parent = path.length ? path[path.length - 1] : null;
            const q = repo
                ?.query()
                .select()
                .where("parentId", parent ? { operator: "=", value: parent.id } : { operator: "IS NULL" })
                .where("type", { operator: "=", value: type });
            const result = (await q?.executeAsync()) ?? [];
            if (active) {
                setData(result);
                setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, [repo, path, type, visible]);

    const canGoBack = path.length > 0;
    const handleBack = () => {
        if (canGoBack) setPath((prev) => prev.slice(0, -1));
    };
    const goToLevel = (level: number) => setPath(path.slice(0, level + 1));

    const handlePress = async (cat: Category) => {
        setSelectedCategory(cat);
        const children = await repo
            ?.query()
            .select()
            .where("parentId", { operator: "=", value: cat.id })
            .executeAsync();
        if (children && children.length > 0) {
            setPath([...path, cat]);
        }
    };

    const handleOk = () => {
        if (!selectedCategory) return;
        onSelect(selectedCategory);
        onClose();
    };

    const breadcrumb = path.map((c, i) => (
        <Crumb key={c.id} onPress={() => goToLevel(i)}>
            <CrumbText>{c.name}</CrumbText>
            {i < path.length - 1 && <CrumbArrow>›</CrumbArrow>}
        </Crumb>
    ));

    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Overlay>
                <Sheet style={{ maxHeight: height * 0.75, paddingBottom: insets.bottom + 8 }}>
                    {/* Header: Назад, breadcrumb, Close */}
                    <HeaderRow>
                        {canGoBack && (
                            <BackBtn onPress={handleBack}>
                                <BackIcon>←</BackIcon>
                            </BackBtn>
                        )}
                        <BreadcrumbRow>{breadcrumb}</BreadcrumbRow>
                        <CloseBtn onPress={onClose}>
                            <CloseText>✕</CloseText>
                        </CloseBtn>
                    </HeaderRow>
                    <ConfirmRow>
                        <SelectedText numberOfLines={1}>
                            {selectedCategory ? selectedCategory.name : 'Виберіть категорію'}
                        </SelectedText>
                        <ConfirmBtn
                            onPress={handleOk}
                            disabled={!selectedCategory}
                            style={{ opacity: selectedCategory ? 1 : 0.4 }}
                        >
                            <ConfirmText>Ок</ConfirmText>
                        </ConfirmBtn>
                    </ConfirmRow>
                    {loading ? (
                        <Center>
                            <Loading size="large"/>
                        </Center>
                    ) : (
                        <FlatList
                            key={"list"}
                            data={data}
                            numColumns={1}
                            contentContainerStyle={{ paddingBottom: 20, paddingTop: 4, gap: 12 }}
                            keyExtractor={(item) => item.id!.toString()}
                            renderItem={({ item }) => (
                                <Tile
                                    $selected={selectedCategory?.id === item.id}
                                    onPress={() => handlePress(item)}
                                    android_ripple={{ color: "#0002", borderless: false }}
                                >
                                    <IconWrap $bgColor={item.color ?? "#999"}>
                                        <IconRenderer icon={dbToIconItem(item.icon)} size={26} color="#fff"/>
                                    </IconWrap>
                                    <TileLabel numberOfLines={2}>{item.name}</TileLabel>
                                </Tile>
                            )}
                        />
                    )}
                </Sheet>
            </Overlay>
        </Modal>
    );
}

const Overlay = styled.Pressable`
    flex: 1;
    background: rgba(0, 0, 0, 0.37);
    justify-content: flex-end;
`;

const Sheet = styled.View`
    flex: 1;
    background: ${({ theme }) => theme.colors.background};
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    padding: ${({ theme }) => theme.spacing.m}px;
    min-height: 220px;
    elevation: 12;
`;

const HeaderRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 8px;
`;

const BackBtn = styled.Pressable`
    padding: 10px;
    margin-right: 6px;
`;
const BackIcon = styled.Text`
    font-size: 20px;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

const BreadcrumbRow = styled.View`
    flex-direction: row;
    flex: 1;
    align-items: center;
`;

const Crumb = styled.Pressable`
    flex-direction: row;
    align-items: center;
`;
const CrumbText = styled.Text`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 16px;
    font-weight: 500;
    margin-horizontal: 2px;
`;
const CrumbArrow = styled.Text`
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-horizontal: 2px;
`;

const CloseBtn = styled.Pressable`
    padding: 10px;
    margin-left: 6px;
`;
const CloseText = styled.Text`
    font-size: 20px;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

const ConfirmRow = styled.View`
    margin-bottom: ${({ theme }) => theme.spacing.m}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const SelectedText = styled.Text`
    flex: 1;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-right: ${({ theme }) => theme.spacing.s}px;
`;

const ConfirmBtn = styled.Pressable`
    padding: ${({ theme }) => theme.spacing.s}px ${({ theme }) => theme.spacing.m}px;
    background: ${({ theme }) => theme.colors.positive};
    border-radius: ${({ theme }) => theme.borderRadius.s}px;
`;

const ConfirmText = styled.Text`
    color: #fff;
    font-weight: 600;
`;

interface TileProps {
    $selected?: boolean;
}

const Tile = styled.Pressable<TileProps>`
    flex: 1;
    margin: 0px;
    padding: ${({ theme }) => theme.spacing.s + 6}px;
    flex-direction: row;
    align-items: center;
    border-radius: ${({ theme }) => theme.borderRadius.m}px;
    background: ${({ theme, $selected }) =>
            $selected ? theme.colors.primary : theme.colors.secondaryBackground};
    justify-content: flex-start;
    border-width: ${({ $selected }) => ($selected ? "2px" : "0px")};
    border-color: ${({ theme, $selected }) => ($selected ? theme.colors.primary : "transparent")};
`;

const IconWrap = styled.View<{ $bgColor: string }>`
    padding: 10px;
    border-radius: 12px;
    background: ${({ $bgColor }) => $bgColor};
    justify-content: center;
    align-items: center;
`;

const TileLabel = styled.Text`
    flex: 1;
    margin-left: ${({ theme }) => theme.spacing.m}px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ theme }) => theme.fontSizes.s + 2}px;
    font-weight: 500;
`;

const Center = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    min-height: 120px;
`;

const Loading = styled.ActivityIndicator``;