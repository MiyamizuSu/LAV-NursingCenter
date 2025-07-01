<script setup lang="ts">
import { useRouter } from 'vue-router';
import 'vue-sonner/style.css'
import SidebarProvider from './components/ui/sidebar/SidebarProvider.vue';
import AppSideBar from './components/custom/AppSideBar.vue';
import SidebarTrigger from './components/ui/sidebar/SidebarTrigger.vue';
import Button from './components/ui/button/Button.vue';
import 'element-plus/dist/index.css'
import { E } from 'node_modules/@faker-js/faker/dist/airline-BUL6NtOJ';
import { axiosInstance as axios } from '@/lib/core'

const router = useRouter()

//关闭窗口时
window.addEventListener('beforeunload', function (e) {
    handleWindowClose()
})

const handleWindowClose = () => {
    if (sessionStorage.getItem('customerActive') == '1') {
        localStorage.removeItem('customerUsing')
    }
    if (sessionStorage.getItem('userType') == '0') {
        localStorage.removeItem('AdminUsing')
    } else if (sessionStorage.getItem('userType') == '1') {
        localStorage.removeItem('NurseUsing')
    }
}

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

<style scoped></style>
