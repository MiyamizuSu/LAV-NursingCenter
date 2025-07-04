import type { DateValue } from "reka-ui"

export type BedType = '空闲' | '有人' | '外出'
export type BedMes = {
    bedType: BedType | '总量',
    count: number,
}
export type CalendarDate={
    year: number,
    month: number,
    day: number,
}
export type BedChangeRequestBody = {
    customerId: number,
    endDate: string
}
export type BedResponse = {
    id: number,
    roomId: number,
    roomNumber: string,
    bedNumber: string,
    status: number
}
export type BedExchangeRequest = {
    customerId: number,
    roomNumber: string,
    bedNumber: string,
    startDate: string,
    endDate: string
}
export type RoomResponse={
    id:number,
    roomNumber:string,
    floor:number,
    bedCount:number
}