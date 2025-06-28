import {createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
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
import BedLayoutDiagram from '@/pages/bdm/BedLayoutDiagram.vue'
import BedManagement from '@/pages/bdm/BedManagement.vue'
import CheckOutPage from '@/pages/ctm/CheckOutPage.vue'
import MealCalendar from '@/pages/mlm/MealCalendar.vue'
import MealSet from '@/pages/mlm/MealSet.vue'
import BasicInformationMaintain from '@/pages/usm/BasicInformationMaintain.vue'
import GoOutPage from '@/pages/ctm/GoOutPage.vue'
import NursingRecord2 from '@/pages/hts/NursingRecord.vue'
import DailyNursing from '@/pages/hts/DailyNursing.vue'
import FoodManage from '@/pages/mlm/FoodManage.vue'
import MealReservationManage from '@/pages/mlm/MealReservationManage.vue'
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
        },
        {
            path:'nursingRecord2',
            component:NursingRecord2
        },
        {
            path:'dailyNursing',
            component:DailyNursing
        },
        {
            path:'foodManage',
            component:FoodManage
        },
        {
            path:'mealReservationManage',
            component:MealReservationManage
        }
    ]
    }
]
export const router=createRouter({
    // history:createMemoryHistory(),
    history:createWebHistory(),
    routes
})
