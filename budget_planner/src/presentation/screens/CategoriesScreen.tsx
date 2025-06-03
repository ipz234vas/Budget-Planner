import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Category } from "../../domain/models/Category";
import { IRepository } from "../../domain/interfaces/repositories/IRepository";
import { FactoryContext } from "../../app/contexts/FactoryContext";
import CategoryList from "../components/CategoryList";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { CategoriesTabsParamList } from "../types/CategoriesTabsParamList";
import { CategoryType } from "../../domain/enums/CategoryType";
import { useCategorySession } from "../../app/contexts/CategorySessionContext";

export type CategoriesStackParamList = {
    CategoryEditor: { id: number | undefined, type: CategoryType, parentId: number | null };
};

type CategoriesScreenRoute = RouteProp<CategoriesTabsParamList, "Income" | "Expenses">;

export default function CategoriesScreen() {
    const { type } = useRoute<CategoriesScreenRoute>().params
    const factory = useContext(FactoryContext);

    const session = useCategorySession();

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryRepository, setCategoryRepository] = useState<IRepository<Category> | null>(null);

    useEffect(() => {
        if (factory) {
            const repo = factory.getRepository(Category);
            setCategoryRepository(repo);
        }
    }, [factory]);

    const updateCategories = async () => {
        //const categories = await categoryRepository?.getAll();
        const categories =
            await categoryRepository?.query()
                .select()
                .where("parentId", { operator: "IS NULL" })
                .where("type", { operator: "=", value: type })
                .executeAsync();
        if (categories)
            setCategories(categories);
    };

    useFocusEffect(
        useCallback(() => {
            updateCategories();
        }, [categoryRepository])
    );

    const handleDelete = async (id: number | undefined) => {
        if (id) {
            await categoryRepository?.delete(id);
            await updateCategories();
        }
    };

    type NavigationProp = StackNavigationProp<CategoriesStackParamList, 'CategoryEditor'>;

    const navigation = useNavigation<NavigationProp>();

    const handlePress = (id?: number) => {
        session.addChild(null, { ...categories.find((c) => c.id === id) });
        navigation.navigate('CategoryEditor', { id: id, type: type, parentId: null });
    };

    const handleAddRoot = () => {
        const child = session.addChild(null, { type: type });
        navigation.navigate('CategoryEditor', { id: child.id, type: type, parentId: null });
    };

    return (
        <View style={{ flex: 1 }}>
            <CategoryList
                categories={categories}
                onDelete={handleDelete}
                onPress={handlePress}
            />
            <TouchableOpacity style={styles.fab} onPress={handleAddRoot}>
                <MaterialCommunityIcons name="plus" size={32} color="#fff"/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        right: 24,
        bottom: 36,
        backgroundColor: "#2854a7",
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
});
