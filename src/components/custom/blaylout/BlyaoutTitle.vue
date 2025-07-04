<script lang="ts" setup>
const props = defineProps<{title: string}>()
</script>
<template>
    <div class="border border-gray-300 rounded">
        {{ title }}
    </div>
</template>