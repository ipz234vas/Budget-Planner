import styled from "styled-components/native";

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

export const GoalBlock = styled.View`
    margin-top: 2px;
`;

export const GoalText = styled.Text`
    font-size: ${({ theme }) => theme.fontSizes.s}px;
    font-weight: 500;
`;

export const DeadlineText = styled.Text`
    font-size: ${({ theme }) => theme.fontSizes.s}px;
    margin-bottom: 2px;
    text-align: right;
`;

export const RightBlock = styled.View`
    align-items: flex-end;
    justify-content: center;
    margin-left: ${({ theme }) => theme.spacing.m}px;
    min-width: 68px;
`;
