import { ParamListBase } from "@react-navigation/native";
import { TabItem } from "./TabItem";

export interface GenericTopTabsProps<T extends ParamListBase> {
    tabParamList: T;
    screens: TabItem<T>[];
}