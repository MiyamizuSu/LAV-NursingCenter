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
import { motion } from 'motion-v'
import DynamicButton from '@/components/custom/DynamicButton.vue';

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
    console.log(1234)
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
    consult: "通过电话或官网咨询服务内容，了解机构整体情况。",
    visit: "安排前往机构现场参观，熟悉环境和服务设施。",
    assessment: "对长者身体心理健康评估，制定专属照护方案。",
    contract: "明确服务内容与收费标准，正式签署入住协议。",
    prepare: "家属协助准备个人物品，整理相关入住材料。",
    movein: "长者正式入住机构生活，接受个性化照护服务。",
};
// 家属反馈
const reviewData = [
    {
        category: "家属反馈",
        title: "护理人员非常专业，家人很放心。",
        src: "/src/assets/home/feedback.jpg",
    },
    {
        category: "入住体验",
        title: "环境干净整洁，老人住得舒心。",
        src: "/src/assets/home/room.jpg",
        // content: <DummyContent />,
    },
    {
        category: "服务评价",
        title: "膳食搭配合理，老人吃得健康。",
        src: "/src/assets/home/food.jpg",
        // content: <DummyContent />,
    },

    {
        category: "康复训练",
        title: "康复活动丰富，身体状态明显改善。",
        src: "/src/assets/home/recover.jpg",
    },
    {
        category: "交流互动",
        title: "老人交到了很多朋友，精神状态更好了。",
        src: "/src/assets/home/communication.jpg",
    },
    {
        category: "医疗保障",
        title: "医疗服务响应及时，给我们一家人吃了定心丸。",
        src: "/src/assets/home/emt.jpg",
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
                'flex backBlur w-full z-10 right-0 justify-end fixed top-0 items-center transition-transform duration-300',
                showNavbar ? 'translate-y-0' : '-translate-y-full'
            ]">
            
                <div class="ml-10 text-lg font-bold text-white dark:text-black">
                    东软颐养中心
                </div>
                <div class="flex-1"></div>
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
                <!-- <div class="flex justify-center items-center w-full h-[80%]">
                    <Carousel3D :items="items" :width="600" :height="400"></Carousel3D>
                </div> -->
                <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <CardContainer>
                        <CardBody
                            class="group/card relative size-auto rounded-xl border border-black/[0.1] p-6 sm:w-[50rem] h-[40rem] dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] bg-img-1">
                            <CardItem :translate-z="50"
                                class="text-xl font-bold text-neutral-600 dark:text-white text-white">
                                欢迎来到东软颐养中心
                            </CardItem>
                            <CardItem as="p" translate-z="60"
                                class="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-300 text-white">
                                我们致力于为长者提供温馨、安全、智能的颐养服务，开启智慧养老新体验。
                            </CardItem>
                            <CardItem :translate-z="90" class="mt-4 w-full">
                                <img src="/src/assets/home/floatCard.jpg" height="1000" width="1000"
                                    class="h-100 w-full rounded-xl object-cover group-hover/card:shadow-xl"
                                    alt="thumbnail" />
                            </CardItem>
                            <div class="mt-10 flex justify-center">
                                <CardItem :translate-z="60" as="button" @click.stop="login" class="rounded-2xl bg-[#769fcd] px-8 py-4 text-lg font-bold text-white dark:bg-white
                                        dark:text-black">
                                    立即登入
                                </CardItem>
                            </div>
                        </CardBody>
                    </CardContainer>
                </div>
            </div>
        </div>

        <div class="bg-gray-100">
            <!-- 服务特色 -->
            <div class="relative dark:bg-black w-full">
                <div class="max-w-6xl mx-auto px-4">
                    <p>&nbsp</p>
                    <div class="flex items-center justify-center mt-10">
                        <h2 class="text-3xl font-semibold text-center mb-12 text-gray-800 dark:text-white ">我们的服务</h2>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div class="flex items-center justify-center">
                            <FlipCard>
                                <template #default>
                                    <img src="/src/assets/home/medical.jpg" alt="image"
                                        class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40" />
                                    <div class="absolute bottom-4 left-4 text-xl font-bold text-white">医疗保障</div>
                                </template>
                                <template #back>
                                    <div class="flex min-h-full flex-col gap-2">
                                        <h1 class="text-xl font-bold text-white">医疗保障</h1>
                                        <p
                                            class="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">
                                            配备专业医疗团队，24小时健康守护，定期体检、慢病管理、用药指导，全方位保障长者身体健康。
                                        </p>
                                    </div>
                                </template>
                            </FlipCard>
                        </div>
                        <div class="flex items-center justify-center">
                            <FlipCard>
                                <template #default>
                                    <img src="/src/assets/home/nutrition.jpg" alt="image"
                                        class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40" />
                                    <div class="absolute bottom-4 left-4 text-xl font-bold text-white">营养配餐</div>
                                </template>
                                <template #back>
                                    <div class="flex min-h-full flex-col gap-2">
                                        <h1 class="text-xl font-bold text-white">营养配餐</h1>
                                        <p
                                            class="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">
                                            营养师科学配餐，定制个性化膳食方案，确保每一餐兼顾健康与口味，让长者吃得放心、吃得舒心。
                                        </p>
                                    </div>
                                </template>
                            </FlipCard>
                        </div>
                        <div class="flex items-center justify-center">
                            <FlipCard>
                                <template #default>
                                    <img src="/src/assets/home/rehabilitation.jpg" alt="image"
                                        class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40" />
                                    <div class="absolute bottom-4 left-4 text-xl font-bold text-white">康复活动</div>
                                </template>
                                <template #back>
                                    <div class="flex min-h-full flex-col gap-2">
                                        <h1 class="text-xl font-bold text-white">康复活动</h1>
                                        <p
                                            class="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">
                                            提供多样康复训练与文体活动，涵盖手工、书画、健身操等，丰富日常生活，促进身心健康。
                                        </p>
                                    </div>
                                </template>
                            </FlipCard>
                        </div>
                        <div class="flex items-center justify-center">
                            <FlipCard>
                                <template #default>
                                    <img src="/src/assets/home/psychological.jpg" alt="image"
                                        class="size-full rounded-2xl object-cover shadow-2xl shadow-black/40" />
                                    <div class="absolute bottom-4 left-4 text-xl font-bold text-white">心理关怀</div>
                                </template>
                                <template #back>
                                    <div class="flex min-h-full flex-col gap-2">
                                        <h1 class="text-xl font-bold text-white">心理关怀</h1>
                                        <p
                                            class="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">
                                            设有心理辅导、陪伴交流、亲情视频等关爱服务，关注长者心理健康，让每一位长者都感受到温暖与尊重。
                                        </p>
                                    </div>
                                </template>
                            </FlipCard>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 入住流程 -->
            <div class="py-20 dark:bg-black">
                <div class="max-w-4xl mx-auto px-4 text-center">
                    <h2 class="text-3xl font-semibold mb-10 text-gray-800 dark:text-white">入住流程</h2>
                    <div class="h-fit w-full">
                        <Timeline :items="checkinProcess">
                            <template v-for="(item, index) in checkinProcess" :key="item.id + 'template'" #[item.id]>
                                <div class="relative w-full pl-20 pr-4 md:pl-4 ">
                                    <div class="flex">
                                        <h3
                                            class="mb-4 block text-left text-2xl font-bold text-neutral-500 dark:text-neutral-500">
                                            {{ `步骤 ${index + 1}` }}
                                        </h3>
                                    </div>

                                </div>
                                <p
                                    class="text-left mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                                    {{ checkinDescriptions[item.id as keyof typeof checkinDescriptions] }}
                                </p>
                            </template>
                        </Timeline>
                    </div>
                </div>
            </div>

            <!-- 家属评价 -->
            <div class="py-20 dark:bg-black">
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
                                        Keep a journal, quickly jot down a grocery list, and take amazing class notes.
                                        Want
                                        to
                                        convert those notes to text? No problem. Langotiya jeetu ka mara hua yaar is
                                        ready
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
    background-image: url('/src/assets/home/home.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.bg-img-1 {
    background-image: url('/src/assets/home/fall.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
</style>