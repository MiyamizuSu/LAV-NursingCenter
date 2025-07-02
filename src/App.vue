<script setup lang="ts">
import { useRouter } from 'vue-router';
import 'vue-sonner/style.css'
import 'element-plus/dist/index.css'
import { Toaster } from 'vue-sonner';

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

</script>

<template>
  <Toaster close-button/>
  <div class="w-screen h-screen ">
    <RouterView></RouterView>
  </div>
</template>

<style scoped></style>
