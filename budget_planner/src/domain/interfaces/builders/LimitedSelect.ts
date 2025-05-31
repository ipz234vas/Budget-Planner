import { Selectable } from "./Selectable";

export interface LimitedSelect<T> extends Selectable<T> {
    offset(n: number): this;
}