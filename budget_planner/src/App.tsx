import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from "react";
import { RepositoryFactory } from "./data/repositories/RepositoryFactory";
import { SQLiteService } from "./data/database/SQLiteService";
import { Category } from "./data/models/Category";
import { CategoryType } from "./domain/enums/CategoryType";

export default function App() {
    useEffect(() => {
        const testRepository = async () => {
            const factory = new RepositoryFactory(await SQLiteService.getInstance())
            const repository = factory.getRepository(Category)
            await repository?.insert(new Category({
                name: "test category",
                type: CategoryType.Expense,
            }));
            const categories = await repository?.getAll();
            console.log(categories);
        };
        testRepository();
    }, []);
    return (
        <View style={styles.container}>
            <Text>Open up App.tsx to start working on your app!</Text>
            <StatusBar style="auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
