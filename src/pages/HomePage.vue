<!-- 系统首页 -->
<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import AppSideBar from '@/components/custom/AppSideBar.vue';
import SidebarProvider from '@/components/ui/sidebar/SidebarProvider.vue';
import SidebarTrigger from '@/components/ui/sidebar/SidebarTrigger.vue';
import Avatar from '@/components/ui/avatar/Avatar.vue';
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue';
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue';
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue';
import DropdownMenuLabel from '@/components/ui/dropdown-menu/DropdownMenuLabel.vue';
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuSeparator from '@/components/ui/dropdown-menu/DropdownMenuSeparator.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuShortcut from '@/components/ui/dropdown-menu/DropdownMenuShortcut.vue';
import DropdownMenuGroup from '@/components/ui/dropdown-menu/DropdownMenuGroup.vue';
// import { useAppState } from '@/lib/store';
import AvgTag from '@/components/custom/AvgTag.vue';
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Apple, Bed, CircleUserRound, HeartPlus, ShieldUser, SquareActivity } from 'lucide-vue-next';
import type { Key } from '@/lib/type';
import { onMounted, reactive, ref, watch, type Reactive, type Ref } from 'vue';
import { axiosInstance as axios } from '@/lib/core'
import { router } from '@/lib/router';
import Switch from '@/components/ui/switch/Switch.vue';
import Carousel3D from '@/components/custom/Carousel3D.vue';
import { CardContainer, CardBody, CardItem } from "@/components/ui/card-3d";

const login = () => {
    router.push('/login')
}
const isLogin = ref(false)
const logout = () => {
    axios.post("/user/logout", {}).then(res => {
        if (res.data.status == 200) {
            sessionStorage.removeItem("token")
            ElMessage({ message: "已退出登录", type: "info" })
            router.push('/home')
        } else {
            ElMessage({ message: res.data.msg, type: "error" })
        }
    })
}
const isDark = ref(false)
watch(isDark, (newVal) => {
    localStorage.setItem('theme', newVal ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newVal)
})

const items = [
    // "/src/assets/bg.jpeg",
    // "/src/assets/bg.jpeg",
    // "/src/assets/bg.jpeg",
    // "/src/assets/bg.jpeg",
    // "/src/assets/bg.jpeg",
    // "/src/assets/bg.jpeg",
    // "/src/assets/bg.jpeg",
    // "/src/assets/bg.jpeg",
    // "/src/assets/bg.jpeg",
    "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/16245254/pexels-photo-16245254/free-photo-of-chatgpt-a-chatbot-for-your-website.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1910236/pexels-photo-1910236.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/2333293/pexels-photo-2333293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/604684/pexels-photo-604684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/3308588/pexels-photo-3308588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/2860807/pexels-photo-2860807.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

onMounted(() => {
    if (sessionStorage.getItem("token")) {
        isLogin.value = true
    } else {
        isLogin.value = false
    }
    const savedTheme = localStorage.getItem('theme')
    isDark.value = savedTheme === 'dark'
    document.documentElement.classList.toggle('dark', isDark.value)
})
</script>

<template>
    <div class="bg-img h-full flex flex-col">
        <div class="flex backBlur w-full z-10 right-0 justify-end">
            <div class="z-0 flex  justify-end">
                <div class="flex justify-between mr-5 w-full">
                    <div class=" h-[3em] flex items-center">
                        <div class=" flex-1 space-x-4 flex">
                        </div>
                        <div class="flex items-center space-x-2">
                            <Switch v-model="isDark">
                                <template #thumb>
                                    <div class="flex items-center justify-center w-full h-full">
                                        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-moon-icon lucide-moon size-3">
                                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                                        </svg>
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="lucide lucide-sun-medium-icon lucide-sun-medium size-3">
                                            <circle cx="12" cy="12" r="4" />
                                            <path d="M12 3v1" />
                                            <path d="M12 20v1" />
                                            <path d="M3 12h1" />
                                            <path d="M20 12h1" />
                                            <path d="m18.364 5.636-.707.707" />
                                            <path d="m6.343 17.657-.707.707" />
                                            <path d="m5.636 5.636.707.707" />
                                            <path d="m17.657 17.657.707.707" />
                                        </svg>
                                    </div>
                                </template>
                            </Switch>
                            <DropdownMenu v-if="isLogin">
                                <DropdownMenuTrigger>
                                    <Avatar>
                                        <AvatarFallback>
                                            头像
                                        </AvatarFallback>
                                        <AvatarImage src="">
                                        </AvatarImage>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>个人资料</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <span>档案</span>
                                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span>设置</span>
                                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="logout">
                                            <span>退出</span>
                                            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu v-else>
                                <DropdownMenuTrigger>
                                    <Avatar>
                                        <AvatarFallback class="text-xs">
                                            未登录
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem @click="login">
                                            <span>登录</span>
                                            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="flex justify-center items-center w-full h-[70%]">
                <Carousel3D :items="items" :width="600" :height="400"></Carousel3D>
            </div>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <CardContainer class="">
                    <CardBody
                        class="group/card relative size-auto rounded-xl border border-black/[0.1] bg-gray-50 p-6 sm:w-[30rem] dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]">
                        <CardItem :translate-z="50" class="text-xl font-bold text-neutral-600 dark:text-white">
                            Make things float in air
                        </CardItem>
                        <CardItem as="p" translate-z="60"
                            class="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-300">
                            Hover over this card to unleash the power of CSS perspective
                        </CardItem>
                        <CardItem :translate-z="100" class="mt-4 w-full">
                            <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                height="1000" width="1000"
                                class="h-60 w-full rounded-xl object-cover group-hover/card:shadow-xl"
                                alt="thumbnail" />
                        </CardItem>
                        <!-- <div class="mt-20 flex items-center justify-between">
                            <CardItem :translate-z="20" as="a" href="https://rahulv.dev" target="__blank"
                                class="rounded-xl px-4 py-2 text-xs font-normal dark:text-white">
                                Visit →
                            </CardItem>
                            <CardItem :translate-z="20" as="button"
                                class="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-black">
                                Get Started
                            </CardItem>
                        </div> -->
                    </CardBody>
                </CardContainer>
            </div>
        </div>

    </div>

</template>

<style lang="css" scoped>
.backBlur {
    backdrop-filter: blur(8px);
}

.bg-img {
    background-image: url('/src/assets/bg.jpeg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
</style>