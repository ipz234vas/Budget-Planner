import React, { useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, Switch, TouchableOpacity, View } from "react-native";
import { useTheme } from "styled-components/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import DatePicker from "react-native-date-picker";

import { TransactionType } from "../../domain/enums/TransactionType";
import {
    EditorInput,
    EditorLabel,
    FormContainer,
    HeaderButton,
    HeaderContainer,
    HeaderSide,
    HeaderTitle,
} from "../../styles/components/EditorCommonStyles";
import { ThemeContext } from "../../app/contexts/ThemeContext";
import { UniversalDropdown } from "../components/UniversalDropdown";
import { useCurrencyConverter } from "../hooks/currencies/useCurrencyConverter";
import CategoryPickerModal from "../components/CategoryPickerModal";
import AccountPickerModal from "../components/AccountPickerModal";
import { DropdownItem } from "../components/DropdownItem";
import { CategoryType } from "../../domain/enums/CategoryType";
import { AccountType } from "../../domain/enums/AccountType";
import { TransactionsStackParamList } from "../types/TransactionsStackParamList";
import { TransactionDraft } from "../../domain/models/TransactionDraft";
import { Account } from "../../domain/models/Account";
import { AccountInfo } from "../../domain/interfaces/models/transactions/AccountInfo";
import { Transaction } from "../../domain/models/Transaction";
import { useTransactionDetailsService } from "../hooks/transactions/useTransactionDetailsService";

type EditorRoute = RouteProp<TransactionsStackParamList, "TransactionEditor">;

