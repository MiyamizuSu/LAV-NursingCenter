<script setup lang="ts">
import { useRouter } from 'vue-router';
import 'vue-sonner/style.css'
import 'element-plus/dist/index.css'
import { Toaster } from 'vue-sonner';
import { onMounted, onUnmounted } from 'vue';
import { axiosInstance as axios } from '@/lib/core'

const router=useRouter()
// router.push('/main')

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

let checkInterval: number;

const checkTokenValidity = () => {
    console.log("check")
    if(sessionStorage.getItem('userType')!=null){
        axios.post('user/load',{})
    }else if(sessionStorage.getItem('customerActive')!=null){
        axios.post('customer/load',{})
    }
};

onMounted(() => {
  checkInterval = setInterval(checkTokenValidity, 60000); // 每1分钟检查一次
});

onUnmounted(() => {
  clearInterval(checkInterval);
});

</script>

<template>
  <Toaster close-button/>
  <div class="w-screen h-screen ">
    <RouterView></RouterView>
  </div>
</template>

<style scoped></style>
