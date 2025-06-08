import styled from "styled-components/native";

export const LabelBlock = styled.View`
    flex: 1;
    margin-left: ${({ theme }) => theme.spacing.m}px;
    justify-content: center;
`;

export const CategoryLabel = styled.Text`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ theme }) => theme.fontSizes.m}px;
    font-weight: 600;
`;

export const AccountLabel = styled.Text<{ color?: string }>`
    color: ${({ color, theme }) => color ?? theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.fontSizes.s}px;
    margin: 1px 0 0 2px;
`;

export const AmountText = styled.Text<{ $color: string }>`
    color: ${({ $color }) => $color};
    font-weight: 700;
    font-size: ${({ theme }) => theme.fontSizes.m}px;
    text-align: right;
`;

export const TimeText = styled.Text`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.fontSizes.s}px;
    text-align: right;
    margin-top: 2px;
`;

export const IconContainer = styled.View`
    position: relative;
    justify-content: center;
    align-items: center;
`;

export const ChildIcon = styled.View<{ $bgColor: string }>`
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background-color: ${({ $bgColor }) => $bgColor};
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    border: 2px solid ${({ theme }) => theme.colors.background};
`;