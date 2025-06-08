export function getTimestamp(date?: string, time: string = "00:00:00"): number {
    return new Date(`${date}T${time}`).getTime();
}