import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Category } from "../../data/models/Category";

interface CategoryItemProps {
    category: Category;
    onDelete?: () => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({ category, onDelete }) => {
    return (
        <ItemContainer>
            <IconWrapper bgColor={category.color ?? "#999"}>
                <CategoryIcon name={category.icon ?? "tag"} size={24} />
            </IconWrapper>
            <CategoryName>{category.name}</CategoryName>
            <DeleteButton onPress={onDelete}>
                <MaterialCommunityIcons name="trash-can-outline" size={24} color="#d9534f" />
            </DeleteButton>
        </ItemContainer>
    );
};

const ItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: #f9f9f9;
  border-radius: 12px;
  margin-vertical: 6px;
  elevation: 2;
`;

const IconWrapper = styled.View<{ bgColor: string }>`
  background-color: ${({ bgColor }: {bgColor: string}) => bgColor};
  padding: 10px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
`;

const CategoryIcon = styled(MaterialCommunityIcons)`
  color: white;
`;

const CategoryName = styled.Text`
  flex: 1;
  margin-left: 16px;
  font-size: 16px;
  color: #333;
`;

const DeleteButton = styled(TouchableOpacity)`
  padding: 4px;
`;
