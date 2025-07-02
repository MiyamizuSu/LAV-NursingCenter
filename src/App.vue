<script setup lang="ts">
import { useRouter } from 'vue-router';
import 'vue-sonner/style.css'
import 'element-plus/dist/index.css'
import { Toaster } from 'vue-sonner';

const router=useRouter()
// router.push('/login')
router.push('/main')

</script>

<template>
  <Toaster close-button/>
  <div class="w-screen h-screen ">
    <RouterView></RouterView>
  </div>
</template>

<style scoped>
</style>
