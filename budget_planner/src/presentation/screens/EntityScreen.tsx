import React, { useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import { GenericList } from "../components/GenericList";
import { FAB, FABWrapper } from "../../styles/components/FAB";
import { ZoomIn, ZoomOut } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function EntityScreen<T>({
                                    data,
                                    onAdd,
                                    renderItem,
                                }: {
    data: T[];
    onAdd: () => void;
    renderItem: (item: T) => React.ReactElement;
}) {
    const [showFab, setShowFab] = useState(true);
    const scrollOffset = useRef(0);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const direction = currentOffset > scrollOffset.current ? 'down' : 'up';
        if (direction === 'down' && showFab) setShowFab(false);
        if (direction === 'up' && !showFab) setShowFab(true);
        scrollOffset.current = currentOffset;
    };

    return (
        <View style={{ flex: 1 }}>
            <GenericList<T>
                data={data}
                renderItem={renderItem}
                onScroll={handleScroll}
            />

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
