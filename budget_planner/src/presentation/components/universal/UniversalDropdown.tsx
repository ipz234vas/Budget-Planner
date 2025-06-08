import React from "react";
import { Dropdown } from "react-native-element-dropdown";
import { useTheme } from "styled-components/native";

interface UniversalDropdownProps<T> {
    value: string | number;
    onChange: (item: T) => void;
    data: T[];
    labelField: keyof T;
    valueField: keyof T;
    placeholder?: string;
    search?: boolean;
    searchPlaceholder?: string;
    renderItem?: (item: any, selected?: boolean) => React.ReactElement;
    disable?: boolean;
    autoScroll?: boolean
}

export function UniversalDropdown<T>({
                                         value,
                                         onChange,
                                         data,
                                         labelField,
                                         valueField,
                                         placeholder = "Оберіть...",
                                         search = false,
                                         searchPlaceholder = "Пошук...",
                                         renderItem,
                                         disable = false,
                                         autoScroll = false
                                     }: UniversalDropdownProps<T>) {
    const theme = useTheme();

    return (
        <Dropdown
            data={data}
            value={value}
            labelField={labelField as string}
            valueField={valueField as string}
            placeholder={placeholder}
            search={search}
            searchPlaceholder={searchPlaceholder}
            onChange={onChange}
            disable={disable}
            autoScroll={autoScroll}
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
                borderColor: theme.colors.border,
                borderWidth: 1,
                borderRadius: theme.borderRadius.s,
                paddingHorizontal: theme.spacing.s,
                paddingVertical: theme.spacing.m,
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
            renderItem={renderItem}
            showsVerticalScrollIndicator
        />
    );
}
