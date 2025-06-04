import React, { useState } from "react";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Category } from "../../domain/models/Category";
import { dbToIconItem } from "../utils/iconDbMapper";
import { IconRenderer } from "./IconRenderer";
import {
    ItemContainer,
    IconWrapper,
    CategoryName,
    DeleteButton
} from "../../styles/components/CategoryItemStyles";
import { useTheme } from "styled-components/native";

interface CategoryItemProps {
    category: Category;
    onPress?: () => void;
    onDelete?: () => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
                                                              category,
                                                              onPress,
                                                              onDelete
                                                          }) => {
    const [pressed, setPressed] = useState(false);
    const theme = useTheme();
    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
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
                    <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={24}
                        color={theme.colors.negative}
                    />
                </DeleteButton>
            </ItemContainer>
        </Pressable>
    );
};
