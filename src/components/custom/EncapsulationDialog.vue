<script setup lang="ts">
import { DialogRoot } from 'reka-ui';
import { Dialog } from '../ui/dialog';
import DialogTrigger from '../ui/dialog/DialogTrigger.vue';
import DynamicButton from './DynamicButton.vue';
</script>
<template>
    <DialogRoot>
        <DialogTrigger>
            <DynamicButton>
                <slot>

                </slot>
            </DynamicButton>
        </DialogTrigger>
        
    </DialogRoot>
</template>