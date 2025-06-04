import React, { useEffect, useState } from "react";
import { Dimensions, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { IconPicker } from "./IconPicker";
import { ICON_CATEGORIES } from "../constants/iconCategories";
import { IconItem } from "../types/icon";
import { ColorWheel } from "./ColorWheel";
import { IconRenderer } from "./IconRenderer";
import {
    ModalContainer,
    Header,
    Title,
    IconBtn,
    PreviewBlock,
    IconPreviewCircle,
    BottomContent,
    WheelWrapper
} from "../../styles/components/IconColorPickerModalStyles";
import { useTheme } from "styled-components/native";

interface IconColorPickerModalProps {
    visible: boolean;
    initialColor?: string;
    initialIcon?: IconItem | undefined;
    onClose: () => void;
    onSave: (color: string, icon: IconItem | undefined) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const WHEEL_SIZE = Math.min(screenWidth - 48, screenHeight * 0.4 - 80);

export const IconColorPickerModal: React.FC<IconColorPickerModalProps> = ({
                                                                              visible,
                                                                              initialColor = "#3399ff",
                                                                              initialIcon,
                                                                              onClose,
                                                                              onSave
                                                                          }) => {
    const [previewColor, setPreviewColor] = useState(initialColor);
    const [selectedIcon, setSelectedIcon] = useState<IconItem | undefined>(initialIcon);

    const theme = useTheme();

    useEffect(() => {
        setPreviewColor(initialColor);
        setSelectedIcon(initialIcon);
    }, [visible, initialColor, initialIcon]);

    const handleConfirm = () => {
        onSave(previewColor, selectedIcon);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <ModalContainer>
                <Header>
                    <IconBtn onPress={onClose}>
                        <MaterialIcons name="close" size={28} color={theme.colors.textSecondary}/>
                    </IconBtn>
                    <Title>Оберіть колір</Title>
                    <IconBtn onPress={handleConfirm}>
                        <MaterialIcons name="check" size={28} color={theme.colors.textSecondary}/>
                    </IconBtn>
                </Header>

                <PreviewBlock>
                    <IconPreviewCircle $bg={previewColor}>
                        <IconRenderer icon={selectedIcon} size={36} color="#fff"/>
                    </IconPreviewCircle>
                </PreviewBlock>

                <WheelWrapper>
                    <ColorWheel color={previewColor} onColorChange={setPreviewColor} size={WHEEL_SIZE}/>
                </WheelWrapper>

                <BottomContent>
                    <IconPicker
                        categories={ICON_CATEGORIES}
                        onSelect={setSelectedIcon}
                        selectedIcon={selectedIcon}
                    />
                </BottomContent>
            </ModalContainer>
        </Modal>
    );
};