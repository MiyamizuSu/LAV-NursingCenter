<script setup lang="ts">
import { useRouter } from 'vue-router';
import 'vue-sonner/style.css'
import SidebarProvider from './components/ui/sidebar/SidebarProvider.vue';
import AppSideBar from './components/custom/AppSideBar.vue';
import SidebarTrigger from './components/ui/sidebar/SidebarTrigger.vue';
import Button from './components/ui/button/Button.vue';

const router=useRouter()
router.push('/login')

</script>

<template>
  <div class="w-screen h-screen overflow-hidden">
    <RouterView></RouterView>
  </div>
</template>

<style scoped>
</style>
