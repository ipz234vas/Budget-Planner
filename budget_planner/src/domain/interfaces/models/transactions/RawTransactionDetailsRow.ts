import { TransactionType } from "../../../enums/TransactionType";
import { CategoryType } from "../../../enums/CategoryType";
import { AccountType } from "../../../enums/AccountType";

export interface RawTransactionDetailsRow {
    /** ---- transactions ---- */
    id: number;
    type: TransactionType;
    amount: number;
    currencyCode: string;
    rate: number | null;
    date: string;
    time: string;
    description: string | null;
    fromAccountId: number | null;
    toAccountId: number | null;
    categoryId: number | null;

    /** ---- category (поточна) ---- */
    cat_id: number | null;
    cat_name: string | null;
    cat_icon: string | null;
    cat_color: string | null;
    cat_type: CategoryType | null;
    cat_parentId: number | null;

    /** ---- account “from” ---- */
    from_id: number | null;
    from_name: string | null;
    from_icon: string | null;
    from_color: string | null;
    from_type: AccountType | null;

    /** ---- account “to” ---- */
    to_id: number | null;
    to_name: string | null;
    to_icon: string | null;
    to_color: string | null;
    to_type: AccountType | null;
}
