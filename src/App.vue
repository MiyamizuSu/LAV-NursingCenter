<script setup lang="ts">
import { useRouter } from 'vue-router';
import 'vue-sonner/style.css'

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
      <CheckOut></CheckOut>
    </SidebarProvider>
  </div>
</template>

<style scoped>
</style>
