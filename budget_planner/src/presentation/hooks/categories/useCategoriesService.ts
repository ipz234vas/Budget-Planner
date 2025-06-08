import { useContext, useEffect, useState } from "react";
import { FactoryContext } from "../../../app/contexts/FactoryContext";
import { Account } from "../../../domain/models/Account";
import { Snapshot } from "../../../domain/models/Snapshot";
import { AccountService } from "../../../data/services/account/AccountService";
import { CategoryService } from "../../../domain/services/CategoryService";
import { Category } from "../../../domain/models/Category";

export function useCategoriesService() {
    const factory = useContext(FactoryContext);
    const [service, setService] = useState<CategoryService | null>(null);

    useEffect(() => {
        if (!factory) {
            return;
        }
        const categoryRepo = factory.getRepository(Category);

        if (!categoryRepo)
            return;

        setService(new CategoryService(categoryRepo));
    }, [factory]);

    return service;
}
