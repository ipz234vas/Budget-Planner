import React, { useState } from "react";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Account } from "../../domain/models/Account";
import { dbToIconItem } from "../utils/iconDbMapper";
import { IconRenderer } from "./IconRenderer";
import {
    ItemContainer,
    IconWrapper,
    DeleteButton,
    TextBlock,
    AccountName,
    AccountBalance
} from "../../styles/components/AccountItemStyles";
import { useTheme } from "styled-components/native";

interface AccountItemProps {
    account: Account;
    onPress?: () => void;
    onDelete?: () => void;
}

export const AccountItem: React.FC<AccountItemProps> = ({
                                                            account,
                                                            onPress,
                                                            onDelete,
                                                        }) => {
    const [pressed, setPressed] = useState(false);
    const theme = useTheme();

    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
        >
            <ItemContainer $pressed={pressed}>
                <IconWrapper $bgColor={account.color ?? "#999"}>
                    <IconRenderer
                        icon={dbToIconItem(account.icon)}
                        size={24}
                        color="white"
                    />
                </IconWrapper>

                <TextBlock>
                    <AccountName>{account.name}</AccountName>
                    <AccountBalance>
                        {account.currentAmount.toFixed(2)} {account.currencyCode}
                    </AccountBalance>
                </TextBlock>

                <DeleteButton onPress={onDelete} hitSlop={10}>
                    <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={24}
                        color={theme.colors.negative}
                    />
                </DeleteButton>
            </ItemContainer>
        </Pressable>
    );
};
