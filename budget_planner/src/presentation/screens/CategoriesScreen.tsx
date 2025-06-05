import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CategoryList from "../components/CategoryList";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { CategoriesTabsParamList } from "../types/CategoriesTabsParamList";
import { useCategories } from "../hooks/categories/useCategories";
import { CategoriesStackParamList } from "../types/CategoriesStackParamList";
import { FAB, FABWrapper } from "../../styles/components/FAB";
import { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useRef, useState } from "react";

type CategoriesScreenRoute = RouteProp<CategoriesTabsParamList, "Income" | "Expenses">;

export default function CategoriesScreen() {
    const { type } = useRoute<CategoriesScreenRoute>().params;
    const { categories, deleteCategory } = useCategories(type);
    const [showFab, setShowFab] = useState(true);
    const scrollOffset = useRef(0);

    const navigation = useNavigation<StackNavigationProp<CategoriesStackParamList, 'CategoryEditor'>>();

    const handlePress = (id?: number) => {
        navigation.navigate('CategoryEditor', { id: id, parentId: null, type: type });
    };

    const handleAddRoot = () => {
        navigation.navigate("CategoryEditor", { parentId: null, type: type });
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const direction = currentOffset > scrollOffset.current ? 'down' : 'up';
        if (direction === 'down' && showFab)
            setShowFab(false);
        if (direction === 'up' && !showFab)
            setShowFab(true);
        scrollOffset.current = currentOffset;
    }

    return (
        <View style={{ flex: 1 }}>
            <CategoryList
                categories={categories}
                onDelete={deleteCategory}
                onPress={handlePress}
                onScroll={handleScroll}
            />

            {showFab && (
                <FABWrapper entering={ZoomIn.duration(150)} exiting={ZoomOut.duration(200)}>
                    <FAB onPress={handleAddRoot}>
                        <MaterialCommunityIcons name="plus" size={32} color="#fff"/>
                    </FAB>
                </FABWrapper>
            )}
        </View>
    );
}