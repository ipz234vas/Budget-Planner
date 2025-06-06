import React, { useContext, useMemo, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useTheme } from "styled-components/native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { IconColorPickerModal } from "../components/IconColorPickerModal";
import { IconRenderer } from "../components/IconRenderer";
import { CurrencyDropdown } from "../components/CurrencyDropdown";
import {
    HeaderContainer,
    HeaderSide,
    HeaderTitle,
    HeaderButton,
    Row,
    CategoryInput,
    IconWrapper,
    ColorCircle,
    EditIcon, FormContainer, EditorLabel, EditorInput,
} from "../../styles/components/EditorCommonStyles";
import { AccountType } from "../../domain/enums/AccountType";
import { Account } from "../../domain/models/Account";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useCurrencyContext } from "../../app/contexts/CurrencyContext";
import { dbToIconItem, iconItemToDb } from "../utils/iconDbMapper";
import DatePicker from "react-native-date-picker";
import { ThemeContext } from "../../app/contexts/ThemeContext";

type AccountEditorScreenRouteProp = RouteProp<any, any>;

export default function AccountEditorScreen() {
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const { theme: themeValue } = useContext(ThemeContext);
    const route = useRoute<AccountEditorScreenRouteProp>();
    const navigation = useNavigation();
    const theme = useTheme();

    const type: AccountType = route.params?.type ?? AccountType.Saving;
    const isEdit = !!route.params?.id;

    const { currencies, loading: loadingCurrencies, currencyCode } = useCurrencyContext();

    const currencyItems = useMemo(
        () =>
            currencies.map((cur) => ({
                label: `${cur.name} (${cur.code})`,
                value: cur.code,
            })),
        [currencies]
    );

    const [accountDraft, setAccountDraft] = useState<Account>(new Account({
        name: "",
        type,
        currencyCode: "",
        goalAmount: null,
        goalDeadline: null,
        currentAmount: 0
    }));

    const [showPicker, setShowPicker] = useState(false);

    const handleGoalAmountChange = (text: string) => {
        const value = text.replace(/[^0-9.]/g, "");
        setAccountDraft(prev => ({
            ...prev,
            goalAmount: value ? Number(value) : null,
        }));
    };

    const handleGoalDeadlineChange = (text: string) => {
        setAccountDraft(prev => ({
            ...prev,
            goalDeadline: text ? text : null,
        }));
    };

    const handleCurrentAmountChange = (text: string) => {
        const value = text.replace(/[^0-9.]/g, "");
        setAccountDraft(prev => ({
            ...prev,
            currentAmount: value ? Number(value) : 0,
        }));
    };

    function formatUADate(iso: string | null) {
        if (!iso)
            return "";
        const date = new Date(iso);
        if (isNaN(date.getTime()))
            return "";

        return date.toLocaleDateString("uk-UA", { year: "numeric", month: "long", day: "numeric" });
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
                    <HeaderButton onPress={() => {/* тут буде save */
                    }}>
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
                        label=""
                    />
                </View>

                <View>
                    <EditorLabel>Поточний баланс</EditorLabel>
                    <EditorInput
                        keyboardType="numeric"
                        value={accountDraft.currentAmount !== null ? String(accountDraft.currentAmount) : ""}
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
                                value={accountDraft.goalAmount !== null ? String(accountDraft.goalAmount) : ""}
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
                                onConfirm={(selectedDate) => {
                                    setDatePickerOpen(false);
                                    setAccountDraft(prev => ({
                                        ...prev,
                                        goalDeadline: selectedDate.toISOString().slice(0, 10) // YYYY-MM-DD
                                    }));
                                }}
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
                onSave={(color, icon) =>
                    setAccountDraft(prev => ({
                        ...prev,
                        color,
                        icon: iconItemToDb(icon) || prev.icon,
                    }))
                }
            />
        </View>
    );
}