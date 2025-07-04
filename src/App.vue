<script setup lang="ts">
import { useRouter } from 'vue-router';
import 'vue-sonner/style.css'
import SidebarProvider from './components/ui/sidebar/SidebarProvider.vue';
import AppSideBar from './components/custom/AppSideBar.vue';
import SidebarTrigger from './components/ui/sidebar/SidebarTrigger.vue';
import Button from './components/ui/button/Button.vue';
import HomePage from './pages/HomePage.vue';
import 'element-plus/dist/index.css'
import { Toaster } from 'vue-sonner';

const router=useRouter()
// router.push('/login')
// router.push('/main')
// router.push('/home')

</script>

<template>
  <Toaster close-button/>
  <div class="w-full h-screen ">
    <RouterView></RouterView>
  </div>
</template>

<style scoped></style>
