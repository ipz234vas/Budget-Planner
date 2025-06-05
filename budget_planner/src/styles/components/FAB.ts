import styled from "styled-components/native";
import Animated from "react-native-reanimated";

export const FABWrapper = styled(Animated.View)`
    position: absolute;
    right: ${({ theme }) => theme.spacing.l}px;
    bottom: ${({ theme }) => theme.spacing.xl}px;
`;


export const FAB = styled.TouchableOpacity`
    width: 64px;
    height: 64px;
    border-radius: 32px;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.primary};
    elevation: 4;
`;
