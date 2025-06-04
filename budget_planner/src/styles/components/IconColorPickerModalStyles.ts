import styled from "styled-components/native";

export const ModalContainer = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 ${({ theme }) => theme.spacing.l}px;
    height: 56px;
    border-bottom-width: 1px;
    border-color: ${({ theme }) => theme.colors.border};
`;

export const Title = styled.Text`
    font-size: ${({ theme }) => theme.fontSizes.l}px;
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.textPrimary};
`;

export const IconBtn = styled.TouchableOpacity`
    padding: ${({ theme }) => theme.spacing.s}px;
    border-radius: ${({ theme }) => theme.borderRadius.m}px;
    justify-content: center;
    align-items: center;
`;

export const PreviewBlock = styled.View`
    align-items: center;
    margin-top: ${({ theme }) => theme.spacing.xl}px;
    margin-bottom: ${({ theme }) => theme.spacing.s}px;
`;

export const IconPreviewCircle = styled.View<{ $bg: string }>`
    width: 68px;
    height: 68px;
    border-radius: 34px;
    background-color: ${({ $bg }) => $bg};
    align-items: center;
    justify-content: center;
    border-width: 3px;
    border-color: ${({ theme }) => theme.colors.border};
    margin-bottom: 2px;
`;

export const WheelWrapper = styled.View`
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.l}px;
`;

export const BottomContent = styled.View`
    flex: 1;
    padding: ${({ theme }) => theme.spacing.s}px;
    padding-top: 0;
    background-color: ${({ theme }) => theme.colors.background};
`;
