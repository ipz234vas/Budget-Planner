import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "styled-components/native";

import { TransactionDetails } from "../../domain/interfaces/models/transactions/TransactionDetails";
import { TransactionType } from "../../domain/enums/TransactionType";
import { IconRenderer } from "./IconRenderer";
import { dbToIconItem } from "../utils/iconDbMapper";
import { ItemContainer, IconWrapper } from "../../styles/components/ItemCommonStyles";
import {
    AccountLabel, AmountText,
    CategoryLabel,
    ChildIcon,
    IconContainer,
    LabelBlock, TimeText
} from "../../styles/components/TransactionItemStyles";

const rootAndChild = (details: TransactionDetails) => {
    if (!details.category)
        return { main: {}, child: undefined, label: "" };

    const { category } = details;
    const root = category.root ?? category;
    const childNeeded = root.id !== category.id;

    return {
        main: { icon: root.icon, color: root.color },
        child: childNeeded ? { icon: category.icon, color: category.color } : undefined,
        label: childNeeded ? `${root.name} • ${category.name}` : category.name,
    };
};

type ViewModel = {
    mainIcon: { icon?: string; color?: string };
    childIcon?: { icon?: string; color?: string };
    label: string;
    accountName?: string;
    accountColor?: string;
    accountIcon?: string;
    amountPrefix: string;
    amountColor: string;
};

const pickAccount = (details: TransactionDetails) => {
    switch (details.transaction.type) {
        case TransactionType.Expense:
            return details.fromAccount;
        case TransactionType.Income:
            return details.toAccount;
        default:
            return undefined;
    }
};

const buildViewModel = (d: TransactionDetails, theme: any): ViewModel => {
    const acct = pickAccount(d);          // ← одна змінна, звідси все тягнемо
    const base = {
        accountName: acct?.name,
        accountColor: acct?.color,
        accountIcon: acct?.icon,
        amountPrefix: "",
        amountColor: theme.colors.textPrimary,
        label: "",
        mainIcon: {},
    } as ViewModel;

    switch (d.transaction.type) {
        case TransactionType.Expense: {
            const { main, child, label } = rootAndChild(d);
            return {
                ...base,
                mainIcon: main,
                childIcon: child,
                label,
                amountPrefix: "-",
                amountColor: theme.colors.negative,
            };
        }

        case TransactionType.Income: {
            const { main, child, label } = rootAndChild(d);
            return {
                ...base,
                mainIcon: main,
                childIcon: child,
                label,
                amountPrefix: "+",
                amountColor: theme.colors.positive,
            };
        }

        case TransactionType.Transfer: {
            const main = d.fromAccount
                ? { icon: d.fromAccount.icon, color: d.fromAccount.color } : {};
            const child = d.toAccount
                ? { icon: d.toAccount.icon, color: d.toAccount.color }
                : undefined;

            return {
                ...base,
                mainIcon: main,
                childIcon: child,
                label: `${d.fromAccount?.name || ""} → ${d.toAccount?.name || ""}`,
                amountColor:
                    d.toAccount?.type === "saving"
                        ? theme.colors.primary
                        : base.amountColor,
            };
        }

        default:
            return base;
    }
};

interface Props {
    details: TransactionDetails;
    onPress?: () => void;
    onLongPress?: () => void;
}

export const TransactionItem: React.FC<Props> = ({
                                                     details,
                                                     onPress,
                                                     onLongPress,
                                                 }) => {
    const [pressed, setPressed] = useState(false);
    const theme = useTheme();
    const vm = buildViewModel(details, theme);

    const amount = details.transaction.amount;
    const currency = details.transaction.currencyCode;
    const time = details.transaction.time?.slice(0, 5);

    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            onLongPress={onLongPress}
        >
            <ItemContainer $pressed={pressed}>
                <IconContainer>
                    <IconWrapper $bgColor={vm.mainIcon.color ?? "#999"}>
                        <IconRenderer icon={dbToIconItem(vm.mainIcon.icon)} size={24}/>
                        {vm.childIcon && (
                            <ChildIcon $bgColor={vm.childIcon.color ?? "#888"}>
                                <IconRenderer
                                    icon={dbToIconItem(vm.childIcon.icon)}
                                    size={12}
                                />
                            </ChildIcon>
                        )}
                    </IconWrapper>
                </IconContainer>

                <LabelBlock>
                    <CategoryLabel>{vm.label}</CategoryLabel>

                    {vm.accountName && (
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                            {vm.accountIcon && (
                                <IconRenderer
                                    icon={dbToIconItem(vm.accountIcon)}
                                    size={13}
                                    color={vm.accountColor}
                                    defaultColor={vm.accountColor}
                                    defaultIcon="wallet"
                                />
                            )}
                            <AccountLabel color={vm.accountColor}>{vm.accountName}</AccountLabel>
                        </View>
                    )}
                </LabelBlock>

                <View style={{ minWidth: 70, alignItems: "flex-end" }}>
                    <AmountText $color={vm.amountColor}>
                        {vm.amountPrefix}
                        {amount} {currency}
                    </AmountText>
                    <TimeText>{time}</TimeText>
                </View>
            </ItemContainer>
        </Pressable>
    );
};
