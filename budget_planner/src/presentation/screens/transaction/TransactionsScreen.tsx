import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { EntityScreen } from "../EntityScreen";
import { TransactionsStackParamList } from "../../types/TransactionsStackParamList";
import { useTransactionsDetails } from "../../hooks/transactions/useTransactionsDetails";
import { TransactionItem } from "../../components/transaction/TransactionItem";
import { TransactionDetails } from "../../../domain/interfaces/models/transactions/TransactionDetails";
import { useEffect, useState } from "react";
import { formatUADate } from "../../utils/dateFormatter";
import { useTotalsInBaseCurrency } from "../../hooks/transactions/useTotalsInBaseCurrency";
import { SectionAmount, SectionDate, SectionHeaderContainer } from "../../../styles/components/transaction/TransactionSectionStyles";
import { confirmTransactionDelete } from "../../utils/transaction/confirmTransactionDelete";
import { TransactionSection } from "../../types/TransactionSection";
import { buildSections, groupByDate } from "../../utils/transaction/sections";

export default function TransactionsScreen() {
    const navigation = useNavigation<StackNavigationProp<TransactionsStackParamList, "Transactions">>();

    const { transactions, deleteTransaction } = useTransactionsDetails();

    const handlePress = (transaction: TransactionDetails) => {
        navigation.navigate("TransactionEditor", { details: transaction });
    };

    const handleAdd = () => {
        navigation.navigate("TransactionEditor", {});
    };

    const handleDelete = (id?: number) => {
        if (!id) return;

        confirmTransactionDelete(async (updateBalance) => {
            await deleteTransaction(id, updateBalance);
        });
    };

    const { getTotalForSection, baseCurrency } = useTotalsInBaseCurrency();

    const [sections, setSections] = useState<TransactionSection[]>([]);

    async function groupAndCalcTotals() {
        const grouped = groupByDate(transactions);
        const built = await buildSections(grouped, getTotalForSection, baseCurrency || "");
        setSections(built);
    }

    useEffect(() => {
        groupAndCalcTotals();
    }, [transactions, getTotalForSection, baseCurrency]);

    const renderSectionHeader = (section: { date: string; total: number; currency: string }) => (
        <SectionHeaderContainer>
            <SectionDate>{formatUADate(section.date)}</SectionDate>
            <SectionAmount
                positive={section.total > 0}
                negative={section.total < 0}
            >
                {section.total > 0 ? "+" : ""}
                {section.total.toFixed(2)} {section.currency}
            </SectionAmount>
        </SectionHeaderContainer>
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
