import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { AccountType } from "../../../domain/enums/AccountType";
import { Account } from "../../../domain/models/Account";
import { useAccountService } from "./useAccountService";

export function useAccounts(type: AccountType) {
    const accountService = useAccountService();
    const [accounts, setAccounts] = useState<Account[]>([]);

    const updateAccounts = useCallback(async () => {
        if (!accountService) {
            return;
        }
        const accs = await accountService.getByType(type);
        setAccounts(accs);
    }, [accountService, type]);

    useFocusEffect(
        useCallback(() => {
            updateAccounts();
        }, [updateAccounts])
    );

    const deleteAccount = useCallback(async (id?: number) => {
        if (!accountService || !id) {
            return;
        }
        await accountService.delete(id);
        await updateAccounts();
    }, [accountService, updateAccounts]);

    return { accounts, deleteAccount };
}