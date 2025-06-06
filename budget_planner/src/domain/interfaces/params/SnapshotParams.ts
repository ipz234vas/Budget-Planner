import { SnapshotTargetType } from "../../enums/SnapshotTargetType";

export interface SnapshotParams {
    id?: number;
    targetType: SnapshotTargetType;
    targetId: number;
    amount: number;
    date: string; // "YYYY-MM-DD"
}