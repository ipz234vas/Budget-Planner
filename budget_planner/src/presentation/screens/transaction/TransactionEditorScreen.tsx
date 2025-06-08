import React, { useContext, useState } from "react";
import { ScrollView, Switch, TouchableOpacity, View } from "react-native";
import { useTheme } from "styled-components/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import DatePicker from "react-native-date-picker";

import { TransactionType } from "../../../domain/enums/TransactionType";
import {
    EditorInput,
    EditorLabel,
    FormContainer,
    HeaderButton,
    HeaderContainer,
    HeaderSide,
    HeaderTitle,
} from "../../../styles/components/universal/EditorCommonStyles";
import { ThemeContext } from "../../../app/contexts/ThemeContext";
import { UniversalDropdown } from "../../components/universal/UniversalDropdown";
import { useCurrencyConverter } from "../../hooks/currencies/useCurrencyConverter";
import CategoryPickerModal from "../../components/category/CategoryPickerModal";
import AccountPickerModal from "../../components/account/AccountPickerModal";
import { DropdownItem } from "../../components/universal/DropdownItem";
import { CategoryType } from "../../../domain/enums/CategoryType";
import { AccountType } from "../../../domain/enums/AccountType";
import { TransactionsStackParamList } from "../../types/TransactionsStackParamList";
import { getAccountInfo } from "../../../domain/interfaces/models/transactions/AccountInfo";
import { useTransactionDraft } from "../../hooks/transactions/useTransactionDraft";
import { useTransactionComputedFields } from "../../hooks/transactions/useTransactionComputedFields";
import { useTransactionRatesEffect } from "../../hooks/transactions/useTransactionRatesEffectProps";
import { useEquivBaseEffect } from "../../hooks/transactions/useEquivBaseEffect";
import { useCustomRateHandlers } from "../../hooks/transactions/useCustomRateHandlers";
import { useTransactionSaver } from "../../hooks/transactions/useTransactionSaver";
import { fmtDate, fmtTime, typeItems } from "../../utils/transaction/transactionFormatter";

type EditorRoute = RouteProp<TransactionsStackParamList, "TransactionEditor">;