export default function TransactionEditorScreen() {
    const transService = useTransactionDetailsService();
    const nav = useNavigation();
    const theme = useTheme();
    const { theme: themeMode } = useContext(ThemeContext);
    const { baseCurrency, converter, convert } = useCurrencyConverter();
    const { params } = useRoute<EditorRoute>();
    const details = params?.details;

    const [draft, setDraft] = useState<TransactionDraft>(() => new TransactionDraft(details));
    const patchDraft = (patch: Partial<TransactionDraft>) =>
        setDraft(prev => ({ ...prev, ...patch }));

    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [fromAccountModalVisible, setFromAccountModalVisible] = useState(false);
    const [toAccountModalVisible, setToAccountModalVisible] = useState(false);
    const [datePickerVisible, setDatePickerVisible] = useState(false);

    const showCat = draft.type !== TransactionType.Transfer;
    const showFrom = draft.type !== TransactionType.Income;
    const showTo = draft.type !== TransactionType.Expense;

    const amountCurrency = useMemo(
        () =>
            draft.type === TransactionType.Income
                ? draft.toAccount?.currencyCode
                : draft.fromAccount?.currencyCode,
        [draft.type, draft.fromAccount, draft.toAccount]
    );

    const [prevBaseCurrency, setPrevBaseCurrency] = useState(baseCurrency);

    const needEquivInput =
        !!amountCurrency &&
        !!baseCurrency &&
        amountCurrency !== baseCurrency;

    useEffect(() => {
        let cancelled = false;
        const timeout = setTimeout(() => {
            (async () => {
                if (!draft.amount || !amountCurrency || !baseCurrency) {
                    patchDraft({ equivBase: "", toAmount: "", rateCustom: undefined });
                    return;
                }
                const amt = Number(draft.amount);
                const dateISO = draft.dateTime.toISOString();
                const rAmountUAH = await converter.getRateUAH(amountCurrency, dateISO);
                const rBaseUAH = await converter.getRateUAH(baseCurrency, dateISO);

                if (!draft.useCustomRate && needEquivInput) {
                    const rateToBase = rAmountUAH / rBaseUAH;
                    patchDraft({
                        equivBase: amt ? (amt * rateToBase).toFixed(2) : "",
                        rateCustom: undefined,
                    });
                }

                if (
                    showTo &&
                    draft.fromAccount?.currencyCode &&
                    draft.toAccount?.currencyCode &&
                    draft.amount
                ) {
                    let fromToUAH = draft.useCustomRate && draft.rateCustom
                        ? draft.rateCustom
                        : await converter.getRateUAH(
                            draft.fromAccount.currencyCode,
                            dateISO
                        );
                    let toToUAH = await converter.getRateUAH(
                        draft.toAccount.currencyCode,
                        dateISO
                    );
                    let toAmount = Number(draft.amount) * (fromToUAH / toToUAH);
                    patchDraft({ toAmount: toAmount.toFixed(2) });
                } else if (
                    showTo &&
                    draft.fromAccount?.currencyCode === draft.toAccount?.currencyCode &&
                    draft.amount
                ) {
                    patchDraft({ toAmount: draft.amount });
                }
            })();
        }, 200);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [
        draft.amount,
        draft.useCustomRate,
        draft.rateCustom,
        amountCurrency,
        baseCurrency,
        draft.fromAccount,
        draft.toAccount,
        draft.type,
        draft.dateTime,
        needEquivInput,
        converter,
        showTo,
    ]);

    useEffect(() => {
        if (
            draft.amount &&
            amountCurrency &&
            baseCurrency &&
            amountCurrency !== baseCurrency &&
            (!draft.equivBase || draft.equivBase === "0")
        ) {
            (async () => {
                const eqv = await convert(Number(draft.amount), amountCurrency, baseCurrency, draft.dateTime.toISOString(), draft.rateCustom);
                patchDraft({ equivBase: eqv.toFixed(2) });
            })();
        }
    }, [details, amountCurrency, baseCurrency]);


    const onEquivBaseChange = async (equivBase: string) => {
        patchDraft({ equivBase });
        if (
            equivBase &&
            draft.amount &&
            needEquivInput &&
            draft.useCustomRate &&
            amountCurrency &&
            baseCurrency
        ) {
            const amt = Number(draft.amount);
            const eqv = Number(equivBase);
            const dateISO = draft.dateTime.toISOString();
            const rBaseUAH = await converter.getRateUAH(baseCurrency, dateISO);
            const customRate = amt !== 0 ? (eqv / amt) * rBaseUAH : undefined;
            patchDraft({ rateCustom: customRate });
        }
    };

    const onCustomRateToggle = (useCustomRate: boolean) => {
        if (!useCustomRate) {
            patchDraft({ useCustomRate: false, rateCustom: undefined });
        } else {
            patchDraft({ useCustomRate: true });
        }
    };

    const typeItems = [
        { label: "Витрата", value: TransactionType.Expense },
        { label: "Дохід", value: TransactionType.Income },
        { label: "Переказ", value: TransactionType.Transfer },
    ];

    const fmtDate = (d: Date) => d.toLocaleDateString("uk-UA");
    const fmtTime = (d: Date) =>
        d.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });

    const onSave = async () => {
        try {
            const rate =
                draft.rateCustom ??
                (amountCurrency
                    ? await converter.getRateUAH(amountCurrency, draft.dateTime.toISOString())
                    : 1);

            const trans = new Transaction({
                id: details?.transaction.id,
                type: draft.type,
                amount: Number(draft.amount),
                currencyCode: amountCurrency,
                rate,
                categoryId: draft.category?.id,
                fromAccountId: draft.fromAccount?.id,
                toAccountId: draft.toAccount?.id,
                date: draft.dateTime.getFullYear() + "-" +
                    String(draft.dateTime.getMonth() + 1).padStart(2, "0") + "-" +
                    String(draft.dateTime.getDate()).padStart(2, "0"),
                time: draft.dateTime.getHours().toString().padStart(2, "0") + ":" +
                    draft.dateTime.getMinutes().toString().padStart(2, "0") + ":" +
                    draft.dateTime.getSeconds().toString().padStart(2, "0"),
                description: draft.description,
            });

            if (!trans.id)
                await transService?.createTransaction(trans);
            else
                await transService?.updateTransaction(trans.id, trans);

            nav.goBack();
        } catch (err) {
            console.error(err);
        }
    };

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

                    {/* Додатковий інпут: еквівалент (якщо валюти різні) */}
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

                    {/* Transfer: "Сума, що надходить" */}
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

export function getAccountInfo(account: Account): AccountInfo {
    return { ...account } as AccountInfo;
}
