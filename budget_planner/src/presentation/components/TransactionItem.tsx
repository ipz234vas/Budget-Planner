import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "styled-components/native";
import { IconRenderer } from "./IconRenderer";
import { TransactionDetails } from "../../domain/interfaces/models/transactions/TransactionDetails";
import { TransactionType } from "../../domain/enums/TransactionType";
import { dbToIconItem } from "../utils/iconDbMapper";
import {
    ItemContainer,
    IconWrapper
} from "../../styles/components/ItemCommonStyles";
import styled from "styled-components/native";

const LabelBlock = styled.View`
    flex: 1;
    margin-left: ${({ theme }) => theme.spacing.m}px;
    justify-content: center;
`;

const CategoryLabel = styled.Text`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ theme }) => theme.fontSizes.m}px;
    font-weight: 600;
`;

const AccountLabel = styled.Text<{ color: string | undefined }>`
    color: ${({ color, theme }) => color ?? theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.fontSizes.s}px;
    margin-top: 1px;
    margin-left: 2px;
`;

const AmountText = styled.Text<{ $color: string }>`
    color: ${({ $color }) => $color};
    font-weight: 700;
    font-size: ${({ theme }) => theme.fontSizes.m}px;
    text-align: right;
`;

const TimeText = styled.Text`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.fontSizes.s}px;
    text-align: right;
    margin-top: 2px;
`;

const IconContainer = styled.View`
    position: relative;
    justify-content: center;
    align-items: center;
`;

const ChildIcon = styled.View<{ $bgColor: string }>`
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background-color: ${({ $bgColor }) => $bgColor};
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    border-width: 2px;
    border-color: ${({ theme }) => theme.colors.background};
`;

interface TransactionItemProps {
    details: TransactionDetails;
    onPress?: () => void;
    onLongPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ details, onPress, onLongPress }) => {
    const [pressed, setPressed] = useState(false);
    const theme = useTheme();

    let mainIcon: { icon?: string; color?: string } = {};
    let childIcon: { icon?: string; color?: string } | undefined;
    let label: string = "";
    let accountName: string = "";
    let accountColor: string | undefined;
    let accountIcon: string | undefined;
    let amountColor = theme.colors.textPrimary;
    let amountPrefix = "";
    let amount = details.transaction.amount;
    let currency = details.transaction.currencyCode;
    let time = details.transaction.time?.slice(0, 5);

    if (details.transaction.type === TransactionType.Expense) {
        mainIcon = details.category?.parent
            ? { icon: details.category.parent.icon!, color: details.category.parent.color }
            : { icon: details.category?.icon, color: details.category?.color };
        childIcon = details.category?.parent
            ? { icon: details.category.icon!, color: details.category.color }
            : undefined;
        label = details.category?.parent
            ? `${details.category.parent.name} • ${details.category.name}`
            : details.category?.name || "";
        accountName = details.fromAccount?.name || "";
        accountColor = details.fromAccount?.color;
        accountIcon = details.fromAccount?.icon;
        amountColor = theme.colors.negative;
        amountPrefix = "-";
    }

    if (details.transaction.type === TransactionType.Income) {
        mainIcon = details.category?.parent
            ? { icon: details.category.parent.icon, color: details.category.parent.color }
            : { icon: details.category!.icon, color: details.category!.color };
        childIcon = details.category?.parent
            ? { icon: details.category.icon!, color: details.category.color }
            : undefined;
        label = details.category?.parent
            ? `${details.category.parent.name} • ${details.category.name}`
            : details.category!.name;
        accountName = details.toAccount?.name || "";
        accountColor = details.toAccount?.color;
        accountIcon = details.toAccount?.icon;
        amountColor = theme.colors.positive;
        amountPrefix = "+";
    }

    if (details.transaction.type === TransactionType.Transfer) {
        mainIcon = details.fromAccount
            ? { icon: details.fromAccount.icon!, color: details.fromAccount.color }
            : {};
        childIcon = details.toAccount
            ? { icon: details.toAccount.icon!, color: details.toAccount.color }
            : undefined;
        label = `${details.fromAccount?.name || ""} → ${details.toAccount?.name || ""}`;
        // Saving — синім
        if (details.toAccount?.type === "saving") {
            amountColor = theme.colors.primary;
        }
    }

    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            onLongPress={onLongPress}
        >
            <ItemContainer $pressed={pressed}>
                <IconContainer>
                    <IconWrapper $bgColor={mainIcon.color ?? "#999"}>
                        <IconRenderer icon={dbToIconItem(mainIcon.icon)} size={24}/>
                        {childIcon && (
                            <ChildIcon $bgColor={childIcon.color ?? "#888"}>
                                <IconRenderer icon={dbToIconItem(childIcon.icon)} size={12}/>
                            </ChildIcon>
                        )}
                    </IconWrapper>
                </IconContainer>
                <LabelBlock>
                    <CategoryLabel>{label}</CategoryLabel>
                    {accountName && (
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                            {accountIcon && (
                                <IconRenderer icon={dbToIconItem(accountIcon)} size={13}
                                              color={accountColor} defaultColor={accountColor} defaultIcon={'wallet'}/>
                            )}
                            <AccountLabel color={accountColor}>{accountName}</AccountLabel>
                        </View>
                    )}
                </LabelBlock>
                <View style={{ minWidth: 70, alignItems: "flex-end" }}>
                    <AmountText $color={amountColor}>
                        {amountPrefix}{amount} {currency}
                    </AmountText>
                    <TimeText>{time}</TimeText>
                </View>
            </ItemContainer>
        </Pressable>
    );
};
