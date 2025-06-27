import {createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import MainPage from '@/pages/MainPage.vue'
import CheckInPage from '@/pages/ctm/CheckInPage.vue'
import BedLayoutDiagram from '@/pages/bdm/BedLayoutDiagram.vue'
import BedManagement from '@/pages/bdm/BedManagement.vue'
import CheckOutPage from '@/pages/ctm/CheckOutPage.vue'
import ServiceFocus from '@/pages/htm/ServiceFocus.vue'
import ServiceObjectSetting from '@/pages/htm/ServiceObjectSetting.vue'
import MealCalendar from '@/pages/mlm/MealCalendar.vue'
import MealSet from '@/pages/mlm/MealSet.vue'
import CustomerNursingSet from '@/pages/nsm/CustomerNursingSet.vue'
import NursingLevel from '@/pages/nsm/NursingLevel.vue'
import NursingPrograms from '@/pages/nsm/NursingPrograms.vue'
import NursingRecord from '@/pages/hts/NursingRecord.vue'
import BasicInformationMaintain from '@/pages/usm/BasicInformationMaintain.vue'
import GoOutPage from '@/pages/ctm/GoOutPage.vue'
export const routes:RouteRecordRaw[]=[
    {
        path:'/login',component:LoginPage
    },
    {
        path:'/main',component:MainPage,
        children:[{
            path:'checkIn',
            component:CheckInPage,

        },
        {
            path:'bedLayoutDiagram',
            component:BedLayoutDiagram
        },
        {
            path:'bedManagement',
            component:BedManagement
        },
        {
            path:'checkOut',
            component:CheckOutPage,   
        },
        {
            path:'goOut',
            component:GoOutPage
        },
        {
            path:'serviceFocus',
            component:ServiceFocus,
        },
        {
            path:'serviceObjectSetting',
            component:ServiceObjectSetting,
        },
        {
            path:'mealCalendar',
            component:MealCalendar,
        },
        {
            path:'mealSet',
            component:MealSet,
        },
        {
            path:'customerNursingSet',
            component:CustomerNursingSet,
        },
        {
            path:'nursingLevel',
            component:NursingLevel,
        },
        {
            path:'nursingPrograms',
            component:NursingPrograms,
        },
        {
            path:'nursingRecord',
            component:NursingRecord,
        },
        {
            path:'basicInformationMaintain',
            component:BasicInformationMaintain
        }
    ]
    }
]
export const router=createRouter({
    history:createWebHistory(),
    routes
})
