import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "styled-components/native";
import { TransactionDetails } from "../../domain/interfaces/models/transactions/TransactionDetails";
import { IconRenderer } from "./IconRenderer";
import { dbToIconItem } from "../utils/iconDbMapper";
import { ItemContainer, IconWrapper } from "../../styles/components/ItemCommonStyles";
import {
    AccountLabel, AmountText, CategoryLabel, ChildIcon, IconContainer, LabelBlock, TimeText
} from "../../styles/components/TransactionItemStyles";
import { getTransactionItemViewModel } from "../utils/transactionItem/getTransactionItemViewModel";

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
    const vm = getTransactionItemViewModel(details, theme);

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