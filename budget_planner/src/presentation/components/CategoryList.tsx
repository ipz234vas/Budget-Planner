import { Category } from "../../data/models/Category";
import { CategoryItem } from "./CategoryItem";
import { FlatList } from "react-native";
import React from "react";

export default function CategoryList({ categories, parentId = null, onDelete, onPress }: {
    categories: Category[],
    parentId?: number | null,
    onDelete: (id: number | undefined) => void
    onPress: (id: number | undefined) => void
}) {

    categories = categories.filter(value => value.parentId === parentId);

    return (
        <FlatList
            data={categories}
            keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
            renderItem={({ item }) => <CategoryItem category={item}
                                                    onDelete={() => onDelete(item.id)}
                                                    onPress={() => onPress(item.id)}/>}
        />
    )
}