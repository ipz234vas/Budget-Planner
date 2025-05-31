import styled from "styled-components/native";
import {SafeAreaView} from "react-native-safe-area-context";

export const Container = styled(SafeAreaView)`
    flex: 1;
    padding: 20px;
    background-color: ${props => props.theme['BACKGROUND_COLOR']};
`

export const ThemeText = styled.Text`
    color: ${props => props.theme['TEXT_COLOR']};
`

export const ThemeMutedText = styled (ThemeText)`
    color: ${props => props.theme['SECONDARY_COLOR']};
`