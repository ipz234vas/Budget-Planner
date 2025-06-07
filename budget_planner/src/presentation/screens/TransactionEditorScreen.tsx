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
import { FactoryContext } from "../../app/contexts/FactoryContext";

type EditorRoute = RouteProp<TransactionsStackParamList, "TransactionEditor">;

export default function TransactionEditorScreen() {
    const nav = useNavigation();
    const theme = useTheme();
    const { theme: themeMode } = useContext(ThemeContext);
    const { convert, getRateToBase, baseCurrency } = useCurrencyConverter();

    // --------- Params (edit mode?) ---------
    const { params } = useRoute<EditorRoute>();
    const details = params?.details;

    // --------- Draft state ---------
    const [draft, setDraft] = useState<TransactionDraft>(
        () => new TransactionDraft(details)
    );
    // Patch function for draft updates
    const patchDraft = (patch: Partial<TransactionDraft>) =>
        setDraft(prev => ({ ...prev, ...patch }));

    // --------- UI state for modals ---------
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [fromAccountModalVisible, setFromAccountModalVisible] = useState(false);
    const [toAccountModalVisible, setToAccountModalVisible] = useState(false);
    const [datePickerVisible, setDatePickerVisible] = useState(false);

    const showCat = draft.type !== TransactionType.Transfer;
    const showFrom = draft.type !== TransactionType.Income;
    const showTo = draft.type !== TransactionType.Expense;
    console.log(draft)
    const amountCurrency = useMemo(
        () =>
            draft.type === TransactionType.Income
                ? draft.toAccount?.currencyCode
                : draft.fromAccount?.currencyCode,
        [draft.type, draft.fromAccount, draft.toAccount]
    );

    useEffect(() => {
        (async () => {
            if (draft.amount === "" || !amountCurrency) {
                patchDraft({ equivBase: "", toAmount: "" });
                return;
            }

            const dayUsed =
                draft.dateTime > new Date() ? new Date() : draft.dateTime;

            if (!draft.useCustomRate) {
                const rate = await getRateToBase(amountCurrency, dayUsed.toISOString());
                patchDraft({
                    rateCustom: null,
                    equivBase: (Number(draft.amount) * rate).toFixed(2),
                });
            } else {
                const amt = Number(draft.amount);
                if (!isNaN(amt) && amt !== 0) {
                    patchDraft({ rateCustom: Number(draft.equivBase) / amt });
                }
            }

            if (
                showTo &&
                draft.fromAccount?.currencyCode &&
                draft.toAccount?.currencyCode &&
                draft.amount !== ""
            ) {
                const converted = await convert(
                    Number(draft.amount),
                    draft.fromAccount.currencyCode,
                    draft.toAccount.currencyCode,
                    dayUsed.toISOString(),
                    draft.rateCustom ?? undefined
                );
                patchDraft({ toAmount: converted.toFixed(2) });
            }
        })();
    }, [
        draft.amount,
        amountCurrency,
        draft.useCustomRate,
        draft.equivBase,
        draft.fromAccount,
        draft.toAccount,
        draft.dateTime,
        draft.rateCustom,
        showTo,
    ]);

    const typeItems = [
        { label: "Витрата", value: TransactionType.Expense },
        { label: "Дохід", value: TransactionType.Income },
        { label: "Переказ", value: TransactionType.Transfer },
    ];

    const fmtDate = (d: Date) => d.toLocaleDateString("uk-UA");
    const fmtTime = (d: Date) =>
        d.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });

    const factory = useContext(FactoryContext);
    const onSave = async () => {
        try {
            const rate =
                draft.rateCustom ??
                (amountCurrency
                    ? await getRateToBase(amountCurrency, draft.dateTime.toISOString())
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
                date: draft.dateTime.toISOString().slice(0, 10),
                time: draft.dateTime.toISOString().slice(11, 19),
                description: draft.description,
            });

            const tRepo = factory?.getRepository(Transaction);
            const aRepo = factory?.getRepository(Account);
            if (!trans.id)
                await tRepo?.insert(trans)
            else await tRepo?.update(trans);
            const from = await aRepo?.getById(trans.fromAccountId!);
            if (from && trans.amount) {
                from.currentAmount -= trans.amount;
                await aRepo?.update(from)
            }
            const to = await aRepo?.getById(trans.toAccountId!);
            if (to && trans.amount) {
                to.currentAmount += trans.amount;
                await aRepo?.update(to)
            }

            nav.goBack();
        } catch (err) {
            console.error(err)
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
                            onChangeText={(amount) => patchDraft({ amount })}
                            placeholder="0"
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>

                    {amountCurrency && amountCurrency !== baseCurrency && (
                        <>
                            <EditorLabel>≈ У {baseCurrency}</EditorLabel>
                            <EditorInput
                                keyboardType="numeric"
                                editable={draft.useCustomRate}
                                value={draft.equivBase}
                                onChangeText={(equivBase) => patchDraft({ equivBase })}
                                placeholder="0"
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                            <View style={{ flexDirection: "row" }}>
                                <Switch
                                    thumbColor={theme.colors.secondaryBackground}
                                    trackColor={{
                                        false: undefined,
                                        true: theme.colors.textSecondary,
                                    }}
                                    value={draft.useCustomRate}
                                    onValueChange={(useCustomRate) =>
                                        patchDraft({ useCustomRate })
                                    }
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
                            onChangeText={(description) => patchDraft({ description })}
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