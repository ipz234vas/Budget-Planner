import React, { useContext, useState } from "react";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "./CategoriesScreen";
import CategoryList from "../components/CategoryList";
import { Category } from "../../domain/models/Category";
import { FactoryContext } from "../../app/contexts/FactoryContext";

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
    background-color: ${({ color }: { color: string }) => color || "#ccc"};
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
    const category = route.params.category;
    const categories = route.params.categories;

    const [addedCategories, setAddedCategories] = useState<Category[]>([]);
    const [removedCategories, setRemovedCategories] = useState<Category[]>([]);
    const [updatedCategory, setUpdatedCategory] = useState<Category>(category || new Category());

    console.log(updatedCategory)

    const handleEditPress = () => {
        console.log("Відкрити модалку");
    };

    const handleConfirm = async () => {
        const categoryRepository = factory?.getRepository(Category);
        await categoryRepository?.update({ ...updatedCategory })
    }

    return (
        <>
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
                    <ColorCircle color={category?.color}>
                        {category?.icon ? (
                            <MaterialIcons name={category.icon as any} size={24} color="white"/>
                        ) : <MaterialIcons name={"category"} size={24} color="white"/>}
                    </ColorCircle>
                    <TouchableOpacity onPress={handleEditPress}>
                        <EditIcon name="edit" size={16} color="black"/>
                    </TouchableOpacity>
                </IconWrapper>
            </Row>
            <SubtitleRow>
                <SubTitle>Підкатегорії</SubTitle>
                <TouchableOpacity onPress={() => handleConfirm()}>
                    <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#28a745"/>
                </TouchableOpacity>
            </SubtitleRow>
            <CategoryList
                categories={categories}
                onDelete={() => {
                }}
                onPress={() => {
                }}
            />
        </>
    )
}
