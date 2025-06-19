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

const { addState, deleteState,appState } = useAppState()

const handleStateCancel = (stateName: string) => {
    deleteState(stateName)
}
const handleStatePlus=(stateName:string)=>{
    addState(stateName)
}
</script>


<template>
    <div class="flex grid  bg-img">
        <div class="backBlur h-[4em] flex items-center justify-between">
            <div class="translate-x-1/4 flex-1 space-x-4 flex">
                <AvgTag v-for="frame in appState" :tag-name="frame"
                    @memory-cancel="handleStateCancel(frame)" :id="frame" />
            </div>
            <div class="mr-4">
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

        <div class="flow-root">
            <SidebarProvider :default-open="false">
                <AppSideBar @memory-plus="handleStatePlus"/>
                <main class="-translate-y-1/12">
                    <SidebarTrigger></SidebarTrigger>
                </main>
            </SidebarProvider>
        </div>
    </div>
</template>
<style lang="css" scoped>
.backBlur {
    backdrop-filter: blur(8px);
}

.bg-img {
    background-image: url('');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
</style>