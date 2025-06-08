import styled from "styled-components/native";

export const Overlay = styled.Pressable`
    flex: 1;
    background: rgba(0, 0, 0, 0.37);
    justify-content: flex-end;
`;

export const Sheet = styled.View`
    flex: 1;
    background: ${({ theme }) => theme.colors.background};
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    padding: ${({ theme }) => theme.spacing.m}px;
    min-height: 220px;
    elevation: 12;
`;

export const Tabs = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 8px;
`;

export const TabButton = styled.Pressable<{ $active: boolean }>`
    padding: 8px 18px;
    background: ${({ $active, theme }) => $active ? theme.colors.primary : "transparent"};
    border-radius: ${({ theme }) => theme.borderRadius.s}px;
    margin-right: 8px;
`;

export const TabText = styled.Text<{ $active: boolean }>`
    font-weight: 600;
    color: ${({ $active, theme }) => $active ? "#fff" : theme.colors.textPrimary};
    font-size: 16px;
`;

export const CloseBtn = styled.Pressable`
    padding: 8px;
    margin-left: auto;
`;
export const CloseText = styled.Text`
    font-size: 20px;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Tile = styled.Pressable<{ $selected?: boolean }>`
    flex-direction: row;
    align-items: center;
    border-radius: ${({ theme }) => theme.borderRadius.m}px;
    background: ${({ theme, $selected }) => $selected ? theme.colors.primary : theme.colors.secondaryBackground};
    padding: ${({ theme }) => theme.spacing.s + 6}px;
    margin-vertical: 3px;
    margin-horizontal: 0;
    border-width: ${({ $selected }) => ($selected ? "2px" : "0px")};
    border-color: ${({ theme, $selected }) => ($selected ? theme.colors.primary : "transparent")};
`;

export const IconWrap = styled.View<{ $bgColor: string }>`
    padding: 10px;
    border-radius: 12px;
    background: ${({ $bgColor }) => $bgColor};
    justify-content: center;
    align-items: center;
`;

export const TileLabel = styled.Text`
    flex: 1;
    margin-left: ${({ theme }) => theme.spacing.m}px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ theme }) => theme.fontSizes.s + 2}px;
    font-weight: 500;
`;

export const TileAmount = styled.Text`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.fontSizes.s}px;
    margin-left: 8px;
    min-width: 70px;
    text-align: right;
`;

export const ConfirmRow = styled.View`
    margin-top: 12px;
    margin-bottom: 2px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const SelectedText = styled.Text`
    flex: 1;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-right: ${({ theme }) => theme.spacing.s}px;
`;

export const ConfirmBtn = styled.Pressable`
    padding: ${({ theme }) => theme.spacing.s}px ${({ theme }) => theme.spacing.m}px;
    background: ${({ theme }) => theme.colors.positive};
    border-radius: ${({ theme }) => theme.borderRadius.s}px;
`;

export const ConfirmText = styled.Text`
    color: #fff;
    font-weight: 600;
`;

export const Center = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    min-height: 120px;
`;

export const Loading = styled.ActivityIndicator``;