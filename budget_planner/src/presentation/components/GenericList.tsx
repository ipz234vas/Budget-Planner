import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import React, { ReactElement } from "react";

interface GenericListProps<T> {
    data: T[];
    renderItem: (item: T) => ReactElement;
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function GenericList<T>({ data, renderItem, onScroll }: GenericListProps<T>) {
    return (
        <FlatList
            contentContainerStyle={{
                paddingHorizontal: 10,
                paddingBottom: 50
            }}
            data={data}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item }) => renderItem(item)}
            scrollEventThrottle={16}
            onScroll={onScroll}
        />
    );
}
