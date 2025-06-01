import React, { useEffect, useState } from "react";
import { Modal, Dimensions, View } from "react-native";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import ColorPicker from "react-native-wheel-color-picker";
import { IconPicker } from "./IconPicker";
import { ICON_CATEGORIES } from "../constants/iconCategories";
import { IconItem } from "../types/icon";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const WHEEL_SIZE = Math.min(screenWidth - 48, screenHeight * 0.4 - 80);

const ModalContainer = styled.View`
    flex: 1;
    background: #fff;
`;

const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    height: 56px;
    border-bottom-width: 1px;
    border-color: #eee;
`;

const Title = styled.Text`
    font-size: 20px;
    font-weight: 600;
    color: #222;
`;

const IconBtn = styled.TouchableOpacity`
    padding: 8px;
    border-radius: 16px;
    justify-content: center;
    align-items: center;
`;

const PreviewBlock = styled.View`
    align-items: center;
    margin-top: 24px;
    margin-bottom: 8px;
`;

const IconPreviewCircle = styled.View<{ bg: string }>`
    width: 68px;
    height: 68px;
    border-radius: 34px;
    background: ${({ bg }) => bg};
    align-items: center;
    justify-content: center;
    border-width: 3px;
    border-color: #e6eaf1;
    margin-bottom: 2px;
`;

const WheelWrapper = styled.View`
    align-items: center;
    margin-bottom: 18px;
`;

const BottomContent = styled.View`
    flex: 1;
    padding: 10px 10px 0 10px;
    background: #fff;
`;

const getIconComponent = (library: IconItem["library"]) => {
    switch (library) {
        case "Ionicons":
            return Ionicons;
        case "MaterialIcons":
            return MaterialIcons;
        case "FontAwesome":
            return FontAwesome;
        default:
            return MaterialIcons;
    }
};

interface ColorPickerModalProps {
    visible: boolean;
    initialColor?: string;
    initialIcon?: IconItem | undefined;
    onClose: () => void;
    onSave: (color: string, icon: IconItem | undefined) => void;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
                                                                      visible,
                                                                      initialColor = "#3399ff",
                                                                      initialIcon,
                                                                      onClose,
                                                                      onSave,
                                                                  }) => {
    const [previewColor, setPreviewColor] = useState(initialColor);
    const [selectedIcon, setSelectedIcon] = useState<IconItem | undefined>(initialIcon);

    useEffect(() => {
        setPreviewColor(initialColor);
        setSelectedIcon(initialIcon);
    }, [visible, initialColor, initialIcon]);

    const handleConfirm = () => {
        onSave(previewColor, selectedIcon);
        onClose();
    };

    const renderIconPreview = () => {
        if (!selectedIcon) {
            return (
                <IconPreviewCircle bg="#f3f5f9">
                    <MaterialIcons name="help-outline" size={36} color="#bbb" />
                </IconPreviewCircle>
            );
        }
        const IconComp = getIconComponent(selectedIcon.library);
        return (
            <IconPreviewCircle bg={previewColor}>
                <IconComp name={selectedIcon.name as any} size={36} color="#fff" />
            </IconPreviewCircle>
        );
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <ModalContainer>
                <Header>
                    <IconBtn onPress={onClose}>
                        <MaterialIcons name="close" size={28} color="#222" />
                    </IconBtn>
                    <Title>Оберіть колір</Title>
                    <IconBtn onPress={handleConfirm}>
                        <MaterialIcons name="check" size={28} color="#222" />
                    </IconBtn>
                </Header>

                <PreviewBlock>{renderIconPreview()}</PreviewBlock>

                <WheelWrapper>
                    <View style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
                        <ColorPicker
                            color={previewColor}
                            onColorChange={setPreviewColor}
                            sliderHidden
                            thumbSize={20}
                        />
                    </View>
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
