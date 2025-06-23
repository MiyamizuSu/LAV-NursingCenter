export type User = {
    userId: number
    account: string
    password: string
    name: string
    phoneNumber: string
    gender: 0 | 1  // 0-女性  1-男性
    email: string
    userType: number  // 0-管理员  1-护工
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
    status: 0 | 1,
    executionPeriod: string,
    executionTimes: number,
    description: string,
    isDeleted: boolean
}

export type CustomerNursingService = {
    id: number,
    customerId: number,
    levelId: number,
    programId: number,
    programCode: string,
    programName: string,
    purchaseDate: string,
    totalCount: number,
    usedCount: number,
    expirationDate: string,
    isDeleted: boolean
}
