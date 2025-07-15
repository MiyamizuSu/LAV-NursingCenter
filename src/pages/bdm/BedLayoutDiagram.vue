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
import type { BedMes } from './type';
import { computed, onMounted, reactive, ref } from 'vue';
import { useBedManagementStore } from '@/lib/store';
import type { Bed } from '@/lib/type';
import { post, xhrWithAdapter } from '@/lib/core';
import { bedListCountAdapter, bedsAdapter } from './helper';
const bdmStore = useBedManagementStore();
const floorBedMessages= reactive<BedMes[]>([])
const bedTypeImgUrl = {
    总量: '/src/assets/all.png',
    空闲: '/src/assets/free.png',
    有人: '/src/assets/busy.png',
    外出: '/src/assets/out.png',
}
const curSelectFloorVal = ref(1)
async function selectValChange(v: any) {
    curSelectFloorVal.value = v
    if (!bdmStore.setFloorBedsWithCache(v)) {
        const floorBed = await xhrWithAdapter('/bed/listByFloor', {
            floor: v
        }, bedsAdapter)
        bdmStore.setFloorBedsWithNoneCache(v, floorBed);
    }
}
const useFloorBeds = computed(() => {
    const rb_map = new Map<string, Bed[]>();
    for (const bed of bdmStore.getFloorBeds.value) {
        if (!rb_map.has(bed.rNumber)) {
            rb_map.set(bed.rNumber, []);
        }
        rb_map.get(bed.rNumber)!.push(bed);
    }
    return rb_map;
});
onMounted(async () => {
    if (!bdmStore.setFloorBedsWithCache(curSelectFloorVal.value)) {
        const floorBed = await xhrWithAdapter('/bed/listByFloor', {
            floor: curSelectFloorVal.value,
        }, bedsAdapter)
        bdmStore.setFloorBedsWithNoneCache(curSelectFloorVal.value, floorBed);
    }
    if (bdmStore.getRoomListCount.length === 0) {
        const res = await post<{[key: string]: number}>('/bed/listCounts', {})
        const bedCounts=res.data.data
        for (let key in bedCounts) {
            bdmStore.setRoomList(bedCounts[key],Number(key));
        }
    }
    bedListCountAdapter(bdmStore.getRoomListCount,floorBedMessages);
})
</script>

<template>
    <div class="flex-col w-full h-full flex overflow-hidden">
        <div id="header" class="flex space-x-4">
            <div class="flex items-center">
                <Select @update:model-value="selectValChange" :default-value="curSelectFloorVal">
                    <SelectTrigger>
                        <SelectValue placeholder="选择楼层"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup v-model="curSelectFloorVal">
                            <SelectLabel>楼层</SelectLabel>
                            <SelectItem v-for="i in floorCount" :value="i">
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
        <div class="flex h-full max-w-full ml-4 mr-4">
            <div class="border border-gray-300 rounded flex w-full max-h-full flex-row gap-10 items-center">
                <div v-for="[rNumber, beds] in Array.from(useFloorBeds.entries())" :key="rNumber"
                    class="border border-gray-300 rounded flex-1 ">
                    <div class="border border-gray-400 rounded border-b flex justify-center">
                        <p>
                            {{ rNumber }}
                        </p>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div v-for="bed in beds" :key="bed.bNumber" class="flex items-center flex-col p-2">
                            <img :src="bedTypeImgUrl[bed.bStatus]" class="min-w-[30px] max-w-[50px]" />
                            <p>{{ bed.bNumber }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="css" scoped></style>
