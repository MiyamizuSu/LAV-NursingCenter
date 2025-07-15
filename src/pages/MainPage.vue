<script setup lang="ts">
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
import AvgTag from '@/components/custom/AvgTag.vue';
import { useRouter } from 'vue-router';
import { Apple, Bed, CircleUserRound, HeartPlus, ShieldUser, SquareActivity } from 'lucide-vue-next';
import type { Key } from '@/lib/type';
import { onMounted, reactive, ref, watch, type Component } from 'vue';
import { axiosInstance as axios } from '@/lib/core'
import { toast } from 'vue-sonner';
import type { sidebarItem } from '@/components/custom/type';
import { ElMessage } from 'element-plus';
type SidebarItem = {
    title: string;
    icon?: Component;
    children?: SidebarItem[];
}
const router = useRouter();
const frameController = reactive({
    frameStack: ['主页'] ,
    curFrameIndex: 0
})
const handleStateCancel = (stateName: string) => {
    const frameStack = frameController.frameStack
    let i = 0;
    for (; i < frameStack.length; i++) {
        const frame = frameStack[i];
        if (frame === stateName) {
            frameStack.splice(i, 1);
            break;
        }
    }
    if (frameController.curFrameIndex === i) {
        frameController.curFrameIndex = i - 1;
        router.push(`/main${stateName_tag.value?.[frameController.frameStack[frameController.curFrameIndex]]}`);
    }
}

const handleStatePlus = (frame: string) => {
    if (frameController.frameStack.includes(frame)) {
        frameController.curFrameIndex = frameController.frameStack.findIndex(f => f === frame);
        router.push(`/main${stateName_tag.value?.[frame]}`)
        return
    }
    frameController.frameStack.push(frame);
    frameController.curFrameIndex = frameController.frameStack.length - 1
    router.push(`/main${stateName_tag.value?.[frame]}`);
}
//To-do customerNursingSet遮挡了顶部状态栏
const handleQuickTap = (frame: string, index: number) => {
    router.push(`/main${stateName_tag.value?.[frame]}`);
    frameController.curFrameIndex = index
}
const logout = () => {
    axios.post("/user/logout", {}).then(res => {
        if (res.data.status == 200) {
            if (sessionStorage.getItem("userType") == '0') {
                localStorage.removeItem("user0")
                localStorage.removeItem('tokenu0')
                localStorage.removeItem("AdminUsing")
            } else if (sessionStorage.getItem("userType") == '1') {
                localStorage.removeItem("user1")
                localStorage.removeItem('tokenu1')
                localStorage.removeItem("NurseUsing")
            }
            sessionStorage.removeItem("userType")
            localStorage.removeItem('isRemember')
            ElMessage({ message: "已退出登录", type: "info" })
            router.push('/home')
        } else {
            ElMessage({ message: res.data.msg, type: "error" })
        }
    })
}

let stateName_tag = ref<{[key:string]:string}>()



let sidebarItems = reactive<SidebarItem[]>([])

const adminState = {
    // 管理员侧边栏
    adminSidebarItems: [
        { title: "首页" },
        {
            title: "客户管理",
            icon: ShieldUser,
            children: [{
                title: "入住登记"
            }, {
                title: "退住登记"
            }, {
                title: '外出登记'
            }]
        },
        {
            title: "床位管理",
            icon: Bed,
            children: [{
                title: "床位示意图"
            },
            {
                title: "床位管理"
            }
            ]
        },
        {
            title: "护理管理",
            icon: SquareActivity,
            children: [{
                title: "护理级别"
            },
            {
                title: "护理项目"
            }, {
                title: "客户护理设置"
            },
            {
                title: "护理记录"
            }
            ]
        },
        {
            title: "膳食管理",
            icon: Apple,
            children: [{
                title: "膳食日历"
            }, {
                title: "膳食配置"
            }, {
                title: "食品管理"
            }, {
                title: "膳食预约管理"
            }]
        },
        {
            title: "健康管家",
            icon: HeartPlus,
            children: [{
                title: "设置服务对象"
            }, {
                title: "服务关注"
            }]
        }
        , {
            title: '用户管理',
            icon: CircleUserRound,
            children: [{
                title: "基础信息维护"
            }]
        }
    ],
    adminStateList: {
        主页: '',
        入住登记: '/checkIn',
        退住登记: '/checkOut',
        外出登记: '/goOut',
        床位示意图: '/bedLayoutDiagram',
        床位管理: '/bedManagement',
        护理级别: '/nursingLevel',
        护理项目: '/nursingPrograms',
        客户护理设置: '/customerNursingSet',
        护理记录: '/nursingRecord',
        膳食日历: '/mealCalendar',
        膳食配置: '/mealSet',
        膳食预约管理: '/mealReservationManage',
        食品管理: '/foodManage',
        设置服务对象: '/serviceObjectSetting',
        服务关注: '/serviceFocus',
        基础信息维护: '/basicInformationMaintain'
    }
}

const nurseState = {
    // 护工侧边栏
    nurseSidebarItems: [
        {
            title: "客户管理",
            icon: ShieldUser,
            children: [
                { title: "外出申请" },
                { title: "退住申请" },
            ]
        },
        {
            title: "健康管理",
            icon: HeartPlus,
            children: [
                { title: "日常护理" },
                { title: "护理记录" },
            ]
        }
    ],
    nurseStateList: {
        主页: '',
        日常护理: '/dailyNursing',
        护理记录: '/nursingRecord2',
        退住申请: '/checkOutApplication',
        外出申请: '/goOutApplication'
    }
}

const isDark = ref(false)
watch(isDark, (newVal) => {
    localStorage.setItem('theme', newVal ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newVal)
})


onMounted(() => {
    const userType = sessionStorage.getItem('userType')
    if (userType === '0') {
        sidebarItems.push(...adminState.adminSidebarItems)
        stateName_tag.value = adminState.adminStateList
    } else if (userType === '1') {
        sidebarItems.push(...nurseState.nurseSidebarItems)
        stateName_tag.value = nurseState.nurseStateList
    }
})
</script>

<template>
    <div class="bg-img h-full flex flex-col">
        <div class="flex backBlur w-full z-1 right-0 justify-end">
            <div class="z-0 flex w-3/4 justify-end">
                <div class="flex justify-between mr-5 w-full">
                    <div class=" h-[3em] flex items-center">
                        <div class=" flex-1 space-x-4 flex">
                            <template v-for="(frame, index) in frameController.frameStack">
                                <AvgTag :tag-name="frame" :is-active="index === frameController.curFrameIndex"
                                    @memory-cancel="handleStateCancel(frame )" :id="frame"
                                    @tap-to-page="handleQuickTap(frame, index)" v-if="frame !== '主页'" />
                            </template>

                        </div>
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
                        <DropdownMenu>
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
                    </div>
                </div>
            </div>
        </div>
        <div class="flex z-10 flex-1">
            <div>
                <SidebarProvider :default-open="false">
                    <AppSideBar :sidebar-items="sidebarItems" application-name="东软颐养" @memory-plus="handleStatePlus" />
                    <main class="h-[30px]">
                        <SidebarTrigger></SidebarTrigger>
                    </main>
                </SidebarProvider>
            </div>
            <RouterView></RouterView>
        </div>
    </div>
</template>
<style lang="css" scoped>
.backBlur {
    backdrop-filter: blur(8px);
}
.bg-img {
    background-image: url('/src/assets/bg_doge.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
</style>
