<!-- 系统管理员端 床位管理 床位示意图 -->
<script setup lang="ts">
const floorCount = 5;
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { BedMes, BedResponse, BedType } from './type';
import { onMounted, ref } from 'vue';
import type { AcceptableValue } from 'reka-ui';
import { useBedManagementStore } from '@/lib/store';
import type { Adapter, Bed, Key } from '@/lib/type';
import { axiosInstance, xhrWithAdapter } from '@/lib/core';
const bdmStore=useBedManagementStore();
const bedStatusMap:{[key:number]:BedType}={
    0:'空闲',
    1:'外出',
    2:'外出'
}
const bedsAdapter:Adapter< {[key:string]: Array<BedResponse>},Array<Bed>>={
    adapt(source){
        console.log(source)
        let concatSource:BedResponse[]=[]
        for(let value of Object.values(source)){
            concatSource=concatSource.concat(value);
        }
        const floorBeds:Array<Bed>=[];
        for(let i=0;i<concatSource.length;i++){
            const responseBed=concatSource[i]
            const bed:Bed={
                id:responseBed.id,
                rId:responseBed.roomId,
                bNumber:responseBed.bedNumber,
                rNumber:responseBed.roomNumber,
                bStatus:bedStatusMap[responseBed.status as Key<typeof bedStatusMap>]
            }
            floorBeds[i]=bed;
        }
        return floorBeds
    }
}
const floorBedMessages: BedMes[] = [
    {
        bedType: "总量",
        count: 50
    },
    {
        bedType: "空闲",
        count: 20,
    },
    {
        bedType: "有人",
        count: 20,
    },
    {
        bedType: "外出",
        count: 10
    }
]
const bedTypeImgUrl = {
    总量: '/src/assets/all.jpg',
    空闲: '/src/assets/free.jpg',
    有人: '/src/assets/busy.jpg',
    外出: '/src/assets/out.jpg',
}
const curSelectFloorVal=ref(1)
onMounted(async () => {
    const floorBed = await xhrWithAdapter('/bed/listByFloor',{
        floor:curSelectFloorVal.value,
    },bedsAdapter)
    console.log(floorBed)
    bdmStore.setFloorBedsWithNoneCache(curSelectFloorVal.value,floorBed);
})

</script>

<template>
    <div class="flex-col w-full h-full flex overflow-hidden">
        <div id="header" class="flex space-x-4">
            <div class="flex items-center">
                <Select  v-model:model-value="curSelectFloorVal" >
                    <SelectTrigger>
                        <SelectValue placeholder="选择楼层"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup v-model="curSelectFloorVal">
                            <SelectLabel>楼层</SelectLabel>
                            <SelectItem v-for="i in floorCount" :value="i" >
                                {{ `第${i}楼层` }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <!-- 床位信息总览 -->
            <div class="flex-1 flex flex-row ">
                <div v-for="(bed, index) in floorBedMessages" class="flex-1 flex ">
                    <img :src="bedTypeImgUrl[bed.bedType]" class="min-w-[30px] max-w-[50px]">
                    <label class=" flex items-center"> {{ `${bed.bedType}:${bed.count}` }}</label>
                </div>
            </div>
        </div>
        <div class="flex h-full max-w-7/8">
            <img :alt="`第${curSelectFloorVal}床位示意图`" class="w-full h-full object-cover">
        </div>
    </div>

</template>
<style lang="css" scoped></style>