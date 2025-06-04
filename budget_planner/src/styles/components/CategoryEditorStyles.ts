import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.s}px;
  height: 56px;
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const HeaderSide = styled.View`
  flex-direction: row;
  align-items: center;
  min-width: 56px;
  justify-content: flex-start;
`;

export const HeaderTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.l}px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  flex: 1;
`;

export const HeaderButton = styled.TouchableOpacity`
  padding: ${({ theme }) => theme.spacing.s}px;
  border-radius: ${({ theme }) => theme.borderRadius.m}px;
  justify-content: center;
  align-items: center;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.m}px;
`;

export const CategoryInput = styled.TextInput`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.m}px;
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding-vertical: ${({ theme }) => theme.spacing.s}px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const IconWrapper = styled.View`
  margin-left: ${({ theme }) => theme.spacing.m}px;
  position: relative;
`;

export const ColorCircle = styled.View<{ $color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${({ $color }) => $color || "#ccc"};
  justify-content: center;
  align-items: center;
`;

export const EditIcon = styled(MaterialIcons)`
  position: absolute;
  bottom: -4px;
  right: -4px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 2px;
`;

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
