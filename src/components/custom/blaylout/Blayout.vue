<script lang="ts" setup>
import type { Bed } from '@/lib/type';
import { computed, reactive, type Ref } from 'vue';

// const props = defineProps<{
//     floorBeds: Bed[]
// }>()
// const useFloorBeds = computed(() => {
//     const rb_map = new Map<string, Bed[]>();
//     for (const bed of props.floorBeds) {
//         if (!rb_map.has(bed.rNumber)) {
//             rb_map.set(bed.rNumber, []);
//         }
//         rb_map.get(bed.rNumber)!.push(bed);
//     }
//     return rb_map;
// });

</script>
<template>
    <div class="border border-grsay-300 rounded">
        <slot class="flex flex-row">

        </slot>
    </div>
</template>
