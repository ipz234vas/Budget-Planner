import React from "react";
import { FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { IconCategory, IconItem } from "../types/icon";
import {
    CategoryWrapper,
    CategoryLabel,
    IconsGrid,
    IconButton
} from "../../styles/components/IconPickerStyles";
import { useTheme } from "styled-components/native";

const getIconComponent = (library: IconItem["library"]) => {
    switch (library) {
        case "Ionicons":
            return Ionicons;
        case "MaterialIcons":
            return MaterialIcons;
        case "FontAwesome":
            return FontAwesome;
        default:
            return Ionicons;
    }
};

interface IconPickerProps {
    categories: IconCategory[];
    onSelect: (icon: IconItem) => void;
    selectedIcon?: IconItem;
    iconSize?: number;
}

export const IconPicker: React.FC<IconPickerProps> = ({
                                                          categories,
                                                          onSelect,
                                                          selectedIcon,
                                                          iconSize = 30
                                                      }) => {
    const theme = useTheme();

    const renderIcon = (icon: IconItem, isSelected: boolean) => {
        const IconComp = getIconComponent(icon.library);
        return (
            <IconButton
                key={`${icon.library}:${icon.name}`}
                onPress={() => onSelect(icon)}
                $selected={isSelected}
                activeOpacity={0.75}
            >
                <IconComp name={icon.name as any} size={iconSize} color={theme.colors.textSecondary}/>
            </IconButton>
        );
    };

    const renderCategory = ({ item }: { item: IconCategory }) => (
        <CategoryWrapper key={item.category}>
            <CategoryLabel>{item.category}</CategoryLabel>
            <IconsGrid>
                {item.icons.map((icon) =>
                    renderIcon(
                        icon,
                        selectedIcon?.library === icon.library &&
                        selectedIcon?.name === icon.name
                    )
                )}
            </IconsGrid>
        </CategoryWrapper>
    );

    return (
        <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(cat) => cat.category}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        />
    );
};
