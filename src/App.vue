<script setup lang="ts">
import { useRouter } from 'vue-router';
import 'vue-sonner/style.css'

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
