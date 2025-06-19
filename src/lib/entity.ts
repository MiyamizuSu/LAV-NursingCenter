export interface NursingLevel {
    id: number,
    name: string,
    status: number
}

export interface NursingProgram {
    id: number,
    programCode: string,
    name: string,
    price: number,
    status: number,
    executionPeriod: string,
    executionTimes: number,
    description: string,
    isDeleted: boolean
}
