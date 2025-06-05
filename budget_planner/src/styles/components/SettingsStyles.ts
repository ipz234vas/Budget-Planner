import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
    padding: ${({ theme }) => theme.spacing.m}px;
`;

export const Row = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-vertical: ${({ theme }) => theme.spacing.m}px;
    border-bottom-width: 1px;
    border-color: ${({ theme }) => theme.colors.secondaryBackground};
`;

export const Label = styled.Text`
    font-size: ${({ theme }) => theme.fontSizes.m}px;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ThemeButton = styled.TouchableOpacity`
    padding: 10px 16px;
    border-radius: ${({ theme }) => theme.borderRadius.s}px;
    background-color: ${({ theme }) => theme.colors.secondaryBackground};
`;

export const ThemeButtonText = styled.Text`
    font-size: ${({ theme }) => theme.fontSizes.s}px;
    color: ${({ theme }) => theme.colors.primary};
`;

export const StyledBlock = styled.View`
    margin-top: ${({ theme }) => theme.spacing.m}px;
    gap: 12px;
`;