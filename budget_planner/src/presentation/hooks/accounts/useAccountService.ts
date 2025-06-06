import { useContext, useEffect, useMemo, useState } from "react";
import { FactoryContext } from "../../../app/contexts/FactoryContext";
import { Account } from "../../../domain/models/Account";
import { Snapshot } from "../../../domain/models/Snapshot";
import { AccountService } from "../../../data/services/account/AccountService";

export function useAccountService() {
    const factory = useContext(FactoryContext);
    const [service, setService] = useState<AccountService | null>(null);

    useEffect(() => {
        if (!factory) {
            return;
        }
        const accountRepo = factory.getRepository(Account);
        const snapshotRepo = factory.getRepository(Snapshot);

        if (!snapshotRepo || !accountRepo)
            return;

        setService(new AccountService(accountRepo, snapshotRepo));
    }, [factory]);

    return service;
}
