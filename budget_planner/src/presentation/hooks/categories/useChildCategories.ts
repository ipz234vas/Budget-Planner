import { useEffect, useState } from "react";
import { CategoryType } from "../../../domain/enums/CategoryType";
import { useCategoriesService } from "./useCategoriesService";
import { Category } from "../../../domain/models/Category";

export function useChildCategories(
    type: CategoryType,
    parentId?: number | null,
    enabled = true
) {
    const service = useCategoriesService()

    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!enabled || !service) {
            return;
        }
        let active = true;

        (async () => {
            setLoading(true);
            const result = await service.getChildrenByParent(type, parentId);
            if (active) {
                setData(result);
            }
            setLoading(false);
        })();

        return () => {
            active = false;
        };
    }, [type, parentId, service, enabled]);

    return { data, loading };
}
