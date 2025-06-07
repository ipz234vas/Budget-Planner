import React, { ReactElement } from "react";
import { SectionList, NativeSyntheticEvent, NativeScrollEvent } from "react-native";

export type Section<T, S = {}> = S & { data: T[] };

interface GenericSectionListProps<T, S = {}> {
    sections: Section<T, S>[];
    renderItem: (item: T) => ReactElement;
    renderSectionHeader?: (section: Section<T, S>) => ReactElement;
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function GenericSectionList<T, S = {}>({
                                                  sections,
                                                  renderItem,
                                                  renderSectionHeader,
                                                  onScroll,
                                              }: GenericSectionListProps<T, S>) {
    return (
        <SectionList
            contentContainerStyle={{
                marginVertical: 12,
                paddingHorizontal: 10,
                paddingBottom: 50,
                gap: 12,
            }}
            sections={sections}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item }) => renderItem(item)}
            renderSectionHeader={
                renderSectionHeader
                    ? ({ section }) => renderSectionHeader(section as Section<T, S>)
                    : undefined
            }
            scrollEventThrottle={16}
            onScroll={onScroll}
            stickySectionHeadersEnabled={false}
        />
    );
}
