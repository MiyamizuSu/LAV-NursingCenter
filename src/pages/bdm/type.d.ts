export type BedType = '空闲' | '有人' | '外出'
export type BedMes = {
    bedType: BedType|'总量',
    count: number,
}
export type BedVodeMes = {
    bedType: BedType,
    romId: number,
    bedId: number,
    rDom?: BedRNode,
    nodeCode: string
}
export type UpdateNeedMessage = {
    endDate: {
        year: number,
        month: number,
        day: number
    },
    startDate: {
        year: number,
        month: number,
        day: number
    },
    nBed: string,
    nBuilding: string,
    nRoom: string
}
export type BedChangeRequestBody = {
    customerId: number,
    endDate: string
}
export type BedResponse={
    id:number,
    roomId:number,
    roomNumber:string,
    bedNumber:string,
    status:number
}
