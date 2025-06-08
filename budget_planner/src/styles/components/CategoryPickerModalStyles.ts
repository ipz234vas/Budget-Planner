import styled from "styled-components/native";

export const HeaderRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 8px;
`;

export const BackBtn = styled.Pressable`
    padding: 10px;
    margin-right: 6px;
`;
export const BackIcon = styled.Text`
    font-size: 20px;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

export const BreadcrumbRow = styled.View`
    flex-direction: row;
    flex: 1;
    align-items: center;
`;

export const Crumb = styled.Pressable`
    flex-direction: row;
    align-items: center;
`;
export const CrumbText = styled.Text`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 16px;
    font-weight: 500;
    margin-horizontal: 2px;
`;
export const CrumbArrow = styled.Text`
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-horizontal: 2px;
`;