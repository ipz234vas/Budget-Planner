import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { EntityScreen } from "../EntityScreen";
import { AccountsTabsParamList } from "../../types/AccountsTabsParamList";
import { AccountsStackParamList } from "../../types/AccountsStackParamList";
import { AccountItem } from "../../components/account/AccountItem";
import { useAccounts } from "../../hooks/accounts/useAccounts";

type AccountsScreenRoute = RouteProp<AccountsTabsParamList, "Account" | "Saving">;

export default function AccountsScreen() {
    const { type } = useRoute<AccountsScreenRoute>().params;

    const { accounts, deleteAccount } = useAccounts(type);

    const navigation = useNavigation<StackNavigationProp<AccountsStackParamList, 'Accounts'>>();

    const handlePress = (id?: number) => {
        navigation.navigate('AccountEditor', { id: id, type: type });
    };

    const handleAdd = () => {
        navigation.navigate('AccountEditor', { type: type });
    };

    const deleteItem = async (id?: number) => {
        await deleteAccount(id);
    }

    return (
        <EntityScreen
            data={accounts}
            onAdd={handleAdd}
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