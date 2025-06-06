import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "styled-components/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { IconColorPickerModal } from "../components/IconColorPickerModal";
import { IconRenderer } from "../components/IconRenderer";
import { CurrencyDropdown } from "../components/CurrencyDropdown";
import {
    CategoryInput,
    ColorCircle,
    EditIcon,
    EditorInput,
    EditorLabel,
    FormContainer,
    HeaderButton,
    HeaderContainer,
    HeaderSide,
    HeaderTitle,
    IconWrapper,
    Row,
} from "../../styles/components/EditorCommonStyles";
import { AccountType } from "../../domain/enums/AccountType";
import { Account } from "../../domain/models/Account";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useCurrencyContext } from "../../app/contexts/CurrencyContext";
import { dbToIconItem, iconItemToDb } from "../utils/iconDbMapper";
import DatePicker from "react-native-date-picker";
import { ThemeContext } from "../../app/contexts/ThemeContext";
import { AccountsStackParamList } from "../types/AccountsStackParamList";
import { useCurrencyItems } from "../hooks/currencies/useCurrencyItems";
import { FactoryContext } from "../../app/contexts/FactoryContext";
import { IRepository } from "../../domain/interfaces/repositories/IRepository";
import { IconItem } from "../types/icon";
import { formatUADate } from "../utils/dateFormatter";
import { Snapshot } from "../../domain/models/Snapshot";
import { SnapshotTargetType } from "../../domain/enums/SnapshotTargetType";

type EditorRoute = RouteProp<AccountsStackParamList, "AccountEditor">;

