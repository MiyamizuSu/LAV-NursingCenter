<script setup lang="ts">
import { useRouter } from 'vue-router';
import 'vue-sonner/style.css'
import SidebarProvider from './components/ui/sidebar/SidebarProvider.vue';
import AppSideBar from './components/custom/AppSideBar.vue';
import SidebarTrigger from './components/ui/sidebar/SidebarTrigger.vue';
import Button from './components/ui/button/Button.vue';
import 'element-plus/dist/index.css'
import CheckIn from './pages/ctm/CheckIn.vue';

const router=useRouter()
router.push('/nursingLevel')

</script>

<template>
  <div class="w-screen h-screen overflow-hidden">
    <!-- <CheckIn></Checkin> -->
    <RouterView></RouterView>
    <SidebarProvider>
      <AppSideBar></AppSideBar>
      <SidebarTrigger></SidebarTrigger>
    </SidebarProvider>
  </div>
</template>

<style scoped>
</style>
