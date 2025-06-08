import { AccountType } from "../../../domain/enums/AccountType";
import { useEffect, useState } from "react";
import { Account } from "../../../domain/models/Account";
import { useAccountService } from "./useAccountService";

export function useAccountsByType(type: AccountType, excludeId?: number | null, enabled = true) {
    const service = useAccountService();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!enabled || !service) {
            return;
        }
        let active = true;
        (async () => {
            setLoading(true);
            const result = await service.getByType(type, excludeId);
            if (active) {
                setAccounts(result);
            }
            setLoading(false);
        })();
        return () => {
            active = false
        };
    }, [type, excludeId, service, enabled]);

    return { accounts, loading };
}
