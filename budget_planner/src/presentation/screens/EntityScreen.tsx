import React, { useRef, useState } from "react";
import { View, FlatList, SectionList, NativeSyntheticEvent, NativeScrollEvent, Text, StyleSheet } from "react-native";
import { FAB, FABWrapper } from "../../styles/components/FAB";
import { ZoomIn, ZoomOut } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function EntityScreen<T, S = {}>({
                                            data,
                                            sections,
                                            renderItem,
                                            renderSectionHeader,
                                            onAdd,
                                        }: {
    data?: T[];
    sections?: (S & { data: T[] })[];
    renderItem: (item: T) => React.ReactElement;
    renderSectionHeader?: (section: S & { data: T[] }) => React.ReactElement;
    onAdd: () => void;
}) {
    const [showFab, setShowFab] = useState(true);
    const scrollOffset = useRef(0);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const direction = currentOffset > scrollOffset.current ? 'down' : 'up';
        if (direction === 'down' && showFab)
            setShowFab(false);
        if (direction === 'up' && !showFab)
            setShowFab(true);
        scrollOffset.current = currentOffset;
    };

    const listProps = {
        contentContainerStyle: styles.list,
        keyExtractor: (item: any, index: number) => `${index}`,
        renderItem: ({ item }: { item: T }) => renderItem(item),
        scrollEventThrottle: 16,
        onScroll: handleScroll,
        alwaysBounceVertical: false,
    };

    return (
        <View style={{ flex: 1 }}>
            {sections ? (
                <SectionList
                    {...listProps}
                    sections={sections}
                    renderSectionHeader={
                        renderSectionHeader
                            ? ({ section }) => renderSectionHeader(section as S & { data: T[] })
                            : undefined
                    }
                    stickySectionHeadersEnabled={false}
                />
            ) : (
                <FlatList
                    {...listProps}
                    data={data}
                />
            )}

            {showFab && (
                <FABWrapper entering={ZoomIn.duration(150)} exiting={ZoomOut.duration(200)}>
                    <FAB onPress={onAdd}>
                        <MaterialCommunityIcons name="plus" size={32} color="#fff"/>
                    </FAB>
                </FABWrapper>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        marginVertical: 12,
        paddingHorizontal: 10,
        paddingBottom: 50,
        gap: 12
    }
})