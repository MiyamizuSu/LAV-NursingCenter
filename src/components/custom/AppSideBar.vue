<script setup lang="ts">
import { Apple, Bed, CircleUserRound, HeartPlus, ShieldUser, SquareActivity } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { FunctionalComponent } from "vue";
import SidebarMenuSub from "../ui/sidebar/SidebarMenuSub.vue";
import SidebarMenuSubItem from "../ui/sidebar/SidebarMenuSubItem.vue";
import SidebarMenuSubButton from "../ui/sidebar/SidebarMenuSubButton.vue";
import Collapsible from "../ui/collapsible/Collapsible.vue";
import CollapsibleTrigger from "../ui/collapsible/CollapsibleTrigger.vue";
import CollapsibleContent from "../ui/collapsible/CollapsibleContent.vue";
import Separator from "../ui/separator/Separator.vue";
import { useAppState } from "@/lib/store";
import type { sidebarItem } from "./type";

const emits = defineEmits(['memoryPlus'])
const props=defineProps(['sidebarItems','applicationName'])
const applictionName =props.applicationName
const items: sidebarItem[] = props.sidebarItems
</script>



<template>
  <Sidebar variant="floating">
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>{{ applictionName }}</SidebarGroupLabel>
        <Separator></Separator>
        <SidebarGroupContent>
          <SidebarMenu>
            <Collapsible class="group/collapsible" v-for="item in items" :key="item.title">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild>
                    <div>
                      <component :is="item.icon" />
                      <span>{{ item.title }}</span>
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub v-for="subItem in item.children" :key="subItem.title">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild @click="$emit('memoryPlus', subItem.title)">
                        <div>
                          <span>{{ subItem.title }}</span>
                        </div>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>