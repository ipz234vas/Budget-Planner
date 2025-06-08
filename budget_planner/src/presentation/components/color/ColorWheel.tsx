import React from "react";
import { View } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";

interface ColorWheelProps {
    color: string;
    onColorChange: (color: string) => void;
    size: number
}

export const ColorWheel: React.FC<ColorWheelProps> = ({ color, onColorChange, size }) => (
    <View style={{ width: size, height: size }}>
        <ColorPicker
            color={color}
            onColorChange={onColorChange}
            sliderHidden
            thumbSize={20}
        />
    </View>
);
