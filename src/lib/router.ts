import { createMemoryHistory, createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import MainPage from '@/pages/MainPage.vue'
import CheckInPage from '@/pages/ctm/CheckInPage.vue'
const routes:RouteRecordRaw[]=[
    {
        path:'/login',component:LoginPage
    },
    {
        path:'/main',component:MainPage,
        children:[{
            path:'checkIn',
            component:CheckInPage,
        }]
    }
]
export const router=createRouter({
    history:createWebHistory(),
    routes
})
