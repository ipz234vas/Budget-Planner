import styled from "styled-components/native";

export const ItemWrapper = styled.View<{ selected: boolean }>`
    padding: 12px 16px;
    background-color: ${({ theme, selected }) =>
    selected ? theme.colors.secondaryBackground : theme.colors.background};
`;