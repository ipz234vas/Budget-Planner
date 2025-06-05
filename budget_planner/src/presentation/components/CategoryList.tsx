import { Category } from "../../domain/models/Category";
import { CategoryItem } from "./CategoryItem";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import React from "react";

export default function CategoryList({
                                         categories,
                                         onDelete,
                                         onPress,
                                         onScroll
                                     }: {
    categories: Category[];
    parentId?: number | null;
    onDelete: (id: number | undefined) => void;
    onPress: (id: number | undefined) => void;
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {

    return (
        <FlatList
            contentContainerStyle={{
                paddingHorizontal: 10,
                paddingBottom: 50
            }}
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
            scrollEventThrottle={16}
            onScroll={onScroll}
        />
    );
}
