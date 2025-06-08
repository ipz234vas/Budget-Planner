import React, { useContext } from "react";
import { Container, Label, Row, ThemeButton, ThemeButtonText } from "../../styles/components/SettingsStyles";
import { ThemeContext } from "../../app/contexts/ThemeContext";
import { useCurrencyContext } from "../../app/contexts/CurrencyContext";
import { CurrencyDropdown } from "../components/CurrencyDropdown";
import { View } from "react-native";
import { useCurrencyItems } from "../hooks/currencies/useCurrencyItems";

const SettingsScreen: React.FC = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { currencyCode, setCurrencyCode, currencies, loading } = useCurrencyContext();

    const data = useCurrencyItems(currencies);

    return (
        <Container>
            <Row>
                <Label>Поточна тема</Label>
                <ThemeButton onPress={toggleTheme}>
                    <ThemeButtonText>{theme === "dark" ? "Темна" : "Світла"}</ThemeButtonText>
                </ThemeButton>
            </Row>
            <View style={{ paddingTop: 20, gap: 12 }}>
                <Label>Валюта за замовчуванням</Label>
                <CurrencyDropdown
                    data={data}
                    value={currencyCode ?? ""}
                    onChange={setCurrencyCode}
                    loading={loading}
                />
            </View>
        </Container>
    );
};

export default SettingsScreen;