export default function TransactionEditorScreen() {
    const nav = useNavigation();
    const theme = useTheme();
    const { theme: themeMode } = useContext(ThemeContext);
    const { baseCurrency, converter, convert } = useCurrencyConverter();
    const { params } = useRoute<EditorRoute>();
    const details = params?.details;

    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [fromAccountModalVisible, setFromAccountModalVisible] = useState(false);
    const [toAccountModalVisible, setToAccountModalVisible] = useState(false);
    const [datePickerVisible, setDatePickerVisible] = useState(false);

    const { draft, patchDraft } = useTransactionDraft(details);

    const {
        showCat, showFrom, showTo, amountCurrency, needEquivInput,
    } = useTransactionComputedFields(draft, baseCurrency);

    useTransactionRatesEffect({
        draft, baseCurrency, amountCurrency, converter, patchDraft, showTo, needEquivInput,
    });

    useEquivBaseEffect({
        details, draft, baseCurrency, amountCurrency, convert, patchDraft,
    });

    const { onEquivBaseChange, onCustomRateToggle } = useCustomRateHandlers({
        draft,
        amountCurrency,
        baseCurrency,
        needEquivInput,
        converter,
        patchDraft,
    });

    const { onSave } = useTransactionSaver({
        draft,
        details,
        amountCurrency,
        baseCurrency,
        converter,
    });

    return (
        <View style={{ flex: 1 }}>
            <HeaderContainer>
                <HeaderSide>
                    <HeaderButton onPress={() => nav.goBack()}>
                        <MaterialIcons name="arrow-back-ios-new" size={24} color={theme.colors.textPrimary}/>
                    </HeaderButton>
                </HeaderSide>
                <HeaderTitle>{details ? "Редагування транзакції" : "Нова транзакція"}</HeaderTitle>
                <HeaderSide style={{ justifyContent: "flex-end" }}>
                    <HeaderButton onPress={onSave}>
                        <MaterialCommunityIcons name="content-save" size={28} color={theme.colors.positive}/>
                    </HeaderButton>
                </HeaderSide>
            </HeaderContainer>

            <ScrollView keyboardShouldPersistTaps="handled">
                <FormContainer>
                    <View>
                        <EditorLabel>Тип</EditorLabel>
                        <UniversalDropdown
                            data={typeItems}
                            labelField="label"
                            valueField="value"
                            value={draft.type}
                            placeholder="Оберіть тип"
                            renderItem={(item, sel) => (
                                <DropdownItem item={item} selected={!!sel}/>
                            )}
                            onChange={(i) =>
                                patchDraft({
                                    type: i.value as TransactionType,
                                    category: null,
                                    fromAccount: null,
                                    toAccount: null,
                                })
                            }
                        />
                    </View>

                    {showCat && (
                        <TouchableOpacity onPress={() => setCategoryModalVisible(true)}>
                            <EditorLabel>Категорія</EditorLabel>
                            <EditorInput
                                editable={false}
                                value={draft.category?.name ?? ""}
                                placeholder="Обрати..."
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    )}

                    {showFrom && (
                        <TouchableOpacity onPress={() => setFromAccountModalVisible(true)}>
                            <EditorLabel>З рахунку</EditorLabel>
                            <EditorInput
                                editable={false}
                                value={draft.fromAccount?.name}
                                placeholder="Обрати..."
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    )}

                    {showTo && (
                        <TouchableOpacity onPress={() => setToAccountModalVisible(true)}>
                            <EditorLabel>На рахунок</EditorLabel>
                            <EditorInput
                                editable={false}
                                value={draft.toAccount?.name}
                                placeholder="Обрати..."
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    )}

                    <View>
                        <EditorLabel>Сума ({amountCurrency || "валюта не вибрана"})</EditorLabel>
                        <EditorInput
                            keyboardType="numeric"
                            value={draft.amount}
                            onChangeText={amount => patchDraft({ amount })}
                            placeholder="0"
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>

                    {needEquivInput && (
                        <>
                            <EditorLabel>≈ У {baseCurrency}</EditorLabel>
                            <EditorInput
                                keyboardType="numeric"
                                value={draft.equivBase}
                                editable={draft.useCustomRate}
                                onChangeText={onEquivBaseChange}
                                placeholder="0"
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Switch
                                    thumbColor={theme.colors.secondaryBackground}
                                    trackColor={{
                                        false: undefined,
                                        true: theme.colors.textSecondary,
                                    }}
                                    value={draft.useCustomRate}
                                    onValueChange={onCustomRateToggle}
                                />
                                <EditorLabel style={{ marginLeft: theme.spacing.xs }}>
                                    Власний курс
                                </EditorLabel>
                            </View>
                        </>
                    )}

                    {showTo &&
                        draft.fromAccount?.currencyCode &&
                        draft.toAccount?.currencyCode &&
                        draft.fromAccount.currencyCode !== draft.toAccount.currencyCode &&
                        draft.type === TransactionType.Transfer && (
                            <>
                                <EditorLabel>
                                    Сума, що надходить ({draft.toAccount.currencyCode})
                                </EditorLabel>
                                <EditorInput
                                    editable={false}
                                    value={draft.toAmount}
                                    placeholderTextColor={theme.colors.textSecondary}
                                />
                            </>
                        )}

                    <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                        <EditorLabel>Дата та час</EditorLabel>
                        <EditorInput
                            editable={false}
                            value={`${fmtDate(draft.dateTime)}  ${fmtTime(draft.dateTime)}`}
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </TouchableOpacity>

                    <View>
                        <EditorLabel>Опис</EditorLabel>
                        <EditorInput
                            value={draft.description}
                            onChangeText={description => patchDraft({ description })}
                            placeholder="Коментар"
                            multiline
                            style={{ height: 80 }}
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>
                </FormContainer>
            </ScrollView>

            <CategoryPickerModal
                visible={categoryModalVisible}
                type={draft.type as unknown as CategoryType}
                onClose={() => setCategoryModalVisible(false)}
                onSelect={cat => {
                    patchDraft({ category: cat });
                    setCategoryModalVisible(false);
                }}
            />
            <AccountPickerModal
                visible={fromAccountModalVisible}
                initialType={AccountType.Account}
                excludeId={draft.type === TransactionType.Transfer ? draft.toAccount?.id : undefined}
                onClose={() => setFromAccountModalVisible(false)}
                onSelect={acc => {
                    patchDraft({ fromAccount: getAccountInfo(acc) });
                    setFromAccountModalVisible(false);
                    if (draft.type === TransactionType.Transfer && draft.toAccount?.id === acc.id) {
                        patchDraft({ toAccount: null });
                    }
                }}
            />
            <AccountPickerModal
                visible={toAccountModalVisible}
                initialType={AccountType.Account}
                excludeId={draft.type === TransactionType.Transfer ? draft.fromAccount?.id : undefined}
                onClose={() => setToAccountModalVisible(false)}
                onSelect={acc => {
                    patchDraft({ toAccount: getAccountInfo(acc) });
                    setToAccountModalVisible(false);
                    if (draft.type === TransactionType.Transfer && draft.fromAccount?.id === acc.id) {
                        patchDraft({ fromAccount: null });
                    }
                }}
            />
            <DatePicker
                modal
                open={datePickerVisible}
                mode="datetime"
                date={draft.dateTime}
                locale="uk"
                theme={themeMode}
                onConfirm={d => {
                    patchDraft({ dateTime: d });
                    setDatePickerVisible(false);
                }}
                onCancel={() => setDatePickerVisible(false)}
                title="Оберіть дату та час"
                confirmText="Готово"
                cancelText="Скасувати"
            />
        </View>
    );
}