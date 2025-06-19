<script setup lang="ts">
import Badge from '../ui/badge/Badge.vue';
import Button from '../ui/button/Button.vue';
import { X } from 'lucide-vue-next';
const props = defineProps(['tagName'])
const emits=defineEmits(['memoryCancel'])

</script>
<template>
    <div class="translate-y-2 block">
        <Badge class="min-h-[30px] max-w-[100%] min-w-[10%] " variant="secondary">
            {{ props.tagName }}
        </Badge>
        <Badge class="min-h-[30px] -translate-x-1 translate-y-1/14" @click="$emit('memoryCancel')">
            <X ></X>
        </Badge>
    </div>
</template>
<style lang="css" scoped></style>