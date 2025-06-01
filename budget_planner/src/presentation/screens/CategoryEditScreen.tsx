import React, { useContext, useState } from "react";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./CategoriesScreen";
import CategoryList from "../components/CategoryList";
import { Category } from "../../domain/models/Category";
import { FactoryContext } from "../../app/contexts/FactoryContext";
import { ColorPickerModal } from "../components/ColorPickerModal";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { iconItemToDb, dbToIconItem } from "../services/iconParser";

const HeaderContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    height: 56px;
    background-color: #fff;
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

const ColorCircle = styled.View<{ color?: string }>`
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
    type EditRouteProp = RouteProp<RootStackParamList, 'Edit'>;

    const factory = useContext(FactoryContext);
    const route = useRoute<EditRouteProp>();
    const navigation = useNavigation();
    const category = route.params.category;
    const categories = route.params.categories;

    const [addedCategories, setAddedCategories] = useState<Category[]>([]);
    const [removedCategories, setRemovedCategories] = useState<Category[]>([]);
    const [updatedCategory, setUpdatedCategory] = useState<Category>({
        ...category,
        icon: category?.icon ?? "mat_category",
    });
    const [showColorModal, setShowColorModal] = useState(false);

    const handleEditPress = () => {
        setShowColorModal(true);
    };

    const handleConfirm = async () => {
        const categoryRepository = factory?.getRepository(Category);
        await categoryRepository?.update({ ...updatedCategory });
        handleGoBack();
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <>
            <HeaderContainer>
                <HeaderSide>
                    <HeaderButton onPress={handleGoBack}>
                        <MaterialIcons name="arrow-back-ios-new" size={24} color="#222" />
                    </HeaderButton>
                </HeaderSide>
                <HeaderTitle>Редагування</HeaderTitle>
                <HeaderSide style={{ justifyContent: 'flex-end' }}>
                    <HeaderButton onPress={handleConfirm}>
                        <MaterialCommunityIcons name="content-save" size={28} color="#28a745" />
                    </HeaderButton>
                </HeaderSide>
            </HeaderContainer>

            <Row>
                <CategoryInput
                    value={updatedCategory.name}
                    onChangeText={(text: string) =>
                        setUpdatedCategory(prevState => ({
                            ...prevState,
                            name: text
                        }))
                    }
                    placeholder="Назва категорії"
                />
                <IconWrapper>
                    <ColorCircle color={updatedCategory.color}>
                        {updatedCategory.icon ? (
                            (() => {
                                const iconItem = dbToIconItem(updatedCategory.icon);
                                if (!iconItem) {
                                    return <MaterialIcons name="category" size={24} color="white" />;
                                }
                                const { library, name } = iconItem;
                                if (library === "Ionicons") return <Ionicons name={name as any} size={24} color="white" />;
                                if (library === "FontAwesome") return <FontAwesome name={name as any} size={24} color="white" />;
                                return <MaterialIcons name={name as any} size={24} color="white" />;
                            })()
                        ) : (
                            <MaterialIcons name={"category"} size={24} color="white" />
                        )}
                    </ColorCircle>
                    <TouchableOpacity onPress={handleEditPress}>
                        <EditIcon name="edit" size={16} color="black" />
                    </TouchableOpacity>
                </IconWrapper>
            </Row>
            <SubtitleRow>
                <SubTitle>Підкатегорії</SubTitle>
                <TouchableOpacity onPress={() => { /* додати підкатегорію */ }}>
                    <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#28a745" />
                </TouchableOpacity>
            </SubtitleRow>
            <CategoryList
                categories={categories}
                onDelete={() => { }}
                onPress={() => { }}
            />
            <ColorPickerModal
                visible={showColorModal}
                initialColor={updatedCategory.color || "#3399ff"}
                initialIcon={dbToIconItem(updatedCategory.icon)}
                onClose={() => setShowColorModal(false)}
                onSave={(color, icon) => {
                    setUpdatedCategory(prev => ({
                        ...prev,
                        color,
                        icon: iconItemToDb(icon) || prev.icon,
                    }));
                }}
            />
        </>
    );
}
