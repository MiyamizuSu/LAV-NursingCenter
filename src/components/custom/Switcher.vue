<script lang="ts" setup>
import { motion } from 'motion-v';
import { computed, ref } from 'vue';
const isLeft = ref(true)
const switchKey = () => {
    isLeft.value = !isLeft.value
}
const props = defineProps(['leftValue', 'rightValue'])
// 滑块动画值
const aniStr = computed(() => isLeft.value ? 'translateX(4%)' : 'translateX(104%)')

</script>
<template>

    <div class="bg-gray-200 p-1 w-64 h-10 rounded-lg relative overflow-hidden">
        <!-- 白色滑块（稍微缩小） -->
        <motion.div
            class="w-[48%] h-[90%] bg-white rounded-lg absolute top-1/2 left-0 z-0 -translate-y-1/2 transition-transform duration-300"
            :animate="{ transform: aniStr }" 
            :transition="{
                type:'spring'
            }"
            />

        <!-- 文字按钮 -->
        <div class="flex relative z-10 text-center text-sm font-medium text-gray-700 h-full">
            <div class="w-1/2 flex items-center justify-center cursor-pointer" @click="() => isLeft = true">
                {{ leftValue }}
            </div>
            <div class="w-1/2 flex items-center justify-center cursor-pointer" @click="() => isLeft = false">
                {{ rightValue }}
            </div>
        </div>
    </div>

</template>
