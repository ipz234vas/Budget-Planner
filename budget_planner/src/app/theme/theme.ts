import { DefaultTheme } from "styled-components/native";

const base = {
    spacing: { xs: 4, s: 8, m: 16, l: 24, xl: 32 },
    fontSizes: { s: 14, m: 16, l: 20, xl: 24 },
    borderRadius: { s: 8, m: 16, l: 24 },
    fontWeights: { regular: "400", bold: "700", semibold: "600" },
};

export const lightTheme: DefaultTheme = {
    ...base,
    colors: {
        background: "#FFFFFF",
        secondaryBackground: "#f9f9f9",
        textPrimary: "#222222",
        textSecondary: "#555555",
        primary: "#3671E9",
        secondary: "#70a1ff",
        positive: "green",
        negative: "#d9534f",
        border: "#e6eaf1",
    },
};

export const darkTheme: DefaultTheme = {
    ...base,
    colors: {
        background: "#1e1e1e",
        secondaryBackground: "#272626",
        textPrimary: "#f5f5f5",
        textSecondary: "#cccccc",
        primary: "#4a90e2",
        secondary: "#7fb3ff",
        positive: "green",
        negative: "#d9534f",
        border: "#3c3c3c",
    },
};
