import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { IconCategory, IconItem } from "../types/icon";

const getIconComponent = (library: IconItem["library"]) => {
    switch (library) {
        case "Ionicons": return Ionicons;
        case "MaterialIcons": return MaterialIcons;
        case "FontAwesome": return FontAwesome;
        default: return Ionicons;
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
                                                          iconSize = 30,
                                                      }) => {
    const renderIcon = (icon: IconItem, isSelected: boolean) => {
        const IconComp = getIconComponent(icon.library);
        return (
            <TouchableOpacity
                key={`${icon.library}:${icon.name}`}
                onPress={() => onSelect(icon)}
                style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 6,
                    backgroundColor: isSelected ? "#d0e8ff" : "#f6f7f8",
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: isSelected ? "#429eff" : "transparent",
                }}
                activeOpacity={0.75}
            >
                <IconComp name={icon.name as any} size={iconSize} color="#222" />
            </TouchableOpacity>
        );
    };

    const renderCategory = ({ item }: { item: IconCategory }) => (
        <View key={item.category} style={{ marginBottom: 28 }}>
            <Text
                style={{
                    fontWeight: "600",
                    fontSize: 18,
                    marginBottom: 14,
                    color: "#555",
                }}
            >
                {item.category}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {item.icons.map((icon) =>
                    renderIcon(
                        icon,
                        selectedIcon?.library === icon.library &&
                        selectedIcon?.name === icon.name
                    )
                )}
            </View>
        </View>
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