export default function AccountEditorScreen() {
    const factory = useContext(FactoryContext);
    const [repository, setRepository] = useState<IRepository<Account> | null>(null);
    const [snapshotRepository, setSnapshotRepository] = useState<IRepository<Snapshot> | null>(null);

    useEffect(() => {
        if (factory) {
            const repo = factory.getRepository(Account);
            setRepository(repo);

            const snapRepo = factory.getRepository(Snapshot);
            setSnapshotRepository(snapRepo);
        }
    }, [factory]);

    const navigation = useNavigation();
    const route = useRoute<EditorRoute>();
    const theme = useTheme();
    const { theme: themeValue } = useContext(ThemeContext);

    const type: AccountType = route.params?.type ?? AccountType.Saving;
    const accountId = route.params?.id;
    const isEdit = !!accountId;

    const { currencies, loading: loadingCurrencies, currencyCode } = useCurrencyContext();

    const currencyItems = useCurrencyItems(currencies);

    const [loading, setLoading] = useState(true);
    const [accountDraft, setAccountDraft] = useState<Account>(
        new Account({
            name: "",
            type,
            currencyCode: "",
            goalAmount: null,
            goalDeadline: null,
            currentAmount: 0,
            id: accountId,
        })
    );
    const [originalAmount, setOriginalAmount] = useState<number | null>(null);

    useEffect(() => {
        const fetchAccount = async () => {
            if (repository && isEdit && accountId) {
                setLoading(true);
                try {
                    const acc = await repository.getById(accountId);
                    if (acc) {
                        setAccountDraft(acc);
                        setOriginalAmount(acc.currentAmount ?? 0); // тут зберігаємо
                    }
                } catch (error) {
                    console.error("Error loading account:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setOriginalAmount(null); // для нових акаунтів
            }
        };
        fetchAccount();
    }, [repository, isEdit, accountId]);

    useEffect(() => {
        if (currencyCode && !accountDraft.currencyCode) {
            setAccountDraft(prev => ({
                ...prev,
                currencyCode: currencyCode,
            }));
        }
    }, [currencies, currencyCode, isEdit]);

    const [showPicker, setShowPicker] = useState(false);
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    const handleGoalAmountChange = (text: string) => {
        const value = text.replace(/[^0-9.]/g, "");
        setAccountDraft(prev => ({
            ...prev,
            goalAmount: value ? Number(value) : 0,
        }));
    };

    const handleGoalDeadlineChange = (date: Date) => {
        setDatePickerOpen(false);
        setAccountDraft(prev => ({
            ...prev,
            goalDeadline: date.toISOString().slice(0, 10)
        }));
    };

    const handleCurrentAmountChange = (text: string) => {
        const value = text.replace(/[^0-9.]/g, "");
        setAccountDraft(prev => ({
            ...prev,
            currentAmount: value ? Number(value) : 0,
        }));
    };

    const handleIconColorChange = (color: string, icon: IconItem | undefined) =>
        setAccountDraft(prev => ({
            ...prev,
            color,
            icon: iconItemToDb(icon) || prev.icon,
        }))

    const handleConfirm = async () => {
        if (!repository || !snapshotRepository) return;
        try {
            let accountIdAfterSave = accountDraft.id;

            if (isEdit) {
                await repository.update(accountDraft);
            } else {
                accountIdAfterSave = await repository.insert(accountDraft);
            }

            const amountChanged = !isEdit || originalAmount !== accountDraft.currentAmount;

            if (amountChanged && accountIdAfterSave) {
                const today = new Date().toISOString();

                const snapshot = new Snapshot({
                    targetType: SnapshotTargetType.Account,
                    targetId: accountIdAfterSave,
                    amount: accountDraft.currentAmount,
                    date: today
                });

                await snapshotRepository.insert(snapshot);
            }

            navigation.goBack();
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    if (loading) {
        return (
            <View style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }}>
                <EditorLabel>Завантаження...</EditorLabel>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <HeaderContainer>
                <HeaderSide>
                    <HeaderButton onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back-ios-new" size={24} color={theme.colors.textPrimary}/>
                    </HeaderButton>
                </HeaderSide>

                <HeaderTitle>
                    {type === AccountType.Saving
                        ? isEdit ? "Редагування банки" : "Нова банка"
                        : isEdit ? "Редагування рахунку" : "Новий рахунок"}
                </HeaderTitle>

                <HeaderSide style={{ justifyContent: "flex-end" }}>
                    <HeaderButton onPress={handleConfirm}>
                        <MaterialCommunityIcons name="content-save" size={28} color={theme.colors.positive}/>
                    </HeaderButton>
                </HeaderSide>
            </HeaderContainer>
            <Row>
                <CategoryInput
                    value={accountDraft.name}
                    onChangeText={text => setAccountDraft(prev => ({ ...prev, name: text }))}
                    placeholder={type === AccountType.Saving ? "Назва банки" : "Назва рахунку"}
                    placeholderTextColor={theme.colors.textSecondary}
                />
                <IconWrapper>
                    <ColorCircle $color={accountDraft.color}>
                        <IconRenderer icon={dbToIconItem(accountDraft.icon)} size={24} color="#fff"/>
                    </ColorCircle>
                    <TouchableOpacity onPress={() => setShowPicker(true)}>
                        <EditIcon name="edit" size={16} color={theme.colors.textPrimary}/>
                    </TouchableOpacity>
                </IconWrapper>
            </Row>
            <FormContainer>
                <View>
                    <EditorLabel>Валюта</EditorLabel>
                    <CurrencyDropdown
                        value={accountDraft.currencyCode || currencyCode || ''}
                        onChange={currencyCode =>
                            setAccountDraft(prev => ({ ...prev, currencyCode }))
                        }
                        data={currencyItems}
                        loading={loadingCurrencies}
                    />
                </View>

                <View>
                    <EditorLabel>Поточний баланс</EditorLabel>
                    <EditorInput
                        keyboardType="numeric"
                        value={accountDraft.currentAmount ? String(accountDraft.currentAmount) : ""}
                        onChangeText={handleCurrentAmountChange}
                        placeholder="0"
                        placeholderTextColor={theme.colors.textSecondary}
                    />
                </View>

                {type === AccountType.Saving && (
                    <>
                        <View>
                            <EditorLabel>Ціль</EditorLabel>
                            <EditorInput
                                keyboardType="numeric"
                                value={accountDraft.goalAmount ? String(accountDraft.goalAmount) : ""}
                                onChangeText={handleGoalAmountChange}
                                placeholder="0"
                                placeholderTextColor={theme.colors.textSecondary}
                            />
                        </View>
                        <View>
                            <EditorLabel>Дедлайн</EditorLabel>
                            <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
                                <EditorInput
                                    value={formatUADate(accountDraft.goalDeadline ?? "")}
                                    editable={false}
                                    pointerEvents="none"
                                    placeholder="рррр-мм-дд"
                                    placeholderTextColor={theme.colors.textSecondary}
                                />
                            </TouchableOpacity>
                            <DatePicker
                                modal
                                open={datePickerOpen}
                                date={accountDraft.goalDeadline ? new Date(accountDraft.goalDeadline) : new Date()}
                                mode="date"
                                locale="uk"
                                theme={themeValue}
                                onConfirm={handleGoalDeadlineChange}
                                onCancel={() => setDatePickerOpen(false)}
                                title="Оберіть дату"
                                confirmText="Готово"
                                cancelText="Скасувати"
                            />
                        </View>

                    </>
                )}
            </FormContainer>

            <IconColorPickerModal
                visible={showPicker}
                initialColor={accountDraft.color}
                initialIcon={dbToIconItem(accountDraft.icon)}
                onClose={() => setShowPicker(false)}
                onSave={handleIconColorChange}
            />
        </View>
    );
}