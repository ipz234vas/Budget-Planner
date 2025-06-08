import styled from "styled-components/native";

export const CategoryName = styled.Text`
    flex: 1;
    margin-left: ${({ theme }) => theme.spacing.m}px;
    font-size: ${({ theme }) => theme.fontSizes.m}px;
    color: ${({ theme }) => theme.colors.textPrimary};
`;