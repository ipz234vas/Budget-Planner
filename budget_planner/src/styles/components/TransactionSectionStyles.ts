import styled from "styled-components/native";

export const SectionHeaderContainer = styled.View`
    background-color: ${({ theme }) => theme.colors.secondaryBackground};
    border-radius: 8px;
    margin-bottom: 2px;
    padding: 16px 12px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const SectionDate = styled.Text`
    font-weight: bold;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
`;

export const SectionAmount = styled.Text<{ positive: boolean; negative: boolean }>`
    font-weight: bold;
    font-size: 16px;
    color: ${({ theme, positive, negative }) =>
    positive
        ? theme.colors.positive
        : negative
            ? theme.colors.negative
            : theme.colors.textSecondary};
`;
