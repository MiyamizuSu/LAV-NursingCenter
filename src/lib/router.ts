import { createMemoryHistory, createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import MainPage from '@/pages/MainPage.vue'
import NursingLevel from '@/pages/nsm/NursingLevel.vue'
import LevelManagePrograms from '@/pages/nsm/LevelManagePrograms.vue'
import NursingPrograms from '@/pages/nsm/NursingPrograms.vue'
import CustomerNursingSet from '@/pages/nsm/CustomerNursingSet.vue'
import CheckInPage from '@/pages/ctm/CheckInPage.vue'
import NursingRecord from '@/pages/nsm/NursingRecord.vue'
import ServiceObjectSetting from '@/pages/htm/ServiceObjectSetting.vue'
import ManageNursingCustomers from '@/pages/htm/ManageNursingCustomers.vue'
import ServiceFocus from '@/pages/htm/ServiceFocus.vue'
import ManageCustomerPrograms from '@/pages/htm/ManageCustomerPrograms.vue'
const routes:RouteRecordRaw[]=[
    {
        path:'/login',component:LoginPage
    },
    {
        path:'/main',component:MainPage,
        children:[
            {
                path:'checkIn',
                component:CheckInPage,
            },
            {
                path: 'nursingLevel',
                component: NursingLevel
            },
            {
                path: 'levelManagePrograms',
                component: LevelManagePrograms
            },
            {
                path: 'nursingPrograms',
                component: NursingPrograms
            },
            {
                path: 'customerNursingSet',
                component: CustomerNursingSet
            },
            {
                path: 'nursingRecord',
                component: NursingRecord
            },
            {
                path: 'serviceObjectSetting',
                component: ServiceObjectSetting
            },
            {
                path: 'manageNursingCustomers',
                component: ManageNursingCustomers
            },
            {
                path: 'serviceFocus',
                component: ServiceFocus
            },
            {
                path: 'manageCustomerPrograms',
                component: ManageCustomerPrograms
            },
        ]
    },
]
export const router=createRouter({
    // history:createMemoryHistory(),
    history:createWebHistory(),
    routes
})
