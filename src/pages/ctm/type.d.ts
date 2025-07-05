export type Customer = {
    customerId: number
    name: string
    gender: string
    age: number
    bedNumber: string
    checkinDate: string
    bloodType?: string
    idCard?: string 
    relative?: string
    phoneNumber?: string
    building?: string
    roomNumber?: string
    expirationDate?: string
    customerType?: number
}
export type CheckoutRegistration ={  // 退住申请类
    id: number
    customerId: number
    customerName: string
    checkinDate: string
    checkoutDate: string
    checkoutReason: string
    bedNumber: string
    reviewStatus: number
    reviewTime: string
    checkoutType: number
    rejectReason?: string
}
export type OutingRegistration = { // 外出申请
    id: number
    customerId: number
    customerName: string
    outingReason: string
    outingDate: string
    expectedReturnDate: string
    actualReturnDate?: string
    escortName: string
    escortRelation: string
    escortPhone: string
    reviewStatus: number
    reviewTime?: string
    rejectReason?: string
}
export type SpareBed = {
    id: number
    roomNumber: string
    bedNumber: string
}