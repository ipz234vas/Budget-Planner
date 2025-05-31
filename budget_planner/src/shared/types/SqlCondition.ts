export type SqlCondition =
    | { operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE" | "NOT LIKE"; value: any }
    | { operator: "IN" | "NOT IN"; values: any[] }
    | { operator: "BETWEEN" | "NOT BETWEEN"; from: any; to: any }
    | { operator: "IS NULL" | "IS NOT NULL" };