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



export type BedType='总量'|'空闲'|'有人'|'外出'