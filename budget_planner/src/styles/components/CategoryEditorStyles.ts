import styled from "styled-components/native";

export const SubtitleRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 ${({ theme }) => theme.spacing.m}px;
    margin-top: ${({ theme }) => theme.spacing.s}px;
`;

export const SubTitle = styled.Text`
    font-size: ${({ theme }) => theme.fontSizes.m}px;
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.textPrimary};
`;
