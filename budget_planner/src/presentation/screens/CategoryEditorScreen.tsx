import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";
import CategoryList from "../components/CategoryList";
import { IconColorPickerModal } from "../components/IconColorPickerModal";
import { iconItemToDb, dbToIconItem } from "../utils/iconDbMapper";
import { IconRenderer } from "../components/IconRenderer";
import { useCategoryEditorController } from "../hooks/categories/useCategoryEditorController";

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
        navigation,
    } = useCategoryEditorController();

    const [showPicker, setShowPicker] = useState(false);

    if (loading || category === null) {
        return <View><Text>Loading…</Text></View>;
    }

    return (
        <>
            <HeaderContainer>
                <HeaderSide>
                    <HeaderButton onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back-ios-new" size={24} color="#222"/>
                    </HeaderButton>
                </HeaderSide>
                <HeaderTitle>
                    {!category.parentId ? "Категорія" : "Підкатегорія"}
                </HeaderTitle>
                <HeaderSide style={{ justifyContent: "flex-end" }}>
                    {!category.parentId ? (
                        <HeaderButton onPress={commitAllChangesAndExit}>
                            <MaterialCommunityIcons name="content-save" size={28} color="#28a745"/>
                        </HeaderButton>
                    ) : (
                        <HeaderButton onPress={saveAndExit}>
                            <MaterialCommunityIcons name="check" size={28} color="#28a745"/>
                        </HeaderButton>
                    )}
                </HeaderSide>
            </HeaderContainer>

            <Row>
                <CategoryInput
                    value={categoryDraft.name}
                    onChangeText={(text: string) => setCategoryDraft(prev => ({ ...prev, name: text }))}
                    placeholder="Назва категорії"
                />
                <IconWrapper>
                    <ColorCircle color={categoryDraft.color}>
                        <IconRenderer icon={dbToIconItem(categoryDraft.icon)} size={24} color="white"/>
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
                categories={childCategories}
                onDelete={handleDeleteChild}
                onPress={handleOpenChild}
            />

            <IconColorPickerModal
                visible={showPicker}
                initialColor={categoryDraft.color || "#3399ff"}
                initialIcon={dbToIconItem(categoryDraft.icon)}
                onClose={() => setShowPicker(false)}
                onSave={(color, icon) => {
                    setCategoryDraft(prev => ({
                        ...prev,
                        color,
                        icon: iconItemToDb(icon) || prev.icon,
                    }));
                }}
            />
        </>
    );
}