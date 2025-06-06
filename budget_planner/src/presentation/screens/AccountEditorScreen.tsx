import React, { useContext, useState } from "react";
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
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useCurrencyContext } from "../../app/contexts/CurrencyContext";
import { dbToIconItem, iconItemToDb } from "../utils/iconDbMapper";
import DatePicker from "react-native-date-picker";
import { ThemeContext } from "../../app/contexts/ThemeContext";
import { AccountsStackParamList } from "../types/AccountsStackParamList";
import { useCurrencyItems } from "../hooks/currencies/useCurrencyItems";
import { IconItem } from "../types/icon";
import { formatUADate } from "../utils/dateFormatter";
import { useAccountEditor } from "../hooks/accounts/useAccountEditor"; // імпортуй свій хук!

type EditorRoute = RouteProp<AccountsStackParamList, "AccountEditor">;

export default function AccountEditorScreen() {
    const navigation = useNavigation();
    const route = useRoute<EditorRoute>();
    const theme = useTheme();
    const { theme: themeValue } = useContext(ThemeContext);

    const type: AccountType = route.params?.type ?? AccountType.Saving;
    const accountId = route.params?.id;

    const { currencies, loading: loadingCurrencies, currencyCode } = useCurrencyContext();
    const currencyItems = useCurrencyItems(currencies);

    const {
        loading,
        accountDraft,
        setAccountDraft,
        save,
        isEdit,
    } = useAccountEditor({
        id: accountId,
        type,
        defaultCurrencyCode: currencyCode,
    });

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
            goalDeadline: date.toISOString().slice(0, 10),
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
        }));

    const handleConfirm = async () => {
        const ok = await save();
        if (ok) navigation.goBack();
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