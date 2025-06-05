import "styled-components/native";

declare module "styled-components/native" {
    export interface DefaultTheme {
        colors: {
            background: string;
            secondaryBackground: string;
            textPrimary: string;
            textSecondary: string;
            primary: string;
            secondary: string;
            negative: string;
            positive: string;
            border: string;
        };
        spacing: {
            xs: number;
            s: number;
            m: number;
            l: number;
            xl: number;
        };
        fontSizes: {
            xs: number,
            s: number;
            m: number;
            l: number;
            xl: number;
        };
        borderRadius: {
            s: number;
            m: number;
            l: number;
        };
        fontWeights: {
            regular: string;
            bold: string;
            semibold: string;
        };
    }
}
