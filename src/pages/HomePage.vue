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
import { onBeforeUnmount, onMounted, reactive, ref, watch, type Reactive, type Ref } from 'vue';
import { axiosInstance as axios } from '@/lib/core'
import { router } from '@/lib/router';
import Switch from '@/components/ui/switch/Switch.vue';
import Carousel3D from '@/components/custom/Carousel3D.vue';
import { CardContainer, CardBody, CardItem } from "@/components/ui/card-3d";
import FlipCard from '@/components/ui/flip-card/FlipCard.vue';
import Timeline from '@/components/ui/timeline/Timeline.vue';
import AppleCardCarousel from '@/components/ui/apple-card-carousel/AppleCardCarousel.vue';
import AppleCard from '@/components/ui/apple-card-carousel/AppleCard.vue';
import AppleCarouselItem from '@/components/ui/apple-card-carousel/AppleCarouselItem.vue';

const showNavbar = ref(true)  // 顶部导航栏的可见性
let lastScrollY = window.scrollY
const handleScroll = () => {
    const currentY = window.scrollY
    if (currentY > lastScrollY && currentY > 50) {
        showNavbar.value = false // 下滑，隐藏导航
    } else {
        showNavbar.value = true // 上滑，显示导航
    }
    lastScrollY = currentY
}

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
// 入住流程数据
const checkinProcess = [
    {
        id: "consult",
        label: "线上咨询",
    },
    {
        id: "visit",
        label: "参观考察",
    },
    {
        id: "assessment",
        label: "健康评估",
    },
    {
        id: "contract",
        label: "签署合同",
    },
    {
        id: "prepare",
        label: "准备入住",
    },
    {
        id: "movein",
        label: "正式入住",
    },
];
// 入住流程介绍
const checkinDescriptions = {
    consult: "通过电话或官网咨询服务内容和费用，初步了解机构。",
    visit: "安排线下实地参观，了解环境与设施。",
    assessment: "进行长者身体与心理健康评估，量身制定照护方案。",
    contract: "确认入住意向，签署相关入住协议。",
    prepare: "家属协助准备生活用品及入住材料。",
    movein: "长者正式入住，开展个性化照护服务。",
};
// 家属反馈
const reviewData = [
    {
        category: "家属反馈",
        title: "护理人员非常专业，家人很放心。",
        src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        category: "入住体验",
        title: "环境干净整洁，老人住得舒心。",
        src: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // content: <DummyContent />,
    },
    {
        category: "服务评价",
        title: "膳食搭配合理，老人吃得健康。",
        src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // content: <DummyContent />,
    },

    {
        category: "康复训练",
        title: "康复活动丰富，身体状态明显改善。",
        src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        category: "交流互动",
        title: "老人交到了很多朋友，精神状态更好了。",
        src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        category: "医疗保障",
        title: "医疗服务响应及时，给我们一家人吃了定心丸。",
        src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
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

    window.addEventListener('scroll', handleScroll)
})
onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
    <div class="">
        <div class="bg-img relative h-screen w-full bg-cover bg-center">
            <div :class="[
                'flex backBlur w-full z-10 right-0 justify-end fixed top-0 transition-transform duration-300',
                showNavbar ? 'translate-y-0' : '-translate-y-full'
            ]">
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
            <div class="w-full">
                <div class="flex justify-center items-center w-full h-[80%]">
                    <Carousel3D :items="items" :width="600" :height="400"></Carousel3D>
                </div>
                <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-2/5">
                    <CardContainer>
                        <CardBody
                            class="group/card relative size-auto rounded-xl border border-black/[0.1] bg-gray-50 p-6 sm:w-[50rem] h-[40rem] dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]">
                            <CardItem :translate-z="50" class="text-xl font-bold text-neutral-600 dark:text-white">
                                Make things float in air
                            </CardItem>
                            <CardItem as="p" translate-z="60"
                                class="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-300">
                                Hover over this card to unleash the power of CSS perspective
                            </CardItem>
                            <CardItem :translate-z="90" class="mt-4 w-full">
                                <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    height="1000" width="1000"
                                    class="h-100 w-full rounded-xl object-cover group-hover/card:shadow-xl"
                                    alt="thumbnail" />
                            </CardItem>
                            <div class="mt-10 flex justify-center">
                                <CardItem :translate-z="60" as="button" @click="login"
                                    class="rounded-2xl bg-black px-8 py-4 text-lg font-bold text-white dark:bg-white dark:text-black">
                                    立即登入
                                </CardItem>
                            </div>
                        </CardBody>
                    </CardContainer>
                </div>
            </div>
        </div>

        <!-- 服务特色 -->
        <div class="relative bg-white dark:bg-black w-full">
            <div class="max-w-6xl mx-auto px-4">
                <h2 class="text-3xl font-semibold text-center mb-12 text-gray-800 dark:text-white">我们的服务</h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div class="flex items-center justify-center">
                        <FlipCard>
                            <template #default>
                                <img src="https://images.unsplash.com/photo-1525373698358-041e3a460346?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                                    alt="image" class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40" />
                                <div class="absolute bottom-4 left-4 text-xl font-bold text-white">医疗保障</div>
                            </template>
                            <template #back>
                                <div class="flex min-h-full flex-col gap-2">
                                    <h1 class="text-xl font-bold text-white">医疗保障</h1>
                                    <p
                                        class="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">
                                        Inspira UI offers beautifully designed, reusable animation components and
                                        includes
                                        custom components developed by us and contributed by the community.
                                    </p>
                                </div>
                            </template>
                        </FlipCard>
                    </div>
                    <div class="flex items-center justify-center">
                        <FlipCard>
                            <template #default>
                                <img src="https://images.unsplash.com/photo-1525373698358-041e3a460346?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                                    alt="image" class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40" />
                                <div class="absolute bottom-4 left-4 text-xl font-bold text-white">营养配餐</div>
                            </template>
                            <template #back>
                                <div class="flex min-h-full flex-col gap-2">
                                    <h1 class="text-xl font-bold text-white">营养配餐</h1>
                                    <p
                                        class="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">
                                        Inspira UI offers beautifully designed, reusable animation components and
                                        includes
                                        custom components developed by us and contributed by the community.
                                    </p>
                                </div>
                            </template>
                        </FlipCard>
                    </div>
                    <div class="flex items-center justify-center">
                        <FlipCard>
                            <template #default>
                                <img src="https://images.unsplash.com/photo-1525373698358-041e3a460346?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                                    alt="image" class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40" />
                                <div class="absolute bottom-4 left-4 text-xl font-bold text-white">康复活动</div>
                            </template>
                            <template #back>
                                <div class="flex min-h-full flex-col gap-2">
                                    <h1 class="text-xl font-bold text-white">康复活动</h1>
                                    <p
                                        class="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">
                                        Inspira UI offers beautifully designed, reusable animation components and
                                        includes
                                        custom components developed by us and contributed by the community.
                                    </p>
                                </div>
                            </template>
                        </FlipCard>
                    </div>
                    <div class="flex items-center justify-center">
                        <FlipCard>
                            <template #default>
                                <img src="https://images.unsplash.com/photo-1525373698358-041e3a460346?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                                    alt="image" class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40" />
                                <div class="absolute bottom-4 left-4 text-xl font-bold text-white">康复活动</div>
                            </template>
                            <template #back>
                                <div class="flex min-h-full flex-col gap-2">
                                    <h1 class="text-xl font-bold text-white">康复活动</h1>
                                    <p
                                        class="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">
                                        Inspira UI offers beautifully designed, reusable animation components and
                                        includes
                                        custom components developed by us and contributed by the community.
                                    </p>
                                </div>
                            </template>
                        </FlipCard>
                    </div>
                </div>
            </div>
        </div>

        <!-- 入住流程 -->
        <div class="py-20 bg-white dark:bg-black">
            <div class="max-w-4xl mx-auto px-4 text-center">
                <h2 class="text-3xl font-semibold mb-10 text-gray-800 dark:text-white">入住流程</h2>
                <div class="h-fit w-full">
                    <Timeline :items="checkinProcess" description="简单而便捷的入住流程">
                        <template v-for="(item, index) in checkinProcess" :key="item.id + 'template'" #[item.id]>
                            <div class="relative w-full pl-20 pr-4 md:pl-4">
                                <h3
                                    class="mb-4 block text-left text-2xl font-bold text-neutral-500 dark:text-neutral-500">
                                    {{ `步骤 ${index + 1}` }}
                                </h3>
                            </div>
                            <p class="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                                {{ checkinDescriptions[item.id as keyof typeof checkinDescriptions] }}
                            </p>
                        </template>
                    </Timeline>
                </div>
            </div>
        </div>

        <!-- 家属评价 -->
        <div class="py-20 bg-white dark:bg-black">
            <div class="w-full px-4">
                <h2 class="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-10">家属评价</h2>
                <AppleCardCarousel>
                    <AppleCarouselItem v-for="(card, index) in reviewData" :key="index" :index="index">
                        <AppleCard :card="card" :index="index" :layout="true">
                            <div :key="`dummy-content${index}`"
                                class="mb-4 rounded-3xl bg-[#F5F5F7] p-8 md:p-14 dark:bg-neutral-800">
                                <p
                                    class="mx-auto max-w-3xl font-sans text-base text-neutral-600 md:text-2xl dark:text-neutral-400">
                                    <span class="font-bold text-neutral-700 dark:text-neutral-200">
                                        The first rule of Apple club is that you boast about Apple club.
                                    </span>
                                    Keep a journal, quickly jot down a grocery list, and take amazing class notes. Want
                                    to
                                    convert those notes to text? No problem. Langotiya jeetu ka mara hua yaar is ready
                                    to
                                    capture every thought.
                                </p>
                                <img src="https://assets.aceternity.com/macbook.png"
                                    alt="Macbook mockup from Aceternity UI" height="500" width="500"
                                    class="mx-auto size-full object-contain md:size-1/2" />
                            </div>
                        </AppleCard>
                    </AppleCarouselItem>
                </AppleCardCarousel>
            </div>
        </div>
        <!-- 页脚 -->
        <footer class="bg-gray-200 dark:bg-gray-800 py-6 mt-auto">
            <div class="max-w-6xl mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                © 2025 颐养中心. 版权所有. 地址：XX市XX区XX路 联系电话：400-123-4567
            </div>
        </footer>
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