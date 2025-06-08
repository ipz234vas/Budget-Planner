import React, { useState } from "react";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Account } from "../../../domain/models/Account";
import { dbToIconItem } from "../../utils/iconDbMapper";
import { IconRenderer } from "../icon/IconRenderer";
import {
    AccountBalance,
    AccountName,
    DeadlineText,
    GoalBlock,
    RightBlock,
    TextBlock
} from "../../../styles/components/account/AccountItemStyles";
import { useTheme } from "styled-components/native";
import { DeleteButton, IconWrapper, ItemContainer } from "../../../styles/components/universal/ItemCommonStyles";
import { AccountType } from "../../../domain/enums/AccountType";
import { formatUADate } from "../../utils/dateFormatter";

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

    const isSaving = account.type === AccountType.Saving;
    const hasGoal = isSaving && !!account.goalAmount && !!account.currencyCode;
    const isGoalReached = hasGoal && account.currentAmount >= (account.goalAmount ?? 0);

    const goalColor = isGoalReached
        ? theme.colors.positive
        : theme.colors.textPrimary;

    const hasDeadline = isSaving && !!account.goalDeadline;

    let deadlineColor = theme.colors.textSecondary;
    let formattedDeadline = "";
    let isDeadlineExpired = false;
    let isDeadlineReached = false;

    if (hasDeadline) {
        formattedDeadline = formatUADate(account.goalDeadline as string);
        const deadlineDate = new Date(account.goalDeadline as string);
        formattedDeadline = "до " + formatUADate(account.goalDeadline as string);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isGoalReached) {
            isDeadlineReached = true;
            deadlineColor = theme.colors.positive;
        } else if (deadlineDate < today) {
            isDeadlineExpired = true;
            deadlineColor = theme.colors.negative;
        }
    }

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
                    {hasGoal ? (
                        <GoalBlock>
                            <AccountBalance style={{ color: goalColor }}>
                                {account.currentAmount.toFixed(2)} {account.currencyCode} / {account.goalAmount} {account.currencyCode}
                            </AccountBalance>
                        </GoalBlock>
                    ) : (
                        <AccountBalance>
                            {account.currentAmount.toFixed(2)} {account.currencyCode}
                        </AccountBalance>
                    )}
                </TextBlock>

                <RightBlock>
                    {hasDeadline && (
                        <DeadlineText style={{ color: deadlineColor }}>
                            {formattedDeadline}
                        </DeadlineText>
                    )}
                    <DeleteButton onPress={onDelete} hitSlop={10}>
                        <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={24}
                            color={theme.colors.negative}
                        />
                    </DeleteButton>
                </RightBlock>
            </ItemContainer>
        </Pressable>
    );
};