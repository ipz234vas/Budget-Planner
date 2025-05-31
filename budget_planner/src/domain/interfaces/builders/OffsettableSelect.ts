import { Selectable } from "./Selectable";

import { LimitedSelect } from "./LimitedSelect";

export interface OffsettableSelect<T> extends Selectable<T> {
    limit(n: number): LimitedSelect<T>;
}