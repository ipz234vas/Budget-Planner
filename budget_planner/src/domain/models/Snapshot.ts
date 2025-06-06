import { SnapshotTargetType } from "../enums/SnapshotTargetType";
import { SnapshotParams } from "../interfaces/params/SnapshotParams"; // можеш додати enum якщо хочеш, нижче є варіант

export class Snapshot {
    public id?: number;
    public targetType: SnapshotTargetType = SnapshotTargetType.Account;
    public targetId: number = 0;
    public amount: number = 0;
    public date: string = "";

    constructor(params?: SnapshotParams) {
        if (!params)
            return;
        this.id = params.id;
        this.targetType = params.targetType;
        this.targetId = params.targetId;
        this.amount = params.amount;
        this.date = params.date ?? "";
    }
}
