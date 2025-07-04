<script lang="ts" setup>
const props=defineProps<{
    bedId:string
}>()
</script>
<template>
    <div class="flex flex-col">
        <div>
            {{ bedId }}
        </div>
        <slot>

        </slot>
    </div>
</template>