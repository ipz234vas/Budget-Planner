import React, { memo } from "react";
import styled, { useTheme } from "styled-components/native";
import { ThemeButtonText } from "../../../styles/components/settings/SettingsStyles";
import { ItemWrapper } from "../../../styles/components/universal/DropDownItemStyles";

interface DropdownItemProps {
    item: { label: string; value: string };
    selected: boolean;
}

export const DropdownItem: React.FC<DropdownItemProps> = memo(({ item, selected }) => {
    const theme = useTheme();
    return (
        <ItemWrapper selected={selected}>
            <ThemeButtonText style={{ color: selected ? theme.colors.primary : theme.colors.textPrimary }}>
                {item.label}
            </ThemeButtonText>
        </ItemWrapper>
    );
});
