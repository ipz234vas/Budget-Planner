export function formatUADate(iso: string | null): string {
    if (!iso)
        return "";
    const date = new Date(iso);
    if (isNaN(date.getTime()))
        return "";

    const now = new Date();
    const isCurrentYear = date.getFullYear() === now.getFullYear();

    return date.toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
        ...(isCurrentYear ? {} : { year: "numeric" }),
    });
}
