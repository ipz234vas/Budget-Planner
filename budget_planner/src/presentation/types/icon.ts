import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ComponentProps } from "react";

type IoniconsName = ComponentProps<typeof Ionicons>['name'];
type MaterialName = ComponentProps<typeof MaterialIcons>['name'];
type FontAwesomeName = ComponentProps<typeof FontAwesome>['name'];

export type IconItem =
    | { library: 'Ionicons'; name: IoniconsName }
    | { library: 'MaterialIcons'; name: MaterialName }
    | { library: 'FontAwesome'; name: FontAwesomeName };

export interface IconCategory {
    category: string;
    icons: IconItem[];
}