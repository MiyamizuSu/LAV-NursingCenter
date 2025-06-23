import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import MainPage from '@/pages/MainPage.vue'
import NursingLevel from '@/pages/nsm/NursingLevel.vue'
import LevelManagePrograms from '@/pages/nsm/LevelManagePrograms.vue'
import NursingPrograms from '@/pages/nsm/NursingPrograms.vue'
import CustomerNursingSet from '@/pages/nsm/CustomerNursingSet.vue'
const routes:RouteRecordRaw[]=[
    {
        path:'/login',component:LoginPage
    },
    {
        path:'/main',component:MainPage
    },
    {
        path: '/nursingLevel',
        component: NursingLevel
    },
    {
        path: '/levelManagePrograms',
        component: LevelManagePrograms
    },
    {
        path: '/nursingPrograms',
        component: NursingPrograms
    },
    {
        path: '/customerNursingSet',
        component: CustomerNursingSet
    },
]
export const router=createRouter({
    history:createMemoryHistory(),
    routes
})
