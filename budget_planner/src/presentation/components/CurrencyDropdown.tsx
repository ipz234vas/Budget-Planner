import React from "react";
import { ThemeButtonText } from "../../styles/components/SettingsStyles";
import { DropdownItem } from "./DropdownItem";
import { UniversalDropdown } from "./UniversalDropdown"; // шлях підкоригуй під себе

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
    if (loading) return <ThemeButtonText>Завантаження…</ThemeButtonText>;

    return (
        <UniversalDropdown<CurrencyItem>
            value={value}
            onChange={(item) => onChange(item.value)}
            data={data}
            labelField="label"
            valueField="value"
            placeholder={label}
            search={true}
            searchPlaceholder="Пошук..."
            renderItem={(item, selected) => (
                <DropdownItem item={item} selected={!!selected}/>
            )}
        />
    );
};