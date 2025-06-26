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
import { useAppState } from '@/lib/store';
import AvgTag from '@/components/custom/AvgTag.vue';
import { onBeforeRouteUpdate, useRouter } from 'vue-router';


const { addState, deleteState, appState } = useAppState()
let appStateCur:Key<typeof STATENAME_TAG>|''=''
const router = useRouter()
//To-do-List
onBeforeRouteUpdate(async (to,from)=>{
    if(from.fullPath==='/main'){
        return true
    }
    if(from.fullPath.includes(STATENAME_TAG[appStateCur]??'12345')){
        return true
    }
    else{
        return false
    }
})
const handleStateCancel = (stateName: Key<typeof STATENAME_TAG>) => {
    deleteState(stateName)
    appStateCur=stateName
    router.push('/main')
}
const handleStatePlus = (stateName:Key<typeof STATENAME_TAG>) => {
    addState(stateName)
    router.push(STATENAME_TAG[stateName]!==undefined?`main/${STATENAME_TAG[stateName]}`:'/main')
}
const STATENAME_TAG={
    '':'',
    入住登记:'checkIn',
    退住登记:undefined
}
</script>


<template>
    <img class="bg-img">
    <div >
        <div class="flex backBlur w-full z-1 right-0 justify-end">
            <div class="z-0 flex w-2/3 justify-end">
                <div class="flex justify-between mr-5 w-full">
                    <div class=" h-[3em] flex items-center">
                        <div class="translate-x-1/4 flex-1 space-x-4 flex">
                            <AvgTag v-for="frame in appState" :tag-name="frame"
                                @memory-cancel="handleStateCancel(frame as Key<typeof STATENAME_TAG>)" :id="frame" />
                        </div>
                    </div>
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
                                <DropdownMenuItem>
                                    <span>退出</span>
                                    <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
        <div class="flex z-10 ">
            <div>
                <SidebarProvider :default-open="false">
                    <AppSideBar @memory-plus="handleStatePlus" />
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
    background-image: url('/src/assets/bg.jpeg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: fixed;  /*将图片固定，不随页面滚动*/
    opacity: 0.3;  /*修改透明度*/
    height: 100%;
    width: 100%;
    z-index: -1;  /*将图片放在最底层*/
}
</style>
