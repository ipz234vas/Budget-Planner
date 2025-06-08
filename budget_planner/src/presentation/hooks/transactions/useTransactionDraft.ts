import { useState } from "react";
import { TransactionDraft } from "../../../domain/models/TransactionDraft";
import { TransactionDetails } from "../../../domain/interfaces/models/transactions/TransactionDetails";

export function useTransactionDraft(initial?: TransactionDetails) {
    const [draft, setDraft] = useState<TransactionDraft>(
        () => new TransactionDraft(initial)
    );

    const patchDraft = (patch: Partial<TransactionDraft>) => {
        setDraft(prev => ({ ...prev, ...patch }));
    };

    return { draft, patchDraft, setDraft };
}
