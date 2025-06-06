import { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FactoryContext } from "../../../app/contexts/FactoryContext";
import { Account } from "../../../domain/models/Account";
import { IRepository } from "../../../domain/interfaces/repositories/IRepository";
import { AccountType } from "../../../domain/enums/AccountType";
import { Snapshot } from "../../../domain/models/Snapshot";
import { SnapshotTargetType } from "../../../domain/enums/SnapshotTargetType";

export function useAccounts(type: AccountType) {
    const factory = useContext(FactoryContext);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [accountRepository, setAccountRepository] = useState<IRepository<Account> | null>(null);
    const [snapshotRepository, setSnapshotRepository] = useState<IRepository<Snapshot> | null>(null);

    useEffect(() => {
        if (factory) {
            const accountRepo = factory.getRepository(Account);
            setAccountRepository(accountRepo);
            const snapshotRepo = factory.getRepository(Snapshot);
            setSnapshotRepository(snapshotRepo);
        }
    }, [factory]);

    const updateAccounts = useCallback(async () => {
        if (!accountRepository) {
            return;
        }
        const accounts =
            await accountRepository
                .query()
                .select()
                .where("type", { operator: "=", value: type })
                .executeAsync()

        setAccounts(accounts);
    }, [accountRepository, type]);

    useFocusEffect(
        useCallback(() => {
            updateAccounts();
        }, [updateAccounts])
    );

    const deleteAccount = useCallback(async (id?: number) => {
        if (!id || !accountRepository) {
            return;
        }

        await accountRepository.delete(id);
        await updateAccounts();

        if (!snapshotRepository) {
            return;
        }

        await snapshotRepository
            .query()
            .delete()
            .where("targetId", {
                operator: "=",
                value: id
            })
            .where("targetType", {
                operator: "=",
                value: SnapshotTargetType.Account
            })
            .executeAsync();

    }, [accountRepository, updateAccounts]);

    return { accounts, deleteAccount };
}