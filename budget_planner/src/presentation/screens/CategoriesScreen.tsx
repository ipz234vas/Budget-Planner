import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { CategoriesTabsParamList } from "../types/CategoriesTabsParamList";
import { CategoriesStackParamList } from "../types/CategoriesStackParamList";
import { useCategories } from "../hooks/categories/useCategories";
import { EntityScreen } from "./EntityScreen";
import { CategoryItem } from "../components/CategoryItem";
import { Category } from "../../domain/models/Category";

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
        <EntityScreen
            data={categories}
            onAdd={handleAddRoot}
            renderItem={(item) => (
                <CategoryItem
                    category={item}
                    onPress={() => handlePress(item.id)}
                    onDelete={() => deleteCategory(item.id)}
                />
            )}
        />
    );
}