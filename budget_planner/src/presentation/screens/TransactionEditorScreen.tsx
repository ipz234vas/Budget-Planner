import React, { useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, Switch, TouchableOpacity, View } from "react-native";
import { useTheme } from "styled-components/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
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
import { Account } from "../../domain/models/Account";
import { Category } from "../../domain/models/Category";
import CategoryPickerModal from "../components/CategoryPickerModal";
import { CategoryType } from "../../domain/enums/CategoryType";
import { DropdownItem } from "../components/DropdownItem";
import { AccountType } from "../../domain/enums/AccountType";
import AccountPickerModal from "../components/AccountPickerModal";

export default function TransactionEditorScreen() {
    const nav = useNavigation();
    const theme = useTheme();
    const { theme: themeMode } = useContext(ThemeContext);
    const { convert, getRateToBase, baseCurrency } = useCurrencyConverter();

    const [type, setType] = useState<TransactionType>(TransactionType.Expense);
    const [amount, setAmount] = useState("");
    const [category, setCat] = useState("");
    const [fromAcc, setFrom] = useState<Account | null>();
    const [toAcc, setTo] = useState<Account | null>();
    const [desc, setDesc] = useState("");
    const [dateTime, setDateTime] = useState(new Date());
    const [pickerOpen, setPickerOpen] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [fromAccountModalOpen, setFromAccountModalOpen] = useState(false);
    const [toAccountModalOpen, setToAccountModalOpen] = useState(false);

    const [useCustomRate, setUseCustomRate] = useState(false);
    const [equivBase, setEquivBase] = useState("");
    const [rateCustom, setRateCustom] = useState<number | null>(null);

    const [toAmount, setToAmount] = useState("");

    const showCat = type !== TransactionType.Transfer;
    const showFrom = type !== TransactionType.Income;
    const showTo = type !== TransactionType.Expense;

    const amountCurrency = useMemo(() => (
        type === TransactionType.Income ? toAcc?.currencyCode : fromAcc?.currencyCode
    ), [type, fromAcc, toAcc]);

    useEffect(() => {
        setSelectedCategory(null)
    }, [type]);

    useEffect(() => {
        (async () => {
            if (amount === "" || !amountCurrency) {
                setEquivBase("");
                setToAmount("");
                return;
            }

            const dayUsed = dateTime > new Date() ? new Date() : dateTime;

            if (!useCustomRate) {
                const r = await getRateToBase(amountCurrency, dayUsed.toISOString());
                const baseSum = Number(amount) * r;
                setEquivBase(baseSum.toFixed(2));
                setRateCustom(null);
            } else {
                const amt = Number(amount);
                if (!isNaN(amt) && amt !== 0) {
                    const custom = Number(equivBase) / amt;
                    setRateCustom(custom);
                }
            }

            if (
                showTo &&
                fromAcc?.currencyCode &&
                toAcc?.currencyCode &&
                amount !== ""
            ) {
                const res = await convert(
                    Number(amount),
                    fromAcc.currencyCode,
                    toAcc.currencyCode,
                    dayUsed.toISOString(),
                    rateCustom !== null ? rateCustom : undefined
                );
                setToAmount(res.toFixed(2));
            }
        })();
    }, [
        amount, amountCurrency, useCustomRate, equivBase,
        fromAcc, toAcc, dateTime, rateCustom, showTo
    ]);

    const typeItems = useMemo(() => [
        { label: "Витрата", value: TransactionType.Expense },
        { label: "Дохід", value: TransactionType.Income },
        { label: "Переказ", value: TransactionType.Transfer },
    ], []);

    const formatDate = (d: Date) => d.toLocaleDateString("uk-UA");
    const formatTime = (d: Date) =>
        d.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });

    const onSave = async () => {
        const rate = rateCustom !== null
            ? rateCustom
            : amountCurrency
                ? await getRateToBase(amountCurrency, dateTime.toISOString())
                : 1;

        console.log("SAVE", {
            type, amount, amountCurrency, rate,
            category, fromAcc, toAcc, toAmount, desc, dateTime
        });
        nav.goBack();
    };

    return (
        <View style={{ flex: 1 }}>
            <HeaderContainer>
                <HeaderSide>
                    <HeaderButton onPress={() => nav.goBack()}>
                        <MaterialIcons name="arrow-back-ios-new" size={24} color={theme.colors.textPrimary}/>
                    </HeaderButton>
                </HeaderSide>
                <HeaderTitle>Нова транзакція</HeaderTitle>
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
                            renderItem={(item, selected) => (
                                <DropdownItem item={item} selected={!!selected}/>
                            )}
                            data={typeItems}
                            labelField="label"
                            valueField="value"
                            value={type}
                            placeholder="Оберіть тип"
                            onChange={i => setType(i.value as TransactionType)}
                        />
                    </View>

                    {showCat && (
                        <TouchableOpacity onPress={() => setCategoryModalVisible(true)}>
                            <EditorLabel>Категорія</EditorLabel>
                            <EditorInput editable={false} value={selectedCategory?.name || ""} placeholder="Обрати..."
                                         placeholderTextColor={theme.colors.textSecondary}/>
                        </TouchableOpacity>
                    )}

                    {showFrom && (
                        <TouchableOpacity onPress={() => setFromAccountModalOpen(true)}>
                            <EditorLabel>З рахунку</EditorLabel>
                            <EditorInput
                                editable={false}
                                value={fromAcc?.name}
                                placeholder="Обрати..."
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    )}

                    {showTo && (
                        <TouchableOpacity onPress={() => setToAccountModalOpen(true)}>
                            <EditorLabel>На рахунок</EditorLabel>
                            <EditorInput
                                editable={false}
                                value={toAcc?.name}
                                placeholder="Обрати..."
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    )}

                    <View>
                        <EditorLabel>Сума ({amountCurrency || "валюта не вибрана"})</EditorLabel>
                        <EditorInput
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="0"
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>

                    {amountCurrency && amountCurrency !== baseCurrency && (
                        <>
                            <EditorLabel>≈ У {baseCurrency}</EditorLabel>
                            <EditorInput
                                keyboardType="numeric"
                                editable={useCustomRate}
                                value={equivBase}
                                onChangeText={setEquivBase}
                                placeholder="0"
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                            <View style={{ flexDirection: "row" }}>
                                <Switch thumbColor={theme.colors.secondaryBackground}
                                        trackColor={{ false: undefined, true: theme.colors.textSecondary }}
                                        value={useCustomRate}
                                        onValueChange={setUseCustomRate}/>
                                <EditorLabel style={{ marginLeft: theme.spacing.xs }}>
                                    Власний курс
                                </EditorLabel>
                            </View>
                        </>
                    )}

                    {showTo && fromAcc?.currencyCode && toAcc?.currencyCode
                        && fromAcc.currencyCode !== toAcc.currencyCode && type == TransactionType.Transfer && (
                            <>
                                <EditorLabel>Сума, що надходить ({toAcc.currencyCode})</EditorLabel>
                                <EditorInput editable={false} value={toAmount}
                                             placeholderTextColor={theme.colors.textSecondary}/>
                            </>
                        )}

                    <TouchableOpacity onPress={() => setPickerOpen(true)}>
                        <EditorLabel>Дата та час</EditorLabel>
                        <EditorInput
                            editable={false}
                            value={`${formatDate(dateTime)}  ${formatTime(dateTime)}`}
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </TouchableOpacity>

                    <View>
                        <EditorLabel>Опис</EditorLabel>
                        <EditorInput
                            value={desc}
                            onChangeText={setDesc}
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
                type={type as unknown as CategoryType}
                onClose={() => setCategoryModalVisible(false)}
                onSelect={(cat) => {
                    setSelectedCategory(cat);
                    setCategoryModalVisible(false);
                }}
            />

            <AccountPickerModal
                visible={fromAccountModalOpen}
                onClose={() => setFromAccountModalOpen(false)}
                onSelect={(acc) => {
                    setFrom(acc);
                    setFromAccountModalOpen(false);
                    if (type === TransactionType.Transfer && toAcc?.id === acc.id) setTo(null);
                }}
                excludeId={type === TransactionType.Transfer ? toAcc?.id : undefined}
                initialType={AccountType.Account}
            />

            <AccountPickerModal
                visible={toAccountModalOpen}
                onClose={() => setToAccountModalOpen(false)}
                onSelect={(acc) => {
                    setTo(acc);
                    setToAccountModalOpen(false);
                    if (type === TransactionType.Transfer && fromAcc?.id === acc.id) setFrom(null);
                }}
                excludeId={type === TransactionType.Transfer ? fromAcc?.id : undefined}
                initialType={AccountType.Account}
            />


            <DatePicker
                modal
                open={pickerOpen}
                mode="datetime"
                date={dateTime}
                locale="uk"
                theme={themeMode}
                onConfirm={d => {
                    setPickerOpen(false);
                    setDateTime(d);
                }}
                onCancel={() => setPickerOpen(false)}
                title="Оберіть дату та час"
                confirmText="Готово"
                cancelText="Скасувати"
            />
        </View>
    );
}
