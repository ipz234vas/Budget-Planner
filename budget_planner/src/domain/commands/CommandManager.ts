import { ICommand } from "./ICommand";

export interface ScopeToken {
    checkpoint: number;
}

export class CommandManager {

    private readonly done: ICommand[] = [];
    private readonly undone: ICommand[] = [];

    public run(command: ICommand): void {
        command.execute();
        this.done.push(command);
        this.undone.length = 0;
    }

    public undo(): void {
        const command: ICommand | undefined = this.done.pop();
        if (command !== undefined) {
            command.undo();
            this.undone.push(command);
        }
    }

    public redo(): void {
        const command: ICommand | undefined = this.undone.pop();
        if (command !== undefined) {
            command.execute();
            this.done.push(command);
        }
    }

    public clear(): void {
        this.done.length = 0;
        this.undone.length = 0;
    }


    public openScope(): ScopeToken {
        return { checkpoint: this.done.length };
    }

    public cancelScope(scope: ScopeToken): void {
        while (this.done.length > scope.checkpoint) {
            const cmd = this.done.pop()!;
            cmd.undo();
        }
        this.undone.length = 0;
    }
}
