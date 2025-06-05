import { Category } from "../../domain/models/Category";
import { CategoryItem } from "./CategoryItem";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import React from "react";
import { GenericList } from "./GenericList";

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
        <GenericList<Category> data={categories} onScroll={onScroll} renderItem={(item) => (
            <CategoryItem
                category={item}
                onDelete={() => onDelete(item.id)}
                onPress={() => onPress(item.id)}
            />
        )}/>
    );
}