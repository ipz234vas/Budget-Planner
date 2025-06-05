import React, { useContext } from "react";
import { Container, Label, Row, ThemeButton, ThemeButtonText } from "../../styles/components/SettingsStyles";
import { ThemeContext } from "../../app/contexts/ThemeContext";

const SettingsScreen: React.FC = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <Container>
            <Row>
                <Label>Поточна тема</Label>
                <ThemeButton onPress={toggleTheme}>
                    <ThemeButtonText>{theme === "dark" ? "Темна" : "Світла"}</ThemeButtonText>
                </ThemeButton>
            </Row>
        </Container>
    );
};

export default SettingsScreen;
