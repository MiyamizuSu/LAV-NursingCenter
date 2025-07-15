import type { Adapter, Bed, Key } from "@/lib/type";
import type { BedMes, BedResponse, BedType, CalendarDate } from "./type";
const bedStatusMap: { [key: number]: BedType } = {
    0: '空闲',
    1: '外出',
    2: '有人'
}
export const bedsAdapter: Adapter<{ [key: string]: Array<BedResponse> }, Array<Bed>> = {
    adapt(source) {
        const floorBeds: Array<Bed> = [];
        if (source) {
            let concatSource: BedResponse[] = []
            for (let value of Object.values(source)) {
                concatSource = concatSource.concat(value);
            }
            for (let i = 0; i < concatSource.length; i++) {
                const responseBed = concatSource[i]
                const bed: Bed = {
                    id: responseBed.id,
                    rId: responseBed.roomId,
                    bNumber: responseBed.bedNumber,
                    rNumber: responseBed.roomNumber,
                    bStatus: bedStatusMap[responseBed.status as Key<typeof bedStatusMap>]
                }
                floorBeds[i] = bed;
            }
        }
        return floorBeds
    }
}
export const dateConverter = function (source: CalendarDate) {
    return `${source.year}-${source.month}-${source.day}`
}
export const bedListCountAdapter = function (source: number[], target: BedMes[]) {
    source.forEach((item, index) => {
        target.push(
            {
                bedType: bedStatusMap[index],
                count: item
            }
        )
    })
    const allCount=target.reduce((pre,cur)=>{
        return {
            bedType:'总量',
            count:pre.count+cur.count
        }
    })
    target.unshift(allCount);
}