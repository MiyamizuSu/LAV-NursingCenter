type Key<T extends object>=keyof T
type SetValue<T> = T extends Set<infer U> ? U : never;