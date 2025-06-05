import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { CategoriesStackParamList } from "../types/CategoriesStackParamList";
import { EntityScreen } from "./EntityScreen";
import { AccountsTabsParamList } from "../types/AccountsTabsParamList";
import { AccountItem } from "../components/AccountItem";
import { useState } from "react";
import { Account } from "../../domain/models/Account";

type CategoriesScreenRoute = RouteProp<AccountsTabsParamList, "Account" | "Saving">;

export default function AccountsScreen() {
    const { type } = useRoute<CategoriesScreenRoute>().params;
    const [accounts, setAccounts] = useState<Account[]>([]);

    const navigation = useNavigation<StackNavigationProp<CategoriesStackParamList, 'CategoryEditor'>>();

    const handlePress = (id?: number) => {
        //переходим в едіт
    };

    const handleAddRoot = () => {
        setAccounts(prevState => [...prevState, new Account({
            id: 4,
            name: "Account",
            type: type,
            currencyCode: "UAH",
            currentAmount: 0
        })])
    };

    const deleteItem = (id?: number) => {
        setAccounts(accounts.filter(account => account.id !== id));
    }

    return (
        <EntityScreen
            data={accounts}
            onAdd={handleAddRoot}
            renderItem={(item) => (
                <AccountItem
                    account={item}
                    onPress={() => handlePress(item.id)}
                    onDelete={() => deleteItem(item.id)}
                />
            )}
        />
    );
}