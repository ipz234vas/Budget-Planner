import { AccountType } from "../enums/AccountType";
import { AccountInfo } from "../interfaces/models/transactions/AccountInfo";

interface RawAccount {
    id: number | null;
    name: string | null;
    icon: string | null;
    color: string | null;
    type: AccountType | null;
    currency: string | null;
}

export function buildAccountInfo(raw?: RawAccount): AccountInfo | undefined {
    if (!raw?.id) return undefined;
    return {
        id: raw.id,
        name: raw.name ?? "",
        icon: raw.icon ?? undefined,
        color: raw.color ?? undefined,
        type: raw.type ?? AccountType.Account,
        currencyCode: raw.currency ?? "",
    };
}
