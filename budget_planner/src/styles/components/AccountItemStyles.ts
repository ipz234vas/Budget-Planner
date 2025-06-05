import styled from "styled-components/native";

interface ItemContainerProps {
    $pressed: boolean;
}

interface IconWrapperProps {
    $bgColor: string;
}

export const ItemContainer = styled.View<ItemContainerProps>`
    flex-direction: row;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.s + 4}px ${({ theme }) => theme.spacing.m}px;
    background-color: ${({ $pressed, theme }) =>
    $pressed ? theme.colors.background : theme.colors.secondaryBackground};
    border-radius: ${({ theme }) => theme.borderRadius.l}px;
    margin-vertical: 6px;
    elevation: ${({ $pressed }) => ($pressed ? 1 : 2)};
    transform: ${({ $pressed }) => ($pressed ? "scale(0.98)" : "scale(1)")};
`;

export const IconWrapper = styled.View<IconWrapperProps>`
    background-color: ${({ $bgColor }) => $bgColor};
    padding: 10px;
    border-radius: 12px;
    justify-content: center;
    align-items: center;
`;

export const TextBlock = styled.View`
    flex: 1;
    margin-left: ${({ theme }) => theme.spacing.m}px;
`;

export const AccountName = styled.Text`
    font-size: ${({ theme }) => theme.fontSizes.m}px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 600;
`;

export const AccountBalance = styled.Text`
    font-size: ${({ theme }) => theme.fontSizes.s}px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-top: 2px;
`;

export const DeleteButton = styled.TouchableOpacity`
    padding: 4px;
`;
