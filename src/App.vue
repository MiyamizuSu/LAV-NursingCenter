<script setup lang="ts">
import { useRouter } from 'vue-router';
import 'vue-sonner/style.css'
import CheckOutPage from './pages/ctm/CheckOutPage.vue';
import SidebarProvider from './components/ui/sidebar/SidebarProvider.vue';
import AppSideBar from './components/custom/AppSideBar.vue';
import SidebarTrigger from './components/ui/sidebar/SidebarTrigger.vue';
import Button from './components/ui/button/Button.vue';
import CheckInPage from './pages/ctm/CheckInPage.vue';
import GoOutPage from './pages/ctm/GoOutPage.vue';
import GoOutApplication from './pages/cts/GoOutApplication.vue';
import CheckOutApplication from './pages/cts/CheckOutApplication.vue';
const router=useRouter()
router.push('/login')

</script>

<template>
  <div class="w-screen h-screen overflow-hidden">
    <SidebarProvider>
      <AppSideBar>
      </AppSideBar>
      <SidebarTrigger>
        <Button>
        </Button>
      </SidebarTrigger>
      <!-- <CheckInPage></CheckInPage> -->
      <!-- <CheckOutPage></CheckOutPage> -->
      <!-- <GoOutPage></GoOutPage> -->
      <GoOutApplication></GoOutApplication>
      <!-- <CheckOutApplication></CheckOutApplication> -->
    </SidebarProvider>
  </div>
</template>

<style scoped>
</style>
