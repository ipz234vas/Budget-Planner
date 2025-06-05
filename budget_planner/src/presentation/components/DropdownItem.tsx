import React, { memo } from "react";
import styled, { useTheme } from "styled-components/native";
import { ThemeButtonText } from "../../styles/components/SettingsStyles";

const ItemWrapper = styled.View<{ selected: boolean }>`
    padding: 12px 16px;
    background-color: ${({ theme, selected }) =>
            selected ? theme.colors.secondaryBackground : theme.colors.background};
`;

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
