import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Modal, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Category } from "../../domain/models/Category";
import { CategoryType } from "../../domain/enums/CategoryType";
import { dbToIconItem } from "../utils/iconDbMapper";
import { IconRenderer } from "./IconRenderer";

import {
    Center, CloseBtn, CloseText, ConfirmBtn, ConfirmRow, ConfirmText, IconWrap,
    Loading, Overlay, SelectedText, Sheet, Tile, TileLabel
} from "../../styles/components/TransactionPickerModalStyles";
import {
    BackBtn, BackIcon, BreadcrumbRow, Crumb, CrumbArrow, CrumbText, HeaderRow
} from "../../styles/components/CategoryPickerModalStyles";
import { useChildCategories } from "../hooks/categories/useChildCategories";

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
    const [path, setPath] = useState<Category[]>(baseCategory ? [baseCategory] : []);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(baseCategory ?? null);

    const currentParentId = path.length ? path[path.length - 1].id : null;
    const { data: categories, loading } = useChildCategories(type, currentParentId, visible);

    useEffect(() => {
        if (visible) {
            setPath(baseCategory ? [baseCategory] : []);
            setSelectedCategory(baseCategory ?? null);
        }
    }, [visible, baseCategory]);

    const canGoBack = path.length > 0;

    const handleBack = () => {
        if (canGoBack) {
            setPath(prev => prev.slice(0, -1));
        }
    };

    const goToLevel = (level: number) => {
        setPath(path.slice(0, level + 1));
    };

    const handlePress = (cat: Category) => {
        setSelectedCategory(cat);
        setPath([...path, cat]);
    };

    const handleOk = () => {
        if (selectedCategory) {
            onSelect(selectedCategory);
            onClose();
        }
    };

    const breadcrumb = useMemo(() => path.map((c, i) => (
        <Crumb key={c.id} onPress={() => goToLevel(i)}>
            <CrumbText>{c.name}</CrumbText>
            {i < path.length - 1 && <CrumbArrow>›</CrumbArrow>}
        </Crumb>
    )), [path]);

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
                            {selectedCategory ? selectedCategory.name : "Виберіть категорію"}
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
                            data={categories}
                            numColumns={1}
                            contentContainerStyle={{ paddingBottom: 20, paddingTop: 4, gap: 12 }}
                            keyExtractor={item => item.id!.toString()}
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
