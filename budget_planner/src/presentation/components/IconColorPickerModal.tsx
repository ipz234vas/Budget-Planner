import React, { useEffect, useState } from "react";
import { Dimensions, Modal } from "react-native";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import { IconPicker } from "./IconPicker";
import { ICON_CATEGORIES } from "../constants/iconCategories";
import { IconItem } from "../types/icon";
import { ColorWheel } from "./ColorWheel";
import { IconRenderer } from "./IconRenderer";

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

const IconPreviewCircle = styled.View`
    width: 68px;
    height: 68px;
    border-radius: 34px;
    background: ${(props: { bg: string }) => props.bg};
    align-items: center;
    justify-content: center;
    border-width: 3px;
    border-color: #e6eaf1;
    margin-bottom: 2px;
`;

const BottomContent = styled.View`
    flex: 1;
    padding: 10px 10px 0 10px;
    background: #fff;
`;

const WheelWrapper = styled.View`
    align-items: center;
    margin-bottom: 18px;
`;

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

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <ModalContainer>
                <Header>
                    <IconBtn onPress={onClose}>
                        <MaterialIcons name="close" size={28} color="#222"/>
                    </IconBtn>
                    <Title>Оберіть колір</Title>
                    <IconBtn onPress={handleConfirm}>
                        <MaterialIcons name="check" size={28} color="#222"/>
                    </IconBtn>
                </Header>

                <PreviewBlock>
                    <IconPreviewCircle bg={previewColor}>
                        <IconRenderer
                            icon={selectedIcon}
                            size={36}
                            color="#fff"
                        />
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
