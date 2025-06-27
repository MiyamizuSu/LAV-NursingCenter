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
import type { BedMes, BedType, BedVodeMes } from './type';
import { motion, type BoundingBox } from 'motion-v'
import { nextTick, onMounted, reactive, ref, useTemplateRef, type Reactive, type Ref, type ShallowRef } from 'vue';
import { useDraggable, useResizeObserver } from '@vueuse/core';
// import { useBedLayoutStore } from '@/lib/store';
import type { AcceptableValue } from 'reka-ui';
// const bedLayoutStore = useBedLayoutStore()
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


// const bedVNodeMesArr = ref<LNodepos[]>([])

// const dragFieldSize: Reactive<Partial<BoundingBox>> = reactive({
//     top: 0,
//     right: 0,
//     left: 0,
//     bottom: 0
// })
// const bedLNodeChange = (e: PointerEvent, nodeCode: string) => {
//     const { clientX, clientY } = e;
//     bedLayoutStore.setLNodeFromCode(nodeCode, {
//         x: clientX,
//         y: clientY
//     })

// }
// const bedsRef = useTemplateRef('bedsRef');
// const constraintsRef = useTemplateRef('constraintsRef') as Ref<HTMLElement>;
// const createBedVnode = async (bdt: BedType) => {
//     if (bdt === '总量') {
//         return
//     }
//     const bedVNode: BedVodeMes = {
//         bedType: bdt,
//         romId: 1004,
//         bedId: 1,
//         nodeCode: _encodeWithTimestampToBase64(bdt)
//     }
//     bedVNodeMesArr.value.push({
//         nodeMes: bedVNode,
//         nodePosition: {
//             x: 0,
//             y: 0
//         }
//     });
//     await nextTick();
//     const bedStandard = bedsRef.value?.[0]?.$el as HTMLDivElement
//     dragFieldSize.right = constraintsRef.value.getClientRects()[0].width - bedStandard.clientWidth;
//     dragFieldSize.bottom = constraintsRef.value.getClientRects()[0].height - bedStandard.clientHeight;
//     bedLayoutStore.addNewNodes({
//         nodePosition: {
//             x: bedStandard.clientLeft,
//             y: bedStandard.clientTop
//         },
//         nodeMes: bedVNode
//     })
//     console.log(bedLayoutStore.getLNodes)
//     useResizeObserver(constraintsRef, (entries) => {
//         const entry = entries[0]
//         const { width, height, left, top } = entry.contentRect
//         bedLayoutStore.setCansvasNode({
//             x: left,
//             y: top
//         })
//         dragFieldSize.right = width - bedStandard.clientWidth;
//         dragFieldSize.bottom = height - bedStandard.clientHeight;
//         for (let bedRef of bedsRef.value ?? []) {
//             const bedElement = bedRef?.$el as HTMLDivElement;
//             if (bedElement.clientLeft > left + width) {
//                 bedElement.style.left = `${left + width - 2}px`;
//             }
//         }
//     })
// }

onMounted(async () => {
    // bedVNodeMesArr.value = bedLayoutStore.getLNodes;
    // for (let item of bedVNodeMesArr.value) {
    //     console.log(item.nodePosition.x, item.nodePosition.y)
    // }
    // await nextTick()
    // const bedStandard = bedsRef.value?.[0]?.$el as HTMLDivElement
    // if (!bedStandard) {

    // }
    // else {
    //     dragFieldSize.right = constraintsRef.value.getClientRects()[0].width - bedStandard.clientWidth;
    //     dragFieldSize.bottom = constraintsRef.value.getClientRects()[0].height - bedStandard.clientHeight;
    // }

})
const curSelectFloorVal=ref(1)
const handleSelect=(e:AcceptableValue)=>{
    curSelectFloorVal.value=e as number
}


</script>

<template>
    <div class="flex-col w-full h-full flex overflow-hidden">
        <div id="header" class="flex space-x-4">
            <div class="flex items-center">
                <Select  @update:model-value="handleSelect" >
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
            <!-- 床位信息展示位
            <div id="canvasContent" class="w-7/8 border border-gray-400" ref="constraintsRef">
                <div id="canvas" class="flex relative">
                    <motion.div v-for="(bedVNodeMes, index) in bedVNodeMesArr" class="absolute flex-col" drag
                        :drag-momentum="false" :drag-constraints="dragFieldSize" :drag-elastic="1" ref="bedsRef"
                        :key="bedVNodeMes.nodeMes.nodeCode"
                        @dragEnd="bedLNodeChange($event, bedVNodeMes.nodeMes.nodeCode)"
                        :style="{ left: bedVNodeMes.nodePosition.x + 'px', top: bedVNodeMes.nodePosition.y + 'px' }">
                        <label> {{ `${bedVNodeMes.nodeMes.romId}-${bedVNodeMes.nodeMes.bedId}` }}</label>
                        <img :src="bedTypeImgUrl[bedVNodeMes.nodeMes.bedType]" class="min-w-[30px] max-w-[50px]">
                    </motion.div>
                </div>
            </div>
            床位原料
            <div id="dragableContent" class="flex flex-col flex-1">
                <div v-for="bed in floorBedMessages" :key="bed.bedType" class="flex flex-1 items-center"
                    @dblclick="createBedVnode(bed.bedType)">
                    <img :src="bedTypeImgUrl[bed.bedType]" class="min-w-[30px] max-w-[50px]">
                    <label class=" flex items-center"> {{ `${bed.bedType}` }}</label>
                </div>
            </div> -->
            <img :alt="`第${curSelectFloorVal}床位示意图`" class="w-full h-full object-cover">
        </div>
    </div>

</template>
<style lang="css" scoped></style>