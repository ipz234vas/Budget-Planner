import { Category } from "../../domain/models/Category";
import { CategoryItem } from "./CategoryItem";
import { FlatList } from "react-native";
import React from "react";

export default function CategoryList({
                                         categories,
                                         onDelete,
                                         onPress,
                                     }: {
    categories: Category[];
    parentId?: number | null;
    onDelete: (id: number | undefined) => void;
    onPress: (id: number | undefined) => void;
}) {

    return (
        <FlatList
            data={categories}
            keyExtractor={(item) =>
                (item.id ?? Math.random()).toString()
            }
            renderItem={({ item }) => (
                <CategoryItem
                    category={item}
                    onDelete={() => onDelete(item.id)}
                    onPress={() => onPress(item.id)}
                />
            )}
        />
    );
}
