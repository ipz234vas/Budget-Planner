import { IconCategory } from "../types/icon";

export const ICON_CATEGORIES: IconCategory[] = [
    {
        category: "Фінанси",
        icons: [
            { library: "Ionicons", name: "cash-outline" },
            { library: "Ionicons", name: "card-outline" },
            { library: "Ionicons", name: "wallet-outline" },
            { library: "MaterialIcons", name: "credit-card" },
            { library: "MaterialIcons", name: "credit-score" },
            { library: "MaterialIcons", name: "credit-card-off" },
            { library: "MaterialIcons", name: "wallet" },
        ],
    },
    {
        category: "Робота",
        icons: [
            { library: "Ionicons", name: "briefcase-outline" },
            { library: "MaterialIcons", name: "business-center" },
            { library: "MaterialIcons", name: "work" },
            { library: "MaterialIcons", name: "work-history" },
            { library: "MaterialIcons", name: "apartment" },
        ],
    },
    {
        category: "Різне",
        icons: [
            { library: "MaterialIcons", name: "category" },
        ],
    }
];