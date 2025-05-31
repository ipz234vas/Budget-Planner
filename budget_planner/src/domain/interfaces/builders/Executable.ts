export interface Executable<R> {
    executeAsync(): Promise<R>;
}