<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';

const router=useRouter()

const toLogin = () => {
    router.push('/login')
}

</script>

<template>
  <div class="w-screen h-screen overflow-hidden">
    <div style="align-content: center; text-align: center; margin-top: 5vh;">
        <p style="font-size: 18px; font-weight: bold;">您尚未登录或登录已失效！</p>
        <br>
        <p style="margin-top: 1vh;">
            <label>请点击右侧按钮前往登录页面：</label>
            <Button @click="toLogin">登录</Button>
        </p>
    </div>
    
  </div>
</template>

<style scoped>
</style>
