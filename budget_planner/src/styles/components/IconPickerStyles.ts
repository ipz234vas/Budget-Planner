import styled from "styled-components/native";

export const CategoryWrapper = styled.View`
  margin-bottom: 28px;
`;

export const CategoryLabel = styled.Text`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.l}px;
  margin-bottom: ${({ theme }) => theme.spacing.m}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const IconsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const IconButton = styled.TouchableOpacity<{ $selected: boolean }>`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  justify-content: center;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.s}px;
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.secondary : theme.colors.background};
  border-width: ${({ $selected }) => ($selected ? 2 : 0)}px;
  border-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : "transparent"};
`;
