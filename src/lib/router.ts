import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import MainPage from '@/pages/MainPage.vue'
import NursingLevel from '@/pages/nsm/NursingLevel.vue'
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
    }
]
export const router=createRouter({
    history:createMemoryHistory(),
    routes
})
