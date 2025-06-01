import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { IconItem } from '../types/icon';

export const getIconComponent = (library: IconItem['library']) => {
    switch (library) {
        case 'Ionicons':
            return Ionicons;
        case 'MaterialIcons':
            return MaterialIcons;
        case 'FontAwesome':
            return FontAwesome;
        default:
            return MaterialIcons;
    }
};