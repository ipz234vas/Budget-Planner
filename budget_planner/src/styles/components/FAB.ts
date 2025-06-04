import styled from "styled-components/native";

export const FAB = styled.TouchableOpacity`
  position: absolute;
  right: ${({ theme }) => theme.spacing.l}px;
  bottom: ${({ theme }) => theme.spacing.xl}px;
  width: 64px;
  height: 64px;
  border-radius: 32px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
  elevation: 6;

  shadow-color: #000;
  shadow-offset: 0px 3px;
  shadow-opacity: 0.2;
  shadow-radius: 6px;
`;
