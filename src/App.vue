<script setup lang="ts">
import { useRouter } from 'vue-router';
import 'vue-sonner/style.css'
import SidebarProvider from './components/ui/sidebar/SidebarProvider.vue';
import AppSideBar from './components/custom/AppSideBar.vue';
import SidebarTrigger from './components/ui/sidebar/SidebarTrigger.vue';
import Button from './components/ui/button/Button.vue';
import 'element-plus/dist/index.css'

const router=useRouter()
// router.push('/login')
router.push('/login')

</script>

<template>
  <div class="w-screen h-screen ">
    <RouterView></RouterView>
    <!-- <CheckIn></Checkin> -->
    <!-- <SidebarProvider>
      <AppSideBar></AppSideBar>
      <SidebarTrigger></SidebarTrigger>
    </SidebarProvider> -->
  </div>
</template>

<style scoped>
</style>
