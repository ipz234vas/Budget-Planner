import React, { useState } from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Category } from "../../domain/models/Category";
import { dbToIconItem } from "../utils/iconDbMapper";
import { IconRenderer } from "./IconRenderer";

interface CategoryItemProps {
    category: Category;
    onPress?: () => void;
    onDelete?: () => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({ category, onPress, onDelete }) => {
    const [pressed, setPressed] = useState(false);

    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            style={({ pressed: isPressed }) => [
                { opacity: isPressed ? 0.95 : 1 },
            ]}
        >
            <ItemContainer $pressed={pressed}>
                <IconWrapper $bgColor={category.color ?? "#999"}>
                    <IconRenderer
                        icon={dbToIconItem(category.icon)}
                        size={24}
                        color="white"
                    />
                </IconWrapper>
                <CategoryName>{category.name}</CategoryName>
                <DeleteButton onPress={onDelete} hitSlop={10}>
                    <MaterialCommunityIcons name="trash-can-outline" size={24} color="#d9534f"/>
                </DeleteButton>
            </ItemContainer>
        </Pressable>
    );
};


const ItemContainer = styled.View`
    flex-direction: row;
    align-items: center;
    padding: 12px 16px;
    background-color: ${(props: { $pressed: boolean }) => props.$pressed ? "#ececec" : "#f9f9f9"};
    border-radius: 16px;
    margin-vertical: 6px;
    elevation: ${(props: { $pressed: boolean }) => props.$pressed ? 1 : 2};
    transform: ${(props: { $pressed: boolean }) => props.$pressed ? "scale(0.98)" : "scale(1)"};
`;

const IconWrapper = styled.View`
    background-color: ${(props: { $bgColor: string }) => props.$bgColor};
    padding: 10px;
    border-radius: 12px;
    justify-content: center;
    align-items: center;
`;

const CategoryName = styled.Text`
    flex: 1;
    margin-left: 16px;
    font-size: 16px;
    color: #333;
`;

const DeleteButton = styled.TouchableOpacity`
    padding: 4px;
`;
