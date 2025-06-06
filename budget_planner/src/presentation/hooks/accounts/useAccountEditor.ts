import { useCallback, useEffect, useState } from "react";
import { Account } from "../../../domain/models/Account";
import { AccountType } from "../../../domain/enums/AccountType";
import { useAccountService } from "./useAccountService";

interface UseAccountEditorOptions {
    id?: number;
    type: AccountType;
    defaultCurrencyCode?: string | null;
}

export function useAccountEditor({ id, type, defaultCurrencyCode }: UseAccountEditorOptions) {
    const accountService = useAccountService();
    const [loading, setLoading] = useState(true);
    const [accountDraft, setAccountDraft] = useState<Account>(
        new Account({
            name: "",
            type,
            currencyCode: defaultCurrencyCode ?? "",
            goalAmount: null,
            goalDeadline: null,
            currentAmount: 0,
            id,
        })
    );
    const [originalAmount, setOriginalAmount] = useState<number | null>(null);
    const isEdit = !!id;

    const resetDraftState = useCallback(() => {
        setAccountDraft(
            new Account({
                name: "",
                type,
                currencyCode: defaultCurrencyCode ?? "",
                goalAmount: null,
                goalDeadline: null,
                currentAmount: 0,
                id,
            })
        );
        setOriginalAmount(null);
        setLoading(false);
    }, [type, defaultCurrencyCode, id]);

    const handleAccountLoaded = useCallback((acc: Account) => {
        setAccountDraft(acc);
        setOriginalAmount(acc.currentAmount ?? 0);
    }, []);

    const handleAccountError = useCallback((error: unknown) => {
        console.error("Error loading account:", error);
    }, []);

    const loadAccount = useCallback(async () => {
        if (!accountService || !isEdit || !id) {
            resetDraftState();
            return;
        }
        setLoading(true);
        try {
            const acc = await accountService.getById(id);
            if (acc) {
                handleAccountLoaded(acc);
            } else {
                resetDraftState();
            }
        } catch (error) {
            handleAccountError(error);
        } finally {
            setLoading(false);
        }
    }, [accountService, isEdit, id, handleAccountLoaded, resetDraftState, handleAccountError]);

    useEffect(() => {
        loadAccount();
    }, [loadAccount]);

    const save = useCallback(async () => {
        if (!accountService) {
            return false;
        }
        await accountService.save(accountDraft, originalAmount);
        return true;
    }, [accountService, accountDraft, originalAmount]);

    return {
        loading,
        accountDraft,
        setAccountDraft,
        save,
        isEdit,
    };
}
