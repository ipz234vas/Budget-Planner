import React from "react";
import { FlatList } from "react-native";
import type { IconCategory, IconItem } from "../types/icon";
import { CategoryLabel, CategoryWrapper, IconButton, IconsGrid } from "../../styles/components/IconPickerStyles";
import { useTheme } from "styled-components/native";
import { getIconComponent } from "../utils/iconHelpers";

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
