import { ParamListBase, RouteProp } from "@react-navigation/native";
import React from "react";

export interface TabItem<T extends ParamListBase> {
    name: keyof T & string;
    component: React.ComponentType<any>;
    initialParams?: RouteProp<T, keyof T>["params"];
    title: string;
}