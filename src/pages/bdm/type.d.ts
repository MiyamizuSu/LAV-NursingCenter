import { Ref } from 'vue'
export type BedMes={
    bedType:BedType,
    count:number,
}
export type BedVodeMes={
    bedType:BedType,
    romId:number,
    bedId:number,
    rDom?:BedRNode,
    nodeCode:string
}
export type UpdateNeedMessage={
    endDate:{
        year:number,
        month:number,
        day:number
    },
    startDate:{
        year:number,
        month:number,
        day:number
    },
    nBed:string,
    nBuilding:string,
    nRoom:string
}
export type BedChangeRequestBody={
    customerId:number,
    endDate:string
}


export type BedType='总量'|'空闲'|'有人'|'外出'