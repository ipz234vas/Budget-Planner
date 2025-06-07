import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { EntityScreen } from "./EntityScreen";
import { TransactionsStackParamList } from "../types/TransactionsStackParamList";
import { useTransactionsDetails } from "../hooks/transactions/useTransactionsDetails";
import { TransactionItem } from "../components/TransactionItem";
import { TransactionDetails } from "../../domain/interfaces/models/transactions/TransactionDetails";
import React from "react";
import { View, Text } from "react-native";
import { TransactionType } from "../../domain/enums/TransactionType";
import { useTheme } from "styled-components/native";
import { formatUADate } from "../utils/dateFormatter"; // наша функція групування

type TransactionsScreenRoute = RouteProp<TransactionsStackParamList, "Transactions">;

export default function TransactionsScreen() {
    const navigation = useNavigation<StackNavigationProp<TransactionsStackParamList, "Transactions">>();
    const theme = useTheme()

    const { transactions, deleteTransaction } = useTransactionsDetails();

    const handlePress = (transaction: TransactionDetails) => {
        navigation.navigate("TransactionEditor", { details: transaction });
    };

    const handleAdd = () => {
        navigation.navigate("TransactionEditor", {});
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        await deleteTransaction(id);
    };

    function groupTransactionsByDate(transactions: TransactionDetails[]) {
        const groups: Record<string, TransactionDetails[]> = {};
        transactions.forEach(tr => {
            const date = tr.transaction.date || "";
            if (!groups[date])
                groups[date] = [];
            groups[date].push(tr);
        });

        return Object.entries(groups)
            .sort(([a], [b]) => b.localeCompare(a)) // новіші дати вгорі
            .map(([date, items]) => {
                let total = 0;
                for (const tr of items) {
                    if (tr.transaction.type === TransactionType.Expense) total -= tr.transaction.amount || 0;
                    if (tr.transaction.type === TransactionType.Income) total += tr.transaction.amount || 0;
                }
                return {
                    data: items,
                    date,
                    total,
                    currency: "UAH" //temporary
                };
            });
    }

    const sections = groupTransactionsByDate(transactions);

    const renderSectionHeader = (section: { date: string; total: number, currency: string }) => (
        <View style={{
            backgroundColor: theme.colors.secondaryBackground,
            borderRadius: 8,
            marginBottom: 2,
            paddingHorizontal: 12,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
        }}>
            <Text style={{
                fontWeight: "bold",
                fontSize: 16,
                color: theme.colors.textSecondary
            }}>{formatUADate(section.date)}</Text>
            <Text style={{
                fontWeight: "bold",
                fontSize: 16,
                color: section.total > 0 ? theme.colors.positive : section.total < 0 ? theme.colors.negative : theme.colors.textSecondary
            }}>
                {section.total > 0 ? "+" : ""}{section.total.toFixed(2)} {section.currency}
            </Text>
        </View>
    );

    return (
        <EntityScreen
            sections={sections}
            onAdd={handleAdd}
            renderItem={(details) => (
                <TransactionItem
                    details={details}
                    onPress={() => handlePress(details)}
                    onLongPress={() => handleDelete(details.transaction.id)}
                />
            )}
            renderSectionHeader={renderSectionHeader}
        />
    );
}
