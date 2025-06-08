import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { EntityScreen } from "./EntityScreen";
import { TransactionsStackParamList } from "../types/TransactionsStackParamList";
import { useTransactionsDetails } from "../hooks/transactions/useTransactionsDetails";
import { TransactionItem } from "../components/TransactionItem";
import { TransactionDetails } from "../../domain/interfaces/models/transactions/TransactionDetails";
import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { useTheme } from "styled-components/native";
import { formatUADate } from "../utils/dateFormatter";
import { useTotalsInBaseCurrency } from "../hooks/transactions/useTotalsInBaseCurrency";

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

    const handleDelete = (id?: number) => {
        if (!id) return;

        Alert.alert(
            "Видалити транзакцію",
            "Ви впевнені, що хочете видалити цю транзакцію?",
            [
                {
                    text: "Скасувати",
                    style: "cancel",
                },
                {
                    text: "Видалити",
                    style: "destructive",
                    onPress: () => {
                        Alert.alert(
                            "Оновити баланс рахунку?",
                            "Після видалення оновити баланс рахунку?",
                            [
                                {
                                    text: "Зберегти баланс",
                                    onPress: async () => {
                                        await deleteTransaction(id, false);
                                    },
                                },
                                {
                                    text: "Оновити баланс",
                                    onPress: async () => {
                                        await deleteTransaction(id);
                                    },
                                    style: "default",
                                },
                            ]
                        );
                    },
                },
            ]
        );
    };

    const { getTotalForSection, baseCurrency } = useTotalsInBaseCurrency();

    const [sections, setSections] = useState<any[]>([]);

    async function groupAndCalcTotals() {
        const groups: Record<string, TransactionDetails[]> = {};
        transactions.forEach(tr => {
            const date = tr.transaction.date || "";
            if (!groups[date]) groups[date] = [];
            groups[date].push(tr);
        });

        const sorted = Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));

        const result = await Promise.all(
            sorted.map(async ([date, items]) => {
                const total = await getTotalForSection(items);
                return {
                    data: items,
                    date,
                    total,
                    currency: baseCurrency,
                };
            })
        );
        setSections(result);
    }

    useEffect(() => {
        groupAndCalcTotals();
    }, [transactions, getTotalForSection, baseCurrency]);

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
