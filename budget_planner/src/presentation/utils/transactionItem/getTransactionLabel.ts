import { TransactionDetails } from "../../../domain/interfaces/models/transactions/TransactionDetails";

export function getTransactionLabel(details: TransactionDetails) {
    if (!details.category)
        return { main: {}, child: undefined, label: "" };

    const { category } = details;
    const root = category.root ?? category;
    const childNeeded = root.id !== category.id;

    return {
        main: { icon: root.icon, color: root.color },
        child: childNeeded ? { icon: category.icon, color: category.color } : undefined,
        label: childNeeded ? `${root.name} • ${category.name}` : category.name,
    };
}
