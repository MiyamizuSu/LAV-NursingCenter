<script setup lang="ts">
import AppSideBar from '@/components/custom/AppSideBar.vue';
import SidebarProvider from '@/components/ui/sidebar/SidebarProvider.vue';
import SidebarTrigger from '@/components/ui/sidebar/SidebarTrigger.vue';




</script>


<template>
    <SidebarProvider>
        <AppSideBar/>
        <main>
            <SidebarTrigger></SidebarTrigger>
            
        </main>
    </SidebarProvider>
</template>
<style lang="css" scoped>

</style>