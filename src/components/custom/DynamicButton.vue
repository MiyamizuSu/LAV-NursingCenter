<script setup lang="ts">
import Button from '../ui/button/Button.vue';
import {motion} from 'motion-v'

</script>
<template>
    <motion.div :whilePress="{ scale: 0.9, rotate: 3 }" class="flex">
        <Button variant="outline">
            <slot>

            </slot>
        </Button>
    </motion.div>
</template>
<style lang="css" scoped>

</style>