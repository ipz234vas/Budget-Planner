import { CategorySessionProvider } from "../contexts/CategorySessionContext";
import CategoriesStack from "../../app/navigation/CategoriesStack";
import React from "react";

export default function CategoriesScreenContainer() {
    return (
        <CategorySessionProvider>
            <CategoriesStack/>
        </CategorySessionProvider>)
}