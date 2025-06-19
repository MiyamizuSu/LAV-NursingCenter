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

const emits=defineEmits(['memoryPlus'])

type siderbarItem = {
  title: string,
  icon?: FunctionalComponent
  children?: siderbarItem[]
}
const applictionName = "东软颐养"
const items: siderbarItem[] = [
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
];
</script>



<template>
  <Sidebar variant="floating">
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>{{ applictionName }}</SidebarGroupLabel>
        <Separator></Separator>
        <SidebarGroupContent>
          <SidebarMenu>
            <Collapsible  class="group/collapsible" v-for="item in items" :key="item.title" >
            <SidebarMenuItem >
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
                    <SidebarMenuSubButton asChild @click="$emit('memoryPlus',subItem.title)">
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