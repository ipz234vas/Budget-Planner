import { createContext } from "react";
import { ThemeType } from "../../shared/types/theme";

export interface AppThemeContext {
    theme: ThemeType;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<AppThemeContext>({
    theme: "light",
    toggleTheme: () => {
    },
});