import { IconItem } from "../types/icon";

const LIBRARY_PREFIXES = {
    Ionicons: "ion_",
    MaterialIcons: "mat_",
    FontAwesome: "fa_",
};

type Library = keyof typeof LIBRARY_PREFIXES;

export function iconItemToDb(icon: IconItem | undefined): string | undefined {
    if (!icon) return undefined;
    return `${LIBRARY_PREFIXES[icon.library]}${icon.name}`;
}

export function dbToIconItem(iconStr: string | undefined): IconItem | undefined {
    if (!iconStr) return undefined;
    if (iconStr.startsWith("ion_")) {
        return { library: "Ionicons", name: iconStr.slice(4) as any };
    }
    if (iconStr.startsWith("mat_")) {
        return { library: "MaterialIcons", name: iconStr.slice(4) as any };
    }
    if (iconStr.startsWith("fa_")) {
        return { library: "FontAwesome", name: iconStr.slice(3) as any };
    }
    return undefined;
}
