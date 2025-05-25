import React, { useContext, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Category } from "../../data/models/Category";
import { IRepository } from "../../domain/repositories/IRepository";
import { CategoryItem } from "../components/CategoryItem";
import { FactoryContext } from "../contexts/FactoryContext";

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
        if (categories) setCategories(categories);
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


    return (
        <FlatList
            data={categories}
            keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
            renderItem={({ item }) => <CategoryItem category={item} onDelete={() => handleDelete(item.id)}/>}
            contentContainerStyle={{ padding: 0 }}
        />
    );
}
