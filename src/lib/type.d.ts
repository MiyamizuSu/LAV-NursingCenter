type Key<T extends object> = keyof T
type SetValue<T> = T extends Set<infer U> ? U : never;
// type posistion={
//     x:number,
//     y:number,
// }
// type LNodepos={
//     nodePosition:posistion
//     nodeMes:BedVodeMes
// }
type Year = `${number}${number}${number}${number}`
type Month = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `1${0 | 1 | 2}`
type Day = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `${1 | 2}${number}` | `3${0 | 1}`

type StrictDate = `${Year}-${Month}-${Day}`
export type BedUser={
    Id:number,
    Name:string,
    gender:'男'|'女'
    bedMes:string,
    startUsedTime:StrictDate,
    endUsedTime:StrictDate,
}