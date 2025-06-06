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

    useEffect(() => {
        const fetchAccount = async () => {
            if (accountService && isEdit && id) {
                setLoading(true);
                try {
                    const acc = await accountService.getById(id);
                    if (acc) {
                        setAccountDraft(acc);
                        setOriginalAmount(acc.currentAmount ?? 0);
                    }
                } catch (error) {
                    console.error("Error loading account:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setOriginalAmount(null);
            }
        };
        fetchAccount();
    }, [accountService, isEdit, id]);

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
