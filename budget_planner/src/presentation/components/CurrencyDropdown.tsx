import React from "react";
import { Dropdown } from "react-native-element-dropdown";
import { useTheme } from "styled-components/native";
import { ThemeButtonText, StyledBlock } from "../../styles/components/SettingsStyles";
import { DropdownItem } from "./DropdownItem";

export interface CurrencyItem {
    label: string;
    value: string;
}

interface CurrencyDropdownProps {
    value: string;
    onChange: (value: string) => void;
    data: CurrencyItem[];
    loading?: boolean;
    label?: string;
}

export const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
                                                                      value,
                                                                      onChange,
                                                                      data,
                                                                      loading = false,
                                                                      label = "Оберіть валюту"
                                                                  }) => {
    const theme = useTheme();

    if (loading) return <ThemeButtonText>Завантаження…</ThemeButtonText>;

    return (
        <StyledBlock>
            <Dropdown
                data={data}
                search
                autoScroll={false}
                value={value}
                labelField="label"
                valueField="value"
                placeholder={label}
                searchPlaceholder="Пошук..."
                onChange={(item: CurrencyItem) => onChange(item.value)}
                inputSearchStyle={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.fontSizes.m,
                    backgroundColor: theme.colors.secondaryBackground,
                    borderRadius: theme.borderRadius.s,
                    paddingHorizontal: theme.spacing.s,
                    borderColor: theme.colors.border,
                }}
                style={{
                    width: "100%",
                    height: 48,
                    borderColor: theme.colors.border,
                    borderWidth: 1,
                    borderRadius: theme.borderRadius.s,
                    paddingHorizontal: theme.spacing.s,
                    backgroundColor: theme.colors.secondaryBackground,
                }}
                selectedTextStyle={{
                    fontSize: theme.fontSizes.m,
                    color: theme.colors.textPrimary,
                }}
                placeholderStyle={{
                    fontSize: theme.fontSizes.m,
                    color: theme.colors.textSecondary,
                }}
                iconStyle={{
                    width: 20,
                    height: 20,
                    tintColor: theme.colors.textSecondary,
                }}
                containerStyle={{
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.background,
                    borderRadius: theme.borderRadius.s,
                }}
                itemTextStyle={{
                    fontSize: theme.fontSizes.m,
                    color: theme.colors.textPrimary,
                }}
                dropdownPosition="bottom"
                renderItem={(item, selected) => (
                    <DropdownItem item={item} selected={!!selected}/>
                )}
                showsVerticalScrollIndicator
            />
        </StyledBlock>
    );
};
