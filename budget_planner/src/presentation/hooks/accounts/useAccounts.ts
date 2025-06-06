import { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FactoryContext } from "../../../app/contexts/FactoryContext";
import { Account } from "../../../domain/models/Account";
import { IRepository } from "../../../domain/interfaces/repositories/IRepository";
import { AccountType } from "../../../domain/enums/AccountType";

export function useAccounts(type: AccountType) {
    const factory = useContext(FactoryContext);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [repository, setRepository] = useState<IRepository<Account> | null>(null);

    useEffect(() => {
        if (factory) {
            const repo = factory.getRepository(Account);
            setRepository(repo);
        }
    }, [factory]);

    const updateAccounts = useCallback(async () => {
        if (repository) {
            const result =
                await repository
                    .query()
                    .select()
                    .where("type", { operator: "=", value: type })
                    .executeAsync()
            setAccounts(result);
        }
    }, [repository, type]);

    useFocusEffect(
        useCallback(() => {
            updateAccounts();
        }, [updateAccounts])
    );

    const deleteAccount = useCallback(async (id?: number) => {
        if (id && repository) {
            await repository.delete(id);
            //delete snapshots
            await updateAccounts();
        }
    }, [repository, updateAccounts]);

    return { accounts, deleteAccount };
}
