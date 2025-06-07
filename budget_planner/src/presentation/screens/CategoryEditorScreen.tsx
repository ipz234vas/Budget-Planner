import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { IconColorPickerModal } from "../components/IconColorPickerModal";
import { dbToIconItem, iconItemToDb } from "../utils/iconDbMapper";
import { IconRenderer } from "../components/IconRenderer";
import CategoryList from "../components/CategoryList";
import { useCategoryEditorController } from "../hooks/categories/useCategoryEditorController";
import {
    CategoryInput,
    ColorCircle,
    EditIcon,
    HeaderButton,
    HeaderContainer,
    HeaderSide,
    HeaderTitle,
    IconWrapper,
    Row,
} from "../../styles/components/EditorCommonStyles";
import { useTheme } from "styled-components/native";
import { SubTitle, SubtitleRow } from "../../styles/components/CategoryEditorStyles";

export default function CategoryEditorScreen() {
    const {
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
        navigation
    } = useCategoryEditorController();

    const [showPicker, setShowPicker] = useState(false);
    const theme = useTheme();

    if (loading || category === null) {
        return (
            <View>
                <Text>Loading…</Text>
            </View>
        );
    }

    return (
        <>
            <HeaderContainer>
                <HeaderSide>
                    <HeaderButton onPress={() => navigation.goBack()}>
                        <MaterialIcons
                            name="arrow-back-ios-new"
                            size={24}
                            color={theme.colors.textPrimary}
                        />
                    </HeaderButton>
                </HeaderSide>

                <HeaderTitle>
                    {!category.parentId ? "Категорія" : "Підкатегорія"}
                </HeaderTitle>

                <HeaderSide style={{ justifyContent: "flex-end" }}>
                    <HeaderButton
                        onPress={
                            !category.parentId
                                ? commitAllChangesAndExit
                                : saveAndExit
                        }
                    >
                        <MaterialCommunityIcons
                            name={!category.parentId ? "content-save" : "check"}
                            size={28}
                            color={theme.colors.positive}
                        />
                    </HeaderButton>
                </HeaderSide>
            </HeaderContainer>

            <Row>
                <CategoryInput
                    value={categoryDraft.name}
                    onChangeText={(text: string) =>
                        setCategoryDraft((prev) => ({ ...prev, name: text }))
                    }
                    placeholder="Назва категорії"
                    placeholderTextColor={theme.colors.textSecondary}
                />
                <IconWrapper>
                    <ColorCircle $color={categoryDraft.color}>
                        <IconRenderer
                            icon={dbToIconItem(categoryDraft.icon)}
                            size={24}
                            color="#fff"
                        />
                    </ColorCircle>
                    <TouchableOpacity onPress={() => setShowPicker(true)}>
                        <EditIcon name="edit" size={16} color={theme.colors.textPrimary}/>
                    </TouchableOpacity>
                </IconWrapper>
            </Row>

            <SubtitleRow>
                <SubTitle>Підкатегорії</SubTitle>
                <HeaderButton onPress={handleAddChild}>
                    <MaterialCommunityIcons
                        name="plus-circle-outline"
                        size={24}
                        color={theme.colors.positive}
                    />
                </HeaderButton>
            </SubtitleRow>

            <CategoryList
                categories={childCategories}
                onDelete={handleDeleteChild}
                onPress={handleOpenChild}
            />

            <IconColorPickerModal
                visible={showPicker}
                initialColor={categoryDraft.color || "#3399ff"}
                initialIcon={dbToIconItem(categoryDraft.icon)}
                onClose={() => setShowPicker(false)}
                onSave={(color, icon) =>
                    setCategoryDraft((prev) => ({
                        ...prev,
                        color,
                        icon: iconItemToDb(icon) || prev.icon
                    }))
                }
            />
        </>
    );
}