import styled from "styled-components/native";
import {SafeAreaView} from "react-native-safe-area-context";

export const ScreenContainer = styled(SafeAreaView)`
    flex: 1;
    background-color: ${({theme}) => theme.colors.background};
`;