import React from 'react';
import { getIconComponent } from "../../utils/iconHelpers";
import { IconItem } from "../../types/icon";
import { MaterialIcons } from "@expo/vector-icons";

interface IconRendererProps {
    icon: IconItem | undefined;
    size?: number;
    color?: string;
    defaultIcon?: string;
    defaultColor?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
                                                              icon,
                                                              size = 24,
                                                              color = 'white',
                                                              defaultIcon = 'category',
                                                              defaultColor = 'white'
                                                          }) => {
    if (!icon) {
        return <MaterialIcons name={defaultIcon as any} size={size} color={defaultColor}/>;
    }
    const IconComp = getIconComponent(icon.library);
    return <IconComp name={icon.name as any} size={size} color={color}/>;
};