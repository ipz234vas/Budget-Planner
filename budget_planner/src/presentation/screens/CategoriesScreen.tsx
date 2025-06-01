import React, { useContext, useEffect, useState } from "react";
import { Category } from "../../domain/models/Category";
import { IRepository } from "../../domain/interfaces/repositories/IRepository";
import { FactoryContext } from "../../app/contexts/FactoryContext";
import CategoryList from "../components/CategoryList";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
    Edit: {
        category: Category | undefined;
        categories: Category[];
    };
};

export default function CategoriesScreen() {
    const factory = useContext(FactoryContext);

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryRepository, setCategoryRepository] = useState<IRepository<Category> | null>(null);

    useEffect(() => {
        if (factory) {
            const repo = factory.getRepository(Category);
            setCategoryRepository(repo);
        }
    }, [factory]);

    const updateCategories = async () => {
        const categories = await categoryRepository?.getAll();
        if (categories)
            setCategories(categories);
    };

    useEffect(() => {
        updateCategories();
    }, [categoryRepository]);

    const handleDelete = async (id: number | undefined) => {
        if (id) {
            await categoryRepository?.delete(id);
            await updateCategories();
        }
    };

    type NavigationProp = StackNavigationProp<RootStackParamList, 'Edit'>;

    const navigation = useNavigation<NavigationProp>();

    const handlePress = async (id: number | undefined) => {
        navigation.navigate('Edit', {
            category: categories.find((c) => c.id === id),
            categories: categories.filter((c) => c.parentId === id),
        });
    };

    return (
        <CategoryList categories={categories} onDelete={handleDelete} onPress={handlePress}/>
    );
}