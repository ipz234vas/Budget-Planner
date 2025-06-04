import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CategoryList from "../components/CategoryList";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { CategoriesTabsParamList } from "../types/CategoriesTabsParamList";
import { useCategories } from "../hooks/categories/useCategories";
import { CategoriesStackParamList } from "../types/CategoriesStackParamList";
import { FAB } from "../../styles/components/FAB";

type CategoriesScreenRoute = RouteProp<CategoriesTabsParamList, "Income" | "Expenses">;

export default function CategoriesScreen() {
    const { type } = useRoute<CategoriesScreenRoute>().params;
    const { categories, deleteCategory } = useCategories(type);

    const navigation = useNavigation<StackNavigationProp<CategoriesStackParamList, 'CategoryEditor'>>();

    const handlePress = (id?: number) => {
        navigation.navigate('CategoryEditor', { id: id, parentId: null, type: type });
    };
    const handleAddRoot = () => {
        navigation.navigate("CategoryEditor", { parentId: null, type: type });
    };

    return (
        <View style={{ flex: 1 }}>
            <CategoryList
                categories={categories}
                onDelete={deleteCategory}
                onPress={handlePress}
            />
            <FAB onPress={handleAddRoot}>
                <MaterialCommunityIcons name="plus" size={32} color="#fff"/>
            </FAB>
        </View>
    );
}