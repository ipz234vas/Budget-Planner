import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { EntityScreen } from "./EntityScreen";
import { TransactionsStackParamList } from "../types/TransactionsStackParamList";
import { useTransactionsDetails } from "../hooks/transactions/useTransactionsDetails";
import { TransactionItem } from "../components/TransactionItem";
import { TransactionDetails } from "../../domain/interfaces/models/transactions/TransactionDetails";

type TransactionsScreenRoute = RouteProp<TransactionsStackParamList, "Transactions">;

export default function TransactionsScreen() {
    const navigation = useNavigation<StackNavigationProp<TransactionsStackParamList, "Transactions">>();

    const { transactions, deleteTransaction } = useTransactionsDetails();

    const handlePress = (transaction: TransactionDetails) => {
        navigation.navigate("TransactionEditor", { details: transaction });
    };

    const handleAdd = () => {
        navigation.navigate("TransactionEditor", {});
    };

    const handleDelete = async (id?: number) => {
        if (!id)
            return;
        await deleteTransaction(id);
    };

    return (
        <EntityScreen
            data={transactions}
            onAdd={handleAdd}
            renderItem={(details) => (
                <TransactionItem
                    details={details}
                    onPress={() => handlePress(details)}
                    onLongPress={() => handleDelete(details.transaction.id)}
                />
            )}
        />
    );
}
