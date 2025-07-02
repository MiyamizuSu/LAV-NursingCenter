type Key<T extends object>=keyof T
type SetValue<T> = T extends Set<infer U> ? U : never;
type Year = `${number}${number}${number}${number}`
type Month = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `1${0 | 1 | 2}`
type Day = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `${1 | 2}${number}` | `3${0 | 1}`
type StrictDate = `${Year}-${Month}-${Day}`
export type User = {
    userId: number
    account: string
    password: string
    name: string
    phoneNumber: string
    gender: 0 | 1  // 0-女性  1-男性
    email: string
    userType: 0 | 1  // 0-管理员  1-护工
}

export type Customer = {
    customerId: number
    customerType: 0 | 1 // 0-自理老人  1-护理老人
    nurseId: number
    nursingLevelName: string
    name: string
    idCard: string
    age: number
    gender: 0 | 1  // 0-女性  1-男性
    bloodType: string
    relative: string
    phoneNumber: string
    building: string //固定为"606"
    roomNumber: string
    bedNumber: string 
    checkinDate: string
    expirationDate: string
}

export type NursingLevel = {
    id: number,
    name: string,
    status: number
}

export type NursingProgram = {
    id: number,
    programCode: string,
    name: string,
    price: number,
    status: 0 | 1, // 0-停用 1-启用
    executionPeriod: string,
    executionTimes: number,
    description: string,
    // isDeleted: boolean
}

export type CustomerNursingService = {
    id: number,
    customerId: number,
    levelId: number,
    programId: number,
    programCode: string,
    programName: string,
    programPrice: number,
    executionPeriod: string,
    executionTimes: number,
    purchaseDate: string,
    totalCount: number,
    usedCount: number,
    expirationDate: string,
}

export type NursingRecord = {
    id: number,
    customerId: number,
    customerName: string,
    programId: number,
    programCode: string,
    programName: string,
    description: string,
    nurseName: string,
    nursePhone: string,
    nursingTime: string,
    executionCount: number,
    // isDeleted: boolean
}
export type BedUser={
    Id:number,
    name:string,
    gender:'男'|'女'
    bedMes:string,
    startUsedTime:StrictDate,
    endUsedTime:StrictDate,
    customerId:number
}
export type Bed={
    id:number,
    rId:number,
    rNumber:string,
    bNumber:string,
    bStatus:'空闲'|'外出'|'有人'
}
export interface Adapter<S extends object | object[], T extends object | object[]> {
    adapt(source: S): T;
}
  